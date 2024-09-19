const { test, expect } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { assertElementVisible, assertEqualValues, assertIsNumber } = require('../utils/helper');
const atob = require('atob');
require('dotenv').config();

test.describe('LightHouse Operations', () => {
  let lighthouseLogin, flowsheetSearch, filtercount_before_pagereload, filtercount_after_pagereload;

  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    flowsheetSearch = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56882 Verify lighthouse flowsheet search functionality', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    await assertElementVisible(flowsheetSearch.searchInput);
    await flowsheetSearch.checkingSearchFunctionality();
  });

  test('Test_C56885	,Flowsheets filtering', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetSearch.filterIcon);
    await flowsheetSearch.flowsheetFilter();
    filtercount_before_pagereload = await flowsheetSearch.filterCount.textContent();
    await page.reload();
    filtercount_after_pagereload = await flowsheetSearch.filterCount.textContent();
    await assertEqualValues(filtercount_before_pagereload, filtercount_after_pagereload);
    await flowsheetSearch.sorting();
  });

  test('Test_C56886	Flowsheets calendar', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetSearch.calendarDiv);
    await assertElementVisible(flowsheetSearch.nextweekIcon);
    await assertElementVisible(flowsheetSearch.previousweekIcon);
    await flowsheetSearch.clickonPreviousWeek();
    await assertElementVisible(flowsheetSearch.todayButton);
    await flowsheetSearch.assertCalendarHasDates();
  });

  test.only('Test_C56888 Flowsheets calendar widget', async({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetSearch.calendarDiv);
    await flowsheetSearch.asserRoomsWhileDateChange();
    await flowsheetSearch.assertDates();
    await flowsheetSearch.assertUrls();
    await flowsheetSearch.validateDateFromPastAndFuture();
  });

});
