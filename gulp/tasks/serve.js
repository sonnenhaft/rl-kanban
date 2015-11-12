var gulp = require('gulp');
var open = require('gulp-open');
var config = require('../config');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');

gulp.task('serve', function () {
    runSequence('$sass', 'default');
});

gulp.task('default', function () {         //default is faster than server, because does not run sas compile initially
    gulp.task('open', function () {
        gulp.src('index.html')
            .pipe(open('', {url: config.openUrl}));
    });

    gulp.task('connect', function () {
        return connect.server({
            root: config.connectDev,
            port: config.connectPort
        });
    });

    return runSequence('$inject-files', ['connect', '$watch', '$watch-index', 'open']);
});