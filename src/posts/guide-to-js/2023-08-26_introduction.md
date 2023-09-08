---
title: The Guide to JavaScript - Introduction
part: 1
priority: 1.0
updated: "2023-09-08T14:44:00Z"
intro: "I’m Hexagon. I’ve been coding in front-end JavaScript since its inception and transitioned to back-end and library development when Node.js came onto the scene. Nowadays, I’m deeply invested in Deno. It provides a great developer experience right out of the box, making it a pleasure to work with. Whether you’re just starting out in web development or you're a seasoned developer seeking a refresher, you're in the right place.

The aim of this series is to impart a thorough understanding of vanilla JavaScript and its many features. We won't be using any external libraries, and all the code will be versatile. It'll work seamlessly whether you're in a browser or using runtimes like Node.js or Deno."
---

## What Sets This Guide Apart?

Before diving in, let's make something clear: This guide is packed with valuable info, but it won't cover every tiny detail of JavaScript. Think of it as your roadmap to mastering JavaScript. For the nitty-gritty stuff, like how to leftpad a string - Google is your friend. 

... and if you actually need to left pad a string, don't use a library for it. If you've never heard of the [left-pad incident](https://en.wikipedia.org/wiki/Npm#Left-pad_incident), now is the time to check it up.

Now, let’s get into what makes this guide special:

- **Focused on JavaScript Fundamentals**: We’re going deep into the building
  blocks of JavaScript. No skipping over the basics, and no drifting into
  specific libraries or runtime environments.
- **Works Everywhere**: Code examples that work in any JavaScript environment.
  No need to worry about compatibility.
- **Hands-on Approach**: After each article, you’ll have exercises to make sure
  you're not just reading but doing.
- **Up to date**: The information in this guide is up to date, and I will
  continue to keep it updated. At the top of each article you can see when it
  was last updated.
- **Based on experience, enhanced by AI**: This guide combines years and years
  of hands-on coding experience with cutting-edge AI tech. All articles are
  written by hand, then discussed with OpenAI's GPT-4 to make it both deeply
  informed and highly educational.

### What You'll Learn

Here's a sneak peek of the topics we'll cover:

- **Strings and Numbers**: Basic and advanced ways to work with text and
  numbers.
- **Arrays and Objects**: How to store and mess around with data.
- **Functions and Classes**: Writing reusable code? Here's how.
- **Promises and Async/Await**: Learn how to handle things that take time, like
  API calls.
- **Error Handling and Debugging**: How to find and fix bugs.
- **Closures and Scopes**: Understand how JavaScript manages access to data.
- **Prototypes and Inheritance**: Get into the object-oriented stuff.
- **Design Patterns**: Understand common design patterns to write clean and
  maintainable code.
- **Anti-Patterns and Best Practices**: Learn what not to do and how to write
  more efficient code.

Each article takes about 5-15 minutes to read, and spare at least 20 minutes for
exercises after each.

### Got Skills Already?

That's awesome! Even if you're already familiar with JavaScript, I bet you'll
find a few new nuggets of knowledge in this guide. Knowing other languages or
tech—like CSS, Rust, PLC IL, x86 Assembly, or HTML—is a bonus, but not a
must-have. If you ever get stuck, don't hesitate to ask a friend, drop a comment
below, join a JavaScript-related Discord server, or visit `r/learnprogramming`
on Reddit.

## So, what is JavaScript?

JavaScript is often associated with the dynamic and interactive elements you see
on websites — that's the frontend. But thanks to platforms like Node.js and
Deno, JavaScript has also made a name for itself in backend development.

What's great is that the core elements of the language stay consistent whether
you're working on the frontend or backend. While each environment has its own
specific tools and libraries, the basics apply everywhere.

## Our First Dive into JavaScript

Here's a simple JavaScript snippet demonstrating basic features like
**Variables**, **Comments**, and **Console Logging**. We'll cover these in depth
in future articles.

```javascript
// Declaring a variable named 'greeting' and assigning it a string value
let greeting = "Hello, World!";

// Logging the value of the variable to the console
console.log(greeting);
```

When you run this code, you'll see the output `Hello, World!` displayed.

This series aims to provide a smooth learning curve, no matter where you plan to
use JavaScript. You can always choose to run the code using:

1. **The Browser**: Open the browser, press `F12`, paste the code into the
   console, and hit enter.
2. **Node or Deno**: Save the code into a file, say `example.js`, and run it
   using `node example.js` or `deno run example.js` respectively.

Congratulations! You've just written and run your first JavaScript code that
works across multiple platforms.

## What's Next?

We're just scratching the surface here. Moving forward, we'll delve into more
complex topics, ensuring that the examples always work regardless of
environment.

You find the next article on the link just below, or at the top of the page,
under "The guide to JavaScript".
