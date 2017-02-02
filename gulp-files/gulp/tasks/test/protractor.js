var gulp = require('gulp');
var logAndStopServer = require('../../utils/log-and-stop-server');

gulp.task('webdriver:update', function (cb) {
    require('gulp-protractor').webdriver_update(null, cb);
});

gulp.task('protractor:dev', ['webdriver:update'], protractor);

gulp.task('protractor:jenkins', ['webdriver:update', 'host'], function () {
    protractor().on('end', logAndStopServer)
});

function protractor() {
    return gulp.src(['./tests/protractor/*.e2e.js']).pipe(require('gulp-protractor').protractor({
        //args: ['--elementExplorer'],
        configFile: 'gulp-files/protractor.config.js'
    })).on('error', logAndStopServer);
}
