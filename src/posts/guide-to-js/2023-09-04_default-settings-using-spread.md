---
title: Building a Default Settings System Using the Spread Operator
title_short: Default Settings System
part: 10
updated: "2026-11-26T12:00:00Z"
intro: "Today, we'll have a look at how the spread operator works by building a small system for managing default settings and overrides."
---

In many applications, you often need a set of default settings as a baseline
configuration. However, it's equally crucial to allow users or developers to
customize these settings when necessary. The challenge is to create a system
that seamlessly combines default settings with user-defined preferences without
creating complex conditional logic.

## Enter the Spread Operator

JavaScript introduced the spread operator (`...`) as a concise way to manipulate
arrays and objects. It's also a powerful tool for merging objects, which makes
it perfect for our default settings system.

## Defining Default Settings

```javascript
const defaultSettings = {
  apiKey: "your-api-key",
  apiUrl: "https://api.example.com",
  timeout: 5000,
  debugMode: false,
};
```

Here, you've established a set of default settings, including an API key, API
URL, timeout duration, and a debug mode flag.

## Building the Default Settings System

Now, let's create a function that merges in user-defined settings while
preserving the defaults:

```javascript
function applySettings(defaultSettings, userSettings) {
  return { ...defaultSettings, ...userSettings };
}
```

In this function, the magic happens with the spread operator. It merges the
`defaultSettings` with `userSettings`. Any values provided in `userSettings`
will override the corresponding defaults, while unspecified settings will still
fall back to the defaults.

## Using Your Default Settings

Now that you have your `applySettings` function in place, you can easily apply
it to any object of user-defined settings:

```javascript
const userSettings = {
  apiKey: "custom-api-key",
  timeout: 10000,
};

const finalSettings = applySettings(defaultSettings, userSettings);

console.log(finalSettings);
```

In this example, you're overriding the `apiKey` and `timeout` settings, while
leaving `apiUrl` and `debugMode` to use the defaults. The result will be an
object with merged settings:

```javascript
{
    apiKey: 'custom-api-key',
    apiUrl: 'https://api.example.com',
    timeout: 10000,
    debugMode: false,
}
```

## A note on nested settings

The spread operator makes a shallow merge. If a setting is itself an object,
like `retry: { attempts: 3, delay: 1000 }`, a user that passes
`retry: { attempts: 5 }` replaces the whole `retry` object, and `delay` is lost.
For settings like that, spread them one level down as well:

```javascript
function applySettings(defaultSettings, userSettings) {
  return {
    ...defaultSettings,
    ...userSettings,
    retry: { ...defaultSettings.retry, ...userSettings.retry },
  };
}
```

## Wrapping up

It's as simple as that. Now you have a basic understanding of the spread
operator and a handy default settings system with minimal code.
