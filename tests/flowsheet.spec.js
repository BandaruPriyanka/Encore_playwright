const { test, expect } = require('@playwright/test');
const indexPage = require("../utils/index.page");
const {assertElementVisible,assertEqualValues}=require("../utils/helper")
const atob = require("atob");
require("dotenv").config();

test.describe('LightHouse Operations', () => {
  let lighthouseLogin, flowsheetSearch;

  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetSearch = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout),
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56882 Verify lighthouse flowsheet search functionality', async ({ page }) => {
    await lighthouseLogin.login(
      atob(process.env.lighthouseEmail),
      atob(process.env.lighthousePassword)
    );
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    await assertElementVisible(flowsheetSearch.searchInput);
    await flowsheetSearch.checkingSearchFunctionality();
  });
});
