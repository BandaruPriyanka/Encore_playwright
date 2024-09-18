require("dotenv").config();
const { executeStep } = require("../../utils/action");
const {assertElementVisible,assertEqualValues,} = require("../../utils/helper");
const indexPage = require("../../utils/index.page");
exports.SchedulePage = class SchedulePage {
    constructor(page) {
      this.page = page;
      this.isMobile = this.page.context()._options.isMobile;
      this.scheduleTab=this.page.locator("//span[normalize-space()='Schedule']")
      this.myScheduleTab=this.page.locator("//span[normalize-space()='My Schedule']/..");
      this.errorMessage=this.page.locator("//span[contains(text(),' Open Shifts is only available with users who have a valid EmployeeId ')]");
    }
    async actionsOnSchedule(){
        await assertElementVisible(this.scheduleTab)
        await executeStep(this.scheduleTab, "click", "click on schedule tab", []);
        await executeStep(this.myScheduleTab, "click", "click on my schedule button", []);
        await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
        const errormsg=await this.errorMessage.textContent();
        const actualMsg=indexPage.lighthouse_data.scheduleErrorMsg;
        await assertElementVisible(this.errorMessage);
        await assertEqualValues(errormsg,actualMsg);
    }
}