---
layout: post.njk
title: "How to Create a Dual-Mode Cross-Runtime JavaScript Package"
description: "Learn how to create packages that support both ESM and CommonJS, working across various runtimes like Node.js, Deno, and browsers."
tags:
- javascript
- library
- standalone
- commonjs
- esm
- modules
- import
- npm
priority: 1.0
intro: "In this article, I'll guide you through two methods for publishing packages that seamlessly support both ESM and CommonJS and at the same time work across multiple runtimes, including Node.js, Deno, and web browsers."
---

As the world of JavaScript development continues to evolve, the need for good
packages that work in multiple environments becomes increasingly important. In
this article, we'll explore how to publish cross-runtime dual-mode JavaScript
packages that bridge the gap between ESM and CJS, enabling developers to use the
same packages and documentation regardless of environment.

Before diving into the publishing process, it's essential to grasp the core
concepts here. I may not have all the terminology perfectly defined, but here's
how I understand them:

## Dual-Mode packages

Dual-Mode packages are designed to provide compatibility with different
JavaScript module systems, primarily ES Modules (ESM) and CommonJS (CJS). This
allows developers to utilize the same package in various environments, ensuring
code reusability and flexibility. However, it's worth noting that being
dual-mode doesn't necessarily imply that the package can run in different
runtimes. This leads us to the concept of:

## Cross-Runtime packages

Cross-Runtime packages are JavaScript libraries designed to operate in multiple
environments, including Deno, Browsers, Node.js, and potentially others. They
aim to provide a consistent API experience regardless of the runtime being used.
A comprehensive Cross-Runtime package must support both ESM and CJS,
particularly since the Node.js ecosystem still heavily relies on CommonJS.

If we ignore the legacy of the Node.js ecosystem, we could of course build a
Cross-Runtime package without Dual-Mode.

## Node first, or Deno first?

There are at least two ways to approach this, where the first one utilizes
Deno's full set of built-in tools for managing the build process, along with a
package called DNT (Deno-to-Node-tool).

The other way is to start with Node.js first, where you use more conventional
build tools for testing, linting, bundling, and manually piece together a
package.json. This is probably preferred if you're converting a pre-existing NPM
library.

### The Deno-First Approach

The deno-first approch uses a tool called DNT (Deno-to-Node-Tool), which is
available at [github.com/denoland/dnt](https://github.com/denoland/dnt). This is
used through a custom build script residing in your repository.

The first step is is to set up a basic Deno library ready to publish to
deno.land/x. When you have that, you can proceed with setting up DNT.

Let's use the example of my small library ready made `entsoe-api-client` which
is has a `deno.json` already.

#### Adding the DNT build script

The heart of the Deno-first approach lies in the build process. The following
script, I call it `scripts/build_npm.ts`, will make use of DNT to create a
`/npm`-folder containing a full NPM package, ready to be published.

The script handles tasks like clearing the NPM directory, copying test data, and
building the package. It also creates a package.json file with relevant
information.

Let's check it out, make sure to read the comments.

**scripts/build_npm.ts**

```javascript
import { build, copy, emptyDir } from "./deps.ts";

// Clear NPM directory
await emptyDir("./npm");

// (optional) Copy test data, if you have some
// await copy("tests/data", "npm/esm/tests/data", { overwrite: true });S

// This assumes that the entrypoint of your module is ./mod.ts
await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  /*
  mappings: {
    "https://deno.land/x/zipjs@v2.7.17/index.js": {
      name: "@zip.js/zip.js",
      version: "^2.7.17"
    },
  },
  */
  package: {
    // package.json template
    name: "my-library-name",
    version: Deno.args[0],
    description: "My library description.",
    license: "MIT",
    repository: {/* ... */},
    author: "You <your@mail>",
    /* Additional information */
  },
});

// (optional) post build steps, you might want to copy some files?
// ---------------------------------------------------------------
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
// Deno.copyFileSync("README.md", "npm/README.md");

// (optional) Add .npmignore
// ---------------------------------------------------------------
// ensure the test data is ignored in the `.npmignore` file
// so it doesn't get published with your npm package, if relevant
/*
await Deno.writeTextFile(
  "npm/.npmignore",
  "esm/tests/data\nscript/tests/data\n",
  { append: true },
);
*/
```

Now, you just have to run `deno run -A scripts/build_npm.ts 0.0.1` to build
version 0.0.1 of your npm package. All related fikes will be generated in
`./npm`.

The final step is to navigate to the `./npm`-directory, and run `npm publish`, voila!

#### Updating the build pipeline with deno.json

To document this build step, you can modify the `task` section of `deno.json` to
include the new NPM build step. Here's an example configuration to set up 
testing and a NPM build:

```javascript
{
    /* ... existing configuration ... */
    "tasks": {
        "test": "deno test tests --allow-read",
        "build": "deno run -A scripts/build_npm.ts"
    }
}
```

Now, the npm package will ge generated when running `deno task build 0.0.1`.

### The node-first approach

The other way to create a Cross-Runtime package, is to start out from the
Node-side. The first step in creating our Node-first, Dual-Mode, Cross-runtime
package, is to make sure your setup supports both ESM and CommonJS. This could
either be achieved manually, or be handled with a build tool. The code base
should optimally be non transpiled javascript or typescript, ready to be
processed by Rollup or a similar tool.

Let's examine the `@hexagon/base64` library as an example. This library 
utilizes Rollup to generate ESM and CommonJS versions of the code using 
the following configuration:"

**rollup.config.js**

```
export default [
	{
		input: "./src/base64.single.js",
		output: {
			file: "dist/base64.cjs",
			format: "umd",
			name: "base64",
			exports: "default"
		}
	},
	{	
		input: "./src/base64.js",
		output: {
			file: "dist/base64.mjs",
			format: "es"
		}
	}
];
```

The source code for the library (`/src/base64.js`) is normal ES JavaScript
exporting the `base64` object in various ways.

**/src/base64.js**

```javascript
/* ...
   Library code making up the base64 object
   ... */

// Default export
export default base64;

// Named export
export { base64 };
```

Rollup can not handle multiple exports, so I also have a `/src/base64.single.js`
which does nothing but re-export the base64 object by default. This is used by
the UMD target of the Rollup configuration.

**/src/base64.single.js**

```javascript
import base64 from "./base64.js";
export default base64;
```

### The package.json

Now, `package.json` file is a crucial component of setting up a cross-runtime
dual-mode JavaScript package. It determines how your package is structured and
behaves in different environments. Let's take a closer look at the key sections
and their significance:

```
{
  /* ... your metadata ... */

  "scripts": {
    /* ... your existing build steps ... */
    "build:dist": "rollup -c ./rollup.config.js",
  },

  "type": "module",

  "main": "./dist/base64.cjs",
  "browser": "./dist/base64.min.js",
  "module": "./src/base64.js",
  "types": "types/base64.single.d.ts",

  "exports": {
    ".": {
      "import": "./src/base64.js",
      "require": "./dist/base64.cjs",
      "browser": "./dist/base64.min.js"
    }
  }
}
```

- **"scripts"**: This section contains the scripts necessary for building and
  managing your package. In the provided example, "build:dist" is used to
  trigger the Rollup bundling process. Depending on your specific package
  requirements, you may have additional scripts for testing, linting, or other
  tasks.

- **"type"**: The "type" field is set to "module", indicating that your package
  is designed to work with ESM (ES Module) imports.

- **"main"**: This field specifies the entry point for CommonJS environments,
  such as Node.js. It points to the CommonJS version of your package, typically
  located in a dist directory.

- **"browser"**: The "browser" field is used to specify an alternative entry
  point for browser environments. It points to a minified version of your
  package, enhancing compatibility with browsers.

- **"module"**: Similar to the "main" field, this specifies the entry point for
  ESM environments. It points to the ESM version of your package.

- **"types"**: This field indicates the location of TypeScript declaration files
  (.d.ts) for your package. These files provide type information to TypeScript
  users, improving the developer experience.

- **"exports"**: The "exports" field is a more recent feature that allows you to
  define how your package can be imported. It specifies different import paths
  for ESM, CommonJS, and browser environments, ensuring smooth cross-runtime
  compatibility.

Depending on your package's specific needs and configuration, you may need to
make more or fewer changes to your package.json. It's crucial to carefully
tailor and test this file, to ensure that it functions correctly when published.

## The Cross-Runtime part

The above is promarily to get the Dual-Mode part working in node. While Deno can
use npm packages out of the box, to create a complete Cross-Runtime package, you
should also adapt it to Deno.

This includes reading up on how a
[Deno library works](https://deno.land/manual@v1.36.4/introduction),
[publishing the package to deno.land/x](https://deno.land/manual@v1.36.4/advanced/publishing).

## Conclusion

Whether you opt for the Deno-first or Node-first approach, you should now have a
better understanding of how to develop packages that are more future-proof and
usable by a broader range of developers.

If you have insights, questions, or suggestions on this topic, please feel free
to leave comments below.

Happy coding, and may your packages bring value to the javascript community!
