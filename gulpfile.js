const { series, parallel, src, dest, watch } = require('gulp')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-csso')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const seq = require('gulp-sequence')
const connect = require('gulp-connect')
const imagemin = require('gulp-imagemin')
const imageResize = require('gulp-image-resize')
const del = require('del')
const htmlreplace = require('gulp-html-replace')

function clean() {
    return del(['build/**/*'])
}

function images() {
    return src('src/images/**/*.jpg')
        .pipe(imagemin())
        .pipe(dest('build/images'))
}

function svg() {
    return src('src/images/*.svg')
        .pipe(dest('build/images'))
}

function png() {
    return src('src/images/**/*.png')
        .pipe(dest('build/images'))
}

function html() {
    return src(['src/*.html', 'src/*.ico'])
        .pipe(htmlreplace({
            'header': { src: src('src/blocks/header.html') },
            'menu': { src: src('src/blocks/menu.html') },
            'footer': { src: src('src/blocks/footer.html') }
        }))
        .pipe(dest('build/'))
}

function css() {
    return src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(dest('build/css'))
}

function js() {
    return src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(dest('build/js'))
}

function maps() {
    return src('src/maps/*.kmz')
        .pipe(dest('build/maps'))
}

function fonts() {
    return src('src/fonts/*.*')
        .pipe(dest('build/fonts'))
}

function downloads() {
    return src('src/download/*.*')
        .pipe(dest('build/download'))
}

function server() {
    connect.server({
        root: 'build',
        livereload: true
    })
}

function reload() {
    return src('src/*.html')
        .pipe(connect.reload())
}

function startWatch() {
    server()
    startDefault()
    const watcher = watch('src/**/*')
    watcher.on('change', () => {
        return series(startDefault, reload)((err) => {
            if (err) {
                console.error(err)
            }
        })
    })
}

const startDefault = series(clean, parallel(html, css, js, images, svg, png, maps, fonts, downloads))

exports.watch = startWatch
exports.default = startDefault