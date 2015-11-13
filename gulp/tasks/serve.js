var gulp = require('gulp');
var open = require('gulp-open');
var config = require('../config');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');

gulp.task('serve', ['$sass'], function (cb) {
    runSequence('default', cb);
});

gulp.task('$open', ['$inject-files'],  function () {
    gulp.src('index.html')
        .pipe(open('', {url: config.openUrl}));
});

gulp.task('$connect', ['$inject-files'],  function () {
    return connect.server({
        root: config.connectDev,
        port: config.connectPort
    });
});

gulp.task('default', ['$connect', '$watch', '$watch-index', '$open']);