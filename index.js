// homebridge-button-platform/index.js
// Copyright (c) 2020 Avi Miller.
//
// Homebridge platform plugin to create virtual StatelessProgrammableSwitch buttons

'use strict';

const ButtonPlatform = require('./lib/ButtonPlatform');
const PackageJson = require('./package.json');

module.exports = function (homebridge) {
  ButtonPlatform.loadPlatform(homebridge, PackageJson, 'button-platform', ButtonPlatform);
};
