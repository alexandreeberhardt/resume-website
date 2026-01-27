# Prompt Claude Code : Modularisation et Réorganisation du CV

**Objectif :** Rendre les sections du CV dynamiques pour permettre l'ajout de sections personnalisées et la réorganisation par "Drag & Drop".

### 1. Frontend (React & TS)

* **Modèle :** Dans `types.ts`, remplacer les champs de sections fixes par un tableau `sections: CVSection[]`. Chaque section doit avoir un `id`, `type`, `title`, `items` (le contenu) et `isVisible`.
* **Interface :** * Installer `@dnd-kit/core` et `@dnd-kit/sortable` pour permettre de réordonner les sections dans `App.tsx`.
* Ajouter un bouton "Ajouter une section personnalisée".
* Créer un composant générique pour éditer le titre et les points (highlights) des nouvelles sections.



### 2. Backend (Python & LaTeX)

* **Template :** Dans `template.tex`, remplacer les blocs de sections codés en dur par une boucle Jinja2 : `\BLOCK{for section in sections} ... \BLOCK{endfor}`.
* **Rendu :** Adapter `LatexRenderer.py` pour qu'il traite chaque type de section (éducation, expérience, custom, etc.) en respectant l'ordre fourni par le frontend.
* **Données :** Mettre à jour `DataManager.py` et `data.yml` pour supporter ce nouveau format de liste.

### 3. Fichiers cibles

* `site-CV/frontend/src/types.ts`
* `site-CV/frontend/src/App.tsx`
* `site-CV/curriculum-vitae/template.tex`
* `site-CV/curriculum-vitae/core/LatexRenderer.py`
* `site-CV/curriculum-vitae/data.yml`

---
