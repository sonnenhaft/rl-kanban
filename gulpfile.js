/* global process */
var runSequence = require('run-sequence');
var gulp = require('gulp');
var commander = require('commander');

var sourcemaps = require('gulp-sourcemaps');
var pkg = require('./package.json');
var clean = require('gulp-clean');

function compileSass(src, dest) {
    var sass = require('gulp-sass');
    var autoprefixer = require('gulp-autoprefixer');
    return gulp.src(src)
        //.pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest));
}

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['app/**/*.js', 'gulpfile.js', 'resources', '!app/vendor/**/*.js'])
        .pipe(jshint('resources/.jshintrc'))
        .pipe(jshint.reporter(require('jshint-stylish')));
});

function initPrivateTasks() {
    commander.parse(process.argv);
    gulp.task('inject-files', function () {
        var inject = require('gulp-inject');
        var rename = require('gulp-rename');
        var target = inject(gulp.src([
            'app/**/_*.js',
            'app/**/*.js',
            'app/vendor/**/reset.css',
            'app/vendor/**/*.css',
            'app/**/*.css',
            '!app/**/*spec.js',
            '!app/**/*test-data.js'

        ], {read: false}), {
            relative: true
        });
        return gulp.src('index-inject.html')
            .pipe(rename('index.html'))
            .pipe(gulp.dest('./'))
            .pipe(target)
            .pipe(gulp.dest('./'));
    });
    gulp.task('sass', function () {
        return compileSass('app/**/*.scss', 'app');
    });
    gulp.task('clean-generated', function () {
        return gulp.src(['build', 'index.html', 'app/**/*.{css,map}', 'app/maps', '!app/vendor/**/*.css', 'coverage']).pipe(clean());
    });
    gulp.task('ng-templates&app-version', function () {
        var gulpNgConfig = require('gulp-ng-config');
        gulp.src('package.json')
            .pipe(gulpNgConfig('package-json'))
            .pipe(gulp.dest('.tmp/'));

        var templateCache = require('gulp-angular-templatecache');
        return gulp.src('app/**/*.html')
            .pipe(templateCache({
                root: 'app/',
                module: pkg.name + '.templates'
            }))
            .pipe(gulp.dest('.tmp'));
    });
    gulp.task('usemin', function () {
        var usemin = require('gulp-usemin');
        var uglify = require('gulp-uglify');
        var minifyHtml = require('gulp-minify-html');
        var minifyCss = require('gulp-minify-css');
        var ngAnnotate = require('gulp-ng-annotate');
        var inject = require('gulp-inject');
        var processhtml = require('gulp-processhtml');
        var cssBase64 = require('gulp-css-base64');
        var urlAdjuster = require('gulp-css-url-adjuster');
        var ver = require('gulp-ver');
        //var staticAssetsDir = 'static-assets-v' + pkg.version + '/';
        var staticAssetsDir = 'static-assets/';

        var copy = require('gulp-copy');
        gulp.src('app/**/font/*.*').pipe(copy('build/' + staticAssetsDir, {prefix: 10}));
        gulp.src(['app/**/*-stub.json', 'app/**/*-logo.*']).pipe(copy('build/'));

        return gulp.src('index.html')
            .pipe(inject(gulp.src(['.tmp/templates.js', '.tmp/package.js'], {read: false}),
                {starttag: '<!-- inject:.tmp/templates-and-app-version:js -->'}
            ))
            .pipe(usemin({
                html: [processhtml({
                    commentMarker: 'process',
                    process: true
                }), minifyHtml()],
                css: [cssBase64({maxWeightResource: 200 * 1024}), 'concat', urlAdjuster({prepend: staticAssetsDir}), ver({prefix: 'v'}), minifyCss()],
                js: [sourcemaps.init(), ngAnnotate(), uglify(), ver({prefix: 'v'}), sourcemaps.write('.')]
                //js: [ngAnnotate(), uglify(), ver({prefix: 'v'})]
            }))
            .pipe(gulp.dest('build/'));
    });

    gulp.task('server', function () {
        return require('gulp-connect').server({
            root: 'build',
            port: commander.eport
        });
    });
}

gulp.task('default', function () {
    commander.parse(process.argv);

    function logEvent(event) {
        console.log('[' + event.type + '] file ' + event.path);  // jshint ignore:line
    }

    gulp.task('connect', function () {
        return require('gulp-connect').server({
            port: commander.eport
        });
    });

    (function (livereload) {
        gulp.task('watch', function () {
            livereload.listen({port: commander.lrport});
            gulp.watch(['app/**/*.js', 'app/**/*.html', 'index.html'], function (event) {
                logEvent(event);
                gulp.src(event.path).pipe(livereload());
            });
            gulp.watch('app/**/*.scss', function (event) {
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
    })(require('gulp-livereload'));

    gulp.task('watch-index', function () {
        gulp.watch(['app/**/*.{js,css}', 'index-inject.html'], {interval: 2000}, function (event) {
            if (event.type !== 'changed' || event.path.indexOf('index-inject.html') !== -1) {
                logEvent(event);
                runSequence('inject-files');
            }
        });
    });

    gulp.task('open', function () {
        gulp.src('index.html').pipe(require('gulp-open')('', {
            url: 'http://' + commander.hostname + ':' + commander.eport
        }));
    });

    initPrivateTasks();

    return runSequence('inject-files', ['connect', 'watch', 'watch-index', 'open']);
});

commander.option('--lrport [port number]', 'Live reload port', 35729)
    .option('--eport [port number]', 'express server port', 4000)
    .option('--hostname [host name]', 'host name', 'localhost');

gulp.task('serve', function () {
    initPrivateTasks();
    runSequence('sass', 'default');
});

gulp.task('build', function () {
    initPrivateTasks();
    return runSequence(
        ['clean-generated', 'jshint'],
        ['sass', 'ng-templates&app-version'], 'inject-files', 'usemin', function () {
            return gulp.src('.tmp').pipe(clean());
        });
});

gulp.task('host', function () {
    initPrivateTasks();
    return runSequence('clean-generated', ['sass', 'ng-templates&app-version'], 'inject-files', 'usemin', 'server', function () {
        return gulp.src('.tmp').pipe(clean());
    });
});

function runKarma(done, singleRun) {
    require('karma').server.start({
        configFile: __dirname + '/resources/karma.conf.js',
        singleRun: singleRun || false
    }, done);
}
gulp.task('test', function(done){
    runKarma(done, true);
});

gulp.task('dev-test', runKarma);

gulp.task('beautify-js', function () {
    return gulp.src(['app/**/*.js', '!app/vendor/**/**.js'])
        .pipe(require('gulp-jsbeautifier')({
            config: 'resources/.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        })).pipe(gulp.dest('./app'));
});

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');

    return gulpDocs.sections({
        _0all: {
            glob: ['app/**/*.js', '!app/**/*.spec.js'],
            title: 'All'
        }
    }).pipe(gulpDocs.process({
        html5Mode: false,
        startPage: '/api',
        title: 'Search Control',
        image: 'https://cog1.basecamphq.com/companies/461444/logo.gif',
        imageLink: 'https://github.com/COG1-Interactive',
        titleLink: 'https://github.com/COG1-Interactive/Ren-learn-search-control',
        styles: [
            'resources/doc-styles-override.css',
            'app/vendor/rl-reputation-widget/rlreputationwidget.css'
        ],
        scripts: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular/angular.min.js.map',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-animate/angular-animate.min.js.map',

            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-touch/angular-touch.js',
            'build/app-v' + pkg.version + '.js',
            'build/app-v' + pkg.version + '.js.map'
        ]
    }))
        .pipe(gulp.dest('./ng-docs'));
});
