const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
const {
  assertElementVisible,
  assertNotEqualValues,
  assertEqualValues,
  assertElementNotVisible
} = require('../utils/helper');
test.describe('Performing actions on My Profile Tab', () => {
  let profilePage,
    flowsheetPage,
    locationId,
    locationText,
    lastSyncValue,
    profileModule,
    preferencesModule,
    moreOptionsModule;

  test.beforeEach(async ({ page }) => {
    profilePage = new indexPage.ProfilePage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await profilePage.navigateToProfileMenu();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    test.step('Verify My Profile is visible', async () => {
      await assertElementVisible(profilePage.myProfileBtn);
      await profilePage.navigateToMyProfile();
    });
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
  });

  test.skip('Test_C57103 Verify Menu navigation desktop', async ({isMobile }) => {
    test.skip(isMobile, 'Skipping Verify Menu navigation on mobile devices');
    await profilePage.verifyingMenuNavigation(
      indexPage.lighthouse_data.expectedProfileText,
      indexPage.lighthouse_data.expectedlocationText,
      indexPage.lighthouse_data.expectedlogsText,
      indexPage.lighthouse_data.expecteddashboardText
    );
  });

  test.skip('Test_C57109 Verify Menu navigation mobile', async ({isMobile }) => {
    test.skip(!isMobile, 'Skipping Flowsheet status on desktop devices');
    await profilePage.verifyingMenuNavigation(
      indexPage.lighthouse_data.expectedProfileText,
      indexPage.lighthouse_data.expectedlocationText,
      indexPage.lighthouse_data.expectedlogsText,
      indexPage.lighthouse_data.expecteddashboardText
    );
  });
  test.skip('Test_C57104: Check General Tab elements', async ({ page }) => {
    await test.step('Verify General Tab is opened by default', async () => {
      await assertElementVisible(profilePage.generalTab);
    });

    await test.step('Verify General page should consist of Profile, Preferences, More Options/Default Screen modules', async () => {
      await Promise.all([
        assertElementVisible(profilePage.profileModule),
        assertElementVisible(profilePage.preferencesModule),
        assertElementVisible(profilePage.moreOptionsModule)
      ]);
    });

    await test.step('Check the Profile section elements', async () => {
      const elementsToCheck = [
        profilePage.lastSyncText,
        profilePage.notificationsAllowedText,
        profilePage.displayName,
        profilePage.emailText,
        profilePage.userNameText,
        profilePage.defaultLocationText,
        profilePage.selectedLocationText
      ];
      await Promise.all(elementsToCheck.map(assertElementVisible));
    });

    await test.step('Check Preference section elements', async () => {
      const elementsToCheck = [
        profilePage.languageElement,
        profilePage.equipmentDisplayChoiceElement,
        profilePage.themeElement,
        profilePage.timeDisplayElement,
        profilePage.defaultScheduleViewElement
      ];
      await Promise.all(elementsToCheck.map(assertElementVisible));
    });

    await test.step('Check More Options/Default Screen menu slots', async () => {
      for (let i = 1; i <= 5; i++) {
        const menuSlotElement = profilePage.getMenuSlotElement(i);
        await assertElementVisible(menuSlotElement);
      }
    });
  });
  test.skip('Test_C57105: Check Resync Functionality', async ({ page }) => {
    test.step('Verify last sync date/time is previous', async () => {
      await profilePage.validatingLastSyncValue();
    });
    test.step('Verify Sync is executed successfully ', async () => {
      await profilePage.resyncTheTime();
      await assertElementVisible(profilePage.notificationMessage);
    });
    test.step('Verify Sync status is Just now', async () => {
      await profilePage.resyncJustnowStatus();
      await profilePage.validatingNotification();
    });
    await page.reload();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    test.step('Verify Last Synced Value Updates on Page Refresh', async () => {
      lastSyncValue = await profilePage.lastSyncValue.innerText();
      await assertNotEqualValues(lastSyncValue, indexPage.lighthouse_data.lastSyncedTime);
    });
  });
  test('Test_C57106 Check "Location" selection', async () => {
    const locationFromHeader = await profilePage.getLocationFromHeader.textContent();
    const locationFromGeneralTab = await profilePage.getLocationFromGeneralTab.textContent();
    await test.step(`Verify that a valid location is displayed as the default 'Selected location' value- Expected: "${locationFromGeneralTab.trim()}", Actual: "${locationFromHeader.trim()}"`, async () => {
      await assertEqualValues(locationFromHeader.trim(), locationFromGeneralTab.trim());
    });    
    await test.step('Verify that the "Selected location change" button is not visible', async () => {
      await assertElementNotVisible(profilePage.selectedLocationChangeButton);
    });    
  });
  test('Test_C57108 Check "Equipment Display Choice" selection', async() => {
    await profilePage.assertEquipmentByIntialDisplayValue();
    await profilePage.assertEquipmentByChangedDisplayValue();
    await profilePage.changeEquipmentDisplayChoiceToInitialValue();
  })
  test('Test_Check "Default Schedule View" selection', async () => {
    await profilePage.assertInitialDefaultSheduleView();
    await profilePage.assertDefaultScheduleViewAfterChange();
    await profilePage.changeScheduleViewValueToIntialValue();
  })
  test.only('Test_C57107 Check "Language" selection' , async() => {
    await profilePage.assertInitialLanguageValue();
    await profilePage.assertUpdateLanguageToSpanish();
    await profilePage.assertUpdateLanguageToFrench();
    await profilePage.changeLanguageToIntialValue();
  })
});
