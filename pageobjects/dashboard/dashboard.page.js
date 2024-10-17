const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
const {
    assertElementVisible,
    assertElementNotVisible,
    assertEqualValues,
    assertElementContainsText,
    getWeekStartDate,
    getLastWeekStartDate,
    getLastMonthStartDate,
  } = require('../../utils/helper');
const  indexPage  = require('../../utils/index.page');
require('dotenv').config();

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.dashboardBtn = this.page.locator("//span[normalize-space()='Dashboard']//parent::div");
    this.addWidgetBtn = this.isMobile?this.page.locator("(//a[normalize-space()='+ Add Widget'])[2]"):this.page.locator("(//a[normalize-space()='+ Add Widget'])[1]");
    this.additionsCaptureSelectBtn = this.page.locator("//span[normalize-space()='Additions Captured']/following-sibling::span[normalize-space()='Select']");
    this.applyBtn = this.page.locator("//button[normalize-space()='Apply']");
    this.checkLineIcon = this.page.locator("//icon[@name='check_line']");
    this.additionsCapturedWidget = this.isMobile?this.page.locator("(//app-additions-captured)[2]//div[normalize-space()='Additions Captured']"):this.page.locator("(//app-additions-captured)[1]//div[normalize-space()='Additions Captured']");
    this.myWidgetTxt = this.page.locator("//span[normalize-space()='My Widgets']");
    this.dateSelect = this.isMobile ? this.page.locator("(//select[@formcontrolname='datePeriod'])[2]")
            : this.page.locator("(//select[@formcontrolname='datePeriod'])[1]");
    this.startDateRangeInput = this.isMobile ? this.page.locator("(//input[@formcontrolname='startDate'])[2]//following-sibling::span")
            : this.page.locator("(//input[@formcontrolname='startDate'])[1]//following-sibling::span");
    this.flowsheetBtn = this.isMobile ? this.page.locator('//app-mobile-navigation//div[3]/app-mobile-navigation-item//icon')
            : this.page.locator('//app-desktop-navigation//app-navigation-item[1]//span[contains(text(),Flowsheet)]');
    this.newAddOnRequestBtn = this.page.locator("//button[normalize-space()='New Add On Request']");
    this.requestedByInput = this.page.locator("//input[@name='requestedBy']");
    this.searchProductInput = this.page.locator("//input[@placeholder='Product search...']");
    this.selectFirstProduct = this.page.locator("//div[@role='listbox']/mat-option[1]");
    this.quantityInput = this.page.locator("//div[@formarrayname='AddOnItems']/li[1]/div//input");
    this.textOfEquipment = this.page.locator("//span[contains(@class,'e2e_add_on_request_product_name')]");
    this.nextButton = this.page.locator("//span[text()='Next']");
    this.selectFirstDate = this.page.locator("//form//ul/div/li[1]//span[contains(text(),'select')]");
    this.selectSecondDate = this.page.locator("//form//ul/div/li[2]//span[contains(text(),'select')]");
    this.reviewOrderBtn = this.page.locator("//span[text()='Review Order']");
    this.sendToNavigatorBtn = this.page.locator("//span[text()='Send to Navigator']");
    this.productInWidget = (equipment) =>  this.isMobile ? this.page.locator(`(//div[text()='${equipment}'])[2]`)
                : this.page.locator(`(//div[text()='${equipment}'])[1]`);
    this.addOnBtn = this.page.locator("//div[contains(text(),'Add Ons')]");
    this.discountInput = this.page.locator("//input[@formcontrolname='discountPercentage']");
    this.backBtnInMobile = this.page.locator("//icon[contains(@class,'e2e_flowsheet_detail_back')]");
  }

  async navigateToDashboard(){
    await executeStep(this.menuIcon, 'click', 'Click on Menu Icon');
    await executeStep(this.dashboardBtn, 'click', 'Click on Dashboard Tab');
  }

  async addingWidgets(){
    await assertElementVisible(this.addWidgetBtn, "Verify the 'Dashbaord' page should be opened");
    try{
        await assertElementNotVisible(this.additionsCapturedWidget, "Verify the default state of the Dashboard page");
    }
    catch{
        await test.step("Cleaning the Existing Dashboard to perform the creation flow", async () => {
            await this.removeWidgets();
        });
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.addWidgetBtn, 'click', "Click on 'Add widget' link");
    await assertElementVisible(this.additionsCaptureSelectBtn, "Verify widget selection modal should be displayed");
    await executeStep(this.additionsCaptureSelectBtn, 'click', "Select 'Additions Captured' widget ");
    await executeStep(this.applyBtn,'click', "click 'Apply' button");
    await assertElementVisible(this.additionsCapturedWidget, "Verify 'Additions Captured' widget should be added to the Dashboard");
    await test.step('Refresh the page', async () => {
        await this.page.reload();
    });
    await assertElementVisible(this.additionsCapturedWidget, "Verify 'Additions Captured' widget is still displayed on the Dashboard");
  }

  async removeWidgets(){
    await assertElementVisible(this.additionsCapturedWidget, "Verify  'Additions Captured' widget is displayed properly");
    await executeStep(this.addWidgetBtn,'click', "Click on '+ Add Widget'");
    await assertElementVisible(this.myWidgetTxt, "Verify My widgets modal should be displayed");
    await executeStep(this.checkLineIcon,'click', "Click on the green checkmark to de-select 'Additions");
    await assertElementVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should be de-selected");
    await executeStep(this.applyBtn,'click', "Click on 'Apply' button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementNotVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should be removed successfully from the Dashboard page.");
    await test.step('Refresh the page', async () => {
        await this.page.reload();
    });
    await assertElementNotVisible(this.additionsCaptureSelectBtn, "Verify the 'Additions Captured' widget should NOT be displayed on the Dashboard page.");
  }

  async assertWidget() {
    if(await this.additionsCapturedWidget.isVisible()) {
      await assertElementVisible(this.additionsCapturedWidget,"Verify that addition capture widget is visible");
    }else {
      await this.addingWidgets()
    }
  }

  async assertElementsInWidgets() {
    const selectedOption = await this.dateSelect.locator('option:checked').textContent();
    await assertEqualValues(selectedOption,indexPage.lighthouse_data.currentWeek,"Verify that the current week should be selected by default.");
    await assertElementContainsText(this.startDateRangeInput,getWeekStartDate(),"Verify exact dates should be displayed properly.");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step('Verify that valid results should be returned for each time slot.' , async () => {
      await this.dateSelect.selectOption({ label : indexPage.lighthouse_data.lastWeek});
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementContainsText(this.startDateRangeInput,getLastWeekStartDate(),"Verify exact dates should be displayed properly for the last week.");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await this.dateSelect.selectOption({ label : indexPage.lighthouse_data.lastMonth});
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await assertElementContainsText(this.startDateRangeInput,getLastMonthStartDate(),"Verify exact dates should be displayed properly for the last month.")
    });
    await this.dateSelect.selectOption({ label : indexPage.lighthouse_data.currentWeek});
  }

  async createAddOnForWidget(requestedBy,individualProduct,quantity,isDiscuntNecessary) {
    await executeStep(this.flowsheetBtn,"click","Click on flowsheet button");
    const flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(this.page);
    await flowsheetCardAndTab.performSearchFunction(indexPage.navigator_data.second_job_no_createData2,indexPage.navigator_data.second_job_no_createData2);
    await executeStep(this.addOnBtn,"click","Click on 'Add on' in flowsheet tab")
    await executeStep(this.newAddOnRequestBtn,"click","Click on 'new Add on Request'");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.requestedByInput, 'fill', 'Enter the username', [requestedBy]);
    await executeStep(this.searchProductInput, 'fill', 'Enter the individual product', [
      individualProduct
    ]);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    await executeStep(
      this.selectFirstProduct,
      'click',
      'Select the first product from individual products'
    );
    await executeStep(this.quantityInput, 'fill', 'Clear the quantity', ['']);
    await executeStep(this.quantityInput, 'fill', 'Enter the invalid quantity', [quantity]);
    if(isDiscuntNecessary) {
      await executeStep(this.discountInput,"fill","Enter discount percentage",[indexPage.lighthouse_data.discountPercentage]);
    }
  }

  async getTextOfTheEquipment() {
    const equipmentText = await this.textOfEquipment.textContent();
    return equipmentText;
  }

  async dateSelectInAddOn(isSecondDate) {
    await executeStep(this.nextButton,"click","Click on next button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.selectFirstDate,"click","Select first date in the modal");
    if(isSecondDate) {
      await executeStep(this.selectSecondDate,"click","Select the second date from the modal");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.reviewOrderBtn,"click","Click on 'Review order' button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.sendToNavigatorBtn,"click","Click on 'Send to navigator' button");
  }

  async assertAddOnWith1pcsFor1DayWithoutDiscount() {
    await this.createAddOnForWidget(indexPage.lighthouse_data.requestedBy,indexPage.lighthouse_data.individualProduct,indexPage.lighthouse_data.validQuantity,false);
    const getText = await this.getTextOfTheEquipment();
    await this.dateSelectInAddOn(false);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    if(this.isMobile) {
      await executeStep(this.backBtnInMobile,"click","Click back button in mobile");
    }
    await this.navigateToDashboard();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.productInWidget(getText) , "Verify that Item A should be displayed properly for Add on with 1pcs for 1 days and without discount.");
  }

  async assertAddOnWith2PcsFor2DaysWithoutDiscount() {
    await this.createAddOnForWidget(indexPage.lighthouse_data.requestedBy,indexPage.lighthouse_data.individualProduct,indexPage.lighthouse_data.quantity2,false);
    const getText = await this.getTextOfTheEquipment();
    await this.dateSelectInAddOn(true);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    if(this.isMobile) {
      await executeStep(this.backBtnInMobile,"click","Click back button in mobile");
    }
    await this.navigateToDashboard();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.productInWidget(getText) , "Verify that Item should be displayed properly for Add on with 2pcs for 2 days and without discount.");
  }

  async assertAddonWith1pcsFor1DayWith25PerDiscount() {
    await this.createAddOnForWidget(indexPage.lighthouse_data.requestedBy,indexPage.lighthouse_data.individualProduct,indexPage.lighthouse_data.validQuantity,true);
    const getText = await this.getTextOfTheEquipment();
    await this.dateSelectInAddOn(false);
    await this.page.waitForTimeout(parseInt(process.env.large_timeout));
    if(this.isMobile) {
      await executeStep(this.backBtnInMobile,"click","Click back button in mobile");
    }
    await this.navigateToDashboard();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.productInWidget(getText) , "Verify that Item A should be displayed properly for Add on with 1pcs for 1 days and with 25% discount.");
  }
}