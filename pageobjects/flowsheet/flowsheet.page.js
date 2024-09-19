require('dotenv').config();
const { assert } = require('console');
const { executeStep } = require('../../utils/action');
const {
  todayDate,
  nextDayDate,
  scrollElement,
  assertElementVisible,
  assertEqualValues,
  assertIsNumber
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
    this.selectLocation = this.page.locator("//span[contains(text(),'1137-Hotel Del Coronado')]");
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
  }

  async changeLocation(locationId) {
    await executeStep(this.locationDiv, 'click', 'Click the location div', []);
    await executeStep(this.searchLocation, 'fill', 'Fill the search location field', [locationId]);
    await executeStep(this.selectLocation, 'click', 'Select the location', []);
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
    await executeStep(this.crossButton, 'click', 'Click the cross button', []);
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
    await this.changeLocation(indexPage.lighthouse_data.locationId);
    beforeRoomCount = await this.roomsCount.textContent();
    await this.searchFunction(indexPage.lighthouse_data.invalidText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.noResultsPlaceholder);
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.jobIdChecking(indexPage.navigator_data.second_job_no));
    const inputValueBeforeDateChange = await this.searchInput.inputValue();
    await this.dateChangeChecking();
    const inputValueAfterDateChange = await this.searchInput.inputValue();
    await assertEqualValues(inputValueAfterDateChange, inputValueBeforeDateChange);
    await this.backToTodayDate();
    await this.clickOnCrossButton();
    afterRoomCount = await this.roomsCount.textContent();
    assertEqualValues(beforeRoomCount, afterRoomCount);
    await this.scrollAction();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    const roomCount_lowerCase = await this.roomsCount.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnCrossButton();
    await this.searchFunction(indexPage.navigator_data.order_name.toUpperCase().trim());
    const roomCount_upperCase = await this.roomsCount.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertEqualValues(roomCount_lowerCase, roomCount_upperCase);
  }

  async flowsheetFilter() {
    roomsreturned = await this.roomsCount.textContent();
    await executeStep(this.filterIcon, 'click', 'Click the filter button', []);
    await executeStep(this.sortTab, 'click', 'click on sort button', []);
    await executeStep(this.customerName, 'click', 'Click the customer name button', []);
    await executeStep(this.actionTab, 'click', 'Click the action tab', []);
    await executeStep(this.strikeReset, 'click', 'Click the strike reset button', []);
    await executeStep(this.applyFilter, 'click', 'Click the apply filter button', []);
    await assertElementVisible(this.noResultsPlaceholder);
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await assertIsNumber(roomsreturned);
  }
  async sorting() {
    await executeStep(this.filterIcon, 'click', 'Click the filter button', []);
    await executeStep(this.clearFilter, 'click', 'Click the clear filter button', []);
    await assertIsNumber(roomsreturned);
    await executeStep(this.filterIcon, 'click', 'Click the filter button', []);
    await executeStep(this.sortTab, 'click', 'click on sort button', []);
    await executeStep(this.customerName, 'click', 'Click the customer name button', []);
    await executeStep(this.applyFilter, 'click', 'Click on apply filter button', []);
  }
  async clickonPreviousWeek() {
    await executeStep(this.previousweekIcon, 'click', 'click on previous week icon', []);
  }
  async assertCalendarHasDates() {
    await executeStep(this.previousweekIcon, 'click', 'click on previous icon', []);
    await executeStep(this.todayButton, 'click', 'click on today button', []);
    const datelocator = await this.dateElement(todayDate()).textContent();
    const getTodayDate = await todayDate();
    await assertEqualValues(datelocator, getTodayDate);
    await this.dateChangeChecking();
    await this.backToTodayDate();
  }
};
