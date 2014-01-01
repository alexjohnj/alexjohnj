---
title: S3 Deployment Script Mk 2
layout: post
date: 2013-02-17 16:16
---

Since releasing the first version of the script I use to deploy this blog to S3, I've iterated on the script a little bit and made a few changes. Most of the changes in version 2 of the script are syntax changes to the script itself that make it a little bit easier to read[^1] however there are a couple of functionality changes.

The biggest change is the introduction of command line flags. Three flags have been added, `-b`, `-s` and `-n`. These tell the script to not minify sass files, not compile sass files and to perform a dry run respectively. The first two flags speak for themselves while the third, the dry run flag, simply means that the site will be generated as usual but it won't be deployed to S3. It's akin to running `s3cmd sync --dry-run src/ s3://bucket`. 

Another new ‘feature’ is a countdown that is performed before deploying to S3. After generating the site, the script waits three second before pushing the generated site giving you opportunity to cancel the deployment if you forgot to pass the `-n` flag or realise that you're (somehow) deploying to the wrong bucket. I'm sure some people aren't going to like this but seriously, what's waiting 3 seconds compared to the time it'd take to fix the mess after deploying your testing site to the wrong bucket?

A couple of the smaller changes to the script relate to Python 3 compatibility. I've removed the dependency on PyYaml since it isn't compatible with Python 3 and it was a bit of an overkill to get just one line out of the `_config.yml` file. In addition, I've fixed a crash that would occur when gzipping files and the script is run under Python 3.

The updated script is below and you can also find the script as a [gist on GitHub][script-github]. 

{% highlight python %}

#! /usr/local/bin/python3

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
        
def deploy_to_s3_bucket(bucket, dry_run=False):
    if dry_run:
        print("Doing a dry run!")

    try: # Upload all uncompressed files
        command = "s3cmd sync -P --exclude '*.html' --exclude '*.js' --exclude '*.css' _site/ " + bucket
        if dry_run:
            command_ls = command.split()
            command_ls.insert(-2, "--dry-run")
            command = ' '.join(command_ls)

        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong deploying the site to s3.")
    
    try: # Upload all compressed files and add an appropriate header
        command = "s3cmd sync -P --add-header='Content-Encoding: gzip' --exclude '*.*' --include '*.html' --include '*.js' --include '*.css' _site/ " + bucket
        if dry_run:
            command_ls = command.split()
            command_ls.insert(-2, "--dry-run")
            command = ' '.join(command_ls)

        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong setting the content encoding on the files deployed to s3")

    try: # Remove any files that have been deleted
        command = "s3cmd sync -P --delete-removed _site/ " + bucket
        if dry_run:
            command_ls = command.split()
            command_ls.insert(-2, "--dry-run")
            command = ' '.join(command_ls)
        check_call(command, shell=True, stdout=PIPE)
    except CalledProcessError:
        exit("Something went wrong removing files from the bucket")

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Deploy a Jekyll site to Amazon S3")
    parser.add_argument('-s', '--no-sass', help="Don't compile Sass files", action='store_true')
    parser.add_argument('-b', '--beautiful-sass', help="Don't minify Sass files", action='store_false')
    parser.add_argument('-n', '--dry-run', help="Perform a dry run when deploying to S3 (akin to running s3cmd with the --dry-run flag)", action='store_true')
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
    deploy_to_s3_bucket(bucket_name, dry_run=args.dry_run)
    print("Successfully Deployed Site!")


{% endhighlight %}

[^1]: At the same time, I've removed half of the comments in the script because most of them were `#increment i by one` style comments. 

[script-github]: https://gist.github.com/alexjohnj/4559517