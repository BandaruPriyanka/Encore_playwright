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
    test.step('Verify status icon is visible', async () => {
      await assertElementVisible(flowsheetPage.statusIcon);
    });
    test.step('Verify group icon is visible', async () => {
      await assertElementVisible(flowsheetPage.groupIcon);
    });
    await flowsheetPage.setStatus();
    test.step('Check if carryOver is visible before page reload', async () => {
      await assertElementVisible(flowsheetPage.carryOver);
    });
    await page.reload();
    await flowsheetPage.searchFunctionality();
    test.step('Check if carryOver is visible after page reload', async () => {
      await assertElementVisible(flowsheetPage.carryOver);
    });
    await flowsheetPage.changestatus();
  });
  test('Test_C56880 : Verify Flowsheet groups', async ({ isMobile }) => {
    test.skip(isMobile, 'Skipping Flowsheet status on mobile devices');
    await flowsheetPage.searchFunctionality();
    test.step('Verify status icon is visible', async () => {
      await assertElementVisible(flowsheetPage.statusIcon);
    });
    test.step('Verify group icon is visible', async () => {
      await assertElementVisible(flowsheetPage.groupIcon);
    });
    await flowsheetPage.verifyGroup();
    await flowsheetPage.deleteGroupData();
  });

  test('Test_C56882: Verify lighthouse flowsheet search functionality', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    test.step('Verify search input is visible', async () => {
      await assertElementVisible(flowsheetPage.searchInput);
    });
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
    await test.step('Verify visibility of the calendar', async () => {
      await assertElementVisible(flowsheetPage.calendarDiv);
    });
    await test.step('Verify visibility of the next week icon', async () => {
      await assertElementVisible(flowsheetPage.nextweekIcon);
    });
    await test.step('Verify visibility of the previous week icon', async () => {
      await assertElementVisible(flowsheetPage.previousweekIcon);
    });
    await test.step('Click on the previous week', async () => {
      await flowsheetPage.clickonPreviousWeek();
    });
    await test.step('Verify visibility of the today button', async () => {
      await assertElementVisible(flowsheetPage.todayButton);
    });
    await test.step('Verify the calendar has the correct dates', async () => {
      await flowsheetPage.assertCalendarHasDates();
    });
  });

  test('Test_C56888: Verify Flowsheets calendar widget', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await test.step('Verify visibility of the calendar widget', async () => {
      await assertElementVisible(flowsheetPage.calendarDiv);
    });
    await test.step('Assert rooms while changing dates', async () => {
      await flowsheetPage.asserRoomsWhileDateChange();
    });
    await test.step('Assert dates displayed in the calendar', async () => {
      await flowsheetPage.assertDates();
    });
    await test.step('Assert URLs associated with the calendar', async () => {
      await flowsheetPage.assertUrls();
    });
    await test.step('Validate dates from the past and future', async () => {
      await flowsheetPage.validateDateFromPastAndFuture();
    });
  });
  test('Test_C56881: Verify Flowsheet touchpoints indicator', async () => {
    await test.step('Assert touchpoint indicator visibility', async () => {
      await flowsheetPage.assertTouchPointIndicator(indexPage.navigator_data.second_job_no);
    });
    await test.step('Add second touchpoint', async () => {
      await flowsheetPage.addSecondTouchPoint(indexPage.navigator_data.second_job_no);
    });
    await test.step('Add remaining touchpoints', async () => {
      await flowsheetPage.addRemainingTouchPoint();
    });
  });
  test('Test_C56887: Verify Flowsheets command center', async () => {
    await test.step('Verify rooms functionality', async () => {
      await flowsheetPage.verifyingRoomsFunctionality(
        indexPage.lighthouse_data.invalidText,
        indexPage.navigator_data.second_job_no,
        indexPage.lighthouse_data.flowsheetUpdatedIconText
      );
    });
    await test.step('Verify transfers functionality', async () => {
      await flowsheetPage.verifyingTransfersFunctionality();
    });
  });
});
