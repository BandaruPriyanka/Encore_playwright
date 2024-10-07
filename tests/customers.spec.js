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
  await test.step('Assert some customers are returned', async () => {
    await assertElementVisible(customersPage.existingCustomers);
  });
  await test.step('Assert customer search input is visible', async () => {
    await assertElementVisible(customersPage.customerSearchInput);
  });
  await customersPage.searchFunctionality();
});
test('Test_C56923: Verify customers calendar', async ({ page }) => {
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await test.step('Assert some customers are returned', async () => {
    await assertElementVisible(customersPage.existingCustomers);
  });
  await customersPage.assertCustomersExist();
  await test.step('Assert calendar div is visible', async () => {
    await assertElementVisible(customersPage.calendarDiv);
  });
  await test.step('Assert next week icon is enabled', async () => {
    await assertElementEnabled(customersPage.nextweekIcon);
  });
  await test.step('Assert previous week icon is enabled', async () => {
    await assertElementEnabled(customersPage.previousweekIcon);
  });
  await customersPage.assertCalendarHasDates();
});
test('Test_C56924 : Verify test data on customer card', async ({ page }) => {
  await customersPage.verifyCustomerCardContent();
  await customersPage.assertTabNames();
  await test.step('Verify touchpoints pie icons should not be clickable from the customers page', async () => {
    await assertElementAttributeContains(customersPage.touchpointPieIcon(indexPage.navigator_data.order_name), 'class', 'mr-2');
  });
});
test('Test_C56925 : Verify details tab', async () => {
  await customersPage.verifyDetailsTab();
});
test('Test_C56926: Verify contacts tab', async () => {
  await customersPage.checkNoContactsDisplayed();
});
test('Test_C56928 : Verify room list tab', async () => {
  await customersPage.verifyRoomTab();
  await test.step('The Room List Tab should be highlighted', async () => {
    await assertElementAttributeContains(
      customersPage.dynamicTabElement(utilConst.Const.tabNames[3]),
      'class',
      'purple'
    );
  });
  await customersPage.selectRoomList();
  await test.step('Verify User is redirected to the Flowsheets page with the selected Room details expanded', async () => {
    await assertElementVisible(customersPage.flowsheetDetailsDiv);
  });
});
test('Test_C56927: Verify Touchpoints Tab', async () => {
  await customersPage.assertTouchPointTab();
  await customersPage.addFirstTouchPoint();
  await customersPage.addSecondTouchPoint();
  await customersPage.addRemainingTouchPoints();
  await customersPage.assertEditIcon();
  await customersPage.assertTouchPointForFuture();
});
});