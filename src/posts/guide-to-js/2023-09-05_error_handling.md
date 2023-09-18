---
title: "Error Handling and Debugging in JavaScript"
title_short: "Error Handling"
part: 11
intro: "In this article, we delve into the essential aspects of error handling and debugging in JavaScript. Learn about different types of errors, advanced debugging techniques, and various error-handling mechanisms to develop robust and maintainable JavaScript applications."
---

## Introduction

In a previous article, we touched the basics of debugging using `console.log()`
and `console.error()`. But debugging is more than that. As your projects grow in
complexity, you'll need a broader set of tools and techniques to handle errors
and debug effectively.

## Understanding Types of Errors

### Syntax Errors

Syntax errors are straightforward: the code won't even run if there's a syntax
issue.

```javascript
let name = "John";
```

### Runtime Errors

These errors occur while the program is running.

```javascript
let x = undefinedVariable;
```

### Logical Errors

Logical errors are tricky because the code runs without any issues, but it
doesn't behave as expected. Here's an example to demonstrate this. Let's say
you're writing a function to calculate the average of an array of numbers.

```javascript
function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

const avg = calculateAverage([1, 2, 3, 4, 5]);
console.log("Average:", avg);
```

Here, the loop goes from 0 to numbers.length instead of numbers.length - 1. This
won't throw any runtime or syntax errors, but the function will return the wrong
average because numbers[numbers.length] is undefined.

## Advanced `console` Functions

### `console.table()`

Displays tabular data as a table.

```javascript
console.table([{ name: "John", age: 30 }, { name: "Jane", age: 25 }]);
```

### `console.group()` and `console.groupEnd()`

Group related messages together.

```javascript
console.group("User Details");
console.log("Name: John");
console.log("Age: 30");
console.groupEnd();
```

### `console.time()` and `console.timeEnd()`

Time how long an operation takes.

```javascript
console.time("Array initialize");
let arr = new Array(1000000);
console.timeEnd("Array initialize");
```

## Error Handling Mechanisms

How you handle errors will vary based on whether you're using synchronous code,
Promises, or async/await. Let's dive into the alternatives.

### Error Handling in Synchronous Code

In synchronous code, you typically use try/catch blocks to catch exceptions.
Here's a simple example:

```javascript
try {
  // Your code here
  let x = 10;
  let y = 0;
  if (y === 0) {
    throw new Error("Cannot divide by zero");
  }
  let result = x / y;
} catch (error) {
  console.error(`Caught an error: ${error.message}`);
}
```

### Error Handling with Promises

With Promises, you use `.then()` for success cases and `.catch()` for errors.
Here's how you can handle errors:

```javascript
fetchData()
  .then((data) => {
    // Handle success
  })
  .catch((error) => {
    // Handle error
    console.error(`Error fetching data: ${error.message}`);
  });
```

### Error Handling with Async/Await

In async/await, you can use try/catch blocks, just like with synchronous code.
The difference is you **must** place await inside the try block:

```javascript
try {
  const response = await fetchData();
  // Handle success
} catch (error) {
  // Handle error
  console.error(`Error fetching data: ${error.message}`);
}
```

If you forget to use `await` inside a `try`/`catch` block in an `async`
function, or deliberately don't want to wait, you should know that the function
will not behave as you might expect. Specifically, the Promise will not be
caught by the catch block, because it won't have resolved or rejected at the
time the catch block is executed.

Here's a quick example:

```javascript
async function fetchData() {
  // This should be awaited, but it's not.
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Something went wrong")), 1000);
  });
}

async function main() {
  try {
    fetchData(); // Missing 'await' here
    console.log("This will run.");
  } catch (error) {
    console.error("This will NOT run", error);
  }
}

main();
```

In this example, `'This will run.'` will be printed, but `'This will NOT run'`
will not, because the Promise rejection is not caught.

To handle this, you can explicitly catch the Promise:

```javascript
async function main() {
  try {
    fetchData().catch((error) =>
      console.error("Caught by Promise.catch", error)
    );
    console.log("This will still run.");
  } catch (error) {
    console.error("This will NOT run", error);
  }
}

main();
```

Here, the error is caught by the `.catch()` method attached to the Promise
returned by `fetchData()`.

So, if you're not using `await`, make sure to attach a `.catch()` to the Promise
to handle any errors.

## Debugging Best Practices

### Use Version Control

Use a version control system like Git. If a bug appears, you can easily roll
back to a previous working state.

### Code Reviews

Peer reviews can catch errors and bad practices before they become part of the
codebase.

## Conclusion

Advanced error handling and debugging are essential for writing maintainable,
robust JavaScript code. Whether you're working in the browser or on the server,
these techniques will make your life easier.
