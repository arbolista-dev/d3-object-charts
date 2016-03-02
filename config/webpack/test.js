var webpack = require('webpack');

const ROOT = __dirname + '/../../';

module.exports = {
  cache: true,
  entry: ROOT + 'examples/entry.js',
  output: {
    path: ROOT + 'build/test',
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015'],
        cacheDirectory: true
      }
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      d3: "d3",
      "window.d3": "d3"
    })
  ],
  debug: true
};
