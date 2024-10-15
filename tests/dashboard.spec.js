const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const utilConst = require('../utils/const');
const {
  assertElementVisible,
  assertIsNumber,
  assertElementEnabled,
  assertElementAttributeContains,
  assertElementAttribute
} = require('../utils/helper');
require('dotenv').config();
test.describe('Dashboard', () => {
  let customersPage, flowsheetPage, locationId, locationText;
  test.beforeEach(async ({ page }) => {
    customersPage = new indexPage.DashboardPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
  });
});
