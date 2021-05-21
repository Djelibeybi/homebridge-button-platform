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

const express = require('express');
const { check, header, oneOf, validationResult } = require('express-validator');
const events = require('events');
const HomebridgeLib = require('homebridge-lib');
const ButtonAccessory = require('./ButtonAccessory');

class ButtonPlatform extends HomebridgeLib.Platform {
  constructor (log, configJson, homebridge) {
    super(log, configJson, homebridge);

    this.once('heartbeat', this.init);

    this.config = {
      name: 'Buttons',
      port: 3001,
      buttons: []
    };

    const optionParser = new HomebridgeLib.OptionParser(this.config, true);
    optionParser.stringKey('name');
    optionParser.intKey('port', 1025, 65535);
    optionParser.listKey('buttons');
    optionParser.on('usageError', (message) => {
      this.warn('Configuration issue: %s', message);
    });

    try {
      optionParser.parse(configJson);
      if (this.config.buttons.length === 0) {
        this.warn('Configuration issue: no buttons configured.');
      }

      this.app = express();
      this.app.listen(this.config.port, () => this.log('Listening on port %s for inbound button push event notifications', this.config.port));
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));

      this.buttonAccessories = {};
    } catch (error) {
      this.fatal(error);
    }
  }

  async init (beat) {
    const jobs = [];
    for (const button of this.config.buttons) {
      if (this.buttonAccessories[button] == null) {
        const buttonAccessory = new ButtonAccessory(this, { button: button });
        jobs.push(events.once(buttonAccessory, 'initialised'));
        this.setupRoute(buttonAccessory);
        this.buttonAccessories[button] = buttonAccessory;
      }
    }
    for (const job of jobs) {
      await job;
    }

    // Express handler for invalid paths
    this.app.use(function (req, res) {
      res.status(404).send('Button not found.');
      this.warn('Received event for unconfigured Button path: %s', req.originalUrl);
    }.bind(this));

    // Express handler for server-side errors
    this.app.use(function (err, req, res) {
      res.status(500).send('Server error.');
      this.fatal(err.stack);
    }.bind(this));

    this.debug('initialised');
    this.emit('initialised');
  }

  setupRoute (accessory) {
    const uri = '/button-' + accessory.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    this.log('The Event URI for %s is: %s', accessory.name, uri);

    // Enable GET requests with event in the query string
    this.app.get(uri, [
      check('event').isIn(['click', 'double-click', 'hold', 'single-press', 'double-press', 'long-press']),
      oneOf([
        header('button-battery-level').not().exists(),
        header('button-battery-level').isInt({ min: 0, max: 100 })
      ], 'button-battery-level must be an integer between 0 and 100 which represents the percentage battery level remaining.'),
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        var event = req.query.event;
        switch (event) {
          case 'click':
          case 'single-press':
            accessory.switchService.triggerEvent(0);
            break;
          case 'double-click':
          case 'double-press':
            accessory.switchService.triggerEvent(1);
            break;
          case 'hold':
          case 'long-press':
            accessory.switchService.triggerEvent(2);
            break;
        }

        if (req.headers['button-battery-level']) {
          accessory.batteryService.updateBattery(req.headers['button-battery-level']);
        }

        res.status(200).send('OK');
      }
    })

    // Enable POST requests with event in the body of the request
    this.app.post(uri, [
      check('event').isIn(['click', 'double-click', 'hold', 'single-press', 'double-press', 'long-press']),
      oneOf([
        header('button-battery-level').not().exists(),
        header('button-battery-level').isInt({ min: 0, max: 100 })
      ], 'button-battery-level must be an integer between 0 and 100 which represents the percentage battery level remaining.'),
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        var event = req.body.event;
        switch (event) {
          case 'click':
          case 'single-press':
            accessory.switchService.triggerEvent(0);

            break;
          case 'double-click':
          case 'double-press':
            accessory.switchService.triggerEvent(1);
            break;
          case 'hold':
          case 'long-press':
            accessory.switchService.triggerEvent(2);
            break;
        }
        if (req.headers['button-battery-level']) {
          accessory.batteryService.updateBattery(req.headers['button-battery-level']);
        }
        res.status(200).send('OK');
      }
    });
  }
}

module.exports = ButtonPlatform;
