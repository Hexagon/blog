---
title: Asynchronous code with JavaScript
part: 9
intro: "In this lesson, we will explore asynchronous code in JavaScript, learn what promises is, and how they relate to async/await."
---

Asynchronous operations are those that do not block the current code path, such
as fetching data from an API, reading a file, or performing a computation.

There are two ways of handling asynchronous operations in JavaScript:

- **Promises:** objects that represent the eventual completion or failure of an
  asynchronous operation.
- **Async/await:** convenience features to manage promises without getting into
  callback hell.

## The History of Asynchronous Code in JavaScript

JavaScript, originally designed for simple client-side scripting, lacked robust
mechanisms for handling asynchronous operations in its early days. You often had
to rely on callbacks, leading to the infamous "callback hell" where deeply
nested callbacks made code difficult to read and maintain.

To remedy that, **Promises** were introduced in the ECMAScript 6 (ES6)
specification, which was finalized in 2015. Promises are objects that represent
the eventual completion or failure of an asynchronous task. They have three
states: `pending`, `fulfilled` (resolved), and `rejected`, which make it easier
to handle errors and success cases separately.

Using promises, you can write code like this:

```javascript
fetchData()
  .then((data) => {
    // Promise were fulfilled (resolved), we got data!
  })
  .catch((error) => {
    // An error were catched (rejected), we got an error insted of data.
  })
  .finally(() => {
    // This is called whether the promise do resolve, or reject
  });
```

This addition significantly improved code readability and maintainability
compared to the fully callback-based code.

## The Rise of Async/Await

While promises were a great addition to javascript, they didn't really invite to
writing clean code. Async/await was introduced in ES8, also known as ECMAScript
2017, which was finalized in 2017. This feature built upon promises and aimed to
simplify asynchronous code even further. Async functions, denoted by the async
keyword, allow developers to write asynchronous code that looks almost
synchronous.

Here's an example of async/await in action:

```javascript
// We start by setting up a simulated fetch returning a string
// note the async keyword before function
async function simulatedFetch(url) {
  // Don't pay too much attention to this yet, we're simulating delay and returning a response
  // through a promise like a regular call to `fetch()` would have
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ json: () => `Data from ${url}` });
    }, 1000);
  });
}

// Now, we fetch data using uor simulated fetch method. Pay attention to the await keyword
// which do block the progress until the simulated fetch are done
try {
  console.log("Fetching data from 'https://api.example.com/data' ...");
  const response = await simulatedFetch("https://api.example.com/data");
  const data = await response.json();
  console.log(`Data received: ${data}`);
} catch (error) {
  console.error("Oops", error);
}
```

This will output the following, with one second delay between the first and
second row.

```
Fetching data from 'https://api.example.com/data' ...
Data received: Data from https://api.example.com/data
```

## The best of two worlds

I personally prefer `async`/`await` to the callback-based nature of Promises.
Despite that, there absolutely are scenarios where you may need to utilize them
both together.

Here is an example, where we fetch data from three api's simultaneously, and
continue when all three are done, or an error occurr. This is a whole lot
cleaner than making it with promises only, and wouldn't really work the same if
only using `async`/`await`.

```javascript
async function fetchDataFromApi1() {
  // Simulate fetching data from API 1
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ api1Data: "Data from API 1" });
    }, 2000); // Simulating a 2-second delay
  });
}

async function fetchDataFromApi2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ api2Data: "Data from API 2" });
    }, 1500);
  });
}

async function fetchDataFromApi3() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ api3Data: "Data from API 3" });
    }, 1000);
  });
}

// Using Promise.all() to fetch data from multiple APIs concurrently
async function fetchAllData() {
  try {
    const [api1Response, api2Response, api3Response] = await Promise.all([
      fetchDataFromApi1(),
      fetchDataFromApi2(),
      fetchDataFromApi3(),
    ]);

    // Process the data from all APIs
    console.log("Data from API 1:", api1Response.api1Data);
    console.log("Data from API 2:", api2Response.api2Data);
    console.log("Data from API 3:", api3Response.api3Data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
```

## Async/await and promises are single threaded

Async/await and promises are great to keep a website responsive while waiting
for requests to finish, or in the back-end waiting for a disk write to be done.
However, it's crucial to note that JavaScript's event loop operates on a single
thread. This means that even with asynchronous constructs, the code execution
remains single-threaded, as an example - if you block javascript with a
while-loop, nothing else will happen until the loop is done.

For true parallelism and utilization of multi-core processors there is Web
Workers, which will be covered in a later article.

## Importance of Proper Error Handling

Error handling is crucial when dealing with asynchronous code. Whether you're
using Promises or async/await, knowing how to catch and handle errors properly
can save you from a lot of headaches.

In this article, we've touched on error handling briefly. For a more in-depth
understanding, including common pitfalls like forgetting to use await in a
try/catch block, check out my dedicated article on
[Error Handling in JavaScript](/posts/guide-to-js/error-handling/).

## Wrapping Up

Understanding both promises and async/await gives you the power to write
beautiful asynchronous code in JavaScript. I’ll conclude this with two
additional tips:

- Avoid using any helper libraries. Your code will be easy to read for anyone
  and fully portable between browsers and runtimes like Deno and Node.js.

- Try to be consistent. If you use async/await, use it as far as possible and
  only work with pure promises when you need to. If you primarily use the
  Promise/callback pattern in a project, never mix in async/await.

For a deep dive into these topics, check out the MDN Reference on
[Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
and
[async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
