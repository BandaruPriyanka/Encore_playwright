const { executeStep } = require('../../utils/action');
const indexPage = require('../../utils/index.page');
const utilConst = require('../../utils/const');
const { test} = require('@playwright/test');
const fs = require('node:fs/promises');
const{
    nextDayDate,
    assertElementVisible,
    assertEqualValues,
    generateRandomNote,
    assertContainsValue
   
}=require('../../utils/helper');
let addedNoteInLogs,addedMoodMsgLogs;
exports.LogsPage= class LogsPage{
    constructor(page){
        this.page=page;
        this.isMobile = this.page.context()._options.isMobile;
        this.menuIcon = this.page.locator('//app-side-menu');
        this.logsTab=this.page.locator("//span[normalize-space()='Logs']");
        this.dateElement = date => this.page.locator(`//span[text()='${date}']`);
        this.emptyState= this.page.locator("//span[normalize-space()='No data found']");
        this.logsInLogsTab=this.page.locator("//div[contains(@class,'e2e_side_menu_link_location')]//span[contains(text(),'Logs')]");
        this.flowsheetIcon = this.isMobile
                ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
                : this.page.locator("//app-navigation-item//span[normalize-space()='Flowsheet']");
        this.flowsheetARoomName=this.page.locator("//app-flowsheet-action-card[1]//div[contains(@class,'e2e_flowsheet_action_room_name')]");
        this.flowsheetA=this.page.locator("//app-flowsheet-action-card[1]//span[contains(@class,'e2e_flowsheet_action_job_number')]");
        this.moodChooserIcon = this.isMobile
        ? this.page.locator(
            "(//app-mood-icon[contains(@class,' e2e_flowsheet_detail_mood_chooser')])[2]"
          )
        : this.page.locator(
            "(//app-mood-icon[contains(@class,' e2e_flowsheet_detail_mood_chooser')])[1]"
          );
      this.happyIcon = this.page.locator(
        "//app-room-mood-chooser//app-mood-icon//icon[@class='text-green-500']"
      );
      this.submitButton = this.page.locator("//span[contains(text(),'Submit')]/ancestor::button");
      this.backArrow = this.page.locator('//icon[contains(@class,"e2e_flowsheet_detail_back")]');
      this.logsFlowsheetA= this.page.locator("//app-note-group[1]//div[contains(@class,'e2e_chat_group_card')]//div//div[2]/div[1]");
      this.flowsheetBRoomName=this.page.locator("//app-flowsheet-action-card[2]//div[contains(@class,'e2e_flowsheet_action_room_name')]");
      this.flowsheetCardB=this.page.locator("//app-flowsheet-action-card[2]//span[contains(@class,'e2e_flowsheet_action_job_number')]");
      this.logsFlowsheetB= this.page.locator("//app-note-group[2]//div[contains(@class,'e2e_chat_group_card')]//div//div[2]/div[1]");
      this.searchInput = this.page.locator("//input[@name='search-field']");
      this.flowsheetCard = this.page.locator(
        "(//app-flowsheet-action-card[@class='e2e_flowsheet_action_card ng-star-inserted'])[1]"
      );
      this.statusSetRefreshComplete = this.page.locator(
        "//app-select-status-sheet//li[.//span[text()='Set Refresh - Complete']]"
      );
      this.statusSetComplete=this.page.locator("//app-select-status-sheet//li[.//span[text()='Set - Complete']]");
      this.cancelButton = this.page.locator("//span[text()=' Close ']");
      this.timeLine = this.page.locator("(//app-flowsheet-action-timeline)[1]");
      this.carryOver = this.page.locator("(//span[normalize-space()='Carry Over'])[2]");
      this.statusSetRefresh = this.page.locator(
        "//app-select-status-sheet//li[.//span[text()='Set Refresh']]"
      );
      this.greenIcon = this.isMobile
      ? this.page.locator(
          "(//app-flowsheet-action-timeline)[1]//div[contains(@class,'e2e_flowsheet_action_timeline_event')][1]//icon[contains(@class,'text-green-500')]"
        )
      : this.page.locator(
          "(//app-flowsheet-action-timeline//div[contains(@class, 'flowsheet-action-timeline')]//div[contains(@class, 'e2e_flowsheet_action_timeline_event')][1]//icon[contains(@class, 'text-green-500')])[1]"
        );
      this.logsFlowsheetB= this.page.locator("//app-note-group[1]//div[contains(@class,'e2e_chat_group_card')]//div//div[2]/div[1]");
      this.flowsheetC=this.page.locator("//app-flowsheet-action-card[5]//span[contains(@class,'e2e_flowsheet_action_job_number')]");  
      this.logsTabInFlowsheet=this.page.locator("//div[contains(@class,'e2e_flowsheet_detail_tab_log')]");
      this.newNoteInput=this.page.locator("//input[contains(@class,'e2e_room_chat_input')]");
      this.sendChatIcon=this.page.locator("//icon[contains(@class,'e2e_room_chat_send')]");
      this.addedNote=this.page.locator("//div[contains(@class,'e2e_message_card_comment')]");
      this.logsFlowsheetC=this.page.locator("//app-note-group[1]//div[contains(@class,'e2e_chat_group_card')]//div//div[2]/div[1]");
      this.noteInLogs=this.page.locator("//div[contains(@class,'e2e_message_card_comment')]");
 
      this.allFlowsheetsInLogs=this.page.locator("//app-note-group");
      this.moodChangeMessage=this.page.locator("//div[contains(text(),'Happy Room Mood')]");
      this.flowsheetCard=this.page.locator("//span[contains(@class,'e2e_flowsheet_action_job_number')]");
      this.logsChatBackArrow=this.page.locator("//icon[contains(@class,'e2e_chat_group_back')]");
    }
    async navigateToLogs(){
        await executeStep(this.menuIcon,'click','Click on Menu Icon');
        await executeStep(this.logsTab,'click','Click on Logs Tab');
    }
    async reopenLogsTab(){
        await executeStep(this.menuIcon,'click','Click on Menu Icon');
        await executeStep(this.logsInLogsTab,'click','Click on Logs Tab');
    }
    async searchJobNo(){
      await executeStep(this.searchInput,'fill','Enter the Second job number',[indexPage.navigator_data.second_job_no_createData2]);
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    async checkLogDefaultState(){
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.dateElement(nextDayDate()), 'click', 'Select tomorrow date');
        await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
        await assertElementVisible(this.emptyState,'Verify default empty state at start of the day and proper updates after interaction');
        await this.reopenLogsTab();
        await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
        await this.flowsheetAMoodChange();
    }
    async moodChange(){
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await executeStep(this.moodChooserIcon, 'click', 'Click on mood chooser icon');
        await executeStep(this.happyIcon, 'click', 'Click on happy icon');
        await executeStep(this.submitButton, 'click', 'Click on submit button');
        if (this.isMobile) {
          await executeStep(this.backArrow, 'click', 'Click on back arrow button');
        }
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    async flowsheetAMoodChange(){
        await executeStep(this.flowsheetIcon,'click','Click on Flowsheet Icon');
        await this.searchJobNo();
        const RoomName=await this.flowsheetARoomName.textContent();
        const flowsheetARoomName= await RoomName.trim();
        await executeStep(this.flowsheetA,'click','Click on Flowsheet Card A');
        await this.moodChange();
        await this.reopenLogsTab();
    }
    async flowsheetALogsState(){
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await this.page.reload();
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      const flowsheetsCount=await this.allFlowsheetsInLogs.count();
      if (flowsheetsCount > 0) {
        await this.allFlowsheetsInLogs.nth(flowsheetsCount - 1).click();
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      }
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      const notesInLogsCount=await this.noteInLogs.count();
      if(notesInLogsCount>0){
        addedMoodMsgLogs=  await this.noteInLogs.nth(notesInLogsCount-1).textContent();
      }
      await assertContainsValue(addedMoodMsgLogs,utilConst.Const.moodChangeMessage,'MoodChanged Message should be same');
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      if(this.isMobile){
        await executeStep(this.logsChatBackArrow,'click','Click on Back Arrow in logs chat');
      }
    }
    async flowsheeetBSetStatus(){
        await executeStep(this.flowsheetIcon,'click','Click on Flowsheet Icon');
        if(this.isMobile){
          await this.page.waitForTimeout(parseInt(process.env.small_timeout));
          await this.page.reload();
          await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
        }
        await this.searchFunctionality();
        if(this.isMobile){
          await this.page.reload();
        }
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
        await this.navigateToLogs();
        await this.page.reload();
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
        const logsRoomName=await this.logsFlowsheetB.textContent();
        const logsBRoomName= await logsRoomName.trim();
        const flowsheetsCount=await this.allFlowsheetsInLogs.count();
        if (flowsheetsCount > 0) {
          await this.allFlowsheetsInLogs.nth(flowsheetsCount - 1).click();
          await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      }
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      const notesInLogsCount=await this.noteInLogs.count();
      if(notesInLogsCount>0){
        addedNoteInLogs=  await this.noteInLogs.nth(notesInLogsCount-1).textContent();
      }
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    }
    async searchFunctionality(){
        await executeStep(this.searchInput,'fill','Enter the Second job number',[indexPage.navigator_data.second_job_no_createData2]);
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        let RoomName=await this.flowsheetARoomName.textContent();
        let flowsheetARoomName= RoomName.trim();
        indexPage.lighthouse_data.flowsheetBRoomName=flowsheetARoomName;
        await fs.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
        await this.flowsheetCard.hover();
        await this.flowsheetCard.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
        await this.setStatus();
    }
    async setStatus() {
        await executeStep(this.timeLine, 'click', 'Click the status button', []);
        const statusOption = await this.statusSetRefreshComplete.isVisible()|await this.statusSetComplete.isVisible()
        if (statusOption) {
          if(await this.statusSetRefreshComplete.isVisible()){
          await executeStep(
            this.statusSetRefreshComplete,
            'click',
            'Click the statusSetRefreshComplete button',
            []
          );}
          if(await this.statusSetComplete.isVisible()){
            await executeStep(this.statusSetComplete,'click','Click on the status Set-Complete Button');
          }
          await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
          await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
          await test.step('Verify that the set status is Set Refresh Complete',async()=>{
            await assertElementVisible(this.greenIcon,'Verify that the Set Status should be changed');
          })
        } else {
          await executeStep(this.cancelButton, 'click', 'Click on cancel button', []);
        }
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    async addTestNoteOnLogs(){
      if(this.isMobile){
        await executeStep(this.logsChatBackArrow,'click','Click on Back Arrow in logs chat');
      }
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
 
      await executeStep(this.flowsheetIcon,'click','Click on Flowsheet Icon');
      await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
      if(this.isMobile){
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      }
      await this.searchJobNo();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.flowsheetCard,'click','Click on Flowsheet C');
      await executeStep(this.logsTabInFlowsheet,'click','Click on Logs Tab');
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      const newNote= await generateRandomNote();
      await executeStep(this.newNoteInput,'fill','Enter new Note Text',[newNote]);
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await executeStep(this.sendChatIcon,'click','Click on Send icon');
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      if(this.isMobile){
        await executeStep(this.backArrow,'click','Click on back arrow');
      }
      await this.navigateToLogs();
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      const flowsheetsCount=await this.allFlowsheetsInLogs.count();
      if (flowsheetsCount > 0) {
        await this.allFlowsheetsInLogs.nth(flowsheetsCount - 1).click();
        await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      }
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
      const notesInLogsCount=await this.noteInLogs.count();
      if(notesInLogsCount>0){
        addedNoteInLogs=  await this.noteInLogs.nth(notesInLogsCount-1).textContent();
      }
      await assertEqualValues(newNote,addedNoteInLogs,'added Note should be same');
      await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    }
}