const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { invalidDiscountGenerator, validDiscountGenerator } = require('../utils/helper');
require('dotenv').config();

let flowsheetCardAndTab, flowsheetPage, locationId, locationText, dashboardPage,logsPage;

test.beforeEach(async ({ page }) => {
  flowsheetCardAndTab = new indexPage.FlowsheetCardAndTab(page);
  flowsheetPage = new indexPage.FlowSheetPage(page);
  dashboardPage = new indexPage.DashboardPage(page);
  logsPage= new indexPage.LogsPage(page);
  locationId = indexPage.lighthouse_data.locationId_createData2;
  locationText = indexPage.lighthouse_data.locationText_createData2;
  await page.goto(process.env.lighthouseUrl, {
    timeout: parseInt(process.env.pageload_timeout)
  });
  await page.waitForTimeout(parseInt(process.env.small_timeout));
  await flowsheetPage.changeLocation(locationId, locationText);
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
});

test('Test_C56895: Verify Add-on creation (Docusign disabled)', async () => {
  await flowsheetCardAndTab.verifyDocusignStatus(
    indexPage.lighthouse_data.turnOff,
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2
  );
  await flowsheetCardAndTab.addOnFunction(
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
  await flowsheetCardAndTab.discountChecking(
    invalidDiscountGenerator(),
    validDiscountGenerator(),
    true
  );
  await flowsheetCardAndTab.dateSelectModalCheckingAndAssertRooms();
});

test('Test_C56892: Verify Comparison with previous jobs logic', async () => {
  await flowsheetCardAndTab.assertComparisonIcon(
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
  await flowsheetCardAndTab.comparisonIconFunctionality();
});

test('Test_C56909 : Verify Logs Tab', async () => {
  await flowsheetCardAndTab.assertCommentSectionInLog(
    indexPage.navigator_data.second_job_no_createData2,
    indexPage.navigator_data.second_job_no_createData2
  );
  await flowsheetCardAndTab.assertLogAfterAddOn(
    indexPage.lighthouse_data.requestedBy,
    indexPage.lighthouse_data.individualProduct,
    indexPage.lighthouse_data.packageProduct,
    indexPage.lighthouse_data.invalidQuantity,
    indexPage.lighthouse_data.validQuantity
  );
});

test("Test_C57149 : Check 'Additions captured' widget", async () => {
  await dashboardPage.navigateToDashboard();
  await dashboardPage.assertWidget();
  await dashboardPage.assertElementsInWidgets();
  await dashboardPage.assertAddOnWith1pcsFor1DayWithoutDiscount();
  await dashboardPage.assertAddOnWith2PcsFor2DaysWithoutDiscount();
  await dashboardPage.assertAddonWith1pcsFor1DayWith25PerDiscount();
});

test('Test_57147 : Verify Logs Functionality', async({page})=>{
  await logsPage.navigateToLogs();
  await logsPage.checkLogDefaultState();
  await logsPage.flowsheetALogsState();
  await logsPage.flowsheeetBSetStatus();
  await logsPage.addTestNoteOnLogs();
})
