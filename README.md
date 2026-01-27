# CV Generator

A web application to generate professional PDF resumes from a dynamic form interface. Built with FastAPI (Python) and React, with LaTeX-based PDF generation.

## Screenshots

| Web Interface | Generated PDF |
|---------------|---------------|
| ![Web Interface](small_website.png) | ![Generated CV](screen_cv.png) |

## Features

- **Dynamic sections**: Add, remove, reorder and toggle visibility of CV sections
- **Drag and drop**: Reorganize sections by dragging them
- **Custom sections**: Create personalized sections with custom titles
- **Real-time editing**: Edit all CV content through an intuitive web interface
- **PDF generation**: High-quality PDF output using LaTeX compilation
- **Responsive design**: Works on desktop and mobile devices

## Tech Stack

**Backend**
- Python 3.13
- FastAPI
- Jinja2 (LaTeX templating)
- LaTeX (PDF compilation via latexmk)

**Frontend**
- React 18
- TypeScript
- Tailwind CSS
- dnd-kit (drag and drop)
- Lucide React (icons)

## Project Structure

```
site-CV/
├── curriculum-vitae/     # Backend (git submodule)
│   ├── core/             # Business logic (LaTeX rendering, PDF compilation)
│   ├── app.py            # FastAPI application
│   ├── template.tex      # LaTeX template with Jinja2
│   └── data.yml          # Default CV data
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   └── editors/  # Section-specific editors
│   │   ├── App.tsx       # Main application
│   │   └── types.ts      # TypeScript definitions
│   └── package.json
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Container orchestration
├── nginx.conf            # Nginx configuration for production
└── run.sh                # Development startup script
```

## Requirements

### Development
- Python 3.13+
- Node.js 20+
- LaTeX distribution (texlive-latex-extra, latexmk)
- uv (Python package manager)

### Production
- Docker and Docker Compose
- Nginx (for reverse proxy)

## Installation

### Development Setup

1. Clone the repository with submodules:
```bash
git clone --recursive <repository-url>
cd site-CV
```

2. Install backend dependencies:
```bash
cd curriculum-vitae
uv sync
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Start the development servers:
```bash
./run.sh
```

Or manually:
```bash
# Terminal 1 - Backend
cd curriculum-vitae
uv run uvicorn app:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### Production Deployment

1. Build and start with Docker:
```bash
docker-compose up -d --build
```

2. Configure Nginx:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/cv-generator
sudo ln -s /etc/nginx/sites-available/cv-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. (Optional) Setup SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d your-domain.com
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/default-data` | Returns default CV data from data.yml |
| POST | `/generate` | Generates PDF from JSON payload |
| GET | `/api/health` | Health check endpoint |

### Generate PDF Request

```json
{
  "personal": {
    "name": "John Doe",
    "location": "City, Country",
    "email": "john@example.com",
    "phone": "+1 234 567 890",
    "github": "github.com/johndoe",
    "github_url": "https://github.com/johndoe"
  },
  "sections": [
    {
      "id": "unique-id",
      "type": "education",
      "title": "Education",
      "isVisible": true,
      "items": [
        {
          "school": "University",
          "degree": "Bachelor's Degree",
          "dates": "2020 - 2024",
          "subtitle": "GPA: 3.8/4.0",
          "description": "Relevant coursework..."
        }
      ]
    }
  ]
}
```

### Section Types

- `education` - Academic background
- `experiences` - Work experience
- `projects` - Personal or professional projects
- `skills` - Technical skills (languages and tools)
- `leadership` - Leadership and community involvement
- `languages` - Spoken languages
- `custom` - Custom sections with flexible content

## Configuration

### Environment Variables

The application uses sensible defaults but can be configured:

- Backend runs on port 8000
- Frontend dev server runs on port 5173
- Frontend proxies `/api` requests to the backend in development

### Nginx Configuration

Edit `nginx.conf` to set your domain name before deploying. The configuration includes:
- Reverse proxy to the backend
- Extended timeouts for PDF generation
- HTTPS support (commented, enable after obtaining SSL certificate)

## License

MIT License
