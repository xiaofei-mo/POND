/*
 * Copyright (C) 2016 Mark P. Lindsay
 * 
 * This file is part of video-site.
 *
 * video-site is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * video-site is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with video-site.  If not, see <http://www.gnu.org/licenses/>.
 */

import browserify from 'browserify'
import gulp from 'gulp'
import gutil from 'gulp-util'
import source from 'vinyl-source-stream'
import sass from 'gulp-sass'
import rename from 'gulp-rename'

const destDir = 'public/static'

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
  return browserify('src/client.js', { debug: true })
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
