'use strict';

const crypto = require('crypto');
const HomebridgeLib = require('homebridge-lib');
//const FlicService = require('./FlicService');

function generateUUID (data) {
  // https://github.com/KhaosT/HAP-NodeJS/blob/master/src/lib/util/uuid.ts#L7
  const sha1sum = crypto.createHash('sha1');
  sha1sum.update(data);
  const s = sha1sum.digest('hex');
  let i = -1;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    i += 1;
    switch (c) {
      case 'y':
        return ((parseInt('0x' + s[i], 16) & 0x3) | 0x8).toString(16);
      case 'x':
      default:
        return s[i];
    }
  });
}

class FlicAccessory extends HomebridgeLib.AccessoryDelegate {
  constructor (platform, context) {
    const params = {
      name: context.button,
      id: generateUUID(context.button.toLowerCase().replace(/[^a-z0-9]/gi, '-')),
      manufacturer: 'Shortcut Labs',
      model: 'Flic 2',
      category: platform.Accessory.Categories.Switch
    };
    super(platform, params);

    this.context.button = context.button;

    setImmediate(() => {
      this.emit('initialised');
    });
  }
}

module.exports = FlicAccessory;
