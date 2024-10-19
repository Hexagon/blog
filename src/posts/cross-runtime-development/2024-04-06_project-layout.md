---
title: "Cross-Runtime JavaScript: Streamlining Your Project Setup"
title_short: "Project Layout"
part: 2
intro: "Embrace the 'less-is-more' philosophy for cross-runtime JavaScript development.  Discover how Deno's and Bun's built-in features reduces complexity and enhances your workflow."
---

**You're visiting the staging area of hexagon.56k.guru, this is work in
progress**

In the previous article, we laid the foundation for cross-runtime JavaScript.
Now, let's dive into setting up a streamlined project structure that leverages
the power of tools built directly into Deno and Bun.

## The Beauty of Built-In

Modern runtimes like Deno and Bun are starting to change the JavaScript
development landscape. Deno come equipped with essential features like
formatting, linting, and type-checking, and Bun has built in support for
TypeScript. This means saying goodbye to the complexities of setting up external
build tools and transpilers just to get started. A positive side-effect of this
is that cross runtime development is getting simpler. While the Node community
is starting to adapt with tools such as `npx` for seamless typescript execution,
it's still far behind Deno which has built in linting, formatting and type
checking. So let's use Deno for this excersize, and leverage what's already
there instead of cluttering the project with third party dependencies and
configuration.

## Project Layout

Let's keep things simple:

1. **Project Root:** Continue with your `/my-project` folder.
2. **Source Code:** Place your `.js` or `.ts` files directly within this
   directory. For more complex projects, you can introduce subfolders to
   organize your code.
3. **Project metadata and configuration:** If you favor deno, try to keep as
   much as possible in `deno.json`, if using Node or Bun, tro to make the most
   of `package.json`. You probably won't need both, especially if using jsr.io
   to distribute your code later on, which handle npm transparently.

## Building a simple webserver

Let's rename our `main.js` to `main.ts`, to introduce the build in TypeScript
support, and modify it to be a simple cross-runtime webserver:

```typescript
import { express } from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from your cross-runtime Express server!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

Express works in all runtimes, we can ignore whether it's because it's written
to be cross-runtime, or if it's a result of the compatibility layers. It works.
Which brings us to

## Dependency management

Whether installing from npmjs, jsr or esm.sh, **the key to good cross-runtime
software is to only use packages which do state they support all runtimes**, and
use a modern code base. Do not settle for a automagically converted
CommonJS-package from esm.sh if there is a better alternative. Jsr.io more or
less forces package maintainers to specify compatibility, making it a great
choice.

In this example I'll use express as an example, not because it is a great
example of a cross-runtime package, but because it's a very known one, and easy
to work with.

When adding dependencies, focus on one runtime to start with - the development
runtime. In this example I'll add Express to `deno.json` by running
`deno add npm:express`. This will leave `deno.json` looking like:

```json
{
  "imports": {
    "express": "npm:express@^4.19.2"
  }
}
```

If you prefer Node, you'll want to use `npm i express` which would leave you a
`package.json` looking like below. (As we're using ESM-style imports, I've
manually added `"type": "module"` at the top.)

```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

## Less is More

Using Deno, you already have everything you need to keep your code nice and
tidy:

- `deno fmt` - Format the code
- `deno lint` - Lint the code
- `deno check <entrypoint>` - Type check the code

Both Bun and Deno offer the advantage of build in TypeScript support, and with
Node you can achieve a similar experience using tsx: `npx tsx <scriptname>.ts`.
