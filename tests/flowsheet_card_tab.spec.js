const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { assertElementVisible, assertElementContainsText } = require('../utils/helper');
const utilConst = require('../utils/const');
require('dotenv').config();

test.describe('LightHouse Flowsheet card and tab operations', () => {
  let flowsheetCardAndTab, flowsheetPage, locationId, locationText;

  test.beforeEach(async ({ page }) => {
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56890 :Verify test data on flowsheet card', async () => {
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

  test('Test_C56910: Verify contacts tab', async ({ page }) => {
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
  test('Test_C56891: Verify Test Mood change logic', async () => {
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
  test('Test_C56894: Verify Test Touchpoint adding', async () => {
    await flowsheetCardAndTab.assertTouchPointIndicator(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertSecondItemInTouchPoint();
    await flowsheetCardAndTab.assertRemainingItemsInTouchPoint();
    await flowsheetCardAndTab.assertCustomerUrl();
  });

  test('Test_C56908 : Verify Notes Tab', async () => {
    await flowsheetCardAndTab.assertNotesTab(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertFlowsheetTextAndNavigatorText();
  });

  test('Test_C56907: Verify Equipment Tab', async () => {
    await flowsheetCardAndTab.assertEquipmentTab(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertEquipmentsInLightHouseAndNavigator();
    await flowsheetCardAndTab.assertEquipmentCheckList();
    await flowsheetCardAndTab.assertCheckBox();
    await flowsheetCardAndTab.assertEquipmentByDescription();
    await flowsheetCardAndTab.assertEquipmentByName();
  });

  test('Test_C56904: Verify Test Add-on creation (Docusign enabled) - Positive flow', async () => {
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.positive);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await flowsheetCardAndTab.assertStatusOfNavigatorJob(indexPage.lighthouse_data.positive);
  });

  test('Test_C56906: Verify Test Add-on creation (Docusign enabled) - Negative flow', async () => {
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.negative);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await flowsheetCardAndTab.assertStatusOfNavigatorJob(indexPage.lighthouse_data.negative);
  });
});
