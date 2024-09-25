const { test, expect } = require('@playwright/test');
require('dotenv').config();
const { timeout } = require('../../playwright.config');
const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertEqualValues,
  getTodayDate,
  getTodayDateAndYear,
  nextWeekDate,
  previousWeekDate,
  assertElementNotVisible,
  todayDate,
  assertElementContainsText,
  assertContainsValue
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
      ? this.page.locator(`(//div[contains(text(),'${todayDate()}')])[2]`)
      : this.page.locator(`(//div[contains(text(),'${getTodayDateAndYear()}')])[1]`);
    this.previousWeekDate = this.page.locator(
      `(//div[contains(text(),'${previousWeekDate()}')])[1]`
    );
    this.nextWeekDate = this.page.locator(`(//div[contains(text(),'${nextWeekDate()}')])[1]`);

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
    this.employeeDetailsEmployeeLocationWorkingfor = this.page.locator(
      "//span[contains(@class, 'e2e_schedule_location_title')]"
    );
    this.employeeDetailsEmployeeLocationWorkingat = this.page.locator(
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
    this.todaylink = this.isMobile
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
  }
  async actionsOnSchedule() {
    await this.scheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.large_timeout)
    });
    await executeStep(this.scheduleTab, 'click', 'click on schedule tab', []);
    await this.myScheduleTab.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.medium_timeout)
    });
    await executeStep(this.myScheduleTab, 'click', 'click on my schedule button', []);
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    const actualMsg = indexPage.lighthouse_data.scheduleErrorMsg;
    await assertElementContainsText(this.errorMessage, actualMsg);
  }
  async assertScheduleTab(hightlightedText) {
    await executeStep(this.scheduleTab, 'click', 'click on scheduleTab');
    await executeStep(this.teamScheduleTab, 'click', 'click on teamSchedule Tab');
    await assertElementVisible(this.teamScheduleTable);
    await assertElementContainsText(this.todayDate, todayDate());
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const todayDateclass = await this.todayDate.getAttribute('class');
    if (this.isMobile) {
      await expect(this.todayDate).toHaveCSS('border-color', 'rgb(26, 20, 68)');
    } else {
      expect(todayDateclass).toContain(hightlightedText);
    }
  }
  async verifyingEventcard() {
    await executeStep(this.eventCard, 'click', 'click on eventCard');
    await assertElementVisible(this.detailsModel);
    const highlightedEmployeeName = await this.highlightedFieldEmployeeName.textContent();
    await executeStep(
      this.highlightedFieldEmployeeName,
      'click',
      'click on highlightedFieldEmployeeName'
    );
    const employeeDetailsName = await this.employeeDetailsEmployeeName.textContent();
    expect(highlightedEmployeeName).toBe(employeeDetailsName);
    await executeStep(this.crossButton, 'click', 'click on crossButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));

    await executeStep(this.eventCard, 'click', 'click on eventCard');
    await assertElementVisible(this.detailsModel);
    const highlightedWorkingFor = await this.highlightedFieldWorkingFor.textContent();
    await executeStep(
      this.highlightedFieldWorkingFor,
      'click',
      'click on highlightedFieldEmployeeName'
    );
    const employeeDetailsLocationWorkingfor =
      await this.employeeDetailsEmployeeLocationWorkingfor.textContent();
    expect(highlightedWorkingFor).toBe(employeeDetailsLocationWorkingfor);
    await executeStep(this.crossButton, 'click', 'click on crossButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));

    await executeStep(this.eventCard, 'click', 'click on eventCard');
    await assertElementVisible(this.detailsModel);
    const highlightedWorkingAt = await this.highlightedFieldWorkingAt.textContent();
    await executeStep(
      this.highlightedFieldWorkingAt,
      'click',
      'click on highlightedFieldEmployeeName'
    );
    const employeeDetailsLocationWorkingat =
      await this.employeeDetailsEmployeeLocationWorkingat.textContent();
    expect(employeeDetailsLocationWorkingat).toContain(highlightedWorkingAt);
    await executeStep(this.crossButton, 'click', 'click on crossButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async verifyingFilterFunctionality() {
    await executeStep(this.filterIcon, 'click', 'click on filterIcon');
    await assertElementVisible(this.filtersModel);
    await executeStep(this.clearFilterOption, 'click', 'click on clearFilter Option');
    await assertElementNotVisible(this.filtersModel);
  }
  async verifyingPreviousNextWeekDates() {
    await executeStep(this.leftArrow, 'click', 'click on left Arrow ');
    await assertElementContainsText(this.previousWeekDate, previousWeekDate());
    await executeStep(this.rightArrow, 'click', 'click on right Arrow ');
    await executeStep(this.rightArrow, 'click', 'click on right Arrow ');
    await assertElementContainsText(this.nextWeekDate, nextWeekDate());
    await executeStep(this.todaylink, 'click', 'click on todaylink');
    await assertElementVisible(this.todayDate);
  }
  async verifyingScheduleTabs(scheduletabActiveMobile, scheduletabActiveWeb) {
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await executeStep(this.myProfile, 'click', 'click on myProfile');
    await executeStep(this.update, 'click', 'click on update');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const scheduletype = await this.scheduleType.textContent();
    await executeStep(this.scheduleTab, 'click', 'click on scheduleTab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if (scheduletype == ' My Schedule ') {
      if (this.isMobile) {
        const myScheduleTabclass = await this.myScheduleTab.getAttribute('class');
        expect(myScheduleTabclass).toContain(scheduletabActiveMobile);
      } else {
        const myScheduleTabclass = await this.myScheduleTab.getAttribute('class');
        expect(myScheduleTabclass).toContain(scheduletabActiveWeb);
      }
    }
  }
};
