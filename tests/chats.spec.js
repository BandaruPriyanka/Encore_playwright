const { test, expect } = require("@playwright/test");
const indexPage = require("../utils/index.page");
const lighthouseData = require("../data/lighthouse.json");
const {
  assertElementVisible,
  assertElementAttributeContains,
} = require("../utils/helper");

test.describe("LightHouse Chat Search", () => {
  let chatpage;

  test.beforeEach(async ({ page }) => {
    chatpage = new indexPage.ChatPage(page);
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout),
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test("Test_C56930 verify Chats search", async ({ page }) => {
    chatpage = new indexPage.ChatPage(page);
    await chatpage.clickOnChatIcon(lighthouseData.highlightedText);
    await assertElementVisible(chatpage.participantChatAll);
    await assertElementVisible(chatpage.searchChat_Field);
    await assertElementAttributeContains(
      chatpage.searchChat_Field,
      "placeholder",
      lighthouseData.ChatPlaceholder
    );
    await chatpage.verifyingSearchFieldWithData(
      lighthouseData.ChatRandomText,
      lighthouseData.ChatParticipantName,
      lighthouseData.ChatPhraseFromChat,
      lighthouseData.ChatCaseSentitiveData
    );
  });

  test("Test_C56931 Create New Chat / Add participant / Leave Chat", async ({
    page,
  }) => {
    chatpage = new indexPage.ChatPage(page);
    await chatpage.clickOnChatIcon(lighthouseData.highlightedText);
    await chatpage.createNewChat(lighthouseData.count);
    await chatpage.AddParticipants(
      lighthouseData.validParticipant,
      lighthouseData.ChatRandomText,
      lighthouseData.ChatGroupname,
      lighthouseData.noresultText
    );
    await chatpage.leaveChat();
  });
});
