var gulp = require('gulp');
var config = require('../config');

gulp.task('serve', ['$sass'], function (cb) {
    var runSequence = require('run-sequence');

    runSequence('default', cb);
});

gulp.task('$open', ['$inject-files'],  function () {
    var open = require('gulp-open');

    gulp.src('index.html')
        .pipe(open('', {url: config.openUrl}));
});

gulp.task('$connect', ['$inject-files'],  function () {
    var connect = require('gulp-connect');

    return connect.server({
        root: config.connectDev,
        port: config.connectPort
    });
});

gulp.task('default', ['$connect', '$watch', '$watch-index', '$open']);