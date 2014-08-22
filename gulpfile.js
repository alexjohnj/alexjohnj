// Plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    exec = require('child_process').exec,
    gzip = require('gulp-gzip'),
    htmlmin = require('gulp-htmlmin');

// Build SASS stylesheets, run the built sheet through autoprefixer and then minify it
gulp.task('styles', function() {
  return gulp.src('./static/css/styles.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 versions', 'ie 9'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./static/css'));
});

// Clean out the ./public/ directory
gulp.task('clean', function(cb) {
  del(['./public/*'], cb);
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

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./static/css/**/*.scss', ['styles']);
});

// Default task
gulp.task('default', ['clean', 'styles'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin'); // Will not execute until 'hugo' task is done
  gulp.start('gzip'); // Will not execute until 'hugo' and 'htmlmin' tasks are done
});
