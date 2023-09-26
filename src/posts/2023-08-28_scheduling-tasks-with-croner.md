---
layout: post.njk
title: Scheduling Tasks in JavaScript or TypeScript with Croner
description: A deep dive into the potential of Croner, the task scheduler for JavaScript and TypeScript.
updated: "2023-09-22T22:41:00Z"
metas:
  image: "https://hexagon.56k.guru/img/scheduling_tasks_croner.webp"
header: "/img/scheduling_tasks_croner.webp"
tags:
 - javascript
 - typescript
 - cron
 - croner
 - tasks
 - scheduling
 - guide
 - standalone
priority: 0.9
intro: "Managing time-based tasks in JavaScript has never been easier with Croner, a
powerful tool designed to trigger functions or evaluate cron expressions on
various platforms. Whether you're working in Node.js, Deno, Bun, or even
directly within a browser, Croner has you covered. In this article, I'll give you
a brief introduction on how to use Croner."
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
import { Cron } from "https://deno.land/x/croner@7.0.1/dist/croner.js";
```

### For Webpages (UMD-module):

```html
<script src="https://cdn.jsdelivr.net/npm/croner@7/dist/croner.umd.min.js"></script>
```

### Cron Expressions

Croner builds upon the popular Vixie-cron pattern with enhancements like:

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

## Croner: Going Beyond Basics

### Job Status and Control

Croner offers robust functionalities to track and control the status of jobs.
Using the below methods, you can:

```javascript
// Check the status of the next job run
job.nextRun(/*optional*/ startFromDate); // Returns a Date object representing the next run.

// Get an array containing the dates of the next n runs
job.nextRuns(10, /*optional*/ startFromDate);

// Determine the milliseconds left until the next execution
job.msToNext(/*optional*/ startFromDate);

// Obtain a Date object displaying when the current (or last) run was initiated
job.currentRun();

// Access a Date object showing when the previous job was initiated
job.previousRun();
```

With these functionalities, it’s possible to ascertain whether:

- The job is scheduled and not paused or terminated using `job.isRunning()`.
- The job has been permanently stopped using `job.isStopped()`.
- The job is currently executing work using `job.isBusy()`.

To obtain the original pattern string, simply use `job.getPattern()`.

### Managing Jobs with Control Functions

You can control jobs through the following methods:

```javascript
// Instantly trigger a job
job.trigger();

// Pause the job's trigger
job.pause();

// Resume the job's trigger
job.resume();

// Permanently stop the job
job.stop();
```

After using `job.stop()`, the job cannot be resumed. This also removes named
jobs from the exported `scheduledJobs` array.

### Configurations and Options

Croner allows extensive configurability, making it adaptable to diverse needs:

- **name:** Assign a unique name to the job, and Croner will maintain a
  reference in the exported array `scheduledJobs`, which will be removed upon
  executing `.stop()`.
- **maxRuns:** Limit the number of runs for a job.
- **catch:** Manage unhandled errors in triggered functions. A `true` value will
  ignore errors silently, while passing a callback function will trigger this
  callback on error.
- **timezone:** Define a specific timezone in Europe/Stockholm format.
- **startAt & stopAt:** Schedule using ISO 8601 formatted datetime in local
  time, according to the `timezone` parameter if passed.
- **interval:** Set a minimum number of seconds between triggers.
- **paused:** Decide if the job should be paused from start.
- **context:** This is passed as the second parameter to the triggered function.
- **legacyMode:** Combine day-of-month and day-of-week using true = OR, false =
  AND.
- **unref:** Unref the internal timer, allowing the process to exit even if a
  cron job is running.
- **utcOffset:** Schedule using a specific utc offset in minutes.
- **protect:** Enable over-run protection, blocking new triggers as long as an
  old one is in progress.

Here’s an example of how to set the configurations:

```javascript
const job = Cron("*/5 * * * * *", {
  name: "MyJob",
  maxRuns: 10,
  catch: true,
  timezone: "Europe/Stockholm",
  startAt: "2023-10-17T23:43:00",
  stopAt: "2023-12-17T23:43:00",
  interval: 60,
  paused: false,
  context: {},
  legacyMode: true,
  unref: false,
  utcOffset: 120,
  protect: true,
}, () => {
  console.log(
    "This will run every fifth second, with the defined configurations",
  );
});
```

### Why Choose Croner?

While there are other JavaScript cron implementations out there, Croner shines
because:

- It’s bug-free and avoids bloated dependencies.
- It works across all environments as expected.
- Offers features like over-run protection, error handling, and more that some
  other libraries lack.
- For an in-depth comparison of various libraries, check the detailed comparison
  at [croner.56k.guru](https://croner.56k.guru/).

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
