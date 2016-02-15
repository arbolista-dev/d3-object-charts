import webpack from 'webpack';

const ROOT = __dirname + '/../../../';

module.exports = {
  entry: {
    app: ROOT + 'client/app',
    style: ROOT + 'client/style'
  },
  output: {
    filename: '[name].js',
    path: ROOT + 'client/build/development'
  },
  module: {
      loaders: [
          {
              test: /\.scss$/,
              loaders: ['style', 'raw', 'sass']
          }, {
              test: /\.css$/,
              loaders: ['style', 'raw']
          }, {
            test: /\.js$/,
            loader: 'babel'
          }, {
            test: /\.json$/,
            loader: 'json-loader'
          }
      ]
  },
  sassLoader: {
    includePaths: [ROOT + 'client', ROOT + 'node_modules']
  },
  plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
      }),
      new webpack.ProvidePlugin({
          d3: "d3",
          "window.d3": "d3"
      })
  ]
}
