---
layout: post.njk
title: "Getting Started with Deno: A Secure Runtime for JavaScript and TypeScript"
description: "In this blog post, you'll find out what makes Deno awesome and how you can start using it today. We'll cover installing Deno, writing your first app, and using cool features like a built-in key/value database and npm compatibility."
tags:
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
---

## Why Deno?

**Security First**

One of Deno's biggest selling points is its focus on security. Unlike Node.js,
where you have to manually restrict permissions, Deno is secure by default. That
means no random package can mess with your system unless you give it the OK.

For example, to run main.ts and allow it to access  `api.openai.com`, you'd run:

`deno run --allow-net=api.openai.com main.ts`

**Simplicity**

Deno keeps things simple. You don't need to deal with complex configs or install
a bunch of extra stuff to get going. Write your code in JavaScript or
TypeScript, and Deno takes care of the rest. Out of the box, it supports
TypeScript, code formatting, linting, type checking, and even compiling your
code to a binary.

**Built-in Key/Value store**

It has a built-in Key/Value-store, which allows you to access a JavaScript friendly
database with only a few lines of code. In custom deployments, it's based on
SQLite, if using Deno Deploy, it uses a cloud based store.

**Backwards Compatible**

One of the cool things about Deno is that it's backwards compatible with npm packages. This means you can still use all those npm libraries you know and love. For those who don't want to be weighed down by what's known as the [heaviest object in the universe](https://www.reddit.com/r/ProgrammerHumor/comments/6s0wov/heaviest_objects_in_the_universe/?rdt=41500) (node_modules), there is an `--no-npm` flag.

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

If you're new to JavaScript (or TypeScript for that matter), consider checking out
[The Guide to JavaScript](https://hexagon.56k.guru/guide-to-js/introduction)
covering everything from the basics to advanced topics.

## Importing Packages

Deno can use any JavaScript/TypeScript module simply by importing them directly
from an url, and has its own package register at
[deno.land/x](https://deno.land/x).

Let's take a basic example:

```javascript
import { Cron } from "https://deno.land/x/croner@7.0.1/dist/croner.js";

// Basic: Run a function at the interval defined by a cron expression
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

## Looking Ahead: Deno 2.0

There's a lot of chatter about Deno 2.0, which is rumored to be coming out later
this year. We can't wait to see what new features and improvements it'll bring.

## Deno resources

If you're looking for inspiration, you can check out some other write ups
on Deno:

- [Building a blog using Lume and Deno](https://hexagon.56k.guru/posts/building-a-blog-using-lume/)(hexagon.56k.guru)
- [Building a Web-based Tetris game using Deno](https://hexagon.56k.guru/posts/deno-tetris/introduction-to-deno-tetris/)(hexagon.56k.guru)
- [Building a Discord Bot with Deno and Harmony.](https://pinta.land/posts/deno-discord-bot/)(pinta.land)

Other good Deno resources to check out:

- [Official Deno Manual](https://deno.land/manual/introduction)(deno.land)
- [Setting up Visual Studio Code for Deno](https://deno.land/manual@v1.36.4/references/vscode_deno)(deno.land)

## Wrapping Up

So that's it! You now know how to get started with Deno. It's a simpler, more
secure alternative to Node.js and has some cool features like a built-in
key-value store and npm compatibility. With Deno 2.0 on the horizon, it's a
great time to get on board.
