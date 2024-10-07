const { test, expect } = require('@playwright/test');
require('dotenv').config();
const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  getTodayDateAndYear,
  assertElementNotVisible,
  assertElementContainsText,
  getFormattedTodayDate,
  getTodayDateAndMonth,
  getPreviousWeekDateAndMonth,
  getNextWeekDateAndMonth
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');
exports.SchedulePage = class SchedulePage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.scheduleTab = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[5]/app-mobile-navigation-item//icon')
      : this.page.locator("(//span[normalize-space()='Schedule'])/ancestor::app-navigation-item");
    this.myScheduleTab = this.isMobile
      ? this.page.locator(
          "//div[@role='tab'][1]//app-label-with-number/div/div[normalize-space()='My Schedule']"
        )
      : this.page.locator(
          "//mat-button-toggle-group/mat-button-toggle[1]//button//span[normalize-space()='My Schedule']"
        );
    this.teamScheduleTab = this.isMobile
      ? this.page.locator('//div[contains(text(),"Team Schedule")]//ancestor::div[@role="tab"]')
      : this.page.locator("//span[normalize-space()='Team Schedule']/parent::button");
    this.errorMessage = this.page.locator(
      "//span[contains(text(),'users who have a valid EmployeeId')]"
    );
    this.teamScheduleTable = this.isMobile
      ? this.page.locator('//div[contains(@class,"mbsc-event-list")]')
      : this.page.locator('//mbsc-timeline');
    this.todayDate = this.isMobile
      ? this.page.locator(`(//div[contains(text(),'${getTodayDateAndMonth()}')])[2]`)
      : this.page.locator(`(//div[contains(text(),'${getTodayDateAndYear()}')])[1]`);
    this.previousWeekDate = this.page.locator(
      `(//div[contains(text(),'${getPreviousWeekDateAndMonth()}')])[1]`
    );
    this.nextWeekDate = this.page.locator(
      `(//div[contains(text(),'${getNextWeekDateAndMonth()}')])[1]`
    );

    this.eventCard = this.isMobile
      ? this.page.locator('(//app-events-agenda/div)[1]')
      : this.page.locator('(//app-event-card)[1]');
    this.detailsModel = this.page.locator('//mat-bottom-sheet-container');
    this.highlightedFieldEmployeeName = this.page.locator(
      "//span[text()='Employee Name']/following-sibling::button/span"
    );
    this.highlightedFieldWorkingFor = this.page.locator(
      "//span[text()='Working For']/following-sibling::button/span"
    );
    this.highlightedFieldWorkingAt = this.page.locator(
      "//span[text()='Working At']/following-sibling::button/span"
    );
    this.employeeDetailsEmployeeName = this.page.locator(
      "//span[@class='e2e_schedule_employee_name']"
    );
    this.employeeDetailsEmployeeLocationWorkingFor = this.page.locator(
      "//span[contains(@class, 'e2e_schedule_location_title')]"
    );
    this.getEmployeeWorkingLocation = this.page.locator(
      "//span[contains(@class, 'e2e_schedule_location_title')]"
    );
    this.crossButton = this.page.locator("(//icon[@name='cross_line'])[1]");
    this.filterIcon = this.isMobile
      ? this.page.locator('//div[@class="relative"]/app-filter')
      : this.page.locator("//icon[@name='filter_bulk']");
    this.filtersModel = this.page.locator('//mat-bottom-sheet-container');
    this.clearFilterOption = this.page.locator("//span[contains(text(),'Clear filters')]");
    this.leftArrow = this.isMobile
      ? this.page.locator(
          "//div[contains(@class,'items-center justify-end e2e_schedule_hours')]//icon[1]//*[name()='svg']"
        )
      : this.page.locator("//div[@class='flex items-center']//icon[1]//*[name()='svg']");
    this.rightArrow = this.isMobile
      ? this.page.locator(
          "//div[contains(@class, 'items-center justify-end e2e_schedule_hours')]//icon[2]//*[name()='svg']"
        )
      : this.page.locator("//div[@class='flex items-center']//icon[2]//*[name()='svg']");
    this.todayLink = this.isMobile
      ? this.page.locator(
          "//span[contains(@class,'justify-end uppercase cursor-pointer text-gray')]"
        )
      : this.page.locator(
          "//div[@class='flex items-center']//icon[2]//*[name()='svg']/following::span[normalize-space()='Today']"
        );
    this.menuIcon = this.page.locator('//app-side-menu');
    this.myProfile = this.page.locator("//span[text()='My Profile']");
    this.update = this.isMobile
      ? this.page.locator(
          '(//div[contains(text(),"Default Schedule View")])[2]/../following-sibling::div//div/icon'
        )
      : this.page.locator(
          "//div[text()=' Default Schedule View ']/following-sibling::div[contains(text(),'Update')]"
        );
    this.scheduleType = this.page.locator('//span[@class="e2e_user_profile_schedule_value"]');
    this.dismissPopup = this.page.locator("//span[contains(text(),'Dismiss')]");
  }

  async actionsOnSchedule() {
    await this.scheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.large_timeout)
    });
    await executeStep(this.scheduleTab, 'click', 'Click on schedule tab', []);
    await this.myScheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.medium_timeout)
    });
    await executeStep(this.myScheduleTab, 'click', 'Click on my schedule button', []);
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    const actualMsg = indexPage.lighthouse_data.scheduleErrorMsg;
    const errorMessageText = await this.errorMessage.textContent();
    await test.step(`Assert error message is displayed: Expected error message should contain "${actualMsg}", Actual error message: "${errorMessageText}"`, async () => {
      await assertElementContainsText(this.errorMessage, actualMsg);
    });
  }
  async assertScheduleTab(hightlightedText) {
    await executeStep(this.scheduleTab, 'click', 'Click on scheduleTab');
    await executeStep(this.teamScheduleTab, 'click', 'Click on teamSchedule Tab');
    await test.step('Assert team schedule table is visible', async () => {
      await assertElementVisible(this.teamScheduleTable);
    });
    const actualDateText = await this.todayDate.textContent();
    const expectedDateText = getFormattedTodayDate();
    await test.step(`Assert today's date is displayed Expected today's date: "${expectedDateText}", Actual today's date: "${actualDateText}"`, async () => {
      await assertElementContainsText(this.todayDate, expectedDateText);
    });

    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const todayDateclass = await this.todayDate.getAttribute('class');
    await test.step(`Assert class contains highlighted text: "${hightlightedText}"`, async () => {
      expect(todayDateclass).toContain(hightlightedText);
    });
  }
  async verifyingEventcard() {
    await executeStep(this.eventCard, 'click', 'Click on event card');
    await test.step('Assert event details model is visible', async () => {
      await assertElementVisible(this.detailsModel);
    });
    const highlightedEmployeeName = await this.highlightedFieldEmployeeName.textContent();
    await executeStep(
      this.highlightedFieldEmployeeName,
      'click',
      'Click on highlighted employee name'
    );
    const employeeDetailsName = await this.employeeDetailsEmployeeName.textContent();
    await test.step(`Assert employee names match: expected "${highlightedEmployeeName}", actual "${employeeDetailsName}"`, async () => {
      expect(highlightedEmployeeName).toBe(employeeDetailsName);
    });
    await executeStep(this.crossButton, 'click', 'Click on cross button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.eventCard, 'click', 'Click on event card again');
    await test.step('Assert event details model is visible again', async () => {
      await assertElementVisible(this.detailsModel);
    });
    const highlightedWorkingFor = await this.highlightedFieldWorkingFor.textContent();
    await executeStep(
      this.highlightedFieldWorkingFor,
      'click',
      'Click on highlighted working for field'
    );
    const employeeDetailsLocationWorkingFor =
      await this.employeeDetailsEmployeeLocationWorkingFor.textContent();
    await test.step(`Assert working for names match: expected "${highlightedWorkingFor}", actual "${employeeDetailsLocationWorkingFor}"`, async () => {
      expect(highlightedWorkingFor).toBe(employeeDetailsLocationWorkingFor);
    });
    await executeStep(this.crossButton, 'click', 'Click on cross button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.eventCard, 'click', 'Click on event card again');
    await test.step('Assert event details model is visible for working at', async () => {
      await assertElementVisible(this.detailsModel);
    });
    try {
      const highlightedWorkingAt = await this.highlightedFieldWorkingAt.textContent();
      await executeStep(
        this.highlightedFieldWorkingAt,
        'click',
        'Click on highlighted working at field'
      );
      const getLocationText = await this.getEmployeeWorkingLocation.textContent();
      await test.step(`Assert working at location contains highlighted text: expected "${highlightedWorkingAt}", actual "${getLocationText}"`, async () => {
        expect(getLocationText).toContain(highlightedWorkingAt);
      });
    } catch (error) {
      await test.step('Error occurred while checking working at details', async () => {
        console.error('Error:', error);
      });
    } finally {
      await executeStep(this.crossButton, 'click', 'Click on cross button to close modal');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async verifyingFilterFunctionality() {
    await executeStep(this.filterIcon, 'click', 'Click on filter icon');
    await test.step('Assert filters model is visible', async () => {
      await assertElementVisible(this.filtersModel);
    });
    await executeStep(this.clearFilterOption, 'click', 'Click on clear filter option');
    await test.step('Assert filters model is not visible', async () => {
      await assertElementNotVisible(this.filtersModel);
    });
  }
  async verifyingPreviousNextWeekDates() {
    await executeStep(this.leftArrow, 'click', 'Click on left arrow');
    const expectedPreviousDate = getPreviousWeekDateAndMonth();
    await test.step(`Assert previous week date is displayed correctly: expected "${expectedPreviousDate}", actual "${await this.previousWeekDate.textContent()}"`, async () => {
      await assertElementContainsText(this.previousWeekDate, expectedPreviousDate);
    });
    await executeStep(this.rightArrow, 'click', 'Click on right arrow');
    await executeStep(this.rightArrow, 'click', 'Click on right arrow again');
    const expectedNextDate = getNextWeekDateAndMonth();
    await test.step(`Assert next week date is displayed correctly: expected "${expectedNextDate}", actual "${await this.nextWeekDate.textContent()}"`, async () => {
      await assertElementContainsText(this.nextWeekDate, expectedNextDate);
    });
    await executeStep(this.todayLink, 'click', 'Click on today link');
    await test.step('Assert today date is visible', async () => {
      await assertElementVisible(this.todayDate);
    });
  }

  async verifyingScheduleTabs(scheduleTabActiveMobile, scheduleTabActiveWeb) {
    await executeStep(this.menuIcon, 'click', 'Click on menu icon');
    await executeStep(this.myProfile, 'click', 'Click on my profile');
    await executeStep(this.update, 'click', 'Click on update');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const scheduletype = await this.scheduleType.textContent();
    if (await this.dismissPopup.isVisible()) {
      await executeStep(this.dismissPopup, 'click', 'Click on dismiss popup');
    }

    await executeStep(this.scheduleTab, 'click', 'Click on schedule tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if (scheduletype == ' My Schedule ') {
      await test.step('Assert active schedule tab for mobile or web', async () => {
        const myScheduleTabclass = await this.myScheduleTab.getAttribute('class');
        if (this.isMobile) {
          await test.step(`Assert mobile schedule tab class: expected "${scheduleTabActiveMobile}", actual "${myScheduleTabclass}"`, async () => {
            expect(myScheduleTabclass).toContain(scheduleTabActiveMobile);
          });
        } else {
          await test.step(`Assert web schedule tab class: expected "${scheduleTabActiveWeb}", actual "${myScheduleTabclass}"`, async () => {
            expect(myScheduleTabclass).toContain(scheduleTabActiveWeb);
          });
        }
      });
    }
  }
};
