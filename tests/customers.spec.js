const { test, expect } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertEqualValues,
  assertIsNumber,
  assertElementEnabled
} = require('../utils/helper');
const atob = require('atob');
require('dotenv').config();

let lighthouseLogin, customersPage;
test.beforeEach(async ({ page }) => {
  lighthouseLogin = new indexPage.LoginPage(page);
  customersPage = new indexPage.CustomersPage(page);
  await page.goto(process.env.lighthouseUrl, {
    timeout: parseInt(process.env.pageload_timeout)
  });
  await page.waitForTimeout(parseInt(process.env.small_timeout));
});

test('Test_C56920 Verify customer search', async ({ page }) => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await customersPage.clickOnCustomerIcon();
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await assertElementVisible(customersPage.customerSearchInput);
  await customersPage.searchFunctionality();
});
test('Test_C5692 ,verify customers calendar', async ({ page }) => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await customersPage.clickOnCustomerIcon();
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await customersPage.assertCustomersExist();
  await assertElementVisible(customersPage.calendarDiv);
  await assertElementEnabled(customersPage.nextweekIcon);
  await assertElementEnabled(customersPage.previousweekIcon);
  await customersPage.assertCalendarHasDates();
});
test('Test_C56924 ,verify test data on customer card', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await customersPage.clickOnCustomerIcon();
    await customersPage.verifyCustomerCardContent();
    await customersPage.assertTabNames();
  });
  test('Test_C56926,verify contacts tab', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await customersPage.clickOnCustomerIcon();
    await customersPage.checkNoContactsDisplayed();
  });