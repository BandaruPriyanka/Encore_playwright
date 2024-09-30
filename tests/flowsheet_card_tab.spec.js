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

  test('Test_C56890 Verify test data on flowsheet card', async ({ page }) => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
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
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
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
  test('Test_C56891 Test Mood change logic', async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await flowsheetCardAndTab.assertMoodChangeHappyIcon(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertMoodChangeNeutralIcon(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertMoodChangeAngryIcon();
  });
  test('Test_C56894 Test Touchpoint adding', async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await flowsheetCardAndTab.assertTouchPointIndicator(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertSecondItemInTouchPoint();
    await flowsheetCardAndTab.assertRemainingItemsInTouchPoint();
    await flowsheetCardAndTab.assertCustomerUrl();
  });

  test('Test_C56908 Notes Tab', async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await flowsheetCardAndTab.assertNotesTab(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertFlowsheetTextAndNavigatorText();
  });

  test('Test_C56907 Equipment Tab' , async () => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await flowsheetCardAndTab.assertEquipmentTab(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.assertEquipmentsInLightHouseAndNavigator();
    await flowsheetCardAndTab.assertEquipmentCheckList();
    await flowsheetCardAndTab.assertCheckBox();
    await flowsheetCardAndTab.assertEquipmentByDescription();
    await flowsheetCardAndTab.assertEquipmentByName();
  });
});
