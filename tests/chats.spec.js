const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertElementAttributeContains,
  clickRemindMeTomorrowButton
} = require('../utils/helper');

test.describe('Performing actions on Chat Search', () => {
  let chatpage, flowsheetPage, locationId, locationText;

  test.beforeEach(async ({ page }) => {
    chatpage = new indexPage.ChatPage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
  });

  test('Test_C56930: Verify chats search', async () => {
    await chatpage.clickOnChatIcon(indexPage.lighthouse_data.highlightedText);
    await assertElementVisible(
      chatpage.participantChatAll,
      `Verify that the "All Chats"  are visible`
    );
    await assertElementVisible(
      chatpage.searchChat_Field,
      `Verify that the "Search Chat Field" is visible`
    );
    await assertElementAttributeContains(
      chatpage.searchChat_Field,
      'placeholder',
      indexPage.lighthouse_data.ChatPlaceholder,
      `Verify that the Search Chat Field contains the placeholder text: "${indexPage.lighthouse_data.ChatPlaceholder}"`
    );
    await chatpage.verifyingSearchFieldWithData(
      indexPage.lighthouse_data.ChatRandomText,
      indexPage.lighthouse_data.ChatParticipantName,
      indexPage.lighthouse_data.ChatPhraseFromChat,
      indexPage.lighthouse_data.ChatCaseSentitiveData
    );
  });

  test('Test_C56931: Create New Chat / Add participant / Leave Chat', async () => {
    await chatpage.clickOnChatIcon(indexPage.lighthouse_data.highlightedText);
    await chatpage.createNewChat(indexPage.lighthouse_data.count);
    await chatpage.AddParticipants(
      indexPage.lighthouse_data.validParticipant,
      indexPage.lighthouse_data.ChatRandomText,
      indexPage.lighthouse_data.ChatGroupname,
      indexPage.lighthouse_data.noresultText
    );
    await chatpage.leaveChat();
  });
  test('Test_C56933: Verify chats messaging & notifications functionality', async () => {
    await chatpage.verifyChatsVisibility();
    await chatpage.createChat();
    await chatpage.sendMessageAndVerifyDetails();
    await chatpage.profileLogout();
    await chatpage.selectUser2();
    await chatpage.selectUser1();
    await chatpage.imageValidation();
    await clickRemindMeTomorrowButton(chatpage.page);
  });
});
