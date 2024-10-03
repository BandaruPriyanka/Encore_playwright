const { executeStep } = require('../../utils/action');
const { expect } = require('@playwright/test');
const indexPage = require('../../utils/index.page');
require('dotenv').config();
const atob = require('atob');
const {
  assertElementVisible,
  assertElementContainsText,
  assertElementNotVisible,
  scrollElement,
  assertEqualValues
} = require('../../utils/helper');
exports.ChatPage = class ChatPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.chatIcon = this.isMobile
      ? this.page.locator('(//app-mobile-navigation-item)[4]')
      : this.page.locator('//span[normalize-space(text())="Chat"]/parent::div');
    this.HighlightedChatIcon = this.isMobile
      ? this.page.locator('(//app-mobile-navigation-item)[4]/div')
      : this.page.locator('(//span[normalize-space(text())="Chat"]/parent::div)[2]');

    this.participantChatAll = this.page.locator('//app-thread-card/parent::div');
    this.participantChat = this.page.locator('(//app-thread-card)[1]');
    this.searchChat_Field = this.page.locator('//input[@placeholder="Search Chat"]');
    this.noResultsFound_Text = this.page.locator('//span[normalize-space()="No data found"]');
    this.crossMark = this.page.locator('//icon[@name="cross_line"]');
    this.newChatIcon = this.page.locator('//icon[@name="new_chat_line"]');
    this.ParticipantsMatOptions = this.page.locator('//mat-option');
    this.participant1 = this.page.locator('(//mat-option)[1]');
    this.participant2 = this.page.locator('(//mat-option)[2]');
    this.participant3 = this.page.locator('(//mat-option)[3]');
    this.createChatButton = this.page.locator('//span[normalize-space()="Create Chat"]');
    this.groupIcon = this.isMobile
      ? this.page.locator('(//div[@class="ng-star-inserted"]/div)[2]')
      : this.page.locator('(//icon[@name="group_line"]//*[name()="svg"])[1]');
    this.addParticipants = this.page.locator('//span[text()="Add Participant"]');
    this.addButton = this.page.locator('//button[text()="Add"]');
    this.leave = this.page.locator('//span[contains(text(),"Leave")]');
    this.participantsModel = this.page.locator('//mat-option/parent::div');
    this.searchUsersField = this.page.locator('//input[@placeholder="Search users"]');
    this.noResultsFoundTextInAddParticipants = this.page.locator(
      '//span[normalize-space()="No results found."]'
    );
    this.penIcon = this.isMobile
      ? this.page.locator('(//icon[@name="pen_line"])[2]')
      : this.page.locator('(//icon[@name="pen_line"])[1]');
    this.groupNameField = this.page.locator("//div[text()='Group name']/following-sibling::input");
    this.saveButton = this.page.locator('//button[text()="Save"]');
    this.updatedGroupName = this.isMobile
      ? this.page.locator('(//icon[@name="pen_line"]/parent::div/div/span)[2]')
      : this.page.locator('(//icon[@name="pen_line"]/parent::div/div/span)[1]');
    this.leaveConfirmationDialogueModel = this.page.locator(
      '//p[@class="mat-mdc-dialog-title mdc-dialog__title e2e_confirm_dialog_title"]//parent::app-confirm-dialog'
    );
    this.YesButton = this.page.locator('//span[text()="Yes"]/ancestor::button');
    this.discardbutton = this.page.locator('//icon[@name="arrow_line"]').last();
    this.quantityCount = this.isMobile
      ? this.page.locator('(//div[@class="ng-star-inserted"]/div)[2]')
      : this.page.locator('(//icon[@name="group_line"]/parent::div)[1]');
    this.searchChatUser = this.page.locator("//input[@role='combobox']");
    this.textArea = this.page.locator("//textarea[@name='add-note-field']");
    this.sendMsg = this.page.locator("//button[@type='submit']");
    this.user1TimeStamp = this.page.locator("(//div[contains(@class,'e2e_message_card_time')])[1]");
    this.menuLine = this.page.locator("(//icon[@name='menu_line'])[1]");
    this.logOut = this.page.locator("//icon[@name='log_out_line']");
    this.selectLogOutMail = this.page.locator(" //div[@id='tilesHolder']");
    this.addAccount = this.page.locator("//div[@id='otherTile']");
    this.enterUserName = this.page.locator("//input[@type='email']");
    this.selectMail = this.page.locator("//div[text()='s-tst-navi-crm@psav.com']");
    this.enterPwd = this.page.locator("//input[@name='passwd']");
    this.submitBtn = this.page.locator("//input[@type='submit']");
    this.chatGrp = this.page.locator(
      "(//div[contains(text(),'Navi CRMautomaiton, Rob Griffith')])[1]"
    );
    this.user2TimeStamp = this.page.locator("(//div[contains(@class,'e2e_message_card_time')])[2]");
    this.alertImportant = this.page.locator("//icon[@name='alert_important_undraw']");
    this.notification = this.page.locator(" //icon[@name='bell_notification_line']");
    this.validateAlertMsgNotification = this.page.locator(' (//app-notification)[1]');
    this.closeNotifications = this.page.locator("//icon[@name='cross_line']");
    this.insertFile = this.page.locator("//input[@type='file']");
    this.clickOnImg = this.page.locator("(//img[contains(@class,'object-scale-down')])[1]");
  }

  async clickOnChatIcon(hightlightedText) {
    await executeStep(this.chatIcon, 'click', 'click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const classAttribute = await this.HighlightedChatIcon.getAttribute('class');
    expect(classAttribute).toContain(hightlightedText);
  }
  async verifyingSearchFieldWithData(randomText, parcipantname, phraseFromChat, casesensitiveText) {
    await executeStep(this.searchChat_Field, 'fill', 'enter the job id', [randomText]);
    await assertElementContainsText(this.noResultsFound_Text, 'No data found');
    await executeStep(this.searchChat_Field, 'fill', 'enter the job id', [parcipantname]);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeouts));
    await assertElementVisible(this.participantChat);
    await executeStep(this.searchChat_Field, 'fill', 'enter the job id', [phraseFromChat]);
    await assertElementVisible(this.participantChat);
    await executeStep(this.crossMark, 'click', 'click on cross Mark');
    await executeStep(this.searchChat_Field, 'fill', 'enter the job id', [casesensitiveText]);
    await assertElementVisible(this.participantChat);
    await scrollElement(this.participantChatAll, 'bottom');
    await executeStep(this.participantChat, 'click', 'click on participant Chat');
  }

  async createNewChat(count) {
    await executeStep(this.newChatIcon, 'click', 'click on new Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeouts));
    await assertElementVisible(this.participant1);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant1, 'click', 'click on participant1');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant2, 'click', 'click on participant2');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.createChatButton, 'click', 'click on createChatButton');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const quantity = await this.quantityCount.textContent();
    expect(quantity).toContain(count);
  }
  async AddParticipants(validParticipant, randomdata, demogroup, noresultFound) {
    await executeStep(this.groupIcon, 'click', 'click on groupIcon');
    await assertElementVisible(this.addParticipants);
    await executeStep(this.addParticipants, 'click', 'click on addParticipants');
    await assertElementVisible(this.participantsModel);
    await executeStep(this.searchUsersField, 'click', 'click on search Users Field');
    await executeStep(this.searchUsersField, 'fill', 'enter valid user', [validParticipant]);
    await executeStep(this.searchUsersField, 'fill', 'empty the search field', [' ']);
    await executeStep(this.searchUsersField, 'fill', 'enter random data', [randomdata]);
    await assertElementContainsText(this.noResultsFoundTextInAddParticipants, [noresultFound]);
    await executeStep(this.searchUsersField, 'fill', 'empty the search field', [' ']);
    await executeStep(this.participant1, 'click', 'click on participant1');
    await executeStep(this.searchUsersField, 'click', 'click on search Users Field');
    await executeStep(this.participant2, 'click', 'click on participant2');
    await executeStep(this.addButton, 'click', 'click on addButton');
    await executeStep(this.penIcon, 'click', 'click on penIcon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.groupNameField, 'click', 'click on groupNameField');
    await executeStep(this.groupNameField, 'fill', 'empty the groupNameField', ['']);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.groupNameField, 'fill', 'enter the groupNameField', [demogroup]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.saveButton, 'click', 'click on saveButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const groupName = await this.updatedGroupName.textContent();
    await assertEqualValues(groupName, demogroup);
  }
  async leaveChat() {
    await executeStep(this.groupIcon, 'click', 'click on groupIcon');
    await assertElementVisible(this.leave);
    await executeStep(this.leave, 'click', 'click on leave');
    await assertElementVisible(this.leaveConfirmationDialogueModel);
    await executeStep(this.YesButton, 'click', 'click on Yes Button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    try {
      await assertElementNotVisible(this.updatedGroupName);
    } catch {
      console.error('Group is not deleted...');
    }
  }
  async loginUser(email, password) {
    await executeStep(this.addAccount, 'click', 'click on add account');
    await executeStep(this.enterUserName, 'fill', 'enter user name', [atob(email)]);
    await executeStep(this.submitBtn, 'click', 'click on submit button');
    await executeStep(this.enterPwd, 'fill', 'enter password', [atob(password)]);
    await executeStep(this.submitBtn, 'click', 'click on submit button');
  }
  async profileLogout() {
    await executeStep(this.menuLine, 'click', 'click on menu line');
    await executeStep(this.logOut, 'click', 'click on logout');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
  }
  async validateNotifications() {
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.notification, 'click', 'click on notification');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.closeNotifications, 'click', 'click on close notification');
  }
  async selectRecentChat() {
    await executeStep(this.chatIcon, 'click', 'click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.chatGrp, 'click', 'select chat from list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async verifyChatsVisibility() {
    await executeStep(this.chatIcon, 'click', 'click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.participantChatAll);
  }
  async createChat() {
    await executeStep(this.newChatIcon, 'click', 'click on new Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.searchChatUser, 'fill', 'enter user name to select', [
      indexPage.lighthouse_data.chatUser1
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant1, 'click', 'click on participant1');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant2, 'click', 'click on participant2');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.createChatButton, 'click', 'click on createChatButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async sendMessageAndVerifyDetails() {
    await executeStep(this.textArea, 'fill', 'enter the message from user1', [
      indexPage.lighthouse_data.firstMessage
    ]);
    await executeStep(this.sendMsg, 'click', 'click on send message');
    await executeStep(this.textArea, 'fill', 'enter the important message from user1', [
      indexPage.lighthouse_data.user1AlertMessage
    ]);
    await executeStep(this.alertImportant, 'click', 'click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'click on send icon');
    await assertElementVisible(this.user1TimeStamp);
  }
  async selectUser2() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(this.user1TimeStamp);
    await this.validateNotifications();
    await executeStep(this.textArea, 'fill', 'enter the message from user2', [
      indexPage.lighthouse_data.secondMessage
    ]);
    await executeStep(this.sendMsg, 'click', 'click on send message');
    await executeStep(this.textArea, 'fill', 'enter the message from user2', [
      indexPage.lighthouse_data.user2AlertMessage
    ]);
    await executeStep(this.alertImportant, 'click', 'click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'click on send Icon');
    await this.profileLogout();
  }
  async selectUser1() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.lighthouseEmail, process.env.lighthousePassword);
    await executeStep(this.chatIcon, 'click', 'click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.chatGrp, 'click', 'select chat from list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.user2TimeStamp);
  }
  async imageValidation() {
    const input = await this.insertFile;
    const user1Image = process.cwd() + '//images//lighthouse.png';
    await input.setInputFiles(user1Image);
    await executeStep(this.sendMsg, 'click', 'click on send message');
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(this.user1TimeStamp);
    const user2Image = process.cwd() + '//images//venue.png';
    await input.setInputFiles(user2Image);
    await executeStep(this.sendMsg, 'click', 'click on send message');
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.lighthouseEmail, process.env.lighthousePassword);
    await this.selectRecentChat();
    await assertElementVisible(this.user2TimeStamp);
    const user1ImpImage = process.cwd() + '//images//office.png';
    await input.setInputFiles(user1ImpImage);
    await executeStep(this.alertImportant, 'click', 'click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'click on send message');
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(this.user1TimeStamp);
    await executeStep(this.clickOnImg, 'click', 'click on image to check');
  }
};
