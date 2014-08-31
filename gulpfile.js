// Plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    exec = require('child_process').exec,
    gzip = require('gulp-gzip'),
    rsync = require('rsyncwrapper').rsync,
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps'),
    coffee = require('gulp-coffee'),
    uglify = require('gulp-uglify');


/******************************************************************************
                              Source Compilation
******************************************************************************/

// styles-dev compiles main.scss, runs it through autoprefixer and saves
// the output as main.min.css. The file is NOT minified however.
gulp.task('styles-dev', function() {
  return gulp.src('./static/css/main.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(autoprefixer('last 2 versions', 'ie 9'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/css'));
});

// styles-product compiles main.scss, runs it through autoprefixer, minifies
// the output and saves it to the file main.min.css
gulp.task('styles-product', function () {
  return gulp.src('./static/css/main.scss')
    .pipe(sass({style: 'expanded'}))
    .pipe(autoprefixer('last 2 versions', 'ie 9'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./static/css'));
});

// coffee-dev compiles *.coffee in the js folder and saves the output
// to *.min.js. The output is NOT minified however.
gulp.task('coffee-dev', function() {
  return gulp.src('./static/js/*.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
});

// coffee-product compiles *.coffee in the js folder, minifies the output
// and saves it to *.min.js.
gulp.task('coffee-product', function() {
  return gulp.src('./static/js/*.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
});

// js-dev matches any file ending in .js but not .min.js and saves it as
// *.min.js. It does NOT minify the file though.
gulp.task('js-dev', function() {
  return gulp.src('./static/js/**/!(*.min.js)+(*.js)')
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
});

// js-product matches any file ending in .js but not .min.js, minifies it
// and then saves the output as *.min.js.
gulp.task('js-product', function() {
  return gulp.src('./static/js/**/!(*.min.js)+(*.js)')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
});

/******************************************************************************
                            Static Site Generation
******************************************************************************/

// clean deletes everything in the ./public/ directory
gulp.task('clean', function(cb) {
  return del(['./public/*'], cb);
});

// hugo runs the hugo command and builds the site
gulp.task('hugo', function(cb){
  return exec('hugo', function(err) {
    if (err) return cb(err);
    cb();
  });
});

// htmlmin minifies ./public/**/*.html and overwrites the original file
gulp.task('htmlmin', ['hugo'], function() {
  return gulp.src('./public/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeCommentsFromCDATA: true,
      removeRedundantAttributes: true,
      collapseBooleanAttributes: true
    }))
    .pipe(gulp.dest('./public'));
});

// clean-deploy removes all coffeescript, SASS and unminified JavaScript
// files that get copied into the public/ folder during hugo's build.
gulp.task('clean-deploy', ['hugo', 'htmlmin'], function(cb) {
  return del(['./public/**/*.{scss,coffee,map}', './public/**/!(*.min.js)+(*.js)'], cb)
});

// gzip compresses the contents of ./public/**/*.{html,js,css} and saves the
// output to *.{html,js,css}.gz
gulp.task('gzip', ['hugo', 'htmlmin', 'clean-deploy'], function() {
  return gulp.src('./public/**/*.{html,js,css,svg,xml}')
    .pipe(gzip())
    .pipe(gulp.dest('./public'));
});

gulp.task('rsync', ['hugo', 'htmlmin', 'clean-deploy', 'gzip'], function() {
  return rsync({
    ssh: true,
    src: './public/',
    dest: 'alex@stormageddon:/var/www/alexj.org/public/',
    recursive: true,
    deleteAll: true
  }, function(error, stdout, stderr, cmd){
    console.log(stdout);
    console.log(stderr);
  });
});

/******************************************************************************
                                Main Tasks
******************************************************************************/

// default does everything except sync the public folder to the remote server.
gulp.task('default', ['clean', 'styles-product', 'coffee-product', 'js-product'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin');
  gulp.start('clean-deploy');
  gulp.start('gzip');
});

// deploy does everything including syncing the public folder to the remote server.
gulp.task('deploy', ['clean', 'styles-product', 'coffee-product', 'js-product'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin');
  gulp.start('clean-deploy');
  gulp.start('gzip');
  gulp.start('rsync');
});

/******************************************************************************
                                Watch Tasks
******************************************************************************/

gulp.task('watch', function() {
  gulp.start('clean');
  gulp.watch('./static/css/**/*.scss', ['styles-dev']);
  gulp.watch('./static/js/**/!(*.min.js)+(*.js)', ['js-dev']);
  gulp.watch('./static/js/**/*.coffee', ['coffee-dev']);
});
