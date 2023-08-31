---
title: The Evolution of JavaScript and Why It Matters
part: 7
---

Understanding the past and how we got here can give us good hints about where
we're going. Let's dig into JavaScript's history and how it's grown over time.
Knowing this stuff will help us when we move on to more complicated topics like
Promises, template literals, async/await, and the latest JavaScript features.

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

## Keep Learning and Stay Current

It's important to keep up with the latest changes to ECMAScript. New features
not only add new abilities but can also make your code run faster and be more
secure. So, make it a habit to read official documentation and try out new
stuff.

Have a look at [tc39.es](https://tc39.es/) for full history and current
proposals.

## Why Polyfills Aren't as Important Anymore

There was a time when we had to use lots of third-party packages and code
snippets called polyfills to make sure our JavaScript worked on different
browsers. This often made our code more complicated than it needed to be.

```javascript
// Polyfill for Array.prototype.includes in older environments
if (!Array.prototype.includes) {
  Array.prototype.includes = function (element) {
    // implementation here
  };
}
```

These days, thanks to more consistent browser support and ECMAScript updates, we
usually don't need these workarounds anymore.

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
