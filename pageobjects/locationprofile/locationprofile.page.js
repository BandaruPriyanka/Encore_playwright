const { executeStep } = require('../../utils/action');
const {
  assertElementVisible,
  assertElementAttributeContains,
  assertElementNotVisible,
  assertElementEnabled,
  assertElementFocused,
  assertValueToBe,
  scrollElement,
  assertElementDisabled,
  assertElementContainsText,
  nextDayDate,
  getDateBasedOnDays,
  assertEqualValues,
  todayDate
} = require('../../utils/helper');
const indexPage = require('../../utils/index.page');
const { test } = require('@playwright/test');
const utilConst = require('../../utils/const');

let equipmentCheckListText, flowsheetCardAndTab, initialDays, valueAfterNotifyUsDays;
exports.LocationProfile = class LocationProfile {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
    this.menuIcon = this.page.locator('//app-side-menu');
    this.locationProfileBtn = this.page.locator(
      "//span[normalize-space()='Location Profile']//parent::div"
    );
    this.generalTab = this.isMobile
      ? this.getDynamicLocator('General', 1)
      : this.getDynamicLocator('General', 2);
    this.addOnEmailRecipients = this.isMobile
      ? this.getDynamicLocator('Add Ons Email Recipients', 1)
      : this.getDynamicLocator('Add Ons Email Recipients', 2);
    this.flowsheetGroups = this.isMobile
      ? this.getDynamicLocator('Flowsheet Groups', 1)
      : this.getDynamicLocator('Flowsheet Groups', 2);
    this.equipmentChecklist = this.isMobile
      ? this.getDynamicTextLocator('e2e_user_profile_equipment_checklist_label', 2)
      : this.getDynamicTextLocator('e2e_user_profile_equipment_checklist_label', 1);
    this.notifyJobChanges = this.isMobile
      ? this.getDynamicTextLocator('e2e_user_profile_job_changes', 2)
      : this.getDynamicTextLocator('e2e_user_profile_job_changes', 1);
    this.useDocusign = this.isMobile
      ? this.getDynamicTextLocator('e2e_user_profile_docusign_label', 2)
      : this.getDynamicTextLocator('e2e_user_profile_docusign_label', 1);
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
    this.noButton = this.page.locator("//span[text()='No']");
    this.checkBoxForPackage = this.page.locator(
      "//span[@class='e2e_flowsheet_equipment_package font-semibold'][1]/../following-sibling::div//input[@type='checkbox']"
    );
    this.locationHeader = this.page.locator('//app-profile-header');
    this.groupList = this.page.locator("//th[text()='Group name']");
    this.daysExpire = this.isMobile
      ? this.page.locator(
          "//span[normalize-space()='Create']/parent::button/preceding-sibling::span[normalize-space()='Days until expiration:']"
        )
      : this.page.locator("//th[text()='Days until expiration']");
    this.addGrpField = this.page.locator("//input[@placeholder='Add Group']");
    this.createButton = this.page.locator("//span[normalize-space()='Create']//parent::button");
    this.binIcon = name =>
      this.page.locator(`//div[normalize-space()='` + name + `']//icon[@name='trah_bin_line']`);
    this.addEmail = this.page.locator("//input[@placeholder='Add Email']");
    this.addBtn = this.page.locator("//span[normalize-space()='Add']//parent::button");
    this.expireDaysInputField = this.page.locator("//input[@type='number']");
    this.roomsFirstCard = this.page.locator('//app-flowsheet-action-card[1]');
    this.groupsIcon = this.page.locator(
      "(//app-flowsheet-action-card[1]//span[normalize-space()='groups'])[2]"
    );
    this.groupName = name =>
      this.page.locator(`//ul[@role='list']//span[normalize-space()='` + name + `']`);
    this.areYouSurePop = this.page.locator("//app-confirm-dialog//p[normalize-space()='Are you sure?']");
    this.emailRecipientsIcon = this.isMobile ? this.page.locator("(//icon[@name='letter_line'])[1]") 
              : this.page.locator("(//icon[@name='letter_line'])[2]");
    this.locationHeader = this.page.locator("//span[contains(@class,'e2e_selected_location')]");
    this.headerTitle = this.page.locator("//div[contains(@class,'e2e_profile_header_title')]");
    this.emailRecipientsList = this.page.locator(
      "//div[contains(@class,'e2e_recipients_row_name')]"
    );
    this.emailDiv = email => this.page.locator(`//div[contains(text(),'${email}')]`);
    this.deleteIcon = email =>
      this.page.locator(`//div[contains(text(),'${email}')]/../../following-sibling::div/icon`);
    this.confirmationModal = this.page.locator('//app-confirm-dialog');
    //C57121
    this.notifyUsOfJobChangesDiv = this.isMobile
      ? this.page.locator("(//div[contains(@class,'e2e_user_profile_job_changes')])[2]")
      : this.page.locator("(//div[contains(@class,'e2e_user_profile_job_changes')])[1]");
    this.daysInput = this.isMobile
      ? this.page.locator("(//input[@formcontrolname='days'])[2]")
      : this.page.locator("(//input[@formcontrolname='days'])[1]");
    this.notificationIcon = this.page.locator("//icon[@name='bell_notification_line']");
    this.backArrowBtnInPage = this.page.locator("//app-flowsheet-detail//icon[@name='arrow_line']");
    this.notificationMsg = msg =>
      this.page.locator(`//app-notification[1]//div[contains(text(),'` + msg + `')]`);
    this.notificationCloseBtn = this.page.locator("//icon[@class='cursor-pointer']");
    this.moodChangeIcon = this.isMobile
      ? this.page.locator('(//app-flowsheet-detail//app-mood-icon//icon)[2]')
      : this.page.locator('(//app-flowsheet-detail//app-mood-icon//icon)[1]');
    this.moodChangeIconInModal = icon =>
      this.page.locator(`//app-room-mood-chooser//app-mood-icon//icon[@class='` + icon + `']`);
    this.commentBoxInput = this.page.locator(
      "//span[text()='Comment']//following-sibling::textarea"
    );
    this.submitButton = this.page.locator("//span[contains(text(),'Submit')]");
    this.dateElement = date => this.page.locator(`//span[text()='${date}']`);
    this.nextWeekButton = this.page.locator("//icon[@title='Next week']");
    this.todayDiv = this.page.locator("//div[normalize-space()='TODAY']");
    this.notifyUsUpdateButton = this.isMobile
      ? this.page.locator("(//div[normalize-space()='Update'])[2]")
      : this.page.locator("(//div[normalize-space()='Update'])[1]");
    this.notificationClearAll = this.page.locator("//div[normalize-space()='Clear all']");
  }
  getDynamicLocator = (label, index) => {
    return this.page.locator(`(//span[normalize-space()='${label}']//parent::li)[${index}]`);
  };
  getDynamicTextLocator = (text, index) => {
    return this.page.locator(`(//div[contains(@class,'${text}')])[${index}]`);
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

  async clickOnFlowsheetGroups() {
    await executeStep(
      this.flowsheetGroups,
      'click',
      "The 'Flowsheet Groups' page should be opened"
    );
  }

  async verifyAddOnesEmailRecipients() {
    await this.clickOnFlowsheetGroups();
    await assertElementVisible(this.locationHeader, 'Verify Location header');
    await executeStep(this.addGrpField, 'fill', 'Enter the Group Name', [
      indexPage.lighthouse_data.groupName
    ]);
    const ele = await this.daysExpire;
    await scrollElement(ele, 'bottom');
    await assertElementVisible(
      this.daysExpire,
      'Verify Groups list with the days until expiration'
    );
    await assertElementVisible(this.addGrpField, 'Verify Footer field to add Groups');
  }

  async verifyGroupsCanBeRemoved() {
    await executeStep(this.createButton, 'click', 'Click on Create button');
    await assertElementVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Remove icon is present'
    );
    await executeStep(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'click',
      'Remove Group for clean up'
    );
    await executeStep(this.yesButton, 'click', 'Confirm Remove Group for clean up');
    await assertElementNotVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Remove icon is not present'
    );
  }

  async addingGroupFunctionality() {
    await executeStep(this.addGrpField, 'click', "Click on 'Add group' row");
    await assertElementFocused(
      this.addGrpField,
      'Cursor should be displayed & the field should be highlighted.'
    );
    await test.step('Make sure that user is NOT able to create Group without Name', async () => {
      await assertElementNotVisible(this.createButton, 'Create button should be disabled.');
    });
    await executeStep(this.addGrpField, 'fill', 'Input some valid Group name', [
      indexPage.lighthouse_data.groupName
    ]);
    await assertElementEnabled(this.createButton, 'Add button should be enabled.');
    const actual = await this.expireDaysInputField.inputValue();
    await assertValueToBe(
      actual,
      'Default value for expiration days = 7',
      indexPage.lighthouse_data.expirationDays
    );
    await executeStep(this.createButton, 'click', 'Click on Create button');
    await assertElementVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Group should be added to the list successfully.'
    );
    await test.step('Refresh the page to make sure that changes were properly saved.', async () => {
      await this.page.reload();
    });
    await assertElementVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Group should be added to the list successfully After Reload.'
    );
    await executeStep(this.flowsheetBtn, 'click', 'Click on Flowsheet Button');
    await executeStep(this.roomsFirstCard, 'hover', 'Hover on Flowheet card');
    if (!this.isMobile) {
      await executeStep(this.groupsIcon, 'click', 'Click on Group Icon');
      const actual_text = (
        await this.groupName(indexPage.lighthouse_data.groupName).textContent()
      ).trim();
      await assertValueToBe(
        actual_text,
        'A newly added Group should be displayed within the modal.',
        indexPage.lighthouse_data.groupName
      );
    }
  }

  async removingGroupFunctionality() {
    await assertElementVisible(
      this.locationHeader,
      "Verify The 'Flowsheet Groups' page Header is Visible"
    );
    await executeStep(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'click',
      "Click on 'Remove' icon for some previously added Group"
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.areYouSurePop, 'Confirmation modal should be displayed.');
    await executeStep(this.noButton, 'click', "Select 'No' option within the modal");
    await assertElementVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Previously added Group should stil be present on the list.'
    );
    await executeStep(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'click',
      "Again click on 'Remove' icon for some previously added Group"
    );
    await assertElementVisible(this.areYouSurePop, 'Confirmation modal should be displayed.');
    await executeStep(this.yesButton, 'click', "Select 'Yes' option within the modal");
    await assertElementNotVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Previously added Group should be removed successfully from the list.'
    );
    await test.step('Refresh the page to make sure that Group was removed successfully.', async () => {
      await this.page.reload();
    });
    await assertElementNotVisible(
      this.binIcon(indexPage.lighthouse_data.groupName),
      'Group should be removed from the list successfully After Reload.'
    );
    await executeStep(this.flowsheetBtn, 'click', 'Click on Flowsheet Button');
    await executeStep(this.roomsFirstCard, 'hover', 'Hover on Flowheet card');
    if (!this.isMobile) {
      await executeStep(this.groupsIcon, 'click', 'Click on Group Icon');
      await assertElementNotVisible(
        this.groupName(indexPage.lighthouse_data.groupName),
        'A removed Group should NOT be displayed within the modal..'
      );
    }
  }

  async verifyAddOnsEmailRecipientsElements() {
    await executeStep(this.emailRecipientsIcon, 'click', "Click on 'Email Recipient'");
    await assertElementVisible(this.locationHeader, "Verify that the 'Location header' is visible");
    try {
      await assertElementVisible(
        this.emailRecipientsList,
        "Verify that the 'Email recipients list' is visible"
      );
    } catch {
      await executeStep(this.addEmail, 'fill', 'Enter the email', [
        indexPage.lighthouse_data.addOnEmail
      ]);
      await executeStep(this.addBtn, 'click', 'Click on add button');
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await assertElementVisible(
        this.emailRecipientsList,
        "Verify that the 'Email recipients list' is visible"
      );
    }
    await assertElementVisible(this.addEmail,"Verify that the 'Footer Field' is visible");
    await executeStep(this.deleteIcon(indexPage.lighthouse_data.addOnEmail),"click","Delete the email");
    await executeStep(this.yesButton,"click","Click on yes button");
    await assertElementNotVisible(this.emailRecipientsList,'Verify that all added emails can be removed from the list');
  }

  async assertEmailRecipients() {
    await executeStep(this.emailRecipientsIcon, 'click', "Click on 'Email Recipient'");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementContainsText(
      this.headerTitle,
      indexPage.lighthouse_data.addOnEmailRecipients,
      "Verify that the 'Add Ons Email Recipients' page should be opened"
    );
  }

  async assertEmailInput() {
    await executeStep(this.addEmail, 'click', "Click on 'Add email' row");
    await assertElementFocused(
      this.addEmail,
      'Verify that the Cursor should be displayed & the field should be highlighted'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.addEmail, 'fill', 'Enter the invalid email', [
      indexPage.lighthouse_data.invalidEmail
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementDisabled(
      this.addBtn,
      "Verify that the 'Add button' should be disabled if the email format is invalid."
    );
    await executeStep(this.addEmail, 'fill', 'Clear the invalid mail', ['']);
    await executeStep(this.addEmail, 'fill', 'Enter the valid email', [
      indexPage.lighthouse_data.addOnEmail
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementEnabled(this.addBtn, "Verift that 'Add button' should be enabled.");
    await executeStep(this.addBtn, 'click', "Click on 'Add Button'");
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should be added to the list successfully."
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should be added to the list successfully."
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.flowsheetBtn, 'click', 'Click on Flowsheet Icon');
  }

  async deleteEmail() {
    try {
      await assertElementVisible(
        this.emailDiv(indexPage.lighthouse_data.addOnEmail),
        "Verify that 'Email' should be added to the list successfully."
      );
    } catch {
      await executeStep(this.addEmail, 'fill', 'Enter the valid email', [
        indexPage.lighthouse_data.addOnEmail
      ]);
      await executeStep(this.addBtn, 'click', "Click on 'Add Button'");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.emailDiv(indexPage.lighthouse_data.addOnEmail),
        "Verify that 'Email' should be added to the list successfully."
      );
    }
    await executeStep(
      this.deleteIcon(indexPage.lighthouse_data.addOnEmail),
      'click',
      'Click on delete icon'
    );
    await assertElementVisible(
      this.confirmationModal,
      "Verify that 'Confirmation modal' should be displayed."
    );
    await executeStep(this.noButton, 'click', "Click on 'No button'");
    await assertElementVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should not be removed."
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should not be removed after reload."
    );
    await executeStep(
      this.deleteIcon(indexPage.lighthouse_data.addOnEmail),
      'click',
      'Click on delete icon'
    );
    await assertElementVisible(
      this.confirmationModal,
      "Verify that 'Confirmation modal' should be displayed."
    );
    await executeStep(this.yesButton, 'click', "Click on 'Yes Button'");
    await assertElementNotVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should be removed from the list successfully."
    );
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementNotVisible(
      this.emailDiv(indexPage.lighthouse_data.addOnEmail),
      "Verify that 'Email' should be removed from the list successfully after reload."
    );
  }
  async moodChangeFunctionality(icon, comment) {
    await executeStep(this.moodChangeIcon, 'click', 'Click on mood change icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.moodChangeIconInModal(icon), 'click', 'Click on icon in modal');
    await executeStep(this.commentBoxInput, 'fill', 'Enter the comment', [comment]);
    await executeStep(this.submitButton, 'click', 'Click on submit button');
    if (this.isMobile) {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      executeStep(this.backArrowBtnInPage, 'click', 'Click on back button in mobile');
    }
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(this.notificationIcon, 'click', 'Click on notification button');
  }

  async initialNotifyDays() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.notifyUsOfJobChangesDiv,
      "Verify that the 'Notify us of job changes' is visible"
    );
    initialDays = await this.daysInput.inputValue();
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await this.moodChangeFunctionality(
      utilConst.Const.yellowIconText,
      indexPage.lighthouse_data.neutralComment
    );
    await assertElementVisible(
      this.notificationMsg(indexPage.lighthouse_data.neutralComment),
      'Verify User should get both push & in-app notifications'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.notificationClearAll, 'click', 'Click clear all button');
    await executeStep(this.notificationCloseBtn, 'click', 'Close notification button');
  }

  async assertNotifyUsAfterDateChange(icon, comment, days) {
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await this.moodChangeFunctionality(icon, comment);
    if (days == 0 || days == 2) {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementNotVisible(
        this.notificationMsg(comment),
        'Verify that No push & in-app notifications expected.'
      );
    } else {
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementVisible(
        this.notificationMsg(comment),
        'Verify User should get both push & in-app notifications'
      );
      await executeStep(this.notificationClearAll, 'click', 'Click clear all button');
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.notificationCloseBtn, 'click', 'Close notification button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }

  async notifyUsDateChangeForInitialValue() {
    if (await this.dateElement(nextDayDate()).isVisible()) {
      await executeStep(this.dateElement(nextDayDate()), 'click', 'Click on next day');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    } else {
      await executeStep(this.nextWeekButton, 'click', 'Click on next week button');
      await executeStep(this.dateElement(nextDayDate()), 'Click', 'Click on next day');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await this.assertNotifyUsAfterDateChange(
      utilConst.Const.yellowIconText,
      indexPage.lighthouse_data.neutralComment,
      initialDays
    );
  }

  async changeTheDayInNotifyUs() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.clickOnLocationProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.daysInput, 'fill', 'Enter the days for notify us of job changes', ['1']);
    await executeStep(this.notifyUsUpdateButton, 'click', 'Click on update button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    valueAfterNotifyUsDays = await this.daysInput.inputValue();
    await executeStep(this.flowsheetBtn, 'click', 'Click on flowsheet button');
    await flowsheetCardAndTab.performSearchFunction(
      indexPage.navigator_data.second_job_no,
      indexPage.navigator_data.second_job_no
    );
    await this.moodChangeFunctionality(
      utilConst.Const.redIconText,
      indexPage.lighthouse_data.angryComment
    );
    await assertElementVisible(
      this.notificationMsg(indexPage.lighthouse_data.angryComment),
      'Verify User should get both push & in-app notifications'
    );
    await executeStep(this.notificationCloseBtn, 'click', 'Close notification button');
  }

  async assertNotificationForDateChange() {
    if (await this.dateElement(nextDayDate()).isVisible()) {
      await executeStep(this.dateElement(nextDayDate()), 'click', 'Click on next day');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    } else {
      await executeStep(this.nextWeekButton, 'click', 'Click on next week button');
      await executeStep(this.dateElement(nextDayDate()), 'click', 'Click on next day');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await this.assertNotifyUsAfterDateChange(
      utilConst.Const.redIconText,
      indexPage.lighthouse_data.angryComment,
      valueAfterNotifyUsDays
    );
    if (await this.dateElement(getDateBasedOnDays(2)).isVisible()) {
      await executeStep(
        this.dateElement(getDateBasedOnDays(2)),
        'click',
        'Click on the date which is actual date + 2 days'
      );
    } else {
      await executeStep(this.nextWeekButton, 'click', 'Click on next week button');
      await executeStep(
        this.dateElement(getDateBasedOnDays(2)),
        'click',
        'Click on the date which is actual date + 2 days'
      );
    }
    await this.assertNotifyUsAfterDateChange(
      utilConst.Const.redIconText,
      indexPage.lighthouse_data.angryComment,
      '2'
    );
  }

  async assertNotifyUsValueAfterReload() {
    await this.clickOnLocationProfile();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const getValue = await this.daysInput.inputValue();
    await assertEqualValues(
      getValue,
      valueAfterNotifyUsDays,
      "Verify that the selected 'Notify us of job changes' value remains the same after the page reload"
    );
  }

  async setNotifyUsValueToInitalValue() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.daysInput,
      'fill',
      "Enter the initial value for 'Notify Us Of Job Changes'",
      [initialDays]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.notifyUsUpdateButton, 'click', 'Click on update button');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
};
