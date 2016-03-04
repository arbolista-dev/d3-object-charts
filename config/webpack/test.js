var webpack = require("webpack");

const ROOT = __dirname + "/../../";

module.exports = {
  entry: ROOT + "src/main.js",
  output: {
    path: ROOT + "build/test",
    filename: "bundle.js",
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
    }],
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      d3: "d3",
      "window.d3": "d3"
    })
  ],
};
