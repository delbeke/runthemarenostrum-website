const gulp = require('gulp')
const sass = require('gulp-sass')
const minifyCSS = require('gulp-csso')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const seq = require('gulp-sequence')
const connect = require('gulp-connect')

gulp.task('connect', () => {
  connect.server({
    root: 'build',
    livereload: true
  })
})

gulp.task('html', () => {
  return gulp.src('src/*.html')
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

gulp.task('default', ['html', 'css', 'js'])
