# Sivee.pro

[![Live](https://img.shields.io/badge/live-sivee.pro-blue)](https://sivee.pro)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/frontend-React_18-61DAFB)](https://react.dev/)
[![LaTeX](https://img.shields.io/badge/PDF-LaTeX-008080)]()
[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

A web application to generate professional PDF resumes from a dynamic form interface. LaTeX-based PDF generation ensures high-quality typographic output.

**[Live demo: sivee.pro](https://sivee.pro)**

## Examples

Professional resumes generated with different templates:

<p align="center">
  <img src="docs/AE1.png" width="45%" alt="Classic Template Example" style="margin-right: 10px;">
  <img src="docs/AE2.png" width="43.5%" alt="Modern Template Example">
</p>

## Features

### PDF Generation & Templates
- **LaTeX Engine** — High-quality typographic PDF generation (superior to HTML-to-PDF)
- **Professional Templates** — Harvard, McKinsey, Europass styles and more
- **Smart Sizing** — Automatic content fitting to a single page
- **PDF Import** — (Experimental) Import existing CVs via AI extraction (Mistral)

### Editor & Customization
- **Real-time Editing** — Visualize changes instantly as you type
- **Drag and Drop** — Reorganize CV sections freely
- **Dynamic Sections** — Add, rename, hide, or remove any section
- **Dark/Light Mode** — Interface adapted to your preferences
- **Multi-language** — French and English

### Accounts & Security
- **Guest Mode** — Try immediately without creating an account (limited to 3 CVs)
- **Seamless Upgrade** — Convert guest account to permanent without data loss
- **Google OAuth** — Fast sign-in with Google
- **GDPR** — Export all data or delete account in one click
- **Secure Architecture** — Hashed passwords, JWT sessions

## Quick Install (Docker)

```bash
# Clone the repository
git clone --recursive git@github.com:alexandreeberhardt/resume-website.git sivee
cd sivee

# Configure environment
cp .env.example .env
# Edit .env with your values (see .env.example for documentation)

# Start development environment
docker compose -f docker-compose.dev.yml up --build
```

The application will be accessible at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API docs (Swagger)**: http://localhost:8000/docs

## Architecture

```
Frontend (React + TypeScript + Vite)
    ↕  REST API
Backend (FastAPI + SQLAlchemy)
    ↕               ↕
PostgreSQL    LaTeX → PDF
                ↕
              S3 Storage
```

## Documentation

| Document | Description |
|----------|-------------|
| [Development Guide](docs/DEVELOPMENT.md) | Local setup, project structure, tests |
| [API Reference](docs/API.md) | Endpoints, authentication, examples |
| [Database](docs/DATABASE.md) | Schema, migrations, backups |
| [Deployment](docs/DEPLOYMENT.md) | VPS setup, Nginx, SSL, operations |

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).
You may use, share, and adapt this work for **non-commercial purposes only**.
