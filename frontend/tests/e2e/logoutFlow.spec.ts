import { test, expect } from '@playwright/test';

test('logs out and redirects to landing page', async ({ page }) => {
  // 1. Go to landing page and click Login
  await page.goto('https://notethat-lw82.onrender.com');
  await page.click('text=Login');

  // 2. Fill in login credentials
  await page.fill('input[placeholder="Email"]', 'valion@example.com');
  await page.fill('input[placeholder="Password"]', 'notethat123');

  // 3. Submit login form and wait for redirect to /home
  await Promise.all([
    page.waitForURL('**/home'),
    page.click('button:has-text("Login")'),
  ]);

  // 4. Assert user has reached the home page
  await expect(page.locator('text=Your Notes')).toBeVisible();

  // 5. Click the user avatar icon to trigger logout
  await page.click('button >> i.fas.fa-user');

  // 6. Verify redirect back to landing page
  await expect(page).toHaveURL('https://notethat-lw82.onrender.com');
  await expect(page.locator('text=Welcome to NoteThat')).toBeVisible();
});
