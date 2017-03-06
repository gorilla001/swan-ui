var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var RevAll = require('gulp-rev-all');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var useref = require('gulp-useref');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var rev = require('gulp-rev-hash');
var jslint = require('gulp-jslint-simple');

var angularTemplatecache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('copy-confdev', function () {
    gulp.src('js/confdev.js')
        .pipe(gulp.dest('build/js/'));
});

gulp.task('copy-pics', ['copy-confdev'], function () {
    gulp.src('pics/*')
        .pipe(gulp.dest('build/pics/'));
});

gulp.task('copy-fonts', ['copy-pics'], function () {
    var sources = ['bower_components/bootstrap/dist/fonts/*', 'bower_components/font-awesome/fonts/*'];
    gulp.src(sources)
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy-swf', ['copy-fonts'], function () {
    var sources = ['bower_components/zeroclipboard/dist/ZeroClipboard.swf'];
    return gulp.src(sources)
        .pipe(gulp.dest('build/js'));
});


//directives html
gulp.task('template-min-directives', function () {
    return gulp.src('glance/directives/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlRirectives.js', {
            module: 'glance',
            root: '/glance/directives'
        }))
        .pipe(gulp.dest('build/js/'));
});

//utils html to js
gulp.task('template-min-utils', ['template-min-directives'],function () {
    return gulp.src('glance/utils/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlUtils.js', {
            module: 'glance.utils',
            root: '/glance/utils'
        }))
        .pipe(gulp.dest('build/js/'));
});

//auth html to js
gulp.task('template-min-auth', ['template-min-utils'],function () {
    return gulp.src('glance/auth/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('authTemplateCacheHtmlAuth.js', {
            module: 'glance.auth',
            root: '/glance/auth'
        }))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('template-min-user', ['template-min-auth'], function () {
    return gulp.src('glance/user/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlUser.js', {
            module: 'glance.user',
            root: '/glance/user'
        }))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('template-min-dashboard', ['template-min-user'], function () {
    return gulp.src('glance/dashboard/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlDashboard.js', {
            module: 'glance.dashboard',
            root: '/glance/dashboard'
        }))
        .pipe(gulp.dest('build/js/'));
});

//application html to js
gulp.task('template-min-app', ['template-min-dashboard'], function () {
    return gulp.src('glance/application/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlApp.js', {
            module: 'glance.app',
            root: '/glance/application'
        }))
        .pipe(gulp.dest('build/js/'));
});

//image html to js
gulp.task('template-min-image', ['template-min-app'], function () {
    return gulp.src('glance/image/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlImage.js', {
            module: 'glance.image',
            root: '/glance/image'
        }))
        .pipe(gulp.dest('build/js/'));
});

//repo
gulp.task('template-min-repo', ['template-min-image'], function () {
    return gulp.src('glance/repository/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlRepository.js', {
            module: 'glance.repository',
            root: '/glance/repository'
        }))
        .pipe(gulp.dest('build/js/'));
});

//policy
gulp.task('template-min-policy', ['template-min-repo'], function () {
    return gulp.src('glance/policy/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlPolicy.js', {
            module: 'glance.policy',
            root: '/glance/policy'
        }))
        .pipe(gulp.dest('build/js/'));
});

//cluster
gulp.task('template-min-cluster', ['template-min-layout'], function () {
    return gulp.src('glance/cluster/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlCluster.js', {
            module: 'glance.cluster',
            root: '/glance/cluster'
        }))
        .pipe(gulp.dest('build/js/'));
});

// views html to js
gulp.task('template-min', ['template-min-cluster'], function () {
    return gulp.src('views/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: 'glance',
            root: '/views'
        }))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('ng-annotate', ['template-min'], function () {
    return gulp.src('glance/**/*.js')
        .pipe(ngAnnotate({add: true}))
        .pipe(gulp.dest('build/glance/'))
})

gulp.task('ng-annotate-old', ['ng-annotate'], function () {
    return gulp.src('js/**/*.js')
        .pipe(ngAnnotate({add: true}))
        .pipe(gulp.dest('build/js/'))
})

gulp.task('html-replace', ['ng-annotate-old'], function () {

    var templateInjectFile = gulp.src('build/js/templateCacheHtml*.js', {read: false});
    var templateInjectOptions = {
        starttag: '<!-- inject:template.js  -->',
        addRootSlash: false
    };

    var assets = useref.assets();
    var revAll = new RevAll();
    return gulp.src('index.html')
        .pipe(inject(templateInjectFile, templateInjectOptions))
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref().on('error', gutil.log))
        .pipe(revAll.revision().on('error', gutil.log))
        .pipe(rev())
        .pipe(gulp.dest('build/'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('build/'));
});

gulp.task('html-rename', ['html-replace'], function () {
    gulp.src('build/index.*.html')
    .pipe(rename('index.html').on('error', gutil.log))
    .pipe(gulp.dest('build/'));
});

gulp.task('auth-html-replace', ['html-rename'], function () {

    var templateInjectFile = gulp.src('build/js/authTemplateCacheHtml*.js', {read: false});
    var templateInjectOptions = {
        starttag: '<!-- inject:template.js  -->',
        addRootSlash: false
    };

    var assets = useref.assets();
    var revAll = new RevAll();
    return gulp.src('auth-index.html')
        .pipe(inject(templateInjectFile, templateInjectOptions))
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref().on('error', gutil.log))
        .pipe(revAll.revision().on('error', gutil.log))
        .pipe(rev())
        .pipe(gulp.dest('build/'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('build/'));
});


gulp.task('auth-html-rename', ['auth-html-replace'], function () {
    gulp.src('build/auth-index.*.html')
    .pipe(rename('auth-index.html').on('error', gutil.log))
    .pipe(gulp.dest('build/'));
});


gulp.task('clean', ['auth-html-rename'], function () {
    var sources = [
        'build/index.**.html',
        'build/auth-index.**.html',
        'build/js/templateCacheHtml*.js',
        'build/js/authTemplateCacheHtml*.js',
        'build/glance'
    ];
    return gulp.src(sources, {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean', 'copy-swf']);

gulp.task('lint', function () {
    gulp.src('./js/*.js')
        .pipe(jslint.run({
            node: true,
            vars: true
        }))
        .pipe(jslint.report({
            reporter: require('jshint-stylish').reporter
        }));
});
