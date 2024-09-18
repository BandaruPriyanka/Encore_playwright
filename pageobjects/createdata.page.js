const { executeStep }=require( "../utils/action");
const fs = require("node:fs/promises");
const indexPage=require("../utils/index.page")
const { generateRandString,startDate,endDate,assertElementVisible,assertEqualValues,writeFileSync } = require("../utils/helper");
const utilConst = require("../utils/const");
require("dotenv").config();

exports.CreateData = class CreateData {
        constructor(page) {
          this.page = page;
          this.copilotButton = page.locator("//div[@id='Microsoft.Copilot.Pane']/parent::div/div[2]//button");
          this.opportunityElement = page.locator("//span[text()='Opportunities']");
          this.newButton = page.locator("//span[text()='New']");
          this.selectNewOption = page.locator("//div[text()='New']");
          this.selectAtendees = page.locator("//div[text()='101-250']");
          this.selectCategory = page.locator("//div[text()='Main Show']");
          this.selectEndUserContact = page.locator("//span[text()='Angelina Wood']");
          this.deleteVenue = page.locator("//div[text()='PSAV Corporate Headquarters']/../following-sibling::button");
          this.selectVenue = page.locator("//span[text()='Hotel Del Coronado, Curio Collection by Hilton']");
          this.saveButton = page.locator("//span[text()='Save']");
          this.currencyElement = page.locator("//label[text()='Currency']");
          this.ignoreAndSaveButton = page.locator("//button[text()='Ignore and save']");
          this.ordersButton = page.locator("//li[text()='Orders']");
          this.selectCenter = page.locator("//span[text()='Hotel del Coronado']");
          this.createOrderBtn = page.locator("//button[contains(text(), 'Create Order')]");
          this.clickOnjobsBtn = page.locator("//a[normalize-space()='Jobs']");
          this.selectRoomType = page.locator("(//div[@id='slickGridContainer-oeJobGrid']//div[@class='ui-widget-content slick-row even']/div)[14]");
          this.clickOnRoomDropDown = page.locator("select.editor-combobox");
          this.selectFirstRoom = page.locator("(//div[@class='slick-cell l7 r7 true'])[1]");
          this.firstRoomDropDown = page.locator("select.editor-combobox");
          this.saveBtn = page.locator("//button[normalize-space(text())='Save']");
          this.roomName = page.locator("(//span[@class='job-number'])[1]/parent::div/following-sibling::div[6]");
          this.orderNumber = page.locator("//div[@id='orderJobCommon']//label[@class='orderTickerDisplayValue me-3']");
          this.orderName = page.locator("//div[@id='orderJobCommon']//label[@class='orderTickerDisplayValue fw-bold']");
          this.changeStatus = page.locator("//div[text()='Sales']/following-sibling::div[text()='Quote']");
          this.statusDropDown = page.locator("//div[@id='slickGridContainer-oeJobGrid']//select[@class='orderInput h-auto ng-untouched ng-pristine ng-valid']");
          this.itemsBtn = page.locator("//a[normalize-space(text())='Items']");
          this.clickPackageIcon = page.locator("//div[@id='jobProductContainer']//button/span[contains(@class, 'glyphicon-gift')]");
          this.selectPackageName = page.locator("//div[@id='slickGridContainer-oePackagesGrid']//div[contains(@class,'ui-widget-content slick-row ')][2]");
          this.selectedItemName = page.locator("(//div[@id='slickGridContainer-oeOrderLinesGrid']//div[@class='grid-canvas grid-canvas-top grid-canvas-left']//following::div)[3]");
          this.clickOnItemIcon = page.locator("//div[@id='jobProductContainer']//button/span[contains(@class, 'glyphicon glyphicon-th-list')]");
          this.cancelItemsIcon = page.locator("//app-job-product-item//span[@class='glyphicon glyphicon-remove oeSideBarGridSearchIcon']");
          this.clickOnSearchIcon = page.locator("//app-job-product-item//span[@class='glyphicon glyphicon-search oeSideBarGridSearchIcon']");
          this.checkboxLabourtItems = page.locator("//label[text()='Labor Items']");
          this.labourItem = page.locator("//app-job-products//app-job-product-item//div[text()='3-Hole Punch Labor']");
          this.addToPackageBtn = page.locator("//button[text()=' Add to package ']");
          this.labourItemName = page.locator("//app-job-items//div[@class='ui-widget-content slick-row even']//div[text()='3-Hole Punch Labor']");
          this.ordersIframe = page.frameLocator("iframe#WebResource_OrdersSubGrid");
          this.plusButtonInIframe = this.ordersIframe.locator("//div[@id='divToolbarOrders']/div/div[4]/div/img[@class='po-toolbar-control-image-enabled']");
          this.inputAttribute = (attributeValue) => page.locator(`//label[text()='${attributeValue}']/../following-sibling::div/descendant::input`);
          this.buttonAttribute = (attributeValue) => page.locator(`//label[text()='${attributeValue}']/../following-sibling::div/descendant::button[@role='combobox']`);
          this.selectEndUserAccount = (enduserText) => page.locator(`//span[text()='${enduserText}']`);
        }

        async clickOnCompass() {
            await this.page
              .frameLocator("iframe#AppLandingPage")
              .locator('//div[text()="Compass"]')
              .waitFor({
                state: "visible",
                timeout: parseInt(process.env.element_locator_timeout),
              })
              .catch((err) => console.error("Element not found:", err));
            await this.page
              .frameLocator("iframe#AppLandingPage")
              .locator("//div[text()='Compass']")
              .click({ timeout: parseInt(process.env.element_locator_timeout) });
          }
          async clickOnCopilot() {
            await executeStep(this.copilotButton,"click","click on copilot button");
          }
          async createOpportunity(revenue,endUserAccount,endUserContact,venue,centerName,enduserText) {
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.opportunityElement,"click","click on opportunity");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.newButton,"click","click on opportunity");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            const eventName = generateRandString(3);
            await executeStep(this.inputAttribute(utilConst.Const.EventName),"fill","Enter the event name",[eventName]);
            await executeStep(this.inputAttribute(utilConst.Const.EventStartDate), "click", "click on start date input");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.inputAttribute(utilConst.Const.EventStartDate), "fill", "clear the start date", [""]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.inputAttribute(utilConst.Const.EventStartDate), "fill", "Enter the start date", [startDate()]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.inputAttribute(utilConst.Const.EventEndDate), "click", "click on end date input");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.inputAttribute(utilConst.Const.EventEndDate), "fill", "clear the end date", [""]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.inputAttribute(utilConst.Const.EventEndDate), "fill", "Enter the end date", [endDate()]);
            await executeStep(this.buttonAttribute(utilConst.Const.NewOrExisting),"click","click on new")
            await executeStep(this.selectNewOption,"click","click new from the dropdown");
            await executeStep(this.inputAttribute(utilConst.Const.EstRevenue),"click","click estimated revenue input");
            await executeStep(this.inputAttribute(utilConst.Const.EstRevenue),"fill","Enter the estimated revenue",[revenue]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.buttonAttribute(utilConst.Const.NoOfAttendees),"click","click on no of attendees");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.selectAtendees,"click","select no of attendees from dropdown");
            await executeStep(this.buttonAttribute(utilConst.Const.ShowCategory),"click","click on show category input");
            await executeStep(this.selectCategory,"click","select category from the dropdown");
            await executeStep(this.inputAttribute(utilConst.Const.EndUserAccount),"scroll","scroll to the end user if needed");
            await executeStep(this.inputAttribute(utilConst.Const.EndUserAccount),"click","click on end user account input");
            await executeStep(this.inputAttribute(utilConst.Const.EndUserAccount),"fill","enter the end user accout",[endUserAccount]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.selectEndUserAccount(enduserText),"click","select end user from dropdown");
            await executeStep(this.inputAttribute(utilConst.Const.EndUserContact),"click","click on end user contact input");
            await executeStep(this.inputAttribute(utilConst.Const.EndUserContact),"fill","enter the end user contact",[endUserContact]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.selectEndUserContact,"click","select the end user contact from dropdown");
            await executeStep(this.deleteVenue,"click","click the delete venue in the input");
            await executeStep(this.inputAttribute(utilConst.Const.Venue),"click","click the venue input");
            await executeStep(this.inputAttribute(utilConst.Const.Venue),"fill","Enter the venue",[venue]);
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.selectVenue,"click","select the venue from the dropdown");
            await assertElementVisible(this.saveButton)
            await this.saveButton.click();
            try {
              await executeStep(this.ignoreAndSaveButton,"click","click the save button");
            } catch (error) {
              console.error("Element is not there in the DOM");
            } finally {
              await this.page.waitForTimeout(parseInt(process.env.large_timeout));
              await executeStep(this.ordersButton,"click","click the order button");
              await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
              await executeStep(this.inputAttribute(utilConst.Const.GLCenter),"click","click the GL center input");
              await executeStep(this.inputAttribute(utilConst.Const.GLCenter),"fill","enter the center name",[centerName]);
              await this.page.waitForTimeout(parseInt(process.env.small_timeout));
              await executeStep(this.selectCenter,"click","select the center from the dropdown");
              await executeStep(this.saveButton,"click","click on save button");
              await this.page.waitForTimeout(parseInt(process.env.large_timeout));
            }
          }

          async clickOnPlusButton(mail, password) {
            await executeStep(this.currencyElement,"scroll","scroll to the element if needed");
            await this.plusButtonInIframe.waitFor({
                state: "visible",
                timeout: parseInt(process.env.element_locator_timeout),
              });
              await this.plusButtonInIframe.click({
                timeout: parseInt(process.env.element_locator_timeout),
              });
            const newPage = await Promise.race([
              this.page.context().waitForEvent("page", {
                timeout: parseInt(process.env.pageload_timeout),
              }),
              new Promise((resolve) =>
                setTimeout(() => resolve(null), parseInt(process.env.pageload_timeout))
              ),
            ]);
            await newPage.locator("//input[@id='userNameInput']").fill(mail);
            await newPage.locator("//input[@id='passwordInput']").fill(password);
            await newPage.locator("//span[@id='submitButton']").click();
            await newPage.waitForTimeout(parseInt(process.env.large_timeout));
            const navigationUrl = await newPage.url();
            indexPage.navigator_data.navigatorUrl = navigationUrl;
            await fs.writeFile("./data/navigator.json", JSON.stringify(indexPage.navigator_data));
            await assertEqualValues(indexPage.navigator_data.navigatorUrl, navigationUrl);
            await newPage.close();
          }
        
          async createOrder() {
            await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
            await executeStep(this.createOrderBtn,"click","click on order");
          }
          async jobsPage() {
            await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
            await executeStep(this.clickOnjobsBtn,"click","click on jobs");
          }
          async selectRooms() {
            await executeStep(this.selectRoomType,"click","click on room type")
            await executeStep(this.clickOnRoomDropDown,"click","click on room dropdown");
            await this.clickOnRoomDropDown.selectOption({ label: "Babcock A" });
            await executeStep(this.saveBtn,"click","click o save button");
            await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
            const firstJobNumberElement = await this.page
              .locator("span.job-number")
              .nth(0);
            const firstJobNumber = await firstJobNumberElement.textContent();
            indexPage.navigator_data.first_job_no = firstJobNumber;
            await fs.writeFile("./data/navigator.json", JSON.stringify(indexPage.navigator_data));
            const secondJobNumberElement = await this.page
              .locator("span.job-number")
              .nth(1);
            const secondJobNumber = await secondJobNumberElement.textContent();
            indexPage.navigator_data.second_job_no = secondJobNumber;
            const orderNumber = await this.orderNumber.textContent();
            indexPage.navigator_data.order_no = orderNumber;
            const order_name = await this.orderName.textContent();
            indexPage.navigator_data.order_name = order_name;
            const roomNameele=await this.roomName.textContent();
            indexPage.navigator_data.roomName = roomNameele;
            await fs.writeFile("./data/navigator.json", JSON.stringify(indexPage.navigator_data));
          }
          async selectItems() {
            await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
            await executeStep(this.itemsBtn,"click","click on items button");
            await executeStep(this.clickPackageIcon,"click","click on package icon")
            await executeStep(this.selectPackageName,"doubleclick","double click the select package");
            const textContent = await this.selectedItemName.textContent();
            indexPage.navigator_data.item_name = textContent;
            await fs.writeFile("./data/navigator.json", JSON.stringify(indexPage.navigator_data));
            const itemName = indexPage.navigator_data.item_name;
            await assertEqualValues(textContent,itemName)
            await executeStep(this.saveBtn,"click","click on save button");
            await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
          }
          async selectLabourItem() {
            await executeStep(this.clickOnItemIcon,"click","click on item icon")
            await executeStep(this.clickOnSearchIcon,"click","click on search icon");
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.checkboxLabourtItems,"click","click on labour check box");
            await this.page.waitForTimeout(1000);
            await executeStep(this.labourItem,"doubleclick","double click on labour item")
            await this.page.waitForTimeout(parseInt(process.env.small_timeout));
            await executeStep(this.addToPackageBtn,"click","click on add to package button");
            const ItemName = await this.labourItemName.textContent();
            indexPage.navigator_data.labour_item_name = ItemName;
            await fs.writeFile("./data/navigator.json", JSON.stringify(indexPage.navigator_data));
            await executeStep(this.saveBtn,"click","click on save button")
            await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
          }
      
}