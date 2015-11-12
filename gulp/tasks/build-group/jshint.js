var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var config  = require('../../config');
var stylish = require('jshint-stylish');

gulp.task('jshint', function () {
    return gulp.src(config.jshintSrc)
        .pipe(jshint(config.jshintRC))
        .pipe(jshint.reporter(stylish));
});