const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
test.describe('Performing actions on Dashboard Page', () => {
  let dashboardPage, flowsheetPage, locationId, locationText;
  test.beforeEach(async ({ page }) => {
    dashboardPage = new indexPage.DashboardPage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
  });

  test('Test_C57130 : Check Adding widgets functionality', async () => {
    await dashboardPage.navigateToDashboard();
    await dashboardPage.addingWidgets();
  });

  test('Test_C57150 : Check Removing widgets functionality', async () => {
    await dashboardPage.navigateToDashboard();
    await dashboardPage.removeWidgets();
  });
});
