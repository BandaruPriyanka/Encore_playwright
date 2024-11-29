const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const utilConst = require('../utils/const');
const {
  assertElementVisible,
  assertElementEnabled,
  assertElementAttributeContains,
} = require('../utils/helper');
require('dotenv').config();
test.describe('Performing actions on Customer Tab', () => {
  let customersPage, flowsheetPage, locationId, locationText,second_locationId,second_locationText;
  test.beforeEach(async ({ page }) => {
    customersPage = new indexPage.CustomersPage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    second_locationId=indexPage.lighthouse_data.locationId_createData2
    second_locationText=indexPage.lighthouse_data.locationText_createData2
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await customersPage.clickOnCustomerIcon();
  });

  test('Test_C56920 : Verify customer search', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      customersPage.existingCustomers,
      'Assert some customers are returned'
    );
    await assertElementVisible(
      customersPage.customerSearchInput,
      'Assert customer search input is visible'
    );
    await customersPage.searchFunctionality();
  });
  test('Test_C56923: Verify customers calendar', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      customersPage.existingCustomers,
      'Assert some customers are returned'
    );
    await customersPage.assertCustomersExist();
    await assertElementVisible(customersPage.calendarDiv, 'Assert calendar div is visible');
    await assertElementEnabled(customersPage.nextweekIcon, 'Assert next week icon is enabled');
    await assertElementEnabled(
      customersPage.previousweekIcon,
      'Assert previous week icon is enabled'
    );
    await customersPage.assertCalendarHasDates();
  });
  test('Test_C57158 : Verify change location', async () => {
    await flowsheetPage.changeLocation(second_locationId, second_locationText);
    try{
      await assertElementVisible(customersPage.customerList,'Verify list of customers for the selected location');
    }
    catch{
      test.info('No customers were available for that location and date')
    }
    await flowsheetPage.changeLocation(locationId, locationText);
    await assertElementVisible(customersPage.customerList,'Verify original list of customers should appear');
  });
  test('Test_C56924 : Verify test data on customer card', async () => {
    await customersPage.verifyCustomerCardContent();
    await customersPage.assertTabNames();
  });
  test('Test_C56925 : Verify details tab', async () => {
    await customersPage.verifyDetailsTab();
  });
  test('Test_C56926: Verify contacts tab', async () => {
    await customersPage.checkNoContactsDisplayed();
  });
  test('Test_C56928 : Verify room list tab', async () => {
    await customersPage.verifyRoomTab();
    await assertElementAttributeContains(
      customersPage.dynamicTabElement(utilConst.Const.tabNames[3]),
      'class',
      'purple',
      'The Room List Tab should be highlighted'
    );
    await customersPage.selectRoomList();
    await assertElementVisible(
      customersPage.flowsheetDetailsDiv,
      'Verify User is redirected to the Flowsheets page with the selected Room details expanded'
    );
  });
  test('Test_C56927: Verify Touchpoints Tab', async () => {
    await customersPage.assertTouchPointTab();
    await customersPage.addFirstTouchPoint();
    await customersPage.addSecondTouchPoint();
    await customersPage.addRemainingTouchPoints();
    await customersPage.assertEditIcon();
    await customersPage.assertTouchPointForFuture();
  });
  test('Test_C56929: Verify Previous Events Tab', async () => {
    await customersPage.verifyPreviousEventTab();
  });
});
