// homebridge-button-platform/lib/ButtonService.js
// Copyright (c) 2020 Avi Miller.
//
// Homebridge platform plugin to create virtual StatelessProgrammableSwitch buttons

'use strict';

const HomebridgeLib = require('homebridge-lib');

class ButtonService extends HomebridgeLib.ServiceDelegate {
  static get StatelessProgrammableSwitch () { return StatelessProgrammableSwitch; }
}

class StatelessProgrammableSwitch extends ButtonService {
  constructor (buttonAccessory, params = {}) {
    params.name = buttonAccessory.name + ' Switch';
    params.Service = buttonAccessory.Services.hap.StatelessProgrammableSwitch;
    super(buttonAccessory, params);
    this.addCharacteristicDelegate({
      key: 'programmableSwitchEvent',
      Characteristic: this.Characteristics.hap.ProgrammableSwitchEvent
    });
  }

  triggerEvent (event) {
    this.values.programmableSwitchEvent = event;
  }
}

module.exports = ButtonService;
