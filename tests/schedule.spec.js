const { test, expect } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { assertElementVisible, assertEqualValues, assertIsNumber } = require('../utils/helper');
const atob = require('atob');
require('dotenv').config();

test.describe('LightHouse Operations', () => {
  let lighthouseLogin, schedulePage;
  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    schedulePage = new indexPage.SchedulePage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });
  test('Test_C56915 ,My Schedule - WIP (Asked Mark for assistance)	', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await schedulePage.actionsOnSchedule();
  });
  test('Test_C56916	verify team schedule', async ({ page }) => {
    await schedulePage.assertScheduleTab(indexPage.lighthouse_data.scheduleHighlightedDate);
    await schedulePage.verifyingEventcard();
    await schedulePage.verifyingFilterFunctionality();
    await schedulePage.verifyingPreviousNextWeekDates();
    await schedulePage.verifyingScheduleTabs(
      indexPage.lighthouse_data.scheduletabActiveMobile,
      indexPage.lighthouse_data.scheduletabActiveWeb
    );
  });
});
