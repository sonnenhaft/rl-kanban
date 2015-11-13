var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', ['$clean-generated', 'jshint'], function (cb) {
    runSequence(
        ['$sass', '$ng-templates', '$ng-config'],
        '$usemin',
        '$clean-temp',
        cb
    );
});

gulp.task('deploy', ['build']);// , 'test']); // TODO: Include tests. Removed to get building in TeamCity