var gulp = require('gulp');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var config = require('../config');

gulp.task('$server', ['$usemin'], function () {
    return connect.server({
        root: config.connectDist,
        port: config.connectPort
    });
});

gulp.task('host', ['$clean-generated'], function (cb) {
    return runSequence(
        ['$sass', '$ng-templates', '$ng-config'],
        '$server',
        '$clean-temp',
        cb
    );
});