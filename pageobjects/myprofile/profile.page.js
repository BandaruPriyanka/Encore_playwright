const { executeStep } = require('../../utils/action');
const indexPage = require('../../utils/index.page');
const fs = require('node:fs/promises');
const {
    assertElementVisible,
    assertContainsValue,
    validateLastSyncValue
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
    await validateLastSyncValue(this.lastSyncValue);
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
    expectedlocationText,
    expectedlogsText,
    expecteddashboardText
  ) {
    await assertElementVisible(this.menuIcon);
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.scheduleTab, 'click', 'click on scheduleTab');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.customersIcon, 'click', 'click on customersIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.chatIcon, 'click', 'click on chatIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.menuText, 'click', 'click on menuText');
    await executeStep(this.AgendasIcon, 'click', 'click on AgendasIcon');
    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.myProfileBtn, 'click', 'click on myProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let profileText = await this.profileModule.textContent();
    await assertContainsValue(profileText, expectedProfileText);

    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.locationProfileOption, 'click', 'click on locationProfileOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let locationText = await this.locationHeading.textContent();
    await assertContainsValue(locationText, expectedlocationText);

    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.logsOption, 'click', 'click on logsOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let logsText = await this.logsHeading.textContent();
    await assertContainsValue(logsText, expectedlogsText);

    await executeStep(this.menuIcon, 'click', 'click on menuIcon');
    await assertElementVisible(this.menuModal);
    await executeStep(this.dashboardOption, 'click', 'click on dashboardOption');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    let dashboardText = await this.dashboardPageText.textContent();
    await assertContainsValue(dashboardText, expecteddashboardText);
  }
};
