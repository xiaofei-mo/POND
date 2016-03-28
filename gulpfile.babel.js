import browserify from 'browserify'
import gulp from 'gulp'
import gutil from 'gulp-util'
import source from 'vinyl-source-stream'
import sass from 'gulp-sass'
import rename from 'gulp-rename'

const destDir = 'public'

gulp.task('watch', gulp.series(
  _buildJs, 
  _buildSass,
  gulp.parallel(_watchJs, _watchSass)
))

gulp.task('build', gulp.series(
  _buildJs,
  _buildSass
))

function _buildJs() {
  // Browserify and babelify options are in package.json
  return browserify('src/client.js', { debug: true, paths: ['./'] })
    .transform('babelify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(destDir))
}

function _buildSass() {
  return gulp.src("src/sass/style.scss")
    .pipe(sass())
    .pipe(rename("style.css"))
    .pipe(gulp.dest(destDir))
}

function _watchJs() {
  return gulp.watch(['src/**/*.js'], gulp.series(
    (done) => {
      gutil.log(gutil.colors.green('JS file changed'))
      setTimeout(() => {
        done()
      }, 1000)
    },
    _buildJs
  ))
}

function _watchSass() {
  return gulp.watch("src/sass/**/*.scss", gulp.series(
    (done) => {
      gutil.log(gutil.colors.green("SASS file changed"))
      setTimeout(() => {
        done()
      }, 1000)
    },
    _buildSass
  ))
}
