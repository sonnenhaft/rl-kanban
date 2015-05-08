module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        autoWatch: true,
        usePolling: true,
        'atomic_save': false,
        files: [
            'bower_components/underscore/underscore.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-foundation-bower/mm-foundation-tpls.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-ui-utils/highlight.js',
            'bower_components/ngstorage/ngStorage.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'resources/directive-builder.js',
            'app/**/_*.js',
            'app/**/*.html',
            'app/**/*.js',
            'app/*.js'
        ],
        plugins: [
            'karma-ng-html2js-preprocessor',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
        ],
        preprocessors: {
            '{app,app/!(vendor)+(**)/**}/!(*data|*spec)+(.js)': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {moduleName: 'templates'},
        reporters: ['progress', 'coverage'],
        coverageReporter: {reporters: [{dir: 'coverage', type: 'html'}]},
        logLevel: config.LOG_INFO // for debug use config.LOG_DEBUG
    });
};
