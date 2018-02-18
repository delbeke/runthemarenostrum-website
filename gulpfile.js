
var gulp = require('gulp')
var sass = require('gulp-sass')
var minifyCSS = require('gulp-csso')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var livereload = require('gulp-livereload')
var seq = require('gulp-sequence')

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
  return gulp.src('src/**/*')
    .pipe(livereload())
})

gulp.task('watch', () => {
  livereload.listen()
  gulp.watch('src/**/*', () => {
    seq('default', 'reload')((err) => {
      if (err) {
        console.error(err)
      }
    })
  })
})

gulp.task('default', ['html', 'css', 'js'])
