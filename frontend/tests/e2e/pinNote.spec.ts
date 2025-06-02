import { test, expect } from '@playwright/test';

test('creates a pinned note and verifies it appears under 📌 Pinned', async ({ page }) => {
  // 1. Visit frontend
  await page.goto('http://localhost:3000');

  await page.click('text=Login');

  // 2. Login
  await page.fill('input[placeholder="Email"]', 'valion@example.com');
  await page.fill('input[placeholder="Password"]', 'notethat123');
  await page.click('button:has-text("Login")');

  // 3. Wait for dashboard/home
  await expect(page.locator('text=Your Notes')).toBeVisible();

  // 4. Click New Note
  await page.click('button:has-text("New Note")');

  // 5. Fill out note fields
  await page.fill('input[placeholder="📌 Title"]', 'Pinned Note E2E');
  await page.fill('textarea[placeholder="📝 Content"]', 'This note is pinned');

  // 6. Select category and color
  await page.selectOption('select', { label: 'Personal' }); // category dropdown
  await page.selectOption('select:nth-of-type(2)', { label: 'Blue' }); // color dropdown

  // 7. Enter tags
  await page.fill('input[placeholder="🏷️ Tags (comma separated)"]', 'e2e,test');

  // 8. Check pin box
  await page.check('input[type="checkbox"]');

  // 9. Save
  await page.click('button:has-text("Save")');

  // 10. Check for the note under the 📌 Pinned section
  await expect(page.locator('text=📌 Pinned')).toBeVisible();
  await expect(
    page.locator('div:has(h2:has-text("📌 Pinned")) >> h3', { hasText: 'Pinned Note E2E' })
  ).toBeVisible();
    await expect(
    page.locator('p', { hasText: 'This note is pinned' }).first()
  ).toBeVisible();
  });