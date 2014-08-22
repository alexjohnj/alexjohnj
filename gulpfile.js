// Plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    exec = require('child_process').exec,
    gzip = require('gulp-gzip'),
    rsync = require('rsyncwrapper').rsync,
    htmlmin = require('gulp-htmlmin');

// Build SASS stylesheets, run the built sheet through autoprefixer and then minify it
gulp.task('styles', function() {
  return gulp.src('./static/css/main.scss')
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
});

// Default task
gulp.task('default', ['clean', 'styles'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin'); // Will not execute until 'hugo' task is done
  gulp.start('gzip'); // Will not execute until 'hugo' and 'htmlmin' tasks are done
});

gulp.task('deploy', ['clean', 'styles'], function() {
  gulp.start('hugo');
  gulp.start('htmlmin');
  gulp.start('gzip');
  gulp.start('rsync');
});
