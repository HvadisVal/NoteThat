import { test, expect } from '@playwright/test';

test('shows error on failed login', async ({ page }) => {
  // 1. Go to landing page
  await page.goto('http://localhost:3000');

  // 2. Click Login button
  await page.click('text=Login');
  
  // 3. Enter incorrect credentials
  await page.fill('input[placeholder="Email"]', 'wrong@example.com');
  await page.fill('input[placeholder="Password"]', 'wrongpassword');

  // 4. Submit login form
  await page.click('button:has-text("Login")');

  // 5. Expect an error message
  await expect(page.locator('text=Email or password is incorrect.')).toBeVisible();
});