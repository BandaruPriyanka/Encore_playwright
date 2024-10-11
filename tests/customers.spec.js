const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const utilConst = require('../utils/const');
const {
  assertElementVisible,
  assertIsNumber,
  assertElementEnabled,
  assertElementAttributeContains,
  assertElementAttribute
} = require('../utils/helper');
require('dotenv').config();
test.describe('Performing actions on Customer Tab', () => {
  let customersPage, flowsheetPage, locationId, locationText;
  test.beforeEach(async ({ page }) => {
    customersPage = new indexPage.CustomersPage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
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
  test.only('Test_C56923: Verify customers calendar', async ({ page }) => {
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
  test('Test_C56924 : Verify test data on customer card', async ({ page }) => {
    await customersPage.verifyCustomerCardContent();
    await customersPage.assertTabNames();
    const roomName = await customersPage.getRoomName.textContent();
    await assertElementAttributeContains(
      customersPage.touchpointPieIcon(roomName),
      'class',
      'mr-2',
      'Verify touchpoints pie icons should not be clickable from the customers page'
    );
  });
  test.only('Test_C56925 : Verify details tab', async () => {
    await customersPage.verifyDetailsTab();
  });
  test.only('Test_C56926: Verify contacts tab', async () => {
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
  test.only('Test_C56929: Verify Previous Events Tab', async () => {
    await customersPage.verifyPreviousEventTab();
  });
});
