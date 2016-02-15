var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('production', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/production.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('development', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/development.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['development']);
