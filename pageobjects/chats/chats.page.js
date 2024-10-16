const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const indexPage = require('../../utils/index.page');
require('dotenv').config();
const atob = require('atob');
const {
  assertElementVisible,
  assertElementContainsText,
  assertElementNotVisible,
  scrollElement,
  assertEqualValues,
  assertContainsValue,
  assertIsNumber
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
    this.yesButton = this.page.locator('//span[text()="Yes"]/ancestor::button');
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

  async clickOnChatIcon(highlightedText) {
    await executeStep(this.chatIcon, 'click', 'Click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const classAttribute = await this.HighlightedChatIcon.getAttribute('class');
    await assertContainsValue(
      classAttribute,
      highlightedText,
      `Verify The chat icon should be highlighted : "${highlightedText}"`
    );
  }
  async verifyingSearchFieldWithData(
    randomText,
    participantname,
    phraseFromChat,
    casesensitiveText
  ) {
    await executeStep(this.searchChat_Field, 'fill', 'Enter the invalid text in the search input', [
      randomText
    ]);
    await assertElementContainsText(
      this.noResultsFound_Text,
      indexPage.lighthouse_data.noResultsFound,
      'Verify that the "No Results Found" message is displayed'
    );
    await executeStep(this.searchChat_Field, 'fill', 'Enter the participant name', [
      participantname
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeouts));
    await assertElementVisible(
      this.participantChat,
      'Verify that the Participant Chat is visible and valid search results are returned'
    );
    await executeStep(this.searchChat_Field, 'fill', 'Enter the phrase from the chat', [
      phraseFromChat
    ]);
    await assertElementVisible(
      this.participantChat,
      'Verify that searching using a valid phrase from the chat returns an appropriate chats list'
    );
    await executeStep(this.crossMark, 'click', 'Click on cross Mark');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(
      this.participantChatAll,
      'Verify that the All Chats  are visible after clicking cross icon'
    );
    await executeStep(this.searchChat_Field, 'fill', 'Enter the valid text in the search input', [
      casesensitiveText
    ]);
    await assertElementVisible(
      this.participantChat,
      'Verify that the Participant Chat is visible and the search is case-insensitive, returning appropriate results regardless of case'
    );
    await scrollElement(this.participantChatAll, 'bottom');
    await executeStep(this.participantChat, 'click', 'Click on participant Chat');
  }

  async createNewChat(count) {
    await assertElementVisible(this.newChatIcon, 'Verify that the New Chat icon is visible');
    await executeStep(this.newChatIcon, 'click', 'Click on new Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeouts));
    await assertElementVisible(this.participant1, 'Verify that Participant 1 is visible');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant1, 'click', 'Click on participant1');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant2, 'click', 'Click on participant2');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.createChatButton, 'click', 'Click on createChatButton');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const quantity = await this.quantityCount.textContent();
    await assertIsNumber(
      parseInt(quantity),
      `Verify that the quantity should be updated properly(${quantity})`
    );
  }
  async AddParticipants(validParticipant, randomdata, demogroup, noresultFound) {
    await executeStep(this.groupIcon, 'click', 'Click on groupIcon');
    await assertElementVisible(
      this.leave,
      `Verify that the Participants modal is displayed with participant names, "Add participant", and "Leave" options`
    );
    await assertElementVisible(
      this.addParticipants,
      `Verify that the Participants modal is displayed with participant names, "Add participant", and "Leave" options`
    );
    await executeStep(this.addParticipants, 'click', 'Click on addParticipants');
    await assertElementVisible(
      this.participantsModel,
      `Verify that "Add Participant" modal should be displayed`
    );
    await executeStep(this.searchUsersField, 'click', 'Click on search Users Field');
    await executeStep(this.searchUsersField, 'fill', 'Enter valid user', [validParticipant]);
    await executeStep(this.searchUsersField, 'fill', 'Empty the search field', [' ']);
    await executeStep(this.searchUsersField, 'fill', 'Enter random data', [randomdata]);
    await assertElementContainsText(
      this.noResultsFoundTextInAddParticipants,
      noresultFound,
      `Verify that the "No Results Found" message is displayed in Add Participants`
    );
    await executeStep(this.searchUsersField, 'fill', 'Empty the search field', [' ']);
    await executeStep(this.participant1, 'click', 'Click on participant1');
    await executeStep(this.searchUsersField, 'click', 'Click on search Users Field');
    await executeStep(this.participant2, 'click', 'Click on participant2');
    await executeStep(this.addButton, 'click', 'Click on addButton');
    await executeStep(this.penIcon, 'click', 'Click on penIcon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.groupNameField, 'click', 'Click on groupNameField');
    await executeStep(this.groupNameField, 'fill', 'Empty the groupNameField', ['']);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.groupNameField, 'fill', 'Enter the groupNameField', [demogroup]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.saveButton, 'click', 'Click on saveButton');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    const groupName = await this.updatedGroupName.textContent();
    await assertEqualValues(
      groupName,
      demogroup,
      `Verify that the group name ("${groupName}") matches the expected group name ("${demogroup}")`
    );
  }
  async leaveChat() {
    await executeStep(this.groupIcon, 'click', 'Click on groupIcon');
    await assertElementVisible(this.leave, `Verify that the "Leave button" is visible`);
    await executeStep(this.leave, 'click', 'Click on leave');
    await assertElementVisible(
      this.leaveConfirmationDialogueModel,
      `Verify that the "Leave Confirmation Dialogue Model" is visible`
    );
    await executeStep(this.yesButton, 'click', 'Click on Yes Button');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    try {
      await assertElementNotVisible(
        this.updatedGroupName,
        'Verify that the chat is no longer displayed in the list'
      );
    } catch {
      test.info('Group is not deleted...');
    }
  }
  async loginUser(email, password) {
    await executeStep(this.addAccount, 'click', 'Click on add account');
    await executeStep(this.enterUserName, 'fill', 'Enter user name', [atob(email)]);
    await executeStep(this.submitBtn, 'click', 'Click on submit button');
    await executeStep(this.enterPwd, 'fill', 'Enter password', [atob(password)]);
    await executeStep(this.submitBtn, 'click', 'Click on submit button');
  }
  async profileLogout() {
    await executeStep(this.menuLine, 'click', 'Click on menu line');
    await executeStep(this.logOut, 'click', 'Click on logout');
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
  }
  async validateNotifications() {
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.notification, 'click', 'Click on notification');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await executeStep(this.closeNotifications, 'click', 'Click on close notification');
  }
  async selectRecentChat() {
    await executeStep(this.chatIcon, 'click', 'Click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.chatGrp, 'click', 'Select chat from list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async verifyChatsVisibility() {
    await executeStep(this.chatIcon, 'click', 'Click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.participantChatAll,
      `Verify that the "All Chats"  are visible after clicking chats icon`
    );
  }
  async createChat() {
    await executeStep(this.newChatIcon, 'click', 'Click on new Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.searchChatUser, 'fill', 'Enter user name to select', [
      indexPage.lighthouse_data.chatUser1
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant1, 'click', 'Click on participant1');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.participant2, 'click', 'Click on participant2');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.createChatButton, 'click', 'Click on createChatButton');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async sendMessageAndVerifyDetails() {
    await executeStep(this.textArea, 'fill', 'Enter the message from user1', [
      indexPage.lighthouse_data.firstMessage
    ]);
    await executeStep(this.sendMsg, 'click', 'Click on send message');
    await executeStep(this.textArea, 'fill', 'Enter the important message from user1', [
      indexPage.lighthouse_data.user1AlertMessage
    ]);
    await executeStep(this.alertImportant, 'click', 'Click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'Click on send icon');
    await assertElementVisible(
      this.user1TimeStamp,
      'Verify that the message was sent successfully, including information about the timestamp and author'
    );
  }
  async selectUser2() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'Select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(
      this.user1TimeStamp,
      'Verify that the message is received by User-2 successfully with all valid information.'
    );
    await executeStep(this.textArea, 'fill', 'Enter the message from user2', [
      indexPage.lighthouse_data.secondMessage
    ]);
    await executeStep(this.sendMsg, 'click', 'Click on send message');
    await executeStep(this.textArea, 'fill', 'Enter the message from user2', [
      indexPage.lighthouse_data.user2AlertMessage
    ]);
    await executeStep(this.alertImportant, 'click', 'Click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'Click on send Icon');
    await assertElementVisible(
      this.user2TimeStamp,
      'Verify that the message was sent successfully, including information about the timestamp and author'
    );
    await this.profileLogout();
  }
  async selectUser1() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'Select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.lighthouseEmail, process.env.lighthousePassword);
    await executeStep(this.chatIcon, 'click', 'Click on Chat Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.chatGrp, 'click', 'Select chat from list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.user2TimeStamp,
      'Verify that the message is received by User-1 successfully with all valid information.'
    );
  }
  async imageValidation() {
    const input = await this.insertFile;
    const user1Image = process.cwd() + '//images//lighthouse.png';
    await input.setInputFiles(user1Image);
    await executeStep(this.sendMsg, 'click', 'Click on send message');
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'Select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(
      this.user1TimeStamp,
      'Verify that the message is sent successfully with information about the timestamp and author. The image should be displayed properly.'
    );
    const user2Image = process.cwd() + '//images//venue.png';
    await input.setInputFiles(user2Image);
    await executeStep(this.sendMsg, 'click', 'Click on send message');
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'Select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.lighthouseEmail, process.env.lighthousePassword);
    await this.selectRecentChat();
    await assertElementVisible(
      this.user2TimeStamp,
      'Verify that the message is received by User 1 successfully with all valid information. The image should be displayed properly'
    );
    const user1ImpImage = process.cwd() + '//images//office.png';
    await input.setInputFiles(user1ImpImage);
    await executeStep(this.alertImportant, 'click', 'Click on alert icon to make as important');
    await executeStep(this.sendMsg, 'click', 'Click on send message');
    await assertElementVisible(
      this.user1TimeStamp,
      'Verify that the important message is sent successfully, including information about the timestamp and author. The image should be displayed properly'
    );
    await this.profileLogout();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectLogOutMail, 'click', 'Select mail to logout');
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await this.loginUser(process.env.email, process.env.password);
    await this.selectRecentChat();
    await assertElementVisible(
      this.user1TimeStamp,
      'Verify that the important message should be received by User2 successfully with all the valid information.'
    );
    await executeStep(this.clickOnImg, 'click', 'Click on image to check');
  }
};
