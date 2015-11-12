var gulp = require('gulp');
var karma = require('karma');
var config = require('../../config');

gulp.task('test', function (done) {
    karma.server.start({
        configFile: config.karmaConf,
        singleRun: true
    }, done);
});