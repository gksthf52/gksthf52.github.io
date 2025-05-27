var gulp = require('gulp');
var scss = require('gulp-sass')(require('sass'));
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var del = require('del');
var include = require('gulp-html-tag-include');


var PATH = {
        HTML: './workspace/html',
        ASSETS: {
            FONTS: './workspace/assets/fonts',
            IMAGES: './workspace/assets/images',
            STYLE: './workspace/assets/css',
            JS: './workspace/assets/js',
            LIB: './workspace/assets/lib',
            FONTS: './workspace/assets/fonts',
        }
    },
    DEST_PATH = {
        HTML: './dist/',
        INC: './dist/inc',
        ASSETS: {
            FONTS: './dist/assets/fonts',
            IMAGES: './dist/assets/images',
            STYLE: './dist/assets/css',
            JS: './dist/assets/js',
            LIB: './dist/assets/lib',
            FONTS: './dist/assets/fonts',
        }
    };
gulp.task('scss:compile', () => {
    return new Promise(resolve => {
        var options = {
            outputStyle: "expanded",
            indentType: "tab",
            indentWidth: 1,
            precision: 6,
            sourceComments: false
        };
        gulp
            .src(PATH.ASSETS.STYLE + '/*.scss')
            .pipe(sourcemaps.init())
            .pipe(scss(options))
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE))
            .pipe(browserSync.reload({stream: true}));
        resolve();
    });
});

gulp.task('clean', () => {
    return new Promise(resolve => {
        del.sync(DEST_PATH.HTML);
        resolve();
    });
});

gulp.task('clean-dev', () => {
    return new Promise(resolve => {        
        del.sync('./dist/inc');
        resolve();
    });
});

gulp.task('imagemin', () => {
    return new Promise(resolve => {
        gulp
            .src([PATH.ASSETS.IMAGES + '/**/*.{gif,jpg,png,svg,pdf}', PATH.ASSETS.IMAGES + '/*.{gif,jpg,png,svg,pdf}'])
            .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES));

        resolve();
    });
});

gulp.task('fonts', () => {
    return new Promise(resolve => {
        gulp
            .src(PATH.ASSETS.FONTS + '/*.*')
            .pipe(gulp.dest(DEST_PATH.ASSETS.FONTS));
        resolve();
    });
});

gulp.task('html', () => {
    return new Promise(resolve => {
        gulp
            .src([PATH.HTML + '/**/*.html', '!./workspace/html/inc/*.html', PATH.HTML + '/*.html'])
            .pipe(include())
            .pipe(gulp.dest(DEST_PATH.HTML))
            .pipe(browserSync.reload({stream: true}));
            del.sync(DEST_PATH.INC);
        resolve();
    });
});



gulp.task('nodemon:start', () => {
    return new Promise(resolve => {
        nodemon({script: 'app.js', watch: DEST_PATH.HTML});
        resolve();
    })
});

gulp.task('library', () => {
    return new Promise(resolve => {
        gulp
            .src(PATH.ASSETS.LIB + '/*.js')
            .pipe(gulp.dest(DEST_PATH.ASSETS.LIB));
        resolve();
    });
});

gulp.task('script:concat', () => {
    return new Promise(resolve => {
        gulp
            .src(PATH.ASSETS.JS + '/*.js')
            // .pipe(concat('common.js'))
            .pipe(gulp.dest(DEST_PATH.ASSETS.JS))
            .pipe(browserSync.reload({stream: true}));
        resolve();
    })
});

gulp.task('watch', () => {
    return new Promise(resolve => {
        gulp.watch([PATH.HTML + '/**/*.html', PATH.HTML + '/*.html'], gulp.series(['html']));
        gulp.watch([PATH.ASSETS.STYLE + "/*.scss"], gulp.series(['scss:compile']));
        gulp.watch(PATH.ASSETS.JS + "/**/*.js", gulp.series(['script:concat']));
        gulp.watch(PATH.ASSETS.IMAGES + "/**/*.{gif,jpg,png,svg}", gulp.series(['imagemin']));
        resolve();
    });
});

gulp.task('browserSync', () => {
    return new Promise(resolve => {
        browserSync.init(null, {
            proxy: 'http://localhost:8000',
            port: 8080
        });
        resolve();
    });
});

/*시리즈 정리*/

var allSeries = gulp.series([
    'clean',
    'scss:compile',
    'html',    
    'script:concat',
    'imagemin',
    'fonts',
    'library',
    'nodemon:start',    
    'browserSync',
    'watch'
]);

gulp.task('default', allSeries);
