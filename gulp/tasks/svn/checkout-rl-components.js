var gulp    = require('gulp');
var svn     = require('gulp-svn');
var util    = require('gulp-util');

gulp.task('checkout-rl-components', ['cleanup-svn-checkouts'], function(cb) {
    util.log('IMPORTANT: You must be connected to RLI network to run svn commands');
    svn.checkout('http://subv-linux.wrpwi.root.local/svn/RPHosted/ClientComponents/rlSlider/trunk/deployment', 'svn-temp/rlSlider', {}, function(err) {
            svn.checkout('http://subv-linux.wrpwi.root.local/svn/RPHosted/ClientComponents/rlReputationWidget/trunk/deployment', 'svn-temp/rlRepuationWidget', {},
                function(err) {
                    if (err) {
                        throw err;
                    }
                    cb();
                });
            if (err) {
                throw err;
            }
        }
    );
});