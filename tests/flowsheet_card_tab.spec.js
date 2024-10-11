const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertElementContainsText,
  checkVisibleElementColors,
  assertElementNotVisible
} = require('../utils/helper');
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

  test.only('Test_C56890 :Verify test data on flowsheet card', async () => {
    await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.validateRoomCard(
      indexPage.navigator_data.roomName,
      indexPage.navigator_data.order_name,
      indexPage.opportunity_data.endUserAccount
    );
    for (const tabText of indexPage.lighthouse_data.flowsheetTabs) {
      await assertElementVisible(
        flowsheetCardAndTab.flowsheetTabElement(tabText),
        'Verify that the flowsheet tab: ' + tabText + ' is displayed'
      );
    }
  });

  test.only('Test_C56910: Verify contacts tab', async ({ page }) => {
    await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
    await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
    await assertElementVisible(
      flowsheetCardAndTab.flowsheetTabElement(utilConst.Const.Contacts),
      'Verify the "Contacts" flowsheet tab is visible'
    );
    await flowsheetCardAndTab.clickOnContactAndValidate();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementContainsText(
      flowsheetCardAndTab.textInModal,
      indexPage.lighthouse_data.contactModalText,
      `Verify the modal contains the text: "${indexPage.lighthouse_data.contactModalText}"`
    );
  });
  test('Test_C56891: Verify Test Mood change logic', async () => {
    await flowsheetCardAndTab.assertMoodChangeHappyIcon(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await assertElementVisible(
      flowsheetCardAndTab.logMsg(utilConst.Const.happyLogMsg),
      `Verify the appropriate log record was created. log msg : "${utilConst.Const.happyLogMsg}" `
    );
    await flowsheetCardAndTab.assertMoodChangeNeutralIcon(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertMoodChangeAngryIcon();
  });
  test('Test_C56894: Verify Test Touchpoint adding', async ({ page }) => {
    await flowsheetCardAndTab.assertTouchPointIndicator(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await test.step('Check if the first touch point item has the expected color of green', async () => {
      await checkVisibleElementColors(
        page,
        flowsheetCardAndTab.touchPointItems(1),
        'rgb(23, 181, 57)'
      );
    });
    await flowsheetCardAndTab.assertSecondItemInTouchPoint();
    await test.step('Verify the color of the second touch point item is yellow', async () => {
      await checkVisibleElementColors(
        page,
        flowsheetCardAndTab.touchPointItems(2),
        'rgb(244, 235, 0)'
      );
    });
    await flowsheetCardAndTab.assertRemainingItemsInTouchPoint();
    await flowsheetCardAndTab.assertCustomerUrl();
    await test.step('Verify the color of the first touch point icon is green', async () => {
      await checkVisibleElementColors(
        page,
        flowsheetCardAndTab.firstTouchPointIcon,
        'rgb(23, 181, 57)'
      );
    });
    await test.step('Verify the color of the second touch point icon is yellow', async () => {
      await checkVisibleElementColors(
        page,
        flowsheetCardAndTab.secondTouchPointIcon,
        'rgb(244, 235, 0)'
      );
    });
  });

  test.only('Test_C56908 : Verify Notes Tab', async () => {
    await flowsheetCardAndTab.assertNotesTab(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertFlowsheetTextAndNavigatorText();
  });

  test.only('Test_C56907: Verify Equipment Tab', async () => {
    await flowsheetCardAndTab.assertEquipmentTab(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await flowsheetCardAndTab.assertEquipmentsInLightHouseAndNavigator();
    await flowsheetCardAndTab.assertEquipmentCheckList();
    await flowsheetCardAndTab.assertCheckBox();
    await assertElementNotVisible(
      flowsheetCardAndTab.selectAllCheckBox,
      'Verify that the "Select All checkbox" is not visible'
    );
    await flowsheetCardAndTab.assertEquipmentByDescription();
    await flowsheetCardAndTab.assertEquipmentByName();
  });

  test('Test_C56904: Verify Test Add-on creation (Docusign enabled) - Positive flow', async ({
    page
  }) => {
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      flowsheetCardAndTab.textInModalForDocument,
      'Verify that the "pass control" modal is visible'
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.positive);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await flowsheetCardAndTab.assertStatusOfNavigatorJob(indexPage.lighthouse_data.positive);
  });

  test('Test_C56906: Verify Test Add-on creation (Docusign enabled) - Negative flow', async ({page}) => {
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.textInModalForDocument,
      'Verify that the text in the document modal is visible'
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.negative);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await flowsheetCardAndTab.assertStatusOfNavigatorJob(indexPage.lighthouse_data.negative);
  });

  test('Verify complimentary job', async ({ page }) => {
    await flowsheetPage.changeLocation(
      indexPage.lighthouse_data.locationId_createData1,
      indexPage.lighthouse_data.locationText_createData1
    );
    await flowsheetCardAndTab.createAddOnForComplimentaryJob(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no_complimentary,
      indexPage.navigator_data.second_job_no_complimentary
    );
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      flowsheetCardAndTab.textInModalForDocument,
      'Verify that the "pass control" modal is visible'
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.negative);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
  });
});
