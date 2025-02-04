const { executeStep } = require('../utils/action');
const fs = require('node:fs/promises');
const indexPage = require('../utils/index.page');
const { test } = require('@playwright/test');
const {
  generateRandString,
  startDate,
  endDate,
  assertElementVisible,
  assertEqualValues,
  formatTimeTo12Hour
} = require('../utils/helper');
const utilConst = require('../utils/const');
require('dotenv').config();

exports.CreateData = class CreateData {
  constructor(page, isCreateData1, isComplimentary) {
    this.page = page;
    this.isCreateData1 = isCreateData1;
    this.isComplimentary = isComplimentary;
    this.isMobile = this.page.context()._options.isMobile;
    this.copilotButton = page.locator(
      "//div[@id='Microsoft.Copilot.Pane']/parent::div/div[2]//button"
    );
    this.opportunityElement = page.locator("//span[text()='Opportunities']");
    this.newButton = page.locator("//span[text()='New']");
    this.selectNewOption = page.locator("//div[text()='New']");
    this.selectAtendees = page.locator("//div[text()='101-250']");
    this.selectCategory = page.locator("//div[text()='Main Show']");
    // this.selectEndUserContact = page.locator("//span[text()='Angelina Wood']");
    this.selectEndUserContact = page.locator("//ul[@aria-label='Lookup results']/li[1]");
    this.deleteVenue = page.locator(
      "//div[text()='PSAV Corporate Headquarters']/../following-sibling::button"
    );
    this.selectVenue = locationText => page.locator(`//span[text()='` + locationText + `']`);
    this.saveButton = page.locator("//span[text()='Save']");
    this.currencyElement = page.locator("//label[text()='Currency']");
    this.ignoreAndSaveButton = page.locator("//button[text()='Ignore and save']");
    this.ordersButton = page.locator("//li[text()='Orders']");
    this.selectCenter = centerText => page.locator(`//span[text()='` + centerText + `']`);
    this.createOrderBtn = page.locator("//button[contains(text(), 'Create Order')]");
    this.clickOnjobsBtn = page.locator("//a[normalize-space()='Jobs']");
    this.selectRoomType = page.locator(
      "(//div[@id='slickGridContainer-oeJobGrid']//div[@class='ui-widget-content slick-row even']/div)[15]"
    );
    this.clickOnRoomDropDown = page.locator('select.editor-combobox');
    this.selectFirstRoom = page.locator("(//div[@class='slick-cell l7 r7 true'])[1]");
    this.firstRoomDropDown = page.locator('select.editor-combobox');
    this.saveBtn = page.locator("//button[normalize-space(text())='Save']");
    this.roomName = page.locator(
      "(//span[@class='job-number'])[1]/parent::div/following-sibling::div[6]"
    );
    this.orderNumber = page.locator(
      "//div[@id='orderJobCommon']//label[@class='orderTickerDisplayValue me-3']"
    );
    this.orderName = page.locator(
      "//div[@id='orderJobCommon']//label[@class='orderTickerDisplayValue fw-bold']"
    );
    this.changeStatus = page.locator(
      "//div[text()='Sales']/following-sibling::div[text()='Quote']"
    );
    this.statusDropDown = page.locator(
      "//div[@id='slickGridContainer-oeJobGrid']//select[@class='orderInput h-auto ng-untouched ng-pristine ng-valid']"
    );
    this.itemsBtn = page.locator("//a[normalize-space(text())='Items']");
    this.clickPackageIcon = page.locator(
      "//div[@id='jobProductContainer']//button/span[contains(@class, 'glyphicon-gift')]"
    );
    this.selectPackageName = page.locator(
      "//div[@id='slickGridContainer-oePackagesGrid']//div[contains(@class,'ui-widget-content slick-row ')][2]"
    );
    this.selectedItemName = page.locator(
      "(//div[@id='slickGridContainer-oeOrderLinesGrid']//div[@class='grid-canvas grid-canvas-top grid-canvas-left']//following::div)[3]"
    );
    this.clickOnItemIcon = page.locator(
      "//div[@id='jobProductContainer']//button/span[contains(@class, 'glyphicon glyphicon-th-list')]"
    );
    this.cancelItemsIcon = page.locator(
      "//app-job-product-item//span[@class='glyphicon glyphicon-remove oeSideBarGridSearchIcon']"
    );
    this.clickOnSearchIcon = page.locator(
      "//app-job-product-item//span[@class='glyphicon glyphicon-search oeSideBarGridSearchIcon']"
    );
    this.checkboxLabourtItems = page.locator("//label[text()='Labor Items']");
    this.labourItem = page.locator(
      "//app-job-products//app-job-product-item//div[text()='3-Hole Punch Labor']"
    );
    this.addToPackageBtn = page.locator("//button[text()=' Add to package ']");
    this.labourItemName = page.locator(
      "//app-job-items//div[@class='ui-widget-content slick-row even']//div[text()='3-Hole Punch Labor']"
    );
    this.ordersIframe = page.frameLocator('iframe#WebResource_OrdersSubGrid');
    this.plusButtonInIframe = this.ordersIframe.locator(
      "//div[@id='divToolbarOrders']/div/div[4]/div/img[@class='po-toolbar-control-image-enabled']"
    );
    this.inputAttribute = attributeValue =>
      page.locator(
        `//label[text()='${attributeValue}']/../following-sibling::div/descendant::input`
      );
    this.buttonAttribute = attributeValue =>
      page.locator(
        `//label[text()='${attributeValue}']/../following-sibling::div/descendant::button[@role='combobox']`
      );
    // this.selectEndUserAccount = enduserText => page.locator(`(//span[text()='${enduserText}'])[1]`);
    this.selectEndUserAccount =  page.locator("//ul[@aria-label='Lookup results']/li[1]");
    this.eventLearning = page.locator("//li[@title='Event Learning']");
    this.eventDescription = page.locator("//textarea[@aria-label='Event Description']");
    this.eventObjective = page.locator("//textarea[@aria-label='Event Objective']");
    this.historicalLesson = page.locator("//textarea[contains(@aria-label,'Historical Lessons')]");
    this.notesTab = page.locator("(//a[contains(text(),'Dates')]/../following-sibling::li)[1]");
    this.coverSheetTextArea = page.locator(
      "//p[contains(text(),'Cover Sheet Notes')]/following-sibling::textarea[1]"
    );
    this.jobNotesTextArea = page.locator(
      "//p[contains(text(),'Job Notes')]//following-sibling::textarea"
    );
    this.homeIcon = this.page.locator("//span[contains(@class,'glyphicon-home')]");
    this.jobSearchSpan = this.page.locator("//span[text()='Job Search']");
    this.jobNumberSearchInput = this.page.locator(
      "//span[contains(text(),'Job Number')]/following-sibling::input"
    );
    this.userDateRangeCheckBox = this.page.locator("//input[@id='job-search_ApplyDates']");
    this.searchBtn = this.page.locator("(//input[@title='Search'])[2]");
    this.clickOnJobId = jobId => this.page.locator(`//a[text()='` + jobId + `']`);
    this.equipmentRowsCount = this.page.locator(
      "//div[@id='oeOrderLinesGrid']/div[4]//div[contains(@class,'grid-canvas-top')]/div"
    );
    this.statusOfJob = status => this.page.locator(`//div[normalize-space()='`+status+`']`);
    this.optionsBtn = this.page.locator("//a[contains(text(),'Options')]");
    this.complimentaryExcludingLabourInput = this.page.locator(
      "//input[@id='CompNoLaborWithSysAmts']"
    );
    this.complimentaryExcludingLabourSelect = this.page.locator(
      "//select[@id='CompNoLaborWithSystemAmts']"
    );
    this.conformationTextArea = this.page.locator(
      "//textarea[@name='OrderDiscountApprovalRequesterComments']"
    );
    this.continueBtn = this.page.locator("//button[normalize-space()='Continue']");
    this.reloadErrorMsg = this.page.locator("//div[contains(text(),'ERROR Acquiring Opportunity Information: [object Object]')]");
    this.jobNumText = jobNumber => this.page.locator(`//a[text()='${jobNumber}']`);
    this.dateLink = this.page.locator("//a[normalize-space()='Dates']");
    // this.timeOfJob =(index) => this.page.locator(`(//div[@id='jobDateContainer']//div[contains(@class,'slick-pane-top slick-pane-left')]//div[contains(@class,'slick-viewport-left')]//div)[${index}]`);
    this.timeOfJob = (index) => this.page.locator(`//div[@id='jobDateContainer']//div[contains(@class,'slick-pane-top slick-pane-left')]//div[contains(@class,'slick-viewport-left')]/child::div/div[2]/div[${index}]`)
    this.orderNameLabel = this.page.locator("//label[normalize-space()='Order Name']/../following-sibling::div/label");
    this.postAsAndRoomDiv = (jobNumber,index) => this.page.locator(`(//span[text()='${jobNumber}']/../../div)[${index}]`);
    this.eventTypeDropdown = this.page.locator("//button[@aria-label='Event Type']");
    this.selectEventType = this.page.locator("//div[text()='General Session']");
    this.opprtunityNumberDiv = this.page.locator("//div[text()='Opportunity Number']/preceding-sibling::div/div");
    this.newInternalOrderBtn = this.page.locator("//button[normalize-space()='New Internal Order']");
    this.orderNameInput = this.page.locator("//input[@name='OrderName']");
    this.cultureOrLangauageDropdown = this.page.locator("//select[@name='Culture']");
    this.locationInput = this.page.locator("//input[@id='locationLink']");
    this.locationSearchInput = this.page.locator("//input[@id='txtLocationSearch']")
    this.selectLocation = this.page.locator("//div[text()='Hyatt Regency Orlando Airport']");
    this.selectButton = this.page.locator("//button[@id='btnLocationModalSelect']");
    this.cancelBtn = this.page.locator("//button[normalize-space()='Cancel']");
    this.dateInput = (value) => this.page.locator(`//input[@name='${value}']`);
    this.timeInput = (value) => this.page.locator(`//app-time-dropdown-picker[@name='${value}']`);
    this.selectTime = this.page.locator("//div[@id='timepicker0']");
  }
  async clickOnCompass() {
    await this.page
      .frameLocator('iframe#AppLandingPage')
      .locator('//div[text()="Compass"]')
      .waitFor({
        state: 'visible',
        timeout: parseInt(process.env.element_locator_timeout)
      })
      .catch(err => test.info('Element not found:', err));
    await this.page
      .frameLocator('iframe#AppLandingPage')
      .locator("//div[text()='Compass']")
      .click({ timeout: parseInt(process.env.element_locator_timeout) });
  }
  async clickOnCopilot() {
    await executeStep(this.copilotButton, 'click', 'click on copilot button');
  }
  async createOpportunity(revenue, endUserAccount, endUserContact, centerName, enduserText) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.opportunityElement, 'click', 'click on opportunity');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.newButton, 'click', 'click on opportunity');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const eventName = generateRandString(3);
    await executeStep(
      this.inputAttribute(utilConst.Const.EventName),
      'fill',
      'Enter the event name',
      [eventName]
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EventStartDate),
      'click',
      'click on start date input'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(
      this.inputAttribute(utilConst.Const.EventStartDate),
      'fill',
      'clear the start date',
      ['']
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(
      this.inputAttribute(utilConst.Const.EventStartDate),
      'fill',
      'Enter the start date',
      [startDate()]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.inputAttribute(utilConst.Const.EventEndDate),
      'click',
      'click on end date input'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.inputAttribute(utilConst.Const.EventEndDate),
      'fill',
      'clear the end date',
      ['']
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.inputAttribute(utilConst.Const.EventEndDate),
      'fill',
      'Enter the end date',
      [endDate()]
    );
    await executeStep(this.buttonAttribute(utilConst.Const.NewOrExisting), 'click', 'click on new');
    await executeStep(this.selectNewOption, 'click', 'click new from the dropdown');
    await executeStep(this.eventTypeDropdown,"click","Click on event type dropdown");
    await executeStep(this.selectEventType,"click","Select General session from dropdown");
    await executeStep(
      this.inputAttribute(utilConst.Const.EstRevenue),
      'click',
      'click estimated revenue input'
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EstRevenue),
      'fill',
      'Enter the estimated revenue',
      [revenue]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.buttonAttribute(utilConst.Const.NoOfAttendees),
      'click',
      'click on no of attendees'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectAtendees, 'click', 'select no of attendees from dropdown');
    await executeStep(
      this.buttonAttribute(utilConst.Const.ShowCategory),
      'click',
      'click on show category input'
    );
    await executeStep(this.selectCategory, 'click', 'select category from the dropdown');
    await executeStep(
      this.inputAttribute(utilConst.Const.EndUserAccount),
      'scroll',
      'scroll to the end user if needed'
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EndUserAccount),
      'click',
      'click on end user account input'
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EndUserAccount),
      'fill',
      'enter the end user accout',
      [endUserAccount]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.selectEndUserAccount,
      'click',
      'select end user from dropdown'
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EndUserContact),
      'click',
      'click on end user contact input'
    );
    await executeStep(
      this.inputAttribute(utilConst.Const.EndUserContact),
      'fill',
      'enter the end user contact',
      [endUserContact]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.selectEndUserContact,
      'click',
      'select the end user contact from dropdown'
    );
    await executeStep(this.deleteVenue, 'click', 'click the delete venue in the input');
    await executeStep(this.inputAttribute(utilConst.Const.Venue), 'click', 'click the venue input');
    if (this.isCreateData1) {
      await executeStep(this.inputAttribute(utilConst.Const.Venue), 'fill', 'Enter the venue', [
        indexPage.opportunity_data.venue_createData1
      ]);
    } else {
      await executeStep(this.inputAttribute(utilConst.Const.Venue), 'fill', 'Enter the venue', [
        indexPage.opportunity_data.venue_createData2
      ]);
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if (this.isCreateData1) {
      await executeStep(
        this.selectVenue(indexPage.opportunity_data.venueText_createData1),
        'click',
        'select the venue from the dropdown'
      );
    } else {
      await executeStep(
        this.selectVenue(indexPage.opportunity_data.venueText_createData2),
        'click',
        'select the venue from the dropdown'
      );
    }
    await assertElementVisible(this.saveButton, 'Verify that Save button is visible');
    await this.saveButton.click();
    try {
      await executeStep(this.ignoreAndSaveButton, 'click', 'click the save button');
    } catch (error) {
      test.info('Element is not there in the DOM');
    } finally {
      await this.page.waitForTimeout(parseInt(process.env.large_timeout));
      await executeStep(this.eventLearning, 'click', 'click the event learning button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.eventDescription, 'fill', 'Enter the event description', [
        indexPage.opportunity_data.eventDescription
      ]);
      await executeStep(this.eventObjective, 'fill', 'Enter the event objective', [
        indexPage.opportunity_data.eventObjective
      ]);
      await executeStep(this.historicalLesson, 'fill', 'Enter the historical data', [
        indexPage.opportunity_data.historicalData
      ]);
      await executeStep(this.ordersButton, 'click', 'click the order button');
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      await executeStep(
        this.inputAttribute(utilConst.Const.GLCenter),
        'click',
        'click the GL center input'
      );
      if (this.isCreateData1) {
        await executeStep(
          this.inputAttribute(utilConst.Const.GLCenter),
          'fill',
          'enter the center name',
          [indexPage.opportunity_data.centerId_createData1]
        );
      } else {
        await executeStep(
          this.inputAttribute(utilConst.Const.GLCenter),
          'fill',
          'enter the center name',
          [indexPage.opportunity_data.centerId_createData2]
        );
      }
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      if (this.isCreateData1) {
        await executeStep(
          this.selectCenter(indexPage.opportunity_data.centerName_createData1),
          'click',
          'select the center from the dropdown'
        );
      } else {
        await executeStep(
          this.selectCenter(indexPage.opportunity_data.centerName_createData2),
          'click',
          'select the center from the dropdown'
        );
      }
      await executeStep(this.saveButton, 'click', 'click on save button');
      await this.page.waitForTimeout(parseInt(process.env.large_timeout));
      const oppNum =  await this.opprtunityNumberDiv.textContent();
      if (this.isCreateData1 && !this.isComplimentary) {
        indexPage.navigator_data.opportunityNumber = oppNum;
      }
      await executeStep(this.ordersButton, 'click', 'click the order button');
    }
  }

  async clickOnPlusButton(mail, password) {
    await executeStep(this.currencyElement, 'scroll', 'scroll to the element if needed');
    await this.plusButtonInIframe.waitFor({
      state: 'visible',
      timeout: parseInt(process.env.element_locator_timeout)
    });
    await this.plusButtonInIframe.click({
      timeout: parseInt(process.env.element_locator_timeout)
    });
    const newPage = await Promise.race([
      this.page.context().waitForEvent('page', {
        timeout: parseInt(process.env.pageload_timeout)
      }),
      new Promise(resolve =>
        setTimeout(() => resolve(null), parseInt(process.env.pageload_timeout))
      )
    ]);
    await newPage.locator("//input[@id='userNameInput']").fill(mail);
    await newPage.locator("//input[@id='passwordInput']").fill(password);
    await newPage.locator("//span[@id='submitButton']").click();
    await newPage.waitForTimeout(parseInt(process.env.large_timeout));
    const navigationUrl = await newPage.url();
    if (this.isCreateData1) {
      indexPage.navigator_data.navigatorUrl_createdata1 = navigationUrl;
    } else {
      indexPage.navigator_data.navigatorUrl_createdata2 = navigationUrl;
    }
    await fs.writeFile('./data/navigator.json', JSON.stringify(indexPage.navigator_data));
    if (this.isCreateData1) {
      await assertEqualValues(indexPage.navigator_data.navigatorUrl_createdata1, navigationUrl, 'Verify the Urls are equal or not');
    } else {
      await assertEqualValues(indexPage.navigator_data.navigatorUrl_createdata2, navigationUrl, 'Verify the Urls are equal or not');
    }
    await newPage.close();
  }

  async createOrder() {
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.createOrderBtn, 'click', 'click on order');
  }
  async jobsPage() {
    await executeStep(
      this.clickOnjobsBtn,
      'click',
      'click on jobs',
      [],
      parseInt(process.env.function_timeout)
    );
  }
  async selectRooms() {
    await executeStep(this.selectRoomType, 'click', 'click on room type');
    await executeStep(this.clickOnRoomDropDown, 'click', 'click on room dropdown');
    if (this.isCreateData1) {
      await this.clickOnRoomDropDown.selectOption({ label: 'Babcock A' });
    } else {
      await this.clickOnRoomDropDown.selectOption({ label: 'Airport Terminal' });
    }
    await executeStep(this.saveBtn, 'click', 'click o save button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const firstJobNumberElement = await this.page.locator('span.job-number').nth(0);
    const firstJobNumber = await firstJobNumberElement.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.first_job_no = firstJobNumber;
    }
    await fs.writeFile('./data/navigator.json', JSON.stringify(indexPage.navigator_data));
    const secondJobNumberElement = await this.page.locator('span.job-number').nth(1);
    const secondJobNumber = await secondJobNumberElement.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.second_job_no = secondJobNumber;
    } else if (this.isCreateData1 && this.isComplimentary) {
      indexPage.navigator_data.second_job_no_complimentary = secondJobNumber;
    } else {
      indexPage.navigator_data.second_job_no_createData2 = secondJobNumber;
    }
    const orderNumber = await this.orderNumber.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.order_no = orderNumber;
    }
    const order_name = await this.orderName.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.order_name = order_name;
    }
    const roomNameele = await this.roomName.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.roomName = roomNameele;
    }
    await fs.writeFile('./data/navigator.json', JSON.stringify(indexPage.navigator_data));
  }
  async selectItems() {
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.itemsBtn, 'click', 'click on items button');
    await executeStep(this.clickPackageIcon, 'click', 'click on package icon');
    await executeStep(this.selectPackageName, 'doubleclick', 'double click the select package');
    const textContent = await this.selectedItemName.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.item_name = textContent;
    }
    await fs.writeFile('./data/navigator.json', JSON.stringify(indexPage.navigator_data));
    const itemName = indexPage.navigator_data.item_name;
    await assertEqualValues(textContent, itemName, 'Verify that the text equal or not');
    await executeStep(this.saveBtn, 'click', 'click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }
  async selectLabourItem() {
    await executeStep(this.clickOnItemIcon, 'click', 'click on item icon');
    await executeStep(this.clickOnSearchIcon, 'click', 'click on search icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.checkboxLabourtItems, 'click', 'click on labour check box');
    await this.page.waitForTimeout(1000);
    await executeStep(this.labourItem, 'doubleclick', 'double click on labour item');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.addToPackageBtn, 'click', 'click on add to package button');
    const ItemName = await this.labourItemName.textContent();
    if (this.isCreateData1 && !this.isComplimentary) {
      indexPage.navigator_data.labour_item_name = ItemName;
    }
    await fs.writeFile('./data/navigator.json', JSON.stringify(indexPage.navigator_data));
    await executeStep(this.notesTab, 'click', 'click on notes tab');
    await executeStep(this.coverSheetTextArea, 'fill', 'Enter data in cover sheet text area', [
      indexPage.opportunity_data.coverSheetTextArea
    ]);
    await executeStep(this.jobNotesTextArea, 'fill', 'Enter content in job notes area', [
      indexPage.opportunity_data.jobNotesTextArea
    ]);
    if (this.isComplimentary) {
      await executeStep(this.optionsBtn, 'click', 'click options button');
      await executeStep(this.complimentaryExcludingLabourInput, 'click', 'click on check box');
      await executeStep(this.complimentaryExcludingLabourSelect, 'click', 'click on select');
      await this.complimentaryExcludingLabourSelect.selectOption({ label: 'Competitor Match' });
      await executeStep(this.saveBtn, 'click', 'click on save button');
    }
    if (!this.isComplimentary) {
      await executeStep(this.saveBtn, 'click', 'click on save button');
    }
    await this.page.waitForTimeout(parseInt(process.env.element_locator_timeout));
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
  }

  async getCountOfEquipments() {
    await this.searchWithJobId();
    await executeStep(
      this.clickOnJobId(indexPage.navigator_data.second_job_no),
      'click',
      'click on job number'
    );
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
  }

  async searchWithJobId() {
    await executeStep(this.homeIcon, 'click', 'click on home icon');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.jobSearchSpan, 'click', 'click on job search button');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.jobNumberSearchInput, 'fill', 'enter the valid job number', [
      indexPage.navigator_data.second_job_no
    ]);
    if (await this.userDateRangeCheckBox.isChecked()) {
      await this.userDateRangeCheckBox.uncheck();
    }
    await executeStep(this.searchBtn, 'click', 'click on search button');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    if (!this.clickOnJobId(indexPage.navigator_data.second_job_no).isVisible()) {
      await executeStep(this.searchBtn, 'click', 'click on search button');
      await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    }
  }

  async assertStatusOfJob(jobNumber,clientStartTime,clientEndTime,setAction,strikeAction,setTime,strikeTime) {
    await executeStep(this.jobNumText(jobNumber),"click","Click on the job number");
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.dateLink,"click","Click on date link");
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const cStartTime = await this.timeOfJob(2).textContent();
    await assertEqualValues(formatTimeTo12Hour(cStartTime),formatTimeTo12Hour(clientStartTime),"Verify that client start time from navigator and lighthouse are equal");
    const cEndTime = await this.timeOfJob(3).textContent();
    await assertEqualValues(formatTimeTo12Hour(cEndTime),formatTimeTo12Hour(clientEndTime),"Verify that client end time from navigator and lighthouse are equal");
    const stAction = await this.timeOfJob(9).textContent();
    await assertEqualValues(stAction.replace(/[-\s]/g, ''),setAction,"Verify that  set action from navigator and lighthouse are equal");
    const strAction = await this.timeOfJob(5).textContent();
    await assertEqualValues(strAction,strikeAction.replace(/(?<!^)(?=[A-Z])/g, ' '),"Verify that strike action from navigator and lighthouse are equal");
    const sTime = await this.timeOfJob(10).textContent();
    await assertEqualValues(formatTimeTo12Hour(sTime),formatTimeTo12Hour(setTime),"Verify that set time from navigator and lighthouse are equal");
    const eTime = await this.timeOfJob(6).textContent();
    await assertEqualValues(formatTimeTo12Hour(eTime),formatTimeTo12Hour(strikeTime),"Verify that strike time from navigator and lighthouse are equal");
  }

  async assertOrderRoomPostValues(orderNameValue,roomNameValue,postAsValue) {
    const orderName = await this.orderNameLabel.textContent();
    await assertEqualValues(orderName.trim(),orderNameValue,"Verify that the order name fromm navigator and lighthouse are equal");
    let roomName = await this.postAsAndRoomDiv(indexPage.navigator_data.second_job_no,8).textContent();
    await assertEqualValues(roomName.trim(),roomNameValue,"Verify that the room name from navigator and lighthouse are equal")
    let postAs = await this.postAsAndRoomDiv(indexPage.navigator_data.second_job_no,13).textContent();
    await assertEqualValues(postAs.trim(),postAsValue,"Verify that the post as value from navigator and lighthouse are equal")
  }

  async createInternalOrder(orderName,locationCode) {
    await executeStep(this.homeIcon,"click","Click on home icon");
    await executeStep(this.newInternalOrderBtn,"click","Click on new internal order button");
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.orderNameInput,"fill","Enter the order name",[orderName]);
    await executeStep(this.cultureOrLangauageDropdown,"click","Click on dropdown")
    await this.cultureOrLangauageDropdown.selectOption({ label : "en-US"});
    await executeStep(this.locationInput,"click","click on select location");
    await this.locationSearchInput.click();
    await this.locationSearchInput.type(locationCode, { delay: 100 });
    await executeStep(this.selectLocation,"click","Click on location");
    await executeStep(this.selectButton,"click","Click on select button");
    await executeStep(this.saveBtn,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
  }

  async createJobForInternalOrder(prepDate,deliveryDate,pickupDate,returnDate) {
    await executeStep(this.clickOnjobsBtn,"click","Click on jobs");
    await executeStep(this.dateInput(utilConst.Const.prepDate),"fill","Enter the prepDate",[prepDate]);
    await executeStep(this.timeInput(utilConst.Const.prepTime),"click","Click on Prep Time Input");
    await executeStep(this.selectTime,"click","Select the prep time");
    await executeStep(this.dateInput(utilConst.Const.deliveryDate),"fill","Enter the prepDate",[deliveryDate]);
    await executeStep(this.timeInput(utilConst.Const.deliveryTime),"click","Click on Prep Time Input");
    await executeStep(this.selectTime,"click","Select the prep time");
    await executeStep(this.dateInput(utilConst.Const.pickupDate),"fill","Enter the prepDate",[pickupDate]);
    await executeStep(this.timeInput(utilConst.Const.pickupTime),"click","Click on Prep Time Input");
    await executeStep(this.selectTime,"click","Select the prep time");
    await executeStep(this.dateInput(utilConst.Const.returnDate),"fill","Enter the prepDate",[returnDate]);
    await executeStep(this.timeInput(utilConst.Const.returnTime),"click","Click on Prep Time Input");
    await executeStep(this.selectTime,"click","Select the prep time");
    await executeStep(this.itemsBtn,"click","Click on items");
    await executeStep(this.clickPackageIcon, 'click', 'click on package icon');
    await executeStep(this.selectPackageName, 'doubleclick', 'double click the select package');
    await executeStep(this.saveBtn,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout)); 
  }
};
