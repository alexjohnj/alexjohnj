#! /usr/local/bin/python3

import subprocess
import sys
import gzip
import os

try:
    import yaml
except ImportError:
    sys.exit("The PyYaml library isn't available. Please run 'pip install pyyaml' to install it.")
    
path_to_sass_file = "assets/styles/sass/styles.scss"
sass_compile_path = "assets/styles/css/styles.css"

def print_message(message):
    """ Prints a string with n asterixes above and below it where n is the length of the string.
    
    Keyword Arguments:
    
    message -- The string to print
    
    Returns: None
    
    """
    length = len(message)
    print(length*'*' + "\n" + message + "\n" + length*'*')

def get_s3_bucket_name():
    """ Opens an _config.yml file that is in the root of the directory that the script is in and returns the value of the s3bucket key.
    
    Returns: String 
    
    """
    try:
        with open("_config.yml") as f:
            config_file = yaml.load(f)
            try:
                return config_file["s3bucket"]
            except KeyError:
                sys.exit("Error, no S3 bucket was specified in _config.yml. Make sure you add a 's3bucket' key to your _config.yml file.")
                
    except IOError as e:
        sys.exit("I/O error({0}): {1}".format(e.errno, e.strerror))
        
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
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError:
        print("Something went wrong compiling your sass files.")
        
def generate_site():
    """ Runs jekyll --no-auto to generate the site.
    
    Returns: None
    
    """    
    try: 
        subprocess.check_call(["jekyll", "--no-auto"])
    except subprocess.CalledProcessError:
        sys.exit("Something went wrong generating the site with Jekyll.")
        
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
    try: # Upload all uncompressed files
        print("Uploading uncompressed files")
        command = ""
        if not dry:
            command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ " + bucket
        else:
           command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ --dry-run " + bucket 
        subprocess.call(command, shell=True)
    except subprocess.CalledProcessError:
        sys.exit("Something went wrong deploying the site to s3.")
    
    try: # Upload all compressed files and add an appropriate header
        print("Uploading compressed files")
        command = ""
        if not dry:
            command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' _site/ " + bucket
        else:
            command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' --dry-run _site/ " + bucket
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError:
        sys.exit("Something went wrong setting the content encoding on the files deployed to s3")

    try:
        print("Removing any files not present in _site/ from the bucket")
        command = ""
        if not dry:
            command = "s3cmd sync -P --delete-removed _site/ " + bucket
        else:
            command = "s3cmd sync -P --delete-removed --dry-run _site/ " + bucket
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError:
        sys.exit("Something went wrong removing files from the bucket")

if __name__ == "__main__":
    global path_to_sass_file, sass_compile_path
    
    if len(path_to_sass_file) > 0 or len(sass_compile_path) > 0:
        print_message("Compiling Sass Files.")
        compile_sass(path_to_sass_file, sass_compile_path, minify=True)
    
    print_message("Running Jekyll.")
    generate_site()
    
    print_message("Gzipping File")
    gzip_files()
    
    print_message("Getting Bucket Name")
    bucket_name = get_s3_bucket_name()
    print_message("Success, will upload to bucket \033[94m%s\033[0m" % bucket_name)
    
    print_message("Deploying to s3")
    deploy_to_s3(bucket_name, dry=True)
    print_message("Successfully Deployed Site")
