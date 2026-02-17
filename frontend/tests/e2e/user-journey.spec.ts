import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate a unique email for each test run to avoid conflicts
function randomEmail(): string {
  const id = Math.random().toString(36).substring(2, 10)
  return `e2e-test-${id}@test.sivee.pro`
}

// Password that satisfies all 5 rules: 12+ chars, uppercase, lowercase, digit, special char
const TEST_PASSWORD = 'E2eTest!2024xx'

test.describe('User Journey: Register, Import PDF, Preview, Export', () => {
  test('full user journey', async ({ page }) => {
    const testEmail = randomEmail()

    // 1. Navigate to home — should see AuthPage (login form)
    await page.goto('/')
    await expect(page.locator('form')).toBeVisible()

    // 2. Click "Create an account" link to switch to register mode
    await page.getByTestId('switch-to-register').click()

    // 3. Fill registration form
    await page.getByTestId('register-email').fill(testEmail)
    await page.getByTestId('register-password').fill(TEST_PASSWORD)
    await page.getByTestId('register-confirm-password').fill(TEST_PASSWORD)

    // 4. Accept terms checkbox — click the parent label since the input is sr-only
    await page.getByTestId('register-terms-checkbox').evaluate((el: HTMLInputElement) => {
      el.click()
    })

    // 5. Submit registration
    await page.getByTestId('register-submit').click()

    // 6. Wait for auto-login and redirect to landing page
    // After registration, a success message appears, then auto-login redirects
    await expect(page).toHaveURL('/', { timeout: 15_000 })
    // Landing page should have the import button
    await expect(page.getByTestId('import-pdf-landing')).toBeVisible({ timeout: 10_000 })

    // 7. Import a PDF from the landing page
    const samplePdf = path.resolve(__dirname, 'fixtures/sample.pdf')

    // The file input is hidden — we need to set files on it before clicking the button
    const fileInput = page.locator('input[type="file"][accept=".pdf"]').first()
    await fileInput.setInputFiles(samplePdf)

    // 8. Wait for import to complete — the editor should load with sections
    // After import, the app transitions from landing to the editor view
    await expect(page.getByTestId('cv-preview')).toBeVisible({ timeout: 30_000 })

    // 9. Verify CV preview frame is visible (PDF rendered in object/iframe)
    await expect(page.getByTestId('cv-preview-frame')).toBeVisible({ timeout: 15_000 })

    // 10. Click "Export to PDF" and verify download triggers
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 })
    await page.getByTestId('export-pdf').click()
    const download = await downloadPromise

    // Verify the download has a filename (PDF was generated)
    expect(download.suggestedFilename()).toBeTruthy()
  })
})
