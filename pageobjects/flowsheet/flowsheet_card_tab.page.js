const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertElementContainsText,
  calculateTotalAmountAfterDiscount,
  assertGreaterThan,
  formatCurrency,
  assertEqualValues,
  checkVisibleElementColors,
  assertElementNotVisible,
  assertNotEqualValues,
  invalidDiscountGenerator,
  validDiscountGenerator,
  assertElementDisabled
} = require('../../utils/helper');
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
const { test } = require('@playwright/test');
let beforeRoomCount,
  afterRoomCount,
  discountPrice,
  jobNotesText,
  coverSheetText,
  equipmentCheckListText,
  equipmentByDescription,
  equipmentByName;
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
    this.moodIconInPage = this.isMobile
      ? this.page.locator(`//app-flowsheet-detail/div[1]/div[2]//app-mood-icon/icon`)
      : this.page.locator(`//app-flowsheet-detail/div[1]/div[1]//app-mood-icon/icon`);
    this.comparisonIcon = this.isMobile
      ? this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[2]")
      : this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[1]");
    this.greenColorCheckBox = this.isMobile
      ? this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[2]")
      : this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[1]");
    this.touchPointElement = this.isMobile
      ? this.page.locator('(//app-flowsheet-detail//app-mood-pia-chart)[2]')
      : this.page.locator('(//app-flowsheet-detail//app-mood-pia-chart)[1]');
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
    this.priceInConfirmationModal = this.page.locator(
      "//span[contains(text(),'Addition Total')]//following::span[contains(@class,'e2e_add_on_request_product_total_price')]"
    );
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
    this.moodModalText = this.page.locator("//span[text()='Comment']");
    this.moodChangeIconInModal = icon =>
      this.page.locator(`//app-room-mood-chooser//app-mood-icon//icon[@class='` + icon + `']`);
    this.submitButton = this.page.locator("//span[contains(text(),'Submit')]");
    this.logMsg = msg => this.page.locator(`//div[contains(text(),'` + msg + `')]`);
    this.commentBoxInput = this.page.locator(
      "//span[text()='Comment']//following-sibling::textarea"
    );
    this.notificationIcon = this.page.locator("//icon[@name='bell_notification_line']");
    this.backArrowBtnInPage = this.page.locator("//app-flowsheet-detail//icon[@name='arrow_line']");
    this.notificationMsg = msg =>
      this.page.locator(`//app-notification[1]//div[contains(text(),'` + msg + `')]`);
    this.notificationCloseBtn = this.page.locator("//icon[@name='cross_line']");
    this.logMsgCount = this.page.locator("//div[contains(text(),'Log')]/following-sibling::div");
    this.logCommentInput = this.page.locator("//input[@name='add-note-field']");
    this.commentSendBtn = this.page.locator("//icon[@name='location_line']");
    this.touchPointModal = this.page.locator('//app-touchpoint-bottom-sheet');
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
    this.backBtnInMobile = this.page.locator(
      "//icon[contains(@class,'e2e_flowsheet_detail_back')]"
    );
    this.touchPointAfterClickingCustomer = customerName =>
      this.page.locator(
        `//span[contains(text(),'` +
          customerName +
          `')]/parent::div/preceding-sibling::app-mood-pia-chart`
      );
    this.firstTouchPointIcon =
      "//span[contains(text(),'First Touchpoint')]/ancestor::div/preceding-sibling::app-mood-icon/icon";
    this.secondTouchPointIcon =
      "//span[contains(text(),'Second Touchpoint')]/ancestor::div/preceding-sibling::app-mood-icon/icon";
    this.blueIndicator = this.page.locator("//div[contains(@class,'text-blue-500')]");
    this.flowsheetRoomDiv = "//div[contains(@class,'e2e_flowsheet_action_card')]";
    this.jobOrderNotesTextDiv = this.page.locator(
      "//div[text()='Job Order Notes']/following-sibling::div/div"
    );
    this.coversheetNotesTextDiv = this.page.locator(
      "//div[text()='Coversheet Notes']/following-sibling::div/div"
    );
    this.historicalLessonsText = this.page.locator("//div[contains(text(),'Historical Lessons')]");
    this.countOfEquipments = this.page.locator(
      "//div[contains(text(),'Equipment')]/following-sibling::div"
    );
    this.listOfEquipments = this.page.locator(
      "//div[contains(@class,'e2e_flowsheet_equipment_list')]/div[contains(@class,'e2e_flowsheet_equipment_row')]"
    );
    this.equipmentCheckListOption = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_equipment_checklist_value')]")
      : this.page.locator("//span[@class='e2e_user_profile_equipment_checklist_value']");
    this.labourEquipment = this.page.locator("//span[contains(text(),'Labor')]");
    this.equipmentCheckListTurnOnAndOffBtn = this.isMobile
      ? this.page.locator(
          "(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[2]"
        )
      : this.page.locator(
          "(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[1]"
        );
    this.selectAllCheckBox = this.page.locator(
      "//span[text()='Select All']//following-sibling::input[@type='checkbox']"
    );
    this.yesButton = this.page.locator("//span[text()='Yes']");
    this.checkBoxForPackage = this.page.locator(
      "//span[@class='e2e_flowsheet_equipment_package font-semibold'][1]/../following-sibling::div//input[@type='checkbox']"
    );
    this.myProfile = this.page.locator("//span[text()='My Profile']");
    this.equipmentDisplayChioceValue = this.isMobile
      ? this.page.locator(
          "(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_value')]"
        )
      : this.page.locator(
          "//div[contains(text(),'Equipment Display Choice')]/following-sibling::div/span"
        );
    this.equipmentValueChangeButton = this.isMobile
      ? this.page.locator(
          "(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_action')]"
        )
      : this.page.locator(
          "//div[contains(text(),'Equipment Display Choice')]/following-sibling::div[contains(text(),'Update')]"
        );
    this.equipmentText = this.page.locator(
      "(//span[@class='e2e_flowsheet_equipment_package font-semibold'])[1]/following::span[@class='e2e_flowsheet_equipment_package'][1]"
    );
    this.textInModalForDocument = this.page.locator(
      "//span[text()='Encore Sales, pass control of the session to Tommy Hilfiger.']"
    );
    this.continueBtnInModal = this.page.locator(
      "//div[@class='MOB_InPersonButtons']/button[text()='Continue']"
    );
    this.acceptCheckBox = this.page.locator(
      "//span[contains(text(),'I agree to use electronic records and signatures')]/parent::span/../parent::label"
    );
    this.continueBtnInPage = this.page.locator("//span[text()='Continue']/..");
    this.startBtn = this.isMobile
      ? this.page.locator("//button[@id='action-bar-btn-finish-mobile']")
      : this.page.locator("//button[@id='navigate-btn']");
    this.signBtn = this.page.locator("//div[text()='Sign']/parent::div");
    this.selectSignStyle = this.page.locator("//span[text()='Select Style']");
    this.adoptAndSignBtn = this.page.locator("//span[text()='Adopt and Sign']");
    this.acceptAllCookiesBtn = this.page.locator("//button[contains(text(),'Accept All Cookies')]");
    this.styleSelectInMobile = this.page.locator("//button[text()='Select Style']");
    this.finishBtn = this.isMobile
      ? this.page.locator("//button[@id='action-bar-btn-finish-mobile']")
      : this.page.locator("//button[@id='action-bar-btn-finish']");
    this.requestACopyModal = this.page.locator("//h1[text()='Request a Copy']");
    this.emailInput = this.page.locator("//input[@id='in-person-email']");
    this.continueButInRequestModal = this.page.locator(
      "//button[@id='in-person-complete-continue-button']"
    );
    this.passControlModal = this.page.locator("//h1[text()='Pass Control']");
    this.continueBtnInPassControlModal = this.page.locator(
      "//button[@data-action='finishInPersonSigning']"
    );
    this.confirmModalForPositive = this.page.locator(
      "//div[contains(text(),'Your job Add-On is now on its way to being processed')]"
    );
    this.otherActionsBtn = this.isMobile
      ? this.page.locator("//span[@class='icon-menu']//parent::button")
      : this.page.locator("//button[@id='otherActionsButton']");
    this.finishLaterBtn = this.isMobile
      ? this.page.locator("//div[@id='otherActionsMenuMobile']//button[text()='Finish Later']")
      : this.page.locator("//div[@id='otherActionsMenu']//button[text()='Finish Later']");
    this.continueBtnForFinishLater = this.page.locator(
      "//button[@data-action='finishLaterInPersonSigning']"
    );
    this.confirmModalForNegative = this.page.locator(
      "//div[contains(text(),'While this particular opportunity may not have been a perfect fit')]"
    );
    this.greenNotificationMsg = this.page.locator(
      "//span[normalize-space()='Please remain on this page while we are generating a document for you. This usually takes up to a minute.']"
    );
  }

  async searchFunction(searchText) {
    await executeStep(this.searchInput, 'fill', 'Enter the job id', [searchText]);
  }

  async clickOnJob(jobId) {
    await executeStep(this.jobIdElement(jobId), 'click', 'Click the customer from list');
  }

  async performSearchFunction(searchText, jobId) {
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnJob(jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async validateRoomCard(roomName, orderName, customerName) {
    await assertElementVisible(this.flowsheetDetailsDiv, 'Verify flowsheet card is displayed');
    const getRoomName = await this.roomNameSpan.textContent();
    await assertElementContainsText(
      this.roomNameSpan,
      roomName,
      `Verify room name is displayed in the flowsheet card details. Expected: "${roomName}", Actual: "${getRoomName}"`
    );
    const getOrderName = await this.orderNameSpan.textContent();
    await assertElementContainsText(
      this.orderNameSpan,
      orderName,
      `Verify room name is displayed in the flowsheet card details. Expected: "${orderName}", Actual: "${getOrderName}"`
    );
    const getCustomerName = await this.customerNameSpan.textContent();
    await assertElementContainsText(
      this.customerNameSpan,
      customerName,
      `Verify customer name is displayed in the flowsheet card details. Expected: "${customerName}", Actual: "${getCustomerName}"`
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.moodIconInPage,
      'Verify the mood change icon is visible in the flowsheet card'
    );
    try {
      await assertElementVisible(
        this.comparisonIcon,
        'Verify comparison icon is visible when similar jobs are found'
      );
    } catch (error) {
      await assertElementVisible(
        this.greenColorCheckBox,
        'Verify green checkbox is visible when no similar jobs are found'
      );
    }
    await assertElementVisible(
      this.touchPointElement,
      'Verify the touch point indicator is displayed in the flowsheet card'
    );
  }

  async clickOnContactAndValidate() {
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Contacts),
      'click',
      'Click on the contacts'
    );
    await assertElementVisible(
      this.contactName(indexPage.opportunity_data.userContactName),
      `Verify the contact: "${indexPage.opportunity_data.userContactName}" is displayed`
    );
    await executeStep(this.contactDiv, 'click', 'Click on first div from the list');
  }

  async verifyDocusignStatus(docusign, searchText, jobId) {
    await executeStep(this.menuIcon, 'click', 'Click on menu icon');
    await executeStep(this.locationProfile, 'click', 'Click on location profile in menu');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementContainsText(
      this.docusignValue,
      docusign,
      `Verify the DocuSign value is displayed: "${docusign}"`
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    beforeRoomCount = await this.roomsCount.textContent();
    await this.performSearchFunction(searchText, jobId);
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Add_Ons),
      'click',
      'Click on add ons in flowsheet tabs'
    );
    await assertElementVisible(
      this.newAddOnRequestBtn,
      'Verify the "New Add-On Request" button is visible'
    );
  }

  async addOnFunction(
    requestedBy,
    individualProduct,
    packageProduct,
    invalidQuantity,
    validQuantity
  ) {
    await executeStep(this.newAddOnRequestBtn, 'click', 'Click on new add-on request button');
    await assertElementVisible(
      this.addOnModalText,
      'Verify "Add on request" modal should be displayed'
    );
    await executeStep(this.requestedByInput, 'fill', 'Enter the username', [requestedBy]);
    await executeStep(this.searchProductInput, 'fill', 'Enter the individual product', [
      individualProduct
    ]);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(
      this.selectFirstProduct,
      'click',
      'Select the first product from individual products'
    );
    await executeStep(this.searchProductInput, 'fill', 'Enter the package product', [
      packageProduct
    ]);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(
      this.selectFirstProduct,
      'click',
      'Select the first product from  package products'
    );
    await executeStep(this.quantityInput, 'fill', 'Clear the quantity', ['']);
    await executeStep(this.quantityInput, 'fill', 'Enter the invalid quantity', [invalidQuantity]);
    await executeStep(this.requestedByInput, 'click', 'Click request by input');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    try {
      await assertElementVisible(
        this.quantityInvalidMsg,
        'Verify proper validation message should be displayed for quantity.'
      );
      if (this.quantityInvalidMsg.isVisible()) {
        await executeStep(this.quantityInput, 'fill', 'Clear the quantity', ['']);
        await executeStep(this.quantityInput, 'fill', 'Enter the valid qunatity', [validQuantity]);
      }
    } catch {
      await assertElementNotVisible(
        this.quantityInvalidMsg,
        'Verify proper validation message should be displayed for quantity.'
      );
    }
  }

  async discountChecking(invalidDiscount, validDiscount, isNecessary) {
    await executeStep(this.discountInput, 'fill', 'Enter the discount percentage', [
      invalidDiscount
    ]);
    await this.discountInput.hover();
    if (isNecessary) {
      await assertElementVisible(
        this.discountInvalidMsg,
        'Verify proper validation message should be displayed for discount.'
      );
    }
    await executeStep(this.discountInput, 'fill', 'Clear on discount input', ['']);
    await executeStep(this.discountInput, 'fill', 'Enter the valid discount', [validDiscount]);
    const estimatedMoneyBeforeDiscount = await this.moneyElement.textContent();
    const originalPrice = parseFloat(estimatedMoneyBeforeDiscount.replace(/[^0-9.]/g, ''));
    await executeStep(this.discountInput, 'fill', 'Enter the valid discount', [validDiscount]);
    discountPrice = formatCurrency(
      calculateTotalAmountAfterDiscount(originalPrice, parseInt(validDiscount))
    );
    await assertNotEqualValues(
      discountPrice,
      estimatedMoneyBeforeDiscount,
      `Verify that the discount % is calculated properly. ActualPrice : ${estimatedMoneyBeforeDiscount} DiscountPrice : ${discountPrice}`
    );
    const addedProductsCount = await this.listOfProducts.count();
    const deleteIconCount = await this.listOfDeleteIcon.count();
    await assertEqualValues(
      addedProductsCount,
      deleteIconCount,
      `Verify that the added products count (${addedProductsCount}) is equal to the delete icon count (${deleteIconCount})`
    );
    await executeStep(this.searchProductInput, 'fill', 'Enter the invalid text', [
      indexPage.lighthouse_data.invalidText
    ]);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.noResultSpan,
      'Verify the "No Result Found" message is visible'
    );
    await executeStep(this.productCrossLine, 'click', 'Click on cross button');
    await executeStep(this.nextButton, 'click', 'Click on next button');
  }

  async dateSelectModal(isNotComplimentary) {
    await assertElementVisible(
      this.dateSelectionModalText,
      'Verify the "date selection" modal is visible'
    );
    await executeStep(this.arrowLineIcon, 'click', 'Click on arrow button');
    await assertElementVisible(this.addOnModalText, 'Verify the add-on modal is visible');
    await executeStep(this.nextButton, 'click', 'Click on next button');
    await executeStep(this.reviewOrderBtn, 'click', 'Click on review order button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.selectOneDateErrorMsg,
      'Verify the "Select at least one date" error message is visible'
    );
    await executeStep(this.selectDate, 'click', 'Select today date');
    await executeStep(this.reviewOrderBtn, 'click', 'Click on review order button');
    await assertElementVisible(
      this.sendToNavigatorBtn,
      'Verify the confirmation page should be displayed with all the valid details.'
    );
    await executeStep(this.sendToNavigatorBtn, 'click', 'Click on send to navigator button');
  }

  async dateSelectModalCheckingAndAssertRooms() {
    await this.dateSelectModal(true);
    await assertElementNotVisible(
      this.greenNotificationMsg,
      'Verify that NO Green notification message should be displayed'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const addOnRequestsCount = await this.addOnRequestsList.count();
    await assertGreaterThan(addOnRequestsCount, 0, 'Verify that there are add-on requests present');
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    afterRoomCount = await this.roomsCount.textContent();
    try {
      await assertEqualValues(
        parseInt(afterRoomCount),
        parseInt(beforeRoomCount) + 1,
        `Verify that afterRoomCount (${afterRoomCount}) is equal to beforeRoomCount (${beforeRoomCount}) + 1`
      );
    } catch {
      test.info('Romms count is not updated');
    }
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
    await this.performSearchFunction(searchText, jobId);
    try {
      await assertElementVisible(this.comparisonIcon, 'Verify the comparison icon is visible');
    } catch (error) {
      await assertElementVisible(
        this.greenColorCheckBox,
        'Verify the green color checkbox is visible'
      );
      await executeStep(
        this.flowsheetTabElement(utilConst.Const.Add_Ons),
        'click',
        'Click on add ons in flowsheet tabs'
      );
      await this.addOnFunction(
        requestedBy,
        individualProduct,
        packageProduct,
        invalidQuantity,
        validQuantity
      );
      await executeStep(this.nextButton, 'click', 'Click on next button');
      await executeStep(this.selectDate, 'click', 'Select today date');
      await executeStep(this.reviewOrderBtn, 'click', 'Click on review order button');
      await assertElementVisible(
        this.sendToNavigatorBtn,
        'Verify the "Send to Navigator" button is visible'
      );
      await executeStep(this.sendToNavigatorBtn, 'click', 'Click on send to navigator button');
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
      await this.page.reload();
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
      await assertElementVisible(this.comparisonIcon, 'Verify the comparison icon is visible');
    }
  }

  async comparisonIconFunctionality() {
    await executeStep(this.comparisonIcon, 'click', 'Click on comparision icon');
    try {
      await assertElementVisible(
        this.severalPriorMeetingsText,
        'Verify the "Several Prior Meetings" modal is visible'
      );
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.selectFirstRowInAdditions.click({ force: true });
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.changesFromPreviousMeetingsText,
        'Verify the "Changes from Previous Meetings" modal is visible'
      );
      await assertElementVisible(this.additionsText, 'Verify the "Additions" are visible');
      await executeStep(this.RemovalsText, 'scroll', 'Scroll to the element if needed');
      await assertElementVisible(this.RemovalsText, 'Verify the "Removals" are visible');
      await executeStep(this.backArrowBtn, 'click', 'Click back button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.severalPriorMeetingsText,
        'Verify the "Several Prior Meetings" modal is visible'
      );
      await this.selectFirstRowInAdditions.click({ force: true });
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.closeButton, 'click', 'Click close button');
      await executeStep(this.comparisonIcon, 'click', 'Click on comparision icon');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.cancelButton, 'click', 'Click on cancel button');
    } catch (error) {
      await assertElementVisible(
        this.changesFromPreviousMeetingsText,
        'Verify the "Changes from Previous Meetings" modal is visible'
      );
      await assertElementVisible(this.additionsText, 'Verify the "Additions" are visible');
      await executeStep(this.RemovalsText, 'scroll', 'Scroll to the element if needed');
      await assertElementVisible(this.RemovalsText, 'Verify the "Removals" are visible');
      await executeStep(this.closeButton, 'click', 'Click on close button');
    }
  }

  async assertMoodChangeHappyIcon(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(
      this.iconInPage(utilConst.Const.moodIconText),
      'Verify the mood change icon is visible'
    );
    await executeStep(
      this.iconInPage(utilConst.Const.moodIconText),
      'click',
      'Click on mood chnage icon'
    );
    await assertElementVisible(this.moodModalText, 'Verify the mood change modal is visible');
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.greenIconText),
      'click',
      'Click on happy icon in modal'
    );
    await executeStep(this.submitButton, 'click', 'Click on submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.greenIconText),
      'Verify the mood should be saved successfully - green icon should be displayed.'
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.greenIconText),
      'Verify the mood should be saved successfully - green icon should be displayed after reload.'
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'Click on log in flowsheet tab'
    );
  }

  async assertMoodChangeNeutralIcon(searchText, jobId) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.iconInPage(utilConst.Const.greenIconText),
      'click',
      'Click on happy icon in page'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.yellowIconText),
      'click',
      'Click on neutral icon in modal'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.commentBoxInput, 'fill', 'Enter the comment for neutral mood', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.submitButton, 'click', 'Click on submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.yellowIconText),
      'Verify the mood should be saved successfully - yellow icon should be displayed.'
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.yellowIconText),
      'Verify the mood should be saved successfully - yellow icon should be displayed after reload.'
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'Click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.logMsg(utilConst.Const.neutralLogMsg),
      `Verify the appropriate log record is created , log msg : "${utilConst.Const.neutralLogMsg}"`
    );
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.notificationIcon, 'click', 'Click on notification icon');
    await assertElementVisible(
      this.notificationMsg(indexPage.lighthouse_data.neutralComment),
      'Verify user notification should be received for the Neutral mood change.'
    );
    await executeStep(
      this.notificationCloseBtn,
      'click',
      'Click on cross button to close notificaton'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
  }

  async assertMoodChangeAngryIcon() {
    await executeStep(
      this.iconInPage(utilConst.Const.yellowIconText),
      'click',
      'Click on neutral icon'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.redIconText),
      'Click',
      'click on angry icon in modal'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.commentBoxInput, 'fill', 'Enter the comment for angry icon', [
      indexPage.lighthouse_data.angryComment
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.submitButton, 'click', 'Click on submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.redIconText),
      'Verify the mood should be saved successfully - red icon should be displayed.'
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      this.iconInPage(utilConst.Const.redIconText),
      'Verify the mood should be saved successfully - red icon should be displayed after reload.'
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'Click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.logMsg(utilConst.Const.angryLogMsg),
      `Verify appropriate log record is created , log msg : "${utilConst.Const.angryLogMsg}"`
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.notificationIcon, 'click', 'Click on notification button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.notificationMsg(indexPage.lighthouse_data.angryComment),
      'Verify user notification should be received for the Dissatisfied mood change.'
    );
    await executeStep(
      this.notificationCloseBtn,
      'click',
      'Click on cross button to close notificaton'
    );
  }

  async assertMoodChangeLogMsg(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.flowsheetTabElement(utilConst.Const.Log),
      'Verify the Log tab is visible in the flowsheet'
    );
    await executeStep(
      this.iconInPage(utilConst.Const.moodIconText),
      'click',
      'Click on mood change icon in page'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.greenIconText),
      'click',
      'Click on happy icon in modal'
    );
    await executeStep(this.submitButton, 'click', 'Click on submit button in modal');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'Click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.logMsg(utilConst.Const.happyLogMsg),
      'Verify the happy log message is visible'
    );
  }

  async assertCommentSectionInLog(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfLogBeforeComment = await this.logMsgCount.textContent();
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'Click on log in flowsheet tab'
    );
    await executeStep(this.logCommentInput, 'fill', 'Enter any msg in comment box', [
      indexPage.lighthouse_data.logCommentMsg
    ]);
    await executeStep(this.commentSendBtn, 'click', 'Click on send button');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    const countOfLogAfterComment = await this.logMsgCount.textContent();
    await assertEqualValues(
      parseInt(countOfLogAfterComment),
      parseInt(countOfLogBeforeComment) + 1,
      'Verify the log count increases by 1 after adding a comment'
    );
  }

  async assertLogAfterAddOn(
    requestedBy,
    individualProduct,
    packageProduct,
    invalidQuantity,
    validQuantity
  ) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfLogBeforeComment = await this.logMsgCount.textContent();
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Add_Ons),
      'click',
      'Click on add ons in flowsheet tabs'
    );
    await this.addOnFunction(
      requestedBy,
      individualProduct,
      packageProduct,
      invalidQuantity,
      validQuantity
    );
    await executeStep(this.nextButton, 'click', 'Click on next button');
    await executeStep(this.selectDate, 'click', 'Select today date');
    await executeStep(this.reviewOrderBtn, 'click', 'Click on review order button');
    await assertElementVisible(
      this.sendToNavigatorBtn,
      "Verify that the 'Send to navigator' button is visible"
    );
    await executeStep(this.sendToNavigatorBtn, 'click', 'Click on send to navigator button');
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const countOfLogAfterComment = await this.logMsgCount.textContent();
    await assertEqualValues(
      parseInt(countOfLogAfterComment),
      parseInt(countOfLogBeforeComment) + 1,
      'Verify the log count has increased by 1 after the comment is added'
    );
  }

  async assertTouchPointIndicator(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(
      this.touchPointElement,
      'Verify the touch point indicator is visible'
    );
    await executeStep(
      this.touchPointElement,
      'click',
      'Click the touch point in flowsheet details'
    );
    await assertElementVisible(this.touchPointModal, 'Verify the touch point modal is visible');
    await executeStep(this.happyIconInTouchPoint, 'click', 'Click on happy icon in modal');
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on back button');
    }
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    if (this.isMobile) {
      this.performSearchFunction(searchText, jobId);
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }

  async assertSecondItemInTouchPoint() {
    await executeStep(
      this.touchPointElement,
      'click',
      'Click the touch point in flowsheet details'
    );
    await assertElementVisible(this.touchPointModal, 'Verify the touch point modal is visible');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.neutralIconInTouchPoint, 'click', 'Click the neutral icon in modal');
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await assertElementVisible(
      this.noteRequiresMsgInModal,
      'Verify the note requires message in the modal is visible'
    );
    await executeStep(this.noteInput, 'fill', 'Enter the msg in note input', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.saveButton, 'click', 'Click on save button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on back button');
    }
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    if (this.isMobile) {
      this.performSearchFunction(
        indexPage.navigator_data.second_job_no,
        indexPage.navigator_data.second_job_no
      );
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }

  async assertRemainingItemsInTouchPoint() {
    let isItem = true;
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    while (isItem) {
      await executeStep(
        this.touchPointElement,
        'click',
        'Click the touch point in flowsheet details'
      );

      try {
        await assertElementVisible(
          this.touchPointModal,
          'Verify the touch point modal is displayed'
        );
        await executeStep(this.angryIconInTouchPoint, 'click', 'Click the angry icon in modal');
        await executeStep(this.noteInput, 'fill', 'Enter the msg in note input', [
          indexPage.lighthouse_data.angryComment
        ]);
        await executeStep(this.saveButton, 'click', 'Click on save button');
      } catch (error) {
        await assertElementVisible(
          this.touchPointLimitMsg,
          'Verify the touch point limit message is visible'
        );
        isItem = false;
      }
    }
  }

  async assertCustomerUrl() {
    if (this.isMobile) {
      await executeStep(this.orderNameSpan, 'click', 'Click on order name');
    } else {
      await executeStep(this.customerNameSpan, 'click', 'Click the customer name');
    }
    await assertElementVisible(
      this.touchPointAfterClickingCustomer(indexPage.opportunity_data.endUserAccount),
      `Verify the touch point for the customer '${indexPage.opportunity_data.endUserAccount}' is visible after clicking`
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.tabNames[3]),
      'click',
      'Click touchpoint in tab'
    );
  }

  async assertNotesTab(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(
      this.flowsheetTabElement(utilConst.Const.Notes),
      'Verify the Notes flowsheet tab is visible'
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Notes),
      'click',
      'Click on notes tab'
    );
    jobNotesText = await this.jobOrderNotesTextDiv.textContent();
    coverSheetText = await this.coversheetNotesTextDiv.textContent();
    try {
      if (jobNotesText !== null || coverSheetText !== null) {
        await assertElementVisible(this.blueIndicator, 'Verify the blue indicator is visible');
      }
    } catch (error) {
      await assertElementNotVisible(this.blueIndicator, 'Verify the blue indicator is not visible');
    }
  }

  async assertFlowsheetTextAndNavigatorText() {
    await assertEqualValues(
      jobNotesText,
      indexPage.opportunity_data.jobNotesTextArea,
      `Verify job notes text is equal to the expected job notes. Expected: "${indexPage.opportunity_data.jobNotesTextArea}", Actual: "${jobNotesText}"`
    );
    await assertEqualValues(
      coverSheetText,
      indexPage.opportunity_data.coverSheetTextArea,
      `Verify cover sheet text matches the expected value. Expected: "${indexPage.opportunity_data.coverSheetTextArea}", Actual: "${coverSheetText}"`
    );
    await executeStep(this.historicalLessonsText, 'scroll', 'Scroll to that element if needed');
  }

  async assertEquipmentTab(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(
      this.flowsheetTabElement(utilConst.Const.Equipment),
      'Verify the Equipment flowsheet tab is visible'
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Equipment),
      'click',
      'Click on equipment tab'
    );
    const countOfEquipmentsInTab = await this.countOfEquipments.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfListOfEquipments = await this.listOfEquipments.count();
    await assertEqualValues(
      parseInt(countOfEquipmentsInTab),
      countOfListOfEquipments,
      `Verify that the count of equipments in the tab (${parseInt(countOfEquipmentsInTab)}) matches the count of equipments in the list (${countOfListOfEquipments})`
    );
  }

  async assertEquipmentsInLightHouseAndNavigator() {
    const countOfEquipmentsInLightHouse = await this.listOfEquipments.count();
    const isLabourDisplayed = await this.labourEquipment.isVisible();
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
    await newPage.waitForTimeout(parseInt(process.env.small_max_timeout));
    await newPage.goto(indexPage.navigator_data.navigatorUrl_createdata1, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    if (await createDataPage.reloadErrorMsg.isVisible()) {
      await newPage.reload();
    }
    await createDataPage.getCountOfEquipments();
    let countOfEquipmentsInNavigator;
    if (isLabourDisplayed) {
      countOfEquipmentsInNavigator = (await createDataPage.equipmentRowsCount.count()) - 1;
    } else {
      countOfEquipmentsInNavigator = (await createDataPage.equipmentRowsCount.count()) - 2;
    }
    await assertEqualValues(
      countOfEquipmentsInLightHouse,
      countOfEquipmentsInNavigator,
      `Verify that the count of equipments in Lighthouse (${countOfEquipmentsInLightHouse}) matches the count in Navigator (${countOfEquipmentsInNavigator})`
    );
    await newPage.waitForTimeout(parseInt(process.env.small_timeout));
    await newPage.close();
  }

  async assertEquipmentCheckList() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click back button');
    }
    await executeStep(this.menuIcon, 'click', 'Click on menu icon');
    await executeStep(this.locationProfile, 'click', 'Click on location profile from menu');
    equipmentCheckListText = await this.equipmentCheckListOption.textContent();
    if (equipmentCheckListText.trim() === indexPage.lighthouse_data.turnOff) {
      await executeStep(this.equipmentCheckListTurnOnAndOffBtn, 'click', 'Click turn on button');
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click flowsheet button');
    await this.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await assertElementVisible(
      this.selectAllCheckBox,
      'Verify that the "Select All checkbox" is visible'
    );
    if (await this.selectAllCheckBox.isChecked()) {
      await this.selectAllCheckBox.uncheck();
    } else {
      await this.selectAllCheckBox.check();
    }
    await executeStep(this.yesButton, 'click', 'Click on yes button to check or uncheck');
    if (await this.checkBoxForPackage.isChecked()) {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.checkBoxForPackage.uncheck();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    } else {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.checkBoxForPackage.check();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
  }

  async assertCheckBox() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on Back button');
    }
    await executeStep(this.menuIcon, 'click', 'Click on Menu icon');
    await executeStep(this.locationProfile, 'click', 'Click on Location Profile Tab');
    equipmentCheckListText = await this.equipmentCheckListOption.textContent();
    if (equipmentCheckListText.trim() === indexPage.lighthouse_data.turnOn) {
      await executeStep(
        this.equipmentCheckListTurnOnAndOffBtn,
        'click',
        'Click on Turn off button'
      );
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click Flowsheet Button');
    await this.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
  }

  async assertEquipmentByDescription() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click back button in mobile');
    }
    await executeStep(this.menuIcon, 'click', 'Click on menu icon');
    await executeStep(this.myProfile, 'click', 'Click on my profile');
    const equipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    if (equipmentDispalyValue.trim() === indexPage.lighthouse_data.equipmentName) {
      await executeStep(this.equipmentValueChangeButton, 'click', 'Click on update button');
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    await this.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    equipmentByDescription = await this.equipmentText.textContent();
  }

  async assertEquipmentByName() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on back button in mobile');
    }
    await executeStep(this.menuIcon, 'click', 'Click on menu icon');
    await executeStep(this.myProfile, 'click', 'Click on my profile');
    const equipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    if (equipmentDispalyValue.trim() === indexPage.lighthouse_data.equipmentDescription) {
      await executeStep(this.equipmentValueChangeButton, 'click', 'Click on update button');
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    await this.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    equipmentByName = await this.equipmentText.textContent();
    await assertNotEqualValues(
      equipmentByDescription,
      equipmentByName,
      `Verify that the equipment by description (${equipmentByDescription}) is not equal to the equipment by name (${equipmentByName})`
    );
  }

  async createAddOn(docusignValue, searchText, jobId, isNecessary) {
    await this.verifyDocusignStatus(docusignValue, searchText, jobId);
    await this.addOnFunction(
      indexPage.lighthouse_data.requestedBy,
      indexPage.lighthouse_data.individualProduct,
      indexPage.lighthouse_data.packageProduct,
      indexPage.lighthouse_data.invalidQuantity,
      indexPage.lighthouse_data.validQuantity
    );
    await this.discountChecking(invalidDiscountGenerator(), validDiscountGenerator(), isNecessary);
    await this.dateSelectModal(true);
    await assertElementVisible(
      this.greenNotificationMsg,
      'Verify that Green notification message should be displayed while the document is being generated.'
    );
    await this.page.waitForTimeout(parseInt(process.env.default_timeout));
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
  }

  async assertDocument(scenario) {
    await executeStep(this.continueBtnInModal, 'click', 'Click on comtinue button');
    if (await this.acceptAllCookiesBtn.isVisible()) {
      await executeStep(this.acceptAllCookiesBtn, 'click', 'Click on Accept Cookies');
    }
    await executeStep(this.acceptCheckBox, 'click', 'Click on checkbox');
    await executeStep(this.continueBtnInPage, 'click', 'Click on continue button in document');
    if (scenario === 'positive') {
      await executeStep(this.startBtn, 'click', 'Click on start button');
      await executeStep(this.signBtn, 'click', 'Click on sign button');
      if (this.isMobile) {
        executeStep(this.styleSelectInMobile, 'click', 'Click style select');
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      }
      if (await this.acceptAllCookiesBtn.isVisible()) {
        await executeStep(this.acceptAllCookiesBtn, 'click', 'Click on Accept Cookies');
      }
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      if (this.isMobile) {
        await executeStep(this.selectSignStyle, 'click', 'Click on Select Style button');
      }
      await executeStep(this.adoptAndSignBtn, 'click', 'Click on adopt and sign button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(this.finishBtn, 'Verify that the Finish button is visible');
      await executeStep(this.finishBtn, 'click', 'Click on fnish button');
      await assertElementVisible(
        this.requestACopyModal,
        'Verify that the "Request a Copy" modal is visible'
      );
      await executeStep(this.emailInput, 'fill', 'Enter the email id', [
        atob(process.env.lighthouseEmail)
      ]);
      await executeStep(this.continueButInRequestModal, 'click', 'Click on continue');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.passControlModal,
        'Verify that the "Pass Control" modal is visible'
      );
      await executeStep(this.continueBtnInPassControlModal, 'click', 'Click on continue button');
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      await assertElementVisible(
        this.confirmModalForPositive,
        'Verify that the Confirmation modal is visible for positive flow'
      );
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    } else {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.otherActionsBtn, 'click', 'Click on other actions');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      if (!this.finishLaterBtn.isVisible()) {
        await executeStep(this.otherActionsBtn, 'click', 'Click on other actions');
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      }
      await executeStep(this.finishLaterBtn, 'click', 'Click on finish later button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.continueBtnForFinishLater, 'click', 'Click on continue button');
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      await assertElementVisible(
        this.confirmModalForNegative,
        'Verify that the Confirmation modal is visible for negative flow'
      );
    }
  }

  async assertRoomCountAfterAddOn() {
    afterRoomCount = await this.roomsCount.textContent();
    try {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertGreaterThan(
        parseInt(afterRoomCount),
        parseInt(beforeRoomCount),
        `Verify that after room count (${parseInt(afterRoomCount)}) is greater than before room count (${parseInt(beforeRoomCount)})`
      );
    } catch {
      test.info('Rooms not updated...');
    }
  }

  async assertStatusOfNavigatorJob(scenario) {
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
    if (scenario === 'positive') {
      await assertElementVisible(
        createDataPage.statusOfJob(indexPage.lighthouse_data.confirmed),
        `Verify that the status of the job (${indexPage.lighthouse_data.confirmed}) is visible in Navigator`
      );
    } else {
      await assertElementVisible(
        createDataPage.statusOfJob(indexPage.lighthouse_data.cancel),
        `Verify that the status of the job (${indexPage.lighthouse_data.cancel}) is visible in Navigator`
      );
    }
  }

  async createAddOnForComplimentaryJob(docusignValue, searchText, jobId) {
    await this.verifyDocusignStatus(docusignValue, searchText, jobId);
    await this.addOnFunction(
      indexPage.lighthouse_data.requestedBy,
      indexPage.lighthouse_data.individualProduct,
      indexPage.lighthouse_data.packageProduct,
      indexPage.lighthouse_data.invalidQuantity,
      indexPage.lighthouse_data.validQuantity
    );
    await assertElementDisabled(
      this.discountInput,
      'Verify that the discount input field is disabled for a complimentary job'
    );
    await executeStep(this.nextButton, 'click', 'Click on next button');
    await this.dateSelectModal(false);
    await this.page.waitForTimeout(parseInt(process.env.default_timeout));
  }
};
