var gulp = require('gulp');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');

gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/production.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', function() {
  return gulp.src('examples/entry.js')
    .pipe(webpack(require('./config/webpack/test.js')))
    .pipe(gulp.dest('examples/'));
});

gulp.task('dev', function() {
  return gulp.src('src/dev.js')
    .pipe(webpack(require('./config/webpack/development.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['development'], function(callback) {
  watch('src/**/*', function() {
    gulp.start("development");
  });
});
