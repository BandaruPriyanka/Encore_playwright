const { executeStep } = require('../../utils/action');
const indexPage = require('../../utils/index.page');
const utilConst = require('../../utils/const');
const fs = require('node:fs/promises');
const { test, expect } = require('@playwright/test');
const {
  assertElementVisible,
  assertContainsValue,
  assertNotEqualValues,
  assertEqualValues,
  assertElementNotVisible,
  verifyNavigationElements,
  validateLastSyncedText,
  checkTimeFormat,
  extractTime,
  assertElementTrue,
  assertElementColor,
  verifyBackgroundColor,
  assertValueToBe
} = require('../../utils/helper');
const { after } = require('node:test');
const { addAbortListener } = require('node:events');
let initialEquipmentDispalyValue,
  getequipmentTextByIntialDisplayValue,
  getequipmentTextByChangedDisplayValue,
  initialScheduleViewValue,
  initialLanguageValue,
  spanishText,
  frenchText,
  initialTimeValue,
  afterTimeValue;

exports.ProfilePage = class ProfilePage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.menuModal = this.page.locator(
      "//div[contains(@class,'ease-out transition-all overflow-y-auto shadow-lg')]"
    );
    this.menuText = this.page.locator("//span[normalize-space()='Menu']");
    this.scheduleTab = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[5]/app-mobile-navigation-item//icon')
      : this.page.locator(
          "//span[contains(@class,' e2e_navigation_item_title')][normalize-space()='Schedule']"
        );
    this.customersIcon = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[1]/app-mobile-navigation-item//icon')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[3]//span[contains(text(),Customers)]'
        );
    this.chatIcon = this.isMobile
      ? this.page.locator('(//app-mobile-navigation-item)[4]')
      : this.page.locator('//span[normalize-space(text())="Chat"]/parent::div');

    this.AgendasIcon = this.isMobile
      ? this.page.locator('(//app-mobile-navigation-item)[5]')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[5]//span[contains(text(),Agendas)]'
        );
    this.myProfileBtn = this.page.locator(
      "//app-side-menu//span[normalize-space(text())='My Profile']"
    );
    this.generalTab = this.isMobile
      ? this.page.locator(
          "(//aside//li[contains(@class, 'text-purple-500') and contains(@class, 'bg-gray-300')]//span[text()='General'])[1]"
        )
      : this.page.locator(
          "(//aside//li[contains(@class, 'text-purple-500') and contains(@class, 'bg-gray-300')]//span[text()='General'])[2]"
        );
    this.notificationLocations = this.page.locator(
      "(//aside//span[text()='Notification Locations'])[2]"
    );
    this.profileModule = this.page.locator("//div[normalize-space()='Profile']");
    this.locationProfileOption = this.page.locator('//span[normalize-space()="Location Profile"]');
    this.locationHeading = this.page.locator('//h1[contains(text(),"Location")]');
    this.logsOption = this.page.locator('//span[normalize-space()="Logs"]');
    this.logsHeading = this.page.locator('//span[contains(@class,"e2e_logs_title")]');
    this.dashboardOption = this.page.locator('//span[normalize-space()="Dashboard"]');
    this.dashboardPageText = this.page.locator(
      '(//div[normalize-space()="Additions Captured"])[1]'
    );
    this.preferencesModule = this.page.locator("//app-profile-header//div[text()='Preferences']");
    this.moreOptionsModule = this.page.locator(
      "//app-profile-header//div[text()='Menu Options / Default Screen']"
    );
    this.lastSyncText = this.isMobile
      ? this.page.locator(
          "//app-profile-content//div[contains(@class, 'flex justify-between')]//div[normalize-space(text())='Last Synced']"
        )
      : this.page.locator(
          "//app-profile-content//div[contains(@class, 'xl:flex')]//div[normalize-space(text())='Last Synced']"
        );
    this.notificationsAllowedText = this.isMobile
      ? this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Notifications Allowed'])[2]"
        )
      : this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Notifications Allowed'])[1]"
        );
    this.displayName = this.isMobile
      ? this.page.locator("(//app-profile-content//div[normalize-space(text())='Display Name'])[2]")
      : this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Display Name'])[1]"
        );
    this.emailText = this.isMobile
      ? this.page.locator("(//app-profile-content//div[normalize-space(text())='Email'])[2]")
      : this.page.locator("(//app-profile-content//div[normalize-space(text())='Email'])[1]");
    this.userNameText = this.isMobile
      ? this.page.locator("(//app-profile-content//div[normalize-space(text())='Username'])[2]")
      : this.page.locator("(//app-profile-content//div[normalize-space(text())='Username'])[1]");
    this.defaultLocationText = this.isMobile
      ? this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Default Location'])[2]"
        )
      : this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Default Location'])[1]"
        );
    this.selectedLocationText = this.isMobile
      ? this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Selected Location'])[2]"
        )
      : this.page.locator(
          "(//app-profile-content//div[normalize-space(text())='Selected Location'])[1]"
        );
    this.languageElement = this.isMobile
      ? this.page.locator("(//div[normalize-space(text())='Language'])[2]")
      : this.page.locator("(//div[normalize-space(text())='Language'])[1]");
    this.equipmentDisplayChoiceElement = this.isMobile
      ? this.page.locator("(//div[normalize-space(text())='Equipment Display Choice'])[2]")
      : this.page.locator("(//div[normalize-space(text())='Equipment Display Choice'])[1]");
    this.defaultScheduleViewElement = this.isMobile
      ? this.page.locator("(//div[normalize-space(text())='Default Schedule View'])[2]")
      : this.page.locator("(//div[normalize-space(text())='Default Schedule View'])[1]");
    this.themeElement = this.isMobile
      ? this.page.locator("(//div[normalize-space(text())='Theme'])[2]")
      : this.page.locator("(//div[normalize-space(text())='Theme'])[1]");
    this.timeDisplayElement = this.isMobile
      ? this.page.locator("(//div[normalize-space(text())='Time Display'])[2]")
      : this.page.locator("(//div[normalize-space(text())='Time Display'])[1]");
    this.lastSyncValue = this.isMobile
      ? this.page.locator(
          "//app-profile-content//div[contains(@class, 'e2e_user_profile_sync_value')]"
        )
      : this.page.locator(
          "//app-profile-content//span[contains(@class, 'e2e_user_profile_sync_value')]"
        );
    this.resyncLink = this.isMobile
      ? this.page.locator(
          "(//app-profile-content//div[contains(@class,'e2e_user_profile_sync_action') and normalize-space(text())='Resync'])[2]"
        )
      : this.page.locator(
          "(//app-profile-content//div[contains(@class,'e2e_user_profile_sync_action') and normalize-space(text())='Resync'])[1]"
        );
    this.notificationMessage = this.page.locator('//mat-snack-bar-container');
    this.getLocationFromHeader = this.page.locator(
      "(//icon[@name='map_point_line'])[1]//parent::div"
    );
    this.getLocationFromGeneralTab = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_selected_location_value')]")
      : this.page.locator("//span[@class='e2e_user_profile_selected_location_value']");
    this.selectedLocationChangeButton = this.isMobile
      ? this.page.locator(
          "//div[contains(@class,'e2e_user_profile_selected_location_value')]//following-sibling::div"
        )
      : this.page.locator(
          "//span[@class='e2e_user_profile_selected_location_value']/..//following-sibling::div"
        );
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
    this.flowsheetBtn = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]'
        );
    this.equipmentText = this.page.locator(
      "(//span[@class='e2e_flowsheet_equipment_package font-semibold'])[1]/following::span[@class='e2e_flowsheet_equipment_package'][1]"
    );
    this.backBtnInMobile = this.page.locator(
      "//icon[contains(@class,'e2e_flowsheet_detail_back')]"
    );
    this.defaultScheduleViewValue = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_schedule_value')]")
      : this.page.locator("//div[contains(@class,'e2e_user_profile_schedule_value')]");
    this.defaultScheduleViewChangeBtn = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_schedule_action')])[2]")
      : this.page.locator("(//div[contains(@class,'e2e_user_profile_schedule_action')])[1]");
    this.highlightedScheduleText = this.isMobile
      ? this.page.locator("//div[contains(@class,'text-encore-secondary-purple')]")
      : this.page.locator(
          "//mat-button-toggle[contains(@class,'mat-button-toggle-checked')]//button//span"
        );
    this.dismissBtn = this.page.locator("//span[contains(text(),'Dismiss')]");
    this.getSelectedLanguageValue = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_language_value')]")
      : this.page.locator("//span[@class='e2e_user_profile_language_value']");
    this.languageUpdateButton = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_language_action')])[2]")
      : this.page.locator("(//div[contains(@class,'e2e_user_profile_language_action')])[1]");
    this.appLanguagerRequestModal = this.page.locator('//app-language-request');
    this.requestModalCloseBtn = this.page.locator(
      "//a[contains(@class,'e2e_location_request_close')]"
    );
    this.selectLanguage = index =>
      this.page.locator(
        `//strong[contains(@class,'e2e_add_on_request_title')]/../following-sibling::ul/li[` +
          index +
          `]/span[2]`
      );
    this.getTextOfSyncLabel = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_sync_label')])[2]")
      : this.page.locator("(//div[contains(@class,'e2e_user_profile_sync_label')])[1]");
    this.firstnavigationItemTitleInUI = this.page.locator(
      "(//span[contains(@class,'e2e_navigation_item_title')])[1]"
    );
    this.navigationElementsLocator = "//span[contains(@class,'e2e_navigation_item_title')]";
    this.initialFavouriteMenuSlot = this.isMobile
      ? this.page.locator("//div[text()='Menu Slot 3']//following-sibling::div")
      : this.page.locator("(//div[contains(@class,'e2e_profile_content_favorite')])[3]");
    this.getValueOfMenuSlot3 = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_menu_3_value')]")
      : this.page.locator("//span[contains(@class,'e2e_user_profile_menu_3_value')]");
    this.selectFirstMenuSlotAsFavourite = this.isMobile
      ? this.page.locator("//div[text()='Menu Slot 1']//following-sibling::div")
      : this.page.locator("(//div[contains(@class,'e2e_profile_content_favorite')])[1]");
    this.getValueOfMenuSlot5 = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_menu_5_value')]")
      : this.page.locator("//span[contains(@class,'e2e_user_profile_menu_5_value')]");
    this.getFlowsheetTextFromPage = this.page.locator(
      "//div[contains(@class,'e2e_page_header_flowsheets')]/span"
    );
    this.getScheduleTextFromPage = this.page.locator(
      "//div[contains(@class,'e2e_page_header_schedule')]"
    );
    this.timeValueFromProfile = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_theme_value')])[2]")
      : this.page.locator("(//span[@class='e2e_user_profile_theme_value'])[2]");
    this.flowsheetSetTime = this.page.locator(
      "(//span[contains(@class,'e2e_flowsheet_action_timeline_event_time')])[1]"
    );
    this.flowsheetLog = this.page.locator("//div[normalize-space()='Log']");
    this.logCommentInput = this.page.locator("//input[@name='add-note-field']");
    this.logSentButton = this.page.locator("//icon[@name='location_line']");
    this.logTime = this.page.locator("(//div[contains(@class,'e2e_message_card_time')])[1]");
    this.commandCenterIcon = this.page.locator("//icon[@name='tv_line']");
    this.commandCenterTime = location =>
      this.page.locator(
        `//div[normalize-space()='` + location + `']/following-sibling::div[1]//span`
      );
    this.updateBtnForTime = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_theme_action')])[4]")
      : this.page.locator("(//div[contains(@class,'e2e_user_profile_theme_action')])[3]");
    this.selectedTheme = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_theme_value')])[1]")
      : this.page.locator("(//span[contains(@class,'e2e_user_profile_theme_value')])[1]");
    this.themeUpdateBtn = this.isMobile
      ? page.locator("(//div[contains(@class,'e2e_user_profile_theme_action')])[2]")
      : this.page.locator("(//div[contains(@class, 'e2e_user_profile_theme_action')])[1]");
    this.bodyTag = this.page.locator("//body[contains(@class,'dark')]");
    this.bodyLightTag = this.page.locator('//body');
    this.flowsheetIcon = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
      : this.page.locator("//app-navigation-item//span[normalize-space()='Flowsheet']");
    this.flowsheetTitle = this.page.locator("//span[contains(@class,'e2e_flowsheet_title')]");
    this.scheduleTitle = this.page.locator("//main//div[normalize-space()='Schedule']");
    this.customersTab = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[1]/app-mobile-navigation-item')
      : this.page.locator("//span[normalize-space()='Customers']");
    this.customersTitle = this.page.locator(
      "//app-page-frame//span[normalize-space()='Customers']"
    );
    this.chatTab = this.isMobile
      ? this.page.locator('(//app-mobile-navigation-item)[4]')
      : this.page.locator("//app-navigation-item//span[normalize-space()='Chat']");
    this.chatTitle = this.page.locator("//span[contains(@class,'e2e_chat_title')]");
    this.agendasTab = this.isMobile
      ? this.page.locator("(//span[normalize-space()='Agendas'])[1]")
      : this.page.locator("//app-navigation-item//span[normalize-space()='Agendas']");
    this.eventAgendaTitle = this.page.locator('agenda-list>div>div').nth(4);
    this.menuBg = '.dark\\:bg-sky-900';
    this.menuText = this.page.locator("//span[text()='Menu']");
  }
  async navigateToProfileMenu() {
    await executeStep(this.menuIcon, 'click', 'Click on Profile Menu Icon');
  }
  async navigateToMyProfile() {
    await executeStep(this.myProfileBtn, 'click', 'Click on My Profile');
  }
  getMenuSlotElement(slotNumber) {
    return this.isMobile
      ? this.page.locator(`(//div[normalize-space(text())='Menu Slot ${slotNumber}'])[2]`)
      : this.page.locator(`(//div[normalize-space(text())='Menu Slot ${slotNumber}'])[1]`);
  }
  async validatingLastSyncValue() {
    const lastSyncedText = await this.lastSyncValue.innerText();
    indexPage.lighthouse_data.lastSyncedTime = lastSyncedText;
    await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
    const isValid = await validateLastSyncedText(lastSyncedText);
    await assertEqualValues(
      isValid,
      true,
      `Verify that the 'Last synced' value represents a past time: "${lastSyncedText}"`
    );
  }
  async resyncTheTime() {
    await executeStep(this.resyncLink, 'click', 'Click on Resync Link');
  }
  async resyncJustnowStatus() {
    const latestSync = await this.lastSyncValue.innerText();
    indexPage.lighthouse_data.resyncJustNowStatus = latestSync;
    await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
  }
  async validatingNotification() {
    const message = await this.notificationMessage.innerText();
    indexPage.lighthouse_data.resyncNotificationMessage = message;
    await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
  }
  async verifyingMenuNavigation(
    expectedProfileText,
    expectedLocationText,
    expectedLogsText,
    expectedDashboardText
  ) {
    await assertElementVisible(this.menuIcon, 'Verify that Menu Icon is displayed.');
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await assertElementVisible(this.menuModal, 'Verify that Menu Modal is displayed.');
    await executeStep(this.menuText, 'click', 'Click on menuText');
    await executeStep(this.scheduleTab, 'click', 'Click on scheduleTab');
    if (await this.dismissBtn.isVisible()) {
      await executeStep(this.dismissBtn, 'click', 'Click on dismiss popup');
    }
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await assertElementVisible(
      this.menuModal,
      'Verify that Menu Modal is displayed in Schedule page.'
    );
    await executeStep(this.menuText, 'click', 'Click on menuText');
    await executeStep(this.customersIcon, 'click', 'Click on customersIcon');
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await assertElementVisible(
      this.menuModal,
      'Verify that Menu Modal is displayed in Customers page.'
    );
    await executeStep(this.menuText, 'click', 'Click on menuText');
    await executeStep(this.chatIcon, 'click', 'Click on chatIcon');
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await assertElementVisible(this.menuModal, 'Verify that Menu Modal is displayed in Chat page.');
    await executeStep(this.menuText, 'click', 'Click on menuText');
    await executeStep(this.AgendasIcon, 'click', 'Click on AgendasIcon');
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await assertElementVisible(
      this.menuModal,
      'Verify that Menu Modal is displayed in Agendas page.'
    );
    await executeStep(this.myProfileBtn, 'click', 'Click on myProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let profileText = await this.profileModule.textContent();
    await assertContainsValue(
      profileText,
      expectedProfileText,
      `Verify that Profile page text "${indexPage.lighthouse_data.expectedProfileText}" is displayed after clicking on my profile option.`
    );
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await executeStep(this.locationProfileOption, 'click', 'Click on locationProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let locationText = await this.locationHeading.textContent();
    await assertContainsValue(
      locationText,
      expectedLocationText,
      `Verify that Profile page text "${indexPage.lighthouse_data.expectedLocationText}" is displayed after clicking on my profile option.`
    );
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await executeStep(this.logsOption, 'click', 'Click on logsOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let logsText = await this.logsHeading.textContent();
    await assertContainsValue(
      logsText,
      expectedLogsText,
      `Verify that Profile page text "${indexPage.lighthouse_data.expectedLogsText}" is displayed after clicking on my profile option.`
    );
    await executeStep(this.menuIcon, 'click', 'Click on menuIcon');
    await executeStep(this.dashboardOption, 'click', 'Click on dashboardOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let dashboardText = await this.dashboardPageText.textContent();
    await assertContainsValue(
      dashboardText,
      expectedDashboardText,
      `Verify that Profile page text "${indexPage.lighthouse_data.expectedDashboardText}" is displayed after clicking on my profile option.`
    );
  }

  async assertEquipmentByIntialDisplayValue() {
    initialEquipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    try {
      await assertEqualValues(
        initialEquipmentDispalyValue.trim(),
        indexPage.lighthouse_data.equipmentName,
        `Verify that a valid option is displayed as the default "Equipment Display Choice" , Selected Option : "${indexPage.lighthouse_data.equipmentName}"`
      );
    } catch {
      await assertEqualValues(
        initialEquipmentDispalyValue.trim(),
        indexPage.lighthouse_data.equipmentDescription,
        `Verify that a valid option is displayed as the default "Equipment Display Choice" , Selected Option : "${indexPage.lighthouse_data.equipmentDescription}"`
      );
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    getequipmentTextByIntialDisplayValue = await this.equipmentText.textContent();
  }

  async assertEquipmentByChangedDisplayValue() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on back button in mobile');
    }
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    const equipmentDisplayValue = await this.equipmentDisplayChioceValue.textContent();
    if (equipmentDisplayValue === initialEquipmentDispalyValue) {
      await executeStep(
        this.equipmentValueChangeButton,
        'click',
        'Change the equipment display value'
      );
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const equipmentValueAfterChange = await this.equipmentDisplayChioceValue.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertNotEqualValues(
      equipmentDisplayValue,
      equipmentValueAfterChange,
      `Verify that 'Equipment Display Choice' option has been changed successfully. InitialValue: ${equipmentDisplayValue}, ChangedValue: ${equipmentValueAfterChange}`
    );
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    getequipmentTextByChangedDisplayValue = await this.equipmentText.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertNotEqualValues(
      getequipmentTextByIntialDisplayValue,
      getequipmentTextByChangedDisplayValue,
      'Verify that all equipment for the Flowsheets is displayed according to the selected option.'
    );
  }

  async changeEquipmentDisplayChoiceToInitialValue() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'Click on back button in mobile');
    }
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    const equipmentDisplayValue = await this.equipmentDisplayChioceValue.textContent();
    if (equipmentDisplayValue !== initialEquipmentDispalyValue) {
      await executeStep(
        this.equipmentValueChangeButton,
        'click',
        'Change the equipment display value'
      );
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const equipmentValueAfterChange = await this.equipmentDisplayChioceValue.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertEqualValues(
      equipmentValueAfterChange,
      initialEquipmentDispalyValue,
      'Verifying that the equipment display value matches the initial value.'
    );
  }

  async assertInitialDefaultSheduleView() {
    initialScheduleViewValue = await this.defaultScheduleViewValue.textContent();
    try {
      await assertEqualValues(
        initialScheduleViewValue.trim(),
        indexPage.lighthouse_data.mySchedule,
        `Verify that a valid option is displayed as the "Default Schedule View", Selected Option : "${indexPage.lighthouse_data.mySchedule}"`
      );
    } catch (error) {
      await assertEqualValues(
        initialScheduleViewValue.trim(),
        indexPage.lighthouse_data.teamSchedule,
        `Verify that a valid option is displayed as the "Default Schedule View" Selected Option : "${indexPage.lighthouse_data.teamSchedule}"`
      );
    }
    if (await this.dismissBtn.isVisible()) {
      await executeStep(this.dismissBtn, 'click', 'Click on dismiss popup');
    }
    await executeStep(this.scheduleTab, 'click', "Click on 'Schedule icon'");
    if (await this.dismissBtn.isVisible()) {
      await executeStep(this.dismissBtn, 'click', 'Click on dismiss popup');
    }
    const getHighlighedTextFormSchedule = await this.highlightedScheduleText.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertEqualValues(
      getHighlighedTextFormSchedule,
      initialScheduleViewValue,
      'Verify that the correct Schedule tab is opened based on the Default Schedule View option.'
    );
  }

  async assertDefaultScheduleViewAfterChange() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValue = await this.defaultScheduleViewValue.textContent();
    if (scheduleViewValue === initialScheduleViewValue) {
      await executeStep(this.defaultScheduleViewChangeBtn, 'click', 'Click on Update link');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValueAfterChange = await this.defaultScheduleViewValue.textContent();
    await assertNotEqualValues(
      scheduleViewValueAfterChange,
      scheduleViewValue,
      `Verify that the 'Default Schedule View' option is changed successfully from "${scheduleViewValue}" to "${scheduleViewValueAfterChange}"`
    );
    if (await this.dismissBtn.isVisible()) {
      await executeStep(this.dismissBtn, 'click', 'Click on dismiss popup');
    }
    await executeStep(this.scheduleTab, 'click', "Click on 'Schedule icon'");
    const getHighlighedTextFormSchedule = await this.highlightedScheduleText.textContent();
    await assertEqualValues(
      getHighlighedTextFormSchedule,
      scheduleViewValueAfterChange,
      'Verify that the correct Schedule tab is opened based on the Default Schedule View option.'
    );
  }

  async changeScheduleViewValueToIntialValue() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValue = await this.defaultScheduleViewValue.textContent();
    if (scheduleViewValue !== initialScheduleViewValue) {
      await executeStep(this.defaultScheduleViewChangeBtn, 'click', 'Click on Update link');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValueAfterChange = await this.defaultScheduleViewValue.textContent();
    await assertEqualValues(
      scheduleViewValueAfterChange,
      initialScheduleViewValue,
      `Verify that the 'Default Schedule View' option is changed successfully from "${scheduleViewValue}" to "${scheduleViewValueAfterChange}"`
    );
  }

  async assertInitialLanguageValue() {
    initialLanguageValue = await this.getSelectedLanguageValue.textContent();
    if (!this.isMobile) {
      const navigationText = await this.firstnavigationItemTitleInUI.textContent();
      await assertEqualValues(
        navigationText.trim(),
        indexPage.lighthouse_data.flowsheetInEnglish,
        'Make sure that all page elements are localized according to the selected option: "English" '
      );
    }
    const profileTitleText = await this.getTextOfSyncLabel.textContent();
    await assertEqualValues(
      profileTitleText.trim(),
      indexPage.lighthouse_data.lastSyncedInEnglish,
      'Make sure that all page elements are localized according to the selected option:"English" '
    );
  }

  async assertUpdateLanguageToSpanish() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if (getLanguageText === initialLanguageValue) {
      await executeStep(this.languageUpdateButton, 'click', 'Click on Update link');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.appLanguagerRequestModal,
        'Verify that the "Language selection modal" is displayed'
      );
      await executeStep(this.requestModalCloseBtn, 'click', 'Click on Close link');
      await assertElementNotVisible(
        this.appLanguagerRequestModal,
        "Verify that the 'Close' link works properly"
      );
      await executeStep(this.languageUpdateButton, 'click', 'Again Click on Update link');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.appLanguagerRequestModal,
        'Verify that the "Language selection modal" is displayed'
      );
      await executeStep(this.selectLanguage(2), 'click', 'Select spanish language');
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    spanishText = await this.getSelectedLanguageValue.textContent();
    await assertEqualValues(
      spanishText.trim(),
      utilConst.Const.Languages[1],
      `Verify that the selected language is updated successfully to Spanish. Expected: "${utilConst.Const.Languages[1]}", Actual: "${spanishText}"`
    );
    await test.step('Make sure that all page elements are localized according to the selected option: "Spanish" ', async () => {
      if (!this.isMobile) {
        await verifyNavigationElements(
          this.page,
          this.navigationElementsLocator,
          indexPage.lighthouse_data.navigationElementsInSpanish,
          utilConst.Const.Languages[1]
        );
      }
    });
    const profileTitleText = await this.getTextOfSyncLabel.textContent();
    await assertEqualValues(
      profileTitleText.trim(),
      indexPage.lighthouse_data.lastSyncedInSpanish,
      'Make sure that all My Profile page elements are localized according to the selected option: "Spanish" '
    );
  }

  async assertUpdateLanguageToFrench() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if (getLanguageText === spanishText) {
      await executeStep(this.languageUpdateButton, 'click', 'Click on Update link');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.appLanguagerRequestModal,
        'Verify that the "Language selection modal" is displayed'
      );
      await executeStep(this.selectLanguage(3), 'click', 'Select spanish language');
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    frenchText = await this.getSelectedLanguageValue.textContent();
    await assertEqualValues(
      frenchText.trim(),
      utilConst.Const.Languages[2],
      `Verify that the selected language is updated successfully to French. Expected: "${utilConst.Const.Languages[2]}", Actual: "${frenchText}"`
    );
    await test.step('Make sure that all page elements are localized according to the selected option: "French" ', async () => {
      if (!this.isMobile) {
        await verifyNavigationElements(
          this.page,
          this.navigationElementsLocator,
          indexPage.lighthouse_data.navigationElementsInFrench,
          utilConst.Const.Languages[2]
        );
      }
    });
    const profileTitleText = await this.getTextOfSyncLabel.textContent();
    await assertEqualValues(
      profileTitleText.trim(),
      indexPage.lighthouse_data.lastSyncedInFrench,
      'Make sure that all My Profile page elements are localized according to the selected option: "French" '
    );
  }

  async changeLanguageToIntialValue() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if (getLanguageText !== initialLanguageValue) {
      await executeStep(this.languageUpdateButton, 'click', 'Click on Update link');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.appLanguagerRequestModal,
        'Verify that the "Language selection modal" is displayed'
      );
      await executeStep(this.selectLanguage(1), 'click', 'Select spanish language');
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    const englishText = await this.getSelectedLanguageValue.textContent();
    await assertEqualValues(
      englishText.trim(),
      initialLanguageValue.trim(),
      `Verify that the selected language is updated successfully to English. Expected: "${initialLanguageValue}", Actual: "${englishText}"`
    );
    await test.step('Make sure that all page elements are localized according to the selected option: "English" ', async () => {
      if (!this.isMobile) {
        await verifyNavigationElements(
          this.page,
          this.navigationElementsLocator,
          indexPage.lighthouse_data.navigationElementsInEnglish,
          utilConst.Const.Languages[0]
        );
      }
    });
    const profileTitleText = await this.getTextOfSyncLabel.textContent();
    await assertEqualValues(
      profileTitleText.trim(),
      indexPage.lighthouse_data.lastSyncedInEnglish,
      'Make sure that all all My Profile page elements are localized according to the selected option: "English" '
    );
  }

  async assertInitialFavouriteMenuSlot() {
    const getMenuSlotValue = await this.getValueOfMenuSlot3.textContent();
    await this.page.goto(process.env.lighthouseUrl);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const textFromPage = await this.getFlowsheetTextFromPage.textContent();
    await assertEqualValues(
      textFromPage,
      getMenuSlotValue,
      'Verify that the appropriate page is opened based on the Favourite option From Menu Slot 3'
    );
  }

  async changeMenuSlot1ToFavouriteSlot() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await executeStep(
      this.selectFirstMenuSlotAsFavourite,
      'click',
      'Select the first menu slot as favourite'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const getMenuSlotValue = await this.getValueOfMenuSlot5.textContent();
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    await this.page.goto(process.env.lighthouseUrl);
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const textFromPage = await this.getScheduleTextFromPage.textContent();
    await assertEqualValues(
      textFromPage,
      getMenuSlotValue,
      'Verify that the appropriate page is opened based on the Favourite option From Menu Slot 1'
    );
  }

  async restoreToSelectedMenuSlot() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await executeStep(
      this.initialFavouriteMenuSlot,
      'click',
      'Select the third menu slot as favourite'
    );
  }

  async assertTimeDisplayValue() {
    await assertElementVisible(
      this.timeDisplayElement,
      'Verify that the time display element is visible'
    );
    initialTimeValue = await this.timeValueFromProfile.textContent();
    try {
      assertEqualValues(
        initialTimeValue.trim(),
        indexPage.lighthouse_data['12Hours'],
        'Verify that the initial time value matches either the 12-hour or 24-hour format'
      );
    } catch {
      assertEqualValues(
        initialTimeValue.trim(),
        indexPage.lighthouse_data['24Hours'],
        'Verify that the initial time value matches either the 12-hour or 24-hour format'
      );
    }
  }

  async assertTimeForFlowsheetSet(timeFormat) {
    await executeStep(this.flowsheetBtn, 'click', 'click on flowsheet button');
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.searchFunction(indexPage.navigator_data.second_job_no);
    const getFlowsheetSetTime = await this.flowsheetSetTime.textContent();
    const timeFormatForSetTime = await checkTimeFormat(getFlowsheetSetTime.trim());
    await assertEqualValues(
      timeFormatForSetTime,
      timeFormat.trim(),
      `Verify Flowsheets Set/Strike times time format: Expected TimeFormat is "${timeFormat.trim()}"`
    );
  }

  async assertTimeForFlowsheetLogs(timeFormat) {
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.clickOnJob(indexPage.navigator_data.second_job_no);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.flowsheetLog, 'click', 'Click on  log in flowsheet tab');
    await executeStep(this.logCommentInput, 'fill', 'Enter any comment', [
      indexPage.lighthouse_data.logCommentMsg
    ]);
    await executeStep(this.logSentButton, 'click', 'Click on sent button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const getTimeStampForLog = await this.logTime.textContent();
    const getTimeFromLog = await extractTime(getTimeStampForLog);
    const getTimeFormat = await checkTimeFormat(getTimeFromLog);
    await assertEqualValues(
      getTimeFormat,
      timeFormat.trim(),
      `Verify that the Flowsheets logs time format: Expected TimeFormat is "${timeFormat.trim()}"`
    );
  }

  async assertTimeForCommandCenter(timeFormat) {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'click on back button');
    }
    await executeStep(this.commandCenterIcon, 'click', 'click on command center icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const getCommandCeterTime = await this.commandCenterTime(
      indexPage.lighthouse_data.locationText_createData1
    ).textContent();
    const getTimeFormat = await checkTimeFormat(getCommandCeterTime.trim());
    await assertEqualValues(
      getTimeFormat.trim(),
      timeFormat.trim(),
      `Verify Flowsheets Command Center time format: Expected TimeFormat is "${timeFormat.trim()}"`
    );
    await executeStep(
      this.commandCenterTime(indexPage.lighthouse_data.locationText_createData1),
      'click',
      'click on command center page'
    );
  }

  async assertDisplayTimeFormatForElements(timeFormat) {
    await test.step('Verify that all times follow the selected time format across app sections', async () => {
      await this.assertTimeForFlowsheetSet(timeFormat);
      await this.assertTimeForFlowsheetLogs(timeFormat);
      await this.assertTimeForCommandCenter(timeFormat);
    });
  }

  async assertInitialTimeFormatForElements() {
    await this.assertDisplayTimeFormatForElements(initialTimeValue);
  }

  async changeDisplayTimeValue() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    const getTimeValue = await this.timeValueFromProfile.textContent();
    if (getTimeValue.trim() === initialTimeValue.trim()) {
      await executeStep(this.updateBtnForTime, 'click', 'Click on Update link');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    afterTimeValue = await this.timeValueFromProfile.textContent();
    await assertNotEqualValues(
      afterTimeValue,
      getTimeValue,
      `Verify that the 'Time Display' option is changed successfully from ${getTimeValue} to ${afterTimeValue}`
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const getTimeAfterReload = await this.timeValueFromProfile.textContent();
    await assertEqualValues(
      getTimeAfterReload,
      afterTimeValue,
      `Verify that the 'Time Display' remains unchanged after reload. Expected : "${afterTimeValue}"  Actual : "${getTimeAfterReload}"`
    );
  }

  async assertAfterTimeFormatForElements() {
    await this.assertDisplayTimeFormatForElements(afterTimeValue);
  }
  async myProfileTab() {
    await this.navigateToProfileMenu();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.myProfileBtn, 'Verify My Profile is visible');
    await this.navigateToMyProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async isDarkTheme() {
    const hasDarkClass = await this.bodyTag.evaluate(el => el.classList.contains('dark'));
    return hasDarkClass;
  }
  async isLightTheme() {
    const hasDarkClass = await this.bodyLightTag.evaluate(el => el.classList.contains('dark'));
    return !hasDarkClass;
  }

  async selectDarkTheme() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const selectedTheme = await this.selectedTheme.textContent();
    if (selectedTheme.trim() === 'Light') {
      await executeStep(this.themeUpdateBtn, 'click', 'Click on Update button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    const selectedDarkTheme = await this.selectedTheme.textContent();
    const expectedTheme = 'Dark';
    await test.step('Verify default selected theme is Dark', async () => {
      await assertValueToBe(
        selectedDarkTheme.trim(),
        'Assert selected theme is Dark',
        expectedTheme
      );
    });
    await test.step('Verify that the Page should be displayed in Dark Theme', async () => {
      const isDark = await this.isDarkTheme();
      await assertElementTrue(isDark);
    });
  }
  async isDarkDivVisible() {
    const shadowHost = this.page.locator('agenda-sessions');

    const shadowRootHandle = await shadowHost.evaluateHandle(host => host.shadowRoot);
    const darkDivHandle = await shadowRootHandle.$('div.dark');
    let isVisible = false;

    if (darkDivHandle) {
      isVisible = await darkDivHandle.isVisible();
    }
    await shadowRootHandle.dispose();
    return isVisible;
  }
  async allPageElements() {
    await executeStep(this.flowsheetIcon, 'click', 'Click on Flowsheet Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const flowsheetColor = utilConst.Const.flowsheetDarkColor;
    await assertElementColor(this.flowsheetTitle, flowsheetColor);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));

    const scheduleColor = utilConst.Const.scheduleDarkColor;
    await executeStep(this.scheduleTab, 'click', 'Click on Schedule Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementColor(this.scheduleTitle, scheduleColor);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));

    const customersColor = utilConst.Const.customersColor;
    await executeStep(this.customersTab, 'click', 'Click on Customers Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementColor(this.customersTitle, customersColor);

    await executeStep(this.chatTab, 'click', 'Click on Chats Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementColor(this.chatTitle, customersColor);
    if (!this.isMobile) {
      await executeStep(this.agendasTab, 'click', 'Click on Agendas Tab');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementColor(this.eventAgendaTitle, customersColor);
    }
    await executeStep(this.menuIcon, 'click', 'Click on Menu Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));

    await verifyBackgroundColor(this.page, this.menuBg, utilConst.Const.menuBgDarkColor);
    await executeStep(this.menuText, 'click', 'Click on Screen to close Profile menu');
  }

  async selectLightTheme() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const selectedTheme = await this.selectedTheme.textContent();
    if (selectedTheme.trim() === 'Dark') {
      await executeStep(this.themeUpdateBtn, 'click', 'Click on Update button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    const selectedDarkTheme = await this.selectedTheme.textContent();
    const expectedTheme = 'Light';
    await test.step('Verify selected Theme option is Light', async () => {
      await assertValueToBe(
        selectedDarkTheme.trim(),
        'Assert that selected theme is Light',
        expectedTheme
      );
    });
    await test.step('Verify that the Page should be displayed in Light Theme', async () => {
      const isLight = await this.isLightTheme();
      await assertElementTrue(isLight);
    });
  }
  async updateToLightTheme() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.myProfileTab();
    await this.selectLightTheme();
  }
  async refreshThePage() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));

    const selectedDarkTheme = await this.selectedTheme.textContent();
    const expectedTheme = 'Light';
    await test.step('Assert that the selected theme option is Light after refreshing the page.', async () => {
      await assertValueToBe(
        selectedDarkTheme.trim(),
        'Assert that selected theme is Light',
        expectedTheme
      );
    });
  }
  async allElementsInLight() {
    await executeStep(this.flowsheetIcon, 'click', 'Click on Flowsheet Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const blackColor = utilConst.Const.blackColor;
    await test.step('Assert that Flowsheet Tab displayed in Light Theme', async () => {
      await assertElementColor(this.flowsheetTitle, blackColor);
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    });
    const scheduleColor = utilConst.Const.scheduleColor;
    await executeStep(this.scheduleTab, 'click', 'Click on Schedule Tab');
    await test.step('Assert that Schedule Tab displayed in Light Theme', async () => {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementColor(this.scheduleTitle, scheduleColor);
    });
    await executeStep(this.customersTab, 'click', 'Click on Customers Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Assert that Customers Tab displayed in Light Theme', async () => {
      await assertElementColor(this.customersTitle, blackColor);
    });

    await executeStep(this.chatTab, 'click', 'Click on Chats Tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Assert that Chat Tab is displayed in Light Theme', async () => {
      await assertElementColor(this.chatTitle, blackColor);
    });

    if (!this.isMobile) {
      await executeStep(this.agendasTab, 'click', 'Click on Agendas Tab');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await executeStep(this.menuIcon, 'click', 'Click on Menu Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step('Verify that Menu is displayed in Light Theme', async () => {
      await verifyBackgroundColor(this.page, this.menuBg, utilConst.Const.menuBgLightColor);
    });

    await executeStep(this.menuText, 'click', 'Click on Screen to close Profile menu');
  }
  async changeToDefaultLightTheme() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const selectedTheme = await this.selectedTheme.textContent();
    if (selectedTheme.trim() === 'Dark') {
      await executeStep(this.themeUpdateBtn, 'click', 'Click on Update button');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
  }
  async changeToDefaultColor() {
    await this.myProfileTab();
    await this.changeToDefaultLightTheme();
  }
};
