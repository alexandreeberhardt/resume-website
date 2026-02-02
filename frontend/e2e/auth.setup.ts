/**
 * Setup d'authentification pour les tests E2E
 * Ce fichier s'exécute avant les tests pour créer un état d'authentification réutilisable
 *
 * Crée un token JWT manuel pour simuler un utilisateur invité authentifié.
 * Le backend n'est pas nécessaire car le frontend ne valide que l'expiration du token.
 */

import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

/**
 * Encode une chaîne en Base64URL (sans padding)
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Crée un token JWT fictif pour les tests E2E
 * Le frontend décode ce token pour extraire les infos utilisateur
 */
function createTestJwtToken(): string {
  const header = { alg: 'HS256', typ: 'JWT' };

  // Expiration dans 1 an (suffisant pour les tests)
  const exp = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

  const payload = {
    sub: '999',
    email: 'test-e2e@sivee.local',
    exp,
    is_guest: true,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Signature fictive (le frontend ne la valide pas)
  const fakeSignature = 'e2e-test-signature';

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
}

setup('authenticate', async ({ page }) => {
  // Créer le token JWT pour l'utilisateur invité de test
  const testToken = createTestJwtToken();

  // Aller sur la page d'accueil pour initialiser le contexte
  await page.goto('/');

  // Injecter le token dans localStorage
  await page.evaluate((token) => {
    localStorage.setItem('access_token', token);
  }, testToken);

  // Recharger la page pour que l'app détecte le token
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Sauvegarder l'état d'authentification (avec le token dans localStorage)
  await page.context().storageState({ path: authFile });
});
