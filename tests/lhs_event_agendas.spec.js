const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const {
  assertElementVisible,
  assertElementAttributeContains,
  todayDate
} = require('../utils/helper');

test.describe('LightHouse Event Agendas', () => {
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
    await agendasPage.actionsOnEventAgendas();
  });

  test('Test_C56934 : Verify Event Agendas page elements', async () => {
    await agendasPage.verifyEventAgendasPage();
  });
  test.skip('Test_C56938	: Verify Event Agendas calendar widget + active checkbox', async () => {
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
  });
});
