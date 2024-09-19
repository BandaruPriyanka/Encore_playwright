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
  console.log(`No storage state file found at: ${storageStatePath}, it will be created.`);
}
test.describe('LightHouse Operations', () => {
  let lighthouseLogin, flowsheetSearch;
  test('In this login test, the purpose is to perform the login operation and store the session data, which can be reused for future tests', async ({
    page
  }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetSearch = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await lighthouseLogin.login(
      atob(process.env.lighthouseEmail),
      atob(process.env.lighthousePassword)
    );
    await page.context().storageState({ path: storageStatePath });
  });
});
