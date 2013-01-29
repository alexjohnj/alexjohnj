#! /usr/local/bin/python3

""" Requirements: PyYaml library, s3cmd, jekyll, gzip & sass. 

To use, you'll need to edit your site's _config.yml file and add the following:

s3bucket: s3://bucket-name

Remember to change the path_to_sass_file & sass_compile_path variables if you want to compile sass files. If you don't want to compile sass files, comment out the call to the compile_sass() function.

"""

import gzip
import os
from subprocess import PIPE, check_call, CalledProcessError
from sys import exit

def get_s3_bucket_name():
    with open("_config.yml") as f:
        for line in f:
            if line.split(':')[0] == "s3bucket":
                return line.strip("s3bucket:").strip()
        exit("Error: No bucket was found in the site's _config.yml file")
        
def compile_sass(input_file, output_file, minify=True):
    """ Runs sass on the input file and outputs it to the output file. 
    
    Keyword Arguments:
    
    input_file -- the path to the .scss file
    output_file -- the path to the .css file
    minify -- if True (default), outputted css is minified
              if False, no minification takes place on the css
              
    Returns: None
    
    """
    command = "sass " + path_to_sass_file + ":" + sass_compile_path
    if minify:
        command = command + " --style compressed"
    try:
        check_call(command, shell=True)
    except CalledProcessError:
        print("Something went wrong compiling sass files.")
        
def generate_site():
    """ Runs jekyll --no-auto to generate the site.
    
    Returns: None
    
    """    
    try:
        check_call(["jekyll", "--no-auto"], stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong generating the site with Jekyll.")
        
def gzip_files():
    for root, dirs, files in os.walk("_site/"): # Traverse the _site/ directory
        for f in files:
            filename, extension = os.path.splitext(f) # Get the extension of the current file
            if extension == ".html" or extension == ".css" or extension == ".js": # Check to see if it's a compressible extension
                with open(os.path.join(root, f), 'r') as f_to_compress: # Open the file
                    with gzip.open(os.path.join(root, f) + ".gz", 'wb') as f_compressed: # Open a new gzip file
                        f_compressed.writelines(f_to_compress) # Write the original file into the gzip file
                os.remove(os.path.join(root, f)) # Remove the original file. 
                os.rename(os.path.join(root, f) + ".gz", os.path.join(root, f)) # Rename file to original
            
        
def deploy_to_s3(bucket, dry=False):
    """ Runs s3cmd sync -P _site/ s3://bucket-name to deploy the site to Amazon S3
    
    Key Arguments:
    
    bucket -- The name of the s3 bucket to upload to in the format s3://bucket-name
    dry -- if False (default), The site is deployed to the s3 bucket
           if True, The result of uploading the site to the s3 bucket is shown but no files are actually uploaded 
    
    Returns: None
    
    """
    if dry:
        print("DOING DRY RUN")
        
    try: # Upload all uncompressed files
        command = ""
        if not dry:
            command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ " + bucket
        else:
           command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ --dry-run " + bucket 
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong deploying the site to s3.")
    
    try: # Upload all compressed files and add an appropriate header
        command = ""
        if not dry:
            command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' _site/ " + bucket
        else:
            command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' --dry-run _site/ " + bucket
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong setting the content encoding on the files deployed to s3")

    try:
        command = ""
        if not dry:
            command = "s3cmd sync -P --delete-removed _site/ " + bucket
        else:
            command = "s3cmd sync -P --delete-removed --dry-run _site/ " + bucket
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong removing files from the bucket")

if __name__ == "__main__":
    
    path_to_sass_file = "assets/styles/sass/styles.scss" # Change to your path
    sass_compile_path = "assets/styles/css/styles.css" # Change to your path
    
    print("Compiling Sass Files...")
    compile_sass(path_to_sass_file, sass_compile_path, minify=True) # Comment out this line if you don't want to compile any sass files
    
    print("Running Jekyll...")
    generate_site()
    
    print("Gzipping File...")
    gzip_files()
    
    print("Getting Bucket Name...")
    bucket_name = get_s3_bucket_name()
        
    print("Deploying to %s..." % bucket_name)
    deploy_to_s3(bucket_name, dry=False)
    print("Successfully Deployed Site!")