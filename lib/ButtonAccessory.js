// homebridge-button-platform/lib/ButtonAccessory.js
// Copyright (c) 2020 Avi Miller.
//
// Homebridge platform plugin to create virtual StatelessProgrammableSwitch buttons

'use strict';

const HomebridgeLib = require('homebridge-lib');
const ButtonService = require('./ButtonService');

class ButtonAccessory extends HomebridgeLib.AccessoryDelegate {
  constructor (platform, context) {
    const params = {
      name: context.button,
      id: context.button.toLowerCase().replace(/[^a-z0-9]/gi, '-'),
      manufacturer: 'Homebridge',
      model: 'Virtual Button',
      category: platform.Accessory.Categories.Switch
    };
    super(platform, params);

    this.context.button = context.button;
    this.buttonServices = {
      statelessProgrammableSwitch: new ButtonService.StatelessProgrammableSwitch(this)
    };

    this.heartbeatEnabled = false;

    setImmediate(() => {
      this.emit('initialised');
    });
  }
}

module.exports = ButtonAccessory;
