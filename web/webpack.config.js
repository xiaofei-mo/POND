/*
 * Copyright (C) 2017 Mark P. Lindsay
 * 
 * This file is part of mysteriousobjectsatnoon.
 *
 * mysteriousobjectsatnoon is free software: you can redistribute it and/or 
 * modify it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * mysteriousobjectsatnoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mysteriousobjectsatnoon.  If not, see 
 * <http://www.gnu.org/licenses/>.
 */

var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

var shouldMinimize = process.argv.indexOf('--minimize') !== -1
var sassLoader = {
  outputStyle: 'nested'
}
var plugins = [ new ExtractTextPlugin('./web/static/style.css') ]
if (shouldMinimize) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
  sassLoader = {
    outputStyle: 'compressed'
  }
}

module.exports = {
  devtool: 'source-map',
  entry: {
    js: './src/client.js',
    css: './src/sass/style.scss'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
                                          'css?sourceMap!sass?sourceMap')
      },
      {
        test: /\.js$/,
        loader: 'babel?cacheDirectory',
        exclude: /(node_modules|public)/
      }
    ]
  },
  output: {
    filename: './web/static/bundle.js',
  },
  plugins: plugins,
  sassLoader: sassLoader
}
