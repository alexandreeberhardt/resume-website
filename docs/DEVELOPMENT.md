# Development Guide

## Tech Stack

**Backend**
- Python 3.13 + FastAPI
- SQLAlchemy + PostgreSQL
- Alembic (migrations)
- Gunicorn + Uvicorn (production)
- LaTeX (PDF compilation)
- boto3 (S3 storage)

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- dnd-kit (drag and drop)
- Vite

**Infrastructure**
- Docker + Docker Compose
- Nginx (reverse proxy)
- Certbot (SSL)

## Project Structure

```text
site-CV/
├── curriculum-vitae/     # Backend (git submodule)
│   ├── core/             # Business logic (LaTeX, PDF)
│   ├── database/         # SQLAlchemy models
│   ├── alembic/          # Database migrations
│   ├── app.py            # FastAPI application
│   └── templates/        # LaTeX templates
├── frontend/             # React application
├── vps/                  # VPS deployment configs
│   ├── nginx_saas.conf   # Nginx configuration
│   ├── SECURITY.md       # Security checklist
│   ├── backup_db.sh      # DB backup script
│   └── restore_db.sh     # DB restore script
├── docker-compose.yml    # Production setup
├── docker-compose.dev.yml # Development setup
├── deploy.sh             # Deployment script
├── migrate.sh            # Migration script
└── test.sh               # Test suite

```

## Local Installation (Without Docker)

If you prefer not to use Docker for development:

### Backend

```bash
cd curriculum-vitae
uv sync
uv run uvicorn app:app --reload --port 8000

```

### Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev

```

## Tests

To run all tests (backend pytest and frontend Vitest):

```bash
./test.sh

```

## Development Troubleshooting

### Reset development database

To start fresh:

```bash
# Stop and remove containers and volumes
docker compose -f docker-compose.dev.yml down -v

# Restart
docker compose -f docker-compose.dev.yml up --build

```