---
layout: post.njk
title: "Getting Started with Deno: A Secure Runtime for JavaScript and TypeScript"
description: "In this blog post, you'll find out what makes Deno awesome and how you can start using it today. We'll cover installing Deno, writing your first app, and using cool features like a built-in key/value database and npm compatibility."
tags:
  - standalone
  - deno
  - javascript
  - typescript
  - security
  - npm
  - denokv
priority: 1.0
intro: "If you're into JavaScript or TypeScript, you've probably heard about
Deno. It's an exciting new runtime that's often described as a more secure and simpler
alternative to Node.js. In this blog post, we'll go over what makes Deno awesome
and how to get started."
updated: "2023-09-22T17:00:00.000+0200"
enable_toc: true
---

## Why Deno?

**Security First**

One of Deno's biggest selling points is its focus on security. Unlike Node.js
and Bun, where you have to manually restrict permissions, Deno is secure by
default. That means no random package can mess with your system unless you give
it the OK.

For example, to run main.ts and allow it to access `api.openai.com`, you'd run:

`deno run --allow-net=api.openai.com main.ts`

**Simplicity**

Deno keeps things simple. You don't need to deal with complex configs or install
a bunch of extra stuff to get going. Write your code in JavaScript or
TypeScript, and Deno takes care of the rest. Out of the box, it supports
TypeScript, code formatting, linting, type checking, and even compiling your
code to a binary.

**Built-in Key/Value store**

It has a built-in Key/Value-store, which allows you to access a JavaScript
friendly database with only a few lines of code. In custom deployments, it's
based on SQLite, if using Deno Deploy, it uses a cloud based store.

**Backwards Compatible**

One of the cool things about Deno is that it's backwards compatible with npm
packages. This means you can still use all those npm libraries you know and
love. For those who don't want to be weighed down by what's known as the
[heaviest object in the universe](https://www.reddit.com/r/ProgrammerHumor/comments/6s0wov/heaviest_objects_in_the_universe/?rdt=41500)
(node_modules), there is an `--no-npm` flag.

For those interested in diving deeper into how Deno measures up against other
runtimes, I've provided comprehensive comparisons in my articles:
[Deno vs. Bun vs. Node.js: A Feature Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node/)
and
[Deno vs. Bun vs. Node.js: A Speed Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node-benchmark/).

## How to Install

Installing Deno is a breeze:

**Using Shell (macOS and Linux):**

`curl -fsSL https://deno.land/x/install/install.sh | sh`

**Using PowerShell (Windows):**

`irm https://deno.land/install.ps1 | iex`

If you prefer other ways to install, check out the
[official documentation](https://deno.land/manual@v1.36.4/getting_started/installation).

## Hello Deno!

You don't need to install anything else to start writing Deno apps. Open a text
editor, create a new .ts or .js file, and you're good to go!

For example, create a hello.ts file and write:

```ts
console.log("Hello, Deno!");
```

Run your program with `deno run hello.ts`. You should see the output "Hello,
Deno!"

If you're new to JavaScript (or TypeScript for that matter), consider checking
out
[The Guide to JavaScript](https://hexagon.56k.guru/posts/guide-to-js/introduction/)
covering everything from the basics to advanced topics.

## Importing Packages

Deno can use any JavaScript/TypeScript module simply by importing them directly
from an url, and has its own package register at
[deno.land/x](https://deno.land/x).

Let's take a basic example:

```javascript
import { Cron } from "https://deno.land/x/croner@7.0.1/dist/croner.js";

// Run a function at the interval defined by a cron expression
const job = Cron("*/5 * * * * *", () => {
  console.log("This will run every fifth second");
});
```

Deno can also use popular npm packages not yet available natively to Deno
through the `npm:`-specifier:

```javascript
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(8000);
```

## Quick Guide to Deno’s CLI

Deno comes with a set of powerful command-line tools that allow developers to
easily run scripts, manage dependencies, and more. Below are some commonly used
Deno commands that can help you get started.

### Running Scripts

To run a script, use the `deno run` command followed by the name of your script.

```sh
deno run hello.ts
```

### Managing Permissions

Deno is secure by default, which means scripts run in a sandbox environment. For
any external access, such as network, file, and environment access, explicit
permissions are required. To allow network access, for example, use the
`--allow-net` flag:

```sh
deno run --allow-net=example.com myscript.ts
```

If you want to give Deno all permissions, you can use `-A`:

```sh
deno run -A myscript.ts
```

### Formatting Code

Deno provides a built-in code formatter that helps keep your codebase
consistent. To format your code, use the `deno fmt` command followed by the name
of your script or directory:

```sh
deno fmt myfile.ts
```

### Type Checking and Linting

Deno’s built-in tools also include a type checker and a linter to help you catch
errors early and enforce code quality. To check types in your script, run:

```sh
deno check myfile.ts
```

And to lint your code, use:

```sh
deno lint myfile.ts
```

### Bundling and Compiling

Deno also allows you to bundle and compile your TypeScript or JavaScript code
easily with the `deno bundle` and `deno compile` commands, respectively:

```sh
deno bundle myscript.ts output.bundle.js
```

```sh
deno compile myscript.ts
```

### Viewing Documentation

If you ever need a quick reference for the APIs and modules in your code, you
can generate documentation using the `deno doc` command:

```sh
deno doc mymodule.ts
```

### Installing Scripts

Deno enables you to install scripts as executables using the `deno install`
command. It’s great for creating CLI tools:

```sh
deno install -n mycli myscript.ts
```

Explore the [official documentation](https://deno.land/manual/tools) for more
advanced use cases and additional information.

## Configuring Deno with `deno.json`

Deno allows configuration of project settings through a `deno.json` or
`deno.jsonc` file. This configuration file, placed at the root of your project,
is instrumental in defining various project-level settings, such as compiler
options and lint rules.

Here is an example of a basic `deno.json` file:

```json
{
  "compilerOptions": {
    "lib": ["deno.ns", "dom"],
    "strict": true
  },
  "lint": {
    "rules": {
      "tags": ["recommended"]
    }
  }
}
```

This configuration file specifies compiler options such as which libraries to
include (`deno.ns` and `dom`) and whether to enforce strict type checking
(`"strict": true`). It also sets up linting rules, including all recommended
rules.

### Why is deno.json Important?

Having a `deno.json` file in your project allows you to maintain consistent
settings across your development environment. It’s crucial for defining how Deno
should behave when running, linting, or bundling your code, and can be used to
set up specific permissions or environment variables that your project needs to
run correctly.

Remember to consult the
[official documentation](https://deno.land/manual/configuration) to understand
all the available configuration options and to set up the `deno.json` file
according to your project needs.

## Deno Best Practices

Developing with Deno can be a breeze, but to ensure the maintainability,
scalability, and robustness of your codebase, following best practices is
essential.

### Explicitly Specify Permissions

Always specify the permissions needed for your Deno scripts explicitly, rather
than running scripts with the `-A` flag which gives full permissions. This
mitigates security risks by adhering to the principle of least privilege.

```sh
deno run --allow-read --allow-net myscript.ts
```

### Utilize TypeScript

Take advantage of Deno’s built-in TypeScript support. TypeScript helps catch
errors early, enhances code quality, and improves developer experience through
static typing.

### Keep Dependencies Up To Date

Regularly update the dependencies in your project to the latest versions to
benefit from bug fixes, new features, and security updates. But, always test
your application thoroughly after updating to ensure everything works as
expected.

### Write Tests

Writing tests is crucial for maintaining a healthy codebase. Deno provides a
built-in test runner, making it easy to write and run tests for your
application.

```sh
deno test
```

### Use Built-in Tooling

Leverage Deno’s built-in tools for formatting, linting, testing, bundling, and
compiling your codebase, ensuring a consistent and error-free development
experience.

```sh
deno fmt
deno lint
deno test
deno bundle
deno compile
```

### Prefer Deno Standard Library

When possible, prefer using modules from the
[Deno standard library](https://deno.land/std) as they are well-maintained,
tested, and optimized for Deno.

## Looking Ahead: Deno 2.0

There's a lot of chatter about Deno 2.0, which is rumored to be coming out later
this year. I can't wait to see what new features and improvements it'll bring.

## Deno resources

If you're looking for inspiration, you can check out some other write ups on
Deno:

- [Building a blog using Lume and Deno](https://hexagon.56k.guru/posts/building-a-blog-using-lume/)
  (hexagon.56k.guru)
- [Building a Web-based Tetris game using Deno](https://hexagon.56k.guru/posts/deno-tetris/introduction-to-deno-tetris/)
  (hexagon.56k.guru)
- [Building a Discord Bot with Deno and Harmony](https://pinta.land/posts/deno-discord-bot/)
  (pinta.land)

Other good Deno resources to check out:

- [Official Deno Manual](https://deno.land/manual/introduction) (deno.land)
- [Setting up Visual Studio Code for Deno](https://deno.land/manual/references/vscode_deno)
  (deno.land)
- [Deno vs. Bun vs. Node.js: A Feature Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node/)
  (56k.guru)
- [Deno vs. Bun vs. Node.js: A Speed Comparison](https://hexagon.56k.guru/posts/deno-vs-bun-vs-node-benchmark/)
  (56k.guru)

## Wrapping Up

So that's it! You now know how to get started with Deno. It's a simpler, more
secure alternative to Node.js and has some cool features like a built-in
key-value store and npm compatibility. With Deno 2.0 on the horizon, it's a
great time to get on board.
