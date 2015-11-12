var gulp    = require('gulp');
var clean   = require('gulp-clean');
var config  = require('../../config');

gulp.task('$clean-generated', function () {
    return gulp.src(config.cleanGeneratedSrc).pipe(clean());
});