var gulp = require('gulp');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var Server = require('karma').Server;

gulp.task('default', ['build']);

gulp.task('build', function() {
  return gulp.src('src/main.js')
    .pipe(webpack(require('./config/webpack/production.js')))
    .pipe(gulp.dest('dist/'));
});

gulp.task('dev', function() {
  return gulp.src('examples/entry.js')
    .pipe(webpack(require('./config/webpack/development.js')))
    .pipe(gulp.dest('examples/'));
});

gulp.task('watch', ['dev'], function(callback) {
  watch('src/**/*', function() {
    gulp.start("dev");
  });
});

// Run test once and exit
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
