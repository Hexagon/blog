---
title: "Introduction to Detris: Web-Based Tetris Using Deno"
part: 1
intro: "Welcome to the first part of our journey in building Detris, a web-based Tetris game using Deno. In this article, we'll introduce you to the classic game of Tetris and explain why I chose Deno as our runtime. We'll also give you a sneak peek into the special features of Detris, like single-player mode, multiplayer functionality, and even AI opponents. Get ready to dive deep into the world of Tetris, powered by modern web technologies!"
---

## What's Special About Detris?

Detris stands out through:

- **Server-side** stateless Tetris implementation in Deno TypeScript
- **Multiple game modes** including Single Player, Co-op, and PvP
- **"Intelligent" AI** opponent for multiplayer practice
- **Highscore** tracking and leaderboards
- **Lightweight**, lazy HTML5 client for gameplay
- **Deno KV** utilized for data persistence
- **Pure Deno** / Deno KV / Deno STD application without frameworks or
  dependencies. Uses all default settings for type checks, formatting and
  linting.
- **Special moves**. Supports special moves like most good
  Tetris-implementations, like floor kicks and wall kicks.

## Why Deno?

Deno is a JavaScript and TypeScript runtime, similar like Node.js. But it has
some cool features like better security and a built-in package manager. I chose
Deno for this project because it's modern and really easy to use.

If Deno is new to you, I recommend reading this short article first -
[Getting started with Deno](https://hexagon.56k.guru/posts/getting-started-with-deno/)
(hexagon.56k.guru).

## What's in This Series?

This series will guide you through creating your own version of Detris,
step-by-step. Here's the plan:

1. **Setting Up the Project**: How to get Deno up and running and what are the
   main files in the project.
2. **Building the Frontend**: How the game looks and how it talks to the server.
3. **Implementing Single-Player Mode**: Making the basic game work.
4. **Adding Multiplayer**: How to play with others online.
5. **Creating AI Opponents**: Adding computer players to the mix.
6. **Running the game and Future Plans**: Summary and what you could do next.

When you've walked through all parts, you'll hopefully have your own version of
[tetris.56k.guru](https://tetris.56k.guru)

So let's dive in and make an awesome Tetris game with Deno!
