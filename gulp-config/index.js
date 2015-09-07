'use strict';
var pkg = require('../package.json');
var config = {
    clean: ['coverage', 'log/**/*'],
    mocha: ['test/**/index.js'],
    publish: ['client', 'server'],
    src: ['server/**/*.js', 'client/**/*.js']
};

config.eslint = config.src.concat(['test/**/*.js', 'gulp-config/*.js', 'gulpfile.js', 'make']);

module.exports = config;
