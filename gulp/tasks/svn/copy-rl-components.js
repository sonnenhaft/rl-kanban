var gulp    = require('gulp');
var rename   = require('gulp-rename');
var config  = require('../../config')['copy-rl-components'];

gulp.task('copy-rl-components', ['checkout-rl-components'], function() {
    return gulp.src(config.src)
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest(config.dest));
});