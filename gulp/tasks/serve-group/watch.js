var gulp = require('gulp');
var config = require('../../config');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var logEvent = require('../../utils/logEvent');

var compileSass = require('../../utils/compile-sass-fn');

gulp.task('$sass', function () {
    return compileSass(config.appDir + '/**/*.scss', config.appDir)
});

gulp.task('$watch', function () {
    livereload.listen();
    gulp.watch(config.watchAssets, function (event) {
        logEvent(event);
        gulp.src(event.path).pipe(livereload());
    });
    gulp.watch(config.appDir + '/**/*.scss', function (event) {
        var path = event.path;
        logEvent(event);
        if (event.type !== 'deleted') {
            var folder = path.slice(0, path.lastIndexOf(/[\/\\]/.exec(path)[0]));
            return compileSass(path, folder).pipe(livereload());
        } else {
            path = path.replace('.scss', '.css');
            return gulp.src(path).pipe(clean());
        }
    });
}).on('change', livereload.changed);