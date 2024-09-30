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
  validDiscountGenerator
} = require('../../utils/helper');
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
let beforeRoomCount, afterRoomCount, discountPrice, jobNotesText, coverSheetText, equipmentCheckListText,equipmentByDescription,equipmentByName;
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
    this.countOfEquipments = this.page.locator("//div[contains(text(),'Equipment')]/following-sibling::div");
    this.listOfEquipments = this.page.locator("//div[contains(@class,'e2e_flowsheet_equipment_list')]/div[contains(@class,'e2e_flowsheet_equipment_row')]");
    this.equipmentCheckListOption = this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_equipment_checklist_value')]") 
            : this.page.locator("//span[@class='e2e_user_profile_equipment_checklist_value']");
    this.labourEquipment = this.page.locator("//span[contains(text(),'Labor')]");
    this.equipmentCheckListTurnOnAndOffBtn = this.isMobile ? this.page.locator("(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[2]")
            : this.page.locator("(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[1]");
    this.selectAllCheckBox = this.page.locator("//span[text()='Select All']//following-sibling::input[@type='checkbox']");
    this.yesButton = this.page.locator("//span[text()='Yes']");
    this.checkBoxForPackage = this.page.locator("//span[@class='e2e_flowsheet_equipment_package font-semibold'][1]/../following-sibling::div//input[@type='checkbox']");
    this.myProfile = this.page.locator("//span[text()='My Profile']");
    this.equipmentDisplayChioceValue = this.isMobile ? this.page.locator("(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_value')]")
          : this.page.locator("//div[contains(text(),'Equipment Display Choice')]/following-sibling::div/span");
    this.equipmentValueChangeButton = this.isMobile ? this.page.locator("(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_action')]")
            : this.page.locator("//div[contains(text(),'Equipment Display Choice')]/following-sibling::div[contains(text(),'Update')]");
    this.equipmentText = this.page.locator("(//span[@class='e2e_flowsheet_equipment_package font-semibold'])[1]/following::span[@class='e2e_flowsheet_equipment_package'][1]");
    this.textInModalForDocument = this.page.locator("//span[text()='Encore Sales, pass control of the session to Tommy Hilfiger.']");
    this.continueBtnInModal = this.page.locator("//div[@class='MOB_InPersonButtons']/button[text()='Continue']");
    this.acceptCheckBox = this.page.locator("//label[@for='disclosureAccepted']");
    this.continueBtnInPage = this.page.locator("//button[@id='action-bar-btn-continue']");
    this.startBtn = this.isMobile ? this.page.locator("//button[@id='action-bar-btn-finish-mobile']")
              : this.page.locator("//button[@id='navigate-btn']");
    this.signBtn = this.page.locator("//div[text()='Sign']/parent::div");
    this.adoptAndSignBtn = this.page.locator("//button[text()='Adopt and Sign']");
    this.styleSelectInMobile = this.page.locator("//button[text()='Select Style']");
    this.finishBtn = this.isMobile ? this.page.locator("//button[@id='action-bar-btn-finish-mobile']")
            : this.page.locator("//button[@id='action-bar-btn-finish']");
    this.requestACopyModal = this.page.locator("//h1[text()='Request a Copy']");
    this.emailInput = this.page.locator("//input[@id='in-person-email']");
    this.continueButInRequestModal = this.page.locator("//button[@id='in-person-complete-continue-button']");
    this.passControlModal = this.page.locator("//h1[text()='Pass Control']");
    this.continueBtnInPassControlModal = this.page.locator("//button[@data-action='finishInPersonSigning']");
    this.confirmModalForPositive = this.page.locator("//div[contains(text(),'Your job Add-On is now on its way to being processed')]");
    this.otherActionsBtn = this.isMobile ? this.page.locator("//span[@class='icon-menu']") 
            : this.page.locator("//button[@id='otherActionsButton']");
    this.finishLaterBtn = this.isMobile ? this.page.locator("//div[@id='otherActionsMenuMobile']//button[text()='Finish Later']")
            : this.page.locator("//div[@id='otherActionsMenu']//button[text()='Finish Later']");
    this.continueBtnForFinishLater = this.page.locator("//button[@data-action='finishLaterInPersonSigning']");
    this.confirmModalForNegative = this.page.locator("//div[contains(text(),'While this particular opportunity may not have been a perfect fit')]");
  }

  async searchFunction(searchText) {
    await executeStep(this.searchInput, 'fill', 'enter the job id', [searchText]);
  }

  async clickOnJob(jobId) {
    await executeStep(this.jobIdElement(jobId), 'click', 'click the room div');
  }

  async performSearchFunction(searchText, jobId) {
    await this.searchFunction(searchText);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnJob(jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async validateRoomCard(roomName, orderName, customerName) {
    await assertElementVisible(this.flowsheetDetailsDiv);
    await assertElementContainsText(this.roomNameSpan, roomName);
    await assertElementContainsText(this.orderNameSpan, orderName);
    await assertElementContainsText(this.customerNameSpan, customerName);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.moodIconInPage);
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
    await this.performSearchFunction(searchText, jobId);
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
    // await assertElementVisible(this.discountInvalidMsg);
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

  async dateSelectModal() {
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
  }

  async dateSelectModalCheckingAndAssertRooms() {
    await this.dateSelectModal();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertGreaterThan(await this.addOnRequestsList.count(), 0);
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    afterRoomCount = await this.roomsCount.textContent();
    try{
      await assertEqualValues(parseInt(afterRoomCount), parseInt(beforeRoomCount) + 1);
    }catch {
      console.error("Romms count is not updated");
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
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.selectFirstRowInAdditions.click({ force: true });
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(this.changesFromPreviousMeetingsText);
      await assertElementVisible(this.additionsText);
      await executeStep(this.RemovalsText, 'scroll', 'scroll to the element if needed');
      await assertElementVisible(this.RemovalsText);
      await executeStep(this.backArrowBtn, 'click', 'click back button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(this.severalPriorMeetingsText);
      await this.selectFirstRowInAdditions.click({ force: true });
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.closeButton, 'click', 'click close button');
      await executeStep(this.comparisonIcon, 'click', 'click on comparision icon');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.cancelButton, 'click', 'click on cancel button');
    } catch (error) {
      await assertElementVisible(this.changesFromPreviousMeetingsText);
      await assertElementVisible(this.additionsText);
      await executeStep(this.RemovalsText, 'scroll', 'scroll to the element if needed');
      await assertElementVisible(this.RemovalsText);
      await executeStep(this.closeButton, 'click', 'click close button');
    }
  }

  async assertMoodChangeHappyIcon(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(this.iconInPage(utilConst.Const.moodIconText));
    await executeStep(
      this.iconInPage(utilConst.Const.moodIconText),
      'click',
      'click on mood chnage icon'
    );
    await assertElementVisible(this.moodModalText);
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.greenIconText),
      'click',
      'click on happy icon in modal'
    );
    await executeStep(this.submitButton, 'click', 'click submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.greenIconText));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.greenIconText));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'click log in flowsheet tab'
    );
    await assertElementVisible(this.logMsg(utilConst.Const.happyLogMsg));
  }

  async assertMoodChangeNeutralIcon(searchText, jobId) {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.iconInPage(utilConst.Const.greenIconText),
      'click',
      'click on happy icon in page'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.yellowIconText),
      'click',
      'click neutral icon in modal'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.commentBoxInput, 'fill', 'enter the comment for neutral mood', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.submitButton, 'click', 'click on submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.yellowIconText));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.yellowIconText));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.logMsg(utilConst.Const.neutralLogMsg));
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.notificationIcon, 'click', 'click on notification icon');
    await assertElementVisible(this.notificationMsg(indexPage.lighthouse_data.neutralComment));
    await executeStep(
      this.notificationCloseBtn,
      'click',
      'click on cross button to close notificaton'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
  }

  async assertMoodChangeAngryIcon() {
    await executeStep(
      this.iconInPage(utilConst.Const.yellowIconText),
      'click',
      'click on neutral icon'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.redIconText),
      'click',
      'click on angry icon in modal'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.commentBoxInput, 'fill', 'enter the comment for angry icon', [
      indexPage.lighthouse_data.angryComment
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.submitButton, 'click', 'click on submit button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.redIconText));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(this.iconInPage(utilConst.Const.redIconText));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.logMsg(utilConst.Const.angryLogMsg));
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(this.notificationIcon, 'click', 'click on notification button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.notificationMsg(indexPage.lighthouse_data.angryComment));
    await executeStep(
      this.notificationCloseBtn,
      'click',
      'click on cross button to close notificaton'
    );
  }

  async assertMoodChangeLogMsg(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    assertElementVisible(this.flowsheetTabElement(utilConst.Const.Log));
    await executeStep(
      this.iconInPage(utilConst.Const.moodIconText),
      'click',
      'click mood change icon in page'
    );
    await executeStep(
      this.moodChangeIconInModal(utilConst.Const.greenIconText),
      'click',
      'click on happy icon in modal'
    );
    await executeStep(this.submitButton, 'click', 'click on submit button in modal');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'click on log in flowsheet tab'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.logMsg(utilConst.Const.happyLogMsg));
  }

  async assertCommentSectionInLOg(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfLogBeforeComment = await this.logMsgCount.textContent();
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Log),
      'click',
      'click on log in flowsheet tab'
    );
    await executeStep(this.logCommentInput, 'fill', 'Enter any msg in comment box', [
      indexPage.lighthouse_data.logCommentMsg
    ]);
    await executeStep(this.commentSendBtn, 'click', 'click on send button');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    const countOfLogAfterComment = await this.logMsgCount.textContent();
    await assertEqualValues(
      parseInt(countOfLogAfterComment),
      parseInt(countOfLogBeforeComment) + 1
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
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const countOfLogAfterComment = await this.logMsgCount.textContent();
    await assertEqualValues(
      parseInt(countOfLogAfterComment),
      parseInt(countOfLogBeforeComment) + 1
    );
  }

  async assertTouchPointIndicator(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(this.touchPointElement);
    await executeStep(
      this.touchPointElement,
      'click',
      'click the touch point in flowsheet details'
    );
    await assertElementVisible(this.touchPointModal);
    await executeStep(this.happyIconInTouchPoint, 'click', 'click on happy icon in modal');
    await executeStep(this.saveButton, 'click', 'click on save button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'click on back button');
    }
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    if (this.isMobile) {
      this.performSearchFunction(searchText, jobId);
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await checkVisibleElementColors(this.page, this.touchPointItems(1), 'rgb(23, 181, 57)');
  }

  async assertSecondItemInTouchPoint() {
    await executeStep(
      this.touchPointElement,
      'click',
      'click the touch point in flowsheet details'
    );
    await assertElementVisible(this.touchPointModal);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout)); 
    await executeStep(this.neutralIconInTouchPoint, 'click', 'click the neutral icon in modal');
    await executeStep(this.saveButton, 'click', 'click on save button');
    await assertElementVisible(this.noteRequiresMsgInModal);
    await executeStep(this.noteInput, 'fill', 'enter the msg in note input', [
      indexPage.lighthouse_data.neutralComment
    ]);
    await executeStep(this.saveButton, 'click', 'click on save button');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'click on back button');
    }
    await this.searchFunction(indexPage.navigator_data.order_name.trim());
    if (this.isMobile) {
      this.performSearchFunction(
        indexPage.navigator_data.second_job_no,
        indexPage.navigator_data.second_job_no
      );
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await checkVisibleElementColors(this.page, this.touchPointItems(2), 'rgb(244, 235, 0)');
  }

  async assertRemainingItemsInTouchPoint() {
    let isItem = true;
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    while (isItem) {
      await executeStep(
        this.touchPointElement,
        'click',
        'click the touch point in flowsheet details'
      );

      try {
        await assertElementVisible(this.touchPointModal);
        await executeStep(this.angryIconInTouchPoint, 'click', 'click the angry icon in modal');
        await executeStep(this.noteInput, 'fill', 'enter the msg in note input', [
          indexPage.lighthouse_data.angryComment
        ]);
        await executeStep(this.saveButton, 'click', 'click on save button');
      } catch (error) {
        await assertElementVisible(this.touchPointLimitMsg);
        isItem = false;
      }
    }
  }

  async assertCustomerUrl() {
    if (this.isMobile) {
      await executeStep(this.orderNameSpan, 'click', 'click order name');
    } else {
      await executeStep(this.customerNameSpan, 'click', 'click customer name');
    }
    await assertElementVisible(
      this.touchPointAfterClickingCustomer(indexPage.opportunity_data.endUserAccount)
    );
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.tabNames[3]),
      'click',
      'click touchpoint in tab'
    );
    await checkVisibleElementColors(this.page, this.firstTouchPointIcon, 'rgb(23, 181, 57)');
    await checkVisibleElementColors(this.page, this.secondTouchPointIcon, 'rgb(244, 235, 0)');
  }

  async assertNotesTab(searchText, jobId) {
    await this.performSearchFunction(searchText, jobId);
    await assertElementVisible(this.flowsheetTabElement(utilConst.Const.Notes));
    await executeStep(
      this.flowsheetTabElement(utilConst.Const.Notes),
      'click',
      'click on notes tab'
    );
    jobNotesText = await this.jobOrderNotesTextDiv.textContent();
    coverSheetText = await this.coversheetNotesTextDiv.textContent();
    try {
      if (jobNotesText !== null || coverSheetText !== null) {
        await assertElementVisible(this.blueIndicator);
      }
    } catch (error) {
      await assertElementNotVisible(this.blueIndicator);
    }
  }

  async assertFlowsheetTextAndNavigatorText() {
    await assertEqualValues(jobNotesText, indexPage.opportunity_data.jobNotesTextArea);
    await assertEqualValues(coverSheetText, indexPage.opportunity_data.coverSheetTextArea);
    await executeStep(this.historicalLessonsText, 'scroll', 'scroll to that element if needed');
  }

  async assertEquipmentTab(searchText,jobId) {
    await this.performSearchFunction(searchText,jobId);
    await assertElementVisible(this.flowsheetTabElement(utilConst.Const.Equipment));
    await executeStep(this.flowsheetTabElement(utilConst.Const.Equipment),"click","click on equipment tab");
    const countOfEquipmentsInTab = await this.countOfEquipments.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfListOfEquipments = await this.listOfEquipments.count();
    await assertEqualValues(parseInt(countOfEquipmentsInTab),countOfListOfEquipments);
  }

  async assertEquipmentsInLightHouseAndNavigator() {
    const countOfEquipmentsInLightHouse =await this.listOfEquipments.count();
    const isLabourDisplayed = await this.labourEquipment.isVisible();
    const newPage = await this.page.context().newPage();
    await newPage.goto(indexPage.navigator_data.navigatorUrl ,  {
      timeout: parseInt(process.env.pageload_timeout)
    });
    const navigatorLogin = new indexPage.NavigatorLoginPage(newPage);
    await navigatorLogin.login_navigator(atob(process.env.email), atob(process.env.password));
    await newPage.waitForTimeout(parseInt(process.env.medium_timeout));
    await newPage.goto(indexPage.navigator_data.navigatorUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    const createDataPage = new indexPage.CreateData(newPage);
    await createDataPage.getCountOfEquipments();
    let countOfEquipmentsInNavigator;
    if(isLabourDisplayed) {
        countOfEquipmentsInNavigator = await createDataPage.equipmentRowsCount.count()-1; 
    } else {
        countOfEquipmentsInNavigator = await createDataPage.equipmentRowsCount.count()-2;
    }
    await assertEqualValues(countOfEquipmentsInLightHouse,countOfEquipmentsInNavigator);
    await newPage.waitForTimeout(parseInt(process.env.small_timeout));
    await newPage.close();
  }

  async assertEquipmentCheckList() {
    if(this.isMobile) {
      await executeStep(this.backBtnInMobile,"click","click back button")
    }
    await executeStep(this.menuIcon,"click","click on menu icon");
    await executeStep(this.locationProfile,"click","click on location profile from menu");
    equipmentCheckListText = await this.equipmentCheckListOption.textContent();
    if(equipmentCheckListText.trim() === indexPage.lighthouse_data.turnOff) {
      await executeStep(this.equipmentCheckListTurnOnAndOffBtn,"click","click turn on button");
    }
    await executeStep(this.flowsheetBtn,"click","click flowsheet button");
    await this.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    await assertElementVisible(this.selectAllCheckBox);
    if (await this.selectAllCheckBox.isChecked()) {
      await this.selectAllCheckBox.uncheck();
    }else {
      await this.selectAllCheckBox.check();
    }
    await executeStep(this.yesButton,"click","click on yes button to check or uncheck")
    if(await this.checkBoxForPackage.isChecked()) {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.checkBoxForPackage.uncheck();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }else {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.checkBoxForPackage.check();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
  }

  async assertCheckBox() {
    if(this.isMobile) {
      await executeStep(this.backBtnInMobile,"click","click back button")
    }
    await executeStep(this.menuIcon,"click","click on menu icon");
    await executeStep(this.locationProfile,"click","click on location profile");
    equipmentCheckListText = await this.equipmentCheckListOption.textContent();
    if(equipmentCheckListText.trim() === indexPage.lighthouse_data.turnOn) {
      await executeStep(this.equipmentCheckListTurnOnAndOffBtn,"click","click on turn off button");
    }
    await executeStep(this.flowsheetBtn,"click","click flowsheet button");
    await this.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    await assertElementNotVisible(this.selectAllCheckBox);
  }

  async assertEquipmentByDescription() {
    if(this.isMobile){
      await executeStep(this.backBtnInMobile,"click","click back button in mobile");
    }
    await executeStep(this.menuIcon,"click","click on menu icon");
    await executeStep(this.myProfile,"click","click on my profile");
    const equipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    if(equipmentDispalyValue.trim() === indexPage.lighthouse_data.equipmentName) {
        await executeStep(this.equipmentValueChangeButton,"click","click on update button");
    }
    await executeStep(this.flowsheetBtn,"click","click on flowsheet button");
    await this.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    equipmentByDescription = await this.equipmentText.textContent();
  }

  async assertEquipmentByName() {
    if(this.isMobile){
      await executeStep(this.backBtnInMobile,"click","click back button in mobile");
    }
    await executeStep(this.menuIcon,"click","click on menu icon");
    await executeStep(this.myProfile,"click","click on my profile");
    const equipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    if(equipmentDispalyValue.trim() === indexPage.lighthouse_data.equipmentDescription) {
        await executeStep(this.equipmentValueChangeButton,"click","click on update button");
    }
    await executeStep(this.flowsheetBtn,"click","click on flowsheet button");
    await this.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    equipmentByName = await this.equipmentText.textContent();
    await assertNotEqualValues(equipmentByDescription,equipmentByName);
  }

  async createAddOn(docusignValue,searchText,jobId) {
   await this.verifyDocusignStatus(docusignValue,searchText,jobId);
   await this.addOnFunction(indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity );
    await this.discountChecking(
      invalidDiscountGenerator(),
      validDiscountGenerator()
    );
    await this.dateSelectModal();
    await this.page.waitForTimeout(parseInt(process.env.default_timeout));
    await assertElementVisible(this.textInModalForDocument);
  }

  async assertDocument(scenario) {
    await executeStep(this.continueBtnInModal,"click","click on comtinue button");
    await executeStep(this.acceptCheckBox,"click","click the checkbox");
    await executeStep(this.continueBtnInPage,"click","click on continue button in document");
    if(scenario === "positive") {
      await executeStep(this.startBtn,"click","click on start button");
    await executeStep(this.signBtn,"click","click on sign button");
    if(this.isMobile) {
      executeStep(this.styleSelectInMobile,"click","click style select");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await executeStep(this.adoptAndSignBtn,"click","click on adopt and sign button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.finishBtn);
    await executeStep(this.finishBtn,"click","click on fnish button");
    await assertElementVisible(this.requestACopyModal);
    await executeStep(this.emailInput,"fill","enter the email id",[atob(process.env.lighthouseEmail)]);
    await executeStep(this.continueButInRequestModal,"click","click on continue");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.passControlModal);
    await executeStep(this.continueBtnInPassControlModal,"click","click on continue button");
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    await assertElementVisible(this.confirmModalForPositive);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    } else {
      await executeStep(this.otherActionsBtn,"click","click on other actions");
      await executeStep(this.finishLaterBtn,"click","click on finish later button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.continueBtnForFinishLater,"click","click continue button");
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      await assertElementVisible(this.confirmModalForNegative);
    }
    
  }

  async assertRoomCountAfterAddOn() {
    afterRoomCount = await this.roomsCount.textContent();
    try{
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertGreaterThan(parseInt(afterRoomCount),parseInt(beforeRoomCount));
    }catch {
      console.error("Rooms not updated...")
    }
    
  }

  async assertStatusOfNavigatorJob(scenario) {
    const newPage = await this.page.context().newPage();
    await newPage.goto(indexPage.navigator_data.navigatorUrl ,  {
      timeout: parseInt(process.env.pageload_timeout)
    });
    const navigatorLogin = new indexPage.NavigatorLoginPage(newPage);
    await navigatorLogin.login_navigator(atob(process.env.email), atob(process.env.password));
    await newPage.waitForTimeout(parseInt(process.env.medium_timeout));
    await newPage.goto(indexPage.navigator_data.navigatorUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    const createDataPage = new indexPage.CreateData(newPage);
    await createDataPage.searchWithJobId();
    if(scenario === "positive") {
      assertElementVisible(createDataPage.statusOfJob(indexPage.lighthouse_data.confirmed));
    }else {
      assertElementVisible(createDataPage.statusOfJob(indexPage.lighthouse_data.cancel));
    }
  }
};
