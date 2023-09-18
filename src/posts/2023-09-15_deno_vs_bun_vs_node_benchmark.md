---
layout: post.njk
title: "Deno vs. Bun vs. Node.js: A Speed Comparison"
description: "An in-depth comparison of the speed performances of three popular JavaScript runtimes."
tags:
  - standalone
  - deno
  - bun
  - nodejs
  - benchmark
priority: 1.0
intro: "Following our recent deep dive into the feature sets of JavaScript runtimes, I decided to put them to the test in terms of raw performance. I created a new benchmarking tool called [jsrbench](https://github.com/hexagon/jsrbench) to provide a clearer picture of the performance of Deno, Bun, and Node.js under equivalent conditions. I also use another of my tools called [primer](https://github.com/hexagon/primer) to compare performance of prime number calculation using different approaches."
---

## Web Performance

For this test, I focused on three key endpoints: static file delivery, JSON response, and a compute-heavy task (prime number calculation). To make a proper 'apples-to-apples' comparison, I built a custom benchmarking tool, and used Express.js as the server platform. 

Express.js is an excellent choice, as I can use exactly the same server script for all three runtimes. The source code is available at [GitHub: hexagon/jsrbench](https://github.com/hexagon/jsrbench).

To put load on the server, I chose Siege [GitHub: JoeDog/siege](https://github.com/JoeDog/siege) as a tried and tested web server benchmarking utility.

Let's examine the server script used for benchmarking:

```javascript
import express from 'express';

const app = express();

// Implementation based of example 4 from https://flexiple.com/javascript/isprime-javascript/
// Modified with BigInt and removed NaN/Infinity checks
const checkPrime = function(n) {
    if (n % 1n || n < 2n) return 0;
    if (n == leastFactor(n)) return 1;
    return 0;
}
const leastFactor = function(n) {
    if (n == 0n) return 0;
    if (n % 1n || n * n < 2n) return 1;
    if (n % 2n == 0) return 2;
    if (n % 3n == 0) return 3;
    if (n % 5n == 0) return 5;
    for (let i = 7n; i * i <= n; i += 30n) {
        if (n % i == 0n) return i;
        if (n % (i + 4n) == 0) return i + 4n;
        if (n % (i + 6n) == 0) return i + 6n;
        if (n % (i + 10n) == 0) return i + 10n;
        if (n % (i + 12n) == 0) return i + 12n;
        if (n % (i + 16n) == 0) return i + 16n;
        if (n % (i + 22n) == 0) return i + 22n;
        if (n % (i + 24n) == 0) return i + 24n;
    }
    return n;
}

// Static content middleware
app.use('/static', express.static('public'));

// JSON response
app.get('/json', (req, res) => {
    res.json({
        message: "Hello, World!",
        number: 5,
        literal: `(${4}+${4})*${21.2}/${2}=${84.8}`
    });
});

// Simulate CPU-bound operation
app.get('/compute-prime', (_req, res) => {
    /* Implementation */
    const toCheck = 263n;
    if(checkPrime(263n)) {
        res.send(`Prime number ${toCheck} is a prime!`);
    } else {
        res.send(`Prime number ${toCheck} is not a prime!`);
    }
});

// Collect endpoints in an array
const endpoints = ['/static/index.html', '/json', '/compute-prime'];

// Automatically assign a port by supplying '0'
const server = app.listen(0, () => {
    // Output endpoints in JSON format
    const fullEndpoints = endpoints.map(
      endpoint => `http://127.0.0.1:${server.address().port}${endpoint}`
    );
    console.log(JSON.stringify({ 
      BENCHMARKABLE_ENDPOINTS: fullEndpoints 
    }));
});
```

Each endpoint is then tested using 10 and 100 user concurrency.

Here's the results:

### 10 user concurrency (requests / second)

| Endpoint                | Node.js  | Deno     | Bun      |
|-------------------------|----------|----------|----------|
| Static File Delivery    | 1712.37  | 1761.87  | 2559.35  |
| JSON Response           | 2223.57  | 2772.39  | 4138.38  |
| Prime Number Calculation| 2377.44  | 3480.13  | 4321.48  |

![10 user concurrency comparison](/img/bun-deno-node/concurrency-10.png "10 user concurrency comparison")

### 100 user concurrency (requests / second)

| Endpoint                | Node.js  | Deno     | Bun      |
|-------------------------|----------|----------|----------|
| Static File Delivery    | 2153.87  | 2571.72  | 2923.15  |
| JSON Response           | 2344.44  | 3468.01  | 4555.89  |
| Prime Number Calculation| 2286.53  | 3609.09  | 4341.41  |

![100 user concurrency comparison](/img/bun-deno-node/concurrency-100.png "100 user concurrency comparison")

Based on the conditions given, and results of this specific benchmark run;

- **Deno** is approximately **33% faster than Node.js**
- **Bun** is approximately **73% faster than Node.js**.

*Note: For detailed information and source code of the tests, please refer to the [jsrbench repository](https://github.com/hexagon/jsrbench).*

**The ifs and buts:**

So far, I've figured out that one of Bun's advantages lies in that it does not do compression by default. If I run a request to `Deno.serve`, the response will be brotli-compressed, while `Bun.serve` will give a raw response. When doing local benchmarks like this, a raw response without even evaluating the `Accept-Encoding` request header could give a slight advantage.

I also found that Bun does not set a `date`-header by default.

Lets examine, `Deno.serve` first:

```javascript
// Return some data as text/html
return new Response(data, {
    status: 200,
    headers: {
        "content-type": "text/html"
    },
});

/* - Request
GET /static HTTP/1.1
Accept-Encoding: gzip, deflate, br
Cache-Control: no-cache
...
*/

/* - Response
HTTP/1.1 200 OK
content-type: text/html
vary: Accept-Encoding
content-encoding: br
content-length: 593
date: Sun, 17 Sep 2023 18:20:20 GMT
*/

```

... and `Bun.serve`:

```javascript
return new Response(data, {
    status: 200,
    headers: {
        "content-type": "text/html"
    },
});

/* - Request
GET /static HTTP/1.1
Accept-Encoding: gzip, deflate, br
Cache-Control: no-cache
...
*/

/* - Response
HTTP/1.1 200 OK
Content-Type: text/html
content-length: 1494
*/
```

## Extended Benchmark: Prime Finding Algorithms

After exploring the standard web tasks like static file delivery and JSON response, I also took a deeper dive into the performance of different prime-finding implementations using an older project of mine, called [primer](https://github.com/hexagon/primer).

This essentially try a variety of prime-finding algorithms in all three runtimes:

- Optimized AssemblyScript WASM (AS WASM (opt))
- WASM built using AssemblyScript (AS WASM)
- WASM built using Emscripten (EMSDK WASM)
- Optimized JavaScript based on https://flexiple.com/javascript/isprime-javascript/
- Simple JavaScript

The test case was to find all primes between 3000000000-3000001000.

Let's see the result, higher is better:

![Find all primes between 3000000000-3000001000](/img/bun-deno-node/primer_ops_per_sec.png "Find all primes between 3000000000-3000001000")

The results were intriguing. In the WASM tests, Bun showcased performance similar to that of Node and Deno. However, in the pure JavaScript tests, there was a significant drop in operations per second, with both Deno and Node.js being about four times faster than Bun.

At first, I suspected that JavaScriptCore (the backend of Bun) might have issues with BigInts. However, when I tried using regular numbers, Deno and Node.js (based on V8) outperformed Bun by an even greater margin.

## Conclusion

* **Bun:** Bun excelled in speed, particularly with JSON and static file delivery. However, it does not compress responses and lacks a default Date-header, which might have affected the results. It's also much slower than both Deno and Node.js when it comes to pure JavaScript prime number calculation.

* **Deno:** Deno stood out by leveraging good performance while delivering more complete HTTP responses. It delivered on par with the other two platforms at WASM prime number calculation and, together with Node.js, outperformed Bun in the pure JavaScript prime number calculation tests.

* **Node.js:** Node.js was a bit slower in the web benchmarks but delivered on par in the calculation tests, and together with Deno, outperformed Bun in the pure JavaScript prime calculation.

These tests reiterate that the choice between Deno, Bun, and Node.js isn't just about features; performance plays a crucial role. It also hints that while Bun is fast in many scenarios, there are definitely scenarios where both Deno and Node.js are faster. The next step would be to compare web server performance in a test where each runtime can use its optimal method, and where all the runtimes provide exactly the same responses (compressed vs. uncompressed) etc.

**Note:** It's essential to understand that this benchmarking method isn't exact, and that the benchmarks don't translate directly to real-world performance. Factors like network latency, server hardware, and code optimization can significantly influence actual results.