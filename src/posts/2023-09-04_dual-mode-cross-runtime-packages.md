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
intro: "This article will guide you through publishing dual-mode, cross-runtime JavaScript packages. Learn to create libraries compatible with both ESM and CommonJS, as well as different runtimes like Node.js, Deno, and browsers."
---

As JavaScript development continues to evolve, there's a growing need for robust
packages that function in multiple environments. In this article, we'll explore
how to publish cross-runtime, dual-mode JavaScript packages. These bridge the
gap between ESM and CommonJS, letting developers use the same package and
documentation, regardless of the environment.

Before diving in, let's get familiar with some key concepts:

## Dual-Mode packages

Dual-Mode packages are designed to work with multiple JavaScript module systems,
particularly ES Modules (ESM) and CommonJS (CJS). This ensures code reusability
and flexibility across various environments. Creating a dual-mode package has
several benefits:

- **Broader Compatibility**: Not all projects have transitioned to using ESM.
  Dual-mode ensures that your package can be consumed in projects that still
  rely on CommonJS.

- **Seamless Transition:** As the JavaScript ecosystem gradually moves toward
  ESM, having a dual-mode package ensures that users can seamlessly transition
  without having to swap out packages or refactor their codebase.

- **Reduced Maintenance:** Instead of maintaining separate packages for ESM and
  CJS, a dual-mode package allows you to manage a single codebase.

However, dual-mode doesn't guarantee that a package will work in different
runtimes, which brings us to:

## Cross-Runtime packages

Cross-Runtime packages work in multiple environments like Deno, web browsers,
and Node.js. They aim to provide a consistent API across different runtimes. A
comprehensive Cross-Runtime package should support both ESM and CJS, especially
since Node.js still largely uses CommonJS.

If we ignore the legacy constraints of Node.js, which heavily relies on
CommonJS, we could build a Cross-Runtime package using only ES Modules. This
would simplify the package but limit its compatibility with older Node.js
projects.

## Node first, or Deno first?

You have two main approaches: starting with Deno or Node.js. The Deno-first
approach uses Deno's built-in tools and the Deno-to-Node-Tool (DNT). On the
other hand, the Node-first approach uses conventional build tools for tasks like
testing, linting, and bundling. This approach is preferred for converting an
existing NPM library.

### The Deno-First Approach

The Deno-first approach relies on DNT (Deno-to-Node-Tool), which you can find on
[GitHub](https://github.com/denoland/dnt).

This tool is used through a custom build script in your repository.

The first step is to set up a basic Deno library ready for publishing to
deno.land/x. After that, you can proceed with DNT.

#### Adding the DNT build script

The core of the Deno-first approach is the build process. The following script,
called `scripts/build_npm.ts`, uses DNT to create a `/npm`-folder containing a
complete NPM package, ready to be published.

The script handles tasks like clearing the NPM directory, copying test data, and
building the package. It also creates a complete package.json file.

Let's check it out, make sure to read the comments.

**scripts/build_npm.ts**

```javascript
import { build, copy, emptyDir } from "./deps.ts";

// Clear NPM directory
await emptyDir("./npm");

// (optional) Copy test data, if you have some
// await copy("tests/data", "npm/esm/tests/data", { overwrite: true });

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
version 0.0.1 of your npm package. All related files will be generated in
`./npm`.

The final step is to navigate to the `./npm`-directory, and run `npm publish`,
voila!

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

Alternatively, you can opt for a Node-first approach to create your
Cross-Runtime package.

The first step is to make sure your project supports both ESM and CommonJS. This
could either be achieved manually, or be handled with a build tool. The code
base should optimally be non transpiled javascript or typescript, ready to be
processed by Rollup or a similar tool.

Let's examine the `@hexagon/base64` library as an example. This library utilizes
Rollup to generate ESM and CommonJS versions of the code using the following
configuration:"

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

The `package.json` file is key to setting up a dual-mode, cross-runtime
JavaScript package. It determines how your package is structured and behaves in
different environments. Let's take a closer look at the key sections and their
significance:

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

The steps mentioned so far focus on setting up dual-mode compatibility in
Node.js. While Deno can use npm packages out of the box, to create a complete
Cross-Runtime package, you should also adapt it to Deno.

This includes reading up on how a
[Deno library works](https://deno.land/manual@v1.36.4/introduction),
[publishing the package to deno.land/x](https://deno.land/manual@v1.36.4/advanced/publishing).

### My Experience with Dual-Mode, Cross-Runtime Packages

I'm passionate about modern JavaScript and portable packages. I love code that
runs both in the browser and server runtimes like Node.js and Deno.

Because of that, my own packages, Croner, Minitz, @hexagon/base64, Proper-Tags,
and Entsoe-API-Client all work with both CommonJS and ESM, on Deno as well as
Node.js and browsers.

### Helping Other Projects

I have also helped other projects, for example fido2-lib and openpgpjs to move
from CommonJS to ESM with Deno-support.

### The Ripple Effect

My library `@hexagon/base64`, initially built to support fido2-lib is now part
of the SimpleWebauthn project. It helped the project transition to be Dual-Mode
and also support Deno. So, making your packages dual-mode can really help other
projects as well.

## Conclusion

Creating dual-mode, cross-runtime JavaScript packages can be a rewarding
experience. It makes your code portable and reusable, allowing you to reach a
wider audience across different JavaScript environments. While there are a few
hurdles and considerations, such as managing compatibility and working with
different module systems and runtimes, the pros outweigh the cons.

If you have insights, questions, or suggestions on this topic, please feel free
to leave comments below.

Happy coding!
