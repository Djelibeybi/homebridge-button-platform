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

"use strict";

const HomebridgeLib = require("homebridge-lib");
const ButtonService = require("./ButtonService");
const BatteryService = require("./BatteryService");

class ButtonAccessory extends HomebridgeLib.AccessoryDelegate {
  constructor(platform, context) {
    const params = {
      name: context.button,
      id: context.button.toLowerCase().replace(/[^a-z0-9]/gi, "-"),
      manufacturer: "Homebridge",
      model: "Virtual Button",
      category: platform.Accessory.Categories.Switch,
    };
    super(platform, params);

    this.context.button = context.button;
    this.batteryService = new BatteryService.Battery(this);
    this.switchService = new ButtonService.StatelessProgrammableSwitch(this);

    this.heartbeatEnabled = false;

    setImmediate(() => {
      this.emit("initialised");
    });
  }
}

module.exports = ButtonAccessory;
