const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
const {
  assertElementVisible,
  assertElementNotVisible,
  invalidDiscountGenerator,
  validDiscountGenerator,
  assertEqualValues
} = require('../utils/helper');
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
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await locationProfilePage.clickOnLocationProfile();
  });
  test('Test_C57119 : Verify Location Profile page elements', async () => {
    await locationProfilePage.verifyTabs();
  });
  test('Test_C57120 : Verify Use Equipment Checklist functionality', async () => {
    await locationProfilePage.assertEquipmentCheckList();
    await flowsheetCardAndTab.assertCheckBox();
    await assertElementNotVisible(
      locationProfilePage.selectAllCheckBox,
      'Verify that the "Select All checkbox" is not visible'
    );
  });
  test("Test_C57122: Verify 'Use Docusign' functionality", async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no,
      false
    );
    await assertElementVisible(
      flowsheetCardAndTab.textInModalForDocument,
      'Verify that the "pass control" modal is visible'
    );
    await page.goBack();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    const flowsheet = new indexPage.FlowSheetPage(page);
    await flowsheet.changeLocation(
      indexPage.lighthouse_data.locationId_createData2,
      indexPage.lighthouse_data.locationText_createData2
    );
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
    await flowsheetCardAndTab.discountChecking(
      invalidDiscountGenerator(),
      validDiscountGenerator(),
      false
    );
    await flowsheetCardAndTab.dateSelectModalCheckingAndAssertRooms();
  });
  test.describe('Flowsheets Groups Tab ', () => {
    test("Test_C57126 Check 'Flowsheets Groups' Tab elements", async () => {
      await test.step("Check the 'Flowsheets Groups' page structure", async () => {
        await locationProfilePage.verifyAddOnesEmailRecipients();
      });
      await test.step('Make sure that all added Groups can be removed from the list (remove icon is present)', async () => {
        await locationProfilePage.verifyGroupsCanBeRemoved();
      });
    });

    test('Test_C57127: Check Adding Groups functionality', async () => {
      await locationProfilePage.clickOnFlowsheetGroups();
      await locationProfilePage.addingGroupFunctionality();
    });

    test('Test_C57128 : Check Removing Groups functionality', async () => {
      await locationProfilePage.clickOnFlowsheetGroups();
      await locationProfilePage.removingGroupFunctionality();
    });

    test('Test_C57129 Check Expiration Groups functionality - WIP', async () => {
      await locationProfilePage.clickOnFlowsheetGroups();
      const headerText = await locationProfilePage.headerTitle.textContent();
      await assertEqualValues(
        headerText,
        indexPage.lighthouse_data.flowsheetGroups,
        "Verify that the 'Flowsheet Groups' page should be opened"
      );
      await locationProfilePage.assertAddGroup();
      await locationProfilePage.assertAddedGroup();
    });
  });

  test('Test_C57123 Check "Add Ons Email Recipients" Tab elements', async () => {
    await locationProfilePage.verifyAddOnsEmailRecipientsElements();
  });

  test('Test_C57124: Verify Adding emails functionality', async ({ page }) => {
    await locationProfilePage.assertEmailRecipients();
    await locationProfilePage.assertEmailInput();
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no,
      false
    );
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      flowsheetCardAndTab.textInModalForDocument, 
      'Verify that the "pass control" modal is visible'
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.positive);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C57125 :Verify Removing emails functionality', async ({ page }) => {
    await locationProfilePage.assertEmailRecipients();
    await locationProfilePage.deleteEmail();
    await flowsheetCardAndTab.createAddOn(
      indexPage.lighthouse_data.turnOn,
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no,
      false
    );
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      flowsheetCardAndTab.textInModalForDocument,
      'Verify that the "pass control" modal is visible'
    );
    await flowsheetCardAndTab.assertDocument(indexPage.lighthouse_data.positive);
    await flowsheetCardAndTab.assertRoomCountAfterAddOn();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C57121 Check "Notify us of job changes" functionality', async () => {
    await locationProfilePage.initialNotifyDays();
    await locationProfilePage.notifyUsDateChangeForInitialValue();
    await locationProfilePage.changeTheDayInNotifyUs();
    await locationProfilePage.assertNotificationForDateChange();
    await locationProfilePage.assertNotifyUsValueAfterReload();
    await locationProfilePage.setNotifyUsValueToInitalValue();
  });
});
