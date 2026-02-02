/**
 * Utilitaires partagés pour les tests E2E
 */

import { Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../fixtures/test-data';

/**
 * Attend que la page soit complètement chargée
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Attend qu'un élément soit stable (pas d'animation)
 */
export async function waitForElementStable(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });

  // Attendre que l'élément arrête de bouger
  let previousBox = await element.boundingBox();
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(100);
    const currentBox = await element.boundingBox();

    if (previousBox && currentBox) {
      if (
        previousBox.x === currentBox.x &&
        previousBox.y === currentBox.y &&
        previousBox.width === currentBox.width &&
        previousBox.height === currentBox.height
      ) {
        return;
      }
    }
    previousBox = currentBox;
  }
}

/**
 * Génère un email unique pour les tests
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}@sivee-test.com`;
}

/**
 * Génère un nom de CV unique
 */
export function generateUniqueCvName(prefix: string = 'Test CV'): string {
  return `${prefix} ${Date.now()}`;
}

/**
 * Nettoie les espaces et caractères spéciaux pour la comparaison
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Attend qu'une requête API soit terminée
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(
    response => response.url().match(urlPattern) !== null && response.status() === 200,
    { timeout: TIMEOUTS.LONG }
  );
}

/**
 * Vérifie si le téléchargement d'un fichier est valide
 */
export async function validateDownload(download: any): Promise<boolean> {
  const path = await download.path();
  const failure = await download.failure();

  return !failure && path !== null;
}

/**
 * Fait un screenshot en cas d'échec
 */
export async function takeScreenshotOnFailure(page: Page, testName: string) {
  await page.screenshot({
    path: `e2e/screenshots/${testName}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Mock les appels API pour les tests isolés
 */
export async function mockApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  response: object
) {
  await page.route(urlPattern, route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Intercepte les erreurs de console
 */
export function setupConsoleErrorListener(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Vérifie qu'aucune erreur JavaScript n'est survenue
 */
export async function assertNoJsErrors(page: Page, errors: string[]) {
  // Filtrer les erreurs connues/acceptables
  const filteredErrors = errors.filter(error => {
    // Ignorer certaines erreurs communes non-bloquantes
    const ignoredPatterns = [
      /Failed to load resource/,
      /favicon/i,
      /ResizeObserver/,
    ];

    return !ignoredPatterns.some(pattern => pattern.test(error));
  });

  expect(filteredErrors).toHaveLength(0);
}

/**
 * Attend que les animations CSS soient terminées
 */
export async function waitForAnimationsComplete(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      const animations = document.getAnimations();
      if (animations.length === 0) {
        resolve();
        return;
      }

      Promise.all(animations.map(a => a.finished))
        .then(() => resolve())
        .catch(() => resolve());
    });
  });
}

/**
 * Scroll vers un élément de manière fluide
 */
export async function smoothScrollTo(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);

  await page.waitForTimeout(500); // Attendre la fin du scroll
}

/**
 * Vérifie si un élément est dans le viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Simule une connexion lente pour les tests de performance
 */
export async function simulateSlowNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // 500 kb/s
    uploadThroughput: (500 * 1024) / 8,
    latency: 400, // 400ms
  });
}

/**
 * Restaure la connexion normale
 */
export async function restoreNetwork(page: Page) {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  });
}
