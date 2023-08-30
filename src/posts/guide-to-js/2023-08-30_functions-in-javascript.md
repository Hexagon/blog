---
title: "Functions in JavaScript"
part: 5
---

# Functions in JavaScript

Now that we've covered control structures, let's step into another cornerstone of JavaScript: functions. Functions allow us to bundle code into reusable pieces. This helps reduce repetition and makes our code neater.

## What's a Function?

Imagine a function as a small machine. It takes some items (inputs), processes them, and then gives out a finished item (output). In code, we provide functions with input values (arguments), and they can return results.

## Creating and Calling Functions

1. Regular Function:

Here's a basic function:

```javascript
function sayHello(name) {
	console.log("Hello, " + name + "!");
}
```

To run this function:

```javascript
sayHello("Bob");
```

The output is: "Hello, Bob!".

There is more ways to define functions, but before going through these, we'll look at how functions return the result back to you.


## Returning from Functions

Functions can give back values once they're done. This is known as the "return value".

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

* **Avoid Repetition**: Write code once in a function and use it multiple times. No need to repeat yourself.

* **Stay Organized**: Use functions to keep similar code together. This makes your code clearer.

* **Break Down Tasks**: Split big tasks into smaller ones with functions. This makes hard jobs more manageable.

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
let greet = function(name) {
	console.log("Hi, " + name + "!");
}
```

### Arrow Functions:

Introduced in ES6 (more on this later), arrow functions provide a more concise way to write functions, especially for short one-liners.

```javascript
let add = (a, b) => a + b;
```

### Constructor Functions:

You can also create functions using the Function constructor, though it's less common.

```javascript
let multiply = new Function('a', 'b', 'return a * b');
```

### Self-invoking Functions:

These are functions that call themselves as soon as they're defined.

```javascript
(function(name) {
	console.log("Hello, " + name + "!");
})("Alice");
```

Each method has its own use cases. Regular functions and function expressions are commonly used, while arrow functions are handy for short operations or when working with this keyword. The 

To really understand functions, you need to create some yourself. Play around with them, tweak them, and see the results. Focus on regular functions to start with. As you work with functions, you'll see how powerful they can be. Up next, we'll explore more JavaScript concepts. Keep practicing and happy coding!