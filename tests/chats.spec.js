const { test, expect } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const lighthouseData = require('../data/lighthouse.json');
const { assertElementVisible, assertElementAttributeContains } = require('../utils/helper');

test.describe('LightHouse Chat Search', () => {
  let chatpage,flowsheetPage;

  test.beforeEach(async ({ page }) => {
    chatpage = new indexPage.ChatPage(page);
    flowsheetPage  = new indexPage.FlowSheetPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C56930 verify Chats search', async ({ page }) => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await chatpage.clickOnChatIcon(indexPage.lighthouse_data.highlightedText);
    await assertElementVisible(chatpage.participantChatAll);
    await assertElementVisible(chatpage.searchChat_Field);
    await assertElementAttributeContains(
      chatpage.searchChat_Field,
      'placeholder',
      lighthouseData.ChatPlaceholder
    );
    await chatpage.verifyingSearchFieldWithData(
      indexPage.lighthouse_data.ChatRandomText,
      indexPage.lighthouse_data.ChatParticipantName,
      indexPage.lighthouse_data.ChatPhraseFromChat,
      indexPage.lighthouse_data.ChatCaseSentitiveData
    );
  });

  test('Test_C56931 Create New Chat / Add participant / Leave Chat', async ({ page }) => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData2,indexPage.lighthouse_data.locationText_createData2);
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
  test.skip('Test_C56933	verify chats messaging & notifications functionality', async ({ page }) => {
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1,indexPage.lighthouse_data.locationText_createData1);
    await chatpage.verifyChatsVisibility();
    await chatpage.createChat();
    await chatpage.sendMessageAndVerifyDetails();
    await chatpage.profileLogout();
    await chatpage.selectUser2();
  });
});

 
  
  
  