const { executeStep }=require( "../../utils/action");
const {assertElementVisible,assertElementContainsText,calculateTotalAmountAfterDiscount,formatCurrency}=require("../../utils/helper");
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
let beforeRoomCount
exports.FlowsheetCardAndTab =  class FlowsheetCardAndTab {
    constructor(page) {
        this.page = page;
        this.isMobile = this.page.context()._options.isMobile;
        this.searchInput = this.page.locator("//input[@name='search-field']");
        this.jobIdElement = (jobId) => this.page.locator(`//span[text()=' #`+jobId+` ']`);
        this.flowsheetDetailsDiv = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]") 
                                            : this.page.locator("//app-flowsheet-detail/child::div[1]");
        this.roomNameSpan = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[2]/div/div[1]/span") 
                                            : this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/span");
        this.orderNameSpan = this.isMobile ? this.page.locator("//span[@class='inline']") 
                                            : this.page.locator("//span[@class='font-semibold']");
        this.customerNameSpan = this.isMobile ? this.page.locator("//span[contains(@class,'e2e_flowsheet_detail_client')]") 
                                            : this.page.locator("//span[@class='font-semibold']/parent::span");
        this.iconInPage = (iconText) => this.isMobile ?  this.page.locator(`//app-flowsheet-detail/div[1]/div[2]//app-mood-icon/icon[@class='`+iconText+`']`) 
                                            : this.page.locator(`//app-flowsheet-detail/div[1]/div[1]//app-mood-icon/icon[@class='`+iconText+`']`);
        this.comparisonIcon = this.isMobile ? this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[2]") 
                                            : this.page.locator("(//app-comparison-icon/icon[@class='text-gray-500'])[1]");
        this.greenColorCheckBox = this.isMobile ? this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[2]") 
                                            : this.page.locator("(//app-comparison-icon/icon[@class='text-green-500'])[1]");
        this.touchPointElement = this.isMobile ? this.page.locator("//app-flowsheet-detail/div[1]/div[2]/div[1]/app-mood-pia-chart") 
                                            :  this.page.locator("//app-flowsheet-detail/div[1]/div[1]/div/div/following-sibling::app-mood-pia-chart");
        this.flowsheetTabElement = (text) => this.page.locator(`//div[contains(text(),'`+text+`')]`);
        // C56910
        this.contactDiv = this.page.locator("//app-contact-list/ul/li");
        this.contactName = (name) => this.page.locator(`//span[text()='`+name+`']`);
        this.textInModal = this.page.locator("//mat-bottom-sheet-container//ul/li");
        // C56895
        this.menuIcon = this.page.locator("//app-side-menu/div[1]//icon[@name='menu_line']");
        this.locationProfile = this.page.locator("//span[text()='Location Profile']");
        this.docusignValue =  this.isMobile ? this.page.locator("//div[contains(@class,'e2e_user_profile_docusign_value')]")
                                : this.page.locator("//span[@class='e2e_user_profile_docusign_value']");
        this.flowsheetBtn = this.isMobile ? this.page.locator("//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon")
                                :   this.page.locator("//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]");
        this.newAddOnRequestBtn = this.page.locator("//button[contains(text(),'New Add On Request')]");
        this.roomsCount = this.page.locator("//div[text()=' Rooms ']/following-sibling::div");
        this.addOnModalText = this.page.locator("//strong[contains(text(),'Add On Request')]");
        this.requestedByInput = this.page.locator("//input[@name='requestedBy']");
        this.searchProductInput = this.page.locator("//input[@placeholder='Product search...']");
        this.selectFirstProduct = this.page.locator("//div[@role='listbox']/mat-option[1]");
        this.quantityInput = this.page.locator("//div[@formarrayname='AddOnItems']/li[1]/div//input");
        this.firstProductDiv = this.page.locator("//div[@formarrayname='AddOnItems']/li[1]/div");
        this.quantityInvalidMsg = this.page.locator("//span[contains(text(),'please enter valid quantity')]");
        this.discountInput = this.page.locator("//input[@formcontrolname='discountPercentage']");
        this.discountInvalidMsg = this.page.locator("//mat-tooltip-component//div[text()='Discount allowed values 1-25']");
        this.moneyElement = this.page.locator("//span[text()='Estimated Daily']/parent::p");
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
        await assertElementVisible(this.contactName(indexPage.opportunity_data.userContactName))
        await executeStep(this.contactDiv,"click","click on first div from the list");
    }

    // C56895
    async verifyDocusignStatus(docusign,searchText,jobId) {
        await executeStep(this.menuIcon,"click","click menu icon");
        await executeStep(this.locationProfile,"click","click location profile in menu");
        await assertElementContainsText(this.docusignValue,docusign);
        await executeStep(this.flowsheetBtn,"click","click on flowsheet button")
        beforeRoomCount = await this.roomsCount.textContent();
        await this.searchFunction(searchText);
        await this.page.waitForTimeout(parseInt(process.env.small_timeout))
        await this.clickOnJob(jobId);
        await executeStep(this.flowsheetTabElement(utilConst.Const.Add_Ons),"click","click on add ons in flowsheet tabs");
        await assertElementVisible(this.newAddOnRequestBtn);
    }

    async addOnFunction(requestedBy,individualProduct,packageProduct,invalidQuantity,validQuantity,invalidDiscount) {
        await executeStep(this.newAddOnRequestBtn,"click","click on new add-on request button");
        await assertElementVisible(this.addOnModalText);
        await executeStep(this.requestedByInput,"fill","Enter the username",[requestedBy]);
        // await executeStep(this.searchProductInput,"click","click search input");
        await executeStep(this.searchProductInput,"fill","enter  the individual product",[individualProduct]);
        await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
        await executeStep(this.selectFirstProduct,"click","select the first product from  individual products");
        // await executeStep(this.searchProductInput,"click","click search input");
        await executeStep(this.searchProductInput,"fill","enter  the package product",[packageProduct]);
        await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
        await executeStep(this.selectFirstProduct,"click","select the first product from  package products");
        await executeStep(this.quantityInput,"fill","clear the quantity",[""]);
        await executeStep(this.quantityInput,"fill","enter the invalid qunatity",[invalidQuantity]);
        try {
            await assertElementVisible(this.quantityInvalidMsg);
        }catch (error) {
            await executeStep(this.quantityInput,"fill","clear the quantity",[""]);
            await executeStep(this.quantityInput,"fill","enter the invalid qunatity",[validQuantity]);
        }
        await executeStep(this.discountInput,"fill","enter the discount percentage",[invalidDiscount]);
        await this.discountInput.hover();
        await assertElementVisible(this.discountInvalidMsg); //ui its working
    }

    async discountChecking(validDiscount) {
        await executeStep(this.discountInput,"fill","clear the discount input",[""]);
        await executeStep(this.discountInput,"fill","enter the valid discount",[validDiscount]);
        const estimatedMoneyBeforeDiscount  =await this.moneyElement.textContent();
        const originalPrice = parseFloat(estimatedMoneyBeforeDiscount.replace(/[^0-9.]/g, ''));
        await executeStep(this.discountInput,"fill","enter the valid discount",[validDiscount]);
        const discountPrice = formatCurrency(calculateTotalAmountAfterDiscount(originalPrice,validDiscount));
        await assertElementContainsText(this.moneyElement,discountPrice);
        //add complimentary code
    }

}