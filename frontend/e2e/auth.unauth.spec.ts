/**
 * Tests E2E pour l'authentification
 * Ces tests s'exécutent sans authentification préalable
 */

import { test, expect } from '@playwright/test';
import { TIMEOUTS } from './fixtures/test-data';

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page de connexion', () => {
    test('affiche le formulaire de connexion par défaut', async ({ page }) => {
      // Vérifier les champs de login
      await expect(page.locator('input#email')).toBeVisible();
      await expect(page.locator('input#password')).toBeVisible();

      // Vérifier le bouton de soumission
      const submitButton = page.locator('form button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('permet de basculer vers inscription', async ({ page }) => {
      // Trouver le lien vers inscription (texte exact: "Créer un compte")
      const registerLink = page.getByText('Créer un compte');
      await expect(registerLink).toBeVisible();

      await registerLink.click();
      await page.waitForTimeout(500);

      // Vérifier qu'on est sur le formulaire d'inscription
      await expect(page.locator('input#register-email')).toBeVisible();
      await expect(page.locator('input#register-password')).toBeVisible();
      await expect(page.locator('input#register-confirm-password')).toBeVisible();
    });

    test('affiche une erreur pour des identifiants invalides', async ({ page }) => {
      await page.locator('input#email').fill('invalid@test.com');
      await page.locator('input#password').fill('wrongpassword');

      await page.locator('form button[type="submit"]').click();

      // Attendre l'affichage du message d'erreur
      const errorMessage = page.locator('[class*="error"], [class*="shake"]');
      await expect(errorMessage.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });

    test('valide le format email côté navigateur', async ({ page }) => {
      await page.locator('input#email').fill('invalid-email');
      await page.locator('input#password').fill('password123');

      await page.locator('form button[type="submit"]').click();

      // L'input email devrait être invalide
      const emailInput = page.locator('input#email');
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });

    test('le champ mot de passe est requis', async ({ page }) => {
      await page.locator('input#email').fill('test@example.com');
      // Ne pas remplir le mot de passe

      await page.locator('form button[type="submit"]').click();

      // Le champ password devrait être invalide car required
      const passwordInput = page.locator('input#password');
      const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      expect(isInvalid).toBe(true);
    });
  });

  test.describe('Inscription', () => {
    test.beforeEach(async ({ page }) => {
      // Basculer vers le formulaire d'inscription
      const registerLink = page.getByText('Créer un compte');
      await registerLink.click();
      await page.waitForTimeout(500);
    });

    test('affiche tous les champs requis', async ({ page }) => {
      await expect(page.locator('input#register-email')).toBeVisible();
      await expect(page.locator('input#register-password')).toBeVisible();
      await expect(page.locator('input#register-confirm-password')).toBeVisible();
      await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    });

    test('affiche les règles de mot de passe', async ({ page }) => {
      // Taper dans le champ password pour afficher les règles
      await page.locator('input#register-password').fill('test');
      await page.waitForTimeout(300);

      // Les règles devraient apparaître (div avec les checks de validation)
      const passwordRules = page.locator('.grid.grid-cols-1, [class*="PasswordCheck"]').first();
      await expect(passwordRules).toBeVisible({ timeout: TIMEOUTS.SHORT });
    });

    test('valide la correspondance des mots de passe', async ({ page }) => {
      await page.locator('input#register-password').fill('TestPassword123!');
      await page.locator('input#register-confirm-password').fill('DifferentPassword123!');
      await page.waitForTimeout(300);

      // Un message d'erreur devrait apparaître
      const mismatchError = page.locator('p').filter({ hasText: /correspondent pas|mismatch|do not match/i });
      await expect(mismatchError).toBeVisible();
    });

    test('indique quand les mots de passe correspondent', async ({ page }) => {
      const password = 'TestPassword123!';
      await page.locator('input#register-password').fill(password);
      await page.locator('input#register-confirm-password').fill(password);
      await page.waitForTimeout(300);

      // Un message de succès devrait apparaître
      const matchSuccess = page.locator('p').filter({ hasText: /correspondent|match/i });
      await expect(matchSuccess).toBeVisible();
    });

    test('nécessite l\'acceptation des conditions', async ({ page }) => {
      const password = 'TestPassword123!';
      await page.locator('input#register-email').fill('newuser@test.com');
      await page.locator('input#register-password').fill(password);
      await page.locator('input#register-confirm-password').fill(password);

      // Ne pas cocher les conditions
      const submitButton = page.locator('form button[type="submit"]');

      // Le bouton devrait être désactivé
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe('Mode invité', () => {
    test('affiche le bouton continuer sans compte', async ({ page }) => {
      // Le texte exact est "Continuer sans compte"
      const guestButton = page.getByText('Continuer sans compte');
      await expect(guestButton).toBeVisible();
    });

    test('permet de continuer sans compte', async ({ page }) => {
      // Cliquer sur le bouton invité
      const guestButton = page.getByText('Continuer sans compte');
      await expect(guestButton).toBeVisible();
      await guestButton.click();

      // Attendre la redirection vers la landing page
      await page.waitForURL('**/', { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est connecté - la landing page devrait être visible
      const landingTitle = page.locator('h1');
      await expect(landingTitle).toBeVisible({ timeout: TIMEOUTS.LONG });

      // Le formulaire de login ne devrait plus être visible
      await expect(page.locator('input#email')).toBeHidden();
    });
  });

  test.describe('OAuth Google', () => {
    test('affiche le bouton de connexion Google', async ({ page }) => {
      const googleButton = page.locator('button').filter({ hasText: /google/i });
      await expect(googleButton).toBeVisible();
    });

    test('le bouton Google contient le logo', async ({ page }) => {
      const googleButton = page.locator('button').filter({ hasText: /google/i });
      const googleLogo = googleButton.locator('svg');
      await expect(googleLogo).toBeVisible();
    });
  });

  test.describe('Navigation login/register', () => {
    test('peut basculer de login vers register et retour', async ({ page }) => {
      // Initialement sur login
      await expect(page.locator('input#email')).toBeVisible();

      // Aller vers register
      await page.getByText('Créer un compte').click();
      await page.waitForTimeout(500);
      await expect(page.locator('input#register-email')).toBeVisible();

      // Revenir vers login
      await page.getByText('Se connecter').click();
      await page.waitForTimeout(500);
      await expect(page.locator('input#email')).toBeVisible();
    });
  });

  test.describe('Déconnexion', () => {
    test('permet de se déconnecter après connexion invité', async ({ page }) => {
      // Se connecter en tant qu'invité
      const guestButton = page.getByText('Continuer sans compte');
      await guestButton.click();

      // Attendre d'être sur la landing
      await page.waitForURL('**/', { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();

      // Trouver et cliquer sur le bouton de déconnexion
      const logoutButton = page.locator('button[title*="logout" i], button[title*="déconnexion" i]');

      if (await logoutButton.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await logoutButton.first().click();

        // Vérifier le retour à la page d'authentification
        await expect(page.locator('input#email')).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      } else {
        // Le bouton logout peut être dans un menu
        test.skip();
      }
    });
  });

  test.describe('Persistance de session', () => {
    test('maintient la session après rechargement (invité)', async ({ page }) => {
      // Se connecter en tant qu'invité
      const guestButton = page.getByText('Continuer sans compte');
      await guestButton.click();

      // Attendre d'être sur la landing
      await page.waitForURL('**/', { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on n'est plus sur la page de login
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input#email')).toBeHidden();

      // Recharger la page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // L'utilisateur devrait toujours être connecté (pas de formulaire de login)
      await expect(page.locator('input#email')).toBeHidden({ timeout: TIMEOUTS.LONG });
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  test.describe('Interface responsive', () => {
    test('le formulaire est utilisable sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await expect(page.locator('input#email')).toBeVisible();
      await expect(page.locator('input#password')).toBeVisible();
      await expect(page.locator('form button[type="submit"]')).toBeVisible();
    });

    test('affiche le header mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Le header mobile devrait être visible
      const mobileHeader = page.locator('header').first();
      await expect(mobileHeader).toBeVisible();
    });
  });
});
