---
layout: post.njk
title: "Getting Started with Bun: A Blazing Fast Runtime for JavaScript"
description: "Discover the speedy Bun runtime for JavaScript. Dive into its installation, first app, and understand why performance is at its core."
tags:
  - standalone
  - bun
  - javascript
  - performance
priority: 1.0
intro: "In the ever-evolving world of JavaScript runtimes, Bun is emerging as a promising star. It might not have the maturity of Deno or Node.js, but it compensates with promising great performance. Let's explore Bun in detail."
---

## Why Bun?

**Built for performance**

Bun's primary draw is its sheer speed. Designed with performance optimization at
its core, it offers execution times that can give even the most established
runtimes a run for their money.

**Keeping It Lean**

Bun takes a minimalistic approach. Without the frills and complexities, it
offers a focused runtime environment. This can be especially beneficial for
applications where performance is critical, and you don't want overheads.

**Growing Ecosystem**

While Bun might be newer compared to its counterparts, it's backed by a growing
community and an expanding ecosystem of tools and packages. It is also designed
to be compatible with Node.js, inheriting much of this more mature ecosystem.

**A Step Towards Modern JavaScript**

Being a fresh entry, Bun has the advantage of addressing some modern JavaScript
needs from the ground up, providing an environment tailored for current
development practices. As an example, it has built in support for TypeScript,
and a built in bundler.

For an in-depth comparison on how Bun stacks up against other runtimes, see my
articles:
[Deno vs. Bun vs. Node.js: A Feature Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node/)
and
[Deno vs. Bun vs. Node.js: A Speed Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node-benchmark/).

## How to Install

Setting up Bun is straightforward:

**Using Shell (macOS, Linux and WSL):**

`curl -fsSL https://bun.sh/install | bash`

For more detailed installation instructions, refer to the
[official documentation](https://bun.sh/docs/installation).

## Hello Bun!

Kickstart your Bun journey with a simple application. Create a new `.js` (or
`.ts`) file:

```javascript
console.log("Hello, Bun!");
```

Execute your program using `bun run hello.js`. You should witness the output
"Hello, Bun!"

For those unfamiliar with JavaScript or looking for a refresher, I recommend the
[The Guide to JavaScript](https://hexagon.56k.guru/posts/guide-to-js/introduction/).

## Importing Packages

Bun is compatible with the npm package registry; in fact it can install packages
from npm on its own, and it's quicker than using the npm command:

`bun install croner`

... and the script:

```javascript
import { Cron } from "croner";

const job = Cron("*/5 * * * * *", () => {
  console.log("This action will repeat every fifth second");
});
```

## Built-in Test Runner

One of the notable features of Bun is its integrated test runner. This provides
developers with the tools needed to ensure the reliability and stability of
their applications without relying on external tools or libraries.

Here's how you can get started:

1. Write your test in a `.test.js` or `.test.ts` file. For instance,
   `example.test.js`:

```javascript
import { beforeAll, describe, expect, test } from "bun:test";

beforeAll(() => {
  // setup tests
});

describe("math", () => {
  test("addition", () => {
    expect(2 + 2).toBe(4);
    expect(7 + 13).toMatchSnapshot();
  });
});
```

2. Run the test using the `bun test` command, which will automatically pick up
   the test:

```bash
bun test
```

Bun will execute the tests and provide a fairly standard report, showcasing
passed tests, failed tests, and execution time.

To dive deeper into testing with Bun and best practices, check the
[official testing documentation](https://bun.sh/docs/cli/test).

## TypeScript Support in Bun Compared to Node.js

Bun, much like Deno, offers out-of-the-box support for TypeScript. This presents
a refreshing change, especially for developers who are used to the more modular
approach of Node.js. In Bun, there's no need for external tools like Babel or
ts-node. Instead, Bun ensures that developers can seamlessly leverage the
advantages of static typing and modern JavaScript features right from the
get-go.

Here's how to get TypeScript up and running in your Bun project:

**1. Install TypeScript Definitions for Bun's APIs**: Simply run
`bun add -d bun-types` to add it as a dev dependency.

**2. Update Your tsconfig.json**: Include `"bun-types"` in the
`compilerOptions.types`:

```json
{
  "compilerOptions": {
    "types": ["bun-types"]
  }
}
```

**3. Use Bun Globals without Issues**: You can now reference Bun-specific
globals like `console.log(Bun.version);` without any TypeScript errors.

**4. Recommended Compiler Options**: Bun provides a set of recommended compiler
options tailored for its environment. This includes settings that enable modern
features like top-level await, JSX, and `.ts` imports. Initializing a Bun
project with `bun init` auto-generates this configuration for you.

## Bun Resources

- [Official Bun Manual](https://bun.sh/docs)
- [Deno vs. Bun vs. Node.js: A Feature Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node/)
- [Deno vs. Bun vs. Node.js: A Speed Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node-benchmark/).

## Conclusion

With its combination of raw performance, growing ecosystem, and
developer-friendly features like the built-in test runner, Bun is rapidly
carving a niche for itself. Whether you're starting a new project or considering
a switch, Bun's unique offerings make it a worthy contender in the JavaScript
runtime arena.
