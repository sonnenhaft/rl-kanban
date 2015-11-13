var gulp    = require('gulp');
var clean   = require('gulp-clean');
var config  = require('../../config');

gulp.task('$clean-temp', function () {
    return gulp.src(config.tempFolderPath).pipe(clean());
});