const { test, expect } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertEqualValues,
  assertElementContainsText,
  invalidDiscountGenerator,
  validDiscountGenerator
} = require('../utils/helper');
const utilConst = require('../utils/const');
const atob = require('atob');
require('dotenv').config();

let lighthouseLogin, flowsheetCardAndTab,flowsheetPage;

  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56895 Add-on creation (Docusign disabled)', async ({ page }) => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
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
    await flowsheetCardAndTab.discountChecking(
      invalidDiscountGenerator(),
      validDiscountGenerator()
    );
    await flowsheetCardAndTab.dateSelectModalCheckingAndAssertRooms();
  });

  test('Test_C56892 Test Comparison with previous jobs logic', async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
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

  test('Test_C56909 Logs Tab', async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
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