const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const {
    assertElementVisible,
    assertElementNotVisible,
  } = require('../../utils/helper');
require('dotenv').config();

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.dashboardBtn = this.page.locator("//span[normalize-space()='Dashboard']//parent::div");
    this.addWidgetBtn = this.isMobile?this.page.locator("(//a[normalize-space()='+ Add Widget'])[2]"):this.page.locator("(//a[normalize-space()='+ Add Widget'])[1]");
    this.additionsCaptureSelectBtn = this.page.locator("//span[normalize-space()='Additions Captured']/following-sibling::span[normalize-space()='Select']");
    this.applyBtn = this.page.locator("//button[normalize-space()='Apply']");
    this.checkLineIcon = this.page.locator("//icon[@name='check_line']");
    this.additionsCapturedWidget = this.isMobile?this.page.locator("(//app-additions-captured)[2]//div[normalize-space()='Additions Captured']"):this.page.locator("(//app-additions-captured)[1]//div[normalize-space()='Additions Captured']");
    this.myWidgetTxt = this.page.locator("//span[normalize-space()='My Widgets']");
  }

  async navigateToDashboard(){
    await executeStep(this.menuIcon, 'click', 'Click on Menu Icon');
    await executeStep(this.dashboardBtn, 'click', 'Click on Dashboard Tab');
  }

  async addingWidgets(){
    await assertElementVisible(this.addWidgetBtn, "Verify the 'Dashbaord' page should be opened");
    try{
        await assertElementNotVisible(this.additionsCapturedWidget, "Verify the default state of the Dashboard page");
    }
    catch{
        await test.step("Cleaning the Existing Dashboard to perform the creation flow", async () => {
            await this.removeWidgets();
        });
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.addWidgetBtn, 'click', "Click on 'Add widget' link");
    await assertElementVisible(this.additionsCaptureSelectBtn, "Verify widget selection modal should be displayed");
    await executeStep(this.additionsCaptureSelectBtn, 'click', "Select 'Additions Captured' widget ");
    await executeStep(this.applyBtn,'click', "click 'Apply' button");
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.additionsCapturedWidget, "Verify 'Additions Captured' widget should be added to the Dashboard");
    await test.step('Refresh the page', async () => {
        await this.page.reload();
      });
    await assertElementVisible(this.additionsCapturedWidget, "Verify 'Additions Captured' widget is still displayed on the Dashboard");
  }

  async removeWidgets(){
    await assertElementVisible(this.additionsCapturedWidget, "Verify  'Additions Captured' widget is displayed properly");
    await executeStep(this.addWidgetBtn,'click', "Click on '+ Add Widget'");
    await assertElementVisible(this.myWidgetTxt, "Verify My widgets modal should be displayed");
    await executeStep(this.checkLineIcon,'click', "Click on the green checkmark to de-select 'Additions");
    await assertElementVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should be de-selected");
    await executeStep(this.applyBtn,'click', "Click on 'Apply' button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementNotVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should be removed successfully from the Dashboard page.");
    await test.step('Refresh the page', async () => {
        await this.page.reload();
    });
    await assertElementNotVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should NOT be displayed on the Dashboard page.");
  }
};
