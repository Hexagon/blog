---
title: "Event Loop and Concurrency Model in JavaScript"
title_short: "Event Loop and Concurrency Model"
part: 15
updated: "2026-11-26T12:00:00Z"
intro: "In this article, we delve into the Event Loop and Concurrency Model in JavaScript, revealing how they enable non-blocking asynchronous behavior."
---

## Introduction

JavaScript runs your code on a single thread, which means it executes one piece
of code at a time. Still, a web page can wait for API calls, react to clicks and
run timers, all seemingly at the same time. This is thanks to the Event Loop and
the Concurrency Model. Understanding these mechanisms is crucial for writing
efficient and responsive code.

## Concurrency Model

The Concurrency Model in JavaScript is based on an 'event loop', a mechanism
that enables non-blocking behavior. Here's a breakdown of the main components:

### The Call Stack

JavaScript uses a single call stack to manage function execution. When a
function is called, it's added to the stack. When it returns, it's removed from
the stack.

### Heap

The heap is where objects, arrays and functions are stored. Variables on the
stack hold references to them.

### Runtime APIs

Things like timers, network requests, file access and the DOM are not part of
the JavaScript language itself. They are provided by the environment: the
browser, or runtimes like Deno, Node.js and Bun. The waiting happens outside of
your JavaScript code, and when something is done, a callback is queued.

## The Event Loop

The Event Loop has one simple job: when the Call Stack is empty, take the next
job from a queue and run it. This process is what allows JavaScript to perform
non-blocking operations: instead of waiting, your code tells the environment
what to do when something is ready, and then returns.

### Task Queue and Microtask Queue

There are two important queues:

- **Tasks** (sometimes called macrotasks) include `setTimeout`, `setInterval`,
  I/O callbacks and user events like clicks.
- **Microtasks** include promise callbacks (`.then()`, and the code after an
  `await`), and `queueMicrotask()`.

After each task, the Event Loop runs all queued microtasks before it picks the
next task. So, promise callbacks always run before the next timer, even a timer
with a delay of zero.

```javascript
console.log("1. Synchronous code");

setTimeout(() => console.log("4. Task (setTimeout)"), 0);

Promise.resolve().then(() => console.log("3. Microtask (promise)"));

console.log("2. Still synchronous code");
```

This prints the lines in the order of their numbers, not in the order they
appear in the code.

## Popular Misconceptions

### Single-threaded vs. Multi-threaded

JavaScript runs your code on a single thread, but its non-blocking nature makes
it capable of handling multiple operations concurrently via the Event Loop. The
environment around it, like the network stack of the browser, does use multiple
threads.

### Asynchronous vs. Parallel

Asynchronous means that you can start something and continue with other work
while waiting for it to finish. Parallel means that several things actually run
at the very same moment. Promises and async/await give you the first, but not
the second: two async functions never run their JavaScript code at the same
time. For actual parallelism, you need workers.

## Anti-Patterns to Avoid

1. **Blocking the Event Loop**: CPU-intensive tasks can block the Event Loop,
   making the UI unresponsive, or a server unable to answer other requests.
2. **Nested Callbacks**: Often called 'Callback Hell', can make code hard to
   read and maintain.

### Resolving Blocking the Event Loop

Bad Practice

```javascript
// CPU-intensive task that blocks the Event Loop
for (let i = 0; i < 1e9; i++) {
  // Do something here
}
```

Good Practice

One way is to split the work into chunks, and give the Event Loop a chance to
run other tasks in between:

```javascript
async function processInChunks(total, chunkSize) {
  for (let start = 0; start < total; start += chunkSize) {
    const end = Math.min(start + chunkSize, total);
    for (let i = start; i < end; i++) {
      // Do something here
    }
    // Let timers, clicks and requests run before the next chunk
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

processInChunks(1e9, 1e6);
```

The other way is to move the work to another thread with a Web Worker. This
works the same in browsers and Deno. Node.js has its own `worker_threads`
module, with a slightly different API.

```javascript
// main.js
const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module",
});
worker.onmessage = (event) => console.log("Result:", event.data);
worker.postMessage(1e9);

// worker.js
self.onmessage = (event) => {
  let sum = 0;
  for (let i = 0; i < event.data; i++) sum += i;
  self.postMessage(sum);
};
```

### Resolving Nested Callbacks

This is mentioned in various ways earlier in the series, but worth repeating:

Bad Practice

```javascript
getData(function (a) {
  parseData(a, function (b) {
    validateData(b, function (c) {
      // Deeply nested structure
    });
  });
});
```

Good Practice

```javascript
// Using Promises
getData()
  .then(parseData)
  .then(validateData)
  .catch(handleError);

// Using Async/Await
async function main() {
  try {
    const a = await getData();
    const b = await parseData(a);
    const c = await validateData(b);
  } catch (error) {
    handleError(error);
  }
}
```

## Conclusion

Understanding the Event Loop and Concurrency Model in JavaScript is essential
for writing efficient, non-blocking code. This knowledge is foundational for
anyone looking to become a proficient JavaScript developer.
