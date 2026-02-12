# Deployment Guide

## Automated Deployment

The `./deploy.sh` script handles the entire process: git pull, image build, service restart, and database migrations.

```bash
cd /opt/cv-generator
./deploy.sh
```

The script runs 4 steps:
1. Pull latest changes from git
2. Build Docker images
3. Start/restart services
4. Wait for database readiness and run Alembic migrations

## Initial Setup (VPS)

### 1. Clone the project

```bash
git clone --recursive git@github.com:alexandreeberhardt/resume-website.git /opt/cv-generator
cd /opt/cv-generator
```

### 2. Environment configuration

See `.env.example` for the complete template with documentation.

```bash
cp .env.example .env
nano .env
```

Critical variables:

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Database credentials |
| `JWT_SECRET_KEY` | Secret for JWT tokens (min 32 chars) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (optional) |
| `MISTRAL_API_KEY` | PDF import AI feature (optional) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_S3_BUCKET` | S3 storage |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated, never use `*`) |
| `FRONTEND_URL` | Frontend URL for OAuth redirects |

Generate a secure JWT key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. First deployment

```bash
./deploy.sh
```

## Nginx and SSL

### Nginx

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

## Rollback

If a deployment introduces issues, you can roll back to a previous version:

```bash
cd /opt/cv-generator

# 1. Find the last working commit
git log --oneline -10

# 2. Check out that commit
git checkout <commit-hash>

# 3. Rebuild and restart
docker compose build
docker compose up -d

# 4. If a migration needs to be reversed
docker compose exec -T cv-generator uv run alembic downgrade -1
```

To return to the latest version afterward:
```bash
git checkout main
./deploy.sh
```

## Logs and Monitoring

### View application logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f cv-generator

# Database only
docker compose logs -f db

# Last 100 lines
docker compose logs --tail 100 cv-generator
```

### Health checks

```bash
# Application health
curl http://localhost:8099/api/health

# Database connectivity
curl http://localhost:8099/health_db
```

### Disk and resources

```bash
# Docker disk usage
docker system df

# Clean unused images and containers
docker system prune
```

## Security

See `vps/SECURITY.md` for the full security checklist before going to production.
