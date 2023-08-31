---
title: Embracing Modern Practices in JavaScript
part: 2
---

Before we dive deeper into JavaScript, it's crucial to talk about some big
changes in the field: the role of polyfills and the move away from old
libraries. Knowing what's happening now helps you make smarter choices in your
projects.

## What Are Polyfills?

In the world of web development, compatibility has always been a primary
concern. Due to the inconsistencies between browser versions and their support
for JavaScript features, developers often turned to polyfills. A polyfill is a
piece of code that provides modern functionality on older browsers that do not
natively support it. They essentially "fill in" the gaps where browser support
is lacking.

## The Age of Aged Polyfills and Libraries

There was a time when polyfills were essential because different browsers
supported different things. But now, most modern browsers have gotten their act
together and offer consistent JavaScript support. So, the need for polyfills has
gone down.

Likewise, people used to rely a lot on libraries to make JavaScript easier. But
as JavaScript got better, many of these libraries fell by the wayside. Nowadays,
you can often get the job done using just built-in JavaScript features.

## Embrace Built-in Features

One example of a big shift in JavaScript is the transition from custom AJAX
libraries to the native `fetch` API in JavaScript. Earlier, developers might
have leaned on jQuery's `$.ajax` or other similar custom solutions to make
asynchronous HTTP requests. Today, the built-in `fetch` function gives a more
standardized way to achieve the same, without relying on any external libraries.

Here's why focusing on built-in features in JavaScript is a good idea:

- **More Optimized:** Native features are generally faster and more efficient
  than their library counterparts.

- **Well-Supported:** Being part of the language specification, you can expect
  consistent support across all modern browsers.

- **Less Redundant:** Using built-in features reduces the need for external
  libraries, ensuring faster page loads and optimized performance.

## Staying Updated

As you continue to work with JavaScript, it's important to stay in the loop
about the latest features and updates. The JavaScript landscape is always
changing, and what was considered a best practice yesterday might not hold up
today. Make a habit of checking out official documentation, following key
developers on social media, and participating in coding communities. This will
not only keep your skills fresh but also let you take advantage of new and more
efficient ways of doing things.
