# Tests End-to-End (E2E)

Suite de tests E2E complète pour Sivee CV Generator utilisant Playwright.

## Installation

```bash
# Installer les dépendances
npm install

# Installer les navigateurs Playwright
npx playwright install
```

## Exécuter les tests

### Tous les tests
```bash
npm test
```

### Avec interface graphique
```bash
npm run test:ui
```

### Mode debug (navigateur visible + breakpoints)
```bash
npm run test:debug
```

### Mode headed (navigateur visible)
```bash
npm run test:headed
```

### Par navigateur
```bash
npm run test:chrome      # Chrome uniquement
npm run test:firefox     # Firefox uniquement
npm run test:safari      # Safari/WebKit uniquement
```

### Tests mobiles
```bash
npm run test:mobile
```

### Par fonctionnalité
```bash
npm run test:auth        # Tests d'authentification
npm run test:editor      # Tests de l'éditeur
```

### Tests spécifiques
```bash
npx playwright test landing.spec.ts
npx playwright test --grep "affiche le titre"
```

## Structure des tests

```
e2e/
├── fixtures/           # Données de test
│   └── test-data.ts   # Constantes et mocks
├── helpers/            # Utilitaires partagés
│   ├── page-objects.ts # Page Objects Pattern
│   └── test-utils.ts   # Fonctions utilitaires
├── .auth/              # États d'authentification (gitignore)
│
├── auth.setup.ts       # Setup d'authentification
├── auth.unauth.spec.ts # Tests sans authentification
├── landing.spec.ts     # Tests landing page
├── editor.spec.ts      # Tests éditeur CV
├── resumes.spec.ts     # Tests gestion des CV
├── export.spec.ts      # Tests export/import PDF
├── i18n.spec.ts        # Tests internationalisation
├── mobile.spec.ts      # Tests mobile
├── accessibility.spec.ts # Tests accessibilité
└── account.spec.ts     # Tests page compte
```

## Page Objects

Les Page Objects encapsulent les interactions avec les pages :

```typescript
import { LandingPage, EditorPage } from './helpers/page-objects';

const landingPage = new LandingPage(page);
await landingPage.goto();
await landingPage.clickCreateCv();

const editorPage = new EditorPage(page);
await editorPage.fillPersonalInfo({
  name: 'Jean Dupont',
  email: 'jean@example.com'
});
```

## Données de test

```typescript
import {
  MOCK_PERSONAL_INFO,
  MOCK_EXPERIENCE,
  TEST_USER
} from './fixtures/test-data';
```

## Configuration

Le fichier `playwright.config.ts` configure :

- **Projets** : Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Timeouts** : 60s par test, 10s pour les assertions
- **Retries** : 2 en CI, 0 en local
- **Reporters** : HTML, liste, GitHub (CI)
- **Screenshots/Vidéos** : En cas d'échec uniquement

## Environnements

### Local
```bash
npm run dev  # Démarre le serveur de dev
npm test     # Exécute les tests
```

### CI
Les tests utilisent automatiquement un serveur web lancé par Playwright.

Variables d'environnement :
- `CI=true` : Mode CI (retries activés)
- `PLAYWRIGHT_BASE_URL` : URL de base personnalisée

## Rapports

Après exécution :
```bash
npm run test:report
```

Les rapports HTML sont générés dans `playwright-report/`.

## Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Data-testid** : Utiliser des `data-testid` pour les sélecteurs stables
3. **Attentes explicites** : Toujours utiliser `expect()` pour les assertions
4. **Page Objects** : Encapsuler les interactions dans des Page Objects
5. **Fixtures** : Centraliser les données de test

## Dépannage

### Les tests échouent en local mais passent en CI
Vérifier que le serveur de dev est lancé (`npm run dev`).

### Timeout sur les téléchargements
Augmenter le timeout dans `TIMEOUTS.PDF_GENERATION`.

### Problèmes de sélecteurs
Utiliser le mode debug pour inspecter le DOM :
```bash
npx playwright test --debug
```

### Nettoyer les états d'authentification
```bash
rm -rf e2e/.auth/
```
