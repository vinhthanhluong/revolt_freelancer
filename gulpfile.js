const gulp = require('gulp');

const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
//Import sass - Build scss to css
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
// postcss
const sortMediaQueries = require('postcss-sort-media-queries');
const postcss = require('gulp-postcss');
const flatten = require('gulp-flatten');

//dirname
const devDir = './public/';
const src = './src/';

function style() {
    const processors = [sortMediaQueries({ sort: 'desktop-first' })];

    return gulp
        .src(src + 'scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(postcss(processors))
        .pipe(flatten())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(devDir + 'assets/css'))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: devDir,
        notify: false,
        open: true,
    });

    gulp.watch(src + 'scss/**/*.scss', gulp.series(style));
    gulp.watch(devDir + '**/*.html').on('change', browserSync.reload);
    gulp.watch(devDir + '**/*.js').on('change', browserSync.reload);
}

exports.default = gulp.series(style, serve);

// convert image to webp
gulp.task('convertwebp', async function () {
    const webp = (await import('gulp-webp')).default;
    return gulp
        .src(src + 'images/**/*.{jpg,jpeg,png}')
        .pipe(webp({ quality: 90 }))
        .pipe(gulp.dest(devDir + 'assets/images/'));
});

// copy svg + ico
gulp.task('copyAssets', function () {
    return gulp
        .src(src + 'images/**/*.{svg,ico}')
        .pipe(gulp.dest(devDir + 'assets/images/'));
});

gulp.task('img', gulp.series('convertwebp', 'copyAssets'));
