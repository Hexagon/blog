---
layout: post.njk
title: "Introducing Minitz - Time zone conversion in JavaScript"
description: "An introduction to Minitz, what it is, why i wrote it, and how to use it."
tags:
- javascript
- time-zones
- conversion
- tz
- library
- standalone
priority: 4
intro: "Minitz is a minimal utility that allows you to convert to or from any timezone. It is compatible with Deno, Node, and browsers, and is less than 2KB when minified. The library is MIT-licensed, which means you can use it any way you want."
---

## Why I wrote Minitz

Converting a Date object to another timezone in JavaScript is possible using the
Intl feature of vanilla JS.

```javascript
// Get current time in Asia/Tokyo, using vanilla js
new Date().toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
// -> 2022-09-15 17:23:45
```

However, I needed a simple and lightweight utility that could convert dates
between different timezones in JavaScript, both to **and from**. I found that
existing libraries were either too complex, too heavy for my needs or didn't
support module imports.

Using minitz, that is possible. Let's see some examples on converting from a
time zone:

```javascript
// Get local time from time in Asia/Tokyo, using minitz and vanilla js
const localTime = minitz(2022, 9, 15, 23, 0, 0, "Asia/Tokyo");
console.log(localTime.toLocaleString("sv-SE"));
// -> 2022-09-15 16:00:00
```

And converting between time zones:

```javascript
// Get time in America/New_York from time in Asia/Tokyo, using minitz and vanilla js
// Also demonstrates that it's possible to use ISO8601 strings as input to minitz, through `.fromTZISO`
const localTime = minitz.fromTZISO("2022-09-15 23:00:00", "Asia/Tokyo");
console.log(
  localTime.toLocaleString("sv-SE", { timeZone: "America/New_York" }),
);
// -> 2022-09-15 10:00:00
```

## How does it work?

Minitz works by relying on the built-in JavaScript Intl API to perform timezone
conversions. It uses current best practices and is designed to work in all
environments, including Node, Deno, and browsers. Minitz is compatible with ESM,
UMD, and CommonJS.

## Using minitz

Minitz can be installed through [NPM](https://npmjs.com/package/minitz), or
imported from [deno.land/x](https://deno.land/x/minitz). Once you have installed
or imported Minitz, you can use it to convert dates between different timezones
in JavaScript using the examples above.
