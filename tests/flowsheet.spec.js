const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
const { assertElementVisible, assertEqualValues, assertNotEqualValues } = require('../utils/helper');
require('dotenv').config();

test.describe('Performing actions on Flowsheet', () => {
  let flowsheetPage,
    filtercount_before_pagereload,
    filtercount_after_pagereload,
    locationId,
    locationText;

  test.beforeEach(async ({ page }) => {
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
  });
  test('Test_C56878: Verify Flowsheet status', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Skipping Flowsheet status on mobile devices');
    await flowsheetPage.searchFunctionality();
    await assertElementVisible(flowsheetPage.statusIcon, 'Verify status icon is visible');
    await assertElementVisible(flowsheetPage.groupIcon, 'Verify group icon is visible');
    await flowsheetPage.setStatus();
    await assertElementVisible(
      flowsheetPage.carryOver,
      'Check if carryOver is visible before page reload'
    );
    await page.reload();
    await flowsheetPage.searchFunctionality();
    await assertElementVisible(
      flowsheetPage.carryOver,
      'Check if carryOver is visible after page reload'
    );
    await flowsheetPage.changestatus();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });
  test('Test_C56880 : Verify Flowsheet groups', async ({ isMobile }) => {
    test.skip(isMobile, 'Skipping Flowsheet status on mobile devices');
    await flowsheetPage.searchFunctionality();
    await assertElementVisible(flowsheetPage.statusIcon, 'Verify status icon is visible');
    await assertElementVisible(flowsheetPage.groupIcon, 'Verify group icon is visible');
    await flowsheetPage.verifyGroup();
    await flowsheetPage.deleteGroupData();
  });

  test('Test_C56882: Verify lighthouse flowsheet search functionality', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.large_timeout));
    await assertElementVisible(flowsheetPage.roomsCount, 'Assert that rooms count is visible');
    await assertElementVisible(flowsheetPage.searchInput, 'Verify search input is visible');
    await flowsheetPage.checkingSearchFunctionality();
  });

  test('Test_C56885: Verify Flowsheets filtering', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetPage.roomsCount, 'Assert that rooms count is visible');
    await assertElementVisible(flowsheetPage.filterIcon, 'Assert filter icon is visible');
    await flowsheetPage.flowsheetFilter();
    filtercount_before_pagereload = await flowsheetPage.filterCount.textContent();
    await page.reload();
    filtercount_after_pagereload = await flowsheetPage.filterCount.textContent();
    await assertEqualValues(
      filtercount_before_pagereload,
      filtercount_after_pagereload,
      `Assert that the filter count before page reload "${filtercount_before_pagereload}" matches the filter count after reload "${filtercount_after_pagereload}"`
    );
    await flowsheetPage.sorting();
  });

  test('Test_C56886: Verify Flowsheets calendar', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(flowsheetPage.calendarDiv, 'Verify visibility of the calendar');
    await assertElementVisible(
      flowsheetPage.nextweekIcon,
      'Verify visibility of the next week icon'
    );
    await assertElementVisible(
      flowsheetPage.previousweekIcon,
      'Verify visibility of the previous week icon'
    );
    await flowsheetPage.clickonPreviousWeek();
    await assertElementVisible(flowsheetPage.todayButton, 'Verify visibility of the today button');
    await test.step('Verify the calendar has the correct dates', async () => {
      await flowsheetPage.assertCalendarHasDates();
    });
  });

  test('Test_C56888: Verify Flowsheets calendar widget', async ({ page }) => {
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await assertElementVisible(
      flowsheetPage.calendarDiv,
      'Verify visibility of the calendar widget'
    );
    await test.step('Verifying a unique flowsheet list is returned for each date', async () => {
      await flowsheetPage.asserRoomsWhileDateChange();
    });
    await test.step('Assert dates displayed in the calendar', async () => {
      await flowsheetPage.assertDates();
    });
    await test.step('Assert URLs associated with the calendar', async () => {
      await flowsheetPage.assertUrls();
    });
    await test.step('Validate dates from the past and future', async () => {
      await flowsheetPage.validateDateFromPastAndFuture();
    });
  });
  test('Test_C56881: Verify Flowsheet touchpoints indicator', async () => {
    await test.step('Assert touchpoint indicator visibility', async () => {
      await flowsheetPage.assertTouchPointIndicator(indexPage.navigator_data.second_job_no);
    });
    await test.step('Add second touchpoint', async () => {
      await flowsheetPage.addSecondTouchPoint(indexPage.navigator_data.second_job_no);
    });
    await test.step('Add remaining touchpoints', async () => {
      await flowsheetPage.addRemainingTouchPoint();
    });
  });
  test('Test_C56887: Verify Flowsheets command center', async () => {
    await test.step('Verify rooms functionality', async () => {
      await flowsheetPage.verifyingRoomsFunctionality(
        indexPage.lighthouse_data.invalidText,
        indexPage.navigator_data.second_job_no,
        indexPage.lighthouse_data.flowsheetUpdatedIconText
      );
    });
    await test.step('Verify transfers functionality', async () => {
      await flowsheetPage.verifyingTransfersFunctionality();
    });
  });
  test('Test_C57102: Verify Flowsheet status after selecting all the equipments', async ({
    page
  }) => {
    await flowsheetPage.navigateToProfileMenu();
    await test.step('Verify that the "Use Equipment Checklist" is set to ON', async () => {
      await flowsheetPage.toggleEquipmentChecklistOn();
      await flowsheetPage.selectFlowsheetCard();
    });
    await flowsheetPage.searchFlowsheetCard();
    await assertElementVisible(flowsheetPage.equipmentTab,'Verify Flowsheet card is displayed Equipment Tab');
    await assertElementVisible(flowsheetPage.redIcon,'Verify the Current Status is open');
    await test.step('Verify that the user can select/check Equipment items', async () => {
      await flowsheetPage.equipmentItemsClickable();
    });
    await assertElementVisible(flowsheetPage.greenIcon,'Verify all available items are selected, status should be complete automatically');
    await page.reload();
    await page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await test.step('Verify all changes were applied after page reload', async () => {
      await flowsheetPage.pageReloadChanges();
    });
    await test.step('Verify that one of the assets can be deselected, Status should update to Partial', async () => {
      await flowsheetPage.deSelectAnyEquipmentItem();
    });
    await test.step('Verify that deselect the last assets, Status should update to initial open', async () => {
      await flowsheetPage.deSelectLastEquipmentAsset();
      await assertElementVisible(flowsheetPage.redIcon,'Verify that red icon is visible');
    });
  });

  test('Test_C57169 Verify that flowsheet disappears when completed' , async ({ page }) => {
    const intialFlowSheetCardsCount = await flowsheetPage.roomsCount.textContent();
    await flowsheetPage.setAndStrikeComplete();
    await page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const countAfterCompleteSetAndStrike = await await flowsheetPage.roomsCount.textContent();
    await assertNotEqualValues(intialFlowSheetCardsCount,countAfterCompleteSetAndStrike,"Verify that the completed flowsheet will disappear.");
    await flowsheetPage.filterForStatus();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    const countOfCardaAfterFilter = await flowsheetPage.roomsCount.textContent();
    await assertEqualValues(intialFlowSheetCardsCount,countOfCardaAfterFilter,"Verify that completed flowsheet is visible after filter");
    await flowsheetPage.removeFilter();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C57167 Verify that navigator data on Flowsheet Card' , async({ page }) => {
    await flowsheetPage.searchFunctionality();
    await page.waitForTimeout(parseInt(process.env.small_timeout))
    await flowsheetPage.assertFlowsheetCard();
    await flowsheetPage.assertStatusOfNavigatorJob();
  }) 

  test('Test_C57174 Verify change location in flowsheet' , async ({ page }) => {
    const initialFlowsheetCardsCountFor1137 = await flowsheetPage.roomsCount.textContent();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData2, indexPage.lighthouse_data.locationText_createData2);
    let flowsheetCardsCountFor9023;
    if(await flowsheetPage.roomsCount.isVisible()) {
      flowsheetCardsCountFor9023 =  await flowsheetPage.roomsCount.textContent();
    }else {
      flowsheetCardsCountFor9023 = 0;
    }
    await assertNotEqualValues(initialFlowsheetCardsCountFor1137,flowsheetCardsCountFor9023,"Verify that different flowsheets displayed for different locations");
    await flowsheetPage.changeLocation(indexPage.lighthouse_data.locationId_createData1, indexPage.lighthouse_data.locationText_createData1);
    const afterFlowsheetCountFor1137 = await flowsheetPage.roomsCount.textContent();
    await assertEqualValues(initialFlowsheetCardsCountFor1137,afterFlowsheetCountFor1137,"Verify that location is set to intial location")
  })

});
