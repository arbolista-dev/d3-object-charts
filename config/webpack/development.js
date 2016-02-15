var webpack = require('webpack');

const ROOT = __dirname + '/../../';

module.exports = {
  cache: true,
  entry: {
    app: ROOT + 'src/main.js',
  },
  output: {
    path: ROOT + 'build/development',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          cacheDirectory: true
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: [ROOT + 'node_modules']
  },
  plugins: [
      new webpack.ProvidePlugin({
          d3: "d3",
          "window.d3": "d3"
      })
  ],
  debug: true
};
