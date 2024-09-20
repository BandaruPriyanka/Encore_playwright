const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  todayDate,
  nextDayDate,
  scrollElement,
  assertEqualValues,
  assertElementAttributeContains,
  assertIsNumber
} = require('../../utils/helper');
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
require('dotenv').config();
let roomsqty;
exports.CustomersPage = class CustomersPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.customersIcon = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[1]/app-mobile-navigation-item//icon')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[3]//span[contains(text(),Customers)]'
        );
    this.listOfCustomers = this.page.locator('app-customer-card');
    this.customerSearchInput = this.page.locator("//input[@placeholder='Search Customers']");
    this.noDataPlaceholder = this.page.locator("//span[contains(text(),'No data found')]");
    this.customerDiv = this.page.locator("//div[@class='flex']/child::div[1]");
    this.customerList = this.page.locator("//div[text()='Angelina Wood']");
    this.dateSpan = date => this.page.locator(`//span[text()='` + date + `']`);
    this.crossIcon = this.page.locator("//icon[@name='cross_line']");
    this.calendarDiv = this.page.locator('app-date-selector');
    this.dateElement = date => this.page.locator(`//span[text()='${date}']`);
    this.dateHighlighted = date => this.page.locator(`//span[text()='${date}']/parent::div`);
    this.nextweekIcon = this.page.locator("//icon[@title='Next week']");
    this.previousweekIcon = this.page.locator("//icon[@title='Previous week']");
    this.todayButton = this.page.locator("//div[contains(text(),'TODAY')]");
    this.customerCard = this.page.locator('(//app-customer-card)[1]');
    this.opportunityList = this.page.locator("(//div[@role='region']/div/div/div)[1]");
    this.orderName = this.page.locator("//span[contains(@class,'e2e_opportunity_order_name')]");
    this.customerName = this.page.locator(
      "//span[contains(@class,'e2e_opportunity_bill_to_account_name')]"
    );
    this.opportunityDates = this.page.locator("//span[contains(@class,'e2e_opportunity_dates')]");
    this.dynamicTabElement = tabName =>
      this.page.locator(`
    (//div[@role='tab']//span//div[contains(normalize-space(),'${tabName}')])[2]`);

    this.businessCustomer = this.page.locator('(//app-customer-card)[2]');
    this.customerCardBusiness = this.page.locator('(//app-customer-card)[2]');
    this.customerCardOpportunity = this.page.locator(
      "//app-customer-card[2]//div[@role='region']/div"
    );
    this.noDataFoundEle = this.page.locator("//span[contains(normalize-space(),'No data found')]");
    this.roomCount = tabName =>
      this.page.locator(`
    (//div[@role='tab']//span//div[contains(normalize-space(),'${tabName}')]//div)[2]`);
    this.roomList = this.page.locator('//app-room-list/../..');
    this.selectRoom = this.page.locator('(//app-flowsheet-action-card//div)[1]');
    this.flowsheetDetailsDiv = this.isMobile
      ? this.page.locator('//app-flowsheet-detail/div[1]/div[2]')
      : this.page.locator('//app-flowsheet-detail/child::div[1]');
    this.flowsheetTab = this.page.locator(
      "(//span[contains(normalize-space(),'Flowsheet')])[2]/parent::div"
    );
  }

  async search(searchText) {
    await executeStep(this.customerSearchInput, 'fill', 'enter the customer name', [searchText]);
  }
  async clickOnCustomerIcon() {
    await executeStep(this.customersIcon, 'click', 'click customer icon');
  }
  async dateChangeChecking() {
    const inputValueBeforeDateChange = await this.customerSearchInput.inputValue();
    await executeStep(this.dateSpan(nextDayDate()), 'click', 'click next day');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const inputValueAfterDateChange = await this.customerSearchInput.inputValue();
    await assertEqualValues(inputValueBeforeDateChange, inputValueAfterDateChange);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async scrollAction() {
    const div = await this.customerDiv;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }

  async searchFunctionality() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const beforeCustomerCount = await this.listOfCustomers.count();
    await this.search(indexPage.lighthouse_data.invalidText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.noDataPlaceholder);
    await this.search(indexPage.opportunity_data.userContactName);
    await assertElementVisible(this.customerList);
    await this.dateChangeChecking();
    await executeStep(this.dateSpan(todayDate()), 'click', 'click today date');
    await executeStep(this.crossIcon, 'click', 'clear the search input');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const afterCustomerCount = await this.listOfCustomers.count();
    await assertEqualValues(beforeCustomerCount, afterCustomerCount);
    await this.scrollAction();
    await this.search(indexPage.opportunity_data.userContactName.toLowerCase());
    const customerCount_lowerCase = await this.listOfCustomers.count();
    await this.search(indexPage.opportunity_data.userContactName.toUpperCase());
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const customerCount_upperCase = await this.listOfCustomers.count();
    await assertEqualValues(customerCount_lowerCase, customerCount_upperCase);
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

  async assertCustomersExist() {
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const customerCount = await this.listOfCustomers.count();
    if (customerCount > 0) {
      console.log('Customers are present');
    } else {
      throw new Error('No customers found');
    }
  }
  async assertCalendarHasDates() {
    await executeStep(this.previousweekIcon, 'click', 'click on previous icon', []);
    await executeStep(this.todayButton, 'click', 'click on today button', []);
    const datelocator = await this.dateElement(todayDate()).textContent();
    const getTodayDate = todayDate();
    await assertEqualValues(datelocator, getTodayDate);
    const dateLocatorHighlighted = this.dateHighlighted(todayDate());
    await assertElementAttributeContains(dateLocatorHighlighted, 'class', 'bg-encore-accent-blue');
    await this.dateChangeChecking();
    await this.backToTodayDate();
  }
  async verifyCustomerCardContent() {
    await executeStep(this.customerCard, 'click', 'click on customer card from that list', []);
    await executeStep(this.opportunityList, 'click', 'select one opportunity from that list', []);
    await assertElementVisible(this.orderName);
    await assertElementVisible(this.customerName);
    await assertElementVisible(this.opportunityDates);
  }
  async assertTabNames() {
    for (let tabName of utilConst.Const.tabNames) {
      const isVisible = await this.dynamicTabElement(tabName).isVisible();
      if (isVisible) {
        console.log(`${tabName} is displayed`);
      } else {
        console.log(`${tabName} is not displayed`);
      }
    }
  }
  async clickOnCustomerBusinessCard() {
    await executeStep(
      this.customerCardBusiness,
      'click',
      'click on customer card from that list',
      []
    );
    await executeStep(
      this.customerCardOpportunity,
      'click',
      'select one opportunity from that list',
      []
    );
  }
  async checkNoContactsDisplayed() {
    await this.clickOnCustomerBusinessCard();
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[1]),
      'click',
      'click on customer card from that list'
    );
    await assertElementVisible(this.noDataFoundEle);
  }

  async roomListScrollAction() {
    const div = await this.roomList;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }
  async verifyRoomTab() {
    await this.clickOnCustomerBusinessCard();
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[3]),
      'click',
      'click on room tab from that list'
    );
    roomsqty = await this.roomCount(utilConst.Const.tabNames[3]).textContent();
  }
  async selectRoomList() {
    //await this.roomListScrollAction();
    await executeStep(this.selectRoom, 'click', 'click one room from the list');
  }
};
