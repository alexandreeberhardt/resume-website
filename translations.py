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
    }
}


def get_section_title(section_type: str, lang: str = "fr", custom_title: str = "") -> str:
    """
    Retourne le titre traduit pour un type de section.

    Args:
        section_type: Type de section (education, experiences, etc.)
        lang: Code langue (fr, en)
        custom_title: Titre personnalisé (utilisé pour les sections 'custom')

    Returns:
        Le titre traduit ou le titre personnalisé pour les sections custom.
    """
    if section_type == "custom" and custom_title:
        return custom_title

    translations = PDF_TRANSLATIONS.get(lang, PDF_TRANSLATIONS["fr"])
    return translations.get(section_type, custom_title or section_type.capitalize())
