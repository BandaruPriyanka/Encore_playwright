const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
const { assertElementVisible, assertElementNotVisible, invalidDiscountGenerator, validDiscountGenerator } = require('../utils/helper');
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
  test("Test_C57122 Check 'Use Docusign' functionality",async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await test.step('Verify that the "pass control" modal is visible', async () => {
      await assertElementVisible(flowsheetCardAndTab.textInModalForDocument);
    });
    await page.goBack();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    const flowsheet = new indexPage.FlowSheetPage(page);
    await flowsheet.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await flowsheetCardAndTab.verifyDocusignStatus(
    indexPage.lighthouse_data.turnOff,
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2
  );
  await flowsheetCardAndTab.addOnFunction(
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
  await flowsheetCardAndTab.discountChecking(invalidDiscountGenerator(), validDiscountGenerator());
  await flowsheetCardAndTab.dateSelectModalCheckingAndAssertRooms();
  })
});
