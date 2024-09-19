require('dotenv').config();
const { timeout } = require('../../playwright.config');
const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertEqualValues,
  assertElementContainsText
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');
exports.SchedulePage = class SchedulePage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.scheduleTab = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[5]/app-mobile-navigation-item//icon')
      : this.page.locator("//span[normalize-space()='Schedule']");
    this.myScheduleTab = this.isMobile
      ? this.page.locator(
          "//div[@role='tab'][1]//app-label-with-number/div/div[normalize-space()='My Schedule']"
        )
      : this.page.locator(
          "//mat-button-toggle-group/mat-button-toggle[1]//button//span[normalize-space()='My Schedule']"
        );
    this.errorMessage = this.page.locator(
      "//span[contains(text(),'users who have a valid EmployeeId')]"
    );
  }
  async actionsOnSchedule() {
    await this.scheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.small_timeout)
    });
    await executeStep(this.scheduleTab, 'click', 'click on schedule tab', []);
    await this.myScheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.small_timeout)
    });
    await executeStep(this.myScheduleTab, 'click', 'click on my schedule button', []);
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    const actualMsg = indexPage.lighthouse_data.scheduleErrorMsg;
    await assertElementContainsText(this.errorMessage, actualMsg);
  }
};
