const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();

test.describe('Performing actions on Schedule Tab', () => {
  let schedulePage, flowsheetPage, locationId, locationText;

  test.beforeEach(async ({ page }) => {
    schedulePage = new indexPage.SchedulePage(page);
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

  test.only('Test_C56915: Verify Actions on My Schedule', async () => {
    await schedulePage.actionsOnSchedule();
  });

  test('Test_C56916: Verify Team Schedule', async () => {
    await schedulePage.assertScheduleTab(indexPage.lighthouse_data.scheduleHighlightedDate);
    await schedulePage.verifyingEventcard();
    await schedulePage.verifyingFilterFunctionality();
    await test.step('Verify navigation within past/future weeks should working properly', async () => {
      await schedulePage.verifyingPreviousNextWeekDates();
    });
    await test.step('Verify schedule tabs are correctly active', async () => {
      await schedulePage.verifyingScheduleTabs(
        indexPage.lighthouse_data.scheduleTabActiveMobile,
        indexPage.lighthouse_data.scheduleTabActiveWeb
      );
    });
  });
});
