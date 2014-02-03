#!/usr/local/bin/fish

bundle exec jekyll build

htmlcompressor -r -o _site _site

find _site -type f -name '*.html' -exec gzip -9k '{}' \;
find _site -type f -name '*.css' -exec gzip -9k '{}' \;
find _site -type f -name '*.js' -exec gzip -9k '{}' \;

rsync -avz -e 'ssh -p 49876' --delete-after _site/ alex@95.85.60.211:/var/www/alexj.me/_site/
