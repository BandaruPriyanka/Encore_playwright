const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
const { assertElementVisible, assertElementNotVisible } = require('../utils/helper');
test.describe('Performing actions on Location Profile Tab', () => {
  let locationProfilePage, flowsheetPage, locationId, locationText, flowsheetCardAndTab;

  test.beforeEach(async ({ page }) => {
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationProfilePage = new indexPage.LocationProfile(page);
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await locationProfilePage.clickOnLocationProfile();
  });
  test('TC_C57119 : Verify Location Profile page elements', async () => {
    await locationProfilePage.verifyTabs();
  });
  test('TC_C57120 : Verify Use Equipment Checklist functionality', async () => {
    await locationProfilePage.assertEquipmentCheckList();
    await flowsheetCardAndTab.assertCheckBox();
    await test.step('Verify that the "Select All checkbox" is not visible', async () => {
      await assertElementNotVisible(locationProfilePage.selectAllCheckBox);
    });
  });
});
