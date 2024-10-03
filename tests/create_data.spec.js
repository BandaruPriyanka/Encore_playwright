const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const atob = require('atob');
require('dotenv').config();
const { lighthouseApi } = require('../utils/helper');

test.describe('Opportunity and Order Creation', () => {
  let loginPage, createdata, navigatorLoginPage, isCreateData1;
  test.beforeEach(async ({ page }) => {
    isCreateData1 = test.info().project.use.isCreateData1;
    loginPage = new indexPage.LoginPage(page);
    createdata = new indexPage.CreateData(page, isCreateData1);
    navigatorLoginPage = new indexPage.NavigatorLoginPage(page);
  });

  test('Create new opportunity', async ({ page }) => {
    await page.goto(process.env.opportunityUrl);
    await loginPage.login(atob(process.env.email), atob(process.env.password));
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    await createdata.clickOnCompass();
    await createdata.clickOnCopilot();
    await createdata.createOpportunity(
      indexPage.opportunity_data.estRevenue,
      indexPage.opportunity_data.endUserAccount,
      indexPage.opportunity_data.endUserContact,
      indexPage.opportunity_data.centerName,
      indexPage.opportunity_data.enduserText
    );
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await createdata.clickOnPlusButton(atob(process.env.email), atob(process.env.password));
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Create new order and manage it', async ({ page }) => {
    await page.goto(indexPage.navigator_data.navigatorUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await navigatorLoginPage.login_navigator(atob(process.env.email), atob(process.env.password));
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await page.goto(indexPage.navigator_data.navigatorUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await createdata.createOrder();
    await page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await createdata.jobsPage();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await createdata.selectRooms();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await createdata.selectItems();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await createdata.selectLabourItem();
    await lighthouseApi(isCreateData1);
  });
});
