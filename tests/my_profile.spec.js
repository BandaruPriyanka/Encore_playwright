const { test } = require('@playwright/test');
const indexPage = require('../utils/index.page');
require('dotenv').config();
const {
  assertElementVisible,
  assertNotEqualValues,
  assertEqualValues,
  assertElementNotVisible,
  assertElementEnabled,
  assertElementDisabled,
  assertElementAttributeContains
} = require('../utils/helper');
test.describe('Performing actions on My Profile Tab & Notifications Tab', () => {
  let profilePage,
    flowsheetPage,
    notificationPage,
    locationId,
    locationText,
    lastSyncValue,
    profileModule,
    preferencesModule,
    moreOptionsModule;

  test.beforeEach(async ({ page }) => {
    profilePage = new indexPage.ProfilePage(page);
    flowsheetPage = new indexPage.FlowSheetPage(page);
    notificationPage = new indexPage.NotificationPage(page);
    locationId = indexPage.lighthouse_data.locationId_createData1;
    locationText = indexPage.lighthouse_data.locationText_createData1;
    await page.goto(process.env.lighthouseUrl, {
      timeout: parseInt(process.env.pageload_timeout)
    });
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await flowsheetPage.changeLocation(locationId, locationText);
    await profilePage.navigateToProfileMenu();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(profilePage.myProfileBtn, 'Verify My Profile is visible');
    await profilePage.navigateToMyProfile();
    await page.waitForTimeout(parseInt(process.env.small_timeout));
  });

  test('Test_C57103 Verify Menu navigation desktop', async ({ isMobile }) => {
    test.skip(isMobile, 'Skipping Verify Menu navigation on mobile devices');
    await profilePage.verifyingMenuNavigation(
      indexPage.lighthouse_data.expectedProfileText,
      indexPage.lighthouse_data.expectedLocationText,
      indexPage.lighthouse_data.expectedLogsText,
      indexPage.lighthouse_data.expectedDashboardText
    );
  });

  test('Test_C57109 Verify Menu navigation mobile', async ({ isMobile }) => {
    test.skip(!isMobile, 'Skipping Flowsheet status on desktop devices');
    await profilePage.verifyingMenuNavigation(
      indexPage.lighthouse_data.expectedProfileText,
      indexPage.lighthouse_data.expectedLocationText,
      indexPage.lighthouse_data.expectedLogsText,
      indexPage.lighthouse_data.expectedDashboardText
    );
  });
  test('Test_C57104: Check General Tab elements', async ({ page }) => {
    await assertElementVisible(profilePage.generalTab, 'Verify General Tab is opened by default');
    await test.step('Verify General page should consist of Profile, Preferences, More Options/Default Screen modules', async () => {
      await Promise.all([
        assertElementVisible(profilePage.profileModule, 'Verify that the Profile Module is visible'),
        assertElementVisible(profilePage.preferencesModule, 'Verify that the Preference Module is visible'),
        assertElementVisible(profilePage.moreOptionsModule, 'Verify that the More Options Module is visible')
      ]);
    });
    await test.step('Check the Profile section elements', async () => {
      const elementsToCheck = [
        { element: profilePage.lastSyncText, text: 'Verify Last Synced Field' },
        { element: profilePage.notificationsAllowedText, text: 'Verify Notifications allowed button' },
        { element: profilePage.displayName, text: 'Verify Display Name' },
        { element: profilePage.emailText, text: 'Verify Email Field' },
        { element: profilePage.userNameText, text: 'Verify UserName Field' },
        { element: profilePage.defaultLocationText, text: 'Verify Default Location Field' },
        { element: profilePage.selectedLocationText, text: 'Verify Selected Location Field' }
      ];
      
      await Promise.all(elementsToCheck.map(({ element, text }) => assertElementVisible(element, text)));
    });
    

    await test.step('Check Preference section elements', async () => {
      const elementsToCheck = [
        { element: profilePage.languageElement, text: 'Verify Language Field' },
        { element: profilePage.equipmentDisplayChoiceElement, text: 'Verify Equipment Display Choice Field' },
        { element: profilePage.themeElement, text: 'Verify Theme Field' },
        { element: profilePage.timeDisplayElement, text: 'Verify Time Display Field' },
        { element: profilePage.defaultScheduleViewElement, text: 'Verify Default Schedule View' }
      ]; 
      await Promise.all(elementsToCheck.map(({ element, text }) => assertElementVisible(element, text)));
    });
    
    await test.step('Check More Options/Default Screen menu slots', async () => {
      for (let i = 1; i <= 5; i++) {
        const menuSlotElement = profilePage.getMenuSlotElement(i);
        await assertElementVisible(menuSlotElement, `Verify that Menu slot :${(i)} is visible`);
      }
    });
  });
  test('Test_C57105: Check Resync Functionality', async ({ page }) => {
    test.step('Verify last sync date/time is previous', async () => {
      await profilePage.validatingLastSyncValue();
    });
    await profilePage.resyncTheTime();
    await assertElementVisible(
      profilePage.notificationMessage,
      'Verify Sync is executed successfully'
    );
    test.step('Verify Sync status is Just now', async () => {
      await profilePage.resyncJustnowStatus();
      await profilePage.validatingNotification();
    });
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    await page.reload();
    await page.waitForTimeout(parseInt(process.env.medium_timeout));
    lastSyncValue = await profilePage.lastSyncValue.innerText();
    await assertNotEqualValues(
      lastSyncValue,
      indexPage.lighthouse_data.lastSyncedTime,
      'Verify Last Synced Value Updates on Page Refresh'
    );
  });
  test('Test_C57106 Check "Location" selection', async () => {
    const locationFromHeader = await profilePage.getLocationFromHeader.textContent();
    const locationFromGeneralTab = await profilePage.getLocationFromGeneralTab.textContent();
    await assertEqualValues(
      locationFromHeader.trim(),
      locationFromGeneralTab.trim(),
      `Verify that a valid location is displayed as the default 'Selected location' value- Expected: "${locationFromGeneralTab.trim()}", Actual: "${locationFromHeader.trim()}"`
    );
    await assertElementNotVisible(
      profilePage.selectedLocationChangeButton,
      'Verify that the "Selected location change" button is not visible'
    );
  });
  test('Test_C57108 Check "Equipment Display Choice" selection', async () => {
    await profilePage.assertEquipmentByIntialDisplayValue();
    await profilePage.assertEquipmentByChangedDisplayValue();
    await profilePage.changeEquipmentDisplayChoiceToInitialValue();
  });
  test('Test_C57110 Check "Default Schedule View" selection', async () => {
    await profilePage.assertInitialDefaultSheduleView();
    await profilePage.assertDefaultScheduleViewAfterChange();
    await profilePage.changeScheduleViewValueToIntialValue();
  });
  test('Test_C57107 Check "Language" selection', async () => {
    await profilePage.assertInitialLanguageValue();
    await profilePage.assertUpdateLanguageToSpanish();
    await profilePage.assertUpdateLanguageToFrench();
    await profilePage.changeLanguageToIntialValue();
  });
  test('Test_C57115:Verify Notification Location Tab elements', async () => {
    await notificationPage.clickOnNotification();
    await test.step('The Notification Location page should consist : Notification location tab , location list , search field', async () => {
      await assertElementVisible(notificationPage.notificationLocation, '');
      await assertElementVisible(notificationPage.locationList, '');
      await assertElementVisible(notificationPage.addLocation, '');
    });
    await assertElementVisible(
      notificationPage.homeIcon,
      'Verify that one location is marked with "Home" icon and cannot be removed'
    );
    await test.step('Verify that other non-home locations can be removed from the list', async () => {
      await assertElementVisible(notificationPage.deleteIcon, '');
      await assertElementEnabled(notificationPage.deleteIcon, '');
    });
  });
  test('Test_C57116:Verify Notification Location search functionality', async () => {
    await notificationPage.clickOnNotification();
    await assertElementVisible(
      notificationPage.addLocation,
      'Verify search field is displayed as the last row '
    );
    await assertElementAttributeContains(
      notificationPage.addLocation,
      'placeholder',
      'Add Location',
      'Verify search field has Add Location placeholder'
    );
    await notificationPage.verifyAddLocationField();
  });

  test('Test_C57117 :Verify adding locations on Notification Location tab', async () => {
    await notificationPage.clickOnNotification();
    await assertElementVisible(
      notificationPage.addLocation,
      'Verify search field is displayed as the last row '
    );
    await assertElementAttributeContains(
      notificationPage.addLocation,
      'placeholder',
      'Add Location',
      'Verify search field has Add Location placeholder'
    );
    await notificationPage.verifyAddingLocation();
  });
  test('Test_C57118: Verify removing locations on Notification Location tab', async () => {
    await notificationPage.clickOnNotification();
    await test.step('Verify that other non-home locations can be removed from the list', async () => {
      await assertElementVisible(notificationPage.deleteIcon, '');
      await assertElementEnabled(notificationPage.deleteIcon, '');
    });
    await notificationPage.verifyRemovingLocation();
  });

  test.skip("Test_C57114 Verify 'Favourite Slot' selection", async () => {
    await profilePage.assertInitialFavouriteMenuSlot();
    await profilePage.changeMenuSlot1ToFavouriteSlot();
    await profilePage.restoreToSelectedMenuSlot();
  });

  test("TC_C57112 Verify 'Time Display' selection", async () => {
    await profilePage.assertTimeDisplayValue();
    await profilePage.assertInitialTimeFormatForElements();
    await profilePage.changeDisplayTimeValue();
    await profilePage.assertAfterTimeFormatForElements();
  });
});
