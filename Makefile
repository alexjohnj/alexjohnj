HUGO = hugo
SASS = node_modules/sass/sass.js
HTMLMIN = node_modules/html-minifier/cli.js

SASS_FLAGS = --style=compressed
HTMLMIN_FLAGS = --collapse-whitespace --collapse-boolean-attributes --remove-comments --remove-empty-attributes --remove-redundant-attributes

HUGO_FILES = $(shell find archetypes content layouts static -type f)
SASS_FILES = $(shell find "assets/css" -type f -name '*.scss')

.PHONY: all
all: post

.PHONY: clean
clean:
	rm -rf public
	rm -f static/main.css{,.map}

static/main.css: assets/css/main.scss $(SASS_FILES)
	$(SASS) $(SASS_FLAGS) $< $@

public: $(HUGO_FILES) static/main.css
	$(HUGO)

.PHONY: post
post: public
	$(HTMLMIN) $(HTMLMIN_FLAGS) --file-ext html --input-dir public --output-dir public
	find 'public' -type f \( -name '*html' -or -name '*.xml' -or -name '*.svg' -or -name '*.css' -or -name '*.js' \) -exec gzip -9kf {} +

.PHONY: deploy
deploy: post
	rsync -rz --delete 'public/' 'alex@archer:/usr/local/www/alexj.org/'

.PHONY: serve
serve: static/main.css
	$(HUGO) server --buildDrafts
