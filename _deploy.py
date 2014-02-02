#! /usr/local/bin/python3
""" 
1. Build Jekyll site
2. Minify HTML (CSS & JS already implemented in asset pipeline)
3. Create gziped files
"""

import gzip
import getpass
import os
import sys
import subprocess
import shlex
import pexpect

# Colours for output

INFO = '\033[95m'
ERROR = '\033[91m'
OK = '\033[92m'
NORM = '\033[0m'

# Deployment variables
local_build_directory = '_site/'
remote_deploy_directory = '/var/www/alexj.me/_site/'
ssh_user = 'alex'
ssh_ip = "95.85.60.211"
ssh_port = 49876

def build_jekyll_site():
    command = ['bundle', 'exec', 'jekyll', 'build']
    try: 
        subprocess.check_call(command, stdout=subprocess.PIPE)
    except subprocess.CalledProcessError:
        sys.exit(ERROR + "[Error]: Jekyll build failed" + NORM)
    else:
        print(OK + "Done" + NORM)

def minify_files():
    command = ['htmlcompressor', '-r', '-o', local_build_directory, local_build_directory]
    try:
        subprocess.check_call(command, stdout=subprocess.PIPE)
    except subprocess.CalledProcessError:
        sys.exit(ERROR + "[Error]: Failed to minify HTML files" + NORM)
    else:
        print(OK + "Done" + NORM)

def gzip_files():
    command = ['gzip', '-r', '-k', '--best', local_build_directory]
    try:
        subprocess.check_call(command, stdout=subprocess.PIPE)
    except subprocess.CalledProcessError:
        sys.exit(ERROR + "[Error]: Failed to gzip output files" + NORM)
    else:
        print(OK + "Done" + NORM)

def deploy_site():
    command = "rsync -avz -e 'ssh -p {0}' --delete-after {1} {2}@{3}:{4}".format(ssh_port, local_build_directory, ssh_user, ssh_ip, remote_deploy_directory)
    child = pexpect.spawn(command)
    child.expect("{0}@{1}'s password:".format(ssh_user, ssh_ip))
    child.sendline(getpass.getpass("{0}@{1}'s password:".format(ssh_user, ssh_ip)))
    child.interact()

if __name__ == "__main__":
    print(INFO + "Building Jekyll Site..." + NORM)
    build_jekyll_site()

    print(INFO + "Minifying HTML files..." + NORM)
    minify_files()

    print(INFO + "Gzipping contents of {0}...".format(local_build_directory) + NORM)
    gzip_files()

    print(INFO + "Deploying site via rsync..." + NORM)
    deploy_site()