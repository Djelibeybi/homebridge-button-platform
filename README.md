# Button Platform for Homebridge

> **ARCHIVED** This plugin is no longer updated.

This Homebridge platform plugin creates virtual buttons that can be triggered
using HTTP requests. It was originally created to provide HomeKit support for
[Flic smart buttons](https://flic.io/) before the Flic Hub LR got native HomeKit
support but can be leveraged by anything that can send HTTP requests.

> **Flic Hub LR now supports HomeKit**: Flic released a firmware update for the
Flic Hub LR on 2 December 2020 which included native HomeKit support.
Visit <https://flic.io/homekit> for instructions on how to configure native
HomeKit access.

**This plugin requires a working home hub.**

Before you install, ensure you have [setup a HomePod, HomePod mini, Apple TV or
iPad as a home hub](https://support.apple.com/en-au/HT207057) for HomeKit. A
home hub is required to run automations triggered by the button events generated
by this plugin.

## Install

The simplest method to install and configure this plugin is via
[`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x).

To install manually, run the following command in your Homebridge directory.
Depending on how you installed Homebridge, you may need to add the `-g` and/or
the `--unsafe-perms` parameters:

```shell
npm install [-g|--unsafe-perms] homebridge-button-platform
```

The `-g` option will install the plugin globally and the `--unsafe-perms` option
is needed for some platforms to install successfully.

## Configuration

The plugin can be configured via the [`homebridge-config-ui-x`](https://www.npmjs.com/package/homebridge-config-ui-x)
admin interface.

To configure the plugin manually, add the following configuration to the
`platforms` block of your Homebridge `config.json` file:

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

You can add as many buttons to the array as you need. Each button will get its
own URI on which the server will listen for events. You can determine the URI
for each button by checking the Homebridge logs for
`The Event URI for <button name> is: /button-button-name` strings.

> **Note:** renaming a button in `config.json` is the same as deleting the old
button and adding a new one, i.e. any configuration will be lost.

## Sending events

To trigger a button event, send an HTTP `GET` request with a specific query
string value or an HTTP `POST` request to your Homebridge hostname or IP address
and the port specified in the configuration of the platform, plus the URI for the
button.

### Using a `GET` request

The simplest method of triggering an event is to use a simple `GET` request with
the query string parameter of `event` set to one of the valid event types:

* `click` or `single-press`
* `double-click` or `double-press`
* `hold` or `long-press`

For example, to send a single click event to a button using `curl`:

```shell
$ curl http://<homebridge>:<port>/uri?event=click
Success
```

You could also use this URL with a normal web browser.

### Example Flic button configuration

Here’s a screenshot of what an Internet Request action should look like in the
Flic app if your Homebridge server is `homebridge.local` and the plugin
was listening on port 3001:

![flic-config](docs/flic-config.png)

The values are as follows:

| Field | Value |
|:------|:------|
| Hub Action | **Internet Request** |
| URL | `http://homebridge.local:3001/button-name?event=click` |
| Type | **GET** |

### Battery level

The plugin from v1.5 onwards automatically creates a
battery service when it detects it's being triggered by a Flic button and will
update the battery level with the current value from the Flic whenever the
button is pushed.

### Example Stream Deck configuration

You can use the "Website" Stream Deck action to trigger an event. In the
Stream Deck configuration, drag the "Website" action to a key and configure
the URL to be `http://homebridge.local:3001/button-name?event=click` which uses the
same parameters as the `GET` request above:

![streamdeck-key](docs/streamdeck-config.png)

> **Top tip:** If you enable the `GET request in background` option, a browser will
> not open when you hit the key.

## Using a `POST` request

If you use an HTTP `POST` request you must set the Content-Type header to either
`application/json` or `application/x-www-form-urlencoded`. The body of the request
needs a field named `event` with a value of one of the event types defined above.

For example, to send a double press event to a button using `curl` with a JSON
payload:

```shell
$ curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"event": "double-click"}' \
  http://<homebridge>:<port>/<uri>
```

You can also `POST` with an `application/x-www-form-urlencoded` payload:

```shell
$ curl -X POST \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'event=double-click' \
  http://<homebridge>:<port>/<uri>
```

This is useful when used in with a larger form-based application.

## Troubleshooting

Check the Homebridge logs for any warnings as the plugin will log any attempts
to trigger an invalid event or any invalid URIs.
