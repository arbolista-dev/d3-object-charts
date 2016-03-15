var webpackConfig = require('./config/webpack/test.js');

module.exports = function(config) {
  config.set({

    // browsers: ['Chrome', 'PhantomJS'],
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],

    autoWatch: false,
    files: [
      // each file acts as entry point for the webpack configuration
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/fixtures/*.json',
      'test/helper.js',
      'test/main.js'
    ],
    preprocessors: {
      'test/fixtures/*.json': ['html2js'],
      'test/helper.js': ['webpack', 'sourcemap'],
      'test/main.js': ['webpack', 'sourcemap'],
    },
    // reporters: ['progress'],
    reporters: ['spec'],
    singleRun: true, // exit after tests have completed
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
  });
};
