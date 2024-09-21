const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertElementContainsText,
  calculateTotalAmountAfterDiscount,
  assertGreaterThan,
  formatCurrency,
  assertEqualValues
} = require('../../utils/helper');
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
let beforeRoomCount, afterRoomCount, discountPrice;
exports.FlowsheetCardAndTab = class FlowsheetCardAndTab {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.searchInput = this.page.locator("//input[@name='search-field']");
    this.jobIdElement = jobId => this.page.locator(`//span[text()=' #` + jobId + ` ']`);
    this.flowsheetDetailsDiv = this.isMobile
      ? this.page.locator('//app-flowsheet-detail/div[1]/div[2]')
      : this.page.locator('//app-flowsheet-detail/child::div[1]');
    this.roomNameSpan = this.isMobile
      ? this.page.locator('//app-flowsheet-detail/div[1]/div[2]/div[2]/div/div[1]/span')
      : this.page.locator('//app-flowsheet-detail/div[1]/div[1]/div/div/span');
    this.orderNameSpan = this.isMobile
      ? this.page.locator("//span[@class='inline']")
      : this.page.locator("//span[@class='font-semibold']");
    this.customerNameSpan = this.isMobile
      ? this.page.locator("//span[contains(@class,'e2e_flowsheet_detail_client')]")
      : this.page.locator("//span[@class='font-semibold']/parent::span");
    this.iconInPage = iconText =>
      this.isMobile
        ? this.page.locator(
            `//app-flowsheet-detail/div[1]/div[2]//app-mood-icon/icon[@class='` + iconText + `']`
          )
        : this.page.locator(
            `//app-flowsheet-detail/div[1]/div[1]//app-mood-icon/icon[@class='` + iconText + `']`
          );
    this.comparisonIcon = this.isMobile
      ? this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[2]")
      : this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[1]");
    this.greenColorCheckBox = this.isMobile
      ? this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[2]")
      : this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[1]");
    this.touchPointElement = this.isMobile
      ? this.page.locator('//app-flowsheet-detail/div[1]/div[2]/div[1]/app-mood-pia-chart')
      : this.page.locator(
          '//app-flowsheet-detail/div[1]/div[1]/div/div/following-sibling::app-mood-pia-chart'
        );
    this.flowsheetTabElement = text => this.page.locator(`//div[contains(text(),'` + text + `')]`);
    this.contactDiv = this.page.locator('//app-contact-list/ul/li');
    this.contactName = name => this.page.locator(`//span[text()='` + name + `']`);
    this.textInModal = this.page.locator('//mat-bottom-sheet-container//ul/li');
    this.menuIcon = this.page.locator("//app-side-menu/div[1]//icon[@name='menu_line']");
    this.locationProfile = this.page.locator("//span[text()='Location Profile']");
    this.docusignValue = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_docusign_value')]")
      : this.page.locator("//span[@class='e2e_user_profile_docusign_value']");
    this.flowsheetBtn = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]'
        );
    this.newAddOnRequestBtn = this.page.locator("//button[contains(text(),'New Add On Request')]");
    this.roomsCount = this.page.locator("//div[text()=' Rooms ']/following-sibling::div");
    this.addOnModalText = this.page.locator("//strong[contains(text(),'Add On Request')]");
    this.requestedByInput = this.page.locator("//input[@name='requestedBy']");
    this.searchProductInput = this.page.locator("//input[@placeholder='Product search...']");
    this.selectFirstProduct = this.page.locator("//div[@role='listbox']/mat-option[1]");
    this.quantityInput = this.page.locator("//div[@formarrayname='AddOnItems']/li[1]/div//input");
    this.firstProductDiv = this.page.locator("//div[@formarrayname='AddOnItems']/li[1]/div");
    this.quantityInvalidMsg = this.page.locator(
      "//span[contains(text(),'please enter valid quantity')]"
    );
    this.discountInput = this.page.locator("//input[@formcontrolname='discountPercentage']");
    this.discountInvalidMsg = this.page.locator(
      "//mat-tooltip-component//div[text()='Discount allowed values 1-25']"
    );
    this.moneyElement = this.page.locator("//span[text()='Estimated Daily']/parent::p");
    this.listOfProducts = this.page.locator("//div[@formarrayname='AddOnItems']/li");
    this.listOfDeleteIcon = this.page.locator("//icon[@name='trah_bin_line']");
    this.noResultSpan = this.page.locator("//span[contains(text(),'No Results Found')]");
    this.productCrossLine = this.page.locator(
      "//input[@placeholder='Product search...']/../icon[@name='cross_line']"
    );
    this.nextButton = this.page.locator("//span[text()='Next']");
    this.dateSelectionModalText = this.page.locator(
      "//strong[contains(text(),'Add On Request - what days?')]"
    );
    this.arrowLineIcon = this.page.locator(
      "//strong[contains(text(),'Add On Request - what days?')]/..//icon"
    );
    this.reviewOrderBtn = this.page.locator("//span[text()='Review Order']");
    this.selectOneDateErrorMsg = this.page.locator(
      "//div[contains(text(),'Select at least one date.')]"
    );
    this.selectDate = this.page.locator("//form//ul/div/li[1]//span[contains(text(),'select')]");
    this.sendToNavigatorBtn = this.page.locator("//span[text()='Send to Navigator']");
    this.addOnRequestsList = this.page.locator('//app-add-ons/ul/div/li');
    this.severalPriorMeetingsText = this.page.locator(
      "//strong[text()='Several prior meetings were detected']"
    );
    this.selectFirstRowInAdditions = this.page.locator(
      "//li[contains(@class,'e2e_job_comparison_job_list_row')][1]"
    );
    this.changesFromPreviousMeetingsText = this.page.locator(
      "//strong[text()='Changes from Previous Meeting']"
    );
    this.additionsText = this.page.locator("//strong[text()='Additions']");
    this.RemovalsText = this.page.locator("//strong[text()='Removals']");
    this.closeButton = this.page.locator("//a[text()='Close']");
    this.backArrowBtn = this.page.locator("//app-job-comparison//icon[@name='arrow_line']");
    this.cancelButton = this.page.locator("//a[text()='Cancel']");
  }

  async searchFunction(searchText) {
    await executeStep(this.searchInput, 'fill', 'enter the job id', [searchText]);
  }

  async clickOnJob(jobId) {
    await executeStep(this.jobIdElement(jobId), 'click', 'click the room div');
  }

  async validateRoomCard(roomName, orderName, customerName) {
    await assertElementVisible(this.flowsheetDetailsDiv);
    await assertElementContainsText(this.roomNameSpan, roomName);
    await assertElementContainsText(this.orderNameSpan, orderName);
    await assertElementContainsText(this.customerNameSpan, customerName);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.moodIconText));
    try {
      await assertElementVisible(this.comparisonIcon);
    } catch (error) {
      await assertElementVisible(this.greenColorCheckBox);
    }
    await assertElementVisible(this.touchPointElement);
  }

  async clickOnContactAndValidate() {
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Contacts),
      'click',
      'click on the contacts'
    );
    await assertElementVisible(this.contactName(indexPage.opportunity_data.userContactName));
    await executeStep(this.contactDiv, 'click', 'click on first div from the list');
  }

  async verifyDocusignStatus(docusign, searchText, jobId) {
    await executeStep(this.menuIcon, 'click', 'click menu icon');
    await executeStep(this.locationProfile, 'click', 'click location profile in menu');
    await assertElementContainsText(this.docusignValue, docusign);
    await executeStep(this.flowsheetBtn, 'click', 'click on flowsheet button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    beforeRoomCount = await this.roomsCount.textContent();
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnJob(jobId);
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Add_Ons),
      'click',
      'click on add ons in flowsheet tabs'
    );
    await assertElementVisible(this.newAddOnRequestBtn);
  }

  async addOnFunction(
    requestedBy,
    individualProduct,
    packageProduct,
    invalidQuantity,
    validQuantity
  ) {
    await executeStep(this.newAddOnRequestBtn, 'click', 'click on new add-on request button');
    await assertElementVisible(this.addOnModalText);
    await executeStep(this.requestedByInput, 'fill', 'Enter the username', [requestedBy]);
    await executeStep(this.searchProductInput, 'fill', 'enter  the individual product', [
      individualProduct
    ]);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(
      this.selectFirstProduct,
      'click',
      'select the first product from  individual products'
    );
    await executeStep(this.searchProductInput, 'fill', 'enter  the package product', [
      packageProduct
    ]);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(
      this.selectFirstProduct,
      'click',
      'select the first product from  package products'
    );
    await executeStep(this.quantityInput, 'fill', 'clear the quantity', ['']);
    await executeStep(this.quantityInput, 'fill', 'enter the invalid qunatity', [invalidQuantity]);
    try {
      await assertElementVisible(this.quantityInvalidMsg);
    } catch (error) {
      await executeStep(this.quantityInput, 'fill', 'clear the quantity', ['']);
      await executeStep(this.quantityInput, 'fill', 'enter the valid qunatity', [validQuantity]);
    }
  }

  async discountChecking(invalidDiscount, validDiscount) {
    await executeStep(this.discountInput, 'fill', 'enter the discount percentage', [
      invalidDiscount
    ]);
    await this.discountInput.hover();
    await assertElementVisible(this.discountInvalidMsg);
    await executeStep(this.discountInput, 'fill', 'clear the discount input', ['']);
    await executeStep(this.discountInput, 'fill', 'enter the valid discount', [validDiscount]);
    const estimatedMoneyBeforeDiscount = await this.moneyElement.textContent();
    const originalPrice = parseFloat(estimatedMoneyBeforeDiscount.replace(/[^0-9.]/g, ''));
    await executeStep(this.discountInput, 'fill', 'enter the valid discount', [validDiscount]);
    discountPrice = formatCurrency(calculateTotalAmountAfterDiscount(originalPrice, validDiscount));
    await assertElementContainsText(this.moneyElement, discountPrice);
    const addedProductsCount = await this.listOfProducts.count();
    const deleteIconCount = await this.listOfDeleteIcon.count();
    assertEqualValues(addedProductsCount, deleteIconCount);
    await executeStep(this.searchProductInput, 'fill', 'enter the invalid text', [
      indexPage.lighthouse_data.invalidText
    ]);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.noResultSpan);
    await executeStep(this.productCrossLine, 'click', 'click on cross button');
    await executeStep(this.nextButton, 'click', 'click on next button');
  }

  async dateSelectModalChecking() {
    await assertElementVisible(this.dateSelectionModalText);
    await executeStep(this.arrowLineIcon, 'click', 'click on arrow button');
    await assertElementVisible(this.addOnModalText);
    await executeStep(this.nextButton, 'click', 'click on next button');
    await executeStep(this.reviewOrderBtn, 'click', 'click on review order button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.selectOneDateErrorMsg);
    await executeStep(this.selectDate, 'click', 'select today date');
    await executeStep(this.reviewOrderBtn, 'click', 'click on review order button');
    await assertElementVisible(this.sendToNavigatorBtn);
    await executeStep(this.sendToNavigatorBtn, 'click', 'click on send to navigator button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertGreaterThan(await this.addOnRequestsList.count(), 0);
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    afterRoomCount = await this.roomsCount.textContent();
    assertEqualValues(parseInt(afterRoomCount), parseInt(beforeRoomCount) + 1);
  }

  async assertComparisonIcon(
    searchText,
    jobId,
    requestedBy,
    individualProduct,
    packageProduct,
    invalidQuantity,
    validQuantity
  ) {
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnJob(jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    try {
      await assertElementVisible(this.comparisonIcon);
    } catch (error) {
      await assertElementVisible(this.greenColorCheckBox);
      await executeStep(
        this.flowsheetTabElement(utilConst.Const.Add_Ons),
        'click',
        'click on add ons in flowsheet tabs'
      );
      await this.addOnFunction(
        requestedBy,
        individualProduct,
        packageProduct,
        invalidQuantity,
        validQuantity
      );
      await executeStep(this.nextButton, 'click', 'click on next button');
      await executeStep(this.selectDate, 'click', 'select today date');
      await executeStep(this.reviewOrderBtn, 'click', 'click on review order button');
      await assertElementVisible(this.sendToNavigatorBtn);
      await executeStep(this.sendToNavigatorBtn, 'click', 'click on send to navigator button');
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
      await this.page.reload();
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
      assertElementVisible(this.comparisonIcon);
    }
  }

  async comparisonIconFunctionality() {
    await executeStep(this.comparisonIcon, 'click', 'click on comparision icon');
    try {
      await assertElementVisible(this.severalPriorMeetingsText);
      await executeStep(
        this.selectFirstRowInAdditions,
        'click',
        'select first element in the list'
      );
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(this.changesFromPreviousMeetingsText);
      await assertElementVisible(this.additionsText);
      await executeStep(this.RemovalsText, 'scroll', 'scroll to the element if needed');
      await assertElementVisible(this.RemovalsText);
      await executeStep(this.backArrowBtn, 'click', 'click back button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(this.severalPriorMeetingsText);
      await executeStep(
        this.selectFirstRowInAdditions,
        'click',
        'select first element in the list'
      );
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.closeButton, 'click', 'click close button');
      await executeStep(this.comparisonIcon, 'click', 'click on comparision icon');
      await executeStep(this.cancelButton, 'click', 'click on cancel button');
    } catch (error) {
      await assertElementVisible(this.changesFromPreviousMeetingsText);
      await assertElementVisible(this.additionsText);
      await executeStep(this.RemovalsText, 'scroll', 'scroll to the element if needed');
      await assertElementVisible(this.RemovalsText);
      await executeStep(this.closeButton, 'click', 'click close button');
    }
  }
};
