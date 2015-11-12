var pkg = require('../package.json');
var commander = require('./commander-opts');

var tempFolder = '.tmp';
var buildFolder = 'deployment';
var appDir = 'app';

module.exports = {
    ngtemplates: {
        src: [appDir + '/**/*.html', '!' + appDir + '/**/example.html'],
        settings: {
            root: appDir + '/',
            module: pkg.name + '.templates'
        }
    },
    ngconfig: {
        name: pkg.name + '-constant',
        constants: (function (c) {
            c[pkg.name + 'Version'] = pkg.version;
            return c;
        })({})
    },
    inject: {
        target: [
            appDir + '/**/_*.js',
            appDir + '/**/*.js',
            appDir + '/**/*.css',
            '!' + appDir + '/sc-deps/**/*.css',
            '!' + appDir + '/sc-deps/**/*.js',
            '!' + appDir + '/demo-code/**/*.css',
            '!' + appDir + '/demo-code/**/*.js',
            '!' + appDir + '/vendor/**/*.css',
            '!' + appDir + '/vendor/**/*.js',
            '!' + appDir + '/**/*spec.js',
            '!' + appDir + '/**/*test-data.js'
        ],
        vendor: [
            appDir + '/vendor/**/*.css',
            appDir + '/vendor/**/*.js'
        ],
        'demo-code': [
            appDir + '/demo-code/**/*.css',
            appDir + '/demo-code/**/_*.js',
            appDir + '/demo-code/**/*.js'
        ]
    },
    'copy-rl-components': {
        src: ['svn-temp/**/*.js', 'svn-temp/**/*.css', '!svn-temp/**/*.min.js'],
        dest: appDir + '/vendor/rl'
    },
    usemin: {
        versioned: commander.versioned,
        fonts: {
            src: appDir + '/**/font/*.*',
            dist: buildFolder + '/css/font/'
        },
        assets: {
            src: [appDir + '/**/*-stub.json', appDir + '/**/*-logo.*', appDir + '/**/*.png'],
            dist: buildFolder + '/'
        },
        injectSrc: [tempFolder + '/templates.js', tempFolder + '/package.js'],
        src: 'index.html',
        dist: buildFolder + '/'
    },

    cleanGeneratedSrc: [
        buildFolder,
        'index.html',
        appDir + '/**/*.{css,map}',
        appDir + '/maps',
        '!' + appDir + '/vendor/**/*.css',
        '!' + appDir + '/copied-from-bower/**/*.css',
        'coverage'
    ],
    tempFolderPath: tempFolder,

    connectPort: commander.eport,
    connectDev: __dirname + '/../',
    connectDist: __dirname + '/../' + buildFolder,

    jshintSrc: [
        appDir + '/**/*.js',
        'gulpfile.js', 'gulp/**.*',
        'resources',
        '!' + appDir + '/vendor/**/*.js',
        '!' + appDir + '/copied-from-bower/**/*.js'
    ],
    jshintRC: 'resources/.jshintrc',

    watchAssets: [appDir + '/**/*.js', appDir + '/**/*.html', 'index.html'],
    watchIndexSrc: [appDir + '/**/*.{js,css}', 'index-inject.html'],

    appDir: appDir,
    karmaConf: __dirname + '/../resources/karma.conf.js',
    openUrl: 'http://' + commander.hostname + ':' + commander.eport + '/#/stub',
    useminVersioned: commander.versioned
};