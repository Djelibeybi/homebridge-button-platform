'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');
const events = require('events');
const HomebridgeLib = require('homebridge-lib');
const FlicAccessory = require('./FlicAccessory');

class FlicPlatform extends HomebridgeLib.Platform {
  constructor (log, configJson, homebridge) {
    super(log, configJson, homebridge);
    if (configJson == null) {
      return;
    }
    this.on('accessoryRestored', this.accessoryRestored);
    this.once('heartbeat', this.init);

    this.config = {
      name: 'Flic',
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
      this.app.listen(this.config.port, () => this.log('Listening on port %s for inbound Flic button push event notifications', this.config.port));
      this.app.use(express.json());

      this.flicAccessories = {};
    } catch (error) {
      this.fatal(error);
    }
  }

  async init (beat) {
    const jobs = [];
    for (const button of this.config.buttons) {
      if (this.flicAccessories[button] == null) {
        const flicAccessory = new FlicAccessory(this, { button: button });
        jobs.push(events.once(flicAccessory, 'initialised'));
        this.flicAccessories[button] = flicAccessory;
        this.setupRoute(this.flicAccessories[button]);
      } else {
        this.flicAccessories[button].setAlive();
      }
    }
    for (const job of jobs) {
      await job;
    }
    this.debug('initialised');
    this.emit('initialised');
  }

  accessoryRestored (className, version, id, name, context) {
    if (className !== 'FlicAccessory') {
      this.warn(
        'removing cached %s accessory %s',
        className, context.button
      );
      return;
    }
    const flicAccessory = new FlicAccessory(this, context);
    this.flicAccessories[context.button] = flicAccessory;
    this.setupRoute(flicAccessory);
  }

  setupRoute (accessory) {
    const uri = '/flic-' + accessory.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    this.debug('creating route for %s via %s', accessory.name, uri);

    this.app.post(uri, [
      check('event').isIn(['click', 'double-click', 'hold'])
    ], (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      } else {
        var event = req.body.event;
        res.status(200).send('Success');
        this.log('Received POST request on %s to trigger a [%s] event for %s', uri, event, accessory.name)
      }
    });
  }
}

module.exports = FlicPlatform;
