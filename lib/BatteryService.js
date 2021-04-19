/*
 *  Copyright 2021 Avi Miller
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const HomebridgeLib = require('homebridge-lib');

class BatteryService extends HomebridgeLib.ServiceDelegate {
  constructor (buttonAccessory, params) {
    super(buttonAccessory, params);
    this.buttonAccessory = buttonAccessory;
  }
  static get Battery() { return Battery; }
}

class Battery extends BatteryService {
  constructor(buttonAccessory, params = {}) {
    params.name = buttonAccessory.name + ' Battery';
    params.Service = buttonAccessory.Services.hap.Battery;
    super(buttonAccessory, params);

    this.addCharacteristicDelegate({
      key: 'batteryLevel',
      Characteristic: this.Characteristics.hap.BatteryLevel
    });
    this.addCharacteristicDelegate({
      key: 'statusLowBattery',
      Characteristic: this.Characteristics.hap.StatusLowBattery
    });
    this.addCharacteristicDelegate({
      key: 'chargingState',
      Characteristic: this.Characteristics.hap.ChargingState,
      silent: true,
      value: this.Characteristics.hap.ChargingState.NOT_CHARGEABLE
    });
  }

  updateBattery (batteryLevel) {
    this.values.batteryLevel = batteryLevel;

    // Set the low battery status indicator if there is less than 15% battery
    this.values.statusLowBattery = batteryLevel < 15
      ? this.Characteristics.hap.StatusLowBattery.BATTERY_LEVEL_LOW
      : this.Characteristics.hap.StatusLowBattery.BATTERY_LEVEL_NORMAL;
  }

}

module.exports = BatteryService;
