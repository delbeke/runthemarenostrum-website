const gulp = require('gulp')
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

gulp.task('connect', () => {
  connect.server({
    root: 'build',
    livereload: true
  })
})

gulp.task('clean', () => {
  return del(['build/**/*'])
})

gulp.task('images', () =>
  gulp.src('src/images/**/*.jpg')
    .pipe(imageResize({ width: 1500, crop: false, upscale: false }))
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
)

gulp.task('svg', () =>
  gulp.src('src/images/*.svg')
    .pipe(gulp.dest('build/images'))
)

gulp.task('png', () =>
  gulp.src('src/images/*.png')
    .pipe(gulp.dest('build/images'))
)

gulp.task('html', () => {
  return gulp.src(['src/*.html', 'src/*.ico'])
    .pipe(htmlreplace({
      'header': { src: gulp.src('src/blocks/header.html') },
      'menu': { src: gulp.src('src/blocks/menu.html') }
    }))
    .pipe(gulp.dest('build/'))
})

gulp.task('css', () => {
  return gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
})

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
})

gulp.task('maps', () =>
  gulp.src('src/maps/*.kmz')
    .pipe(gulp.dest('build/maps'))
)

gulp.task('reload', () => {
  return gulp.src('src/*.html')
    .pipe(connect.reload())
})

gulp.task('watch', ['connect', 'default'], () => {
  gulp.watch('src/**/*', () => {
    seq('default', 'reload')((err) => {
      if (err) {
        console.error(err)
      }
    })
  })
})

gulp.task('default', (cb) => seq('clean', ['html', 'css', 'js', 'images', 'svg', 'png', 'maps'])(cb))
