---
layout: post.njk
title: "Deno vs. Bun vs. Node.js: A Feature Comparison"
description: "Description"
tags:
  - standalone
  - deno
  - bun
  - nodejs
priority: 1.0
updated: 2023-09-12T19:06:00.000Z
intro: "Choosing a JavaScript runtime for your project? Then you've probably heard of Deno, Bun, and Node.js. They are all good, but each has its own set of features and trade-offs. This guide will break them down by features, ease of use, security, and other considerations."
---

| Feature                     | Deno  | Bun  | Node.js |
|-----------------------------|-------|------|---------|
| Code Formatter     | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Linter             | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Upgrader           | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Type Checker       | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Minifier           | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Bundler           | <i class="fa-solid fa-check yellow"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| LSP                | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| REPL               | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check yellow"></i>   | <i class="fa-solid fa-check green"></i>     |
| Dependency Viewer  | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-xmark red"></i>   | <i class="fa-solid fa-check yellow"></i>     |
| Websocket Handler  | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-xmark red"></i>     |
| Persistent Storage | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-xmark red"></i>     |
| Package Manager    | <i class="fa-solid fa-triangle-exclamation orange"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-check yellow"></i>     |
| Benchmark Runner   | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Compiler           | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Single Executable Installation  | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-xmark red"></i>     |
| Permissions Model           | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-xmark red"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| TypeScript / TSX            | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i>     |
| Compatibility with Web APIs | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-check green"></i>     |
| Windows Support             | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-check green"></i>     |
| ARM64 Support               | <i class="fa-solid fa-triangle-exclamation orange"></i>   | <i class="fa-solid fa-triangle-exclamation orange"></i> | <i class="fa-solid fa-check green"></i>
| package.json Compatibility  | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-check green"></i>   | <i class="fa-solid fa-check green"></i>     |
| NPM Opt-out                 | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-xmark red"></i>   | <i class="fa-solid fa-xmark red"></i>     |
| Support for URL Imports     | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-xmark red"></i>   | <i class="fa-solid fa-xmark red"></i>     |
| Support for Import Maps     | <i class="fa-solid fa-check green"></i>    | <i class="fa-solid fa-xmark red"></i>   | <i class="fa-solid fa-xmark red"></i>     |

<i class="fa-solid fa-check green"></i> = Built In
<i class="fa-solid fa-check yellow"></i> = Core Ecosystem
<i class="fa-solid fa-triangle-exclamation orange"></i> = Third Party / Experimential / Partial
<i class="fa-solid fa-xmark red"></i> = N/A

As this table doesn't cover every single aspect, here are some noteworthy points:

- Node has started to implement a permissions model.
- Node does have an external dependency view through `npm list`.
- Bun has a semi-built-in REPL, which is downloaded on demand.
- All runtimes offer ARM64 support to varying degrees, with Node.js supporting the broadest range of platforms.
- While Deno lacks a traditional built-in package manager, it does facilitate automatic package installations through URL imports, specifier imports, import_map, and package.json.

Report any misconceptions as an issue or PR at the [Blog GitHub Repo](https://github.com/hexagon/blog).

*Table updated to include four levels (green/yellow/orange/red) instead of two (green/red) 2023-09-12*

---

Now let's go through them one by one.

## Deno

Deno was initially created by Ryan Dahl, the original creator of Node.js, to address some of the regrets and issues he felt were present in Node.js. It is built on the V8 JavaScript engine and is written in Rust. [(wikipedia)](https://en.wikipedia.org/wiki/Deno_(software)).

### Features

As you can see in the table above, Deno has a very comprehensive set of features compared to the competition. It has great support for the Web APIs and modern standards, and it also supports most npm packages.


### Ease of Use

Deno also offers an excellent developer experience, especially if you use TypeScript, which is supported out of the box. Deno also has the advantage of built-in linting, a code formatter, etc., saving you some configuration and bootstrapping time. If you're inclined towards opinionated settings, just fire up your editor, craft a 'main.ts', and you're good to go.

### Security

Deno is the clear winner here; it's secure by default, meaning everything is blocked by default, and you enable the features you need.

---


## Bun

Bun is a more recent entry in the JavaScript runtime ecosystem, focused on developer experience, modern JavaScript practices and high performance. It's built on top of JavaScriptCore and Zig. [(wikipedia)](https://en.wikipedia.org/wiki/Bun_(software))

### Features

Though Bun might not match Deno's arsenal of built-in tools, it certainly elevates the developer experience (DX) beyond what Node.js offers. As an example, it boasts built-in TypeScript but does not type-check on its own.

The main selling point of Bun seems to be its performance, they present a lot of benchmarks showing awesome numbers, and the package manager sure is quick. But in real-world applications, especially web applications, the difference might not be that significant.

### Ease of Use

Bun prioritizes simplicity and speed. With its built-in package manager, and improved developer experience compared to Node.js, developers can get started quickly without the initial setup hurdles that other runtimes might impose.

### Security

Bun hasn't implemented a comprehensive permissions model like Deno. However, it does introduce a new interesting package.json feature called [trustedDependencies](https://bun.sh/docs/cli/install#trusted-dependencies).

### Other Considerations

Bun might not offer as comprehensive Windows support as Deno or Node.js, but it does function to some extent.

---


## Node.js

Node.js, launched in 2009, revolutionized server-side programming by allowing developers to use JavaScript outside the browser. Built on the V8 JavaScript engine. [(wikipedia)](https://en.wikipedia.org/wiki/Node.js)

### Features

Node.js has been the backbone of server-side JavaScript development for years, but compared to Deno and Bun, it's starting to fall behind in terms of developer experience and progressive technology.

### Ease of Use

Node.js has a steeper learning curve for beginners but offers immense power and flexibility in return. The extensive documentation, tutorials, and community support available make it easier to overcome challenges.

### Security

Historically, Node.js received criticism for its approach to security, especially regarding packages. However, the community and maintainers have significantly improved this area. The permissions model is now being implemented, which might make Node.js more secure in the future.

### Other Considerations

Again, Node.js boasts the advantage of time, maturity, and a vast community. For large-scale applications or projects where library support is essential, Node.js still stands strong.

---


## Conclusion

Selecting between Deno, Bun, and Node.js largely depends on your project's requirements and your personal preferences.

- If maturity, a vast ecosystem, and community support are your top priorities, Node.js continues to be a formidable contender.
- If you're seeking a modern, secure-by-default runtime with a top-notch developer experience and growing maturity, Deno is the way to go.
- If you want a mix of Node.js and Deno's strengths, with an emphasis on cutting-edge performance, and a decent developer experience, Bun might be your answer.

## Credits

A big thank you to Discord users Birk Skyum, lino-levan, Beast, cknight, Mark G and others for invaluable research and discussions contributing to this article.

Over and out.
