---
title: "Closures and Scopes in JavaScript"
title_short: "Scopes and Closures"
part: 12
intro: "In this article, we explore the important concepts of closures and scopes in JavaScript. Understand how scope works, what closures are, and how to use these features to write cleaner, more maintainable code."
---

## Introduction

Scope and closures in JavaScript are key concepts that form the foundation for
variable accessibility, code organization, and execution flow. Understanding
them is crucial for writing maintainable and efficient JavaScript code.

## Understanding Scope

Scope in JavaScript refers to the current context of code, which determines the
accessibility of variables. There are three types of scope: Global Scope,
Function Scope, and Block Scope.

### Global Scope

The global scope in JavaScript refers to the outermost scope of the program,
where variables are accessible from any part of the code. While declaring
variables in the global scope makes them easily accessible, it's generally
considered best practice to limit the use of global variables.

A variable declared outside of any function or block is a global variable. This
means it can be accessed and modified from any function or block in the code.

```javascript
const globalVar = "I am a global variable";
function accessGlobalVar() {
  console.log(globalVar); // Output: "I am a global variable"
}
accessGlobalVar();
```

#### The global object property

In JavaScript environments, global variables are actually properties of the
global object. In browsers, the global object is window, and in Node.js, it's
global.

```javascript
// In a browser
console.log(window.globalVar); // Output: "I am a global variable"

// In Node.js
console.log(global.globalVar); // Output: "I am a global variable"
```

#### The dangers of global scope

While global variables are easy to use, they can lead to problems such as:

- **Name Conflicts**: If you're not careful, global variables can conflict with
  other scripts or even with built-in JavaScript functions.
- **Maintainability**: Relying too much on global variables makes your code hard
  to understand and maintain.
- **Security Risks**: Malicious code can easily manipulate global variables,
  potentially leading to security vulnerabilities.

```javascript
let username = "John"; // A global variable

function displayUser() {
  // Accidentally overwriting a global variable
  username = "Doe";
  console.log(username); // Output: "Doe"
}

displayUser();
console.log(username); // Output: "Doe", username is changed
```

### Function Scope

In JavaScript, each function creates its own scope, also known as function scope
or local scope. Variables declared within a function are confined to that
function and are not accessible outside it.

A variable declared within a function is only accessible within that function
and is destroyed once the function has been executed. This makes function scope
a useful tool for variable encapsulation and data privacy.

```javascript
function myFunction() {
  const functionVar = "I am a local variable";
  console.log(functionVar); // Output: "I am a local variable"
}

myFunction();
// console.log(functionVar);  // ReferenceError: functionVar is not defined
```

### Block Scope

With the introduction of ECMAScript 6 (ES6), JavaScript got two new variable
declaration keywords: `let` and `const`. Unlike var, which provides
function-scope or global-scope variables, let and const enable block-scoped
variable declarations. Understanding this scope is essential for modern
JavaScript development.

In its simplest form, a block scope is the area within if, switch conditions or
for and while loops. Generally speaking, whenever you see `{` curly brackets
`}`, it is a block.

```javascript
if (true) {
  let blockVar = "I am a block variable";
}
```

Block-scoped variables can also be nested within other blocks, creating a
hierarchy of scopes. This is particularly useful for complex algorithms and data
structures like trees and linked lists.

```javascript
{
  let outerBlockVar = "I am outside";
  {
    let innerBlockVar = "I am inside";
    console.log(outerBlockVar); // Output: "I am outside"
  }
  // innerBlockVar is not accessible here
  // console.log(innerBlockVar);  // ReferenceError: innerBlockVar is not defined
}
```

## Variable hoisting

In JavaScript, variable declarations are "hoisted" to the top of their scope
during compilation. However, only the declarations are hoisted, not the
initializations

```javascript
function hoistingExample() {
  console.log(hoistedVar); // Output: undefined
  var hoistedVar = "Now I'm defined";
  console.log(hoistedVar); // Output: "Now I'm defined"
}
```

It's worth noting that the `let` and `const` keywords in ES6 have different
hoisting behavior compared to `var`. While `var` variables are hoisted and
initialized with `undefined`, `let` and `const` variables are not initialized,
leading to a ReferenceError if accessed before their declaration in the code
block.

```javascript
{
  console.log(blockVar); // ReferenceError: Cannot access 'blockVar' before initialization
  let blockVar = "I am a block variable";
}
```

## What Are Closures?

A closure is a function that has access to its own scope, the scope of the outer
function, and the global scope.

```javascript
function outerFunction() {
  var outerVar = "I am from outer function";

  function innerFunction() {
    console.log(outerVar); // Output: "I am from outer function"
  }

  return innerFunction;
}

var closure = outerFunction();
closure();
```

## Practical Uses of Closures

Closures are not just an interesting quirk of JavaScript; they have practical
applications in modern web development:

### Data Encapsulation

Closures can help in creating private variables that can't be manipulated from
outside the function.

```javascript
function counter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const myCounter = counter();
console.log(myCounter()); // Output: 1
console.log(myCounter()); // Output: 2
```

### Event Handlers and Callbacks

Closures are often used in event handlers and callbacks to preserve state even
after the executing context has exited.

### Module Pattern

The module pattern in JavaScript utilizes closures to create 'private'
variables, thereby providing a way of encapsulating functionality.

```javascript
const myModule = (function () {
  let privateVar = "I'm private";

  function privateMethod() {
    console.log(privateVar);
  }

  return {
    publicMethod: function () {
      privateMethod();
    },
  };
})();

myModule.publicMethod(); // Outputs "I'm private"
```

## Conclusion

Understanding scopes and closures is crucial for writing maintainable and
efficient JavaScript code. These concepts underpin many advanced features and
design patterns in JavaScript, making them foundational knowledge for any
serious JavaScript developer.
