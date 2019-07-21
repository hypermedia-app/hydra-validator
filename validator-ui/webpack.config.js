const { resolve } = require('path');
const merge = require('webpack-merge');
const createDefaultConfig = require('@open-wc/building-webpack/modern-config');

// If you don't need IE11 support, use the modern-config instead
// import createDefaultConfig from '@open-wc/building-webpack/modern-config';

const config = createDefaultConfig({
  input: resolve(__dirname, './index.html'),
});

module.exports = merge(config, {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
});
