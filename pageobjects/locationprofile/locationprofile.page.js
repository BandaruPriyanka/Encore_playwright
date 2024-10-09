const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertElementNotVisible,
  assertElementAttributeContains
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');
const { test } = require('@playwright/test');

let equipmentCheckListText, flowsheetCardAndTab;
exports.LocationProfile = class LocationProfile {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    this.menuIcon = this.page.locator('//app-side-menu');
    this.locationProfileBtn = this.page.locator(
      "//span[normalize-space()='Location Profile']//parent::div"
    );
    this.generalTab = this.getDynamicLocator('General');
    this.addOnEmailRecipients = this.getDynamicLocator('Add Ons Email Recipients');
    this.flowsheetGroups = this.getDynamicLocator('Flowsheet Groups');
    this.equipmentChecklist = this.getDynamicTextLocator('Use Equipment Checklist');
    this.notifyJobChanges = this.getDynamicTextLocator('Notify us of job changes');
    this.useDocusign = this.getDynamicTextLocator('Use Docusign');
    this.equipmentCheckListOption = this.isMobile
      ? this.page.locator("//div[contains(@class,'e2e_user_profile_equipment_checklist_value')]")
      : this.page.locator("//span[@class='e2e_user_profile_equipment_checklist_value']");
    this.equipmentCheckListTurnOnAndOffBtn = this.isMobile
      ? this.page.locator(
          "(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[2]"
        )
      : this.page.locator(
          "(//div[contains(@class,'e2e_user_profile_equipment_checklist_action')])[1]"
        );
    this.flowsheetBtn = this.isMobile
      ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
      : this.page.locator(
          '//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]'
        );
    this.selectAllCheckBox = this.page.locator(
      "//span[text()='Select All']//following-sibling::input[@type='checkbox']"
    );
    this.yesButton = this.page.locator("//span[text()='Yes']");
    this.checkBoxForPackage = this.page.locator(
      "//span[@class='e2e_flowsheet_equipment_package font-semibold'][1]/../following-sibling::div//input[@type='checkbox']"
    );
  }
  getDynamicLocator = label => {
    return this.page.locator(`(//span[normalize-space()='${label}']//parent::li)[2]`);
  };
  getDynamicTextLocator = text => {
    return this.page.locator(`//div[text()='${text}']`);
  };
  async clickOnLocationProfile() {
    await executeStep(this.menuIcon, 'click', 'Click on Menu Icon');
    await executeStep(this.locationProfileBtn, 'click', 'Click on Location Profile Tab');
  }
  async verifyTabs() {
    await test.step('Verify General Tab is opened by default', async () => {
      await assertElementVisible(this.generalTab, '');
      await assertElementAttributeContains(this.generalTab, 'class', 'dark:text', '');
    });
    await assertElementVisible(
      this.addOnEmailRecipients,
      'Verify other Tabs available namely: Add ons Email Recipients & Flowsheet Groups '
    );
    await assertElementVisible(
      this.flowsheetGroups,
      'Verify other Tabs available namely: Add ons Email Recipients & Flowsheet Groups '
    );
    await executeStep(this.generalTab, 'click', 'Click on General Tab');
    await test.step('Verify The next location settings should be displayed & available :Use Equipment Checklist,Notify us of job changes & Use DocuSign', async () => {
      await assertElementVisible(this.equipmentChecklist, '');
      await assertElementVisible(this.notifyJobChanges, '');
      await assertElementVisible(this.useDocusign, '');
    });
  }

  async assertEquipmentCheckList() {
    equipmentCheckListText = await this.equipmentCheckListOption.textContent();
    if (equipmentCheckListText.trim() === indexPage.lighthouse_data.turnOff) {
      await executeStep(this.equipmentCheckListTurnOnAndOffBtn, 'click', 'Click on Turn On button');
    }
    await executeStep(this.flowsheetBtn, 'click', 'Click on Flowsheet button');
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await assertElementVisible(
      this.selectAllCheckBox,
      'Verify that the "Select All checkbox" is visible'
    );
    if (await this.selectAllCheckBox.isChecked()) {
      await test.step('Making all items Uncheck', async () => {
        await this.selectAllCheckBox.uncheck();
      });
    } else {
      await test.step('Making all items Check', async () => {
        await this.selectAllCheckBox.check();
      });
    }
    await executeStep(this.yesButton, 'click', 'Click on Yes button to check or uncheck');
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
};
