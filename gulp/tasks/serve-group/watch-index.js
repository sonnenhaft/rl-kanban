var gulp    = require('gulp');
var config  = require('../../config');
var runSequence = require('run-sequence');
var logEvent = require('../../utils/logEvent');

gulp.task('$watch-index', function () {
    gulp.watch(config.watchIndexSrc, {interval: 2000}, function (event) {
        if (event.type !== 'changed' || event.path.indexOf('index-inject.html') !== -1) {
            logEvent(event);
            runSequence('$inject-files');
        }
    });
});