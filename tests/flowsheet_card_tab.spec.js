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

test.describe('LightHouse Flowsheet card and tab operations', () => {
  let lighthouseLogin, flowsheetCardAndTab;

  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56890 Verify test data on flowsheet card', async ({ page }) => {
    await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.validateRoomCard(
      indexPage.navigator_data.roomName,
      indexPage.navigator_data.order_name,
      indexPage.opportunity_data.endUserAccount
    );
    for (const tabText of indexPage.lighthouse_data.flowsheetTabs) {
      await assertElementVisible(flowsheetCardAndTab.flowsheetTabElement(tabText));
    }
  });

  test('Test_C56910 verify contacts tab', async ({ page }) => {
    await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
    await assertElementVisible(flowsheetCardAndTab.flowsheetTabElement(utilConst.Const.Contacts));
    await flowsheetCardAndTab.clickOnContactAndValidate();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementContainsText(
      flowsheetCardAndTab.textInModal,
      indexPage.lighthouse_data.contactModalText
    );
  });

  test('Test_C56895 Add-on creation (Docusign disabled)', async ({ page }) => {
    await flowsheetCardAndTab.verifyDocusignStatus(
      indexPage.lighthouse_data.docusignOff,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.addOnFunction(
      indexPage.lighthouse_data.requestedBy,
      indexPage.lighthouse_data.individualProduct,
      indexPage.lighthouse_data.packageProduct,
      indexPage.lighthouse_data.invalidQuantity,
      indexPage.lighthouse_data.validQuantity
    );
    await flowsheetCardAndTab.discountChecking(invalidDiscountGenerator(),validDiscountGenerator());
    await flowsheetCardAndTab.dateSelectModalChecking();
  });

  test('Test_C56892 Test Comparison with previous jobs logic' , async() => {
    await flowsheetCardAndTab.assertComparisonIcon(indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no,
      indexPage.lighthouse_data.requestedBy,
      indexPage.lighthouse_data.individualProduct,
      indexPage.lighthouse_data.packageProduct,
      indexPage.lighthouse_data.invalidQuantity,
      indexPage.lighthouse_data.validQuantity
    );
    await flowsheetCardAndTab.comparisonIconFunctionality();
  })
});
