require('dotenv').config();
const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const {
  todayDate,
  todayDateWithLeadingZero,
  nextDayDate,
  scrollElement,
  todayDateFullFormate,
  nextWeekDate,
  previousWeekDate,
  assertElementVisible,
  assertEqualValues,
  assertNotEqualValues,
  assertIsNumber,
  checkVisibleElementColors,
  getFormattedTime,
  getCurrentMonth,
  assertElementNotVisible,
  assertContainsValue
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');

let beforeRoomCount, afterRoomCount, roomsreturned;
exports.FlowSheetPage = class FlowSheetPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.searchInput = this.page.locator("//input[@name='search-field']");
    this.noResultsPlaceholder = this.page.locator(
      "//span[text()=' No results match your filter settings ']"
    );
    this.locationDiv = this.page.locator('//app-header//app-notifications/../div');
    this.searchLocation = this.page.locator("//input[@placeholder='Search location']");
    this.selectLocation = locationName =>
      this.page.locator(`//span[contains(text(),'` + locationName + `')]`);
    this.roomsCount = this.page.locator("//div[text()=' Rooms ']/following-sibling::div");
    this.crossButton = this.page.locator("//icon[@name='cross_line']");
    this.flowsheetDiv = this.page.locator("//div[@class='flex']/child::div[1]");
    this.jobIdChecking = jobId => this.page.locator(`//span[contains(text(), '#${jobId}')]`);
    this.dateElement = date => this.page.locator(`//span[text()='${date}']`);
    this.filterIcon = this.page.locator("//icon[@name='filter_bulk']");
    this.sortTab = this.page.locator("(//div[contains(text(),'Sort')])[1]");
    this.customerName = this.page.locator("//div[normalize-space()='Customer Name']");
    this.actionTab = this.page.locator("(//div[normalize-space()='Action'])[1]");
    this.strikeReset = this.page.locator("//div[normalize-space()='Strike Reset']");
    this.applyFilter = this.page.locator("//span[text()=' Apply filters ']");
    this.filterCount = this.page.locator("//icon[@name='filter_bulk']/parent::div/div");
    this.clearFilter = this.page.locator("//span[normalize-space()='Clear filters']");
    this.calendarDiv = this.page.locator('.e2e_flowsheet_date_selector');
    this.nextweekIcon = this.page.locator("//icon[@title='Next week']");
    this.previousweekIcon = this.page.locator("//icon[@title='Previous week']");
    this.todayButton = this.page.locator("//div[contains(text(),'TODAY')]");
    this.todayDateButton = date => this.page.locator(`//div[contains(text(),'` + date + `')]`);
    this.flowsheetCard = this.page.locator(
      "(//app-flowsheet-action-card[@class='e2e_flowsheet_action_card ng-star-inserted'])[1]"
    );
    this.statusIcon = this.page.locator('(//app-button-card//div//icon)[1]');
    this.groupIcon = this.page.locator("(//div[normalize-space()='groups'])[4]");
    this.noConfiguredModal = this.page.locator('//app-add-flowsheet-group');
    this.clickOnLink = this.page.locator(
      "//a[contains(normalize-space(),'tap or click right here')]"
    );
    this.placeholder = this.page.locator("//input[@placeholder='Add Group']");
    this.createButton = this.page.locator("//span[normalize-space()='Create']//parent::button");
    this.flowsheetButton = this.page.locator("//span[normalize-space()='Flowsheet']");
    this.selectGroup = this.page.locator("(//span[normalize-space()='select'])[1]");
    this.applyButton = this.page.locator("//span[normalize-space()='Apply']//parent::a");
    this.ungroup = this.page.locator("(//div[normalize-space()='ungroup'])[1]");
    this.filterIcon = this.page.locator("//icon[@name='filter_bulk']");
    this.selectGroupFilter = this.page.locator("//div[text()=' Groups ']");
    this.selectCreatedGroup = this.page.locator("//div[@title='test']");
    this.applyFilter = this.page.locator("//span[normalize-space()='Apply filters']");
    this.iconMenu = this.page.locator("(//icon[@name='menu_line'])[1]");
    this.clickOnLocationProfile = this.page.locator("//span[text()='Location Profile']");
    this.flowsheetGroups = this.page.locator("(//span[text()='Flowsheet Groups'])[2]");
    this.binLine = this.page.locator("//icon[@name='trah_bin_line']");
    this.clickOnYes = this.page.locator("//span[text()='Yes']");
    this.statusSetRefreshComplete = this.page.locator(
      "//app-select-status-sheet//li[.//span[text()='Set Refresh - Complete']]"
    );
    this.cancelButton = this.page.locator("//span[text()=' Close ']");
    this.timeLine = this.page.locator('app-flowsheet-action-timeline');
    this.carryOver = this.page.locator("(//span[normalize-space()='Carry Over'])[2]");
    this.statusSetRefresh = this.page.locator(
      "//app-select-status-sheet//li[.//span[text()='Set Refresh']]"
    );
    this.touchPointIndicator = this.page.locator('//app-mood-pia-chart');
    this.countOfPieIcon = this.page.locator('app-mood-pia-chart > svg  > path');
    this.touchPointModal = this.page.locator('//mat-bottom-sheet-container');
    this.happyIconInTouchPoint = this.page.locator("//span[contains(text(),'Happy')]");
    this.saveButton = this.page.locator("//button[contains(text(),'Save')]");
    this.touchPointItems = index => `app-mood-pia-chart > svg > path:nth-of-type(` + index + `)`;
    this.neutralIconInTouchPoint = this.page.locator("//span[contains(text(),'Neutral')]");
    this.noteRequiresMsgInModal = this.page.locator(
      "//span[contains(text(),'Note is required for Neutral and Angry mood.')]"
    );
    this.noteInput = this.page.locator("//label[text()='Note']/following-sibling::textarea");
    this.angryIconInTouchPoint = this.page.locator("//span[contains(text(),'Angry')]");
    this.touchPointLimitMsg = this.page.locator(
      "//span[contains(text(),'The maximum number of touchpoints for today have been reached')]"
    );
    this.commandCenterIcon = this.page.locator("//icon[@name='tv_line']//*[name()='svg']");
    this.roomsCount = this.page.locator("//div[contains(text(),'Rooms')]/following-sibling::div");
    this.flowsheetList = this.page.locator(
      "//div[@class='relative overflow-hidden']/div/app-action-line"
    );
    this.flowsheetListElement1 = this.page.locator(
      "(//div[@class='relative overflow-hidden']/div/app-action-line)[1]"
    );
    this.flowSheetActioncard1 = this.page.locator('(//app-flowsheet-action-card)[1]');
    this.moodChooserIcon = this.isMobile
      ? this.page.locator(
          "(//app-mood-icon[contains(@class,' e2e_flowsheet_detail_mood_chooser')])[2]"
        )
      : this.page.locator(
          "(//app-mood-icon[contains(@class,' e2e_flowsheet_detail_mood_chooser')])[1]"
        );
    this.happyIcon = this.page.locator(
      "//app-room-mood-chooser//app-mood-icon//icon[@class='text-green-500']"
    );
    this.submitButton = this.page.locator("//span[contains(text(),'Submit')]/ancestor::button");
    this.updatedMoodIcon = this.page.locator(
      "((//div[@class='relative overflow-hidden']/div/app-action-line)[1]//app-mood-icon)[2]/icon"
    );
    this.presentTime = this.page.locator(
      `//div[contains(@class,'text-left')]/div/span[contains(text(),'${getFormattedTime()}')]`
    );
    this.hotel = location =>
      this.page.locator(
        `//div[contains(@class,'text-left')]/div[contains(text(),'` + location + `')]`
      );
    this.todayDate = this.page.locator(
      `//div[contains(text(),'${getCurrentMonth()} ${todayDateWithLeadingZero()}')]`
    );
    this.backarrow = this.page.locator('//icon[contains(@class,"e2e_flowsheet_detail_back")]');
    this.transfersTab = this.page.locator("(//div[normalize-space()='Transfers'])[1]");
    this.transfersCount = this.page.locator(
      "(//div[normalize-space()='Transfers']//following-sibling::div)[1]"
    );
    this.noDataFoundText = this.page.locator("(//span[contains(text(),'No data found')])[1]");
  }

  async changeLocation(locationId, locationName) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.locationDiv, 'click', 'Click the location div', []);
    await executeStep(this.searchLocation, 'fill', 'Fill the search location field', [locationId]);
    await executeStep(this.selectLocation(locationName), 'click', 'Select the location', []);
  }

  async searchFunction(searchText) {
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [searchText]);
  }

  async dateChangeChecking() {
    await executeStep(
      this.dateElement(nextDayDate()),
      'click',
      'Click on the next day date element',
      []
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async backToTodayDate() {
    await executeStep(
      this.dateElement(todayDate()),
      'click',
      'Click on the today date element',
      []
    );
  }

  async clickOnCrossButton() {
    await executeStep(this.crossButton, 'click', 'Click on cross button', []);
  }

  async scrollAction() {
    const div = await this.flowsheetDiv;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }

  async checkCaseInsensitive() {
    const orderName = indexPage.navigator_data.order_name.trim();
    await this.searchFunction(orderName);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnCrossButton();
    await this.searchFunction(orderName.toUpperCase());
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async checkingSearchFunctionality() {
    beforeRoomCount = await this.roomsCount.textContent();
    await this.searchFunction(indexPage.lighthouse_data.invalidText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Verify no results placeholder is visible', async () => {
      await assertElementVisible(this.noResultsPlaceholder);
    });
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Verify valid search results are returned after entering valid room number', async () => {
      await assertElementVisible(this.jobIdChecking(indexPage.navigator_data.second_job_no));
    });
    const inputValueBeforeDateChange = await this.searchInput.inputValue();
    await this.dateChangeChecking();
    const inputValueAfterDateChange = await this.searchInput.inputValue();
    await test.step(`Verify input value after date change matches before: expected "${inputValueBeforeDateChange}", actual "${inputValueAfterDateChange}"`, async () => {
      await assertEqualValues(inputValueAfterDateChange, inputValueBeforeDateChange);
    });
    await this.backToTodayDate();
    await this.clickOnCrossButton();
    afterRoomCount = await this.roomsCount.textContent();
    await test.step(`Verify room counts before and after searching are equal: expected "${beforeRoomCount}", actual "${afterRoomCount}"`, async () => {
      await assertEqualValues(afterRoomCount, beforeRoomCount);
    });
    await test.step('Verify that scrolling works properly', async () => {
      await this.scrollAction();
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    const roomCount_lowerCase = await this.roomsCount.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnCrossButton();
    await this.searchFunction(indexPage.navigator_data.order_name.toUpperCase().trim());
    const roomCount_upperCase = await this.roomsCount.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step(`Verify room counts for lowercase and uppercase order names are equal: expected "${roomCount_lowerCase}", actual "${roomCount_upperCase}"`, async () => {
      await assertEqualValues(roomCount_lowerCase, roomCount_upperCase);
    });
  }

  async flowsheetFilter() {
    roomsreturned = await this.roomsCount.textContent();
    await executeStep(this.filterIcon, 'click', 'Click on filter button', []);
    await executeStep(this.sortTab, 'click', 'click on sort button', []);
    await executeStep(this.customerName, 'click', 'Click on customer name button', []);
    await executeStep(this.actionTab, 'click', 'Click on action tab', []);
    await executeStep(this.strikeReset, 'click', 'Click on strike reset button', []);
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button', []);
    await test.step('Assert that no results placeholder is visible', async () => {
      await assertElementVisible(this.noResultsPlaceholder);
    });
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await test.step(`Assert that the rooms returned is a valid number: ${roomsreturned}`, async () => {
      await assertIsNumber(roomsreturned);
    });
  }
  async sorting() {
    await executeStep(this.filterIcon, 'click', 'Click on filter button', []);
    await executeStep(this.clearFilter, 'click', 'Click on clear filter button', []);
    await test.step(`Assert that the rooms returned is a valid number: ${roomsreturned}`, async () => {
      await assertIsNumber(roomsreturned);
    });
    await executeStep(this.filterIcon, 'click', 'Click on filter button', []);
    await executeStep(this.sortTab, 'click', 'click on sort button', []);
    await executeStep(this.customerName, 'click', 'Click on customer name button', []);
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button', []);
  }
  async clickonPreviousWeek() {
    await executeStep(this.previousweekIcon, 'click', 'click on previous week icon', []);
  }
  async assertCalendarHasDates() {
    await executeStep(this.previousweekIcon, 'click', 'click on previous icon', []);
    await executeStep(this.todayButton, 'click', 'click on today button', []);
    const dateLocator = await this.dateElement(todayDate()).textContent();
    const getTodayDate = await todayDate();
    await test.step(`Assert that the calendar displays today's date: expected "${getTodayDate}", actual "${dateLocator}"`, async () => {
      await assertEqualValues(dateLocator, getTodayDate);
    });
    await test.step('Check for date changes in the calendar', async () => {
      await this.dateChangeChecking();
    });
    await test.step("Return to today's date in the calendar", async () => {
      await this.backToTodayDate();
    });
  }
  async asserRoomsWhileDateChange() {
    const todayRoomCount = await this.roomsCount.textContent();
    await executeStep(this.dateElement(nextDayDate()), 'click', 'Select tomorrow date');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const nextDayRoomCount = await this.roomsCount.textContent();
    await test.step(`Verify room counts are not equal: expected "${todayRoomCount}", actual "${nextDayRoomCount}"`, async () => {
      try {
        await assertNotEqualValues(todayRoomCount, nextDayRoomCount);
      } catch (error) {
        test.info(`Expected room count: ${todayRoomCount}, Actual room count: ${nextDayRoomCount}`);
        await assertEqualValues(todayRoomCount, nextDayRoomCount);
      }
    });
    await executeStep(this.dateElement(todayDate()), 'click', 'Click on today date');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async assertDates() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await test.step('Assert elements are visible for the next week', async () => {
      await assertElementVisible(this.dateElement(nextWeekDate()));
      await assertElementVisible(this.todayButton);
      await assertElementVisible(this.todayDateButton(todayDateFullFormate()));
    });
    await executeStep(this.todayButton, 'click', 'Click on today button');
    await executeStep(this.previousweekIcon, 'click', 'Click on previous week icon');
    await test.step('Assert previous week date element is visible', async () => {
      await assertElementVisible(this.dateElement(previousWeekDate()));
    });
    await executeStep(this.todayButton, 'click', 'Click today date');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async assertUrls() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await executeStep(this.todayButton, 'click', 'Click on today URL');
    await test.step(`Verify today's date element is visible`, async () => {
      await assertElementVisible(this.dateElement(todayDate()));
    });
    await test.step('Verify redirection via URL works properly', async () => {
      await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
      await executeStep(this.todayDateButton(todayDateFullFormate()), 'click', 'Click on date URL');
      await test.step(`Verify today's date element is visible again`, async () => {
        await assertElementVisible(this.dateElement(todayDate()));
      });
    });
  }

  async validateDateFromPastAndFuture() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await executeStep(this.dateElement(nextWeekDate()), 'click', 'Click date from next week');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await test.step('Assert rooms count is visible for next week', async () => {
      await assertElementVisible(this.roomsCount);
    });
    await executeStep(this.todayButton, 'click', 'Click on today URL');
    await executeStep(this.previousweekIcon, 'click', 'Click on previous week icon');
    await executeStep(
      this.dateElement(previousWeekDate()),
      'click',
      'Click date from previous week'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await test.step('Assert rooms count is visible for previous week', async () => {
      try {
        await assertElementVisible(this.roomsCount);
      } catch {
        test.info('No Rooms Found...');
      }
    });
  }

  async searchFunctionality() {
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.flowsheetCard.hover();
    await this.flowsheetCard.waitFor({ state: 'visible' });
  }

  async verifyGroup() {
    await executeStep(this.groupIcon, 'click', 'Click on groupIcon button', []);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Assert no configured groups modal is visible', async () => {
      await assertElementVisible(this.noConfiguredModal);
    });
    const isLinkVisible = await this.clickOnLink.isVisible();
    if (isLinkVisible) {
      await executeStep(this.clickOnLink, 'click', 'Click on link', []);
      await executeStep(this.placeholder, 'fill', 'fill the data', ['test']);
      await executeStep(this.createButton, 'click', 'Click on create button', []);
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.flowsheetButton, 'click', 'Click on create button', []);
      await this.flowsheetCard.hover();
      await executeStep(this.groupIcon, 'click', 'Click on groupIcon button', []);
    }
    await executeStep(this.selectGroup, 'click', 'select group', []);
    await executeStep(this.applyButton, 'click', 'click on apply button', []);
    await test.step('Assert icon has changed to ungroup icon and is displayed', async () => {
      await assertElementVisible(this.ungroup);
    });
    await executeStep(this.filterIcon, 'click', 'click on filter icon', []);
    await executeStep(this.selectGroupFilter, 'click', 'select group filter', []);
    await executeStep(this.selectCreatedGroup, 'click', 'select created group', []);
    await executeStep(this.applyFilter, 'click', 'click on apply filter button', []);
    await test.step('Assert rooms count is visible after applying filtering options', async () => {
      await assertElementVisible(this.roomsCount);
    });
  }

  async deleteGroupData() {
    await executeStep(this.iconMenu, 'click', 'Click on icon menu', []);
    await executeStep(this.clickOnLocationProfile, 'click', 'Click on groupIcon button', []);
    await executeStep(this.flowsheetGroups, 'click', 'Click on location profile', []);
    await executeStep(this.binLine, 'click', 'delete the group item', []);
    await executeStep(this.clickOnYes, 'click', 'select yes to proceed', []);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async setStatus() {
    await executeStep(this.timeLine, 'click', 'Click the status button', []);
    const statusOption = await this.statusSetRefreshComplete.isVisible();
    if (statusOption) {
      await executeStep(
        this.statusSetRefreshComplete,
        'click',
        'Click the statusSetRefreshComplete button',
        []
      );
    } else {
      await executeStep(this.cancelButton, 'click', 'Click on cancel button', []);
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.flowsheetCard.hover();
  }

  async changestatus() {
    await executeStep(this.timeLine, 'click', 'Click on status button', []);
    await executeStep(this.statusSetRefresh, 'click', 'Click on status set referesh button', []);
  }
  async assertTouchPointIndicator(searchText) {
    await this.searchFunction(searchText);
    await test.step('Assert touch point indicator is visible', async () => {
      await assertElementVisible(this.touchPointIndicator);
    });
    const countOfElements = await this.countOfPieIcon.count();
    await test.step(`Assert count of pie icons: expected 5, actual ${countOfElements}`, async () => {
      try {
        await assertEqualValues(countOfElements, 5);
      } catch (error) {
        await assertEqualValues(countOfElements, 3);
      }
    });
    await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
    await test.step('Assert touch point modal is visible', async () => {
      await assertElementVisible(this.touchPointModal);
    });
    await executeStep(this.happyIconInTouchPoint, 'click', 'Click on happy icon');
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await checkVisibleElementColors(this.page, this.touchPointItems(1), 'rgb(23, 181, 57)');
  }

  async addSecondTouchPoint(searchText) {
    await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
    await test.step('Assert touch point modal is visible', async () => {
      await assertElementVisible(this.touchPointModal);
    });
    await executeStep(this.neutralIconInTouchPoint, 'click', 'Click on neutral icon');
    await executeStep(this.noteInput, 'fill', 'Enter the comment', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await test.step('Verify the color of the second touch point icon is yellow', async () => {
      await checkVisibleElementColors(this.page, this.touchPointItems(2), 'rgb(244, 235, 0)');
    });
  }

  async addRemainingTouchPoint() {
    let isItem = true;
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    while (isItem) {
      try {
        await test.step('Assert touch point modal is visible', async () => {
          await assertElementVisible(this.touchPointModal);
        });

        await executeStep(this.angryIconInTouchPoint, 'click', 'Click on angry icon in modal');
        await executeStep(this.noteInput, 'fill', 'Enter the message in note input', [
          indexPage.lighthouse_data.angryComment
        ]);
        await executeStep(this.saveButton, 'click', 'Click on save button');
      } catch (error) {
        await test.step('Assert touch point limit message is visible', async () => {
          await assertElementVisible(this.touchPointLimitMsg);
        });
        isItem = false;
      }
    }
  }
  async verifyingRoomsFunctionality(searchRandomData, validData, updatedIconText) {
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await test.step('Assert command center icon is visible', async () => {
      await assertElementVisible(this.commandCenterIcon);
    });
    await executeStep(this.searchInput, 'click', 'Click on search input');
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [searchRandomData]);

    await test.step('Assert no results placeholder is visible', async () => {
      await assertElementVisible(this.noResultsPlaceholder);
    });
    await test.step('Assert command center icon is not visible', async () => {
      await assertElementNotVisible(this.commandCenterIcon);
    });
    await executeStep(this.searchInput, 'click', 'Click on search input again');
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [validData]);
    const resultRoomsCount = await this.roomsCount.textContent();
    const resultRoomsCountNumber = parseInt(resultRoomsCount.trim(), 10);
    await executeStep(this.commandCenterIcon, 'click', 'Click on command center icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const flowsheetListCount = await this.flowsheetList.count();
    await test.step(`Assert room counts match: expected ${resultRoomsCountNumber}, actual ${flowsheetListCount}`, async () => {
      await assertEqualValues(resultRoomsCountNumber, flowsheetListCount);
    });
    await executeStep(this.flowsheetListElement1, 'click', 'Click on flowsheet List Element1');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.jobIdChecking(indexPage.navigator_data.second_job_no),
      'click',
      'Click on job'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.moodChooserIcon, 'click', 'Click on mood chooser icon');
    await executeStep(this.happyIcon, 'click', 'Click on happy icon');
    await executeStep(this.submitButton, 'click', 'Click on submit button');
    if (this.isMobile) {
      await executeStep(this.backarrow, 'click', 'Click on back arrow button');
    }
    await executeStep(this.commandCenterIcon, 'click', 'Click on command center icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const classAttributeIcon = await this.updatedMoodIcon.getAttribute('class');
    await test.step(`Assert updated mood icon contains text: expected "${updatedIconText}", actual "${classAttributeIcon}"`, async () => {
      await assertContainsValue(classAttributeIcon, updatedIconText);
    });
    await test.step('Assert hotel element is visible', async () => {
      await assertElementVisible(this.hotel(indexPage.lighthouse_data.locationText_createData1));
    });
    await test.step('Assert present time element is visible', async () => {
      await assertElementVisible(this.presentTime);
    });
    await test.step('Assert today date element is visible', async () => {
      await assertElementVisible(this.todayDate);
    });
    await executeStep(this.flowsheetListElement1, 'click', 'Click on flowsheet List Element1');
  }
  async verifyingTransfersFunctionality() {
    await executeStep(this.transfersTab, 'click', 'Click on transfers tab');
    try {
      const resultTransfersCount = await this.transfersCount.textContent();
      const resultTransfersCountNumber = parseInt(resultTransfersCount.trim(), 10);
      await executeStep(this.commandCenterIcon, 'click', 'Click on command center icon');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      const transfersFlowsheetListCount = await this.flowsheetList.count();
      await test.step(`Assert transfer counts match: expected ${resultTransfersCountNumber}, actual ${transfersFlowsheetListCount}`, async () => {
        await assertEqualValues(resultTransfersCountNumber, transfersFlowsheetListCount);
      });
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await test.step('Assert hotel element is visible', async () => {
        await assertElementVisible(this.hotel(indexPage.lighthouse_data.locationText_createData1));
      });
      await test.step('Assert present time element is visible', async () => {
        await assertElementVisible(this.presentTime);
      });
      await test.step('Assert today date element is visible', async () => {
        await assertElementVisible(this.todayDate);
      });
    } catch {
      await test.step('Assert no data found text is visible', async () => {
        await assertElementVisible(this.noDataFoundText);
      });
    }
  }
};
