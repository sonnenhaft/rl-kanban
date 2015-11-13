var gulp = require('gulp');
var clean = require('gulp-clean');

gulp.task('merge-rl-components', ['copy-rl-components', 'cleanup-svn-checkouts']);