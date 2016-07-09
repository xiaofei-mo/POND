var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

var shouldMinimize = process.argv.indexOf('--minimize') !== -1
var sassLoader = {
  outputStyle: 'nested'
}
var plugins = [ new ExtractTextPlugin('./public/style.css') ]
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
    filename: './public/bundle.js',
  },
  plugins: plugins,
  sassLoader: sassLoader
}
