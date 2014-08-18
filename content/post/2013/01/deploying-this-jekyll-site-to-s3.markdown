+++
title = "Deploying This Jekyll Site to S3"
date = "2013-01-17T21:22:00Z"
syntax_highlighting = true
+++

If you’re the type of person who likes to read the footers of websites (who doesn’t?) you’ll have seen that this website is "powered” by Jekyll. In case you haven’t heard, Jekyll is a static site generator that is especially useful for generating static blogs. That is, you run the Jekyll program on a computer, point it at a “source” directory for your website and let it generate a load of HTML files that you can upload to practically any web server that serves files. There’s no need to install PHP or Rails and no need to get a fancy server that can run them. Jekyll is a really awesome utility and that is a terrible description of what it does. You’re better off checking out the [GitHub page][jekyll-github-page] and seeing how that describes Jekyll.

The purpose of this post isn’t to describe what Jekyll is though, it’s to tell you how I deploy this blog that is built with Jekyll to Amazon S3. As a lot of people have written, Amazon S3 is a great place to host small Jekyll blogs. It’s cheap, it’s fast and it has an exceptionally good uptime. 

Deploying a Jekyll blog to Amazon S3 is relatively straightforward by using a tool called [s3cmd][s3cmd-project-page]. s3cmd is a powerful tool that provides a good, command line method for synchronising a directory with a bucket on Amazon S3. While running s3cmd on your generated site will produce a website that’s hosted on S3 (once you’ve set up permissions, DNS etc.) there’s a few things that can be done to optimise your website and make it a bit faster.

You can run gzip to compress all your CSS, HTML & JavaScript files but in order to serve these files, you’ll need to specify the correct content encoding on the compressed files otherwise browsers won’t render your pages. You can also run CSS & JavaScript minification, heck, you can even run HTML minification if you’re desperate to squeeze some speed out of your site. The problem is, running all of these processes requires you to remember a lot of different and complicated commands. Even if you have the memory of a [sea lion][sea-lion-memory], running all these commands makes deploying your site slow and tedious. I’ve gone ahead and written a script that combines all the commands I need for deploying my website and I thought I would share it with the world.

The script is written in Python because I don’t know any other scripting languages that well. I don’t know Python that well too but it’s the scripting language I’m most confident in. The script does a couple of things. The first thing it does is compile any sass files that need to be compiled and minifies the resulting CSS file. This is (possibly) quite specific to my website since not all Jekyll sites are going to use sass (though I do recommend it) and not all sites are going to compile just one sass file[^1]. After compiling the sass files, the `jekyll` command is run, building the site. I’ve added a plugin to Jekyll to minify HTML[^2] so that gets done when the site is generated rather than by using another package. Once the site is generated, I run the `gzip` command to compress all HTML, CSS & JavaScript files. Finally, the generated website is uploaded to an Amazon S3 bucket with the gzipped files having the appropriate content header set so that they will be loaded by browsers. 

The script basically wraps up five or six commands into one simple `python _deploy.py` command. Any way, enough waffle. The script: 

```python
#! /usr/local/bin/python3

import yaml
import gzip
import os
from subprocess import PIPE, check_call, CalledProcessError
from sys import exit

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
    
    print("Compiling Sass Files...")
    compile_sass(path_to_sass_file, sass_compile_path, minify=True)
    
    print("Running Jekyll...")
    generate_site()
    
    print("Gzipping File...")
    gzip_files()
    
    print("Getting Bucket Name...")
    bucket_name = get_s3_bucket_name()
        
    print("Deploying to %s..." % bucket_name)
    deploy_to_s3(bucket_name, dry=False)
    print("Successfully Deployed Site!")
```

There’s a few prerequisites for the script. You’ll need to install the [PyYaml][pyyaml-project-page] library for Python, as well as the [sass][sass-project-page] & [s3cmd][s3cmd-project-page] packages. You’ll also need to modify your website’s `_config.yml` file so that it has the name of the s3 bucket you want s3cmd to upload your website to:

```yaml
s3bucket:    s3://bucketname
```

If you don’t need to compile any sass files, go ahead and comment out[^3] the 6th line of the `__main__` method (that’s where it says `compile_sass(path_to_sass_file, sass_compile_path, minify=True)`). If you do need to compile sass files, modify the `path_to_sass_file` and `sass_compile_path` variables so that they point to where the main sass file is and where you want it to be compiled to.

And that’s it. It’s not the most general script in the world but I can see it coming in handy for one or two people who have similar deployment processes to me. If you want to leave some feedback on the script, I’ve created a [Gist on GitHub][script-gist] for the script with some more extensive documentation. 

[^1]: By one sass file I don’t mean I’ve got all of my sass in one file, I just compile lots of different sass files into one CSS file.

[^2]: I know HTML minification isn’t the safest or best way to boost a site’s performance, you don’t need to tell me.

[^3]: To comment a line out in Python just add a `#` to the start of the line.

[jekyll-github-page]: https://github.com/mojombo/jekyll
[sass-project-page]: http://sass-lang.com
[s3cmd-project-page]: http://s3tools.org/s3cmd
[pyyaml-project-page]: http://pyyaml.org/wiki/PyYAML
[sea-lion-memory]: http://newscientist.com/article/dn2960-sea-lion-scores-top-for-memory.html
[script-gist]: https://gist.github.com/4559517
