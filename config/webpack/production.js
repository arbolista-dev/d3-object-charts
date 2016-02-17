var webpack = require("webpack"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

const ROOT = __dirname + "/../../";

module.exports = {
  entry: ROOT + "src/main.js",
  devtool: "source-map",
  output: {
    path: ROOT + "build/production",
    filename: "bundle.min.js",
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css", "sass")
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        presets: ["es2015"],
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin("style.min.css", {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false,
        semicolons: true
      },
      sourceMap: true
    })
  ],
  target: 'web'
};
