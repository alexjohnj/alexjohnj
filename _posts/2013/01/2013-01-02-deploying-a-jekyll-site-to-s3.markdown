---
title: Deploying a Jekyll Site to S3
layout: post
---

As the website’s footer says, this site is powered by Jekyll, a static website generator. As the footer doesn’t say, this site is hosted on Amazon’s Simple Storage Service (aka, S3) an ultra-cheap, reliable and fast storage service. As every single person who hosts a Jekyll blog on Amazon S3 does, I’ve written a post about how I go about deploying this website onto S3, this post. 

My deployment strategy involves compiling some [sass][sass-project-page] files, generating the website, minifying any files that can be minified, compressing any files that can be compressed and then syncronising the generated site with the copy I have on S3. This deployment method relies on several applications and carrying it out manually is both long and error prone since I have to remember and enter many different commands into terminal. To simplify the deployment of the site, I wrote a small Python script which I’d like to share.

The script compiles a minified version of my sass files, generates the website, compresses HTML, CSS and JavaScript files with gzip and then synchronises the generated site with the Amazon S3 bucket in the site’s configuration file using [s3cmd][s3cmd-project-page]. I use a couple of plugins with Jekyll too to minify any HTML generated and to generate a sitemap. Here’s the script:

{% highlight python %}

#! /usr/local/bin/python3

import yaml
import gzip
import os
from subprocess import PIPE, check_call, CalledProcessError
from sys import exit

def print_message(message):
    print("\\033[94m" + message + "\\033[0m")

def get_s3_bucket_name():
    try:
        with open("_config.yml") as f:
            config_file = yaml.load(f)
            try:
                return config_file["s3bucket"]
            except KeyError:
                exit("Error, no S3 bucket was found in _config.yml.")

    except IOError as e:
        exit("I/O error({0}): {1}".format(e.errno, e.strerror))

def compile_sass(input_file, output_file, minify=True):
    command = "sass " + path_to_sass_file + ":" + sass_compile_path
    if minify:
        command = command + " --style compressed"
    try:
        check_call(command, shell=True)
    except CalledProcessError:
        print("Something went wrong compiling sass files.")

def generate_site(): 
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

    path_to_sass_file = "assets/styles/sass/styles.scss"
    sass_compile_path = "assets/styles/css/styles.css"

    print_message("Compiling Sass Files...")
    compile_sass(path_to_sass_file, sass_compile_path, minify=True)

    print_message("Running Jekyll...")
    generate_site()

    print_message("Gzipping File...")
    gzip_files()

    print_message("Getting Bucket Name...")
    bucket_name = get_s3_bucket_name()

    print_message("Deploying to %s..." % bucket_name)
    deploy_to_s3(bucket_name, dry=False)
    print_message("Successfully Deployed Site!")
  
{% endhighlight %}

Please don’t judge my Python skills, I’m relatively new to the language still. 

To use the script, you'll need to install a few things. You'll need to install the [PyYaml][pyyaml-project-page] library, [s3cmd][s3cmd-project-page] and gzip. You'll also need to edit your _config.yml file and add the following line to it:

{% highlight yaml %}
s3bucket:    s3://bucket-name
{% endhighlight %}

Obviously replace bucket-name with the name of the bucket you're uploading to. If you don't need to compile any sass files, just comment out the 6th line of the main function. I'm going to put a gist of the YOU KNOW WHAT, JUST DO A GIST, DON'T EMBED!!

[jekyll-github-page]: get it
[sass-project-page]: http://sass-lang.org !WRONG
[s3cmd-project-page]: get it again
[pyyaml-project-page]: sigh

