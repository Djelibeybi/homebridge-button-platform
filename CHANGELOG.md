# Change Log

All notable changes to this project will be documented in this file.

## 1.4.3 (2021-05-23)

* Updated [`homebridge-lib`](https://github.com/ebaauw/homebridge-lib) to v5.1.3
  which requires:
  * homebridge: v1.3.4
  * Node.js: 14.17.0
* Code cleanup and review

## 1.4.2 (2021-05-21)

* Fix #46: `POST` requests were not calling the right function
* Updated `express-validator` dependency to v6.11.1

## 1.4.1 (2021-04-19)

Buttons have batteries! The virtual button will now reflect the current
battery level if triggered by a Flic 2 button. A battery level of less than
15% is flagged as low.

The patch version bump to 1.4.1 was caused by me breaking the publish automation
and having to do it twice.

## 1.3.0 (2021-02-26)

Bump dependencies as HAP-NodeJS is not setting eventOnlyCharacteristic properly
and homebridge-lib 5.0.9 includes a workaround for this.

## 1.2.0 (2020-11-10)

Bump dependencies and minimum requirements:

* [`homebridge-lib`](https://github.com/ebaauw/homebridge-lib) to v4.8.0 which requires:
  * Node.js v14.15.0 LTS
  * Homebridge 1.1.0

## 1.1.5 (2020-10-10)

Bump dependencies and minimum requirements:

* [`homebridge-lib`](https://github.com/ebaauw/homebridge-lib) to v4.7.16 which requires:
  * Node.js v12.19.0 LTS
  * Homebridge 1.1.0

## 1.1.4 (2020-07-12)

Bump dependencies:

* [`homebridge-lib`](https://github.com/ebaauw/homebridge-lib) to v4.7.12
* Node.js v12.18.2 LTS;
* bonjour-hap v3.5.11.

## 1.1.3 (2020-06-01)

* Disable heartbeat for each button.
* Remove check for configuration as Homebridge handles this automatically.
* Update `homebridge-lib` dependency to `4.7.7`.
* Updated minimum Homebridge version to `1.1.0`.
* Updated minimum Node.js version to `12.17.0 LTS`.

## 1.1.2 (2020-05-24)

* Remove stale buttons automatically
* Update README.md to indicate what happens on button rename

## 1.1.0 (2020-05-20)

* Enable `GET` requests to trigger button events
* Update `homebridge-lib` dependency to `4.7.5`
* Update `express-validator` dependency to `6.5.0`

## 1.0.5 (2020-05-01)

* Updated `homebridge-lib` dependency to `4.6.1`.

## 1.0.4 (2020-03-15)

* Removed `semistandard` as a development dependency.

## 1.0.3 (2020-03-15)

* Updated `homebridge-lib` dependency to `4.5.5`.

## 1.0.2 (2020-03-15)

* Removed the custom `UUIDGen` function as `homebridge-lib` handles this
  internally.

## 1.0.1 (2020-03-15)

* Initial release to NPM as `homebridge-button-platform`
* Enable config via `homebridge-config-ui-x`

## 1.0.0

* Initial release
