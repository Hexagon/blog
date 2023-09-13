---
title: "Functions and type guards in JavaScript"
title_short: "Functions"
part: 4
intro: "Now that we've covered control structures, let's step into another cornerstone
of JavaScript: functions. Functions allow us to bundle code into reusable
pieces. We will also cover type guards. Functions help reduce repetition and makes our code neater."
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
you can provide a value for the `name` parameter, and that value will be used
within the function's code.

### Passing Arguments

Arguments are the actual values you pass to a function when you call it. These
values are then assigned to the corresponding parameters within the function.
Here's how you pass arguments to the greet function:

```javascript
greet("Bob");
```

There are more ways to define functions. But first, let's look at how functions
return results.

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

Unlike regular functions, arrow functions don't have their own scope. `this` is
always inherited from where the arrow function was defined. Don't worry if you
don't get 'scope' and 'this' yet. We'll cover these in detail later. But it's
worth noting that there's more to it than how it looks.

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
working with this keyword.

## Dealing with Dynamic Types in JavaScript

Now that we've dug into functions and parameters, it's a good time to talk about
a feature (and sometimes challenge) in JavaScript: it's dynamically typed. What
does that mean? Well, a variable can be a number at one moment, a string the
next, and an object later on. While this gives us a lot of flexibility, it can
also lead to bugs. What will happen if passing a string to a function that was
expecting a number? That's where type guards come in handy.

### Type Guards

Type guards are a nifty tool for checking the type of a variable, especially
useful when you're working with function parameters that could be of multiple
types. They help you handle different types safely, ensuring that you don't
perform an operation on a type that doesn't support it. Let's look at some ways
to use type guards and how to use it to check function parameters.

### `typeof` Operator

The `typeof` operator can tell you the type of a variable (e.g., `'string'`,
`'number'`, `'object'`, etc.).

```javascript
let variable = "hello";

if (typeof variable === "string") {
  console.log("It's a string!");
} else {
  console.log("It's not a string!");
}
```

### `instanceof` Operator

The `instanceof` operator checks if an object is an instance of a particular
class or constructor.

```javascript
let date = new Date();

if (date instanceof Date) {
  console.log("It's a date object!");
}
```

### Custom Type Guards

You can also create custom type guards using functions.

```javascript
function isString(value) {
  return typeof value === "string";
}

let value = "I'm a string";

if (isString(value)) {
  console.log(value.toUpperCase()); // Safe to use string methods
}
```

Type guards add an extra layer of safety and functionality to your conditional
statements. They ensure that you're working with the right type of data, making
your code more robust.

## Using Type Guards in Functions

Let's say you have a function that should work with both numbers and strings.
You can use a type guard to check the type and then proceed accordingly.

```javascript
function processInput(input) {
  if (typeof input === "string") {
    console.log(input.toUpperCase());
  } else if (typeof input === "number") {
    console.log(input * input);
  } else {
    console.log("Invalid input type");
  }
}

processInput(5); // Output: 25
processInput("hi"); // Output: HI
```

In this example, the `processInput` function takes a parameter called `input`,
which could be either a string or a number. Inside the function, a type guard
(typeof) checks what type input is and performs actions accordingly. If it's a
string, it turns it to uppercase. If it's a number, it squares it. If it's
neither, it logs an error message.

### Conclusion

To really understand functions, you need to create some yourself. Play around
with them, tweak them, and see the results. Focus on regular functions to start
with. As you work with functions, you'll see how powerful they can be.

Before we wrap up, let's correct an issue from our last lesson's traffic light
example by using functions.

```javascript
// Function to handle traffic light logic
function handleTrafficLight(color) {
  console.log("The traffic light is " + color + ".");

  if (color === "red") {
    console.log("Stop the car!");
  } else if (color === "yellow") {
    console.log("Slow down, get ready to stop.");
  } else if (color === "green") {
    console.log("Go, you're good to go!");
  } else {
    console.log("Invalid traffic light color. Be cautious!");
  }
}

/* Use function to handle to test each traffic light color
 * We skip using a variable for the color, as it doesn't add
 * any value. */

handleTrafficLight("red");
handleTrafficLight("yellow");
handleTrafficLight("green");
```

Up next, we'll explore more JavaScript concepts. Keep practicing and happy
coding!
