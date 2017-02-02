var gulp = require('gulp');
var logAndStopServer = require('../../utils/log-and-stop-server');

function nw() {
    return gulp.src('').pipe(require('gulp-nightwatch')({
        configFile: 'gulp-files/nightwatch.json'
    })).on('error', logAndStopServer);
}
gulp.task('nightwatch:dev', ['webdriver:update'], nw);

gulp.task('nightwatch:jenkins', ['host', 'webdriver:update'], function () {
    return nw().on('end', logAndStopServer);
});