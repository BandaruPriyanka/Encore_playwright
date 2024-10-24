const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertElementAttributeContains,
  assertElementEnabled,
  todayDate
} = require('../utils/helper');

test.describe('LightHouse Event Agendas - LHS Event Agendas', () => {
  let agendasPage, flowsheetPage, locationId, locationText;

  test.beforeEach(async ({ page }) => {
    agendasPage = new indexPage.EventAgendas(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await agendasPage.actionsOnEventAgendas();
  });

  test('Test_C56934 : Verify Event Agendas page elements', async () => {
    await agendasPage.verifyEventAgendasPage();
  });
  test('Test_C56938	: Verify Event Agendas calendar widget + active checkbox', async ({
    isMobile
  }) => {
    test.skip(isMobile, 'Skipping Verify Event Agendas calendar widget + active checkbox');
    await agendasPage.verifyCalendarWidget();
    await assertElementVisible(agendasPage.calendarModal, 'Calendar modal should be displayed');
    const todayDateEle = todayDate();
    await assertElementAttributeContains(
      agendasPage.dateCell(todayDateEle),
      'class',
      'mbsc-selected',
      'Verify currently selected dates should be highlighted'
    );
    await assertElementVisible(agendasPage.updateBtn, 'Update button should be displayed');
    await agendasPage.verifyDateSelection();
    await agendasPage.DateRangeOptions();
  });
  test('Test_C57151 Verify Event Agendas printing' , async ({ isMobile }) => {
    test.skip(isMobile, 'Skipping Verify Event Agendas printing');
    await agendasPage.assertPrintIcon();
    await agendasPage.assertPdf();
    await agendasPage.assertPdfAfterChangeSettings();
  })
  test('Test_C56939 : Verify Event Agendas search + filtering', async () => {
    await agendasPage.verifySearchWithValidData();
    await agendasPage.clickOnClose();
    await agendasPage.verifySearchWithInValidData();
    await agendasPage.verifyCaseSensitive();
    await agendasPage.verifyGlCenter();
    await agendasPage.verifyVenue();
    await agendasPage.verifyProjectManager();
    await agendasPage.validateGLCenterProjectFilter();
  });
}),
  test.describe('LightHouse Event Agendas - Mfe Event Agendas ', () => {
    let agendasPage;
    test.beforeEach(async ({ page }) => {
      agendasPage = new indexPage.EventAgendas(page);
      await page.goto(process.env.eventsUrl, {
        timeout: parseInt(process.env.pageload_timeout)
      });
    });
  test('Test_C56942	: Verify MFE - Event Agendas page elements', async () => {
    await agendasPage.verifyEventAgendasPage();
    await assertElementEnabled(agendasPage.editBtn,'Verify User can able to click on "Edit" button');
    await assertElementEnabled(agendasPage.viewBtn,'Verify User can able to click on "View" button');
    await agendasPage.clickOnViewBtn();
    await agendasPage.clickOnEditBtn();
    await agendasPage.verifyThemeSwitcher();
    await agendasPage.verifyLangSelection();
  });
  test('Test_C57094	: Verify MFE - Event Agendas calendar widget + active checkbox', async ({isMobile}) => {
    test.skip(isMobile, 'Skipping Verify MFE - Event Agendas calendar widget + active checkbox');
    await agendasPage.verifyCalendarWidget();
    await assertElementVisible(agendasPage.calendarModal, 'Calendar modal should be displayed');
    const todayDateEle = todayDate();
    await assertElementAttributeContains(
      agendasPage.dateCell(todayDateEle),
      'class',
      'mbsc-selected',
      'Verify currently selected dates should be highlighted'
    );
    await assertElementVisible(agendasPage.updateBtn, 'Update button should be displayed');
    await agendasPage.verifyDateSelection();
    await agendasPage.DateRangeOptions();
  });
  test('Test_C57095 : Verify MFE - Event Agendas search + filtering', async () => {
    await agendasPage.verifySearchWithValidData();
    await agendasPage.clickOnClose();
    await agendasPage.verifySearchWithInValidData();
    await agendasPage.verifyCaseSensitive();
    await agendasPage.verifyGlCenter();
    await agendasPage.verifyVenue();
    await agendasPage.verifyProjectManager();
    await agendasPage.validateGLCenterProjectFilter();
  });
  test('Test_C57097 Verify MFE - Event Agendas printing' , async ({ isMobile }) => {
      test.skip(isMobile, 'Skipping Verify MFE - Event Agendas printing');
      await agendasPage.assertPrintIconForBothViews();
      await agendasPage.assertPrintModalAfterLanguageChange();
      await agendasPage.assertPrintIcon();
      await agendasPage.assertPdf();
      await agendasPage.assertPdfAfterChangeSettings();
   });
   test('Test_C57098 Verify MFE - Create Event Agenda' , async ({ isMobile }) => {
      test.skip(isMobile, 'Skipping Verify MFE - Create Event Agenda');
      await agendasPage.assertEventInformationModal();
      await agendasPage.createNewAgenda(indexPage.lighthouse_data.opportunityNumber);
    });
   test('Test_C57155 : Verify MFE - Create Agenda Rooms' , async ({ isMobile }) => {
    test.skip(isMobile , 'Skipping Verify MFE - Create Agenda Rooms');
    await agendasPage.assertAgendaPage();
    await agendasPage.assertAddNewRoomModal();
    await agendasPage.addnewRoomFunctionality();
    await agendasPage.addNewRoomWithCustomName();
   })
   test('Test_C57152 : Verify MFE - Edit Event Agenda' , async ({ isMobile }) => {
    test.skip(isMobile , 'Skipping Verify MFE - Edit Event Agenda');
    await agendasPage.editEventNameInAgenda(indexPage.lighthouse_data.eventName);
    await agendasPage.editProjectManagerInAgenda(indexPage.lighthouse_data.updatedProjectManagerName);
    await agendasPage.editDateInAgenda();
   })
   test('Test_C57153 : Verify MFE - Cancel Event Agenda' , async ({ isMobile }) => {
    test.skip(isMobile , 'Skipping Verify MFE - Cancel Event Agenda');
    await agendasPage.cancelEventAgenda();
   })
});
