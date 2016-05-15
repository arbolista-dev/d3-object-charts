var webpack = require('webpack');

const ROOT = __dirname + '/../../';

module.exports = {
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
    }],
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      d3: 'd3',
      'window.d3': 'd3'
    }),
  ],
};
