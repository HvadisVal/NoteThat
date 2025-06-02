import { expect, test } from '@playwright/test';

const noteTitle = `E2E Note Title ${Date.now()}`;
const noteContent = `E2E Note Content ${Date.now()}`;

// Helper for debugging delay
const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

test('user can log in and create a note', async ({ page }) => {
  await page.goto('https://notethat-lw82.onrender.com');

  // 1. Click login button from landing
  await page.click('text=Login');

  // 2. Fill login form
  await page.fill('input[name="email"]', 'e2e@user.com');
  await page.fill('input[name="password"]', 'e2epassword');

  // 3. Submit and wait for redirect
  await Promise.all([
    page.waitForURL('**/home'),
    page.click('button:has-text("Login")')
  ]);

  // 4. Wait for dashboard to load
  await expect(page.locator('text=Your Notes')).toBeVisible();

  // 5. Click "New Note"
  await page.click('button:has-text("New Note")');

  // 6. Fill title + content
  await page.fill('input[name="title"]', noteTitle);
  await page.fill('textarea[name="content"]', noteContent);

  // 7. Submit
  await page.click('button:has-text("Save")');

  // Add wait in case DB write takes time
  await wait(3000);

  // 8. Verify result
  await expect(page.locator(`text=${noteTitle}`)).toBeVisible();
  await expect(page.locator(`text=${noteContent}`)).toBeVisible();
});
