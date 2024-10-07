const { executeStep } = require('../../utils/action');
const indexPage = require('../../utils/index.page');
const { test } = require('@playwright/test');
const utilConst = require('../../utils/const');
const fs = require('node:fs/promises');
const { test, expect } = require('@playwright/test');
const {
    assertElementVisible,
    assertContainsValue,
    validateLastSyncValue,
    assertNotEqualValues,
    assertEqualValues,
    assertElementNotVisible,
    verifyNavigationElements,
    validateLastSyncedText
  } = require('../../utils/helper');
let initialEquipmentDispalyValue,getequipmentTextByIntialDisplayValue,
    getequipmentTextByChangedDisplayValue,initialScheduleViewValue,initialLanguageValue,spanishText,frenchText;

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
    this.generalTab = this.page.locator(
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
    this.lastSyncText = this.page.locator(
      "//app-profile-content//div[contains(@class, 'xl:flex')]//div[normalize-space(text())='Last Synced']"
    );
    this.notificationsAllowedText = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Notifications Allowed'])[1]"
    );
    this.displayName = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Display Name'])[1]"
    );
    this.emailText = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Email'])[1]"
    );
    this.userNameText = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Username'])[1]"
    );
    this.defaultLocationText = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Default Location'])[1]"
    );
    this.selectedLocationText = this.page.locator(
      "(//app-profile-content//div[normalize-space(text())='Selected Location'])[1]"
    );
    this.languageElement = this.page.locator("(//div[normalize-space(text())='Language'])[1]");
    this.equipmentDisplayChoiceElement = this.page.locator(
      "(//div[normalize-space(text())='Equipment Display Choice'])[1]"
    );
    this.defaultScheduleViewElement = this.page.locator(
      "(//div[normalize-space(text())='Default Schedule View'])[1]"
    );
    this.themeElement = this.page.locator("(//div[normalize-space(text())='Theme'])[1]");
    this.timeDisplayElement = this.page.locator(
      "(//div[normalize-space(text())='Time Display'])[1]"
    );
    this.lastSyncValue = this.page.locator(
      "//app-profile-content//span[contains(@class, 'e2e_user_profile_sync_value')]"
    );
    this.resyncLink = this.page.locator(
      "(//app-profile-content//div[contains(@class,'e2e_user_profile_sync_action') and normalize-space(text())='Resync'])[1]"
    );
    this.notificationMessage = this.page.locator('//mat-snack-bar-container');
    this.getLocationFromHeader = this.page.locator("(//icon[@name='map_point_line'])[1]//parent::div");
    this.getLocationFromGeneralTab = this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_selected_location_value')]") 
              : this.page.locator("//span[@class='e2e_user_profile_selected_location_value']");
    this.selectedLocationChangeButton = this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_selected_location_value')]//following-sibling::div");
    this.equipmentDisplayChioceValue = this.isMobile ? this.page.locator("(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_value')]")
              : this.page.locator("//div[contains(text(),'Equipment Display Choice')]/following-sibling::div/span");
    this.equipmentValueChangeButton = this.isMobile ? this.page.locator("(//div[contains(text(),'Equipment Display Choice')])[2]/../following-sibling::div/div[contains(@class,'e2e_user_profile_equipment_action')]")
              : this.page.locator("//div[contains(text(),'Equipment Display Choice')]/following-sibling::div[contains(text(),'Update')]");
    this.flowsheetBtn = this.isMobile ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
              : this.page.locator('//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]');
    this.equipmentText = this.page.locator("(//span[@class='e2e_flowsheet_equipment_package font-semibold'])[1]/following::span[@class='e2e_flowsheet_equipment_package'][1]");
    this.backBtnInMobile = this.page.locator("//icon[contains(@class,'e2e_flowsheet_detail_back')]");
    this.defaultScheduleViewValue = this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_schedule_value')]")
              : this.page.locator("//div[contains(@class,'e2e_user_profile_schedule_value')]");
    this.defaultScheduleViewChangeBtn = this.isMobile ? this.page.locator("(//div[contains(@class,'e2e_user_profile_schedule_action')])[2]")
              : this.page.locator("(//div[contains(@class,'e2e_user_profile_schedule_action')])[1]");
    this.highlightedScheduleText = this.isMobile ? this.page.locator("//div[contains(@class,'text-encore-secondary-purple')]")
              : this.page.locator("//mat-button-toggle[contains(@class,'mat-button-toggle-checked')]//button//span");
    this.dismissBtn = this.page.locator("//span[contains(text(),'Dismiss')]");
    this.getSelectedLanguageValue = this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_language_value')]") 
              : this.page.locator("//span[@class='e2e_user_profile_language_value']");
    this.languageUpdateButton = this.isMobile ? this.page.locator("(//div[contains(@class,'e2e_user_profile_language_action')])[2]")
              : this.page.locator("(//div[contains(@class,'e2e_user_profile_language_action')])[1]");
    this.appLanguagerRequestModal = this.page.locator("//app-language-request");
    this.requestModalCloseBtn = this.page.locator("//a[contains(@class,'e2e_location_request_close')]");
    this.selectLanguage = (index) => this.page.locator(`//strong[contains(@class,'e2e_add_on_request_title')]/../following-sibling::ul/li[`+index+`]/span[2]`);
    this.getTextOfSyncLabel = this.isMobile ? this.page.locator("(//div[contains(@class,'e2e_user_profile_sync_label')])[2]")
              : this.page.locator("(//div[contains(@class,'e2e_user_profile_sync_label')])[1]")
    this.firstnavigationItemTitleInUI = this.page.locator("(//span[contains(@class,'e2e_navigation_item_title')])[1]");
    this.navigationElementsLocator = "//span[contains(@class,'e2e_navigation_item_title')]";
  }
  async navigateToProfileMenu() {
    await executeStep(this.menuIcon, 'click', 'Click on Profile Menu Icon');
  }
  async navigateToMyProfile() {
    await executeStep(this.myProfileBtn, 'click', 'Click on My Profile');
  }
  getMenuSlotElement(slotNumber) {
    return this.page.locator(`(//div[normalize-space(text())='Menu Slot ${slotNumber}'])[1]`);
  }
  async validatingLastSyncValue() {
    const lastSyncedText = await this.lastSyncValue.innerText();
    indexPage.lighthouse_data.lastSyncedTime = lastSyncedText;
    await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
    const isValid = await validateLastSyncedText(lastSyncedText);

    await test.step(`Verify that the 'Last synced' value represents a past time: "${lastSyncedText}"`, async () => {
      expect(isValid).toBe(
        true,
        `The 'Last synced' value "${lastSyncedText}" is not valid, as it should represent a past time frame.`
      );
    });
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
    await test.step('Verify that Menu Icon is displayed.', async () => {
      await assertElementVisible(this.menuIcon);
    });
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await test.step('Verify that Menu Modal is displayed.', async () => {
      await assertElementVisible(this.menuModal);
    });
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.scheduleTab, 'click', 'click on scheduleTab');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await test.step('Verify that Menu Modal is displayed in Schedule page.', async () => {
      await assertElementVisible(this.menuModal);
    });
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.customersIcon, 'click', 'click on customersIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await test.step('Verify that Menu Modal is displayed in Customers page.', async () => {
      await assertElementVisible(this.menuModal);
    });
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.chatIcon, 'click', 'click on chatIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await test.step('Verify that Menu Modal is displayed in Chat page.', async () => {
      await assertElementVisible(this.menuModal);
    });
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.AgendasIcon, 'click', 'click on AgendasIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await test.step('Verify that Menu Modal is displayed in Agendas page.', async () => {
      await assertElementVisible(this.menuModal);
    });
    await executeStep(this.myProfileBtn, 'click', 'click on myProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let profileText = await this.profileModule.textContent();
    await test.step(`Verify that Profile page text "${indexPage.lighthouse_data.expectedProfileText}" is displayed after clicking on my profile option.`, async () => {
      await assertContainsValue(profileText, expectedProfileText);
    });
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await executeStep(this.locationProfileOption, 'click', 'click on locationProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let locationText = await this.locationHeading.textContent();
    await test.step(`Verify that Profile page text "${indexPage.lighthouse_data.expectedLocationText}" is displayed after clicking on my profile option.`, async () => {
      await assertContainsValue(locationText, expectedLocationText);
    });
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await executeStep(this.logsOption, 'click', 'click on logsOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let logsText = await this.logsHeading.textContent();
    await test.step(`Verify that Profile page text "${indexPage.lighthouse_data.expectedLogsText}" is displayed after clicking on my profile option.`, async () => {
      await assertContainsValue(logsText, expectedLogsText);
    });
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await executeStep(this.dashboardOption, 'click', 'click on dashboardOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let dashboardText = await this.dashboardPageText.textContent();
    await test.step(`Verify that Profile page text "${indexPage.lighthouse_data.expectedDashboardText}" is displayed after clicking on my profile option.`, async () => {
      await assertContainsValue(dashboardText, expectedDashboardText);
    });
  }

  async assertEquipmentByIntialDisplayValue() {
    initialEquipmentDispalyValue = await this.equipmentDisplayChioceValue.textContent();
    await executeStep(this.flowsheetBtn, 'click', 'click on flowsheet button');
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    getequipmentTextByIntialDisplayValue = await this.equipmentText.textContent();
  }

  async assertEquipmentByChangedDisplayValue() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'click on back button in mobile');
    }
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    const equipmentDisplayValue = await this.equipmentDisplayChioceValue.textContent();
    if(equipmentDisplayValue === initialEquipmentDispalyValue) {
      await executeStep(this.equipmentValueChangeButton,"click","change the equipment display value");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const equipmentValueAfterChange = await this.equipmentDisplayChioceValue.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step(`Verify that 'Equipment Display Choice' option has been changed successfully. InitialValue: ${equipmentDisplayValue}, ChangedValue: ${equipmentValueAfterChange}`, async () => {
      await assertNotEqualValues(equipmentDisplayValue, equipmentValueAfterChange);
    });    
    await executeStep(this.flowsheetBtn, 'click', 'click on flowsheet button');
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.performSearchFunction(indexPage.navigator_data.second_job_no,indexPage.navigator_data.second_job_no);
    getequipmentTextByChangedDisplayValue = await this.equipmentText.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step("Verify that all equipment for the Flowsheets is displayed according to the selected option.", async () => {
      await assertNotEqualValues(getequipmentTextByIntialDisplayValue, getequipmentTextByChangedDisplayValue);
    });    
  }

  async changeEquipmentDisplayChoiceToInitialValue() {
    if (this.isMobile) {
      await executeStep(this.backBtnInMobile, 'click', 'click on back button in mobile');
    }
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    const equipmentDisplayValue = await this.equipmentDisplayChioceValue.textContent();
    if(equipmentDisplayValue !== initialEquipmentDispalyValue) {
      await executeStep(this.equipmentValueChangeButton,"click","change the equipment display value");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const equipmentValueAfterChange = await this.equipmentDisplayChioceValue.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step('Verifying that the equipment display value matches the initial value.', async () => {
      await assertEqualValues(equipmentValueAfterChange, initialEquipmentDispalyValue);
    }); 
  }

  async assertInitialDefaultSheduleView() {
    initialScheduleViewValue = await this.defaultScheduleViewValue.textContent();
    await executeStep(this.scheduleTab,"click","Click on 'Schedule icon'");
    const getHighlighedTextFormSchedule = await this.highlightedScheduleText.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step('Verify that the correct Schedule tab is opened based on the Default Schedule View option.', async () => {
      await assertEqualValues(getHighlighedTextFormSchedule, initialScheduleViewValue);
    });    
  }

  async assertDefaultScheduleViewAfterChange() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValue = await this.defaultScheduleViewValue.textContent();
    if(scheduleViewValue === initialScheduleViewValue) {
      await executeStep(this.defaultScheduleViewChangeBtn,"click","click on update button");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValueAfterChange = await this.defaultScheduleViewValue.textContent();
    await test.step(`Verify that the 'Default Schedule View' option is changed successfully from "${scheduleViewValue}" to "${scheduleViewValueAfterChange}"`, async () => {
      await assertNotEqualValues(scheduleViewValueAfterChange, scheduleViewValue);
    });   
    await executeStep(this.dismissBtn,"click","click on dismiss button"); 
    await executeStep(this.scheduleTab,"click","Click on 'Schedule icon'");
    const getHighlighedTextFormSchedule = await this.highlightedScheduleText.textContent();
    await test.step('Verify that the correct Schedule tab is opened based on the Default Schedule View option.', async () => {
      await assertEqualValues(getHighlighedTextFormSchedule, scheduleViewValueAfterChange);
    });
  }

  async changeScheduleViewValueToIntialValue() {
    await this.navigateToProfileMenu();
    await this.navigateToMyProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValue = await this.defaultScheduleViewValue.textContent();
    if(scheduleViewValue !== initialScheduleViewValue) {
      await executeStep(this.defaultScheduleViewChangeBtn,"click","click on update button");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const scheduleViewValueAfterChange = await this.defaultScheduleViewValue.textContent();
    await test.step(`Verify that the 'Default Schedule View' option is changed successfully from "${scheduleViewValue}" to "${scheduleViewValueAfterChange}"`, async () => {
      await assertEqualValues(scheduleViewValueAfterChange, initialScheduleViewValue);
    }); 
  }

  async assertInitialLanguageValue() {
    initialLanguageValue = await this.getSelectedLanguageValue.textContent();
    await test.step('Make sure that all page elements are localized according to the selected option: English', async () => {
      if(! this.isMobile) {
        const navigationText  = await this.firstnavigationItemTitleInUI.textContent();
        await assertEqualValues(navigationText.trim() , indexPage.lighthouse_data.flowsheetInEnglish);
      }
      const profileTitleText = await this.getTextOfSyncLabel.textContent();
      await assertEqualValues(profileTitleText.trim(),indexPage.lighthouse_data.lastSyncedInEnglish);
    });
  }

  async assertUpdateLanguageToSpanish() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if(getLanguageText === initialLanguageValue) {
      await executeStep(this.languageUpdateButton,"click","click on update button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await test.step('Verify that the "Language selection modal" is displayed', async () => {
        await assertElementVisible(this.appLanguagerRequestModal);
      });    
      await executeStep(this.requestModalCloseBtn,"click","click on close button");
      await test.step("Verify that the 'Close' link works properly", async () => { 
        await assertElementNotVisible(this.appLanguagerRequestModal);
      });
      await executeStep(this.languageUpdateButton,"click","click on update button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await test.step('Verify that the "Language selection modal" is displayed', async () => {
        await assertElementVisible(this.appLanguagerRequestModal);
      });
      await executeStep(this.selectLanguage(2),"click","select spanish language");
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    spanishText = await this.getSelectedLanguageValue.textContent();
    await test.step(`Verify that the selected language is updated successfully to Spanish. Expected: "${utilConst.Const.Languages[1]}", Actual: "${spanishText}"`, async () => {
      await assertEqualValues(spanishText.trim(), utilConst.Const.Languages[1]);
    });  
    await test.step('Make sure that all page elements are localized according to the selected option: Spanish', async () => {
      if(! this.isMobile) {
        await verifyNavigationElements(this.page,this.navigationElementsLocator,indexPage.lighthouse_data.navigationElementsInSpanish,utilConst.Const.Languages[1]);
      }
    });
    await test.step('Make sure that all My Profile page elements are localized according to the selected option: Spanish', async () => {
      const profileTitleText = await this.getTextOfSyncLabel.textContent();
      await assertEqualValues(profileTitleText.trim(),indexPage.lighthouse_data.lastSyncedInSpanish);
    });
  }

  async assertUpdateLanguageToFrench() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if(getLanguageText === spanishText) {
      await executeStep(this.languageUpdateButton,"click","click on update button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await test.step('Verify that the "Language selection modal" is displayed', async () => {
        await assertElementVisible(this.appLanguagerRequestModal);
      }); 
      await executeStep(this.selectLanguage(3),"click","select spanish language");
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    frenchText = await this.getSelectedLanguageValue.textContent();
    await test.step(`Verify that the selected language is updated successfully to French. Expected: "${utilConst.Const.Languages[2]}", Actual: "${frenchText}"`, async () => {
      await assertEqualValues(frenchText.trim(), utilConst.Const.Languages[2]);
    });
    await test.step('Make sure that all page elements are localized according to the selected option: French', async () => {
      if(! this.isMobile) {
        await verifyNavigationElements(this.page,this.navigationElementsLocator,indexPage.lighthouse_data.navigationElementsInFrench,utilConst.Const.Languages[2]);
      }
    });
    await test.step('Make sure that all My Profile page elements are localized according to the selected option: French', async () => {
      const profileTitleText = await this.getTextOfSyncLabel.textContent();
      await assertEqualValues(profileTitleText.trim(),indexPage.lighthouse_data.lastSyncedInFrench);
    });
  }

  async changeLanguageToIntialValue() {
    const getLanguageText = await this.getSelectedLanguageValue.textContent();
    if(getLanguageText !== initialLanguageValue) {
      await executeStep(this.languageUpdateButton,"click","click on update button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await test.step('Verify that the "Language selection modal" is displayed', async () => {
        await assertElementVisible(this.appLanguagerRequestModal);
      });
      await executeStep(this.selectLanguage(1),"click","select spanish language");
      await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    }
    const englishText = await this.getSelectedLanguageValue.textContent();
    await test.step(`Verify that the selected language is updated successfully to English. Expected: "${initialLanguageValue}", Actual: "${englishText}"`, async () => {
      await assertEqualValues(englishText.trim(), initialLanguageValue.trim());
    });
    await test.step('Make sure that all page elements are localized according to the selected option: English', async () => {
      if(! this.isMobile) {
        await verifyNavigationElements(this.page,this.navigationElementsLocator,indexPage.lighthouse_data.navigationElementsInEnglish,utilConst.Const.Languages[0]);
      }
    });
    await test.step('Make sure that all all My Profile page elements are localized according to the selected option: English', async () => {
      const profileTitleText = await this.getTextOfSyncLabel.textContent();
      await assertEqualValues(profileTitleText.trim(),indexPage.lighthouse_data.lastSyncedInEnglish);
    });
  }
};
