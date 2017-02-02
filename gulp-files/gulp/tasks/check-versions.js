var gulp = require('gulp');
gulp.task('check-version', function (callback) {
    var checkVersion = 'echo ******** check-version [npm, node, gulp] ***** && echo *************************** && ' +
        'echo npm && npm -v && echo node && node -v && echo gulp && gulp -v && ' +
        'echo *************************** && echo ***************************';

    require('child_process').exec(checkVersion, function (error, stdout, stderr) {
        if (stderr) {console.log('==========!!!! version was not checked !!!!======== ' + stderr);}
        if (stdout) { console.log('stdout: ' + stdout);}
        callback();
    });
});
