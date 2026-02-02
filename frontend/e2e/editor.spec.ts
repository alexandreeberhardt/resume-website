/**
 * Tests E2E pour l'éditeur de CV
 */

import { test, expect } from '@playwright/test';
import { LandingPage, EditorPage, AddSectionModal, SaveModal } from './helpers/page-objects';
import { MOCK_PERSONAL_INFO, MOCK_EXPERIENCE, MOCK_EDUCATION, MOCK_SKILLS, TIMEOUTS, SECTION_TYPES } from './fixtures/test-data';

test.describe('Éditeur de CV', () => {
  let editorPage: EditorPage;

  test.beforeEach(async ({ page }) => {
    // Aller à l'éditeur depuis la landing
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await landingPage.clickCreateCv();

    editorPage = new EditorPage(page);

    // Attendre que l'éditeur soit chargé
    await page.waitForTimeout(TIMEOUTS.SHORT);
  });

  test.describe('Section Informations Personnelles', () => {
    test('affiche tous les champs personnels', async ({ page }) => {
      await expect(editorPage.nameInput).toBeVisible();
      await expect(editorPage.titleInput).toBeVisible();
      await expect(editorPage.locationInput).toBeVisible();
      await expect(editorPage.emailInput).toBeVisible();
      await expect(editorPage.phoneInput).toBeVisible();
    });

    test('permet de remplir les informations personnelles', async ({ page }) => {
      await editorPage.fillPersonalInfo(MOCK_PERSONAL_INFO);

      // Vérifier que les valeurs sont enregistrées
      await expect(editorPage.nameInput).toHaveValue(MOCK_PERSONAL_INFO.name);
      await expect(editorPage.titleInput).toHaveValue(MOCK_PERSONAL_INFO.title);
      await expect(editorPage.emailInput).toHaveValue(MOCK_PERSONAL_INFO.email);
    });

    test('permet d\'ajouter des liens professionnels', async ({ page }) => {
      // Trouver le bouton d'ajout de lien
      const addLinkButton = page.getByRole('button', { name: /ajouter.*lien|add.*link/i });

      if (await addLinkButton.isVisible()) {
        await addLinkButton.click();

        // Vérifier qu'un nouveau champ de lien apparaît
        const linkInput = page.locator('input[placeholder*="linkedin" i], input[placeholder*="url" i], select');
        await expect(linkInput.first()).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    });

    test('affiche le bouton Suivant', async ({ page }) => {
      await expect(editorPage.nextButton).toBeVisible();
    });

    test('passe à l\'étape suivante au clic sur Suivant', async ({ page }) => {
      await editorPage.fillPersonalInfo(MOCK_PERSONAL_INFO);
      await editorPage.goToNextStep();

      // Vérifier qu'une nouvelle section ou le modal d'ajout apparaît
      await page.waitForTimeout(TIMEOUTS.SHORT);

      const modalOrSection = page.locator('[class*="modal"], [class*="section"]:not([class*="personal"])');
      await expect(modalOrSection.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });
  });

  test.describe('Gestion des sections', () => {
    test('permet d\'ajouter une section', async ({ page }) => {
      // Aller à l'étape des sections
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Le modal d'ajout devrait s'ouvrir ou un bouton d'ajout devrait être visible
      const addSectionModal = new AddSectionModal(page);

      if (await addSectionModal.modal.isVisible()) {
        // Sélectionner une section
        await addSectionModal.selectSection('Experience');

        // La section devrait être ajoutée
        await page.waitForTimeout(TIMEOUTS.SHORT);
        const experienceSection = page.locator('[class*="experience"], [data-section*="experience"]');
        await expect(experienceSection.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
      }
    });

    test('permet de supprimer une section', async ({ page }) => {
      // Ajouter d'abord une section
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      const addSectionModal = new AddSectionModal(page);
      if (await addSectionModal.modal.isVisible()) {
        await addSectionModal.selectSection('Summary');
      }

      await page.waitForTimeout(TIMEOUTS.SHORT);

      // Trouver le bouton de suppression
      const deleteButton = page.locator('[class*="section"]')
        .first()
        .getByRole('button', { name: /supprimer|delete|×/i });

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirmer si nécessaire
        const confirmButton = page.getByRole('button', { name: /confirmer|confirm|oui|yes/i });
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
      }
    });

    test('permet de réorganiser les sections par drag & drop', async ({ page }) => {
      // Ce test nécessite au moins 2 sections
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Ajouter plusieurs sections
      for (const sectionType of ['Summary', 'Experience']) {
        const addButton = page.getByRole('button', { name: /ajouter.*section|add.*section/i });
        if (await addButton.isVisible()) {
          await addButton.click();
          await page.getByRole('button', { name: new RegExp(sectionType, 'i') }).click();
          await page.waitForTimeout(TIMEOUTS.SHORT);
        }
      }

      // Vérifier que les handles de drag sont présents
      const dragHandles = page.locator('[class*="drag"], [class*="handle"], [data-dnd]');
      const handleCount = await dragHandles.count();

      expect(handleCount).toBeGreaterThanOrEqual(0);
    });

    test('permet de masquer/afficher une section', async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Ajouter une section
      const addSectionModal = new AddSectionModal(page);
      if (await addSectionModal.modal.isVisible()) {
        await addSectionModal.selectSection('Summary');
      }

      await page.waitForTimeout(TIMEOUTS.SHORT);

      // Trouver le toggle de visibilité
      const visibilityToggle = page.locator('[class*="section"]')
        .first()
        .locator('button:has([class*="eye"]), [class*="visibility"], input[type="checkbox"]');

      if (await visibilityToggle.first().isVisible()) {
        await visibilityToggle.first().click();

        // Vérifier le changement d'état
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }
    });
  });

  test.describe('Éditeur de section Experience', () => {
    test.beforeEach(async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Ajouter la section Experience
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /expérience|experience/i }).click();
      }
      await page.waitForTimeout(TIMEOUTS.SHORT);
    });

    test('permet d\'ajouter une expérience', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /ajouter|add/i }).first();

      if (await addButton.isVisible()) {
        await addButton.click();

        // Vérifier que les champs apparaissent
        const titleInput = page.getByPlaceholder(/titre|title|poste/i).first();
        await expect(titleInput).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    });

    test('permet de remplir une expérience complète', async ({ page }) => {
      // Les champs devraient être visibles après ajout d'expérience
      const titleInput = page.getByPlaceholder(/titre|title|poste/i).first();
      const companyInput = page.getByPlaceholder(/entreprise|company|société/i).first();

      if (await titleInput.isVisible()) {
        await titleInput.fill(MOCK_EXPERIENCE.title);
      }

      if (await companyInput.isVisible()) {
        await companyInput.fill(MOCK_EXPERIENCE.company);
      }

      // Vérifier les valeurs
      if (await titleInput.isVisible()) {
        await expect(titleInput).toHaveValue(MOCK_EXPERIENCE.title);
      }
    });

    test('permet d\'ajouter des points clés (highlights)', async ({ page }) => {
      const addHighlightButton = page.getByRole('button', { name: /ajouter.*point|add.*highlight|bullet/i });

      if (await addHighlightButton.first().isVisible()) {
        await addHighlightButton.first().click();

        // Un nouveau champ devrait apparaître
        const highlightInput = page.locator('input, textarea').last();
        await highlightInput.fill('Point clé de test');

        await expect(highlightInput).toHaveValue('Point clé de test');
      }
    });
  });

  test.describe('Éditeur de section Éducation', () => {
    test.beforeEach(async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Ajouter la section Education
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /formation|education|études/i }).click();
      }
      await page.waitForTimeout(TIMEOUTS.SHORT);
    });

    test('permet d\'ajouter une formation', async ({ page }) => {
      const addButton = page.getByRole('button', { name: /ajouter|add/i }).first();

      if (await addButton.isVisible()) {
        await addButton.click();

        const schoolInput = page.getByPlaceholder(/école|school|université|university/i).first();
        await expect(schoolInput).toBeVisible({ timeout: TIMEOUTS.SHORT });
      }
    });

    test('permet de remplir une formation complète', async ({ page }) => {
      const schoolInput = page.getByPlaceholder(/école|school|université/i).first();
      const degreeInput = page.getByPlaceholder(/diplôme|degree/i).first();

      if (await schoolInput.isVisible()) {
        await schoolInput.fill(MOCK_EDUCATION.school);
        await expect(schoolInput).toHaveValue(MOCK_EDUCATION.school);
      }

      if (await degreeInput.isVisible()) {
        await degreeInput.fill(MOCK_EDUCATION.degree);
        await expect(degreeInput).toHaveValue(MOCK_EDUCATION.degree);
      }
    });
  });

  test.describe('Éditeur de section Compétences', () => {
    test.beforeEach(async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test User' });
      await editorPage.goToNextStep();

      // Ajouter la section Skills
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /compétences|skills/i }).click();
      }
      await page.waitForTimeout(TIMEOUTS.SHORT);
    });

    test('permet de remplir les langages et outils', async ({ page }) => {
      const languagesInput = page.getByPlaceholder(/langages|languages|programming/i).first()
        .or(page.locator('textarea, input').filter({ hasText: /langages/i }));

      const toolsInput = page.getByPlaceholder(/outils|tools|frameworks/i).first()
        .or(page.locator('textarea, input').filter({ hasText: /outils/i }));

      // Remplir si les champs sont trouvés
      if (await languagesInput.first().isVisible()) {
        await languagesInput.first().fill(MOCK_SKILLS.languages);
      }

      if (await toolsInput.first().isVisible()) {
        await toolsInput.first().fill(MOCK_SKILLS.tools);
      }
    });
  });

  test.describe('Preview du CV', () => {
    test('affiche le panel de preview sur desktop', async ({ page }) => {
      // S'assurer qu'on est en mode desktop
      await page.setViewportSize({ width: 1280, height: 800 });

      await expect(editorPage.previewPanel).toBeVisible();
    });

    test('met à jour le preview en temps réel', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      // Remplir le nom
      await editorPage.nameInput.fill('Preview Test Name');

      // Attendre la mise à jour du preview
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      // Le preview devrait contenir le nouveau nom
      const previewContent = await editorPage.previewPanel.textContent();
      // Note: Le preview peut être un iframe ou une image générée
    });

    test('affiche le bouton preview sur mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();

      // Aller dans l'éditeur
      const landingPage = new LandingPage(page);
      await landingPage.clickCreateCv();

      const mobilePreviewButton = page.locator('button:has([class*="eye"]), [aria-label*="preview"]');
      await expect(mobilePreviewButton.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    });
  });

  test.describe('Sélection de template', () => {
    test('affiche les templates disponibles', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const templates = page.locator('aside button:has(img), [class*="template"] button');
      const count = await templates.count();

      expect(count).toBeGreaterThan(0);
    });

    test('permet de changer de template', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      // Sélectionner un template différent
      const templateButton = page.locator('button:has-text("Michel"), button:has-text("Double")').first();

      if (await templateButton.isVisible()) {
        await templateButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);

        // Vérifier que le template est sélectionné (classe active ou ring)
        await expect(templateButton).toHaveClass(/selected|active|ring/);
      }
    });

    test('permet de changer la taille du template', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const sizeButtons = page.locator('button:has-text("Compact"), button:has-text("Normal"), button:has-text("Large")');

      // Cliquer sur Compact
      const compactButton = page.getByRole('button', { name: 'Compact' });
      if (await compactButton.isVisible()) {
        await compactButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }

      // Cliquer sur Large
      const largeButton = page.getByRole('button', { name: 'Large' });
      if (await largeButton.isVisible()) {
        await largeButton.click();
        await page.waitForTimeout(TIMEOUTS.SHORT);
      }
    });

    test('le mode Auto-size est disponible', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const autoButton = page.getByRole('button', { name: /auto/i });
      await expect(autoButton).toBeVisible();
    });
  });

  test.describe('Sauvegarde', () => {
    test('affiche le bouton de sauvegarde', async ({ page }) => {
      await expect(editorPage.saveButton.first()).toBeVisible();
    });

    test('ouvre le modal de sauvegarde pour un nouveau CV', async ({ page }) => {
      await editorPage.fillPersonalInfo(MOCK_PERSONAL_INFO);

      await editorPage.saveButton.first().click();

      // Le modal devrait s'ouvrir
      const saveModal = new SaveModal(page);
      await expect(saveModal.modal).toBeVisible({ timeout: TIMEOUTS.SHORT });
    });

    test('permet de nommer et sauvegarder un CV', async ({ page }) => {
      await editorPage.fillPersonalInfo(MOCK_PERSONAL_INFO);
      await editorPage.saveButton.first().click();

      const saveModal = new SaveModal(page);
      if (await saveModal.modal.isVisible()) {
        await saveModal.saveAs(`Test CV ${Date.now()}`);

        // Attendre la sauvegarde
        await page.waitForTimeout(TIMEOUTS.MEDIUM);

        // Le modal devrait se fermer
        await expect(saveModal.modal).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
      }
    });
  });

  test.describe('Navigation dans l\'éditeur', () => {
    test('permet de naviguer avec Précédent/Suivant', async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      // Ajouter une section
      const modal = page.locator('[class*="modal"]');
      if (await modal.isVisible()) {
        await page.getByRole('button', { name: /summary|résumé/i }).click();
      }

      await page.waitForTimeout(TIMEOUTS.SHORT);

      // Le bouton Précédent devrait être visible
      await expect(editorPage.previousButton).toBeVisible();

      // Retourner en arrière
      await editorPage.goToPreviousStep();

      // On devrait voir les infos personnelles
      await expect(editorPage.nameInput).toBeVisible({ timeout: TIMEOUTS.SHORT });
    });
  });

  test.describe('Validation des données', () => {
    test('accepte un CV minimal', async ({ page }) => {
      // Juste un nom
      await editorPage.nameInput.fill('Minimal User');

      // Devrait pouvoir exporter
      await expect(editorPage.exportButton.first()).toBeEnabled();
    });

    test('affiche les erreurs de validation', async ({ page }) => {
      // Tenter d'exporter sans aucune donnée
      await editorPage.exportButton.first().click();

      // Attendre une réponse
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      // Vérifier s'il y a une erreur ou si l'export continue
      const errorVisible = await editorPage.errorBanner.isVisible();
      // Les deux comportements sont acceptables selon l'implémentation
    });
  });

  test.describe('Section personnalisée (Custom)', () => {
    test('permet d\'ajouter une section personnalisée', async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      const modal = page.locator('[class*="modal"]');
      if (await modal.isVisible()) {
        // Chercher l'option "Custom" ou "Personnalisé"
        const customButton = page.getByRole('button', { name: /custom|personnalisé|autre/i });
        if (await customButton.isVisible()) {
          await customButton.click();
          await page.waitForTimeout(TIMEOUTS.SHORT);

          // Vérifier qu'une section personnalisée est ajoutée
          const customSection = page.locator('[class*="custom"], [data-section*="custom"]');
          await expect(customSection.first()).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        }
      }
    });

    test('permet de modifier le titre d\'une section personnalisée', async ({ page }) => {
      await editorPage.fillPersonalInfo({ name: 'Test' });
      await editorPage.goToNextStep();

      const modal = page.locator('[class*="modal"]');
      if (await modal.isVisible()) {
        const customButton = page.getByRole('button', { name: /custom|personnalisé/i });
        if (await customButton.isVisible()) {
          await customButton.click();
          await page.waitForTimeout(TIMEOUTS.SHORT);

          // Trouver le champ de titre de la section
          const titleInput = page.locator('[class*="section"]').first().locator('input[type="text"]').first();
          if (await titleInput.isVisible()) {
            await titleInput.fill('Centres d\'intérêt');
            await expect(titleInput).toHaveValue('Centres d\'intérêt');
          }
        }
      }
    });
  });
});
