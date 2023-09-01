---
title: The Evolution of JavaScript and Why It Matters
part: 6
intro: "Understanding the past and how we got here can give us good hints about where
we're going. Let's dig into JavaScript's history and how it's grown over time.
Knowing this stuff will help us when we move on to more complicated topics like
Promises, template literals, async/await, and the latest JavaScript features."
---

## How Did JavaScript Start?

JavaScript was created back in 1995 by Brendan Eich while he was working at
Netscape. It was meant to be a simple language to add interactivity to websites.
Eich put together the first version in just 10 days. Since then, the first grew
to be very important for front end web development right next to HTML and CSS,
and then it grow to be just as important in the back end.

## ECMAScript: The Rule Book

ECMAScript is the set of rules that JavaScript follows. The group that came up
with these rules, ECMA International, first put them out in 1997. We've had
several updates to ECMAScript since then, adding new features and improving the
language.

### Big Changes Over Time

- **ES3 (1999):** Gave us features like `try` and `catch` for handling errors.

- **ES5 (2009):** Added methods to work with JSON data and new ways to deal with
  objects.

- **ES6 / ES2015:** Big update that added `let` and `const`, arrow functions,
  template literals, and more.

- **ES2016:** Introduced the exponentiation operator `(**)` and
  `Array.prototype.includes`

- **ES2017:** Added `async`/`await`, `Object.values`, `Object.entries`,
  `String.padStart`/`padEnd`

- **ES2018:** Brought in rest/spread properties, `Promise.finally`, and
  asynchronous iteration.

- **ES2019**: Added `Array.flat`/`flatMap`, `Object.fromEntries`,
  `String.trimStart`/`trimEnd`, and optional catch binding.

- **ES11 / ES2020**: Introduced optional chaining (`?.`), nullish coalescing
  operator (``??`),`BigInt``, and dynamic import.

A great way for you to check feature compability with your intended
runtime/browser is to check MDN, this is an example of `async` browser/runtime
compability
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#browser_compatibility](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#browser_compatibility)

## CommonJS to ES Modules: Time to Switch

CommonJS was the go-to way to include modules in JavaScript, especially in
Node.js. But it had its limits. Now we're moving to ES modules, which are more
flexible and better aligned with ECMAScript rules.

```javascript
// CommonJS
const fs = require("fs");

// ES Modules
import fs from "fs";
```

Switching to ES modules will make your code cleaner and easier to manage,
especially as you work on larger projects. It also optimizes for both static
analysis and tree shaking. This can lead to better-optimized bundles and cleaner
codebases, making it easier to get rid of outdated dependencies and polyfills.

## A note on polyfills

In the world of web development, compatibility has always been a primary
concern. Due to the inconsistencies between browser versions and their support
for JavaScript features, developers often turned to polyfills. A polyfill is a
piece of code that provides modern functionality on older browsers that do not
natively support it. They essentially "fill in" the gaps where browser support
is lacking.

There was a time when polyfills were essential, but now, most modern browsers
have gotten their act together and offer consistent JavaScript support. So, the
need for polyfills has gone down.

Likewise, people used to rely a lot on libraries to make JavaScript easier. But
as JavaScript got better, many of these libraries fell by the wayside. Nowadays,
you can often get the job done using just built-in JavaScript features.

## Embrace Built-in Features

One example of a big shift in JavaScript is the transition from custom AJAX
libraries to the native `fetch` API in JavaScript. Earlier, developers might
have leaned on jQuery's `$.ajax` or other similar custom solutions to make
asynchronous HTTP requests. Today, the built-in `fetch` function gives a more
standardized way to achieve the same, without relying on any external libraries.

Here's why focusing on built-in features in JavaScript is a good idea:

- **More Optimized:** Native features are generally faster and more efficient
  than their library counterparts.

- **Well-Supported:** Being part of the language specification, you can expect
  consistent support across all modern browsers.

- **Less Redundant:** Using built-in features reduces the need for external
  libraries, ensuring faster page loads and optimized performance.

## Staying Updated

As you continue to work with JavaScript, it's important to stay in the loop
about the latest features and updates. The JavaScript landscape is always
changing, and what was considered a best practice yesterday might not hold up
today. Make a habit of checking out official documentation, following key
developers on social media, and participating in coding communities. This will
not only keep your skills fresh but also let you take advantage of new and more
efficient ways of doing things.

Have a look at [tc39.es](https://tc39.es/) for full history of ECMAScript, and
current proposals.
