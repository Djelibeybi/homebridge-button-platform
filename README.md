# homebridge-button-platform

A Homebridge platform plugin that creates virtual buttons that can be triggered using HTTP requests.

## Install

The simplest method to install and configure this plugin is via [`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x).

To install manually, run the following command in your Homebridge directory. Depending on how you installed Homebridge, you may need to add the `-g` and/or the `--unsafe-perms` parameters:

```
$ npm install homebridge-button-plugin
```

## Configuration

The plugin can be configured via the [`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x) admin interface.

To configure the plugin manually, add the following configuration to the `platforms` block of your Homebridge `config.json` file:

```
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

```
$ curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'event=double-click' \
  http://<homebridge>:<port>/<uri>
```

The plugin also accepts `application/json` payloads:

```
$ curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"event": "double-click"}' \
  http://<homebridge>:<port>/<uri>
```

## Troubleshooting

Check the Homebridge logs for any warnings as the plugin will log any attempts to trigger an invalid event or any invalid URIs.
