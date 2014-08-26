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

// Build SASS stylesheets, run the built sheet through autoprefixer and then minify it
gulp.task('styles', function() {
  return gulp.src('./static/css/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 versions', 'ie 9'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./static/css'));
});

// Compiles CoffeeScript with a sourcemap and saves it as *.min.js
// Despite the .min suffix, this JS is NOT minified
gulp.task('scripts-dev', function() {
  return gulp.src('./static/js/*.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'))
});

// Minify *.js, compile *.coffee, minify output, save as *.min.js
gulp.task('scripts-product', ['clean-scripts'], function(cb) {
  // Compile & Minify CoffeeScript
  gulp.src('./static/js/*.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'))

  // Minify JS
  gulp.src('./static/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'))
});

// Clean out the ./public/ directory
gulp.task('clean', function(cb) {
  del(['./public/*'], cb);
});

// Deletes all *.min.js files
gulp.task('clean-scripts', function(cb) {
  del(['./static/js/**/*.min.js'], cb)
});

// Run hugo and rebuild the site
gulp.task('hugo', function(cb) {
  exec('hugo', function (err) {
    if (err) return cb(err);
    cb();
  });
});

// Minify HTML files in ./public/
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

// Gzip HTML, CSS & JS files in ./public/
gulp.task('gzip', ['hugo', 'htmlmin'], function() {
  return gulp.src('./public/**/*.{html,js,css}')
    .pipe(gzip())
    .pipe(gulp.dest('./public'))
});

// Rsync the public directory to my server
gulp.task('rsync', ['hugo', 'htmlmin', 'gzip'], function(cb) {
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

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./static/css/**/*.scss', ['styles']);
  gulp.watch('./static/js/**/*.coffee', ['scripts-dev'])
});

// Default task
gulp.task('default', ['clean', 'styles', 'scripts-product'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin'); // Will not execute until 'hugo' task is done
  gulp.start('gzip'); // Will not execute until 'hugo' and 'htmlmin' tasks are done
});

gulp.task('deploy', ['clean', 'styles', 'scripts-product'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin');
  gulp.start('gzip');
  gulp.start('rsync');
});
