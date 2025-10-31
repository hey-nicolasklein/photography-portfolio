import { test, expect } from '@playwright/test';

test.describe('Semantic Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/semantic-chat');
  });

  test('should load the semantic chat page', async ({ page }) => {
    await expect(page).toHaveTitle(/Nicolas Klein/);
    await expect(page.locator('h2:has-text("Chat")')).toBeVisible();
    await expect(page.locator('h2:has-text("Image Canvas")')).toBeVisible();
  });

  test('should show example query bubbles', async ({ page }) => {
    // Check if example queries are visible
    await expect(page.locator('button:has-text("Show me wedding photos")')).toBeVisible();
    await expect(page.locator('button:has-text("Display gallery images")')).toBeVisible();
    await expect(page.locator('button:has-text("Find story images")')).toBeVisible();
    await expect(page.locator('button:has-text("Show all portfolio photos")')).toBeVisible();
  });

  test('should enable send button when typing in input', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask me to show you photos"]');
    const sendButton = page.locator('button[type="submit"]');

    // Initially, button should be disabled (no input)
    await expect(sendButton).toBeDisabled();

    // Type in the input
    await input.fill('Show me wedding photos');

    // Wait a bit for React state to update
    await page.waitForTimeout(100);

    // Button should now be enabled
    await expect(sendButton).toBeEnabled();

    // Clear the input
    await input.clear();

    // Wait a bit for React state to update
    await page.waitForTimeout(100);

    // Button should be disabled again
    await expect(sendButton).toBeDisabled();
  });

  test('should allow typing in the input field', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask me to show you photos"]');

    await input.fill('test query');
    await expect(input).toHaveValue('test query');
  });

  test('should handle example bubble click', async ({ page }) => {
    const exampleButton = page.locator('button:has-text("Show me wedding photos")').first();
    const input = page.locator('input[placeholder*="Ask me to show you photos"]');

    // Click the example bubble
    await exampleButton.click();

    // Wait for potential state changes
    await page.waitForTimeout(500);

    // Check if messages appear in the chat (user message should be added)
    // Even if the API fails, the user message should be visible
    const userMessage = page.locator('.bg-black.text-white:has-text("Show me wedding photos")');
    await expect(userMessage).toBeVisible({ timeout: 5000 });
  });

  test('should submit message when send button is clicked', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask me to show you photos"]');
    const sendButton = page.locator('button[type="submit"]');

    // Type a message
    await input.fill('test query');

    // Click send button
    await sendButton.click();

    // Wait for the message to appear in chat
    await page.waitForTimeout(500);

    // Check if user message appears
    const userMessage = page.locator('.bg-black.text-white:has-text("test query")');
    await expect(userMessage).toBeVisible({ timeout: 5000 });

    // Input should be cleared after sending
    await expect(input).toHaveValue('');
  });

  test('should show loading state when submitting', async ({ page }) => {
    const input = page.locator('input[placeholder*="Ask me to show you photos"]');
    const sendButton = page.locator('button[type="submit"]');

    // Type a message
    await input.fill('test query');

    // Click send button
    await sendButton.click();

    // Loading spinner should appear briefly
    const loadingSpinner = page.locator('button[type="submit"] svg.animate-spin');
    await expect(loadingSpinner).toBeVisible({ timeout: 1000 });
  });
});
