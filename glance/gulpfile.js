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

gulp.task('copy-confdev', function() {
    gulp.src('js/confdev.js')
        .pipe(gulp.dest('build/js/'));
});

gulp.task('copy-pics', ['copy-confdev'], function() {
    gulp.src('pics/*')
        .pipe(gulp.dest('build/pics/'));
});

gulp.task('copy-fonts', ['copy-pics'], function() {
    var sources = ['bower_components/bootstrap/dist/fonts/*', 'bower_components/font-awesome/fonts/*'];
    gulp.src(sources)
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('copy-swf', ['copy-fonts'], function() {
    var sources = ['bower_components/zeroclipboard/dist/ZeroClipboard.swf'];
    return gulp.src(sources)
        .pipe(gulp.dest('build/js'));
});

//gulp.task('min-html', function() {
//    var sources = 'views/**/*.html';
//    var options = {collapseWhitespace: true};
//    return gulp.src(sources)
//        .pipe(htmlmin(options).on('error', gutil.log))
//        .pipe(gulp.dest('build/views'));
//});


//utils html to js
gulp.task('template-min-utils', function () {
    return gulp.src('utils/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlUtils.js', {
            module: 'glance.utils',
            root: '/utils'
        }))
        .pipe(gulp.dest('build/js/'));
});

gulp.task('template-min-user', ['template-min-utils'], function () {
    return gulp.src('user/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlUser.js', {
            module: 'glance.user',
            root: '/user'
        }))
        .pipe(gulp.dest('build/js/'));
});

//application html to js
gulp.task('template-min-app', ['template-min-user'], function () {
    return gulp.src('application/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlApp.js', {
            module: 'glance.app',
            root: '/application'
        }))
        .pipe(gulp.dest('build/js/'));
});

//image html to js
gulp.task('template-min-image', ['template-min-app'], function () {
    return gulp.src('image/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(angularTemplatecache('templateCacheHtmlImage.js', {
            module: 'glance.image',
            root: '/image'
        }))
        .pipe(gulp.dest('build/js/'));
});
// views html to js
gulp.task('template-min', ['template-min-image'], function () {
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

gulp.task('html-replace', ['template-min'], function() {

    var templateInjectFile = gulp.src('build/js/templateCacheHtml*.js', { read: false });
    var templatenjectOptions = {
        starttag: '<!-- inject:template.js  -->',
        addRootSlash: false
    };

    var assets = useref.assets();
   // var options = {collapseWhitespace: true};
    var revAll = new RevAll();
    return gulp.src('index.html')
        .pipe(inject(templateInjectFile, templatenjectOptions))
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref().on('error', gutil.log))
        .pipe(revAll.revision().on('error', gutil.log))
        .pipe(gulp.dest('build/'))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest('build/'));
});

gulp.task('html-rename', ['html-replace'], function() {
    gulp.src('build/index.*.html')
      .pipe(rename('index.html').on('error', gutil.log))
      .pipe(gulp.dest('build/'));
});

gulp.task('clean', ['html-rename'], function() {
    var sources = [
      'build/index.**.html',
      'build/js/templateCacheHtml*.js'
    ];
    return gulp.src(sources, {read: false})
        .pipe(clean());
});

gulp.task('rev', function() {
    gulp.src('build/index.html')
        .pipe(rev())
        .pipe(gulp.dest('build/'));
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
