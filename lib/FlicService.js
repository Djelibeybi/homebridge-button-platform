'use strict';

const HomebridgeLib = require('homebridge-lib');

class FlicService extends HomebridgeLib.ServiceDelegate {
  static get ProgammableSwitchEvent () { return ProgrammableSwitchEvent; }
}

class ProgammableSwitchEvent extends FlicService {
  constructor (flicAccessory, params = {}) {
    params.name = flicAccessory.name + ' ProgrammableSwitchEvent';
    params.Service = flicAccessory.Services.ProgammableSwitchEvent;
    super(flicAccessory, params);
  }
}

module.exports = FlicService;
