var gulp = require('gulp');
var util = require('gulp-util');
var clean = require('gulp-clean');

gulp.task('cleanup-svn-checkouts', function () {
    util.log('deleting ./svn-temp');
    return gulp.src('svn-temp', {read: false})
        .pipe(clean({force: true}));
});