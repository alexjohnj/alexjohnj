// Plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
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
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence')
    sourcemaps = require('gulp-sourcemaps');

/*******************************************************************************
                          Source Compilation
*******************************************************************************/
gulp.task('development:hugo-build', function(cb) {
  return exec('hugo --baseUrl="http://localhost:8000"', function(err) {
    if(err) return cb(err);
    cb();
  });
});

gulp.task('production:hugo-build', function(cb) {
  return exec('hugo', function(err) {
    if(err) return cb(err);
    cb();
  });
});

gulp.task('development:styles', function (){
  return gulp.src('./assets/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version', 'ie 9'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('production:styles', function() {
  return gulp.src('./assets/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'ie 9'))
    .pipe(minifycss())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('development:coffee-script', function() {
  return gulp.src('./assets/js/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee().on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('production:coffee-script', function() {
  return gulp.src('./assets/js/*.coffee')
    .pipe(coffee().on('error', gutil.log))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('development:javascript', function() {/*Dummy task*/});

gulp.task('production:javascript', function() {
    return gulp.src('./assets/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

/*******************************************************************************
                           HTML Processing
*******************************************************************************/

gulp.task('production:html', function() {
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

gulp.task('gzip', function() {
  return gulp.src('./public/**/*.{html,js,css,svg,xml}')
    .pipe(gzip())
    .pipe(gulp.dest('./public'));
  cb();
});

gulp.task('clean-build-dir', function(cb) {
  del(['./public/**/*.{scss,coffe,map}', './public/**/*.coffee'], cb);
});

gulp.task('rsync', function() {
  return rsync({
    ssh: true,
    src: './public/',
    dest: 'alex@archer:/usr/local/www/alexj.org/',
    recursive: true,
    deleteAll: true
  }, function(error, stdout, stderr, cmd){
    console.log(stdout);
    console.log(stderr);
  });
});

/*******************************************************************************
                              Main Tasks
*******************************************************************************/

gulp.task('clean', function(cb) {
  del(['./public/*'], cb)
});

gulp.task('development:build', function(cb) {
  runSequence('clean',
              'development:hugo-build',
              'development:coffee-script',
              ['development:styles', 'development:javascript'],
              cb);
  
});

gulp.task('production:build', function(cb) {
  runSequence('clean',
              'production:hugo-build',
              'production:coffee-script',
              ['production:styles', 'production:javascript'],
              'production:html',
              'gzip',
              'clean-build-dir',
              cb);
});

gulp.task('default', ['production:build']);

gulp.task('deploy', function() {
  runSequence('production:build',
              'rsync');
});

gulp.task('watch', ['development:build'], function() {
  gulp.watch(['./archetypes/**/*.*', './content/**/*.*', './static/**/*.*',
              './layouts/**/*.*', './config.toml'], ['development:hugo-build']);
  gulp.watch('./assets/css/**/*.scss', ['development:styles']);
  gulp.watch('./assets/js/**/*.coffee', ['development:coffee-script']);
  gulp.watch('./assets/js/**/*.js', ['development:javascript']);
});
