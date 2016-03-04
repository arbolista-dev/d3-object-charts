var webpack = require('webpack'),
  ExtractTextPlugin = require("extract-text-webpack-plugin");;

const ROOT = __dirname + '/../../';

module.exports = {
  cache: true,
  entry: ROOT + 'src/dev.js',
  output: {
    path: ROOT + 'build/development',
    filename: 'bundle.dev.js',
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css", "sass")
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        cacheDirectory: true
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin("style.css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      d3: "d3",
      "window.d3": "d3"
    })
  ],
  debug: true
};
