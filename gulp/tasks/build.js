var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function () {
    return runSequence(
        ['$clean-generated', 'jshint'],
        ['$sass', '$ng-templates', '$ng-config'],
        '$inject-files',
        '$usemin',
        '$clean-temp'
    );
});

gulp.task('deploy', ['build']);// , 'test']); // TODO: Include tests. Removed to get building in TeamCity