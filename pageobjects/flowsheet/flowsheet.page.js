require('dotenv').config();
const { executeStep }=require( "../../utils/action");
const { todayDate, nextDayDate,scrollElement,assertElementVisible,assertEqualValues} = require("../../utils/helper");
const indexPage = require("../../utils/index.page");
let beforeRoomCount,afterRoomCount;
exports.FlowSheetPage = class FlowSheetPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.searchInput = this.page.locator("//input[@name='search-field']");
    this.noResultsPlaceholder = this.page.locator("//span[text()=' No results match your filter settings ']");
    this.locationDiv = this.page.locator("//app-header//app-notifications/../div");
    this.searchLocation = this.page.locator("//input[@placeholder='Search location']");
    this.selectLocation = this.page.locator("//span[contains(text(),'1137-Hotel Del Coronado')]");
    this.roomsCount = this.page.locator("//div[text()=' Rooms ']/following-sibling::div");
    this.crossButton = this.page.locator("//icon[@name='cross_line']");
    this.flowsheetDiv = this.page.locator("//div[@class='flex']/child::div[1]");
    this.jobIdChecking = (jobId) => this.page.locator(`//span[contains(text(), '#${jobId}')]`);
    this.dateElement = (date) => this.page.locator(`//span[text()='${date}']`);
  }
 
  async changeLocation(locationId) {
    await executeStep(this.locationDiv, "click", "Click the location div", []);
    await executeStep(this.searchLocation, "fill", "Fill the search location field", [locationId]);
    await executeStep(this.selectLocation, "click", "Select the location", []);
  }
 
  async searchFunction(searchText) {
    await executeStep(this.searchInput, "fill", "Fill the search input field", [searchText]);
  }
 
  async dateChangeChecking() {
    await executeStep(this.dateElement(nextDayDate()), "click", "Click on the next day date element", []);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
 
  async backToTodayDate() {
    await executeStep(this.dateElement(todayDate()), "click", "Click on the today date element", []);
  }
 
  async clickOnCrossButton() {
    await executeStep(this.crossButton, "click", "Click the cross button", []);
  }
 
  async scrollAction() {
    const div = await this.flowsheetDiv;
    await scrollElement(div, "bottom");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, "top");
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
    await assertElementVisible(this.noResultsPlaceholder)
    await this.searchFunction(indexPage.navigator_data.second_job_no);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.jobIdChecking(indexPage.navigator_data.second_job_no))
    const inputValueBeforeDateChange = await this.searchInput.inputValue();
    await this.dateChangeChecking();
    const inputValueAfterDateChange = await this.searchInput.inputValue();
    await assertEqualValues(inputValueAfterDateChange,inputValueBeforeDateChange);
    await this.backToTodayDate();
    await this.clickOnCrossButton();
    afterRoomCount = await this.roomsCount.textContent();
    assertEqualValues(beforeRoomCount,afterRoomCount);
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
}