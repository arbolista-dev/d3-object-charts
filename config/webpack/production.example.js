import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

const ROOT = __dirname + '/../../../';

module.exports = {
  entry: {
    app: ROOT + 'client/app',
    style: ROOT + 'client/style'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    path: ROOT + 'client/build/production'
  },
  externals: {
    jquery: "$",
    d3: "d3"
  },
  module: {
    loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", "raw-loader!sass-loader")
        }, {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "raw-loader")
        }, {
          test: /\.js$/,
          loader: 'babel'
        }, {
          test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader"
        }
    ]
  },
  sassLoader: {
    includePaths: [ROOT + 'client', ROOT + 'node_modules']
  },
  // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
  plugins: [
      new ExtractTextPlugin("style.min.css", {
        allChunks: true
      }),
      new webpack.optimize.UglifyJsPlugin({minimize: true}),
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      })
  ]
};
