# Button Platform for Homebridge

[![verified-by-homebridge](https://badgen.net/badge/homebridge/verified/purple)](https://github.com/homebridge/homebridge/wiki/Verified-Plugins)

This Homebridge platform plugin creates virtual buttons that can be triggered using HTTP requests. It was designed to provide HomeKit support for [Flic smart buttons](https://flic.io/) which don't have native HomeKit support yet but can be leveraged by anything that can send HTTP requests.

## Install

The simplest method to install and configure this plugin is via [`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x).

To install manually, run the following command in your Homebridge directory. Depending on how you installed Homebridge, you may need to add the `-g` and/or the `--unsafe-perms` parameters:

```shell
$ npm install homebridge-button-platform
+ homebridge-button-platform@1.0.4
added 95 packages from 71 contributors and audited 204 packages in 4.509s
```

## Configuration

The plugin can be configured via the [`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x) admin interface.

To configure the plugin manually, add the following configuration to the `platforms` block of your Homebridge `config.json` file:

```json
"platforms": [
    {
        "platform": "button-platform",
        "port": 3001,
        "buttons": [
            "My Button",
            "Your Button",
            "Their Button"
        ]
    }
  ]
```

You can add as many buttons to the array as you need. Each button will get its own URI on which the server will listen for events. You can determine the URI for each button by checking the Homebridge logs for `The Event URI for <button name> is: /button-button-name` strings.

## Sending events

To trigger a button event, send an HTTP `POST` request to your Homebridge IP address and the port specified in the configuration of the platform, plus the URI for the button.

You must set the Content-Type header to either `application/json` or `application/x-www-form-urlencoded`.

The body of the request needs a field named `event` with a value of one of the following:

* `click` or `single-press`
* `double-click` or `double-press`
* `hold` or `long-press`

For example, to send a double press event to a button using `curl`:

```shell
$ curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'event=double-click' \
  http://<homebridge>:<port>/<uri>
```

The plugin also accepts `application/json` payloads:

```shell
$ curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"event": "double-click"}' \
  http://<homebridge>:<port>/<uri>
```

## Example Flic button configuration

Here’s a screenshot of what an Internet Request action should look like in the Flic app if your Homebridge server’s IP address was 192.168.0.100 and the plugin was listening on port 3001:

![internet-request](https://omg.dje.li/images/internet-request.png)

The values are as follows:

| Field | Value |
|:------|:------|
| Hub Action | **Internet Request** |
| URL | `http://homebridge_ip:3001/button_uri` |
| Content Type | `application/x-www-form-urlencoded` |
| Body | `event=click` or `event=double-click` or `event=hold` |

## Troubleshooting

Check the Homebridge logs for any warnings as the plugin will log any attempts to trigger an invalid event or any invalid URIs.
