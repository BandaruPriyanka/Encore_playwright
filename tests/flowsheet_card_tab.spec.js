const { test, expect } = require('@playwright/test');
const indexPage = require("../utils/index.page");
const {assertElementVisible,assertEqualValues,assertElementContainsText}=require("../utils/helper")
const utilConst = require('../utils/const')
const atob = require("atob");
require("dotenv").config();

test.describe('LightHouse Flowsheet card and tab operations' , () => {
    let lighthouseLogin, flowsheetCardAndTab;

    test.beforeEach(async ({ page }) => {
        lighthouseLogin = new indexPage.LoginPage(page);
        flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
        await page.goto(process.env.lighthouseUrl, {
          timeout: parseInt(process.env.pageload_timeout),
        });
        await page.waitForTimeout(parseInt(process.env.small_timeout));
        await lighthouseLogin.login(atob(process.env.lighthouseEmail),atob(process.env.lighthousePassword));
    });

    test('Test_C56890 Verify test data on flowsheet card' , async({ page }) => {
        await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
        await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
        await flowsheetCardAndTab.validateRoomCard(indexPage.navigator_data.roomName,indexPage.navigator_data.order_name,indexPage.opportunity_data.endUserAccount);
        for(const tabText of indexPage.lighthouse_data.flowsheetTabs) {
            await assertElementVisible(flowsheetCardAndTab.flowsheetTabElement(tabText));
        }
    })

    test('Test_C56910 verify contacts tab' , async ({ page }) => {
        await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
        await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
        await assertElementVisible(flowsheetCardAndTab.flowsheetTabElement(utilConst.Const.Contacts));
        await flowsheetCardAndTab.clickOnContactAndValidate();
        await page.waitForTimeout(parseInt(process.env.small_timeout))
        await assertElementContainsText(flowsheetCardAndTab.textInModal,indexPage.lighthouse_data.modalText);
    })
      
})