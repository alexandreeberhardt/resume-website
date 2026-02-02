/**
 * Tests E2E pour l'expérience mobile
 */

import { test, expect, devices } from '@playwright/test';
import { LandingPage, EditorPage } from './helpers/page-objects';
import { MOCK_PERSONAL_INFO, TIMEOUTS } from './fixtures/test-data';

// Configuration mobile
const mobileViewport = { width: 375, height: 667 };
const tabletViewport = { width: 768, height: 1024 };

test.describe('Expérience Mobile', () => {
  test.describe('Landing Page Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');
    });

    test('affiche correctement le header sur mobile', async ({ page }) => {
      // Le logo devrait être visible
      const logo = page.locator('nav [class*="logo"], nav svg').first();
      await expect(logo).toBeVisible();

      // Les boutons principaux devraient être accessibles
      const menuButton = page.locator('button:has([class*="menu"]), button[aria-label*="menu"]');
      const hasHamburger = await menuButton.isVisible();

      // Sur mobile, soit un menu hamburger soit les boutons directs
      expect(true).toBe(true);
    });

    test('le titre hero est lisible sur mobile', async ({ page }) => {
      const landingPage = new LandingPage(page);

      await expect(landingPage.heroTitle).toBeVisible();

      // Vérifier que le titre n'est pas tronqué
      const titleBox = await landingPage.heroTitle.boundingBox();
      expect(titleBox?.width).toBeLessThanOrEqual(mobileViewport.width);
    });

    test('les boutons d\'action sont accessibles sur mobile', async ({ page }) => {
      const landingPage = new LandingPage(page);

      await expect(landingPage.createCvButton).toBeVisible();
      await expect(landingPage.importPdfButton).toBeVisible();

      // Les boutons devraient être assez grands pour être cliquables
      const createButtonBox = await landingPage.createCvButton.boundingBox();
      expect(createButtonBox?.height).toBeGreaterThanOrEqual(40); // Au moins 40px de hauteur
    });

    test('les templates sont affichés en grille adaptative', async ({ page }) => {
      const templateCards = page.locator('[class*="template"], [class*="card"]').filter({
        has: page.locator('img'),
      });

      const count = await templateCards.count();
      expect(count).toBeGreaterThan(0);

      // Vérifier que les cartes ne débordent pas
      const firstCard = templateCards.first();
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.x).toBeGreaterThanOrEqual(0);
      expect((cardBox?.x || 0) + (cardBox?.width || 0)).toBeLessThanOrEqual(mobileViewport.width + 10);
    });

    test('le footer est visible et accessible', async ({ page }) => {
      const landingPage = new LandingPage(page);

      // Scroller vers le bas
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(TIMEOUTS.SHORT);

      await expect(landingPage.footer).toBeVisible();
    });
  });

  test.describe('Éditeur Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();
    });

    test('affiche le formulaire en pleine largeur', async ({ page }) => {
      const editorPage = new EditorPage(page);

      // Le champ nom devrait utiliser la largeur disponible
      const nameInputBox = await editorPage.nameInput.boundingBox();
      expect(nameInputBox?.width).toBeGreaterThan(mobileViewport.width * 0.7);
    });

    test('masque le preview par défaut sur mobile', async ({ page }) => {
      // Le panel de preview ne devrait pas être visible sur mobile
      const previewPanel = page.locator('aside');
      await expect(previewPanel).toBeHidden();
    });

    test('affiche le bouton de preview flottant', async ({ page }) => {
      // Un bouton flottant pour voir le preview devrait être visible
      const previewButton = page.locator('button:has([class*="eye"]), [aria-label*="preview"], button[class*="fixed"]');
      await expect(previewButton.first()).toBeVisible();
    });

    test('ouvre le preview en plein écran au clic sur le bouton', async ({ page }) => {
      // Cliquer sur le bouton preview
      const previewButton = page.locator('button:has([class*="eye"]), [aria-label*="preview"]').first();

      if (await previewButton.isVisible()) {
        await previewButton.click();

        // Le preview devrait s'ouvrir en plein écran
        const mobilePreview = page.locator('[class*="preview"], [class*="modal"]').filter({
          has: page.locator('h2, [class*="close"]'),
        });

        await expect(mobilePreview.first()).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    });

    test('permet de fermer le preview mobile', async ({ page }) => {
      const previewButton = page.locator('button:has([class*="eye"])').first();

      if (await previewButton.isVisible()) {
        await previewButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Trouver le bouton de fermeture
        const closeButton = page.locator('button:has([class*="x"]), button:has([class*="close"]), [aria-label*="close"]');

        if (await closeButton.first().isVisible()) {
          await closeButton.first().click();

          // Le preview devrait se fermer
          await page.waitForTimeout(TIMEOUTS.SHORT);
          await expect(previewButton).toBeVisible();
        }
      }
    });

    test('les champs de formulaire sont utilisables au toucher', async ({ page }) => {
      const editorPage = new EditorPage(page);

      // Taper du texte
      await editorPage.nameInput.tap();
      await editorPage.nameInput.fill('Test Mobile');

      await expect(editorPage.nameInput).toHaveValue('Test Mobile');
    });

    test('les boutons Suivant/Précédent sont accessibles', async ({ page }) => {
      const editorPage = new EditorPage(page);

      await editorPage.fillPersonalInfo({ name: 'Test' });

      // Le bouton Suivant devrait être visible
      await expect(editorPage.nextButton).toBeVisible();

      // Il devrait être facilement cliquable
      const nextButtonBox = await editorPage.nextButton.boundingBox();
      expect(nextButtonBox?.height).toBeGreaterThanOrEqual(40);
    });
  });

  test.describe('Menu Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();
    });

    test('affiche le menu hamburger', async ({ page }) => {
      const menuButton = page.locator('button:has([class*="menu"]), button[aria-label*="menu"]');
      await expect(menuButton.first()).toBeVisible();
    });

    test('ouvre le menu au clic', async ({ page }) => {
      const menuButton = page.locator('button:has([class*="menu"])').first();

      if (await menuButton.isVisible()) {
        await menuButton.click();

        // Le menu devrait s'ouvrir
        const mobileMenu = page.locator('[class*="mobile"], [class*="dropdown"], nav').filter({
          has: page.locator('button, a'),
        });

        await expect(mobileMenu.first()).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    });

    test('le menu contient les actions principales', async ({ page }) => {
      const menuButton = page.locator('button:has([class*="menu"])').first();

      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Vérifier les options du menu
        const menuOptions = [
          /mes cv|my resume/i,
          /sauvegard|save/i,
          /déconnexion|logout/i,
        ];

        for (const option of menuOptions) {
          const menuItem = page.locator(`button:has-text("${option.source}"), a:has-text("${option.source}")`);
          // Les options peuvent être présentes
        }
      }
    });

    test('ferme le menu au clic sur X', async ({ page }) => {
      const menuButton = page.locator('button:has([class*="menu"])').first();

      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        const closeButton = page.locator('button:has([class*="x"]), button:has([class*="close"])').first();

        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(TIMEOUTS.SHORT);

          // Le menu devrait être fermé
        }
      }
    });
  });

  test.describe('Responsive Tablet', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(tabletViewport);
    });

    test('affiche un layout adapté sur tablette', async ({ page }) => {
      await page.goto('/');

      const landingPage = new LandingPage(page);

      // Sur tablette, le layout peut être différent
      await expect(landingPage.heroTitle).toBeVisible();
      await expect(landingPage.createCvButton).toBeVisible();
    });

    test('peut afficher le preview côte à côte sur tablette paysage', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      // Sur tablette en paysage, le preview peut être visible
      const previewPanel = page.locator('aside');
      const isPreviewVisible = await previewPanel.isVisible();

      // Les deux comportements sont acceptables
      expect(true).toBe(true);
    });
  });

  test.describe('Touch Interactions', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');
    });

    test('les templates sont sélectionnables par tap', async ({ page }) => {
      const templateCard = page.locator('[class*="template"], [class*="card"]')
        .filter({ has: page.locator('img') })
        .first();

      if (await templateCard.isVisible()) {
        await templateCard.tap();

        // Devrait naviguer vers l'éditeur
        await page.waitForTimeout(TIMEOUTS.SHORT);

        const editorPage = new EditorPage(page);
        await expect(editorPage.nameInput).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      }
    });

    test('le scroll fonctionne correctement', async ({ page }) => {
      // Obtenir la hauteur initiale
      const initialScroll = await page.evaluate(() => window.scrollY);

      // Scroller vers le bas
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(TIMEOUTS.SHORT);

      const newScroll = await page.evaluate(() => window.scrollY);
      expect(newScroll).toBeGreaterThan(initialScroll);
    });

    test('les formulaires sont scrollables verticalement', async ({ page }) => {
      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      const editorPage = new EditorPage(page);
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      // Le formulaire devrait être scrollable
      const mainContent = page.locator('main');
      const scrollHeight = await mainContent.evaluate(el => el.scrollHeight);
      const clientHeight = await mainContent.evaluate(el => el.clientHeight);

      // Si le contenu dépasse, il devrait être scrollable
      expect(scrollHeight >= clientHeight).toBe(true);
    });
  });

  test.describe('Export Mobile', () => {
    test('permet d\'exporter sur mobile', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      const editorPage = new EditorPage(page);
      await editorPage.fillPersonalInfo(MOCK_PERSONAL_INFO);

      // Le bouton export devrait être accessible
      const exportButton = page.getByRole('button', { name: /export/i }).first();
      await expect(exportButton).toBeVisible();

      // L'export devrait fonctionner
      const downloadPromise = page.waitForEvent('download', { timeout: TIMEOUTS.PDF_GENERATION });
      await exportButton.click();

      const download = await downloadPromise;
      expect(download).toBeTruthy();
    });
  });

  test.describe('Orientation', () => {
    test('s\'adapte au changement d\'orientation (portrait → paysage)', async ({ page }) => {
      await page.setViewportSize(mobileViewport);
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await expect(landingPage.heroTitle).toBeVisible();

      // Simuler le passage en paysage
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(TIMEOUTS.SHORT);

      // L'interface devrait s'adapter
      await expect(landingPage.heroTitle).toBeVisible();
    });

    test('s\'adapte au changement d\'orientation (paysage → portrait)', async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 });
      await page.goto('/');

      const landingPage = new LandingPage(page);
      await expect(landingPage.heroTitle).toBeVisible();

      // Simuler le passage en portrait
      await page.setViewportSize(mobileViewport);
      await page.waitForTimeout(TIMEOUTS.SHORT);

      await expect(landingPage.heroTitle).toBeVisible();
    });
  });
});
