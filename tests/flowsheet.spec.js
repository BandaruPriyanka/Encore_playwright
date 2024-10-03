const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { assertElementVisible, assertEqualValues } = require('../utils/helper');
require('dotenv').config();

test.describe('Performing actions on Flowsheet', () => {
  let flowsheetPage,
    filtercount_before_pagereload,
    filtercount_after_pagereload,
    locationId,
    locationText;

  test.beforeEach(async ({ page }) => {
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
  });
  test('Test_C56878: Verify Flowsheet status', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Skipping Flowsheet status on mobile devices');
    await flowsheetPage.searchFunctionality();
    assertElementVisible(flowsheetPage.statusIcon);
    assertElementVisible(flowsheetPage.groupIcon);
    await flowsheetPage.setStatus();
    await assertElementVisible(flowsheetPage.carryOver);
    await page.reload();
    await flowsheetPage.searchFunctionality();
    await assertElementVisible(flowsheetPage.carryOver);
    await flowsheetPage.changestatus();
  });
  test.only('Test_C56880 : Verify Flowsheet groups', async ({ isMobile }) => {
    test.skip(isMobile, 'Skipping Flowsheet status on mobile devices');
    await flowsheetPage.searchFunctionality();
    assertElementVisible(flowsheetPage.statusIcon);
    assertElementVisible(flowsheetPage.groupIcon);
    await flowsheetPage.verifyGroup();
    await flowsheetPage.deleteGroupData();
  });

  test('Test_C56882: Verify lighthouse flowsheet search functionality', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    await assertElementVisible(flowsheetPage.searchInput);
    await flowsheetPage.checkingSearchFunctionality();
  });

  test('Test_C56885: Verify Flowsheets filtering', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetPage.filterIcon);
    await flowsheetPage.flowsheetFilter();
    filtercount_before_pagereload = await flowsheetPage.filterCount.textContent();
    await page.reload();
    filtercount_after_pagereload = await flowsheetPage.filterCount.textContent();
    await assertEqualValues(filtercount_before_pagereload, filtercount_after_pagereload);
    await flowsheetPage.sorting();
  });

  test('Test_C56886: Verify Flowsheets calendar', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetPage.calendarDiv);
    await assertElementVisible(flowsheetPage.nextweekIcon);
    await assertElementVisible(flowsheetPage.previousweekIcon);
    await flowsheetPage.clickonPreviousWeek();
    await assertElementVisible(flowsheetPage.todayButton);
    await flowsheetPage.assertCalendarHasDates();
  });

  test('Test_C56888 : Verify Flowsheets calendar widget', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetPage.calendarDiv);
    await flowsheetPage.asserRoomsWhileDateChange();
    await flowsheetPage.assertDates();
    await flowsheetPage.assertUrls();
    await flowsheetPage.validateDateFromPastAndFuture();
  });

  test('Test_C56881: Verify Flowsheet touchpoints indicator', async () => {
    await flowsheetPage.assertTouchPointIndicator(indexPage.navigator_data.second_job_no);
    await flowsheetPage.addSecondTouchPoint(indexPage.navigator_data.second_job_no);
    await flowsheetPage.addRemainingTouchPoint();
  });

  test('Test_C56887 : Verify Flowsheets command center', async () => {
    await flowsheetPage.verifyingRoomsFunctionality(
      indexPage.lighthouse_data.invalidText,
      indexPage.navigator_data.second_job_no,
      indexPage.lighthouse_data.flowsheetUpdatedIconText
    );
    await flowsheetPage.verifyingTransfersFunctionality();
  });
});
