'use strict'
const pkg = require('../package')
const config = require('config')

module.exports = {
  port: 4000,
  title: 'oracle',
  firebase: config.get('firebase'),
  // when you use electron please set to relative path like ./
  // otherwise only set to absolute path when you're using history mode
  publicPath: '/',
  // disable babelrc by default
  babel: {
    babelrc: false,
    presets: ['vue-app']
  },
  postcss: [
    // add prefix via postcss since it's faster
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: ['last 2 versions', 'ie > 8']
    }),
    require('postcss-nested')
  ]
}
