var gulp = require('gulp');
var config = require('../../config');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
var processhtml = require('gulp-processhtml');
var ver = require('gulp-ver');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clone = require('gulp-clone');
var copy = require('gulp-copy');
var sourcemaps = require('gulp-sourcemaps');
var urlAdjuster = require('gulp-css-url-adjuster');

gulp.task('$usemin', ['$inject-files'], function () {
    var staticAssetsDir = 'static-assets/';

    //TODO: extract this area to config.js
    gulp.src(['app/**/font/*.*']).pipe(copy('deployment/' + staticAssetsDir + 'font', {prefix: 10}));
    gulp.src(['app/component/**/*.png']).pipe(copy('deployment/' + staticAssetsDir, {prefix: 10}));
    gulp.src(['app/demo-code/**/*.json', 'app/**/*-logo.*']).pipe(copy('deployment/'));



    var clonesArray = [
        {name: 'css'}, {name: 'vendorCSS'}, {name: 'demoCSS'}, {name: 'scDepsCSS'},
        {name: 'js', isJs: true}, {name: 'vendorJS', isJs: true, isVendor: true}, {name: 'demoJS', isJs: true}, {name: 'scDepsJS', isJs: true}
    ].map(function (item) {
            item.clone = clone.sink();
            if (item.isJs) {
                item.opts = [ngAnnotate(), item.clone, sourcemaps.init()];
                if (!item.isVendor) { item.opts.push(uglify());}
            } else {
                item.opts = [
                    sourcemaps.init(),
                    urlAdjuster({prepend: '/' + staticAssetsDir}),
                    'concat',
                    item.clone,
                    minifyCss()
                ];
            }
            item.opts.push(rename({suffix: '.min'}));
            item.opts.push(sourcemaps.write('.'));
            if (config.useminVersioned === true) {
                item.opts.push(ver({prefix: 'v'}));
            }
            return item;
        });

    return clonesArray.reduce(function (useminTask, item) {
        return useminTask.pipe(item.clone.tap());
    }, gulp.src(config.usemin.src)
        .pipe(inject(gulp.src(config.usemin.injectSrc, {read: false}),
            {starttag: '<!-- inject:' + config.tempFolderPath + '/templates-and-app-version:js -->'}
        ))
        .pipe(usemin(clonesArray.reduce(function (useminMap, item) {
            useminMap[item.name] = item.opts;
            return useminMap;
        }, {
            html: [
                processhtml({commentMarker: 'process', process: true}),
                minifyHtml()
            ]
        })))).pipe(gulp.dest(config.usemin.dist));
});