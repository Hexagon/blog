---
title: "Functions in JavaScript"
part: 4
intro: "Now that we've covered control structures, let's step into another cornerstone
of JavaScript: functions. Functions allow us to bundle code into reusable
pieces. This helps reduce repetition and makes our code neater."
---

## What's a Function?

Imagine a function as a small machine. It takes some items (inputs), processes
them, and then gives out a finished item (output). In code, we provide functions
with input values (arguments), and they can return results.

## Creating and Calling Functions

Here's a basic function:

```javascript
function sayHello() {
  console.log("Hello JavaScript!");
}
```

To run this function:

```javascript
sayHello();
```

The output is: "Hello JavaScript!";

## Working with Parameters

Parameters allow you to pass values into a function so that it can perform
actions based on those values. Parameters make your functions flexible and
reusable, as you can customize their behavior by providing different values when
calling them.

### Declaring Parameters

When you define a function, you can declare parameters inside the parentheses.
These parameters act as placeholders for the values you'll pass when calling the
function. Here's an example:

```javascript
function greet(name) {
  console.log("Hello, " + name + "!");
}
```

In this `greet()` function, `name` is a parameter. When you call the function,
you can provide a value for name, and that value will be used within the
function's code.

### Passing Arguments

Arguments are the actual values you pass to a function when you call it. These
values are then assigned to the corresponding parameters within the function.
Here's how you pass arguments to the greet function:

```javascript
greet("Bob");
```

There is more ways to define functions, but before going through these, we'll
look at how functions return the result back to you.

## Returning from Functions

Functions can give back values once they're done. This is known as the "return
value".

```javascript
function square(number) {
  return number * number;
}

let squaredValue = square(4);

console.log(squaredValue);
```

This output is `16`.

## Why Are Functions Useful?

Here are three main reasons:

- **Avoid Repetition**: Write code once in a function and use it multiple times.
  No need to repeat yourself.

- **Stay Organized**: Use functions to keep similar code together. This makes
  your code clearer.

- **Break Down Tasks**: Split big tasks into smaller ones with functions. This
  makes hard jobs more manageable.

## Different Ways to Create Functions

### Regular Function:

This is the traditional way of defining a function.

```javascript
function sayHello(name) {
  console.log("Hello, " + name + "!");
}
```

### Function Expressions:

Here, the function is stored in a variable.

```javascript
let greet = function (name) {
  console.log("Hi, " + name + "!");
};
```

### Arrow Functions:

Introduced in ES6 (more on this later), arrow functions provide a more concise
way to write functions, especially for short one-liners or functions within
functions.

```javascript
let add = (a, b) => a + b;
```

Contrary to normal functions, arrow functions do never have their own scope.
`this` is always inherited from where the array function were defined. Do not
worry if you do not get "scope" and `this` yet, it will be covered in detail
later in the series, but I think it's worth mentioning.

### Constructor Functions:

You can also create functions using the Function constructor, though it's less
common.

```javascript
let multiply = new Function("a", "b", "return a * b");
```

### Self-invoking Functions:

These are functions that call themselves as soon as they're defined.

```javascript
(function (name) {
  console.log("Hello, " + name + "!");
})("Alice");
```

Each method has its own use cases. Regular functions and function expressions
are commonly used, while arrow functions are handy for short operations or when
working with this keyword. The

To really understand functions, you need to create some yourself. Play around
with them, tweak them, and see the results. Focus on regular functions to start
with. As you work with functions, you'll see how powerful they can be. Up next,
we'll explore more JavaScript concepts. Keep practicing and happy coding!
