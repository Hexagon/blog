---
title: "Cross-Runtime JavaScript: Navigating Runtime Differences"
title_short: "Handling Built-ins"
part: 3
intro: "Discover strategies for handling runtime differences and ensuring smooth cross-platform execution of your JavaScript code."
---

**You're visiting the staging area of hexagon.56k.guru, this is work in
progress**

Our cross-runtime JavaScript journey has provided a streamlined development
setup built upon modern runtimes like Deno and Bun. While the landscape is
constantly evolving, one challenge remains: subtle differences between these
runtimes. Let's explore how to navigate them.

## The Challenge of Runtime Variations

Even with the best intentions, JavaScript runtimes can exhibit variations in
their implementations of standard APIs, supported features, and even subtle
behavioral quirks. These differences can trip up unsuspecting developers,
compromising your code's cross-platform compatibility.

Handling this could be done manually with techniques like:

**Feature Detection:** Don't assume everything is available everywhere.
Proactively check for the feature you need before using it:

```javascript
if (typeof someFeature !== "undefined") {
  // Use someFeature
} else {
  // Provide a fallback or alternative behavior
}
```

... or **Conditional Import/Execution** When differences are substantial, it is
possible to create conditional clauses handling each runtime separately:

```javascript
if (typeof Deno !== "undefined") {
  // Deno-specific code
} else if (typeof Bun !== "undefined") {
  // Bun-specific code
} else {
  // Node.js or browser-specific code
}
```

However, doing this over and over throughout every project isn't a good
practice, and should be avoided.

## Existing solutions

The new package registry jsr.io introduces a great standard library, which do
cover many scenarios where feature detection, polyfilling or conditional
execution would otherwise be needed.

One great example is [@std/path](https://jsr.io/@std/path), which i use in many
of my recent projects. It just works, and are fully cross-runtime, including
browsers.

Moving on to more complex scenarios, where @std falls flat, we need other
alternatives. Luckily there is great ready made options, such as
[@cross](https://jsr.io/@cross) on jsr.io, which I've made lots of contributions
to:

- [@cross/utils](https://jsr.io/@cross/utils) - Covering common CLI-program
  tasks such as ansi formatting, argument parsing, spawning child processes and
  exiting the current process.

- [@cross/env](https://jsr.io/@cross/env) - Covering getting environment
  variables, including dotenv and complex scenarios.

- [@cross/runtime](https://jsr.io/@cross/runtime) - Standardised
  runtime/os/architecture detection.

- [@cross/fs](https://jsr.io/@cross/fs) - Cross-runtime filesystem operations,
  based on `node:fs/promises` but exapanded with methods like `which()`,
  `find()`, `diskusage()` and more.

- [@cross/fs](https://jsr.io/@cross/fs) - Cross-runtime filesystem operations,
  based on `node:fs/promises` but exapanded with methods like `which()`,
  `find()`, `diskusage()` and more.

- [@cross/test](https://jsr.io/@cross/test) - Test using the native test runners
  of Deno, Node and Bun, but with a common interface.

**In the next installment, we'll dive into real-world examples of cross-runtime
JavaScript applications. Stay tuned!**
