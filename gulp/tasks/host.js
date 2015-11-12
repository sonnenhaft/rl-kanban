var gulp = require('gulp');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var config = require('../config');

gulp.task('host', function () {
    gulp.task('$server', function () {
        return connect.server({
            root: config.connectDist,
            port: config.connectPort
        });
    });

    return runSequence(
        '$clean-generated',
        ['$sass', '$ng-templates', '$ng-config'],
        '$inject-files',
        '$usemin',
        '$$server',
        '$clean-temp'
    );
});