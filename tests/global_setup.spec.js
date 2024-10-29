const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const atob = require('atob');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const storageStatePath = path.join(__dirname, '../data/storageState.json');

if (fs.existsSync(storageStatePath)) {
  fs.writeFileSync(storageStatePath, JSON.stringify({}), 'utf-8');
} else {
  test.info(`No storage state file found at: ${storageStatePath}, it will be created.`);
}
test.describe('LightHouse Operations', () => {
  let lighthouseLogin, flowsheetSearch;
  test('Login and store session data for future tests', async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetSearch = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await lighthouseLogin.login(
      atob(process.env.email),
      atob(process.env.password)
    );
    const currentUrl = await page.url();
    if (currentUrl.includes(process.env.lighthouseUrl)) {
      await page.context().storageState({ path: storageStatePath });
    } else {
      test.info(`Skipping session storage for this URL: ${currentUrl}`);
    }
  });
});
