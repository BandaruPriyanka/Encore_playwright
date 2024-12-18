const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertElementNotVisible,
  scrollElement
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');
const { test } = require('@playwright/test');
exports.NotificationPage = class NotificationPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.myProfileBtn = this.page.locator(
      "//app-side-menu//span[normalize-space(text())='My Profile']"
    );
    this.notificationLocation = this.isMobile
      ? this.page.locator("(//span[text()='Notification Locations'])[1]")
      : this.page.locator("(//span[text()='Notification Locations'])[2]");
    this.locationList = this.page.locator("//table[@id='location-tbl']//tbody");
    this.addLocation = this.page.locator("//input[@placeholder='Add Location']");
    this.homeIcon = this.page.locator("//icon[@name='home_alt_filled']");
    this.deleteIcon = this.page.locator("(//icon[@name='trah_bin_line'])[1]");
    this.selectRecentlyDeletedLocation = this.page.locator(
      "((//icon[@name='trah_bin_line'])[1]/../..//div)[1]"
    );
    this.listBox = this.page.locator("//div[@role='listbox']");
    this.exisitingLocation = this.page.locator("(//table[@id='location-tbl']//tbody//tr//div)[1]");
    this.searchExistingLocation = location =>
      this.page.locator(
        `//table[@id='location-tbl']//tbody//tr//div[contains(text(),"` + location + `")]`
      );
    this.selectLocation = this.page.locator("(//div[@role='listbox']/mat-option)[1]");
  }
  async navigateToProfileMenu() {
    await executeStep(this.menuIcon, 'click', 'Click on Profile Menu Icon');
  }
  async navigateToMyProfile() {
    await executeStep(this.myProfileBtn, 'click', 'Click on My Profile');
  }
  async clickOnNotification() {
    await executeStep(this.notificationLocation, 'click', 'Click on Notification location');
  }
  async scrollAction() {
    const div = await this.listBox;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }
  async verifyAddLocationField() {
    await executeStep(this.addLocation, 'click', 'Click on that add location row');
    await assertElementVisible(
      this.listBox,
      'Verify that the location selection modal is displayed.'
    );
    await test.step('Verify that Locations list should be scrollable', async () => {
      await this.scrollAction();
    });
    await executeStep(
      this.addLocation,
      'fill',
      'Fill the search location field with invalid data',
      [indexPage.lighthouse_data.invalidLocation]
    );
    await assertElementNotVisible(
      this.listBox,
      `Verify that the list should not be displayed within the modal after entering invalid data like "${indexPage.lighthouse_data.invalidLocation}"`
    );
    await executeStep(this.addLocation, 'fill', 'Enter valid lowercase location data', [
      indexPage.lighthouse_data.locationNameLower
    ]);
    await assertElementVisible(
      this.listBox,
      `Verify that the list should be displayed within the modal after entering :"${indexPage.lighthouse_data.locationNameLower}"`
    );
    await executeStep(this.addLocation, 'fill', 'Enter valid uppercase location data', [
      indexPage.lighthouse_data.locationNameUpper
    ]);
    await assertElementVisible(
      this.listBox,
      `Verify that the list should be displayed within the modal after entering :"${indexPage.lighthouse_data.locationNameUpper}"`
    );
    const location = await this.exisitingLocation.textContent();
    await executeStep(this.addLocation, 'fill', 'enetr existing location', [location]);
    await assertElementVisible(
      this.searchExistingLocation(location),
      `Verify that the existing location "${location}" is excluded from the search results`
    );
  }
  async verifyAddingLocation() {
    await executeStep(this.addLocation, 'click', 'Click on that add location row');
    await assertElementVisible(
      this.listBox,
      'Verify that the location selection modal is displayed.'
    );
    await executeStep(this.addLocation, 'fill', 'Enter valid location', [
      indexPage.lighthouse_data.locationNameLower
    ]);
    const locationDetails = await this.selectLocation.textContent();
    await executeStep(
      this.selectLocation,
      'click',
      'Click on some location from the search results'
    );
    await assertElementVisible(
      this.searchExistingLocation(locationDetails),
      `Verify location : "${locationDetails}" should be added successfully`
    );
    await test.step('Refreshing page here', async () => {
      await this.page.reload();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    });
    await assertElementVisible(
      this.searchExistingLocation(locationDetails),
      `Verify previously added location is still there after refreshing page : "${locationDetails}"`
    );
  }
  async verifyRemovingLocation() {
    const deletedLocationDetails = await this.selectRecentlyDeletedLocation.textContent();
    await executeStep(this.deleteIcon, 'click', 'Click on delete Icon for some location');
    await assertElementNotVisible(
      this.searchExistingLocation(deletedLocationDetails),
      `Verify location : "${deletedLocationDetails}" should be removed successfully from the list`
    );
    await test.step('Refreshing page here', async () => {
      await this.page.reload();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    });
    await assertElementNotVisible(
      this.searchExistingLocation(deletedLocationDetails),
      `Verify previously deleted location is not displayed within the list after refreshing page : "${deletedLocationDetails}"`
    );
  }
};
