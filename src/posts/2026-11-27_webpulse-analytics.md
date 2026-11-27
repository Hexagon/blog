---
layout: post.njk
title: "WebPulse Analytics: a minimal, open source alternative to Google Analytics"
description: "WebPulse Analytics by Pinta365 is a free, MIT licensed and cookie-free web analytics tool. One script tag, the numbers you actually need, and nothing else."
tags:
  - analytics
  - privacy
  - open-source
  - deno
  - webpulse
  - standalone
priority: 1.0
intro: "Most small sites don't need Google Analytics. They need to know how many people came by, which pages they read and where they came from. [WebPulse Analytics](https://github.com/Pinta365/WebPulseAnalytics), written by [Pinta365](https://github.com/Pinta365), does exactly that. It is free, open source, sets no cookies and fits in one script tag. It is also what this blog runs on."
---

### Why not just use Google Analytics?

Google Analytics is free in the sense that you don't pay with money. You pay in
other ways:

- **Your visitors' data ends up with Google.** That is the business model, and
  it is the reason it is free.
- **Cookies, and therefore consent banners.** In the EU a tracker that sets
  cookies usually means a consent dialog, and a consent dialog means your
  numbers only count the people who clicked "accept".
- **It is huge.** GA4 is built for marketing departments that run campaigns
  across many properties. If you have a blog, most of it is noise, and finding
  "how many people read my last post" takes more clicks than it should.

For a personal site or a small project, that is a bad trade.

### What WebPulse is

WebPulse is lightweight, privacy-friendly web analytics. Its tagline sums it up
well: _"Know your traffic. Not your visitors."_ It consists of two parts, both
MIT licensed:

- [WebPulseBackend](https://github.com/Pinta365/WebPulseBackend), which serves
  the tracking script and receives the events.
- [WebPulseAnalytics](https://github.com/Pinta365/WebPulseAnalytics), the
  dashboard. It is a [Deno Fresh](https://fresh.deno.dev/) app backed by
  MongoDB, and it is also the source code of
  [webpulseanalytics.com](https://webpulseanalytics.com/).

### Minimal by default

The part I like most is that you decide what gets collected, per site. When you
add a project you choose from a short list of options:

| Option         | What it does                                                  |
| -------------- | ------------------------------------------------------------- |
| Page views     | Count a view each time a page loads.                          |
| User agent     | Store browser and device details.                             |
| Location       | Resolve an approximate country from the IP, once per session. |
| UTM parameters | Keep campaign parameters such as `utm_source`.                |
| Clicks         | Record link clicks, or optionally clicks on any element.      |
| Scrolls        | Record how far visitors scroll down the page.                 |

Turn off what you don't need, and it is never stored. A few things are true
whatever you pick:

- **No cookies.** The tracking script sets none. That is one less reason for a
  cookie banner.
- **No stored IP addresses.** If you enable location, the IP is used once at the
  start of a session to look up a country in a local database, on the WebPulse
  server itself. It is never sent to a third party, and it is never written to
  the database. Only the country is kept.
- **Bots are filtered out.** Each session is classified at ingest, and bot
  traffic is excluded from the numbers by default. A chip in the toolbar shows
  how many were hidden, and lets you toggle them back in if you are curious.

### The dashboard

The dashboard is deliberately small. There is an **overview** with headline
numbers across all your sites, a visitors chart compared with the previous
period, a card per site, and the top pages and sources. Then there is an
**analytics** page per site, where you pick a time range (from the last 30
minutes up to last year) and a metric to chart, such as visitors, page loads or
bounce rate. That's mostly it. It answers the questions I actually have, on one
screen, in light or dark mode.

### Installing it

Installing it is one line in your layout:

```html
<script async src="https://track.webpulseanalytics.com/client/<your-project-id>"
  type="module"></script>
```

This blog is built with [Lume](https://lume.land/), so for me it is a tiny
include, `components/webpulse-analytics.njk`, that the main layout pulls in. No
npm package, no build step, no configuration object.

### A word on availability

To be upfront: the hosted service at webpulseanalytics.com is in **closed beta**
right now, so you can't just sign up and start. If you want to use WebPulse
today, you host it yourself. Everything you need is in the two repositories, and
the [developer documentation](https://developer.webpulseanalytics.com/frontend/)
covers setting up both the front-end and the backend. The dashboard needs a
MongoDB instance and a GitHub OAuth app for login, and then it starts with
`deno task start`.

Self-hosting also brings the best privacy property of all: the data never leaves
your own server.

### Summary

If you want a big marketing suite with funnels, audiences and ad integrations,
WebPulse is not that, and doesn't try to be. If you want to know how your site
is doing without handing your visitors to an ad company, and without a cookie
banner, give it a try. It is free, it is open source, and the code is small
enough to actually read.

Star the repositories, open an issue if something is missing, or send Pinta a
pull request:

- [github.com/Pinta365/WebPulseAnalytics](https://github.com/Pinta365/WebPulseAnalytics)
- [github.com/Pinta365/WebPulseBackend](https://github.com/Pinta365/WebPulseBackend)

---

_This post was written with help from AI (Claude), and reviewed and edited by
me._
