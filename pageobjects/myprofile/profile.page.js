const { executeStep } = require('../../utils/action');
const indexPage = require('../../utils/index.page');
const fs = require('node:fs/promises');
const { test, expect } = require('@playwright/test');
const {
  assertElementVisible,
  assertContainsValue,
  validateLastSyncValue,
  validateLastSyncedText
} = require('../../utils/helper');

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
    this.selectedLocationValue = this;
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
};
