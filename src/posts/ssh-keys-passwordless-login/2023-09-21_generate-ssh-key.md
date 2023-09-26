---
title: Creating and Managing SSH Keys
title_short: Creating SSH Keys
part: 2
priority: 1.0
updated: "2023-09-21T00:00:01Z"
intro: "Delve deeper into the creation and management of SSH keys, learning about passphrase protection and the differences between public and private keys."
---

## How to create an SSH key

When creating an SSH key, you'll be presented with the choice of protecting it
with a passphrase or not. Opting for an SSH key without a passphrase can be
perceived as more secure than traditional password authentication, primarily
because only a machine possessing the private key can establish a connection.
However, if your machine isn't physically safeguarded, it's paramount to add an
additional layer of protection to the key, which can be achieved through a
passphrase.

Using a passphrase-protected key introduces a two-factor authentication
mechanism: something you own (the machine containing the key file) and something
you know (the passphrase). With this dual-layer security, the passphrase can be
simpler than if relying solely on a traditional SSH password.

Now, let's weigh the pros and cons of passphrase-protecting your SSH key:

**Using a passphrase**

- **Pro: Double Security**: Acts as a two-factor authentication mechanism where
  access requires both the private key (something one has) and the passphrase
  (something one knows).

- **Pro: Mitigation against theft**: Even if an unauthorized individual obtains
  the private key, they can't utilize it without the passphrase.

- **Pro: Security-conscious practice**: It's always good to get into the habit
  of adding extra security layers, especially for crucial credentials.

**Skipping the passphrase**

_WARNING!: This is not recommended under any circumstances._

Using an SSH key without a password (or passphrase) is tempting because of its
simplicity. Just one tap and you're in. However, this convenience comes with its
share of risks.

- **Pro: Hassle-free access**: No need to remember or type in a passphrase every
  time you connect.

- **Pro: Automated scripts**: Especially useful when automation tools/scripts
  need to connect without human intervention.

- **Con: Unauthorized Access**: If the private key falls into the wrong hands,
  it can be used to gain unauthorized access to all its associated accounts.

- **Con: Loss of Device**: If your device with the key is stolen, the thief has
  immediate access to all accounts associated with that SSH key.

### Preparations

On **Linux**, the `ssh-keygen` tool is typically installed by default. If not,
it's available in most repositories.

```bash
sudo apt-get install openssh-client openssh-server
```

For **Windows** users, there are multiple methods to get the `ssh-keygen`
command. One way is through the OpenSSH client, which can be installed using
Powershell, Windows Features, or the Windows Store. Here, we'll show the
Powershell method (make sure to run Powershell as an administrator):

```bash
Add-WindowsCapability -Online -Name OpenSSH.Client
Get-Service -Name ssh-agent | Set-Service -StartupType Automatic
```

### Generating the key

Now, to generate an SSH key:

1. Open the terminal of your choice (Powershell for Windows users).
2. Input the command:

```bash
ssh-keygen -t rsa -b 4096
```

This command instructs `ssh-keygen` to generate a key (`-t rsa`) of 4096 bits
(`-b 4096`).

3. Follow the prompts. If you'd like to use the default location
   (`~/.ssh/id_rsa`) which will place the key in your home directory, just press
   `Enter`. You will also get the option to add a passphrase.

**Expected output**

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

### Common `ssh-keygen` flags

- `-t`: Specifies the type of key to be created. Common types are `rsa`, `dsa`,
  `ecdsa`, and `ed25519`.
- `-b`: Defines the number of bits in the key. Common values for RSA keys are
  `2048` or `4096`.
- `-f`: Specifies the filename of the key file.
- `-C`: Provides a comment. Useful for labeling keys.

### How to retrofit a passphrase

As previously mentioned, during the `ssh-keygen` process, you'll be prompted to
set a passphrase. If you've skipped that or need to change the passphrase of an
existing key, you can do so with:

```bash
ssh-keygen -p
```

After entering the command, you'll specify the location of the private key file,
its current passphrase (if set), and then input a new passphrase. Remember:
Always store your passphrase securely, as forgetting it can lead to challenges
accessing your key's associated resources.

### Public and Private keys

In SSH, two key components make up the key pair: the public key and the private
key.

#### Private Key

- **Nature:** The private key is exactly as the name implies—private. It should
  remain confidential and never be shared.
- **Usage:** It's the key you use to authenticate yourself to services that
  trust your corresponding public key.
- **Storage:** It's critical to securely store your private key. On Unix-like
  systems, it is typically saved in `~/.ssh/id_rsa` by default.
- **Security:** If someone obtains your private key, they can impersonate you to
  any system that trusts your public key. Hence, it's often protected with a
  passphrase.

#### Public Key

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
