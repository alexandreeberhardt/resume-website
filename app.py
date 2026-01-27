"""
Backend FastAPI pour la génération de CV.
Expose un endpoint POST /generate qui reçoit les données et retourne le PDF.
"""
import os
import tempfile
import shutil
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, field_validator

from core.LatexRenderer import LatexRenderer
from core.PdfCompiler import PdfCompiler


# === Modèles Pydantic ===

class PersonalInfo(BaseModel):
    name: str = ""
    title: Optional[str] = ""
    location: str = ""
    email: str = ""
    phone: str = ""
    github: str = ""
    github_url: str = ""


class Education(BaseModel):
    school: str = ""
    degree: str = ""
    dates: str = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""


class Experience(BaseModel):
    title: str = ""
    company: str = ""
    dates: str = ""
    highlights: List[str] = []


class Project(BaseModel):
    name: str = ""
    year: Union[str, int] = ""
    highlights: List[str] = []

    @field_validator('year', mode='before')
    @classmethod
    def convert_year_to_str(cls, v):
        return str(v) if v is not None else ""


class Skills(BaseModel):
    languages: str = ""
    tools: str = ""


class Leadership(BaseModel):
    role: str = ""
    place: Optional[str] = ""
    dates: str = ""
    highlights: List[str] = []


class SectionFlags(BaseModel):
    """Flags pour activer/désactiver chaque section du CV."""
    show_education: bool = True
    show_experiences: bool = True
    show_projects: bool = True
    show_skills: bool = True
    show_leadership: bool = True
    show_languages: bool = True


class ResumeData(BaseModel):
    """Données complètes du CV."""
    personal: PersonalInfo
    education: List[Education] = []
    experiences: List[Experience] = []
    projects: List[Project] = []
    skills: Skills
    leadership: List[Leadership] = []
    languages_spoken: str = ""
    flags: SectionFlags = SectionFlags()


# === Application FastAPI ===

app = FastAPI(
    title="CV Generator API",
    description="API pour générer des CV en PDF à partir de données JSON",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes du frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, restreindre aux domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chemin vers le template
TEMPLATE_DIR = Path(__file__).parent
TEMPLATE_NAME = "template.tex"

# Dossier des fichiers statiques (frontend buildé)
STATIC_DIR = TEMPLATE_DIR / "static"


@app.post("/generate")
async def generate_cv(data: ResumeData):
    """
    Génère un CV PDF à partir des données fournies.

    Args:
        data: Données du CV incluant les informations personnelles,
              éducation, expériences, projets, compétences, etc.

    Returns:
        FileResponse: Le fichier PDF généré.
    """
    # Créer un dossier temporaire pour la compilation
    temp_dir = tempfile.mkdtemp(prefix="cv_")
    temp_path = Path(temp_dir)

    try:
        # Copier le template dans le dossier temporaire
        template_src = TEMPLATE_DIR / TEMPLATE_NAME
        template_dst = temp_path / TEMPLATE_NAME
        shutil.copy(template_src, template_dst)

        # Préparer les données pour le rendu
        render_data: Dict[str, Any] = {
            "personal": data.personal.model_dump(),
            "education": [e.model_dump() for e in data.education],
            "experiences": [e.model_dump() for e in data.experiences],
            "projects": [p.model_dump() for p in data.projects],
            "skills": data.skills.model_dump(),
            "leadership": [l.model_dump() for l in data.leadership],
            "languages_spoken": data.languages_spoken,
            # Flags pour les sections conditionnelles
            "show_education": data.flags.show_education,
            "show_experiences": data.flags.show_experiences,
            "show_projects": data.flags.show_projects,
            "show_skills": data.flags.show_skills,
            "show_leadership": data.flags.show_leadership,
            "show_languages": data.flags.show_languages,
        }

        # Rendre le template LaTeX
        renderer = LatexRenderer(temp_path, TEMPLATE_NAME)
        tex_content = renderer.render(render_data)

        # Écrire le fichier .tex
        tex_file = temp_path / "main.tex"
        tex_file.write_text(tex_content, encoding="utf-8")

        # Compiler en PDF
        compiler = PdfCompiler(tex_file)
        compiler.compile(clean=True)

        # Vérifier que le PDF a été généré
        pdf_file = temp_path / "main.pdf"
        if not pdf_file.exists():
            raise HTTPException(status_code=500, detail="Échec de la génération du PDF")

        # Retourner le PDF
        return FileResponse(
            path=str(pdf_file),
            filename="cv.pdf",
            media_type="application/pdf",
            # Note: Le fichier temporaire sera nettoyé après l'envoi
            background=None
        )

    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Erreur de compilation LaTeX: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur inattendue: {e}")
    # Note: Le dossier temporaire n'est pas supprimé immédiatement
    # car FileResponse en a besoin. En production, utiliser un cleanup périodique.


@app.get("/default-data")
async def get_default_data():
    """
    Retourne les données par défaut du CV (depuis data.yml).
    Utile pour pré-remplir le formulaire frontend.
    """
    import yaml

    yaml_path = TEMPLATE_DIR / "data.yml"
    if not yaml_path.exists():
        raise HTTPException(status_code=404, detail="Fichier data.yml introuvable")

    with open(yaml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    # Ajouter les flags par défaut
    data["flags"] = {
        "show_education": True,
        "show_experiences": True,
        "show_projects": True,
        "show_skills": True,
        "show_leadership": True,
        "show_languages": True,
    }

    return data


@app.get("/api/health")
async def health():
    """Endpoint de santé pour le monitoring."""
    return {"status": "ok", "message": "CV Generator API"}


# Servir le frontend statique en production
if STATIC_DIR.exists():
    # Monter les assets statiques
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Route catch-all pour servir le SPA React."""
        # Fichier demandé
        file_path = STATIC_DIR / full_path

        # Si le fichier existe, le servir
        if file_path.is_file():
            return FileResponse(file_path)

        # Sinon, servir index.html (SPA routing)
        return FileResponse(STATIC_DIR / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
