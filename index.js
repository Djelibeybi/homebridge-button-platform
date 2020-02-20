'use strict';

const FlicPlatform = require('./lib/FlicPlatform');
const PackageJson = require('./package.json');

module.exports = function (homebridge) {
  FlicPlatform.loadPlatform(homebridge, PackageJson, 'flic-platform', FlicPlatform);
};
