const { executeStep }=require( "../../utils/action");
const {assertElementVisible,todayDate,nextDayDate,scrollElement, assertEqualValues}=require("../../utils/helper");
const utilConst = require('../../utils/const');
const indexPage = require('../../utils/index.page');
const { waitForDebugger } = require("inspector");
require("dotenv").config();

exports.CustomersPage = class CustomersPage {
    constructor(page) {
        this.page = page;
        this.isMobile = this.page.context()._options.isMobile;
        this.customersIcon = this.isMobile ? this.page.locator("//app-mobile-navigation//div[1]/app-mobile-navigation-item//icon")
                                : this.page.locator("//app-desktop-navigation//app-navigation-item[3]//span[contains(text(),Customers)]");
        this.listOfCustomers = this.page.locator("app-customer-card");
        this.customerSearchInput = this.page.locator("//input[@placeholder='Search Customers']");
        this.noDataPlaceholder = this.page.locator("//span[contains(text(),'No data found')]");
        this.customerDiv = this.page.locator("//div[@class='flex']/child::div[1]");
        this.customerLi = this.page.locator("//div[text()='Angelina Wood']");
        this.dateSpan = (date) => this.page.locator(`//span[text()='`+date+`']`);
        this.crossIcon = this.page.locator("//icon[@name='cross_line']");
    }

    async search(searchText) {
        await executeStep(this.customerSearchInput,"fill","enter the customer name",[searchText]);
    }

    //C56920
    async clickOnCustomerIcon() {
        await executeStep(this.customersIcon,"click","click customer icon")
    }
    
    async dateChangeChecking() {
        const inputValueBeforeDateChange = await this.customerSearchInput.inputValue();
        await executeStep(this.dateSpan(nextDayDate()),"click","click next day");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        const inputValueAfterDateChange = await this.customerSearchInput.inputValue();
        await assertEqualValues(inputValueBeforeDateChange,inputValueAfterDateChange);
        await executeStep(this.dateSpan(todayDate()),"click","click today date");
    }

    async scrollAction() {
        const div = await this.customerDiv;
        await scrollElement(div, "bottom");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        await scrollElement(div, "top");
    }

    async searchFunctionality() {
        const beforeCustomerCount = await this.listOfCustomers.count();
        await this.search(indexPage.lighthouse_data.invalidText);
        await assertElementVisible(this.noDataPlaceholder);
        await this.search(indexPage.opportunity_data.userContactName);
        await assertElementVisible(this.customerLi);
        await this.dateChangeChecking();
        await executeStep(this.crossIcon,"click","clear the search input");
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        const afterCustomerCount = await this.listOfCustomers.count();
        await assertEqualValues(beforeCustomerCount,afterCustomerCount);
        await this.scrollAction();
        await this.search(indexPage.opportunity_data.userContactName.toLowerCase());
        const customerCount_lowerCase = await this.listOfCustomers.count();
        await this.search(indexPage.opportunity_data.userContactName.toUpperCase());
        await this.page.waitForTimeout(parseInt(process.env.small_timeout));
        const customerCount_upperCase = await this.listOfCustomers.count();
        await assertEqualValues(customerCount_lowerCase,customerCount_upperCase);
    }
}