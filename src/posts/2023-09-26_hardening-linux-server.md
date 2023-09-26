---
layout: post.njk
title: Harden Your Linux Server Using These Foundational Measures
description: A quick guide to hardening and monitoring your Linux server security with foundational security principles.
metas:
  image: "https://hexagon.56k.guru/img/ssh_key_management.webp"
header: "/img/ssh_key_management_header.webp"
tags:
 - linux
 - security
 - server
 - hardening
 - ssh
 - firewall
 - guide
priority: 0.9
intro: "With the constant rise of online threats, it becomes more crucial to ensure that your server is secure. Review these basic measures, and make your server safer. The steps in this guide are primarily geared towards Ubuntu and Debian, but the fundamental principles are the same."
---

## 1. Regular System Updates

Keeping your system updated is fundamental. Regular updates patch
vulnerabilities, enhancing the overall security and performance of your server.

```bash
sudo apt update
sudo apt upgrade
```

## 2. Use SSH Keys Over Passwords

Enhance your server's security by shifting to SSH key authentication. It's a
more secure method than using passwords, making unauthorized access much harder.
Check out this
[guide to using ssh keys](https://hexagon.56k.guru/posts/ssh-keys-passwordless-login/).

## 3. Restrict Root Login

Minimize potential threats by disabling root login. Instead, use a non-root user
endowed with sudo privileges.

1. Open the configuration in your favorite editor: `/etc/ssh/sshd_config`

2. Set `PermitRootLogin no`

3. Restart the SSH server: `sudo systemctl restart sshd`

## 4. Implement a Firewall

Defend your server with UFW, a user-friendly interface for managing your
firewall.

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw enable
```

## 5. Intrusion Detection with fail2ban

Proactively monitor your server logs for suspicious activities with `fail2ban`.
Upon detecting multiple failed login attempts, it automatically bans the
suspicious IP.

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 6. Network Monitoring and Log Analysis

Keep an eye on server activities. Regularly check network connections and
scrutinize security logs for any irregularities.

To check for active network connections and listening ports:

```bash
netstat -tulpn
```

A breakdown:

- `-t`: Display TCP connections.
- `-u`: Display UDP connections.
- `-l`: Show only listening sockets (i.e., services waiting for connections).
- `-p`: Show the process ID and name of the program to which each socket
  belongs.
- `-n`: Display addresses and port numbers in numerical form instead of
  resolving to names.

Additionally, the `/var/log/auth.log` is invaluable for insights into login
attempts and other security events. Some useful commands to filter and analyze
this log include:

**View the last 20 entries of the auth.log:**

```bash
tail -n 20 /var/log/auth.log
```

**Search for failed login attempts:**

```bash
grep "Failed password" /var/log/auth.log
grep "Invalid user" /var/log/auth.log
```

**Check for sudo attempts:**

```bash
grep 'sudo:' /var/log/auth.log
```

**List all successful logins:**

```bash
grep "Accepted " /var/log/auth.log
```

These commands may require root access. Use `sudo`, or `sudo -i` for an
interactive login.

Regularly reviewing and understanding these logs can help identify potential
security threats and allow for timely intervention.

## 7. Segregate services using Docker and Nginx

Leverage Docker to run applications in isolated environments, ensuring
consistent setups. Using Nginx as a reverse-proxy further boosts security and
provides efficient load balancing.

Why Docker? Manual setups can introduce vulnerabilities due to inconsistencies.
Docker ensures a consistent environment by packaging applications with their
required dependencies.

Installation instructions for most distributions are available at
[docs.docker.com/engine/install](https://docs.docker.com/engine/install/). I do
not recommend using the versions included in the large distributions, as they
are often aged. An example procedure to install the latest version of Docker in
debian:

```bash
# Update the apt package index and install dependencies
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

# Set up the Docker stable repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

# Install the latest version of Docker Engine and containerd
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Start Docker and enable it to start on boot
sudo systemctl start docker
sudo systemctl enable docker
```

Next, install Nginx:

```bash
sudo apt install nginx
```

For reverse-proxy with Nginx, configure a server block for your application.
Here's a very basic example without TLS, assuming your Docker container runs a
web service on port 8080:

```nginx
server {
    listen 80;

    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Save the above configuration as `/etc/nginx/sites-available/your_domain_or_ip`
and then create a symbolic link to `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/your_domain_or_ip /etc/nginx/sites-enabled/
sudo nginx -s reload
```

Now, Nginx will forward all incoming requests on port 80 to the application
running inside the Docker container on port 8080.

Remember to replace `your_domain_or_ip` with your actual domain or IP address
and adjust port numbers according to your setup.

---

## 8. Secure Your Site with TLS Certificates Using Certbot

Ensuring that the communication between your server and your users is encrypted
is crucial. One of the most user-friendly ways to set up TLS/SSL certificates
for your server is using Certbot with Let's Encrypt, a free, automated, and open
certificate authority.

Why Certbot? Apart from being free, Certbot automates the certificate issuance
and installation, eliminating the potential for human error and making the setup
straightforward. It also takes care of renewals automatically.

**Installation and Setup**:

For detailed installation instructions for Certbot tailored to your server and
system, refer to the official
[Certbot documentation](https://certbot.eff.org/instructions).

Once Certbot is installed:

```bash
# Obtain and install the certificate for Nginx
sudo certbot --nginx -d your_domain_or_ip
```

During the setup, Certbot will modify the Nginx configuration to secure your
site and will provide options for redirecting HTTP traffic to HTTPS
automatically.

Post-installation, Certbot will handle the renewal of the certificates
automatically. However, to ensure smooth renewals:

```bash
# Test the renewal process
sudo certbot renew --dry-run
```

This command simulates the renewal process to ensure there won't be any issues
when the actual renewal takes place.

With these steps, your website is now running behind a reverse-proxy and has the
added security layer of TLS encryption, ensuring data privacy and integrity for
your users.

## Quick Recap:

Protecting your server is a continuous process. To maintain a high-security
posture, it's essential to be aware of both fundamental and advanced techniques.
Here's the steps we've gone through to enhance and harden your Linux server:

1. **Regular System Updates**: Keep your system up-to-date. Regular updates
   patch vulnerabilities and are essential to server security.

2. **SSH Key Authentication**: Make sure to use SSH keys over passwords for a
   stronger and more secure authentication mechanism.

3. **Restrict Root Login**: Instead of logging in as the root user, use non-root
   users with sudo privileges to execute administrative tasks.

4. **Implement UFW Firewall**: Control inbound and outbound traffic to your
   server and ensure only necessary ports are open.

5. **Intrusion Detection with fail2ban**: Use fail2ban to monitor server logs.
   It helps in banning suspicious IP addresses after multiple failed login
   attempts.

6. **Network Monitoring and Log Analysis**: It's crucial to continuously monitor
   connections and scrutinize security logs for signs of intrusion or malicious
   activities.

7. **Use Docker and Nginx**: These tools help ensure consistent application
   environments. Moreover, employing Nginx can bolster security, especially when
   set up as a reverse-proxy.

8. **TLS with Certbot**: Always ensure server-user communication is encrypted.
   This protects the confidentiality and integrity of data in transit.

### Further tips

While the measures provided previously give a solid base for server security,
there's always room for improvement. Here are some additional topics and tools
you can explore for an even more robust setup:

**Limit User Privileges**: Follow the principle of least privilege (PoLP). This
ensures users only possess permissions necessary for their tasks.

**Intrusion Detection Systems (IDS)**: Integrate tools such as
[Snort](https://www.snort.org/) or [Suricata](https://suricata.io/). They
continuously monitor your system for signs of malicious activities.

**Regular Backups**: Never underestimate the importance of routine backups. Use
tools like [rsync](https://rsync.samba.org/) for efficient and incremental data
backups.

**Mandatory Access Control with SMACK**: Explore SMACK for managing access
controls in Linux. By leveraging this tool, you can achieve granular data access
controls. More about
[SMACK here](https://www.kernel.org/doc/Documentation/security/Smack.txt).

**AppArmor for Enhanced Security**: [AppArmor](https://wiki.ubuntu.com/AppArmor)
is invaluable in safeguarding both the operating system and its applications
against threats.

**EVM/IMA for Integrity**: Use IMA for file evaluation against trusted values,
and EVM to further ensure file integrity and authenticity. Dive into
[EVM/IMA](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/enhancing_security_with_the_kernel_integrity_subsystem).

**Physical Security Review**: If you're hosting servers on-premises, limit
physical access. Unauthorized physical access can bypass even the most
sophisticated software-level protections.

Always remember, cybersecurity is a constantly evolving field. Regular
vigilance, staying informed, and keeping your server up-to-date will serve as
your best defense. Stay proactive and keep your server resilient against
potential threats.
