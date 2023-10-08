---
layout: post.njk
title: Autostarting And Monitoring Deno Applications And Services
description: A comprehensive guide to managing Deno applications at system boot using Docker, Pup and Deno Deploy.
metas:
  image: "https://hexagon.56k.guru/img/autostarting.webp"
header: "/img/autostarting.webp"
tags:
  - deno
  - docker
  - deploy
  - pup
  - javascript
  - standalone
priority: 1.0
intro: Planning to host your Deno service or server on your own but unsure about how to launch it at system boot and ensure its uptime? This guide is here to help. Dive into Docker and Pup as robust options for managing Deno apps at system boot, guaranteeing their continuous operation, resilience, and monitoring.
enable_toc: true
---

## TLDR

- **Docker:** Best for those seeking platform independence and consistent
  behavior across different environments. Ideal if you want to encapsulate your
  application within containers.

- **Pup:** Perfect for those running a Deno application ecosystem, with multiple
  server processes and/or scheduled tasks. Offers native system service
  integrations. Think of it as PM2 for Deno.

- **Deno Deploy:** A hands-off approach ideal for those wanting a serverless
  deployment method. Lets you run Deno applications in global data centers
  without managing server infrastructure.

Let's deep dive into these tools, check out their advantages, drawbacks, and how
they can be tailored to your specific needs.

## Pros and Cons

### Pup

Pup is a dedicated process manager developed for Deno. It aims to simplify the
management of applications and services across multiple platforms and
environments. Essentially, it is to Deno what PM2 is to Node.js.

**Pros**:

- Suitable for environments with multiple servers and/or accompanying tasks.
- Enables running your apps as a service on various platforms: Windows, Linux
  (like systemd, sysvinit, upstart), and macOS.
- Highly configurable with multiple start/restart policies, cron schedules etc.
- Advanced monitoring and logging.
- Built-in tools for inter-process communication and load balancing.

**Cons**:

- Not as universally portable as Docker.
- Might be too much for basic, single-process applications.

All operations in Pup are orchestrated around a central configuration file,
typically named `pup.json` or `pup.jsonc`.

### Docker

Docker is renowned for packaging applications into containers, ensuring
encapsulation and consistent behavior across different environments.

**Pros**:

- Platform-independent.
- Guarantees application consistency through isolated containers.
- Highly portable.

**Cons**:

- Might have a steep learning curve for newcomers.
- Not optimal for intricate setups with multiple intertwined processes or tasks.

### Deno Deploy

Deno Deploy is Deno's native serverless deployment platform, allowing developers
to run Deno applications in global data centers. By taking advantage of Deno
Deploy, users can sidestep the complexities of setting up and maintaining
servers, making it a breeze to deploy Deno apps.

**Pros**:

- Serverless deployment means less overhead and infrastructure to worry about.
- Globally distributed, ensuring low latency for users no matter their location.
- Integrated with Deno's standard library and runtime, providing a smooth
  development experience.
- Tight integration with the Deno runtime, ensuring optimal performance for Deno
  apps.

**Cons**:

- Being a relatively new platform, it might not yet have all the features of
  established platforms.
- Limited to Deno applications.
- Might not be suitable for applications with specific infrastructure
  requirements.
- Limited quota with paid options.

## Using Docker

Docker offers a (fairly) simple way to containerize your Deno applications,
making them portable and easy to deploy.

### Installation

Installation instructions for most distributions are available at
[docs.docker.com/engine/install](https://docs.docker.com/engine/install/). I do
not recommend using the versions included in the large distributions, as they
are often aged.

### Configuration

Create a file named `Dockerfile` in your project directory to customize how your
Deno application should run, here exposing port 1993 as an example:

```bash
# Use a specific Deno version from Docker Hub
FROM denoland/deno:1.37.0

# Expose port 1993 for external access
EXPOSE 1993

# Set the working directory inside the container
WORKDIR /app

# Use the 'deno' user to run commands for security reasons
USER deno

# Copy and cache the dependencies
COPY deps.ts .
RUN deno cache deps.ts

# Add the remaining application files and cache main.ts
ADD . .
RUN deno cache main.ts

# Define the default command to run the Deno app
CMD ["run", "--allow-net", "main.ts"]
```

After creating your Dockerfile, you'll want to build your Deno application into
a Docker image. Here's how:

```bash
$ docker build -t my-app .
```

This will build the Docker image based on the `Dockerfile` in the current
directory and tag (`-t`) the resulting image as "my-app".

### Testing

After building your Docker container, it's essential to test it to ensure your
application runs correctly:

```bash
$ docker run --rm -it --init -p 1993:1993 my-app
```

- `--rm`: This option automatically removes the container when it exits. This is
  especially useful during testing to prevent accumulating stopped containers.
- `-it`: These options allocate a pseudo-TTY and keep stdin open, making it
  suitable for interactive processes.
- `--init`: Ensures that an init process runs as PID 1 inside the container.
  This can handle signal forwarding and reaping, allowing your container to
  operate more like a standard Linux system.
- `-p 1993:1993`: Maps port 1993 from the host to port 1993 on the container,
  ensuring external access to your application.

After running the container, visit `http://localhost:1993` in your browser or
use tools like `curl` to check if the Deno application responds as expected. If
everything functions correctly, you can proceed to deploy it for auto-start at
boot.

### Run At System Boot

To ensure your Docker container starts automatically when the system boots, you
can utilize Docker's restart policies. The `--restart=always` policy ensures
that the container restarts regardless of its exit status. This is particularly
useful to automatically recover from container crashes or system reboots.

```bash
# Run the Docker container as a background process
docker run -d \
  --name my-app-instance \     # Name the container for easier reference
  --restart=always \       # Set the container to always restart
  -p 1993:1993 \           # Map the container port to the host port
  my-app
```

Now, even if your system reboots, Docker will automatically start your Deno
application. To confirm the restart policy of your container, you can run:

```bash
$ docker inspect my-app-instance --format "{{ .HostConfig.RestartPolicy.Name }}"
```

If everything is set up correctly, this command will return `always`.

### Monitoring

If you need to investigate any issues or see the output from your Deno
application, you can inspect the logs of the running container:

```bash
$ docker logs my-app-instance
```

This command fetches the logs for the container named `my-app-instance`. If you
want to continuously tail the logs, you can use:

```bash
$ docker logs -f my-app-instance
```

## Using Pup

### Installation

- Ensure Deno version `1.30` or higher is installed.
- Use the following command to install Pup:

```bash
deno run -Ar https://deno.land/x/pup/pup.ts setup --channel prerelease
```

### Configuration

Pup is configured using a file called `pup.json` placed in your project root.
Below is an example with a server `main.ts` which is autostarted and kept alive,
restarted daily at `00:50:00`, and an accompanying daily data update task
`daily-data.ts` which is set up to run daily at `09:05:00`.

```json
{
  "processes": [
    {
      "id": "server",
      "cmd": "deno run -A --unstable main.ts",
      "terminate": "0 50 0 * * *",
      "autostart": true
    },
    {
      "id": "daily-data-update",
      "cmd": "deno run -A --unstable daily-data.ts",
      "cron": "0 5 9 * * *",
      "restart": "error",
      "restartLimit": 2
    }
  ]
}
```

### Starting and Monitoring

To start your Pup ecosystem, just run `pup run` (or
`pup run --config custom/path/to/config.json`).

To check current status, use `pup status`, and to show the last 100 logs, use
`pup logs -n 100`.

### Run at System Boot

There are several ways to ensure that Pup starts when your system boots:

- **Using Docker**: Suitable for Mac, Windows, and Linux.

- **systemd/sysvinit/docker-init/upstart**: Exclusively for Linux.

- **Launchd**: For macOS users.

Let's delve into these options:

---

### Running Pup Using CLI

1. **Prerequisites**:

   - You should be able to execute `pup run` with `pup.json` in the present
     directory.

2. **User Mode Installation** (Recommended):
   - This mode supports only systemd and launchd but doesn't require root
     privileges. If using systemd, activate linger for your user:

     ```bash
     sudo loginctl enable-linger <your-username>
     ```
   - Install Pup as a user mode service:
     ```bash
     pup install --name my-service
     ```

3. **System Mode Installation**:

   - This method is universally compatible but may demand privileged access and
     certain manual steps.
   - Install Pup as a system service:
     ```bash
     pup install --system --name my-service
     ```

4. **Service Argument Reference**:

   **Methods**:

   - `install`: Enables, starts, and verifies the Pup instance as a system
     service.
   - `uninstall`: Removes the service.

   **Flags**:

   - Various flags such as `--config`, `--dry-run`, `--name`, `--system`,
     `--home`, `--user`, `--cwd`, and `--env` can be used to customize the Pup
     service according to your requirements.

### Running Pup with Docker

1. Ensure you have `pup.json` ready in your directory.

2. Create a `Dockerfile`:

```Dockerfile
FROM denoland/deno:debian-1.34.1

RUN mkdir /app
COPY . /app/

RUN ["deno","install","-Afrn","pup", "https://deno.land/x/pup/pup.ts"]

ENTRYPOINT ["sh", "-c", "cd /app && pup run"]
```

3. Build and run:

```bash
docker build -t my-pup-image .
docker run -d --restart=always --name my-pup-container my-pup-image
```

This guide is a general overview. For in-depth details or specific requirements,
always refer to the official [Pup documentation](https://pup.56k.guru).

**More reference for Pup**:

- [Docker setup with Pup](https://pup.56k.guru/examples/docker/README.html)
- [Pup with systemd](https://pup.56k.guru/usage/service.html)

## Using Deno Deploy

Deno Deploy is Deno's native solution to effortlessly launch your applications
across global data centers. This platform eliminates the need for managing
server infrastructure, while ensuring a seamless deployment experience.

### Deploying a Deno App with Deno Deploy

1. **Writing Your App**: Before deploying, ensure your Deno application is fully
   developed and tested. For this example, we assume a `main.ts` with a working
   web server.

2. **Deploying Your App**: Using the Deno CLI, you can deploy your app:

```bash
$ deno deploy --name my-app main.ts
```

This will publish the application and return a unique URL assigned by Deno
Deploy, such as `https://my-app.deno.dev`.

### Testing Your Deployment

It's crucial to ensure your app works as anticipated after deployment:

Visit the assigned URL (e.g., `https://my-app.deno.dev`) in your browser. If
correctly set up, you'll see whatever your web-server supplies.

### Setting Environment Variables

For applications that require environment variables, Deno Deploy offers a
straightforward mechanism:

```bash
$ deno deploy --name my-app --env VAR_NAME=value main.ts
```

Replace `VAR_NAME` and `value` with your environment variable's name and value
respectively.

### Rolling Back and Versioning

One of the beauties of Deno Deploy is its ability to manage versions:

- To rollback to a previous version, use the dashboard to navigate to the
  desired version and click "Activate".
- Each deployment automatically receives a unique version, enabling you to
  switch between versions effortlessly.

### Checking the Logs

To diagnose issues or view your application's metrics, Deno Deploy provides
real-time logging:

1. Navigate to your Deno Deploy dashboard.
2. Select your application (`my-app` in this example).
3. Browse through the metrics and logs to get insights into your application's
   performance.

This guide is a general overview. For in-depth details or specific requirements,
always refer to the official
[Deno Deploy documentation](https://docs.deno.com/deploy/manual).

### Conclusion

Both Docker and Pup offer solid solutions to ensure your Deno applications run
continuously. Docker offers portability and is platform-independent, while Pup
is a specialized tool for Deno and offers native system service integrations.
Choose the method that best fits your deployment environment and needs.
