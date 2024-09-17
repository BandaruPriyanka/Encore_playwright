const { executeStep }=require( "../../utils/action");
const {assertElementVisible,assertElementContainsText}=require("../../utils/helper");
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
exports.FlowsheetCardAndTab =  class FlowsheetCardAndTab {
    constructor(page) {
        this.page = page;
        this.isMobile = this.page.context()._options.isMobile;
        this.searchInput = this.page.locator("//input[@name='search-field']");
        this.jobIdElement = (jobId) => this.page.locator(`//span[text()=' #`+jobId+` ']`);
        this.flowsheetDetailsDiv = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div");
        this.roomNameSpan = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/div/div[1]/span") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/span");
        this.orderNameSpan = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/div/div[2]//span") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/div/a/span/span[1]");
        this.customerNameSpan = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/div/div[3]//span") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/div/a/span");
        this.iconInPage = (iconText) => this.isMobile ?  this.page.locator(`//app-flowsheet-detail/div[1]/div[2]//app-mood-icon/icon[@class='`+iconText+`']`) 
                                            : this.page.locator(`//app-flowsheet-detail/div[1]/div[1]//app-mood-icon/icon[@class='`+iconText+`']`);
        this.comparisonIcon = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/app-comparison-icon/icon[@class='text-gray-500']") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/following-sibling::app-comparison-icon/icon[@class='text-gray-500']");
        this.greenColorCheckBox = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/app-comparison-icon/icon[@class='text-green-500']") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/following-sibling::app-comparison-icon/icon[@class='text-green-500']");
        this.touchPointElement = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[1]/app-mood-pia-chart") 
                                            :  this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/following-sibling::app-mood-pia-chart");
        this.flowsheetTabElement = (text) => this.page.locator(`//div[contains(text(),'`+text+`')]`);
        // C56910
        this.contactDiv = this.page.locator("//app-contact-list/ul/li[1]");
        this.contactName = this.page.locator("//app-contact-list/ul/li[1]/div[1]/div[2]/span[1]");
        this.textInModal = this.page.locator("//mat-bottom-sheet-container//ul/li");
    }


    // C56890
    async searchFunction(searchText) {
        await executeStep(this.searchInput,"fill","enter the job id",[searchText]);
    }

    async clickOnJob(jobId) {
        await executeStep(this.jobIdElement(jobId),"click","click the room div");
    }

    async validateRoomCard(roomName,orderName,customerName) {
        await assertElementVisible(this.flowsheetDetailsDiv);
        await assertElementContainsText(this.roomNameSpan,roomName);
        await assertElementContainsText(this.orderNameSpan,orderName);
        await assertElementContainsText(this.customerNameSpan,customerName);
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await assertElementVisible(this.iconInPage(utilConst.Const.moodIconText));
        try {
            await assertElementVisible(this.comparisonIcon);
        }catch (error) {
            await assertElementVisible(this.greenColorCheckBox);
        }
        await assertElementVisible(this.touchPointElement);
    }

    //C56910
    async clickOnContactAndValidate() {
        await executeStep(this.flowsheetTabElement(utilConst.Const.Contacts),"click","click on the contacts");
        await assertElementContainsText(this.contactName,indexPage.opportunity_data.userContactName);
        await executeStep(this.contactDiv,"click","click on first div from the list");
    }

}