---
layout: post.njk
title: "Two weeks with jsr.io: Do we need a new package registry?"
description: "I explore jsr.io, a promising new JavaScript package registry that aims to unify the fragmented ecosystem."
tags:
  - packagemanagers
  - jsr
  - npm
  - deno
  - bun
  - node
  - programming
priority: 1.0
metas:
  image: "https://hexagon.56k.guru/img/jsr_palette_og.webp"
header: "/img/jsr_palette_og.webp"
intro: "A while ago, I wrote a post called How to Create a Dual-Mode Cross-Runtime JavaScript Package: [How to Create a Dual-Mode Cross-Runtime JavaScript Package](https://hexagon.56k.guru/posts/dual-mode-cross-runtime-packages/), and while possible - it sure isn't simple. There has to be a better way, and the creators behind [jsr.io](https://jsr.io) seem to agree."
---

Lets start with a quick recap of the current situation:

### Multiple Package Registries

Each with their own ins and outs:

**Npmjs.com**

Is _the_ dominant package registry for JavaScript, with over 2 million packages
in place covering anything you want to do.

However, npm was originally designed for Node.js, CommonJS, and vanilla
JavaScript. Since then, things have changed:

- _Node.js_ is now Node + Deno + Bun + browsers + serverless functions.
- _CommonJS_ has been replaced by ESM, which is now the standard module format
  in JavaScript.
- _JavaScript_ is now JavaScript + TypeScript.

... yet npm has remained largely static, aside from its continuous growth. Now
we're left with a very large bucket of mostly uncategorized packages, many of
which are outdated or depend on outdated code.

**deno.land/x**

An effort from the team behind Deno, with a modern approach and (due to being
new) mostly consisting of ESM code, which is great.

On the problematic side, it relies on HTTPS imports, limiting its usefulness in
Node.js. It is merely a registry, with no proper package manager attached to it,
making version management tricky for users.

**jsdelivr.com**

Primarily serves as a CDN for front-end tools, but also offers libraries for
Deno and Bun over HTTPS, which is useful. However, just like deno.land/x, it
doesn't offer the same level of integration and package management tools as npm.

### Ongoing Efforts to Address the Issue

**unkpg.com & esm.sh**

CDNs serving as gateways to the npm registry, offering optional and automatic
CommonJS to ESM package transformation. This helps modernize older packages, or
make them available through https-imports in Deno or Bun.

- **yarn & pnpm**

Both alternative package managers built upon the npm registry. Their focus on
performance and disk-space efficiency aims to partially address the bulkiness
often associated with npm's package trees.

- **Bundlers/Transpilers**

Tools like:

- Babel: Transpiles newer JavaScript syntax for compatibility with older
  environments.
- TypeScript Compiler: Generates type definitions and JavaScript code from
  TypeScript.
- Rollup/Webpack: Create optimized bundles of code for browsers.
- ESLint: Catches potential errors and enforces code style.
- Prettier: Automates code formatting.

... can be essential. But when used together, the configuration overhead stacks
up, and makes each package in a dependency tree rely on different standards.

### Are These Efforts Enough?

Unfortunately, they don't solve the problem. Your favorite npm libraries won't
magically go from CommonJS to ESM, and when they do, they will most probably be
simple transpiled versions, depending on packages using transpiled code with
legacy polyfills. And while technically possible, npm isn't likely to introduce
a good filtering/classifying mechanism anytime soon. Currently, it has no
indicators whatsoever to distinguish what **is** a modern package and what
**looks** like one.

### So, what's the solution?

If I had complete freedom to design a new package registry and package manager,
it would need to match these requirements:

- **Support major runtimes**: Node.js, Deno, Bun, Browsers and Serverless
  environments.

- **Embrace ESM**: Leave CommonJS behind for cleaner modules and simpler
  development.

- **Visualize and encourage broad compatibility**: Clearly show which standards
  and runtime environments a package supports.

- **Prioritize TypeScript, while supporting vanilla JavaScript**: Type
  definitions should be an inherent part of the ecosystem.

- **Standardize Documentation**; Documentation should be an inherent part of the
  package, and exposed through the registry.

- **Offer a well-defined, Cross Runtime Standard Library**: Reduce reliance on
  third-party packages for common tasks.

### Meet jsr.io

This is where [jsr.io](https://jsr.io) stands out. It checks all those boxes:
You can write a package using TypeScript, add a `jsr.json`-file (or simply
include the package configuration in `deno.json`), publish it using
`deno publish`, `npx jsr publish` or `bunx jsr publish` - and voila. You'll have
a package ready for Node, Deno, Bun or Browser, TypeScript or JavaScript
complete with documentation.

#### How Does jsr.io Work?

- **Standardized and Automatic Transpilation**- You write clean TypeScript code,
  and during publishing, it automatically handles the transpilation to
  JavaScript, ensuring compatibility with your target runtimes (Node.js, Deno,
  Bun, etc.). It also generates complete type definitions (.d.ts files).

- **Automatic documentation** - You write in-code documentation
  (jsdoc/tsdoc-style), then jsr.io leverages your TypeScript code to generate
  and publish API documentation automatically. This lets you keep your docs
  up-to-date with minimal effort.

- **Visualizes Runtime Compatibility** -After publishing, you add a description
  and specify supported runtimes. This lets developers easily discover high
  quality packages that fit their needs when browsing jsr.io.

- **Tight integration with GitHub** -As soon as you enter the GitHub repo name
  in the package settings, it will be possible to automate package deployment
  without fiddling with secrets.

- **First class Deno-support** -To minimize configuration overhead, it is
  possible to enter the package metadata, such as name, version and imports
  directly into `deno.json`. If you also use the built in formatting, linting,
  typechecking and testing features of Deno, there will be no additional
  configuration at all. A complete but minimal package could consist of one
  typescript-file, and one configuration file.

- **Package Scoring** -Each package gets a score, based on how well suited it
  is. TypeScript gives a boost, so does proper symbol documentation etc. You
  should be looking for packages with score 100, and support for multiple
  runtimes, if possible.

- **Again, the standard library** -Many of the features you typically depend on
  likely exist in the standard library.

#### Roll Your Own jsr.io Package (The Quick Guide)

1. **Write the code**, in TypeScript.

2. **Create a 'jsr.json' (or use 'deno.json'):**

   - This file contains your package's metadata, including name, version,
     dependencies, etc.

3. **Publish:**

   - Choose your preferred tool: `deno publish`, `npx jsr publish`, or
     `bunx jsr publish`.
   - Authenticate with jsr.io if it's your first time publishing.
   - Your package is now live and ready to be used across major runtimes!

In the next post, I'll share some hands-on experience migrating a "real-world"
project to jsr.io and the surprises encountered along the way. Stay tuned!
