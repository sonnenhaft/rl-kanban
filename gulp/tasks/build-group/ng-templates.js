var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var config = require('../../config');

gulp.task('$ng-templates', function () {
    return gulp.src(config.ngtemplates.src)
        .pipe(templateCache(config.ngtemplates.settings))
        .pipe(gulp.dest(config.tempFolderPath));
});