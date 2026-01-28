Je souhaite ajouter une fonctionnalité "Import CV" à mon application de génération de CV (Stack : FastAPI backend + React frontend).

L'objectif est de permettre à l'utilisateur d'uploader un CV existant (PDF), d'extraire le texte, et d'utiliser l'API OpenAI pour mapper ce contenu vers la structure de données de mon application (`ResumeData`) afin de pré-remplir le formulaire.

Voici les spécifications techniques détaillées pour cette tâche :

### 1. Backend (FastAPI - `site-CV/curriculum-vitae/`)

**Dépendances :**
- Ajoute `openai` et `pypdf` au fichier `pyproject.toml`.

**Nouveau Endpoint :**
- Crée un endpoint `POST /import` qui accepte un fichier `UploadFile`.
- Utilise `pypdf` pour extraire tout le texte du PDF.
- Appelle l'API OpenAI (modèle `gpt-4o` ou `gpt-4o-mini`) avec le texte extrait.

**Logique OpenAI :**
- Utilise la fonctionnalité "Structured Outputs" d'OpenAI pour garantir que le JSON retourné respecte strictement le schéma Pydantic `ResumeData` défini dans `app.py`.
- Le prompt système doit instruire le modèle de :
  1. Identifier les informations personnelles (`PersonalInfo`).
  2. Catégoriser le contenu dans les sections appropriées (`CVSection`).
  3. Pour chaque section, déterminer le `type` correct (`education`, `experiences`, `projects`, etc.) et formater les `items` selon les modèles correspondants (`ExperienceItem`, `EducationItem`, etc.).
  4. Générer des IDs uniques pour les sections (si nécessaire, ou laisse le frontend le gérer).
  5. Retourner une structure JSON complète prête à être renvoyée au frontend.

**Sécurité :**
- Récupère la clé API OpenAI via une variable d'environnement `OPENAI_API_KEY`.

### 2. Frontend (React - `site-CV/frontend/`)

**UI/UX :**
- Ajoute un bouton "Importer un PDF" (par exemple dans la barre d'outils ou à côté du bouton "Reset").
- Ce bouton doit ouvrir une boîte de dialogue de sélection de fichier ou accepter le drag-and-drop.
- Affiche un indicateur de chargement (spinner) pendant le traitement.

**Logique :**
- Appelle le nouvel endpoint `/import`.
- À la réception du JSON, met à jour l'état global de l'application (le state `resumeData`) avec les nouvelles données.
- Assure-toi que les types TypeScript dans `types.ts` sont respectés lors de la mise à jour.

### Contexte des fichiers existants :

- `app.py` contient les modèles Pydantic (`ResumeData`, `CVSection`, etc.) que l'IA doit respecter.
- `types.ts` contient les interfaces TypeScript correspondantes.
- Le frontend utilise React.

Implémente cette fonctionnalité de bout en bout en modifiant les fichiers nécessaires.
