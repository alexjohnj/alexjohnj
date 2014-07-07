#! /usr/local/bin/fish
# Version 2.0, Usage:
# _deploy.sh $arg
# $arg can be blank or `remote` which deploys the site 
# MIT License

function build_site
  bundle exec jekyll build
  
  htmlcompressor -r -o _site _site

  find _site -type f -name '*.html' -exec gzip -9k '{}' \;
  find _site -type f -name '*.css' -exec gzip -9k '{}' \;
  find _site -type f -name '*.js' -exec gzip -9k '{}' \;
  find _site -type f -name '*.svg' -exec gzip -9k '{}' \;
end

switch (echo $argv[1])
  case "local"
    build_site
  case "remote"
    build_site
    rsync -avz -e 'ssh -p 49876' --delete-after _site/ alex@95.85.60.211:/var/www/geographyas.info/_site/
  case '*'
    printf "\033[31mUnknown argument. Use either `local` or `remote`.\033[0m\n"
end
