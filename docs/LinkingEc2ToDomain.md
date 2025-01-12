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
1. In the EC2 instance, run `sudo yum install -y certbot`.
2. Stop nginx with `sudo systemctl stop nginx`.
3. Generate an SSL certificate with `sudo certbot certonly --standalone -d anki.taylorbarmak.com`.
4. Update the nginx conf to listen on 443 and point the `ssl_certificate` and `ssl_certificate_key` to the correct paths in `/etc/letsencrypt/live/` (This is already done in `deployment/nginx.host.conf`)
5. Run `sudo nginx -t` and `sudo systemctl restart nginx`.
6. Go to `https://anki.taylorbarmak.com` and confirm it doesn't say "Not Secure" anymore.
7. Automate the certificate renewal process in the EC2 by running `sudo sh -c 'echo "0 12 * * * /usr/bin/certbot renew --quiet" >> /etc/crontab'`.
