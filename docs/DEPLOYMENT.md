# Deployment Guide

## Automated Deployment

The `./deploy.sh` script handles the entire process: git pull, image build, service restart, and database migrations.

```bash
cd /opt/cv-generator
./deploy.sh

```

## Initial Setup (VPS)

1. Clone the project

```bash
git clone --recursive <repository-url> /opt/cv-generator
cd /opt/cv-generator

```

2. Environment Configuration
See `.env.example` for the complete template.

```bash
cp .env.example .env
nano .env

```

3. First Deployment

```bash
./deploy.sh

```

## Nginx and SSL Configuration

### Nginx

Use the provided configuration file:

```bash
# Copy configuration
sudo cp vps/nginx_saas.conf /etc/nginx/sites-available/cv-generator

# Edit to set your domain
sudo nano /etc/nginx/sites-available/cv-generator

# Enable site
sudo ln -s /etc/nginx/sites-available/cv-generator /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

```

### SSL (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

```

## Environment Variables

Critical variables for production (excerpt):

* `DATABASE_URL`: PostgreSQL connection URL
* `JWT_SECRET_KEY`: Secret key for tokens (min 32 chars)
* `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For OAuth authentication
* `MISTRAL_API_KEY`: For PDF import feature
* `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: For S3 storage

## Security

See `vps/SECURITY.md` for the security checklist before going to production.
