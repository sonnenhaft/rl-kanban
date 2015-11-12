var gulp    = require('gulp');
var config  = require('../../config');
var ngConfig = require('gulp-ng-config');

gulp.task('$ng-config', function () {
    return gulp.src('package.json')
        .pipe(ngConfig(config.ngconfig.name, {constants: config.ngconfig.constants}))
        .pipe(gulp.dest(config.tempFolderPath));
});