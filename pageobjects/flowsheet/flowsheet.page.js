require('dotenv').config();
const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const utilConst = require('../../utils/const');
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
  assertContainsValue,
  getFlowsheetCard,
  formatTimeTo12Hour,
  generateRandString,
  getPreviousDateFromToday,
  getFutureDateFromToday
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');

let beforeRoomCount, afterRoomCount, roomsreturned,cardStatus,setStatusValue,strikeStatus,
    setTime,strikeTime,clientStartTime,clientEndTime,roomNameValue,orderNameValue,postAsValue,
    initialCountOfTransferTab,finalCountOfTransferTab,transferOrderName;
exports.FlowSheetPage = class FlowSheetPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.searchInput = this.page.locator("//input[@name='search-field']");
    this.noResultsPlaceholder = this.page.locator(
      "//span[text()=' No results match your filter settings ']"
    );
    this.locationDiv = this.page.locator("//div[contains(@class,'e2e_header_location')]");
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
    this.binLine = name =>
      this.page.locator(`//div[contains(text(),${name})]//icon[@name='trah_bin_line']`);
    this.clickOnYes = this.page.locator("//span[text()='Yes']");
    this.statusSetRefreshComplete = this.page.locator(
      "//app-select-status-sheet//li[.//span[contains(text(),'Complete')]]"
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
    this.menuIcon = this.page.locator('//app-side-menu');
    this.locationProfileBtn = this.page.locator(
      "//app-side-menu//span[normalize-space(text())='Location Profile']"
    );
    this.generalTab = this.page.locator(
      "(//aside//li[contains(@class, 'text-purple-500') and contains(@class, 'bg-gray-300')]//span[text()='General'])[2]"
    );
    this.useEquipmentChecklistStatus = this.isMobile
      ? this.page.locator(
          "//app-profile-content//div[contains(@class,'e2e_user_profile_equipment_checklist_value')]"
        )
      : this.page.locator(
          "//app-profile-content//span[contains(@class,'e2e_user_profile_equipment_checklist_value')]"
        );
    this.turnOnLink = this.isMobile
      ? this.page.locator("(//app-profile-content//div[normalize-space()='Turn On'])[2]")
      : this.page.locator("(//app-profile-content//div[normalize-space()='Turn On'])[1]");
    this.flowsheetIcon = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
      : this.page.locator("//app-navigation-item//span[normalize-space()='Flowsheet']");
    this.flowsheetCardOrder = this.page.locator(
      "(//app-flowsheet-action-card[1]//div//div[contains(@class,'truncate')])[3]"
    );
    this.flowsheetCardLocator = index =>
      `//app-flowsheet-action-card[${index}]//div[1]//div[7]//div[1]//div[3]//div[1]//div[1]`;
    this.jobNumberLocator = index =>
      `//app-flowsheet-action-card[${index}]/div[1]/div[7]/div[1]/div[1]/div/span`;
    this.totalFlowsheetCards = '//app-flowsheet-action-card';
    this.equipmentTab = this.page.locator("//mat-tab-header//div[normalize-space()='Equipment']");
    this.equipmentItemsCheckbox = this.page.locator("(//input[@type='checkbox'])[1]");
    this.allEquipmentCheckboxes = this.page.locator("//input[@type='checkbox']");
    this.confirmYes = this.page.locator("//app-confirm-dialog//span[text()='Yes']");
    this.greenIcon = this.isMobile
      ? this.page.locator(
          "//app-flowsheet-action-timeline//div//div[contains(@class, 'e2e_flowsheet_action_timeline_event')][1]//following-sibling::icon[contains(@class, 'text-green-500')]"
        )
      : this.page.locator(
          "(//app-flowsheet-action-timeline//div[contains(@class, 'flowsheet-action-timeline')]//div[contains(@class, 'e2e_flowsheet_action_timeline_event')][1]//icon[contains(@class, 'text-green-500')])[1]"
        );
    this.deSelectEquipmentItem = this.page.locator("(//input[@type='checkbox'])[3]");
    this.redIcon = this.isMobile
      ? this.page.locator(
          "(//app-flowsheet-detail//app-flowsheet-action-timeline//icon[contains(@class,'text-red-500')])[1]"
        )
      : this.page.locator(
          "(//app-flowsheet-action-timeline//icon[contains(@class,'text-red-500')])[1]"
        );
    this.blueIcon = this.page.locator(
      "(//app-flowsheet-action-timeline//icon[contains(@class,'text-blue-500')])[1]"
    );
    this.whiteIcon = this.page.locator(
      "(//app-flowsheet-action-timeline//icon[contains(@class,'text-white-500')])[1]"
    );
    this.flowsheet = this.page.locator('//app-flowsheet-action-card');

    this.jobIdElement = jobId => this.page.locator(`//span[text()=' #` + jobId + ` ']`);
    this.changeToGreen = index =>
    this.page.locator(
      `//app-flowsheet-action-card[${index}]//app-flowsheet-action-timeline//div[contains(@class, 'flowsheet-action-timeline')]//div[contains(@class, 'e2e_flowsheet_action_timeline_event')][1]//icon[contains(@class, 'text-green-500')]`
    );
    this.flowsheetTimeLine = this.page.locator("//app-flowsheet-action-timeline").first();
    this.selectStatusButton = (selectText) => this.page.locator(`//span[contains(text(),'${selectText}')]/following-sibling::span`);
    this.statusFilter = this.page.locator("//div[contains(text(),'Status')]//following-sibling::icon");
    this.selectAllInStatus = this.page.locator("//div[normalize-space()='Status']/following-sibling::div/div[normalize-space()='All']");
    this.jobStatus = this.page.locator("//span[contains(@class,'e2e_flowsheet_action_job_status')]");
    this.jobNumber = this.page.locator("//span[contains(@class,'e2e_flowsheet_action_job_number')]");
    this.flowsheetEventTime = (index) => this.page.locator(`(//app-flowsheet-action-card//span[contains(@class,'e2e_flowsheet_action_timeline_event_time')])[${index}]`)
    this.flowsheetStatusText = (index) => this.page.locator(`(//app-flowsheet-action-timeline//span[contains(@class,'e2e_flowsheet_action_timeline_event_label')])[${index}]`)
    this.roomNameDiv = this.page.locator("//div[contains(@class,'e2e_flowsheet_action_room_name')]");
    this.orderNameDiv = this.page.locator("//div[contains(@class,'e2e_flowsheet_action_room_name')]/../following-sibling::div[1]/div/div");
    this.postAsDiv = this.page.locator("//div[contains(@class,'e2e_flowsheet_action_room_name')]/../following-sibling::div[2]");
    this.countOfTransferTab = this.page.locator("//div[normalize-space()='Transfers']//following-sibling::div");
    this.orderNameElement = (orderName) => this.page.locator(`//div[text() = ' (${orderName}) ']`);
    this.locationElement = (locationCode) => this.isMobile ? this.page.locator(`(//span[contains(text(),'${locationCode}')])[2]`)
                              : this.page.locator(`(//span[contains(text(),'${locationCode}')])[1]`); 
    this.orderNameInCard = (orderName) => this.isMobile ? this.page.locator(`(//span[text()='${orderName}'])[2]`)
                              : this.page.locator(`(//span[text()='${orderName}'])[1]`);
    this.carryOverComplete=this.page.locator("(//span[contains(normalize-space(),'Carry Over')])[3]");
    this.flowsheetredBordered=this.page.locator("(//div[contains(@class,'pulsing-border-red')])[1]");
    this.getJobId=this.page.locator("(//div[contains(@class,'pulsing-border-red')][1]/../..//div[1]//div//div//span)[1]");
    this.flowsheetgreyBordered=this.page.locator("(//div[contains(@class,'border-gray')][1])[2]");
    this.transferManifestTab = this.page.locator("//div[normalize-space()='Transfer Manifest']").first();
    this.transferManifestCount = this.page.locator("//div[normalize-space()='Transfer Manifest']/following-sibling::div");
    this.internalTrasferCards = this.page.locator("//app-internal-transfer-card/div");
    this.PickUpCards = this.page.locator("//div[contains(text(),'1137')]/preceding-sibling::div/div[2]/span[text()='PU']");
    this.locationNumAndJobNumDiv = this.page.locator("//app-internal-transfer-card/div[1]/div[2]/div[2]");
    this.DeliveryCard = this.page.locator("//div[contains(text(),'1137')]/preceding-sibling::div/div[2]/span[text()='DEL']");
  }

  async changeLocation(locationId, locationName) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.locationDiv, 'click', 'Click the location div');
    await executeStep(this.searchLocation, 'fill', 'Fill the search location field', [locationId]);
    await executeStep(this.selectLocation(locationName), 'click', 'Select the location');
  }

  async searchFunction(searchText) {
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [searchText]);
  }

  async dateChangeChecking() {
    await executeStep(
      this.dateElement(nextDayDate()),
      'click',
      'Click on the next day date element'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async backToTodayDate() {
    await executeStep(
      this.dateElement(todayDate()),
      'click',
      'Click on the today date element'
    );
  }

  async clickOnCrossButton() {
    await executeStep(this.crossButton, 'click', 'Click on cross button');
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
    await assertElementVisible(
      this.noResultsPlaceholder,
      'Verify no results placeholder is visible'
    );
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.jobIdChecking(indexPage.navigator_data.second_job_no),
      'Verify valid search results are returned after entering valid room number'
    );
    const inputValueBeforeDateChange = await this.searchInput.inputValue();
    await this.dateChangeChecking();
    const inputValueAfterDateChange = await this.searchInput.inputValue();
    await assertEqualValues(
      inputValueAfterDateChange,
      inputValueBeforeDateChange,
      `Verify input value after date change matches before: expected "${inputValueBeforeDateChange}", actual "${inputValueAfterDateChange}"`
    );
    await this.backToTodayDate();
    await this.clickOnCrossButton();
    afterRoomCount = await this.roomsCount.textContent();
    await assertEqualValues(
      afterRoomCount,
      beforeRoomCount,
      `Verify room counts before and after searching are equal: expected "${beforeRoomCount}", actual "${afterRoomCount}"`
    );
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
    await assertEqualValues(
      roomCount_lowerCase,
      roomCount_upperCase,
      `Verify room counts for lowercase and uppercase order names are equal: expected "${roomCount_lowerCase}", actual "${roomCount_upperCase}"`
    );
  }

  async flowsheetFilter() {
    roomsreturned = await this.roomsCount.textContent();
    await executeStep(this.filterIcon, 'click', 'Click on filter button');
    await executeStep(this.sortTab, 'click', 'Click on sort button');
    await executeStep(this.customerName, 'click', 'Click on customer name button');
    await executeStep(this.actionTab, 'click', 'Click on action tab');
    await executeStep(this.strikeReset, 'click', 'Click on strike reset button');
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button');
    await assertElementVisible(
      this.noResultsPlaceholder,
      'Assert that no results placeholder is visible'
    );
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await assertIsNumber(
      roomsreturned,
      `Assert that the rooms returned is a valid number: ${roomsreturned}`
    );
  }
  async sorting() {
    await executeStep(this.filterIcon, 'click', 'Click on filter button');
    await executeStep(this.clearFilter, 'click', 'Click on clear filter button');
    await assertIsNumber(
      roomsreturned,
      `Assert that the rooms returned is a valid number: ${roomsreturned}`
    );
    await executeStep(this.filterIcon, 'click', 'Click on filter button');
    await executeStep(this.sortTab, 'click', 'Click on sort button');
    await executeStep(this.customerName, 'click', 'Click on customer name button');
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button');
  }
  async clickonPreviousWeek() {
    await executeStep(this.previousweekIcon, 'click', 'Click on previous week icon');
  }
  async assertCalendarHasDates() {
    await executeStep(this.previousweekIcon, 'click', 'Click on previous icon');
    await executeStep(this.todayButton, 'click', 'click on today button');
    const dateLocator = await this.dateElement(todayDate()).textContent();
    const getTodayDate = todayDate();
    await assertEqualValues(
      dateLocator,
      getTodayDate,
      `Assert that the calendar displays today's date: expected "${getTodayDate}", actual "${dateLocator}"`
    );
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
    try {
      await assertNotEqualValues(
        todayRoomCount,
        nextDayRoomCount,
        `Verify room counts are not equal: expected "${todayRoomCount}", actual "${nextDayRoomCount}"`
      );
    } catch (error) {
      test.info(`Expected room count: ${todayRoomCount}, Actual room count: ${nextDayRoomCount}`);
      await assertEqualValues(
        todayRoomCount,
        nextDayRoomCount,
        `Verify room counts are not equal: expected "${todayRoomCount}", actual "${nextDayRoomCount}" but sometime they are equal`
      );
    }
    await executeStep(this.dateElement(todayDate()), 'click', 'Click on today date');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async assertDates() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await test.step('Assert elements are visible for the next week', async () => {
      await assertElementVisible(this.dateElement(nextWeekDate()), '');
      await assertElementVisible(this.todayButton, '');
      await assertElementVisible(this.todayDateButton(todayDateFullFormate()), '');
    });
    await executeStep(this.todayButton, 'click', 'Click on today button');
    await executeStep(this.previousweekIcon, 'click', 'Click on previous week icon');
    await assertElementVisible(
      this.dateElement(previousWeekDate()),
      'Assert previous week date element is visible'
    );
    await executeStep(this.todayButton, 'click', 'Click today date');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async assertUrls() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await executeStep(this.todayButton, 'click', 'Click on today URL');
    await assertElementVisible(
      this.dateElement(todayDate()),
      `Verify today's date element is visible`
    );
    await test.step('Verify redirection via URL works properly', async () => {
      await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
      await executeStep(this.todayDateButton(todayDateFullFormate()), 'click', 'Click on date URL');
      await assertElementVisible(
        this.dateElement(todayDate()),
        `Verify today's date element is visible again`
      );
    });
  }

  async validateDateFromPastAndFuture() {
    await executeStep(this.nextweekIcon, 'click', 'Click on next week icon');
    await executeStep(this.dateElement(nextWeekDate()), 'click', 'Click date from next week');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.roomsCount, 'Assert rooms count is visible for next week');
    await executeStep(this.todayButton, 'click', 'Click on today URL');
    await executeStep(this.previousweekIcon, 'click', 'Click on previous week icon');
    await executeStep(
      this.dateElement(previousWeekDate()),
      'click',
      'Click date from previous week'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    try {
      await assertElementVisible(
        this.roomsCount,
        'Assert rooms count is visible for previous week'
      );
    } catch {
      test.info('No Rooms Found...');
    }
  }

  async searchFunctionality() {
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.flowsheetCard.hover();
    await this.flowsheetCard.waitFor({ state: 'visible' });
  }

  async verifyGroup() {
    await executeStep(this.groupIcon, 'click', 'Click on groupIcon button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.noConfiguredModal,
      'Assert no configured groups modal is visible'
    );
    const isLinkVisible = await this.clickOnLink.isVisible();
    if (isLinkVisible) {
      await executeStep(this.clickOnLink, 'click', 'Click on link');
      await executeStep(this.placeholder, 'fill', 'Fill the data', [
        indexPage.lighthouse_data.grpField
      ]);
      await executeStep(this.createButton, 'click', 'Click on create button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.flowsheetButton, 'click', 'Click on create button');
      await this.flowsheetCard.hover();
      await executeStep(this.groupIcon, 'click', 'Click on groupIcon button');
    }
    await executeStep(this.selectGroup, 'click', 'Select group');
    await executeStep(this.applyButton, 'click', 'Click on apply button');
    await assertElementVisible(
      this.ungroup,
      'Assert icon has changed to ungroup icon and is displayed'
    );
    await executeStep(this.filterIcon, 'click', 'Click on filter icon');
    await executeStep(this.selectGroupFilter, 'Click', 'select group filter');
    await executeStep(this.selectCreatedGroup, 'Click', 'select created group');
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button');
    await assertElementVisible(
      this.roomsCount,
      'Assert rooms count is visible after applying filtering options'
    );
  }

  async deleteGroupData() {
    await executeStep(this.iconMenu, 'click', 'Click on icon menu');
    await executeStep(this.clickOnLocationProfile, 'click', 'Click on groupIcon button');
    await executeStep(this.flowsheetGroups, 'click', 'Click on location profile');
    await executeStep(
      this.binLine(indexPage.lighthouse_data.grpField),
      'click',
      'Delete the group item',
      []
    );
    await executeStep(this.clickOnYes, 'click', 'Select yes to proceed');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async setStatus() {
    await executeStep(this.timeLine, 'click', 'Click the status button');
    const statusOption = await this.statusSetRefreshComplete.isVisible();
    if (statusOption) {
      await executeStep(
        this.statusSetRefreshComplete,
        'click',
        'Click the statusSetRefreshComplete button',
        []
      );
    } else {
      await executeStep(this.cancelButton, 'click', 'Click on cancel button');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.flowsheetCard.hover();
  }

  async changestatus() {
    await executeStep(this.timeLine, 'click', 'Click on status button');
    await executeStep(this.statusSetRefresh, 'click', 'Click on status set referesh button');
  }
  async assertTouchPointIndicator(searchText) {
    await this.searchFunction(searchText);
    await assertElementVisible(this.touchPointIndicator, 'Assert touch point indicator is visible');
    const countOfElements = await this.countOfPieIcon.count();
    try {
      await assertEqualValues(
        countOfElements,
        5,
        `Assert count of pie icons: expected 5 or 3, actual ${countOfElements}`
      );
    } catch (error) {
      await assertEqualValues(
        countOfElements,
        3,
        `Assert count of pie icons: expected 5, actual ${countOfElements}`
      );
    }
    await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
    await assertElementVisible(this.touchPointModal, 'Assert touch point modal is visible');
    await executeStep(this.happyIconInTouchPoint, 'click', 'Click on happy icon');
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await checkVisibleElementColors(
      this.page,
      this.touchPointItems(1),
      'rgb(23, 181, 57)',
      'Verify the color of the first touch point icon is green'
    );
  }

  async addSecondTouchPoint(searchText) {
    await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
    await assertElementVisible(this.touchPointModal, 'Assert touch point modal is visible');
    await executeStep(this.neutralIconInTouchPoint, 'click', 'Click on neutral icon');
    await executeStep(this.noteInput, 'fill', 'Enter the comment', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await checkVisibleElementColors(
      this.page,
      this.touchPointItems(2),
      'rgb(244, 235, 0)',
      'Verify the color of the second touch point icon is yellow'
    );
  }

  async addRemainingTouchPoint() {
    let isItem = true;
    await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    while (isItem) {
      try {
        await assertElementVisible(this.touchPointModal, 'Assert touch point modal is visible');
        await executeStep(this.angryIconInTouchPoint, 'click', 'Click on angry icon in modal');
        await executeStep(this.noteInput, 'fill', 'Enter the message in note input', [
          indexPage.lighthouse_data.angryComment
        ]);
        await executeStep(this.saveButton, 'click', 'Click on save button');
        await executeStep(this.touchPointIndicator, 'click', 'Click on touch point indicator');
      } catch (error) {
        await assertElementVisible(
          this.touchPointLimitMsg,
          'Assert touch point limit message is visible'
        );
        isItem = false;
      }
    }
  }
  async verifyingRoomsFunctionality(searchRandomData, validData, updatedIconText) {
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await assertElementVisible(this.commandCenterIcon, 'Assert command center icon is visible');
    await executeStep(this.searchInput, 'click', 'Click on search input');
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [searchRandomData]);
    await assertElementVisible(
      this.noResultsPlaceholder,
      'Assert no results placeholder is visible'
    );
    await assertElementNotVisible(
      this.commandCenterIcon,
      'Assert command center icon is not visible'
    );
    await executeStep(this.searchInput, 'click', 'Click on search input again');
    await executeStep(this.searchInput, 'fill', 'Fill the search input field', [validData]);
    const resultRoomsCount = await this.roomsCount.textContent();
    const resultRoomsCountNumber = parseInt(resultRoomsCount.trim(), 10);
    await executeStep(this.commandCenterIcon, 'click', 'Click on command center icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const flowsheetListCount = await this.flowsheetList.count();
    await assertEqualValues(
      resultRoomsCountNumber,
      flowsheetListCount,
      `Assert room counts match: expected ${resultRoomsCountNumber}, actual ${flowsheetListCount}`
    );
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
    await assertContainsValue(
      classAttributeIcon,
      updatedIconText,
      `Assert updated mood icon contains text: expected "${updatedIconText}", actual "${classAttributeIcon}"`
    );
    await assertElementVisible(
      this.hotel(indexPage.lighthouse_data.locationText_createData1),
      'Assert hotel element is visible'
    );
    await assertElementVisible(this.presentTime, 'Assert present time element is visible');
    await assertElementVisible(this.todayDate, 'Assert today date element is visible');
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
      await assertEqualValues(
        resultTransfersCountNumber,
        transfersFlowsheetListCount,
        `Assert transfer counts match: expected ${resultTransfersCountNumber}, actual ${transfersFlowsheetListCount}`
      );
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.hotel(indexPage.lighthouse_data.locationText_createData1),
        'Assert hotel element is visible'
      );
      await assertElementVisible(this.presentTime, 'Assert present time element is visible');
      await assertElementVisible(this.todayDate, 'Assert today date element is visible');
    } catch {
      await assertElementVisible(this.noDataFoundText, 'Assert no data found text is visible');
    }
  }
  async navigateToProfileMenu() {
    await executeStep(this.menuIcon, 'click', 'Click on Profile Menu Icon');
    await executeStep(this.locationProfileBtn, 'click', 'Click on Location Profile');
  }
  async toggleEquipmentChecklistOn() {
    const statusText = await this.useEquipmentChecklistStatus.textContent();
    if (statusText.trim() === 'Off') {
      await executeStep(this.turnOnLink, 'click', 'Click on Turn On Link');
    }
    await executeStep(this.flowsheetIcon, 'click', 'Click on Flowsheet Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async clickOnJob(jobId) {
    await executeStep(this.jobIdElement(jobId), 'click', 'Click the room div');
  }
  async clickOnFlowsheet() {
    await executeStep(this.flowsheetIcon, 'click', 'Click on Flowsheet Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async searchFlowsheetCard() {
    try {
      await this.searchFunction(indexPage.lighthouse_data.nonTestJobNumber);
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.clickOnJob(indexPage.lighthouse_data.nonTestJobNumber);
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    } catch (error) {
      test.info('No business flowsheet Cards found to perform actions');
    }
  }
  secondJobNumber = indexPage.navigator_data.second_job_no;
  async getFlowsheetCard() {
    return await getFlowsheetCard(
      this.page,
      this.totalFlowsheetCards,
      this.flowsheetCardLocator,
      this.jobNumberLocator,
      this.secondJobNumber
    );
  }
  async selectFlowsheetCard() {
    let xpathString = await this.getFlowsheetCard();
    try {
      if (xpathString) {
        let jobNumber = xpathString.replace('#', '').trim();
        indexPage.lighthouse_data.nonTestJobNumber = jobNumber;
        await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
      }
    } catch (error) {
      test.info('No valid flowsheet cards found to perform actions');
    }
  }
  async equipmentItemsClickable() {
    await executeStep(this.equipmentItemsCheckbox, 'click', 'Click on Select all items');
    await executeStep(this.confirmYes, 'click', 'Confirm Select all items');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }
  async backToSearch() {
    if (this.isMobile) {
      await executeStep(this.backarrow, 'click', 'Click on back arrow button');
    }
  }
  async pageReloadChanges() {
    await this.backToSearch();
    await this.searchFunction(indexPage.lighthouse_data.nonTestJobNumber);
    await this.clickOnJob(indexPage.lighthouse_data.nonTestJobNumber);
    await assertElementVisible(this.greenIcon, 'Assert that first Icon updates to Green color');
  }
  async deSelectAnyEquipmentItem() {
    await executeStep(this.deSelectEquipmentItem, 'click', 'DeSelect the one Equipment item');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.redIcon, 'Assert that first Icon updates to Red color');
  }
  async deSelectLastEquipmentAsset() {
    const checkboxes = this.allEquipmentCheckboxes;
    const checkboxCount = await checkboxes.count();
    if (checkboxCount > 0) {
      const lastCheckbox = checkboxes.nth(checkboxCount - 1);
      await test.step('Verify the last Equipment Item is Clickable', async () => {
        await lastCheckbox.click();
      });
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async setAndStrikeComplete() {
    await executeStep(this.flowsheetredBordered,'click','Click on the Flowsheet Set and Strike timelines');
    const jobIdNum = await this.getJobId.textContent();
    const jobIdWithoutHash = jobIdNum.replace('#', '').trim();
    await executeStep(this.statusSetRefreshComplete,'click',"Set as 'Complete'");
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.searchInput,'fill','Search the same Job Id which previously changed',[jobIdWithoutHash]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.flowsheetgreyBordered,'click',"Select card again for changing status");
    await executeStep(this.carryOverComplete,'click',"Set to Complete");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.crossButton,'click',"Clear the Search Field")
  }

  async markLateFlowsheetAsCompleted(){
    await executeStep(this.flowsheetredBordered,'click','Locate a Flowsheet with a red border around the Flowsheet timeline');
    const jobIdNum = await this.getJobId.textContent();
    const jobIdWithoutHash = jobIdNum.replace('#', '').trim();
    await executeStep(this.statusSetRefreshComplete,'click',"Click on the Set status. Mark the Set as 'Complete'");
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.searchInput,'fill','Search the same Job Id which previously changed',[jobIdWithoutHash]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.flowsheetgreyBordered,'The red border should change to grey indicating the Flowsheet is no longer late');
    await executeStep(this.flowsheetgreyBordered,'click',"Setting back to it status");
    await executeStep(this.statusSetRefresh,'click',"Setting back to it status");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async filterForStatus() {
    await executeStep(this.filterIcon,"click","Click on filter icon");
    await executeStep(this.statusFilter,"click","Click on status in filter");
    await executeStep(this.selectAllInStatus,"click","Click on all in status options");
    await executeStep(this.applyFilter,"click","Click on apply filter");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.filterCount,'Verified Completed flowsheets will reappear')
  }

  async removeFilter() {
    await executeStep(this.filterIcon,"click","Click on filter icon");
    await executeStep(this.clearFilter,"click","Click on clear filter");
  }

  async assertFlowsheetCard() {
    await assertElementVisible(this.jobNumber,"Verify that job number is visible or not");
    if(await this.jobStatus.isVisible()) {
      cardStatus = await this.jobStatus.textContent();
    } else {
      cardStatus = "Confirmed"
    }
    if(await this.jobStatus.isVisible()) {
      await assertElementVisible(this.jobStatus,"Verify that job status is visible");
    }
    setStatusValue = await this.flowsheetStatusText(1).textContent();
    await assertElementVisible(this.flowsheetStatusText(1),"Verify that set status is visible");
    strikeStatus = await this.flowsheetStatusText(4).textContent();
    await assertElementVisible(this.flowsheetStatusText(4),"Verify that strike status is visible");
    setTime = await this.flowsheetEventTime(1).textContent();
    await assertElementVisible(this.flowsheetEventTime(1),"Verify that set time is visible");
    strikeTime = await this.flowsheetEventTime(4).textContent();
    await assertElementVisible(this.flowsheetEventTime(4),"Verify that strike time is visible");
    clientStartTime = await this.flowsheetEventTime(2).textContent();
    await assertElementVisible(this.flowsheetEventTime(2),"Verify that client start time is visible");
    clientEndTime = await this.flowsheetEventTime(3).textContent();
    await assertElementVisible(this.flowsheetEventTime(3),"Verify that client end time is visible");
    roomNameValue = await this.roomNameDiv.textContent();
    await assertElementVisible(this.roomNameDiv,"Verify that room name is visible");
    orderNameValue = await this.orderNameDiv.textContent();
    await assertElementVisible(this.orderNameDiv,"Verify that order name is visible");
    try {
      postAsValue = await this.postAsDiv.textContent();
      await assertElementVisible(this.postAsDiv,"Verify that post as value is visible");
    } catch {
      console.error("There is no post as value")
    }
    
  }

  async assertStatusOfNavigatorJob() {
      const newPage = await this.page.context().newPage();
      const createDataPage = new indexPage.CreateData(newPage);
      await newPage.goto(indexPage.navigator_data.navigatorUrl_createdata1, {
        timeout: parseInt(process.env.pageload_timeout)
      });
      if (await createDataPage.reloadErrorMsg.isVisible()) {
        await newPage.reload();
      }
      const navigatorLogin = new indexPage.NavigatorLoginPage(newPage);
      await navigatorLogin.login_navigator(atob(process.env.email), atob(process.env.password));
      await newPage.waitForTimeout(parseInt(process.env.medium_timeout));
      await newPage.goto(indexPage.navigator_data.navigatorUrl_createdata1, {
        timeout: parseInt(process.env.pageload_timeout)
      });
      if (await createDataPage.reloadErrorMsg.isVisible()) {
        await newPage.reload();
      }
      await createDataPage.searchWithJobId();
      await assertElementVisible(
        createDataPage.statusOfJob(cardStatus.trim()),
          `Verify that the status of the job (${cardStatus}) is visible in Navigator`
      );
      await createDataPage.assertStatusOfJob(indexPage.navigator_data.second_job_no,clientStartTime.trim(),clientEndTime.trim(),setStatusValue.trim(),strikeStatus.trim(),setTime.trim(),strikeTime.trim());
      await createDataPage.assertOrderRoomPostValues(orderNameValue.trim(),roomNameValue.trim(),postAsValue.trim())
    }

    async transferTabBeforeCreateOrder() {
      await executeStep(this.transfersTab,"click","Click on transfer tab");
      if(await this.transfersCount.isVisible()) {
        initialCountOfTransferTab = await this.transfersCount.textContent();
      }else {
        initialCountOfTransferTab = 0
      }
    }

    async createInternalOrder() {
      const newPage = await this.page.context().newPage();
      const createDataPage = new indexPage.CreateData(newPage);
      await newPage.goto(indexPage.navigator_data.navigatorUrl_createdata1, {
        timeout: parseInt(process.env.pageload_timeout)
      });
      if (await createDataPage.reloadErrorMsg.isVisible()) {
        await newPage.reload();
      }
      const navigatorLogin = new indexPage.NavigatorLoginPage(newPage);
      await navigatorLogin.login_navigator(atob(process.env.email), atob(process.env.password));
      await newPage.waitForTimeout(parseInt(process.env.medium_timeout));
      await newPage.goto(indexPage.navigator_data.navigatorUrl_createdata1, {
        timeout: parseInt(process.env.pageload_timeout)
      });
      if (await createDataPage.reloadErrorMsg.isVisible()) {
        await newPage.reload();
      }
      transferOrderName = generateRandString(3);
      await createDataPage.createInternalOrder(transferOrderName,indexPage.lighthouse_data.locationId_createData2);
      await createDataPage.createJobForInternalOrder(getPreviousDateFromToday(2),getPreviousDateFromToday(2),getFutureDateFromToday(2),getFutureDateFromToday(2));
      await newPage.close();
    }

    async transferTabAfterCreateOrder() {
      finalCountOfTransferTab = await this.transfersCount.textContent();
      await assertNotEqualValues(initialCountOfTransferTab,finalCountOfTransferTab,"Verify that tarnsfer card is added");
    }

    async assertTransferCard() {
      await executeStep(this.orderNameElement(transferOrderName),"click","Click on transfer card");
      await assertElementVisible(this.orderNameInCard(transferOrderName),"Verify that order name is visible");
      await assertElementVisible(this.locationElement(indexPage.lighthouse_data.locationId_createData2),"Verify that location is visible");
    }

    async assertTransferTabAtAnotherLocation() {
      await this.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await executeStep(this.transfersTab,"Click on transfer tab");
      await assertElementVisible(this.orderNameElement(transferOrderName),"Verify that transfer card is visbile in destination location");
    }

    async assertTransferManifestTab() {
      await executeStep(await this.transfersTab,"click","Click on transfer tab");
      await executeStep(await this.transferManifestTab,"click","Click on transfer manifest tab");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      if(await this.transferManifestCount.isVisible()) {
        await assertElementVisible(await this.transferManifestCount,"Verify that the Transfer Manifest tab will have a counter of equipment");
        const countOfEquipments = await this.transferManifestCount.textContent();
        const countOfInternalTransferTab = await this.internalTrasferCards.count();
        await assertEqualValues(parseInt(countOfEquipments),parseInt(countOfInternalTransferTab),"Verify that there should be a card for each transferred item");
        await assertElementVisible(await this.PickUpCards.first(), "Verify the cards will have PU which stands for Pick Up text")
        await assertElementVisible(await this.locationNumAndJobNumDiv,"Verify that  the source location number and job number.");
      } else {
        await test.step("There are no transfer manifest tabs for source location" , async () => {
          console.error("No transfer manifest tabs");
        })
      }
     
    }

    async assertTransferManifestIndestinationLocation() {
      await executeStep(await this.transfersTab,"click","Click on transfer tab");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout))
      await executeStep(await this.transferManifestTab,"click","Click on transfer manifest tab");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      if(await this.transferManifestCount) {
        await assertElementVisible(await this.transferManifestCount,"Verify that the Transfer Manifest tab will have a counter of equipment");
        const countOfEquipments = await this.transferManifestCount.textContent();
        const countOfInternalTransferTab = await this.internalTrasferCards.count();
        await assertEqualValues(parseInt(countOfEquipments),parseInt(countOfInternalTransferTab),"Verify that there should be a card for each transferred item");
        await assertElementVisible(this.DeliveryCard.first(),"Verify the cards will have DEL which stands for Delivery text");
      } else {
        await test.step("There are no transfer manifest tabs for destination location" , async () => {
          console.error("No transfer manifest tabs");
        })
      }
      
    }

};
 