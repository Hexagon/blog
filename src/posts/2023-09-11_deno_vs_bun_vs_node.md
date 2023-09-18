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
updated: 2023-09-13T23:41:00.000+0200
intro: "Choosing a JavaScript runtime for your project? Then you've probably heard of Deno, Bun, and Node.js. They are all good, but each has its own set of features and trade-offs. This guide will break them down by features, ease of use, security, and other considerations."
---

Let's examine each runtime through this table:

| Feature                     | Deno  | Bun  | Node.js |
| :--------------------------- | :---: | :----: | :-------: |
| **Runtime Features** |||
| Upgrader      | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| Single Executable Installation  | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| LSP                | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| REPL               | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-regular fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>     |
| Compiler           | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| Persistent Storage Driver | <i class="fa-solid fa-square-check green" alt="Deno KV"></i>    | <i class="fa-solid fa-square-check green" alt="SQLite"></i>   | <i class="fa-solid fa-square-xmark red" alt="Only available through third party modules"></i>     |
| **Testing** |||
| Benchmark Runner   | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Test Runner   | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-cube green" alt="Stable since Node.js 20"></i>     |
| **OS/Platform Support**        |||
| Linux             | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>    |
| Mac OS             | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>    |
| Windows             | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-flask purple"></i>   | <i class="fa-solid fa-square-check green"></i>     |
| ARM64               | <i class="fa-solid fa-flask purple"></i>   | <i class="fa-solid fa-flask purple"></i> | <i class="fa-solid fa-square-check green"></i>      |
| **Package Management**       |||
| package.json Compatibility  | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>     |
| NPM Opt-out                 | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| Built-in Package Manager    | <i class="fa-solid fa-cube orange"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-regular fa-square-check green"></i>     |
| URL Imports     | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| **Web API Compatibility**   |||
| Fetch | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>     |
| Web Crypto | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-check green"></i>     |
| Web Storage | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| WebSocket | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| Web Workers | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| Import Maps     | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-square-xmark red"></i>     |
| **Security** |||
| Permissions Model           | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-xmark red"></i>   | <i class="fa-solid fa-flask purple"></i>     |
| trustedDependencies         | <i class="fa-solid fa-square-xmark red"></i>      |  <i class="fa-solid fa-square-check green"></i>|  <i class="fa-solid fa-square-xmark red"></i>       |
| **Developer Tools** ||||
| Code Formatter     | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Linter             | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Type Checker       | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Minifier           | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Bundler            | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| Dependency Viewer  | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-cube orange"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| **Language Support** |||
| TypeScript / TSX            | <i class="fa-solid fa-square-check green"></i>    | <i class="fa-solid fa-square-check green"></i>   | <i class="fa-solid fa-cube orange"></i>     |
| **Metadata** |||
| Initial Release | 2018 | 2021 | 2009 |
| Current Version | 1.36.4 | 1.0 | 20.16.1 |
| LTS Version | - | - | 18.17.1 |
| Original Author | Ryan Dahl | Jarred Sumner | Ryan Dahl |
| Ownership | Deno Land Inc. | Oven | OpenJS Foundation |
| License | MIT License | MIT License | MIT License |

<i class="fa-solid fa-square-check green"></i> = Built-In
<i class="fa-regular fa-square-check green"></i> = Core Ecosystem
<i class="fa-solid fa-cube orange"></i> = Third Party
<i class="fa-solid fa-flask purple"></i> = Experimental / Partial
<i class="fa-solid fa-square-xmark red"></i> = N/A

**Footnotes**

As this table doesn't cover every single aspect, here are some noteworthy points:

* Node.js has started to implement a permissions model, available under a experimental flag in [Node 20](https://nodejs.org/en/blog/announcements/v20-release-announce).
* Node.js does have an external dependency view through `NPM list`.
* Node.js has an alternative approach to Web Workers called `Worker Threads`.
* The built in test-runner in Node.js were stabilized in version 20, in 18 (LTS), it is experimental.
* Bun's WebSocket API is flagged orange as it is flagged "Not production ready" in the [official documentation](https://bun.sh/docs/runtime/web-apis)
* Bun has a semi-built-in REPL, which is downloaded on demand.
* While Deno lacks a traditional built-in package manager, it does facilitate automatic package installations through URL imports, specifier imports, import_map, and package.json.

**Updates**

* *2023-09-12: Table updated to include four levels (green/green/orange/red) instead of two (green/red).*
* *2023-09-13: Table grouped in sections. Metadata and Web API-sections were added. New icons.*

Report any misconceptions as an issue or PR at the [Blog GitHub Repo](https://github.com/hexagon/blog).

**Performance**

I've written a separate post comparing the performance of these three, see [Deno vs. Bun vs. Node.js: A Speed Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node-benchmark/).

Now let's go through the runtimes one by one.

## Deno

---

Deno was initially created by Ryan Dahl in 2018, the original creator of Node.js, to address some of the regrets and issues he felt were present in Node.js. It focuses on security, modern JavaScript practices and developer experience. Built on the V8 JavaScript engine and written in Rust. [(wikipedia)](https://en.wikipedia.org/wiki/Deno_(software)).

**Features**

As you can see in the table above, Deno has a very comprehensive set of features compared to the competition. It has great support for the Web APIs and modern standards, and it also supports most NPM packages.

**Ease of Use**

Deno also offers an excellent developer experience, especially if you use TypeScript, which is supported out of the box. Deno also has the advantage of built-in linting, a code formatter, etc., saving you some configuration and bootstrapping time. If you're inclined towards opinionated settings, just fire up your editor, craft a 'main.ts', and you're good to go.

**Security**

Deno is the clear winner here; it's secure by default, meaning everything is blocked by default, and you enable the features you need.



## Bun

---

Bun is a more recent entry in the JavaScript runtime ecosystem released in 2021. It focuses on developer experience, modern JavaScript practices and high performance. It's built on top of JavaScriptCore and Zig. [(wikipedia)](https://en.wikipedia.org/wiki/Bun_(software))

**Features**

Though Bun might not match Deno's arsenal of built-in tools, it certainly elevates the developer experience (DX) beyond what Node.js offers. As an example, it boasts built-in TypeScript but does not type-check on its own.

The main selling point of Bun is its performance, presenting a lot of benchmarks showing awesome numbers. Using bun as a package manager is a lot quicker than using the standard NPM command. In real-world applications, especially web applications, performance difference may not be as significant as in the benchmarks. We'll have to keep an eye out for real-world results.

**Ease of Use**

Bun prioritizes simplicity and speed. With its built-in package manager, and improved developer experience compared to Node.js, developers can get started quickly without the initial setup hurdles that other runtimes might impose.

**Security**

Bun hasn't implemented a comprehensive permissions model like Deno. However, it does introduce a new interesting package.json feature called [trustedDependencies](https://bun.sh/docs/cli/install#trusted-dependencies).



## Node.js

---

Launched in 2009, Node.js revolutionized server-side programming by allowing developers to use JavaScript outside of the browser. It boasts a robust ecosystem, a vast community, and is proven and stable. Provides LTS builds for large scale applications. Built on the V8 JavaScript engine. [(wikipedia)](https://en.wikipedia.org/wiki/Node.js)

**Features**

For years, Node.js has been the backbone of server-side JavaScript development, supporting a myriad of features through third-party tools. If we focus on built-in tools and compatibility with Web APIs, it is starting to fall behind the competition.

**Ease of Use**

Due to the lack of built-in tools, Node.js has a steeper learning curve for beginners but offers immense power and flexibility in return. The extensive documentation, tutorials, and community support available make it easier to overcome challenges.

**Security**

Historically, Node.js received criticism for its approach to security, especially regarding packages. However, the community and maintainers have significantly improved this area. The permissions model is now being implemented, which might make Node.js more secure in the future.

## Conclusion

---

Selecting between Deno, Bun, and Node.js largely depends on your project's requirements and your personal preferences.

- If maturity, a vast ecosystem, and community support are your top priorities, Node.js continues to be a formidable contender.
- If you're seeking a modern, secure-by-default runtime with a top-notch developer experience and growing maturity, Deno is the way to go.
- If you want a mix of Node.js and Deno's strengths, with an emphasis on cutting-edge performance, and a decent developer experience, Bun might be your answer.

## Credits

---

A big thank you to Discord users Birk Skyum, lino-levan, Beast, cknight, Mark G and others for invaluable research and discussions contributing to this article.

Over and out.
