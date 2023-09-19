---
layout: post.njk
title: "SSH Key Management: Simplify Your Development Workflow"
description: "A step-by-step guide to SSH key management, focusing on simplifying the development workflow and enhancing security."
tags:
  - ssh
  - security
  - developer-tips
  - visual-studio-code
  - windows
  - linux
priority: 1.0
intro: "Secure, efficient, and passwordless. Dive into the world of SSH key management to enhance security and simplify your development life."
enable_toc: true
---

SSH keys provide an essential layer of security when working with remote
servers, but they're often overlooked. In this guide, we'll walk through SSH key
management, with a focus on making your development life simpler and more
secure.

## Introduction

SSH keys are cryptographic keys that are used to authenticate users to servers,
replacing the need for passwords. Not only are they more secure, but they also
make the day-to-day work of developers more convenient. By using an SSH key you
can either make your life simpler, by omitting a password altogether, or by
using a very simple password compared to what's normally required when logging
in using SSH.

Additionally, tools like Visual Studio Code support remote SSH sessions with key
authentication, making coding remotely secore, smooth and/or seamless.

## Creating a SSH key

While creating a SSH key, you will have the option to protect it with a
passphrase or not. While setting up an SSH key without a passphrase provides an
added layer of security compared to regular password authentication, by allowing
only the machine that carry the private part of the key to connect. If your
machine isbn't physically protected, it's crucial to further protect this key.
The best way to achieve this is by adding a passphrase to your key. As using a
password protected key will be a two factor autentication (something you own -
the machine carrying the key file, and something you know - the passphrase), you
can use a simpler passphrase compared to only using a regular SSH password.

Let's weight the pros and cons of passphrase protecting the key:

### Pros of using an SSH key with a passphrase:

- **Double Security**: A two-factor style mechanism. Someone needs both the
  private key and the passphrase to gain access.

- **Mitigation against theft**: Even if someone steals your private key, without
  the passphrase, they can't do much.

- **Security-conscious practice**: It's always good to get into the habit of
  adding extra security layers, especially for crucial credentials.

## SSH Key Without A Password

Using an SSH key without a password (or passphrase) is tempting because of its
simplicity. Just one tap and you're in. However, this convenience comes with its
share of risks.

### Simplicity:

- **Hassle-free access**: No need to remember or type in a passphrase every time
  you connect.

- **Automated scripts**: Especially useful when automation tools/scripts need to
  connect without human intervention.

### Security Implications:

- **Unauthorized Access**: If someone gets your private key, they can access
  anything that key has access to.

- **Loss of Device**: If your device with the key is stolen, the thief has
  immediate access to all accounts associated with that SSH key.

- **Complacency**: Often leads to neglecting regular audits of where and how the
  key is used.

Certainly! Let's dive into the creation process of an SSH key, covering both
Windows and Linux platforms:

## How to create an SSH key

SSH keys can be created using the `ssh-keygen` command available on most
platforms. The process might vary slightly between Windows and Linux.

### Preparations

For **Windows** users, the `ssh-keygen` command comes with the OpenSSH client,
which can be installed through Powershell, Windows Features or the Windows
Store.

**Using Powershell (Requires admin-shell)**

```bash
Add-WindowsCapability -Online -Name OpenSSH.Client
```

On Linux, the `ssh-keygen` tool is typically installed by default. If not, it's
available in most repositories.

```bash
sudo apt-get install openssh-client openssh-server
```

### Generating the key

Now here's how to generate an SSH key:

1. Open the terminal of your choice (Powershell on Windows).
2. Type the command:

```bash
ssh-keygen -t rsa -b 4096
```

This command instructs `ssh-keygen` to generate a key (`-t rsa`) of 4096 bits
(`-b 4096`). You'll be prompted to choose a save location and optionally add a
passphrase.

3. Follow the prompts. If you'd like to use the default location
   (`~/.ssh/id_rsa`) which will place the key in your home directory, just press
   `Enter`.

### Common `ssh-keygen` flags:

- `-t`: Specifies the type of key to be created. Common types are `rsa`, `dsa`,
  `ecdsa`, and `ed25519`.
- `-b`: Defines the number of bits in the key. Common values for RSA keys are
  `2048` or `4096`.
- `-f`: Specifies the filename of the key file.
- `-C`: Provides a comment. Useful for labeling keys.

### Expected output:

When you run the `ssh-keygen` command, you'll typically see output similar to:

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/home/username/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/username/.ssh/id_rsa
Your public key has been saved in /home/username/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX username@hostname
The key's randomart image is:
+---[RSA 4096]----+
|     ...         |
|    . . .        |
|   . . . .       |
|  . . . . .      |
| . . . . . .     |
| . . . . . .     |
| . . . . . .     |
| . . . . . .     |
| . . . . . .     |
+----[SHA256]-----+
```

The exact appearance might vary slightly depending on the version and platform.

### How to add a passphrase?

As previously mentioned, during the `ssh-keygen` process, you'll be prompted to
set a passphrase. If you've skipped that or need to change the passphrase of an
existing key, you can do so with:

```bash
ssh-keygen -p
```

This command will prompt you for the private key file's location, its current
passphrase (if any), and then let you set a new passphrase.

### Public and Private keys?

In the realm of SSH, there are two main components to the key pair: the public
key and the private key. Understanding the roles and security implications of
each is paramount to SSH security.

#### Private Key:

- **Nature:** The private key is exactly as the name implies—private. It should
  remain confidential and never be shared.
- **Usage:** It's the key you use to authenticate yourself to services that
  trust your corresponding public key.
- **Storage:** It's critical to securely store your private key. On Unix-like
  systems, it is typically saved in `~/.ssh/id_rsa` by default.
- **Security:** If someone obtains your private key, they can impersonate you to
  any system that trusts your public key. Hence, it's often protected with a
  passphrase.

#### Public Key:

- **Nature:** The public key can be freely shared and is not sensitive. It
  doesn't enable access on its own, but is used to verify a signature made by
  the corresponding private key.
- **Usage:** You install your public key on any remote system you wish to access
  using key-based authentication. When you attempt to log in, your SSH client
  uses your private key to send a signature, and the server uses the public key
  to verify it.
- **Storage:** Typically saved alongside the private key with a .pub extension,
  for instance: `~/.ssh/id_rsa.pub`.
- **Security:** There's no direct risk if someone gets your public key. However,
  it's a good practice to review authorized public keys on servers periodically
  to ensure no unauthorized keys have been added.

#### How do they work together?

When you try to SSH into a server:

1. The server sends you a challenge.
2. Your SSH client signs this challenge with your private key.
3. The server verifies the signature with the stored public key. If it matches,
   access is granted.
4. This system is both efficient and secure. As long as the private key remains
   private, only the holder of that key (hopefully, just you) can access the
   system.

#### Distributing your Public Key:

To utilize key-based authentication, your public key must be placed on the
servers you want to access. This can be done using the `ssh-copy-id` command or
manually appending it to the `~/.ssh/authorized_keys` file on the server.

## SSH Key Management for Windows 10/11

For those using Windows 10 or 11, here's a brief walk-through of setting up SSH
key authentication:

### Step-by-step guide:

1. **Enable extra Windows features (Requires admin-shell)**

```bash
Add-WindowsCapability -Online -Name OpenSSH.Client
```

2. **Generate an SSH key pair**

```bash
ssh-keygen
```

3. **Start the ssh-agent in the background**

```bash
ssh-agent -s
```

4. **Add your SSH private key to the ssh-agent**

```bash
ssh-add ~\.ssh\id_rsa
```

## SSH Key Management for Linux

For Linux users, here's a guide to setting up SSH key authentication:

### Step-by-step guide:

2. **Generate an SSH key pair**

```bash
ssh-keygen
```

3. **Start the ssh-agent in the background**

```bash
eval $(ssh-agent -s)
```

4. **Add your SSH private key to the ssh-agent**

```bash
ssh-add ~/.ssh/id_rsa
```

## Using SSH Keys for GitHub Authentication

GitHub supports SSH key authentication, making your interactions with
repositories secure and convenient.

### Step-by-step guide for GitHub:

1. Generate an SSH key pair (if you haven't already)

```bash
ssh-keygen
```

2. Copy the public key content. Either do it manually by opening `id_rsa.pub`
   from the `.ssh` subfolder of your home directory, or use one of these cli
   methods:

For Windows:

`clip < ~/.ssh/id_rsa.pub`

For Linux:

`cat ~/.ssh/id_rsa.pub | xclip -selection clipboard`

3. Add your SSH key to your GitHub account

   - Navigate to your GitHub account settings.
   - Go to "SSH and GPG keys" and click on "New SSH key".
   - Paste your copied public key into the "Key" field.
   - Provide a descriptive title and click "Add SSH key".

4. Test the SSH connection

```bash
ssh -T git@github.com
```

## Disabling Password Authentication on a SSH Server

If you're administering your own SSH server and have set up SSH keys, you can
improve security by disabling password authentication. This ensures that access
is only possible through SSH keys.

**Important: Before doing this, make sure it is possible to log in using your
SSH key, and that you have the private part of the key backed up. Or that you
have physical console access to the server.**

### Step-by-step guide:

1. **Edit the SSH daemon configuration**

Use your favorite editor to open the sshd_config file:

```bash
sudo nano /etc/ssh/sshd_config
```

By default there is usually a commented out row saying
`#PasswordAuthentication yes`, uncomment (or add) this row and set the value to
`no` so that it looks like: Add the following row:

`PasswordAuthentication no`

2. **Restart the SSH service**

```bash
sudo systemctl restart sshd
```

## Advanced: SSH Certificate Authority (CA)

An

 SSH Certificate Authority (CA) can help you scale authentication. A CA can sign public keys with a certificate, allowing servers to trust any client with a certified key, without having to know the client's public key in advance.

### Benefits:

- **Centralized Authentication**: No need to copy individual public keys to servers.
- **Revocation**: Easily revoke access by invalidating the certificate.
- **Time-bound Certificates**: Provide access for limited durations.

### Steps to Set Up an SSH CA:

1. **Generate a CA key pair**:

```bash
ssh-keygen -f /path/to/ca_key
```

2. **Sign user keys**:

```bash
ssh-keygen -s /path/to/ca_key -I user_identifier -n username,user2 /path/to/user/key.pub
```

3. **Install the CA public key on servers**:

Add to `/etc/ssh/sshd_config`:

```bash
TrustedUserCAKeys /path/to/ca_key.pub
```

4. **Restart SSH**:

```bash
sudo systemctl restart sshd
```

---

In conclusion, while SSH keys simplify and secure your development workflow,
it's essential to be mindful of best practices. If you choose the convenience of
a key without a passphrase, ensure you take additional precautions. This
includes limiting the key's use, regularly monitoring access, and maintaining
backup access methods. Always remember: security and convenience can co-exist,
but careful management is crucial. Happy coding!
