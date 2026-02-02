import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E de Sivee CV Generator
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  /* Timeout global pour chaque test */
  timeout: 60000,

  /* Configuration des attentes */
  expect: {
    timeout: 10000,
  },

  /* Exécution complète en CI, parallèle limitée en local */
  fullyParallel: true,

  /* Échouer le build si test.only est oublié */
  forbidOnly: !!process.env.CI,

  /* Retries en CI uniquement */
  retries: process.env.CI ? 2 : 0,

  /* Workers parallèles */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  /* Configuration globale */
  use: {
    /* Base URL pour les tests */
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    /* Collecter les traces en cas d'échec */
    trace: 'on-first-retry',

    /* Screenshots en cas d'échec */
    screenshot: 'only-on-failure',

    /* Vidéo en cas d'échec */
    video: 'on-first-retry',

    /* Timeout pour les actions */
    actionTimeout: 15000,

    /* Timeout pour la navigation */
    navigationTimeout: 30000,
  },

  /* Configuration par projet (navigateur) */
  projects: [
    /* Setup: authentification préalable */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /* Tests Desktop Chrome */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    /* Tests Desktop Firefox */
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    /* Tests Desktop Safari */
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    /* Tests Mobile Chrome */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    /* Tests Mobile Safari */
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    /* Tests sans authentification */
    {
      name: 'unauthenticated',
      testMatch: /.*\.unauth\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Forcer un storage vide pour simuler un utilisateur non connecté
        storageState: { cookies: [], origins: [] },
      },
    },
  ],

  /* Serveurs de développement local */
  webServer: [
    {
      /* Backend API (Docker Compose) */
      command: 'docker compose -f ../docker-compose.dev.yml up db backend',
      url: 'http://localhost:8000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 180000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      /* Frontend Vite */
      command: 'VITE_API_URL=http://localhost:8000 npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
