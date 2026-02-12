# CV Generator SaaS

A web application to generate professional PDF resumes from a dynamic form interface. Built with FastAPI (Python) and React, with LaTeX-based PDF generation.

**Live demo**: [sivee.pro](https://sivee.pro)

## Features

- **Dynamic sections**: Add, remove, reorder, and toggle visibility of CV sections
- **Drag and drop**: Reorganize sections by dragging them
- **Custom sections**: Create personalized sections with custom titles
- **Real-time editing**: Edit all CV content through an intuitive web interface
- **PDF generation**: High-quality PDF output using LaTeX compilation
- **PDF Import**: Import existing CVs using AI-powered extraction
- **Responsive design**: Works on desktop and mobile devices
- **User accounts**: Register, login, and manage multiple CVs
- **Guest accounts**: Try the app without registration (limited to 3 CVs)
- **Google OAuth**: Sign in with Google account
- **GDPR compliance**: Export and delete your data anytime
- **Smart template sizing**: Auto-fit content to one page with optimal template selection

## Quick Install (Docker)

Recommended method to start the project quickly.

1. Clone the repository
```bash
git clone --recursive <repository-url> site-CV
cd site-CV

```

2. Copy environment variables

```bash
cp .env.example .env

```

3. Start development environment

```bash
docker compose -f docker-compose.dev.yml up --build

```

The application will be accessible at:

* **Frontend**: http://localhost:5173
* **Backend**: http://localhost:8000
* **Database**: localhost:5432

## Documentation

Detailed documentation is available in the `docs/` folder:

* [Development Guide](docs/DEVELOPMENT.md)
* [Database](docs/DATABASE.md)
* [Deployment](docs/DEPLOYMENT.md)
* [API](docs/API.md)

## License

MIT License