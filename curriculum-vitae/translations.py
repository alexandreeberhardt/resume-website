"""
Traductions pour les titres de sections du PDF.
Les titres sont utilisés dans le rendu LaTeX.
"""

PDF_TRANSLATIONS = {
    "fr": {
        "summary": "Résumé",
        "education": "Formation",
        "experiences": "Expérience Professionnelle",
        "projects": "Projets",
        "skills": "Compétences Techniques",
        "leadership": "Leadership & Engagement",
        "languages": "Langues",
        "custom": "Autre",
    },
    "en": {
        "summary": "Summary",
        "education": "Education",
        "experiences": "Professional Experience",
        "projects": "Projects",
        "skills": "Technical Skills",
        "leadership": "Leadership & Community",
        "languages": "Languages",
        "custom": "Other",
    },
    "es": {
        "summary": "Resumen",
        "education": "Educación",
        "experiences": "Experiencia Profesional",
        "projects": "Proyectos",
        "skills": "Habilidades Técnicas",
        "leadership": "Liderazgo y Compromiso",
        "languages": "Idiomas",
        "custom": "Otro",
    },
    "de": {
        "summary": "Zusammenfassung",
        "education": "Ausbildung",
        "experiences": "Berufserfahrung",
        "projects": "Projekte",
        "skills": "Technische Fähigkeiten",
        "leadership": "Führung & Engagement",
        "languages": "Sprachen",
        "custom": "Sonstiges",
    },
    "pt": {
        "summary": "Resumo",
        "education": "Formação",
        "experiences": "Experiência Profissional",
        "projects": "Projetos",
        "skills": "Competências Técnicas",
        "leadership": "Liderança e Envolvimento",
        "languages": "Idiomas",
        "custom": "Outro",
    },
    "it": {
        "summary": "Riepilogo",
        "education": "Formazione",
        "experiences": "Esperienza Professionale",
        "projects": "Progetti",
        "skills": "Competenze Tecniche",
        "leadership": "Leadership e Impegno",
        "languages": "Lingue",
        "custom": "Altro",
    },
}

# Titres par défaut du frontend (pour détecter si le titre a été personnalisé)
DEFAULT_TITLES = {
    "summary": ["Summary", "Résumé", "Resumen", "Zusammenfassung", "Resumo", "Riepilogo"],
    "education": ["Education", "Formation", "Educación", "Ausbildung", "Formação", "Formazione"],
    "experiences": [
        "Experiences",
        "Experience",
        "Expérience",
        "Expérience Professionnelle",
        "Professional Experience",
        "Experiencia Profesional",
        "Berufserfahrung",
        "Experiência Profissional",
        "Esperienza Professionale",
    ],
    "projects": ["Projects", "Projets", "Proyectos", "Projekte", "Projetos", "Progetti"],
    "skills": [
        "Technical Skills",
        "Skills",
        "Compétences",
        "Compétences Techniques",
        "Habilidades Técnicas",
        "Technische Fähigkeiten",
        "Competências Técnicas",
        "Competenze Tecniche",
    ],
    "leadership": [
        "Leadership",
        "Leadership & Community Involvement",
        "Leadership & Community",
        "Leadership & Engagement",
        "Liderazgo y Compromiso",
        "Führung & Engagement",
        "Liderança e Envolvimento",
        "Leadership e Impegno",
    ],
    "languages": ["Languages", "Langues", "Idiomas", "Sprachen", "Lingue"],
    "custom": ["Custom Section", "Custom", "Autre", "Otro", "Sonstiges", "Outro", "Altro"],
}


def get_section_title(section_type: str, lang: str = "fr", custom_title: str = "") -> str:
    """
    Retourne le titre traduit pour un type de section.

    Si le titre fourni est un titre par défaut (en anglais ou français),
    on retourne la traduction dans la langue demandée.
    Si le titre a été personnalisé par l'utilisateur, on le garde tel quel.

    Args:
        section_type: Type de section (education, experiences, etc.)
        lang: Code langue (fr, en)
        custom_title: Titre de la section (peut être personnalisé)

    Returns:
        Le titre traduit ou le titre personnalisé.
    """
    # Pour les sections custom, toujours utiliser le titre fourni
    if section_type == "custom":
        return custom_title or PDF_TRANSLATIONS.get(lang, PDF_TRANSLATIONS["fr"]).get(
            "custom", "Other"
        )

    # Vérifier si le titre est un titre par défaut
    default_titles = DEFAULT_TITLES.get(section_type, [])
    is_default_title = not custom_title or custom_title in default_titles

    # Si c'est un titre par défaut, utiliser la traduction
    if is_default_title:
        translations = PDF_TRANSLATIONS.get(lang, PDF_TRANSLATIONS["fr"])
        return translations.get(section_type, custom_title or section_type.capitalize())

    # Sinon, garder le titre personnalisé
    return custom_title
