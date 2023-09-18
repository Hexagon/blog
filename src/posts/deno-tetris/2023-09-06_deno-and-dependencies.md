---
title: "Setting Up the Project: Main files and Dependencies"
part: 2
intro: "Welcome to the second part of our series on building Detris, a web-based Tetris game using Deno. In this article, we'll take you through the initial steps of setting up your project environment. We'll cover the importance of the `deps.ts` and `main.ts` files, setting the foundation for the game development that lies ahead. By the end of this article, you'll have a base for the project and be ready to dive into the exciting world of frontend development!"
---

# Setting Up the Project: Main files and Dependencies

## Adding the Main Files

We'll start with the basics, setting up the HTTP server, starting the game loop,
and adding routes to the server.

All files we go through is available at the
[Detris GitHub repository](https://github.com/Hexagon/detris/tree/main/), but
adding them manually, and carefully examining the code will make it easier to
customize it later.

### deps.ts

In Deno, `deps.ts` is like a central place where you manage your project's
dependencies. Think of it as the `package.json`` but for Deno. It's a neat way
to keep all your imports in one place so you can easily manage them.

```javascript
export { serve } from "https://deno.land/std@0.190.0/http/server.ts";
export { serveFile } from "https://deno.land/std@0.190.0/http/file_server.ts";
export { join, resolve } from "https://deno.land/std@0.190.0/path/mod.ts";
```

Here, we're importing three main dependencies:

- **serve**: Used to create an HTTP server.
- **serveFile**: Used for serving files over HTTP.
- **join, resolve**: These are path manipulation utilities.

### main.ts

The main.ts file is where the magic happens. This is your server's entry point,
and it's where you'll put most of your backend logic.

There is some imports here that doesn't exist in your project yet, we will add
these later.

The `MainLoop` function is where our game logic will reside. It's going to be
called repeatedly to update the game state.

The `serve` function is used to set up an HTTP server that listens for incoming
requests.

```javascript
import { serve } from "./deps.ts";
import { serveFile } from "./deps.ts";
import { join, resolve } from "./deps.ts";

import * as highscore from "./highscores/highscores.ts";

import { Player } from "./server/player.ts";
import { Router } from "./server/router.ts";
import { Game } from "./game/game.ts";

// Main game loop
const games: Game[] = [];
const MainLoop = () => {

  // Wrap the full main login in a try catch
  try {
    for (const game of games) {
      // Start created games when requirements are met
      if (game.getStatus() === "created") {
        // Start if requirements are met
        if (game.checkRequirements()) {
          game.start();

          // Abandon game if not started after 120 seconds
        } else if (game.getCreateTime() < Date.now() - 120_000) {
          game.abandon();
        }
      }

      // Iterate games when playing
      if (game.getStatus() === "playing") {
        if (!game.iterate()) {
          game.over();
        }
      }

      // Update highscore if score changed
      if (game.scoreChanged()) {
        // Determine nickname
        let nickname = "";
        let score = 0;
        let level = 0;
        let lines = 0;
        if (game.listPlayers().length == 2) {
          if (game.getMode() === "battle") {
            const winner = (game.getData() as { Winner: number }).Winner;
            if (winner >= 0) {
              nickname = game.listPlayers()[winner].getNickname();
              score = (game.getData() as { Score: number[] }).Score[winner];
            }
          } else if (game.getMode() === "coop") {
            nickname = game.listPlayers()[0].getNickname() + " & " +
              game.listPlayers()[1].getNickname();
            score = (game.getData() as { Score: number }).Score;
            level = (game.getData() as { Levels: number }).Levels;
            lines = (game.getData() as { Lines: number }).Lines;
          }
        } else {
          nickname = game.listPlayers()[0].getNickname();
          score = (game.getData() as { Score: number }).Score;
          level = (game.getData() as { Levels: number }).Levels;
          lines = (game.getData() as { Lines: number }).Lines;
        }

        // Write highscore
        highscore.write(game.getMode(), {
          nickname,
          score,
          level,
          lines,
          ts: new Date(),
          tsInit: game.getCreateTime(),
        });
      }

      // Cleanup ended games
      const ended = game.getStatus() == "gameover" ||
        game.getStatus() == "abandoned";
      if (ended) {
        game.setCleanupTimer();

        // Remove current game if it was ended more than 120 seconds ago
        if (
          game.getCleanupTimer() &&
          game.getCleanupTimer() as number < Date.now() - 120_000
        ) {
          console.log("Cleaning up old game");
          games.splice(games.indexOf(game), 1);
        }
      }
    }
  } catch (e) {
    console.error("Main Loop Error: ", e);
  }

  // Recurse
  setTimeout(() => {
    MainLoop();
  }, 50);
};

// HTTP server
serve(async (req: Request) => {
  let pathname = new URL(req.url).pathname;

  // Serve using websockets
  if (req.headers.get("upgrade") == "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    new Player(socket, games);
    return response;
  }

  // Serve using router
  const routerResponse = Router(req);
  if (routerResponse) return routerResponse;

  // Serve static files, or 404
  if (pathname === "/") pathname = "/index.html";
  const resp = await serveFile(req, resolve(join("./assets/", pathname)));

  if (resp.status === 200) {
    /* Append custom headers to successful static file responses */
    resp.headers.set("Cache-Control", "public, max-age=86400"); // 86400 seconds is 24 hours
  }

  return resp;
}, {
  // Port number resolution
  //
  // 1. Environment variable PUP_CLUSTER_PORT
  // 2. Environment variable DETRIS_PORT
  // 3. Static port 8080
  //
  port: parseInt(
    Deno.env.get("PUP_CLUSTER_PORT") || Deno.env.get("DETRIS_PORT") || "8080",
    10,
  ),
});

MainLoop();
```

We also have `server/router.ts` which takes care of the available http routes.

```javascript
// server/router.ts

import { Application } from "../application.meta.ts";
import { read, readPlaying, readToday } from "../highscores/highscores.ts";

const routes = [
  {
    pattern: new URLPattern({ pathname: "/api/meta" }),
    handler: function (
      _req: Request,
      _match: Record<string, string>,
    ): Response | undefined {
      const meta = {
        ...Application,
        instance: Deno.env.get("PUP_CLUSTER_INSTANCE") || "0"
      };
      return new Response(JSON.stringify(meta), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/api/highscores/:mode" }),
    handler: async function (
      _req: Request,
      match: Record<string, string>,
    ): Promise<Response | undefined> {
      // Read highscores
      if (match.mode) {
        const response = await read(match.mode);
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
      }
    },
  },
  {
    pattern: new URLPattern({ pathname: "/api/playing/;mode" }),
    handler: async function (
      _req: Request,
      match: Record<string, string>,
    ): Promise<Response | undefined> {
      // Read highscores
      if (match.mode) {
        const response = await readPlaying(match.mode);
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
      }
    },
  },
  {
    pattern: new URLPattern({ pathname: "/api/today/:mode" }),
    handler: async function (
      _req: Request,
      match: Record<string, string>,
    ): Promise<Response | undefined> {
      // Read highscores
      if (match.mode) {
        const response = await readToday(match.mode);
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        });
      }
    },
  },
  // You can add more routes here...
];

export function Router(req: Request): Promise<Response> | undefined {
  for (const route of routes) {
    const match = route.pattern.exec(req.url);
    if (match) {
      return route.handler(req, match.pathname.groups);
    }
  }
  return undefined;
}
```

And that's it for this article! Up next, we'll dive into building the frontend.

Stay tuned!
