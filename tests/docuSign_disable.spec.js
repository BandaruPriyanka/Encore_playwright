const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { invalidDiscountGenerator, validDiscountGenerator } = require('../utils/helper');
require('dotenv').config();

let flowsheetCardAndTab, flowsheetPage, locationId, locationText;

test.beforeEach(async ({ page }) => {
  flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
  flowsheetPage = new indexPage.FlowSheetPage(page);
  locationId = indexPage.lighthouse_data.locationId_createData2;
  locationText = indexPage.lighthouse_data.locationText_createData2;
  await page.goto(process.env.lighthouseUrl, {
    timeout: parseInt(process.env.pageload_timeout)
  });
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await flowsheetPage.changeLocation(locationId, locationText);
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
});

test('Test_C56895: Verify Add-on creation (Docusign disabled)', async () => {
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
});

test('Test_C56892: Verify Comparison with previous jobs logic', async () => {
  await flowsheetCardAndTab.assertComparisonIcon(
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
  await flowsheetCardAndTab.comparisonIconFunctionality();
});

test('Test_C56909 : Verify Logs Tab', async () => {
  await flowsheetCardAndTab.assertCommentSectionInLOg(
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2
  );
  await flowsheetCardAndTab.assertLogAfterAddOn(
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
});
