import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('http://localhost:3001/reviewed-preprints/123');

  // Expect a title "to contain" a substring.
  await expect(page.getByText('Tonight we take over the world!')).toBeVisible();

  // create a locator
  // const getStarted = page.getByRole('link', { name: 'Get started' });
  //
  // // Expect an attribute "to be strictly equal" to the value.
  // await expect(getStarted).toHaveAttribute('href', '/docs/intro');
  //
  // // Click the get started link.
  // await getStarted.click();
  //
  // // Expects the URL to contain intro.
  // await expect(page).toHaveURL(/.*intro/);
});