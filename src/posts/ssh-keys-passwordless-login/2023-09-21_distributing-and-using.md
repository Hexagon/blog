---
title: Distributing and Using SSH Keys
title_short: Distributing SSH Keys
part: 3
priority: 1.0
updated: "2023-09-21T00:00:00Z"
intro: "Explore the various methods for distributing and utilizing SSH keys, ensuring secure and seamless access to remote servers and GitHub."
---

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

   - **Linux**: `cat ~/.ssh/id_rsa.pub | xclip -selection clipboard`

   - **Windows (Git Bash)**: `clip < ~/.ssh/id_rsa.pub`

   - **Windows (Powershell)**: `Get-Content ~/.ssh/id_rsa.pub | Set-Clipboard`

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
