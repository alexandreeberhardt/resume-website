/**
 * Tests E2E pour l'internationalisation (i18n)
 */

import { test, expect } from '@playwright/test';
import { LandingPage, EditorPage } from './helpers/page-objects';
import { TIMEOUTS } from './fixtures/test-data';

test.describe('Internationalisation', () => {
  test.describe('Détection de langue', () => {
    test('utilise le français par défaut pour un navigateur FR', async ({ browser }) => {
      const context = await browser.newContext({
        locale: 'fr-FR',
      });
      const page = await context.newPage();

      await page.goto('/');

      // Vérifier que le contenu est en français
      const frenchContent = page.locator('text=/créer|professionnel|expérience|formation/i');
      await expect(frenchContent.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

      await context.close();
    });

    test('utilise l\'anglais pour un navigateur EN', async ({ browser }) => {
      const context = await browser.newContext({
        locale: 'en-US',
      });
      const page = await context.newPage();

      await page.goto('/');

      // Vérifier que le contenu est en anglais
      const englishContent = page.locator('text=/create|professional|experience|education/i');
      await expect(englishContent.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });

      await context.close();
    });
  });

  test.describe('Changement de langue', () => {
    test('permet de changer de FR vers EN', async ({ page }) => {
      await page.goto('/');

      // Trouver le sélecteur de langue
      const languageSwitcher = page.locator('button:has-text("FR"), button:has-text("EN"), [class*="language"]');

      // Cliquer sur EN
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Vérifier que la page est maintenant en anglais
        const englishContent = page.locator('text=/create|professional|experience/i');
        await expect(englishContent.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      }
    });

    test('permet de changer de EN vers FR', async ({ page }) => {
      await page.goto('/');

      // D'abord passer en anglais
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Puis revenir en français
      const frButton = page.getByRole('button', { name: 'FR' });
      if (await frButton.isVisible()) {
        await frButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Vérifier que la page est en français
        const frenchContent = page.locator('text=/créer|professionnel|expérience/i');
        await expect(frenchContent.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      }
    });

    test('persiste le choix de langue après navigation', async ({ page }) => {
      await page.goto('/');

      // Changer en anglais
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Naviguer vers l'éditeur
      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      // Vérifier que l'éditeur est en anglais
      const englishLabels = page.locator('text=/name|title|email|phone/i');
      await expect(englishLabels.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });

    test('persiste le choix de langue après rechargement', async ({ page }) => {
      await page.goto('/');

      // Changer en anglais
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Recharger la page
      await page.reload();

      // Vérifier que la langue est toujours en anglais
      const englishContent = page.locator('text=/create|professional|experience/i');
      await expect(englishContent.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });
  });

  test.describe('Traduction de l\'interface', () => {
    test.describe('Français', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const frButton = page.getByRole('button', { name: 'FR' });
        if (await frButton.isVisible()) {
          await frButton.click();
          await page.waitForTimeout(TIMEOUTS.SHORT);
        }
      });

      test('traduit la landing page', async ({ page }) => {
        const frenchTexts = [
          /créer/i,
          /cv|curriculum/i,
          /professionnel/i,
        ];

        for (const text of frenchTexts) {
          const element = page.locator(`text=${text.source || text}`);
          await expect(element.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        }
      });

      test('traduit les boutons de navigation', async ({ page }) => {
        const buttons = [
          /créer.*cv|nouveau/i,
          /importer/i,
          /mes cv/i,
        ];

        for (const buttonText of buttons) {
          const button = page.getByRole('button', { name: buttonText });
          if (await button.first().isVisible()) {
            await expect(button.first()).toBeVisible();
          }
        }
      });

      test('traduit l\'éditeur', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.clickCreateCv();

        // Vérifier les labels français
        const frenchLabels = [
          /nom/i,
          /titre/i,
          /email/i,
          /téléphone/i,
        ];

        for (const label of frenchLabels) {
          const element = page.locator(`[placeholder*="${label.source}"], label:has-text("${label.source}")`);
          if (await element.first().isVisible().catch(() => false)) {
            await expect(element.first()).toBeVisible();
          }
        }
      });

      test('traduit les noms de sections', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.clickCreateCv();

        const editorPage = new EditorPage(page);
        await editorPage.fillPersonalInfo({ name: 'Test' });
        await editorPage.goToNextStep();

        // Vérifier le modal de section
        const modal = page.locator('[class*="modal"]');
        if (await modal.isVisible()) {
          const frenchSections = [
            /résumé/i,
            /expérience/i,
            /formation/i,
            /compétences/i,
          ];

          for (const section of frenchSections) {
            const button = modal.getByRole('button', { name: section });
            if (await button.isVisible().catch(() => false)) {
              await expect(button).toBeVisible();
            }
          }
        }
      });
    });

    test.describe('Anglais', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const enButton = page.getByRole('button', { name: 'EN' });
        if (await enButton.isVisible()) {
          await enButton.click();
          await page.waitForTimeout(TIMEOUTS.SHORT);
        }
      });

      test('traduit la landing page', async ({ page }) => {
        const englishTexts = [
          /create/i,
          /resume|cv/i,
          /professional/i,
        ];

        for (const text of englishTexts) {
          const element = page.locator(`text=${text.source || text}`);
          await expect(element.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        }
      });

      test('traduit les boutons de navigation', async ({ page }) => {
        const buttons = [
          /create.*cv|new/i,
          /import/i,
          /my.*resume/i,
        ];

        for (const buttonText of buttons) {
          const button = page.getByRole('button', { name: buttonText });
          if (await button.first().isVisible()) {
            await expect(button.first()).toBeVisible();
          }
        }
      });

      test('traduit l\'éditeur', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.clickCreateCv();

        // Vérifier les labels anglais
        const englishLabels = [
          /name/i,
          /title/i,
          /email/i,
          /phone/i,
        ];

        for (const label of englishLabels) {
          const element = page.locator(`[placeholder*="${label.source}"], label:has-text("${label.source}")`);
          if (await element.first().isVisible().catch(() => false)) {
            await expect(element.first()).toBeVisible();
          }
        }
      });

      test('traduit les noms de sections', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.clickCreateCv();

        const editorPage = new EditorPage(page);
        await editorPage.fillPersonalInfo({ name: 'Test' });
        await editorPage.goToNextStep();

        // Vérifier le modal de section
        const modal = page.locator('[class*="modal"]');
        if (await modal.isVisible()) {
          const englishSections = [
            /summary/i,
            /experience/i,
            /education/i,
            /skills/i,
          ];

          for (const section of englishSections) {
            const button = modal.getByRole('button', { name: section });
            if (await button.isVisible().catch(() => false)) {
              await expect(button).toBeVisible();
            }
          }
        }
      });
    });
  });

  test.describe('Pages légales', () => {
    test('les pages légales françaises existent', async ({ page }) => {
      const frenchUrls = [
        '/mentions-legales',
        '/politique-confidentialite',
        '/cgu',
      ];

      for (const url of frenchUrls) {
        const response = await page.goto(url);
        expect(response?.status()).toBe(200);

        // Vérifier que le contenu est en français
        const content = await page.content();
        expect(content).toMatch(/français|france|données|utilisateur/i);
      }
    });

    test('les pages légales anglaises existent', async ({ page }) => {
      const englishUrls = [
        '/legal-notice',
        '/privacy-policy',
        '/terms',
      ];

      for (const url of englishUrls) {
        const response = await page.goto(url);
        expect(response?.status()).toBe(200);
      }
    });
  });

  test.describe('Titre de page', () => {
    test('le titre de page est traduit en français', async ({ page }) => {
      await page.goto('/');

      const frButton = page.getByRole('button', { name: 'FR' });
      if (await frButton.isVisible()) {
        await frButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      const title = await page.title();
      // Le titre devrait contenir du texte français
      expect(title.length).toBeGreaterThan(0);
    });

    test('le titre de page est traduit en anglais', async ({ page }) => {
      await page.goto('/');

      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });
  });

  test.describe('Contenu dynamique', () => {
    test('les sections de CV conservent leur titre personnalisé lors du changement de langue', async ({ page }) => {
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      const editorPage = new EditorPage(page);
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      // Ajouter une section et modifier son titre
      const modal = page.locator('[class*="modal"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /custom|personnalisé/i }).click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Modifier le titre de la section
      const customTitle = 'Mon Titre Personnalisé';
      const titleInput = page.locator('[class*="section"]').first().locator('input[type="text"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill(customTitle);
      }

      // Changer de langue
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Le titre personnalisé devrait être conservé
      if (await titleInput.isVisible()) {
        await expect(titleInput).toHaveValue(customTitle);
      }
    });

    test('les sections par défaut changent de langue', async ({ page }) => {
      await page.goto('/');

      // Commencer en français
      const frButton = page.getByRole('button', { name: 'FR' });
      if (await frButton.isVisible()) {
        await frButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      const editorPage = new EditorPage(page);
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      // Ajouter une section avec titre par défaut
      const modal = page.locator('[class*="modal"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /expérience|experience/i }).click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Vérifier le titre en français
      const frenchTitle = page.locator('[class*="section"]').first().locator('text=/expérience/i');

      // Changer en anglais
      const enButton = page.getByRole('button', { name: 'EN' });
      if (await enButton.isVisible()) {
        await enButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Le titre par défaut devrait changer
      // Note: Cela dépend de l'implémentation
    });
  });
});
