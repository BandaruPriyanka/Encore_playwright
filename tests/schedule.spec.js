const { test, expect } = require("@playwright/test");
const indexPage = require("../utils/index.page");
const {assertElementVisible,assertEqualValues,assertIsNumber,} = require("../utils/helper");
const atob = require("atob");
require("dotenv").config();

test.describe("LightHouse Operations", () => {
    let lighthouseLogin,schedulePage;
  test.beforeEach(async ({ page }) => {
    lighthouseLogin = new indexPage.LoginPage(page);
    schedulePage = new indexPage.SchedulePage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout),
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await lighthouseLogin.login(
      atob(process.env.lighthouseEmail),
      atob(process.env.lighthousePassword)
    );
  });
  test("Test_C56915 ,My Schedule - WIP (Asked Mark for assistance)	", async ({
    page,
  }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await schedulePage.actionsOnSchedule();
  });
});