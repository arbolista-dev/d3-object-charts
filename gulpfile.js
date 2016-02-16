var gulp = require('gulp');
var watch   = require('gulp-watch');
var webpack = require('webpack-stream');

gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/production.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('development', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/development.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['development'], function (callback) {
  watch('src/main.js', function () {
    gulp.start("development");
  });
});
