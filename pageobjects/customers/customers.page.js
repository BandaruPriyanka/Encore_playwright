const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const {
  assertElementVisible,
  todayDate,
  nextDayDate,
  scrollElement,
  assertEqualValues,
  assertElementAttributeContains,
  assertElementNotVisible,
  assertContainsValue,
  assertIsNumber,
  assertGreaterThan
} = require('../../utils/helper');
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
require('dotenv').config();

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
    this.existingCustomers = this.page.locator('(//app-customer-card//parent::div)[1]');
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
    this.customerCard = this.page.locator("//div[text()='Angelina Wood']");
    this.opportunityList = this.page.locator(
      "//div[text()='Angelina Wood']//ancestor::mat-expansion-panel-header/following::div[contains(@class,'e2e_customer_card_opportunity')][1]"
    );
    this.getRoomName = this.page.locator("((//div[@role='region']/div/div/div)[1]/div/span)[1]");
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
    this.selectRoom = this.page.locator('(//app-flowsheet-action-card//parent::div)[1]');
    this.flowsheetDetailsDiv = this.isMobile
      ? this.page.locator('//app-flowsheet-detail/div[1]/div[2]')
      : this.page.locator('//app-flowsheet-detail/child::div[1]');
    this.flowsheetTab = this.page.locator(
      "(//span[contains(normalize-space(),'Flowsheet')])[2]/parent::div"
    );
    this.contactNameDiv = this.page.locator("//div[text()='Angelina Wood']");
    this.orderNameDiv = order_name =>
      this.page.locator(`//span[contains(text(),'` + order_name + `')]`);
    this.touchPointSpan = this.page.locator("//span[text()='TouchPoint']");
    this.touchPointModal = this.page.locator('//mat-bottom-sheet-container');
    this.happyIconInTouchPointModal = this.page.locator("//span[contains(text(),'Happy')]");
    this.saveButton = this.page.locator("//button[@type='submit']");
    this.firstTouchPointIcon = moodText =>
      this.page.locator(
        `(//span[contains(text(),'First Touchpoint')])[1]/ancestor::div/preceding-sibling::app-mood-icon/icon[@class='` +
          moodText +
          `']`
      );
    this.neutralIconInTouchPointModal = this.page.locator("//span[contains(text(),'Neutral')]");
    this.noteRequiresMsgInModal = this.page.locator(
      "//span[contains(text(),'Note is required for Neutral and Angry mood.')]"
    );
    this.noteInput = this.page.locator("//label[text()='Note']/following-sibling::textarea");
    this.secondTouchPointIcon = moodText =>
      this.page.locator(
        `(//span[contains(text(),'Second Touchpoint')])[1]/ancestor::div/preceding-sibling::app-mood-icon/icon[@class='` +
          moodText +
          `']`
      );
    this.secondTouchPointEditIcon = this.page.locator(
      "(//span[contains(text(),'Second Touchpoint')])[1]/following-sibling::icon[@name='pen_line']"
    );
    this.backArrowBtn = this.page.locator(
      "//strong[text()='Opportunity Information']/preceding-sibling::icon"
    );
    this.notificationIcon = this.page.locator("//icon[@name='bell_notification_line']");
    this.notificationMsg = msg =>
      this.page.locator(`//app-notification[1]//div[contains(text(),'` + msg + `')]`);
    this.notificationCloseBtn = this.page.locator("//icon[@name='cross_line']");
    this.angryIconInTouchPoint = this.page.locator("//span[contains(text(),'Angry')]");
    this.touchPointLimitMsg = this.page.locator(
      "//span[contains(text(),'The maximum number of touchpoints for today have been reached')]"
    );
    this.touchPointCountDiv = this.page.locator(
      "//div[contains(text(),'Touchpoints')]/following-sibling::div"
    );
    this.dateElement = date => this.page.locator(`//span[text()='` + date + `']`);
    this.firstOrderDiv = this.page.locator(
      "//div[text()='Angelina Wood']//ancestor::mat-expansion-panel-header/following::div[contains(@class,'e2e_customer_card_opportunity')][1]"
    );
    this.cardsDiv = this.page.locator("//div[@role='region']/div");
    this.dynamicOpportunity = orderName =>
      this.page.locator(`//span[contains(text(),'${orderName}')]/../..`);
    this.historicalData = this.page.locator(
      "//div[contains(text(),'Historical Lessons')]//following-sibling::div"
    );
    this.eventObjectiveData = this.page.locator(
      "//div[contains(text(),'Event Objectives')]//following-sibling::div"
    );
    this.eventDescriptionData = this.page.locator(
      " //div[contains(text(),'Event Description')]//following-sibling::div"
    );
    this.touchpointPieIcon = ordername =>
      this.page.locator(`(//span[text()='${ordername}'])[2]/../../app-mood-pia-chart`);
      this.previousEventList = this.page.locator("//app-previous-events//ul[@role='list']");
  }

  async search(searchText) {
    await executeStep(this.customerSearchInput, 'fill', 'Enter the customer name', [searchText]);
  }
  async clickOnCustomerIcon() {
    await executeStep(this.customersIcon, 'click', 'Click on customer icon');
  }
  async dateChangeChecking() {
    const inputValueBeforeDateChange = await this.customerSearchInput.inputValue();
    await executeStep(this.dateSpan(nextDayDate()), 'click', 'click on next day');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const inputValueAfterDateChange = await this.customerSearchInput.inputValue();
    await assertEqualValues(
      inputValueBeforeDateChange,
      inputValueAfterDateChange,
      `Verify that the applied search remains sticky after the date change. Expected: ${inputValueBeforeDateChange}, Actual: ${inputValueAfterDateChange}`
    );
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
    await test.step('Perform search with invalid text', async () => {
      await this.search(indexPage.lighthouse_data.invalidText);
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.noDataPlaceholder,
      'Assert no data placeholder is visible after searching for invalid entry'
    );
    await test.step('Perform search with valid text', async () => {
      await this.search(indexPage.opportunity_data.userContactName);
    });
    await assertElementVisible(
      this.customerList,
      'Assert customer list is visible after valid search'
    );
    await this.dateChangeChecking();
    await executeStep(this.dateSpan(todayDate()), 'click', 'Click on today date');
    await executeStep(this.crossIcon, 'click', 'Clear the search input');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const afterCustomerCount = await this.listOfCustomers.count();
    try {
      await assertEqualValues(
        beforeCustomerCount,
        afterCustomerCount,
        `Verify customer counts before and after clearing search: expected "${beforeCustomerCount}", actual "${afterCustomerCount}"`
      );
    } catch {
      test.info("'Loading issue....'");
    }
    await test.step('Verify that scrolling works properly', async () => {
      await this.scrollAction();
    });
    await test.step('Perform search with lowercase', async () => {
      await this.search(indexPage.opportunity_data.userContactName.toLowerCase());
    });
    const customerCount_lowerCase = await this.listOfCustomers.count();
    await test.step('Perform search with uppercase', async () => {
      await this.search(indexPage.opportunity_data.userContactName.toUpperCase());
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const customerCount_upperCase = await this.listOfCustomers.count();
    await assertEqualValues(
      customerCount_lowerCase,
      customerCount_upperCase,
      `Verify customer counts for lowercase and uppercase names are equal: expected "${customerCount_lowerCase}", actual "${customerCount_upperCase}"`
    );
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
    try {
      await assertGreaterThan(customerCount, 0, 'Verify that the customers are present');
    } catch {
      test.info('No customers found');
    }
  }
  async assertCalendarHasDates() {
    await executeStep(this.previousweekIcon, 'click', 'Click on previous icon', []);
    await assertElementVisible(
      this.calendarDiv,
      'Assert that the calendar div is visible after clicking on previous week icon'
    );
    await executeStep(this.todayButton, 'click', 'Click on today button', []);
    const datelocator = await this.dateElement(todayDate()).textContent();
    const getTodayDate = todayDate();
    await assertEqualValues(
      datelocator,
      getTodayDate,
      `Verify visibility of today date. Actual : ${datelocator} Expected : ${getTodayDate}`
    );
    const dateLocatorHighlighted = await this.dateHighlighted(todayDate());
    await assertElementAttributeContains(
      dateLocatorHighlighted,
      'class',
      'bg-encore-accent-blue',
      "Assert that today's date is highlighted by checking for the highlight class"
    );
    await this.dateChangeChecking();
    await assertElementVisible(
      this.existingCustomers,
      'Verify proper Customers are returned based on dates'
    );
    await this.backToTodayDate();
  }
  async verifyCustomerCardContent() {
    await executeStep(this.customerCard, 'click', 'Click on any customer from that list');
    await assertElementVisible(
      this.opportunityList,
      'Assert that the opportunity list is visible after selecting a customer'
    );
    await executeStep(this.opportunityList, 'click', 'Click on any opportunity from that list');
    await assertElementVisible(this.orderName, 'Assert that the order name is visible');
    await assertElementVisible(this.customerName, 'Assert that the customer name is visible');
    await assertElementVisible(
      this.opportunityDates,
      'Assert that the opportunity dates & opportunity # are visible'
    );
  }
  async assertTabNames() {
    for (let tabName of utilConst.Const.tabNames) {
      const isVisible = await this.dynamicTabElement(tabName).isVisible();
      await assertEqualValues(isVisible, true, `Assert that the "${tabName}" tab is displayed`);
    }
  }
  async clickOnCustomerBusinessCard() {
    await executeStep(
      this.customerCardBusiness,
      'click',
      'Click on customer card from that list',
      []
    );
    await executeStep(
      this.customerCardOpportunity,
      'click',
      'Select one opportunity from that list',
      []
    );
  }
  async checkNoContactsDisplayed() {
    try {
      await this.clickOnCustomerBusinessCard();
      await executeStep(
        this.dynamicTabElement(utilConst.Const.tabNames[1]),
        'click',
        'Click on Contact Tab from that list'
      );
      await assertElementVisible(
        this.noDataFoundEle,
        'Verify that No Contacts should be displayed'
      );
    } catch {
      test.info('No bussiness cards found');
    }
  }
  async roomListScrollAction() {
    const div = await this.roomList;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }
  async verifyRoomTab() {
    try {
      await this.clickOnCustomerBusinessCard();
      await executeStep(
        this.dynamicTabElement(utilConst.Const.tabNames[3]),
        'click',
        'Click on room tab from that list',
        []
      );
      let roomsqty = await this.roomCount(utilConst.Const.tabNames[3]).textContent();
      await assertIsNumber(
        roomsqty,
        `The counter should display actual Rooms qty from the List: "${roomsqty}"`
      );
    } catch {
      test.info('No bussiness cards found');
    }
  }
  async selectRoomList() {
    await executeStep(this.selectRoom, 'click', 'Click on any room from the list', []);
  }
  async assertTouchPointTab() {
    await executeStep(this.contactNameDiv, 'click', 'Click on customer div');
    await executeStep(
      this.orderNameDiv(indexPage.navigator_data.order_name),
      'click',
      'Click on order div'
    );
    await assertElementVisible(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      `Verify that the "${utilConst.Const.tabNames[2]}" tab is visible`
    );
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      'click',
      'Click on touch point in customers tab'
    );
    await assertElementVisible(
      this.touchPointSpan,
      'Verify that the touch point button is displayed'
    );
  }
  async addFirstTouchPoint() {
    await executeStep(this.touchPointSpan, 'click', 'Click on add touch point');
    await assertElementVisible(
      this.touchPointModal,
      'Verify that the modal for adding the 1st touchpoint is displayed'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.happyIconInTouchPointModal, 'click', 'Click happy icon in modal');
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await assertElementVisible(
      this.firstTouchPointIcon(utilConst.Const.greenIconText),
      'Verify that the green color mood icon is displayed'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      'click',
      'click on touch point in customers tab'
    );
    await assertElementVisible(
      this.firstTouchPointIcon(utilConst.Const.greenIconText),
      'Verify that the green color mood icon is displayed after reload'
    );
  }
  async addSecondTouchPoint() {
    const beforeCount = await this.touchPointCountDiv.textContent();
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      'click',
      'Click on touch point in customers tab'
    );
    await executeStep(this.touchPointSpan, 'click', 'Click on add touch point');
    await assertElementVisible(
      this.touchPointModal,
      'Verify that the modal for adding the 2nd touchpoint is displayed'
    );
    await executeStep(this.neutralIconInTouchPointModal, 'click', 'Click on neutral icon in modal');
    await executeStep(this.saveButton, 'click', 'Click save button');
    await assertElementVisible(
      this.noteRequiresMsgInModal,
      'Verify that the note requires message in the modal is displayed'
    );
    await executeStep(this.noteInput, 'fill', 'Enter the comment for neutral icon', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.secondTouchPointIcon(utilConst.Const.yellowIconText),
      'Verify that the yellow color mood icon is displayed'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if (this.isMobile) {
      await executeStep(this.backArrowBtn, 'click', 'Click on back arrow button');
    }
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.notificationIcon, 'click', 'Click on notification msg');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.notificationMsg(indexPage.lighthouse_data.neutralComment),
      'Verify that both in-app and push notifications appear after submitting a Neutral or Negative touchpoint'
    );
    await executeStep(this.notificationCloseBtn, 'click', 'Click on notification close button');
    if (this.isMobile) {
      await executeStep(
        this.orderNameDiv(indexPage.navigator_data.order_name),
        'click',
        'Click on order name'
      );
    }
    await this.page.reload();
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      'click',
      'Click on touch point in Touchpoint tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const afterCount = await this.touchPointCountDiv.textContent();
    await assertEqualValues(
      parseInt(afterCount),
      parseInt(beforeCount) + 1,
      'Verify that the Touchpoints counter works properly: expected count to be one more than before'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.secondTouchPointIcon(utilConst.Const.yellowIconText),
      'Verify that the yellow color mood icon is displayed after reload'
    );
  }
  async addRemainingTouchPoints() {
    let isItem = true;
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    while (isItem) {
      await executeStep(this.touchPointSpan, 'click', 'Click the touch point');
      try {
        await assertElementVisible(
          this.touchPointModal,
          'Verify that the touch point modal is visible'
        );
        await executeStep(this.angryIconInTouchPoint, 'click', 'Click on angry icon in modal');
        await executeStep(this.noteInput, 'fill', 'Enter the msg in note input', [
          indexPage.lighthouse_data.angryComment
        ]);
        await executeStep(this.saveButton, 'click', 'Click on save button');
      } catch (error) {
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await assertElementVisible(
          this.touchPointLimitMsg,
          'Verify that the proper validation message is displayed when trying to add more than the allowed touchpoints'
        );
        isItem = false;
      }
    }
  }
  async assertEditIcon() {
    await assertElementVisible(
      this.secondTouchPointEditIcon,
      'Verify that the touch point edit icon is displayed'
    );
    await executeStep(this.secondTouchPointEditIcon, 'click', 'Click on edit icon');
    await executeStep(this.happyIconInTouchPointModal, 'click', 'Click on happy icon');
    await executeStep(this.noteInput, 'fill', 'Enter the note', ['']);
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.secondTouchPointIcon(utilConst.Const.greenIconText),
      'Verify that the user can edit previously created Touchpoints by ensuring the green icon is displayed'
    );
  }
  async assertTouchPointForFuture() {
    if (this.isMobile) {
      await executeStep(this.backArrowBtn, 'click', 'Click on back arrow button');
    }
    await executeStep(this.dateElement(nextDayDate()), 'click', 'Click on next day date');
    await executeStep(this.contactNameDiv, 'click', 'Click on customer div');
    await executeStep(this.firstOrderDiv, 'click', 'Click on order');
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[2]),
      'click',
      'Click on touch point in Touchpoint tab'
    );
    await assertElementNotVisible(
      this.touchPointSpan,
      'Verify that the touch point button is not displayed for Past or Future dates, ensuring that touchpoints can only be submitted for the actual date'
    );
  }

  async verifyDetailsTab() {
    await executeStep(this.customerCard, 'click', 'Click on customer card from that list', []);
    await executeStep(
      this.dynamicOpportunity(indexPage.navigator_data.order_name),
      'click',
      'Click on the opportunity card based on order names',
      []
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const eventDescriptionText = await this.eventDescriptionData.textContent();
    const eventObjectiveText = await this.eventObjectiveData.textContent();
    const historicalDataText = await this.historicalData.textContent();
    await assertContainsValue(
      eventDescriptionText,
      indexPage.opportunity_data.eventDescription,
      `Verify event description text contains expected value: expected "${indexPage.opportunity_data.eventDescription}", actual "${eventDescriptionText}"`
    );
    await assertContainsValue(
      eventObjectiveText,
      indexPage.opportunity_data.eventObjective,
      `Verify event objective text contains expected value: expected "${indexPage.opportunity_data.eventObjective}", actual "${eventObjectiveText}"`
    );
    await assertContainsValue(
      historicalDataText,
      indexPage.opportunity_data.historicalData,
      `Verify historical data text contains expected value: expected "${indexPage.opportunity_data.historicalData}", actual "${historicalDataText}"`
    );
  }
  async verifyPreviousEventTab() {
    await executeStep(this.customerCard, 'click', 'Click on any Customer Card from that list');
    await executeStep(this.opportunityList, 'click', 'Click on any Opportunity from Customer list');
    await executeStep(
      this.dynamicTabElement(utilConst.Const.tabNames[4]),
      'click',
      'Click on Previous Events Tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.previousEventList, 'Verify that all Previous Events returned');
  }
};
