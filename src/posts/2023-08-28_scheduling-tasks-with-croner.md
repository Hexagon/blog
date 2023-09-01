---
layout: post.njk
title: Scheduling Tasks in JavaScript or TypeScript with Croner
description: A deep dive into the potential of Croner, the task scheduler for JavaScript and TypeScript.
tags:
 - javascript
 - typescript
 - cron
 - croner
 - tasks
 - scheduling
 - guide
 - standalone
priority: 4
intro: "Managing time-based tasks in JavaScript has never been easier with Croner, a
powerful tool designed to trigger functions or evaluate cron expressions on
various platforms. Whether you're working in Node.js, Deno, Bun, or even
directly within a browser, Croner has you covered. In this article, we'll dive
deep into how you can leverage Croner to schedule your tasks effectively."
---

## Introduction to Croner

Croner is a robust JavaScript and TypeScript tool for:

- Triggering functions using the familiar Cron syntax.
- Evaluating cron expressions to get a list of upcoming run times.
- Scheduling tasks targeting different time zones.
- Including TypeScript typings and handling asynchronous functions.
- Pausing, resuming, or stopping tasks once scheduled.
- All these without needing a database or any configuration files.

[**Try Croner Live on JSFiddle**](https://jsfiddle.net/) or delve into the
[**Full Documentation**](https://croner.56k.guru).

## Quick Start with Croner

Here are some examples of what you can do with Croner:

```javascript
// Basic scheduling: Run a function every fifth second
const job = Cron("*/5 * * * * *", () => {
  console.log("This will run every fifth second");
});

// Get dates for the next 100 Sundays
const nextSundays = Cron("0 0 0 * * 7").nextRuns(100);
console.log(nextSundays);

// Days left to the next Christmas Eve
const msLeft = Cron("59 59 23 24 DEC *").nextRun() - new Date();
console.log(
  Math.floor(msLeft / 1000 / 3600 / 24) + " days left to next christmas eve",
);

// Schedule a function at a specific date/time in a different timezone
Cron("2024-01-23T00:00:00", { timezone: "Asia/Kolkata" }, () => {
  console.log("Yay!");
});
```

# Scheduling Tasks in JavaScript with Croner

Managing time-based tasks in JavaScript has never been easier with Croner, a
powerful tool designed to trigger functions or evaluate cron expressions in
various platforms. Whether you're working in Node.js, Deno, Bun, or even
directly within a browser, Croner has you covered. In this article, we'll dive
deep into how you can leverage Croner to schedule your tasks effectively.

## Introduction to Croner

Croner stands out as a robust JavaScript and TypeScript tool for:

- Triggering functions using the familiar Cron syntax.
- Evaluating cron expressions to get a list of upcoming run times.
- Scheduling tasks targeting different time zones.
- Including TypeScript typings and handling asynchronous functions.
- Pausing, resuming, or stopping tasks once scheduled.
- All these without needing a database or any configuration files.

## Quick Start with Croner

Here's a taste of what you can do with Croner:

```javascript
// Basic scheduling: Run a function every fifth second
const job = Cron("*/5 * * * * *", () => {
  console.log("This will run every fifth second");
});

// Get dates for the next 100 Sundays
const nextSundays = Cron("0 0 0 * * 7").nextRuns(100);
console.log(nextSundays);

// Days left to the next Christmas Eve
const msLeft = Cron("59 59 23 24 DEC *").nextRun() - new Date();
console.log(
  Math.floor(msLeft / 1000 / 3600 / 24) + " days left to next christmas eve",
);

// Schedule a function at a specific date/time in a different timezone
Cron("2024-01-23T00:00:00", { timezone: "Asia/Kolkata" }, () => {
  console.log("Yay!");
});
```

### Installing Croner

Setting up Croner is straightforward. Simply install it using your favorite
package manager or CDN and include it in your project:

### For Node.js or Bun:

```javascript
// Using ESM Import
import { Cron } from "croner";
// or CommonJS Require
const { Cron } = require("croner");
```

### For Deno:

```javascript
import { Cron } from "https://deno.land/x/croner@6.0.3/dist/croner.js";
```

### For Webpages (UMD-module):

```html
<script src="https://cdn.jsdelivr.net/npm/croner@6/dist/croner.umd.min.js"></script>
```

### Cron Expressions

The core of Croner lies in the cron expressions. They determine when your
function should run. Croner builds upon the popular Vixie-cron pattern with
enhancements like:

- `L` for the last day and weekday of a month.
- `#` for the nth weekday of a month.

A quick look at the pattern:

```
* * * * * *
| | | | | |
| | | | | +--- Day of the Week (0 - 6, SUN-Mon)
| | | | +----- Month (1 - 12, JAN-DEC)
| | | +------- Day of the Month (1 - 31)
| | +--------- Hour (0 - 23)
| +----------- Minute (0 - 59)
+------------- Second (0 - 59, Optional)
```

### Why Choose Croner?

While there are other JavaScript cron implementations out there, Croner shines
because:

- It’s bug-free and avoids bloated dependencies.
- It works across all environments as expected.
- Offers features like over-run protection, error handling, and more that some
  other libraries lack.
- For an in-depth comparison of various libraries, check the detailed comparison
  [here]().

### Wrapping Up

If you've been searching for a comprehensive, efficient, and versatile cron job
tool for JavaScript, look no further than Croner. Whether you're scheduling
regular tasks, need time-specific function triggering, or simply want to
evaluate future run times based on cron patterns, Croner is a reliable choice.
Don't forget to check out its official documentation for a deeper dive into its
capabilities.

[**Try Croner Live on jsfiddle**](https://jsfiddle.net/) or delve into the
[**Full Documentation**](https://croner.56k.guru).

Happy coding!
