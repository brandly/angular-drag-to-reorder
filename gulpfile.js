var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
concat = require('gulp-concat'),
sass = require('gulp-sass'),
gutil = require('gulp-util'),
uglify = require('gulp-uglify'),
minify = require('gulp-minify-css'),
rename = require('gulp-rename'),
header = require('gulp-header'),
path = require('path'),
express = require('express'),
package = require('./package.json'),

build = gutil.env.gh ? './gh-pages/' : './build/',

banner = [
  '/*',
  '  <%= package.name %> v<%= package.version %>',
  '  <%= package.homepage %>',
  '*/',
  ''
].join('\n'),
libFileName = 'angular-drag-to-reorder.js';

function onError(err) {
  gutil.log(err);
  gutil.beep();
  this.emit('end');
}

gulp.task('coffee:lib', function () {
  return gulp.src('src/angular-drag-to-reorder.coffee')
    .pipe(coffee())
    .on('error', onError)
    .pipe(concat(libFileName))
    .pipe(gulp.dest(build))
    //dist
    .pipe(header(banner, {package: package}))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(header(banner, {package: package}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('coffee:demo', function () {
  return gulp.src('demo/**/*.coffee')
    .pipe(coffee())
    .on('error', onError)
    .pipe(concat('demo.js'))
    .pipe(gulp.dest(build));
});

gulp.task('coffee', ['coffee:lib', 'coffee:demo']);

gulp.task('sass', function () {
  return gulp.src('demo/styles/style.scss')
    .pipe(sass())
    .on('error', onError)
    .pipe(concat('demo.css'))
    .pipe(gulp.dest(build));
});

gulp.task('images', function () {
  return gulp.src('demo/images/*')
    .pipe(gulp.dest(build));
});

gulp.task('index', function () {
  return gulp.src('demo/index.html')
    .pipe(gulp.dest(build));
});

gulp.task('build', [
  'index',
  'coffee',
  'sass',
  'images'
]);

gulp.task('default', ['build'], function () {
  if (!gutil.env.gh) {
    gulp.watch(['src/**', 'demo/**'], ['build']);

    var
    app = express(),
    port = 8888;
    app.use(express.static(path.resolve(build)));
    app.listen(port, function() {
      gutil.log('Listening on', port);
    });
  }
});
