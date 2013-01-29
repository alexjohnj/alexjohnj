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
from time import sleep
import argparse

def get_s3_bucket_name():
    with open("_config.yml") as f:
        for line in f:
            if line.split(':')[0] == "s3bucket":
                return line.strip("s3bucket:").strip()
        exit("Error: No bucket was found in the site's _config.yml file")
        
def compile_sass(input_file, output_file, minify=True):
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
            if os.path.splitext(f)[1] in ['.html', '.css', '.js']:
                current_path = os.path.join(root, f)
                with open(current_path, 'rb') as f_in:
                    with gzip.open(current_path + '.gz', 'wb') as f_out:
                        f_out.writelines(f_in)
                os.replace(current_path + '.gz', current_path)
        
def deploy_to_s3_bucket(bucket):
    try: # Upload all uncompressed files
        command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ " + bucket
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong deploying the site to s3.")
    
    try: # Upload all compressed files and add an appropriate header
        command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' _site/ " + bucket
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong setting the content encoding on the files deployed to s3")

    try: # Remove any files that have been deleted
        command = "s3cmd sync -P --delete-removed _site/ " + bucket
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong removing files from the bucket")

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Deploy a Jekyll site to Amazon S3")
    parser.add_argument('-ns', '--no-sass', help="Don't compile Sass files", action='store_true')
    parser.add_argument('-bs', '--beautiful-sass', help="Don't minify Sass files", action='store_false')
    args = parser.parse_args()

    path_to_sass_file = "assets/styles/sass/styles.scss" # Change to your path
    sass_compile_path = "assets/styles/css/styles.css" # Change to your path

    if args.no_sass == False:
        print("Compiling Sass Files...")
        compile_sass(path_to_sass_file, sass_compile_path, minify=args.beautiful_sass)
    
    print("Running Jekyll...")
    generate_site()
    
    print("Gzipping File...")
    gzip_files()
    
    print("Getting Bucket Name...")
    bucket_name = get_s3_bucket_name()

    for i in reversed(range(1,4)):
        print("\rDeploying to {0} in {1}".format(bucket_name, i), end='')
        sleep(1)

    print("\nDeploying...")
    deploy_to_s3_bucket(bucket_name)
    print("Successfully Deployed Site!")
