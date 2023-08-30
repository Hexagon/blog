---
title: Fundamental Concepts of JavaScript
part: 3
---

# Fundamental Concepts of JavaScript

In this section we'll cover the key elements that are essential to working with
JavaScript. We'll touch on variables, debugging methods, and core principles.
Let's dive in!

## Variables in JavaScript

Think of variables in JavaScript as buckets that hold data. JavaScript is **loosely typed**, which simply means you don't have to specify what type of data will go into the bucket when you create it. The type of data a variable holds can also change as you go along.

You can declare variables using keywords like `var`, `let`, and `const`.

- `var`: The old way to declare variables. Still works, but should be avoided.
- `let`: Allows you to declare a block-level variable.
- `const`: Declares a block-level constant, meaning its value can't be
  reassigned.

```javascript
let name = "Hexagon"; // Storing a string
const pi = 3.14159; // Storing a number
```

Now, you can change the username variable to a number later if you want:

```javascript
name = 42;
```

But `pi`` can't change because it's a `const`.

## Comments in JavaScript

Comments in JavaScript provide a way for you to include notes or explanations
within your code. These comments are ignored by the JavaScript engine during
execution, so they have no impact on the code's behavior.

There are two types of comments in JavaScript:

1. **Single-line/inline comments**: Start with `//` and end at the line's end.

```javascript
// This is a single-line comment
let x = 5; // This is an inline comment
```

2. **Multi-line comments**: These start with `/*` and end with `*/`. Everything
   in between is treated as a comment.

```javascript
/* This is a
multi-line
comment */
let y = 10;
```

Comments are great for clarity, but if your code is simple and self-explanatory, you don't always not need them. Always aim for code that's easy to understand without needing a bunch of comments.

## Console Logging

`console.log()` is often the first thing you'll learn for debugging. It's a way to check variable values or just show messages. And guess what? It works the same whether you're coding for a browser, Node.js, or Deno.

```javascript
let greeting = "Hello, World!";
console.log(greeting); // Outputs: Hello, World!
```

**Running the code**:

- **In the Browser**: Press `F12`to open the Developer Tools. Navigate to the
  'Console' tab. Here, you can directly paste and run JavaScript code. Any
  output from `console.log()` will be displayed here.

- **In Node.js**: Save your JavaScript code into a file, for example,
  `script.js`. Open a terminal or command prompt, navigate to the directory
  containing your file, and run `node script.js`. The output of `console.log()`
  will be shown in the terminal.

- **In Deno**: Similar to Node.js, save your JavaScript code into a file. Then,
  in your terminal or command prompt, navigate to the directory and run
  `deno run script.js`. Again, the output from `console.log()` will show in
  the terminal.

### Expanding on Console Logging Functions

Besides `console.log()`, the console object has other useful methods to make debugging easier.

The `console.`-functions take any object as parameter, outputting it the best
way it can.

- **console.info()**: Used for informational messages, similar to
  `console.log()` in most browsers.

```javascript
console.info("This is an informational message.");
```

- **console.warn()**: Pops up a warning, usually in yellow.

```javascript
console.warn("This is a warning message.");
```

- **console.error()**: Shows an error message, generally in red.

```javascript
console.error("This is an error message.");
```

- **console.table()**: Useful for displaying data in a table format.

```javascript
let users = [{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }];
console.table(users);
```

## In Summary

Grasping variables and the range of debugging tools like console methods sets the foundation for your JavaScript adventures. Keep an eye out for the next part in this series, where we'll dig into even more JavaScript basics!