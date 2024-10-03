const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertIsNumber,
  assertElementEnabled,
  assertElementAttributeContains
} = require('../utils/helper');
require('dotenv').config();

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
});

test('Test_C56920 : Verify customer search', async ({ page }) => {
  await customersPage.clickOnCustomerIcon();
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await assertElementVisible(customersPage.customerSearchInput);
  await customersPage.searchFunctionality();
});
test('Test_C5692 : Verify customers calendar', async ({ page }) => {
  await customersPage.clickOnCustomerIcon();
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await customersPage.assertCustomersExist();
  await assertElementVisible(customersPage.calendarDiv);
  await assertElementEnabled(customersPage.nextweekIcon);
  await assertElementEnabled(customersPage.previousweekIcon);
  await customersPage.assertCalendarHasDates();
});
test('Test_C56924 : Verify test data on customer card', async () => {
  await customersPage.clickOnCustomerIcon();
  await customersPage.verifyCustomerCardContent();
  await customersPage.assertTabNames();
});
test('Test_C56925 : Verify details tab', async () => {
  await customersPage.clickOnCustomerIcon();
  await customersPage.verifyDetailsTab();
});
test('Test_C56926: Verify contacts tab', async () => {
  await customersPage.clickOnCustomerIcon();
  await customersPage.checkNoContactsDisplayed();
});
test('Test_C56928 : Verify room list tab', async () => {
  await customersPage.clickOnCustomerIcon();
  await customersPage.verifyRoomTab();
  await assertIsNumber(customersPage.roomsqty);
  await customersPage.selectRoomList();
  await assertElementVisible(customersPage.flowsheetDetailsDiv);
  await assertElementAttributeContains(customersPage.flowsheetTab, 'class', 'text-purple');
});
test('Test_C56927: Verify Touchpoints Tab', async () => {
  await customersPage.assertTouchPointTab();
  await customersPage.addFirstTouchPoint();
  await customersPage.addSecondTouchPoint();
  await customersPage.addRemainingTouchPoints();
  await customersPage.assertEditIcon();
  await customersPage.assertTouchPointForFuture();
});
