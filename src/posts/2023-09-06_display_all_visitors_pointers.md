---
layout: post.njk
title: "Show All Visitor's Pointers on a Webpage"
description: "Learn how to visualize mouse movement from every visitor on your webpage using Deno, WebSockets, and optional tools like Pup and Nginx."
tags:
- standalone
- deno
- javascript
- html
- websockets
- pup
- nginx
priority: 1.0
intro: "In this step-by-step guide, you'll learn how to create a simple but cool webpage that shows mouse pointers of all its visitors. From setting up a Deno server to optional perks like keeping your app alive with Pup and serving it securely through Nginx."
extra: "multi-pointer"
---

## Install Deno

First, to start, you need to install Deno on your computer. Follow the steps
given on
[this page](https://deno.land/manual@v1.36.4/getting_started/installation).

### Create Main TypeScript File (main.ts)

Create a project folder, and new TypeScript file called main.ts. Paste your code
there. This sets up your server and handles the WebSocket connections.

```javascript
// Imports
import {
  Application,
  Router,
  send,
  Status,
} from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { exists } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";

// Constants
const LISTEN_PORT = 19192;
const STATIC_DIR = "./static";
const ROOT_PATH = "/";
const BROADCAST_INTERVAL = 150; // milliseconds

// Initialize Oak Application and Router
const app = new Application();
const router = new Router();

// Define Client Interface
interface Client {
  socket: WebSocket;
  pos: { x: number; y: number; id: string };
}

// Active clients list
const clients: Client[] = [];

// Helper Functions
const removeClient = (client: Client) => {
  const index = clients.indexOf(client);
  if (index > -1) {
    clients.splice(index, 1);
  }
};

const broadcastPositions = () => {
  const positions = clients.map((client) => client.pos);
  clients.forEach((client) => {
    const filteredPositions = positions.filter((pos) =>
      pos.id !== client.pos.id
    );
    client.socket.send(JSON.stringify(filteredPositions));
  });
};

const handleWebSocketConnection = (ws: WebSocket) => {
  const client: Client = { socket: ws, pos: { x: 0, y: 0, id: "undef" } };

  ws.onopen = () => clients.push(client);
  ws.onmessage = (event) => {
    const { x, y, id } = JSON.parse(event.data);
    client.pos = {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      id: id.substring(0, 10),
    };
  };
  ws.onclose = () => removeClient(client);
  ws.onerror = () => {
    console.error("WebSocket error observed");
    removeClient(client);
  };
};

// Routing
router.get("/ws", (ctx) => {
  if (!ctx.isUpgradable) {
    ctx.throw(501);
    return;
  }
  const ws = ctx.upgrade();
  handleWebSocketConnection(ws);
});

router.get("/", ({ response }) => {
  response.redirect("/index.html");
});

// Middleware
app.use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx, next) => {
    const filePath = ctx.request.url.pathname.replace(ROOT_PATH, "");
    const localFilePath = await join(STATIC_DIR, filePath);

    if (await exists(localFilePath)) {
      await send(ctx, filePath, { root: STATIC_DIR });
    } else {
      await next();
    }
  })
  .use((ctx) => {
    ctx.response.status = Status.NotFound;
    ctx.response.body = "Not Found";
  });

// Run Server
const broadcastInterval = setInterval(broadcastPositions, BROADCAST_INTERVAL);
Deno.unrefTimer(broadcastInterval);

app.listen({ port: LISTEN_PORT });
console.log(`Server started at http://localhost:${LISTEN_PORT}`);
console.log(
  `Visit http://localhost:${LISTEN_PORT}/index.html for the main page.`,
);
console.log(`WebSocket endpoint is ws://localhost:${LISTEN_PORT}/ws`);
```

### Add Configuration (deno.json)

Create a file named deno.json in the same directory as main.ts. Add the
following content:

```json
{
  "tasks": {
    "serve": "deno run -A --unstable main.ts"
  }
}
```

### Create Your Webpage (static/index.html)

Make a folder named static in the same directory and add an index.html file with
the code you have. This HTML file will handle the mouse pointer tracking and
display.

This html assumes there is a `arrow.cur` at `/static/img/`, you will have to
provide this yourself (or grab it from the GitHub repo linked below).

```xml
<!DOCTYPE html>
<html>
<head>
  <title>Hello Pointers!</title>
  <meta charset="utf8">
  <script>
    function wsUrl(s) {
      const l = window.location;
      const dir = l.pathname.substring(0, l.pathname.lastIndexOf("/"));

      return ((l.protocol === "https:") ? "wss://" : "ws://") + l.host + dir + s;
    }
  </script>
  <script>
    document.addEventListener("DOMContentLoaded", function(event) {
      const ws = new WebSocket(wsUrl("/ws"));

      const pointerId = Math.random().toString(36).substr(2, 9);  // unique identifier for this pointer

      ws.onopen = function(event) {
        console.log("Connection established");
      };

      ws.onclose = function(event) {
        console.log("Connection closed");
      };

      ws.onerror = function(event) {
        console.error("WebSocket error observed:", event);
      };

      let mousePos = { x: 0, y: 0, id: pointerId };
      let lastPos = { x: 0, y: 0, id: pointerId };

      document.onmousemove = function(e) {
        mousePos.x = (e.clientX / window.innerWidth) * 100;
        mousePos.y = (e.clientY / window.innerHeight) * 100;
      }

      setInterval(function() {
        if(ws.readyState === ws.OPEN) {
          if (!lastPos || lastPos.x !== mousePos.x || lastPos.y !== mousePos.y) {
            lastPos.x = mousePos.x
            lastPos.y = mousePos.y
            ws.send(JSON.stringify(mousePos));
          }
        }
      }, 150); // Send mouse position every second

      const cursors = {};

      ws.onmessage = function(event) {
        const positions = JSON.parse(event.data);
        positions.forEach((pos) => {
          if (pos.id === pointerId) return;  // skip own pointer

          let cursor = cursors[pos.id];
          if (!cursor) {
            cursor = document.createElement('img');
            cursor.src = 'cur/arrow.cur';
            cursor.style.position = 'absolute';
            document.body.appendChild(cursor);
            cursors[pos.id] = cursor;
          }
          cursor.style.left = pos.x + '%';
          cursor.style.top = pos.y + '%';
        });

        // remove any extra cursors
        Object.keys(cursors).forEach((id) => {
          if (!positions.find((pos) => pos.id === id)) {
            document.body.removeChild(cursors[id]);
            delete cursors[id];
          }
        });
      }
    });
  </script>
</head>
<body>
  <h1>Hello Pointers!</h1>
</body>
</html>
```

## Add This to an Existing Site

If you want multiple pointers on your existing site, you can insert this
JavaScript code anywhere on the page. Just make sure to expose the service
publicly, like shown below, and replace `your.domain`.

```javascript
document.addEventListener("DOMContentLoaded", function (event) {
  const ws = new WebSocket(wsUrl("wss://your.domain/pointer/ws"));

  const pointerId = Math.random().toString(36).substr(2, 9); // unique identifier for this pointer

  ws.onopen = function (event) {
    console.log("Connection established");
  };

  ws.onclose = function (event) {
    console.log("Connection closed");
  };

  ws.onerror = function (event) {
    console.error("WebSocket error observed:", event);
  };

  let mousePos = { x: 0, y: 0, id: pointerId };
  let lastPos = { x: 0, y: 0, id: pointerId };

  document.onmousemove = function (e) {
    mousePos.x = (e.clientX / window.innerWidth) * 100;
    mousePos.y = (e.clientY / window.innerHeight) * 100;
  };

  setInterval(function () {
    if (ws.readyState === ws.OPEN) {
      if (!lastPos || lastPos.x !== mousePos.x || lastPos.y !== mousePos.y) {
        lastPos.x = mousePos.x;
        lastPos.y = mousePos.y;
        ws.send(JSON.stringify(mousePos));
      }
    }
  }, 150); // Send mouse position every second

  const cursors = {};

  ws.onmessage = function (event) {
    const positions = JSON.parse(event.data);
    positions.forEach((pos) => {
      if (pos.id === pointerId) return; // skip own pointer

      let cursor = cursors[pos.id];
      if (!cursor) {
        cursor = document.createElement("img");
        cursor.src = "cur/arrow.cur";
        cursor.style.position = "absolute";
        document.body.appendChild(cursor);
        cursors[pos.id] = cursor;
      }
      cursor.style.left = pos.x + "%";
      cursor.style.top = pos.y + "%";
    });

    // remove any extra cursors
    Object.keys(cursors).forEach((id) => {
      if (!positions.find((pos) => pos.id === id)) {
        document.body.removeChild(cursors[id]);
        delete cursors[id];
      }
    });
  };
});
```

### Run the Server

Open your terminal and navigate to your project folder. Run the server with:

`deno run -A --unstable main.ts`

Your server should start running, and you can visit http://localhost:19192/ to
see it in action.

The full source code for this tutorial is available at GitHub, check it out on
[github.com/Hexagon/deno-pointer-tutorial](https://github.com/Hexagon/deno-pointer-tutorial).

## (Optional) Keep It Running With Pup

Want your server to stay up when you close the terminal? Use Pup, which is a
process manager for Deno. Follow the installation steps and usage guide at
[pup.56k.guru](https://pup.56k.guru).

Create a pup.json file with the specified content and run the following commands
to keep your server alive:

`pup install --name pointer-server-service`

To check the status (provided you use systemd I am):

`systemctl --user status pointer-server-service`

And to verify the process:

`pup status`

## (Bonus) Serve Through Nginx

Level up by serving your app behind an Nginx reverse proxy. This adds extra
layers of security and features.

First, if you doesn't already have it installed, install Nginx. If you're using
Ubuntu, you can do so with:

`sudo apt update sudo apt install nginx`

Next, edit your Nginx config file, usually
`/etc/nginx/sites-available/default``. Add the following location block in your
server block:

```
location /pointer/ {
  proxy_pass http://127.0.0.1:19192/;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_redirect off;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

This will serve the webpage and socker server through
`http(s)://your.domain/pointer/`.

Don't forget to reload Nginx after you edit the config:

`sudo nginx -s reload`

And that's it! You now have a live webpage that tracks and shows all the mouse
pointers of its visitors. Plus, you can keep it running 24/7 and serve it
securely.

Happy coding!
