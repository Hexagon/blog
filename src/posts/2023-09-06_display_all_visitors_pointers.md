---
layout: post.njk
title: "Show Multiple Mouse Pointers on a Webpage"
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
intro: "In this step-by-step guide, you'll learn how to create a simple but cool webpage that shows mouse pointers of all its visitors. From setting up a Deno server to optional perks like keeping your app alive with Pup and serving it securely through Nginx, we've got you covered."
extra: "multi-pointer"
---

Hey there! Ever wanted to visualize mouse movement from every visitor on your
webpage? Sounds cool, right? Today, we’re going to build a simple webpage that
does just that. We'll cover everything from installing Deno to setting up Nginx.
If you'd like to see the full source code, check it out on GitHub.

## Install Deno

First off, you need to install Deno on your computer. Follow the steps given on
[this page](https://deno.land/manual@v1.36.4/getting_started/installation).

### Create Main TypeScript File (main.ts)

Create a project folder, and new TypeScript file called main.ts. Then paste the
code you've got there. This sets up your server and handles the WebSocket
connections.

```javascript
import {
  Application,
  Router,
  send,
  Status,
} from "https://deno.land/x/oak@v12.5.0/mod.ts";
import { exists } from "https://deno.land/std@0.192.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";

const LISTEN_PORT = 19192;
const STATIC_DIR = "./static";
const ROOT_PATH = "/";

const app = new Application();
const router = new Router();

interface Client {
  socket: WebSocket;
  pos: { x: number; y: number; id: string };
}

const clients: Client[] = [];

// Remove a client from the clients array
const removeClient = (client: Client) => {
  const index = clients.indexOf(client);
  if (index > -1) {
    clients.splice(index, 1);
  }
};

// Send positions of all clients to all clients
const broadcastPositions = () => {
  const positions = clients.map((client) => client.pos);
  for (const client of clients) {
    const otherPositions = positions.filter((pos) => pos.id !== client.pos.id); // Filter out own position
    client.socket.send(JSON.stringify(otherPositions));
  }
};

// Handle WebSocket Connection
const handleWebSocketConnection = (ws: WebSocket) => {
  const client: Client = {
    socket: ws,
    pos: { x: 0, y: 0, id: "undef" },
  };

  ws.onopen = () => {
    clients.push(client);
  };

  ws.onmessage = (event) => {
    const newPos = JSON.parse(event.data);
    client.pos.x = parseInt(newPos.x, 10);
    client.pos.y = parseInt(newPos.y, 10);
    client.pos.id = newPos.id.substring(0, 10); // Allow at most 10 chars
  };

  ws.onclose = () => {
    removeClient(client);
  };

  ws.onerror = () => {
    console.error("WebSocket error observed");
    removeClient(client);
  };
};

router.get("/ws", (ctx) => {
  if (!ctx.isUpgradable) {
    ctx.throw(501);
    return;
  }
  try {
    const ws = ctx.upgrade();
    handleWebSocketConnection(ws);
  } catch (err) {
    console.error("Failed to upgrade the connection", err);
    ctx.throw(500);
  }
});

router.get("/", ({ response }: { response: any }) => {
  response.redirect("/index.html");
});

app.use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx, next) => {
    if (!ctx.request.url.pathname.startsWith(ROOT_PATH)) {
      await next();
      return;
    }

    const filePath = ctx.request.url.pathname.replace(ROOT_PATH, "");

    const localFilePath = await join(
      STATIC_DIR,
      ctx.request.url.pathname.replace(ROOT_PATH, ""),
    );

    const fExists = await exists(localFilePath, {
      isFile: true,
      isReadable: true,
    });
    if (fExists) {
      await send(ctx, filePath, { root: STATIC_DIR });
    } else {
      await next();
    }
  })
  .use((ctx) => {
    // If no route has been matched
    ctx.response.status = Status.NotFound;
    ctx.response.body = "Not Found";
  });

// Start an interval for broadcasing mouse positions
const broadcastInterval = setInterval(broadcastPositions, 150);
// but dont keep the main loop running just because of this
Deno.unrefTimer(broadcastInterval);

app.listen({ port: LISTEN_PORT });

console.log("Started");
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

```xml
<!DOCTYPE html>
<html>
<head>
    <title>56k</title>
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
          };
      });
  </script>
</head>
<body>
    <h1>Hello Pointers!</h1>
</body>
</html>
```

### Run the Server

Open your terminal and navigate to your project folder. Run the server with:

`deno run -A --unstable main.ts`

Your server should start running, and you can visit http://localhost:19192/ to
see it in action.

## (Optional) Keep It Running With Pup

Want your server to stay up when you close the terminal? Use Pup, a process
manager. Follow the installation steps and usage guide at Pup.

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

First, if you doesn't altready have it installed, install Nginx. If you're using
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

Don't forget to reload Nginx after editing:

`sudo nginx -s reload`

And that’s a wrap! You've now got a live webpage that tracks and displays all
the mouse pointers of the visitors. Plus, you can keep it running 24/7 and serve
it through a secure reverse proxy. Go ahead, add this super cool feature to your
website. Happy coding! 🚀
