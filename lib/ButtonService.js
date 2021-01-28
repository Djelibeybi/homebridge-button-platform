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
