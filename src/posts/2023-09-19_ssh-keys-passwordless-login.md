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
intro: "SSH keys provide an essential layer of security when working with remote
servers, but they're often overlooked. In this guide, we'll walk through SSH key management to simplify and enhance the security of your development workflow."
enable_toc: true
---

## Introduction

SSH keys are cryptographic keys that facilitate the authentication of users to
servers, offering an alternative to traditional passwords. They not only
heighten security but also greatly enhance the convenience of daily tasks for
developers.

By employing an SSH key, you can:

- Enhance your environment's security by disabling regular password access and
  mandating a passphrase-protected SSH key.

- Simplify your login process by either forgoing the need for a password or
  opting for a simpler password than typically necessary for SSH logins.
  However, it's worth noting that this isn't a best practice and should be
  reserved for situations like personal home setups where security is not a
  paramount concern. We'll delve deeper into this aspect later.

Furthermore, tools such as Visual Studio Code, and GitHub have incorporated
support for remote SSH sessions using key authentication, ensuring that remote
coding is both secure and seamless.

## Quick Start

For those who want to quickly set up SSH key management without diving into the details, here's a brief step-by-step guide:

### Generate an SSH Key

**Linux/MacOS**:

```bash
ssh-keygen -t rsa -b 4096
```

**Windows (PowerShell as administrator)**:

```bash
Add-WindowsCapability -Online -Name OpenSSH.Client
Get-Service -Name ssh-agent | Set-Service -StartupType Automatic
ssh-keygen -t rsa -b 4096
```

Press `Enter` for default settings and decide whether to set a passphrase.

### Start SSH Agent & Add Your Key

**Linux/MacOS**:

```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa
```

**Windows**:

```bash
Start-Service ssh-agent
ssh-add ~\.ssh\id_rsa
```

### Distribute the Public Key to the Remote Server

For a server with the address `your_server_ip`:

```bash
ssh-copy-id username@your_server_ip
```

Or, manually append the public key (`~/.ssh/id_rsa.pub`) content to `~/.ssh/authorized_keys` on the server.

Or, on Windows using Powershell:

`type $env:USERPROFILE\.ssh\id_rsa.pub | ssh user@host "cat >> .ssh/authorized_keys"`

### Test SSH Connection

```bash
ssh username@your_server_ip
```

If everything is set up correctly, you should be able to log into the server without entering a password.

### (Optional) Disable Password Authentication on Server

After ensuring that the SSH key-based access is successful:

1. Edit the SSH configuration:

```bash
sudo nano /etc/ssh/sshd_config
```

2. Change the line `#PasswordAuthentication yes` to:

```bash
PasswordAuthentication no
```

3. Restart the SSH service:

```bash
sudo systemctl restart sshd
```

### (Optional) Use with GitHub

- Copy the public key content: 

  **Linux**: `cat ~/.ssh/id_rsa.pub | xclip -selection clipboard`

  **Windows**: `clip < ~/.ssh/id_rsa.pub`

- Go to GitHub account settings > "SSH and GPG keys" > "New SSH key". Paste the copied key and save.

That's it! You've quickly set up SSH key management for both remote server access and GitHub. Adjust and dive deeper into the configurations as needed using the information provided in the detailed guide above.

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

## Distributing your Public Key

To utilize key-based authentication, your public key must be placed on the
servers you want to access. This can be done using the `ssh-copy-id` command or
manually appending it to the `~/.ssh/authorized_keys` file on the server.

## Setting up the client

1. **Start the ssh-agent in the background**

Windows

```bash
ssh-agent -s
```

Linux

```bash
eval $(ssh-agent -s)
```

2. **Add your SSH private key to the ssh-agent**

```bash
ssh-add ~\.ssh\id_rsa
```

If you have distributed your key to a server, you should now be able to log in
using your key.

## Using SSH Keys for GitHub Authentication

GitHub supports SSH key authentication, making your interactions with
repositories secure and convenient.

Here is how:

1. Copy the public key content. Either do it manually by opening `id_rsa.pub`
   from the `.ssh` subfolder of your home directory, or use one of these cli
   methods:

For Windows:

`clip < ~/.ssh/id_rsa.pub`

For Linux:

`cat ~/.ssh/id_rsa.pub | xclip -selection clipboard`

**Remember, never share or expose your private key. You're only sharing your
_public_ key with GitHub.**

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

**WARNING: Ensure you've successfully tested and can log in using your SSH key
before proceeding. Disabling password authentication without setting up
key-based access could lock you out of your server.**

If you're administering your own SSH server and have set up SSH keys, you can
improve security by disabling password authentication. This ensures that access
is only possible through SSH keys.

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

## Handling a compromised Private Key

If you suspect or know that your private key has been compromised:

- Generate a new SSH key pair immediately.
- Replace the compromised public key on all remote systems with the new one.
- Investigate any potential unauthorized access or actions taken on systems
  where the compromised key had access.

**If using traditional key-based authentication:**

- Remove the old public key from any services/systems where you had installed
  it.

**If using SSH CA:**

- Utilize your SSH CA to revoke the certificate associated with the compromised
  key. By doing this at the CA level, you can effectively deny access across all
  systems that trust the CA without manually touching each individual server.

Remember, it's always better to be safe than sorry. If you're unsure about the
security of your private key, consider it compromised and take action.

## Advanced: SSH Certificate Authority (CA)

Secure Shell Certificates offer a significant advantage over traditional SSH key
pairs by streamlining the process of user and host authentication. At the heart
of this system is the SSH Certificate Authority (CA), which manages the
creation, issuance, and revocation of these certificates.

**Benefits:**

- **Centralized Authentication**: Traditional SSH authentication requires
  copying every user's public key to every server. This becomes cumbersome as
  your infrastructure grows. With a CA, you only need to distribute the CA's
  public key, greatly simplifying the authentication process.

- **Revocation**: In traditional setups, revoking access would mean searching
  for and removing a user's public key across multiple servers. With a CA, you
  can simply invalidate their certificate, ensuring they can't authenticate
  anymore.

- **Time-bound Certificates**: You can specify an expiration date for the
  certificates. This is perfect for granting temporary access or ensuring that
  keys need to be periodically refreshed.

Think of the SSH Certificate Authority (CA) as a trusted third party, similar to
how websites use Certificate Authorities to verify their identity. With SSH CA,
instead of trusting individual keys, you trust the CA, and the CA vouches for
individual user keys.

**Steps to manually Set Up an SSH CA:**

1. **Generate a CA key pair**:

This is the first step where you generate the private and public keys for the
CA. These keys are extremely critical, especially the private key, as it is used
to sign user certificates.

```bash
ssh-keygen -f /path/to/ca_key
```

2. **Sign user keys**:

Once you have the CA key pair, you can sign individual user public keys. The
following command demonstrates how to sign a user's public key. The `-I` flag
provides an identifier for the certificate, while the `-n` flag specifies the
user or host names that the certificate is valid for.

```bash
ssh-keygen -s /path/to/ca_key -I user_identifier -n username,user2 /path/to/user/key.pub
```

3. **Install the CA public key on servers**:

For servers to trust certificates signed by the CA, they need to be aware of the
CA's public key. You can specify this by adding a configuration in the SSH
daemon's configuration file.

Add to `/etc/ssh/sshd_config`:

```bash
TrustedUserCAKeys /path/to/ca_key.pub
```

4. **Handle certificate revocation**:

To revoke certificates, create a revoked-keys file and list the revoked key IDs.
Update the SSH daemon's configuration to reference this file:

Add to `/etc/ssh/sshd_config`:

`RevokedKeys /path/to/revoked-keys`

To revoke a key, add its key ID to the revoked-keys file. This file should be
periodically updated on all servers.

4. **Restart SSH**:

After updating the SSH configuration, you need to restart the SSH service to
apply the changes. The exact command might differ depending on your operating
system, but on systems using systemd, the command is:

```bash
sudo systemctl restart sshd
```

**Best Practices:**

- **Secure the CA's private key**: Given its power, it's imperative to keep the
  CA's private key secure. Consider encrypting it and storing it offline or
  using hardware security modules (HSMs).

- **Regularly Rotate Certificates**: For added security, regularly rotate and
  refresh your certificates.

- **Monitor and Audit**: Continuously monitor certificate creation, revocation,
  and authentication attempts to detect any suspicious activity.

## Using step-ca for SSH CA

step-ca is a lightweight, open-source Certificate Authority (CA) in software
form, developed by [Smallstep](https://smallstep.com/). Designed to be easily
deployable and manageable, it brings several advantages to the table,
particularly for SSH certificate management.

Advantages of step-ca:

- **Easy Certificate Management:** step-ca simplifies the issuance, renewal, and
  revocation processes. Its command-line tools and APIs allow for effortless
  certificate operations.

- **Automated Renewals:** With step-ca, certificates can be automatically
  renewed, reducing the administrative overhead of manual renewals.

- **Interoperability:** It supports multiple protocols including X.509 for
  HTTPS/TLS and SSH User & Host certificates. This broadens its application
  beyond just SSH environments.

- **Rich Documentation:** Smallstep provides comprehensive documentation and
  tutorials for step-ca, ensuring users can make the most of its features.

- **Modern Security Practices:** step-ca integrates contemporary security best
  practices out of the box. Its design ensures that even non-experts can deploy
  a secure CA.

For more information on its features, benefits, and setup guides, consider
visiting the official
[step-ca GitHub repository](https://github.com/smallstep/certificates) and
[Smallstep's website](https://smallstep.com/).

---

## Conclusion

While SSH keys simplify and secure your development workflow, it's essential to
be mindful of best practices. If you choose the convenience of a key without a
passphrase, ensure you take additional precautions. This includes limiting the
key's use, regularly monitoring access, and maintaining backup access methods.
Regularly updating and checking the keys you've authorized can help prevent
unauthorized access. Additionally, be vigilant about where and how you store
your private keys. When set up properly, SSH keys can be a powerful tool in your
development and security arsenal.Always remember: security and convenience can
co-exist, but careful management is crucial. Happy coding!
