/**
 * Page Objects pour les tests E2E
 * Abstraction des interactions avec les pages
 */

import { Page, Locator, expect } from '@playwright/test';
import { MOCK_PERSONAL_INFO, MOCK_EXPERIENCE, MOCK_EDUCATION, TIMEOUTS } from '../fixtures/test-data';

/**
 * Page Object pour la page d'authentification
 */
export class AuthPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly switchToRegisterLink: Locator;
  readonly switchToLoginLink: Locator;
  readonly guestButton: Locator;
  readonly googleButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    // Champs de formulaire
    this.emailInput = page.locator('input#email, input#register-email');
    this.passwordInput = page.locator('input#password, input#register-password');
    this.confirmPasswordInput = page.locator('input#register-confirm-password');

    // Boutons de soumission
    this.loginButton = page.locator('form button[type="submit"]').first();
    this.registerButton = page.locator('form button[type="submit"]').first();

    // Liens de navigation entre login/register
    this.switchToRegisterLink = page.locator('button.text-brand, a.text-brand').filter({ hasText: /inscription|créer|register|sign up/i });
    this.switchToLoginLink = page.locator('button.text-brand, a.text-brand').filter({ hasText: /connexion|login|sign in/i });

    // Bouton continuer sans compte (invité)
    this.guestButton = page.locator('button, a').filter({ hasText: /continuer sans|continue without|invité|guest/i });

    // Bouton Google OAuth
    this.googleButton = page.locator('button').filter({ hasText: /google/i });

    // Messages
    this.errorMessage = page.locator('[class*="error"], [class*="shake"]').filter({ has: page.locator('p') });
    this.successMessage = page.locator('[class*="success"]');

    // Checkbox des conditions
    this.termsCheckbox = page.locator('input[type="checkbox"]');
  }

  async login(email: string, password: string) {
    // S'assurer qu'on est sur le formulaire de login
    const isLoginForm = await this.page.locator('input#email').isVisible();
    if (!isLoginForm) {
      await this.switchToLoginLink.click();
      await this.page.waitForTimeout(500);
    }

    await this.page.locator('input#email').fill(email);
    await this.page.locator('input#password').fill(password);
    await this.loginButton.click();
  }

  async register(email: string, password: string) {
    // Basculer vers le formulaire d'inscription
    await this.switchToRegisterLink.click();
    await this.page.waitForTimeout(500);

    await this.page.locator('input#register-email').fill(email);
    await this.page.locator('input#register-password').fill(password);
    await this.confirmPasswordInput.fill(password);

    // Cocher les conditions d'utilisation
    await this.termsCheckbox.check();

    await this.registerButton.click();
  }

  async continueAsGuest() {
    await this.guestButton.click();
  }

  async waitForRedirectAfterLogin() {
    // Attendre que la page d'authentification disparaisse
    await expect(this.loginButton).toBeHidden({ timeout: 15000 });
  }

  async isOnLoginPage(): Promise<boolean> {
    return await this.page.locator('input#email').isVisible();
  }

  async isOnRegisterPage(): Promise<boolean> {
    return await this.page.locator('input#register-email').isVisible();
  }
}

/**
 * Page Object pour la Landing Page
 */
export class LandingPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly heroTitle: Locator;
  readonly createCvButton: Locator;
  readonly importPdfButton: Locator;
  readonly myResumesButton: Locator;
  readonly templateCards: Locator;
  readonly languageSwitcher: Locator;
  readonly themeToggle: Locator;
  readonly logoutButton: Locator;
  readonly accountButton: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('nav').first();
    this.heroTitle = page.locator('h1').first();
    this.createCvButton = page.locator('button').filter({ hasText: /créer|create/i }).first();
    this.importPdfButton = page.locator('button').filter({ hasText: /importer|import/i }).first();
    this.myResumesButton = page.locator('button').filter({ hasText: /mes cv|my resume/i }).first();
    this.templateCards = page.locator('[class*="card"]').filter({ has: page.locator('img') });
    this.languageSwitcher = page.locator('button:has-text("FR"), button:has-text("EN")');
    this.themeToggle = page.locator('button:has([class*="moon"]), button:has([class*="sun"])');
    this.logoutButton = page.locator('button[title*="logout"], button[title*="déconnexion"]');
    this.accountButton = page.locator('a[href="/account"]');
    this.footer = page.locator('footer');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickCreateCv() {
    await this.createCvButton.click();
  }

  async selectTemplate(templateName: string) {
    await this.page.locator(`[class*="card"]:has-text("${templateName}")`).click();
  }

  async switchLanguage(lang: 'fr' | 'en') {
    const button = this.page.getByRole('button', { name: lang.toUpperCase() });
    await button.click();
  }
}

/**
 * Page Object pour l'éditeur de CV
 */
export class EditorPage {
  readonly page: Page;
  readonly personalSection: Locator;
  readonly nameInput: Locator;
  readonly titleInput: Locator;
  readonly locationInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addLinkButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly addSectionButton: Locator;
  readonly saveButton: Locator;
  readonly exportButton: Locator;
  readonly previewPanel: Locator;
  readonly templateSelector: Locator;
  readonly sizeSelector: Locator;
  readonly mobilePreviewButton: Locator;
  readonly errorBanner: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.personalSection = page.locator('main').first();
    this.nameInput = page.locator('input').filter({ hasText: '' }).first();
    this.titleInput = page.locator('input').nth(1);
    this.locationInput = page.locator('input').nth(2);
    this.emailInput = page.locator('main input[type="email"], main input[placeholder*="email" i]').first();
    this.phoneInput = page.locator('input[type="tel"], input[placeholder*="phone" i], input[placeholder*="téléphone" i]');
    this.addLinkButton = page.locator('button').filter({ hasText: /ajouter.*lien|add.*link/i });
    this.nextButton = page.locator('button').filter({ hasText: /suivant|next/i });
    this.previousButton = page.locator('button').filter({ hasText: /précédent|previous/i });
    this.addSectionButton = page.locator('button').filter({ hasText: /ajouter.*section|add.*section/i });
    this.saveButton = page.locator('button').filter({ hasText: /save|sauvegarder|enregistrer/i });
    this.exportButton = page.locator('button').filter({ hasText: /export|télécharger/i });
    this.previewPanel = page.locator('aside');
    this.templateSelector = page.locator('aside button:has(img)');
    this.sizeSelector = page.locator('button:has-text("Compact"), button:has-text("Normal"), button:has-text("Large")');
    this.mobilePreviewButton = page.locator('button[class*="fixed"]:has(svg)');
    this.errorBanner = page.locator('[class*="error"]');
    this.loadingSpinner = page.locator('[class*="spin"], [class*="loading"]');
  }

  async fillPersonalInfo(info: Partial<typeof MOCK_PERSONAL_INFO> = MOCK_PERSONAL_INFO) {
    // Trouver les inputs par leur placeholder
    const inputs = await this.page.locator('main input').all();

    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      if (!placeholder) continue;

      const lowerPlaceholder = placeholder.toLowerCase();

      if (info.name && (lowerPlaceholder.includes('nom') || lowerPlaceholder.includes('name'))) {
        await input.fill(info.name);
      } else if (info.title && (lowerPlaceholder.includes('titre') || lowerPlaceholder.includes('title') || lowerPlaceholder.includes('poste'))) {
        await input.fill(info.title);
      } else if (info.location && (lowerPlaceholder.includes('ville') || lowerPlaceholder.includes('location') || lowerPlaceholder.includes('lieu'))) {
        await input.fill(info.location);
      } else if (info.email && lowerPlaceholder.includes('email')) {
        await input.fill(info.email);
      } else if (info.phone && (lowerPlaceholder.includes('phone') || lowerPlaceholder.includes('téléphone'))) {
        await input.fill(info.phone);
      }
    }
  }

  async goToNextStep() {
    await this.nextButton.click();
  }

  async goToPreviousStep() {
    await this.previousButton.click();
  }

  async addSection(sectionType: string) {
    await this.addSectionButton.click();
    await this.page.locator('button').filter({ hasText: new RegExp(sectionType, 'i') }).click();
  }

  async selectTemplate(templateName: string) {
    await this.page.locator(`button:has-text("${templateName}")`).click();
  }

  async selectSize(size: 'Compact' | 'Normal' | 'Large') {
    await this.page.getByRole('button', { name: size }).click();
  }

  async exportPdf() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportButton.first().click();
    return downloadPromise;
  }

  async waitForPreviewUpdate() {
    await this.page.waitForTimeout(TIMEOUTS.MEDIUM);
  }

  async getSectionByType(type: string): Locator {
    return this.page.locator(`[data-section-type="${type}"], [class*="${type}"]`);
  }
}

/**
 * Page Object pour l'éditeur d'expérience
 */
export class ExperienceEditor {
  readonly page: Page;
  readonly section: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('[class*="experience"], [data-section-type="experiences"]');
  }

  async addExperience(exp: typeof MOCK_EXPERIENCE) {
    const addButton = this.section.locator('button').filter({ hasText: /ajouter|add/i });
    await addButton.click();

    const lastItem = this.section.locator('[class*="item"]').last();
    await lastItem.locator('input').first().fill(exp.title);
  }
}

/**
 * Page Object pour l'éditeur d'éducation
 */
export class EducationEditor {
  readonly page: Page;
  readonly section: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('[class*="education"], [data-section-type="education"]');
  }

  async addEducation(edu: typeof MOCK_EDUCATION) {
    const addButton = this.section.locator('button').filter({ hasText: /ajouter|add/i });
    await addButton.click();

    const lastItem = this.section.locator('[class*="item"]').last();
    await lastItem.locator('input').first().fill(edu.school);
  }
}

/**
 * Page Object pour la page Mes CV
 */
export class ResumesPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly createNewButton: Locator;
  readonly resumeCards: Locator;
  readonly emptyState: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1');
    this.createNewButton = page.locator('button').filter({ hasText: /créer|create|nouveau|new/i });
    this.resumeCards = page.locator('[class*="card"]').filter({ has: page.locator('h3') });
    this.emptyState = page.locator('[class*="empty"]');
    this.backButton = page.locator('button:has(svg), a:has(svg)').first();
  }

  async openResume(name: string) {
    await this.page.locator(`[class*="card"]:has-text("${name}")`).click();
  }

  async deleteResume(name: string) {
    const card = this.page.locator(`[class*="card"]:has-text("${name}")`);
    await card.hover();
    await card.locator('button:has([class*="trash"])').click();
  }

  async getResumeCount(): Promise<number> {
    return await this.resumeCards.count();
  }
}

/**
 * Page Object pour la page Compte
 */
export class AccountPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly emailDisplay: Locator;
  readonly exportDataButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly backButton: Locator;
  readonly upgradeSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1');
    this.emailDisplay = page.locator('text=@');
    this.exportDataButton = page.locator('button').filter({ hasText: /exporter.*données|export.*data/i });
    this.deleteAccountButton = page.locator('button').filter({ hasText: /supprimer.*compte|delete.*account/i });
    this.backButton = page.locator('a:has(svg)').first();
    this.upgradeSection = page.locator('[class*="upgrade"]');
  }

  async goto() {
    await this.page.goto('/account');
  }

  async exportData() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportDataButton.click();
    return downloadPromise;
  }
}

/**
 * Page Object pour le modal d'ajout de section
 */
export class AddSectionModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly sectionButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('[class*="modal"], [role="dialog"]');
    this.closeButton = this.modal.locator('button').filter({ hasText: /×|close|fermer/i });
    this.sectionButtons = this.modal.locator('button');
  }

  async selectSection(type: string) {
    await this.modal.locator('button').filter({ hasText: new RegExp(type, 'i') }).click();
  }

  async close() {
    await this.closeButton.click();
  }
}

/**
 * Page Object pour le modal de sauvegarde
 */
export class SaveModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('[class*="modal"]').filter({ has: page.locator('input') });
    this.nameInput = this.modal.locator('input');
    this.saveButton = this.modal.locator('button').filter({ hasText: /save|sauvegarder|enregistrer/i });
    this.cancelButton = this.modal.locator('button').filter({ hasText: /annuler|cancel/i });
  }

  async saveAs(name: string) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
