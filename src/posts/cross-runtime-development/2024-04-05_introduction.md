---
title: "Cross-Runtime JavaScript: Introduction"
title_short: "Introduction"
part: 1
intro: "Kickstart your cross-runtime JavaScript journey! Learn the basics and why building code for all runtimes (Node.js, Deno, and Bun) matters."
---

**You're visiting the staging area of hexagon.56k.guru, this is work in
progress**

Master the art of cross-runtime JavaScript development and build applications
that run seamlessly in Node.js, Deno, and Bun. In this post, we'll explore the
core concepts and practical techniques you need to write function cross-runtime
JavaScript or TypeScript.

There are two ways to ensure your JavaScript code works flawlessly across
different runtimes:

- **Targeting a single runtime, distributing for multiple**: Use one runtime for
  development, and make it compatible with other runtimes through bundling or
  transpiling. One example of this is my cross-runtime library
  [croner](https://github.com/hexagon/croner), which i have adapted to browsers
  and different back-end runtimes as the've popped up, and made available
  through npm, deno.land/x, jsr.io, jsdelivr etc.

- **Cross-Runtime from the ground up:** The other path is to write truly
  cross-runtime code, which will run in all runtimes with no change whatsoever.
  This is a more recent technique which i've utilized in
  [webdiff](https://github.com/hexagon/webdiff), where I've used (or created)
  fully cross runtime libraries to make the program behave exactly the same
  regardless of environment.

Until recently, the only way to achieve cross-runtime compatibility was through
bundling and transpilation. However, with the rise of Deno's Node.js
compatibility layer and projects like jsr.io which highlights support for
multiple environments, we can now write JavaScript code designed from the ground
up to execute seamlessly in different environments.

## Where To Start?

First of all, you'll need a runtime environment installed, any will do, but i do
recommend Deno as the base, as it has build in support for formatting, linting,
type checking and whatnot. Reducing the need for build tools to zero. Bun is
also pretty good at this.

1. Create a project directory: `/my-project`.

2. Add an entropoint for the code, lets call it `main.js`:

```javascript
import { writeFile } from "node:fs/promises";

const fileContents = "Hello File!";

await writeFile("output.txt", fileContents);
```

3. Run it in any environment:

- **Deno:** `deno run --allow-write main.ts`
- **Bun:** `bun tun main.ts`
- **Node:** `node main.ts`

Great! Now we have a small program, working the same way across all runtimes
thanks to the Node-compatibility of Deno and Bun. In the next article, we'll
explore a full project layout, and some libraries which can simplify cross
runtime development.
