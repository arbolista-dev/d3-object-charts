var webpackConfig = require('./config/webpack/test.js');

module.exports = function(config) {
  config.set({

    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],

    autoWatch: false,
    files: [
      // 'node_modules/babel-polyfill/dist/polyfill.js',
      // 'src/main.js',
      'test/**/*.js'
    ],
    preprocessors: {
      // "src/main.js": ['webpack'],
      "test/**/*.js": ['webpack'],
    },

    singleRun: true, // exit after tests have completed
    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

  });
};
