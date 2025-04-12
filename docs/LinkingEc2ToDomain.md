# Linking EC2 to Domain
The `deploy.yml` Github workflow currently deploys the code to an EC2 instance, and the website is accessible via `http://<ip address>`. Below will detail the steps for making it accessible via `anki.taylorbarmak.com`.

1. In the domain registrar, create a new A record.
    Name/Host: anki
    Value/Points to: the EC2 instance's public IP address.
    TTL: Leave the default value (e.g., 3600 seconds).
2. Ensure that the EC2's security groups have inbound rules allowing traffic on ports 443 and 80.
3. Install `nginx` on the EC2 instance (host) with `sudo yum install nginx -y`.
4. Create a new Nginx configuration for `anki.taylorbarmak.com`, and place it in `/etc/nginx/conf.d/anki.conf` in the host EC2. This file is currently stored in this repo in `deployment/nginx.host.conf`.
5. Run `sudo nginx -t` and `sudo systemctl restart nginx`.
6. Go to `http://anki.taylorbarmak.com` to confirm that it is working properly.

## Securing with HTTPS
I found [this Medium article](https://faun.pub/enable-https-on-ec2-instance-without-elastic-load-balancer-f69cd57a8f3a) very helpful.

1. In the EC2 instance, run 
```bash
sudo yum install -y certbot`.
```
2. Create the web root directory for the HTTP challenge files
```bash
sudo mkdir -p /var/www/letsencrypt
sudo chown nginx:nginx /var/www/letsencrypt
```
3. Add the `.well-known` block to nginx (This is already done in `deployment/nginx.host.conf`):
```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
    default_type "text/plain";
    allow all;
}
```
4. Reload nginx to apply changes
```bash
sudo nginx -t && sudo systemctl reload nginx
```
5. Issue a certificate using the `webroot` plugin: 
```bash
sudo certbot certonly --webroot -w /var/www/letsencrypt -d anki.taylorbarmak.com
```
6. Install `cronie` if it's not already installed:
```bash
sudo yum install -y cronie
```
7. Start and enable the cron service:
```bash
sudo systemctl enable crond
sudo systemctl start crond
```
8. Update crontab to automatically renew the certificate:
```bash
sudo crontab -e
```
Add this line: 
```cron
0 12 * * * /usr/bin/certbot renew --quiet --no-self-upgrade && /bin/systemctl reload nginx
```
9. Test renewal manually to verify the setup
```bash
sudo certbot renew --dry-run
```
10. Update the nginx conf to listen on 443 and point the `ssl_certificate` and `ssl_certificate_key` to the correct paths in `/etc/letsencrypt/live/` (This is already done in `deployment/nginx.host.conf`)
12. Go to `https://anki.taylorbarmak.com` and confirm it uses HTTPS (padlock icon, no "Not Secure" warning).

