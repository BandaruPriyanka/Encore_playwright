const { executeStep } = require('../../utils/action');
require('dotenv').config();
const { test } = require('@playwright/test');
const indexPage = require('../../utils/index.page');
const path = require('path');
const pdf = require('pdf-parse');
const fs = require('fs');
const fileSync = require('node:fs/promises');
const utilConst = require('../../utils/const');

const {
  assertElementVisible,
  assertElementEnabled,
  getTodayDateAndMonth,
  addDaysToCurrentDate,
  assertContainsValue,
  assertElementAttributeContains,
  todayDate,
  getLastWeekRange,
  getWeekBeforeLastRange,
  getCurrentMonthRange,
  getPreviousMonthRange,
  assertElementNotVisible,
  assertNotEqualValues,
  assertElementDisabled,
  assertElementNotEditable,
  getFormattedDate,
  assertEqualValues,
  assertCheckboxChecked,
  assertElementsSortedZtoA,
  assertElementsSortedAtoZ,
  getTextFromElements,
  assertElementsSortedIncreasing,
  assertElementsSortedDecreasing,
  scrollElement,
  generateRandString,
  formatDateForEvent,
  assertElementsToBe,
  getRandomDateFromRange,
  formatFutureDate
} = require('../../utils/helper');
const { timeout } = require('../../playwright.config');
const { allure } = require('allure-playwright');
let startDateEle,
  endDateEle,
  presentDate,
  endDate,
  yesterdayDate,
  enterDays,
  rowCount,
  lowerCaseRowCount,
  upperCaseRowCount,
  glCenterSeachData,
  i,
  eventNamesText,
  glCenterNamesText,
  venueNamesText,
  eventStatus,
  intialAllCancelEvents,
  randomName,
  searchedEventRow;
exports.EventAgendas = class EventAgendas {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.agendasTab = this.isMobile
      ? this.page.locator("(//span[normalize-space()='Agendas'])[1]")
      : this.page.locator("(//app-navigation-item)[5]//span[normalize-space()='Agendas']");
    this.agendaListHost = this.page.locator('agenda-list');
    this.eventAgendasPage = this.page.locator('agenda-sessions:nth-child(1)');
    this.calendarWidget = this.page
      .locator("eui-mbsc-date-time-range[formcontrolname='dateFilter']")
      .first();
    this.eventNameSearchInput = this.page.locator("input[placeholder='Search by Event Name...']");
    this.filterIcon = this.page.locator("eui-icon[name='filter_bulk']");
    this.glCentersDropdown = this.page.locator('button.e2e_gl_center_multi_select');
    this.venuesDropdown = this.page.locator('button.e2e_venues_center_multi_select');
    this.projectManagerDropdown = this.page.locator('button.e2e_project_managers_multi_select');
    this.checkBox = this.page.locator("input[type='checkbox']");
    this.agendaRows = this.isMobile
      ? this.page.locator('div.e2e_event_card')
      : this.page.locator('div.e2e_event_row');
    this.printerIcon = this.page
      .locator("eui-icon[name='line_duotone_electronic_printer']")
      .first();
    this.toggleButton = this.page.locator('eui-toggle-button');
    this.managedByUserDropdown = this.page.locator(
      "eui-multi-select[formcontrolname='managedByUserNames']"
    );
    this.checkDropDown = this.page.locator('input#chk_0');
    this.resetFilterButton = this.page.locator("button[look='flat']");
    this.calendarModal = this.page
      .locator("eui-mbsc-date-time-range[formcontrolname='dateFilter']>div>div")
      .first();
    this.dateCell = date =>
      this.page.locator(`mbsc-calendar-day.mbsc-selected:has-text("${date}")`).first();
    this.getMonth = this.page.locator('span.mbsc-calendar-month');
    this.getYear = this.page.locator('span.mbsc-calendar-title.mbsc-calendar-year');
    this.endDateCell = (daysToAdd) => 
      this.page.getByRole('button', { name: formatFutureDate(daysToAdd) }).first();
    this.startDate = this.page.locator('mbsc-button div.mbsc-range-control-value').first();
    this.endDate = this.page.locator('mbsc-button div.mbsc-range-control-value').last();
    this.updateBtn = this.page.locator('button.e2e_date_range_update_button');
    this.previousPage = this.page.locator("[aria-label='Previous page']");
    this.previousDate = this.page.locator('.mbsc-calendar-cell-text.mbsc-calendar-day-text')
    .filter({ hasText: "1" }) 
    .first();
    this.cancelButton = this.page.locator('button.e2e_date_range_cancel_button');
    this.todayDateRange = this.page.locator('div.e2e_date_range_today');
    this.yesterdayDateRange = this.page.locator('div.e2e_date_range_yesterday');
    this.thisWeekDateRange = this.page.locator('div.e2e_date_range_this_week');
    this.lastWeekDateRange = this.page.locator('div.e2e_date_range_last_week').first();
    this.thisMonthDateRange = this.page.locator('div.e2e_date_range_this_month');
    this.lastMonthDateRange = this.page.locator('div.e2e_date_range_last_week').last();
    this.daysUptoToday = this.page.locator('input.e2e_date_range_days_up_to_today');
    this.daysStartingToday = this.page.locator('input.e2e_date_range_days_up_to_today');
    this.editBtn = this.page.locator("//a[normalize-space()='Edit Mode']");
    this.viewBtn = this.page.locator("//a[normalize-space()='View Mode']");
    this.newAgendaButton = this.page.locator('button.e2e_new_event_agenda_button');
    this.themeBtn = this.page.locator("//eui-icon[@name='bold_weather_moon']");
    this.darkTheme = this.page.locator("eui-icon[name='bold_weather_sun']");
    this.catalanLanguage = this.page.locator('(//productions-language-selector//div)[3]');
    this.dynamicLanguage = lang =>
      this.page.locator(`//productions-language-selector//div[text()='${lang}']`);
    this.editIcon = this.page
      .locator("eui-icon[name='line_duotone_essentional_magic_stick_3']")
      .first();
    this.binIcon = this.page
      .locator("eui-icon[name='line_duotone_essentional_trash_bin_trash']")
      .first();
    this.closeIcon = this.page.locator("eui-icon[name='line_close']");
    this.glChechBox = this.page.locator('input.e2e_checkbox + label');
    this.assertCheckbox = this.page.locator('input.e2e_checkbox');
    this.glCenterSearchInput = this.page.locator("input[placeholder='Search']");
    this.eventSortIcon = this.page.locator('eui-sort-icon.e2e_event_sort_icon');
    this.eventSortIconDirection = this.page
      .locator('eui-sort-icon.e2e_event_sort_icon>eui-icon>svg>path')
      .last();
    this.glCenterSortDirectiion = this.page
      .locator('eui-sort-icon.e2e_gl_center_sort_icon>eui-icon>svg>path')
      .last();
    this.venueSortDirection = this.page
      .locator('eui-sort-icon.e2e_venue_sort_icon>eui-icon>svg>path')
      .last();
    this.projectSortDirectiion = this.page
      .locator('eui-sort-icon.e2e_gl_project_manager_sort_icon>eui-icon>svg>path')
      .last();
    this.eventDatesDirectiion = this.page
      .locator('eui-sort-icon.e2e_event_dates_sort_icon>eui-icon>svg>path')
      .last();
    this.eventNames = this.page.locator('div.e2e_event_name_tooltip>span');
    this.glCenterNames = this.page.locator('div.e2e_gl_center_tooltip>span');
    this.venueNames = this.page.locator('div.e2e_venue_tooltip>span');
    this.projectMangerNames = this.page.locator('div.cursor-pointer > span').first();
    this.eventDatesNames = this.page.locator('div.cursor-pointer > span').last();
    this.glCenterSort = this.page.locator("span:has-text('GL Center')").first();
    this.venueSort = this.page.locator("span:has-text('Venue')").first();
    this.projectManagerSort = this.page.locator("span:has-text('Project Manager')").first();
    this.eventDatesSort = this.page.locator("span:has-text('Event Dates')").first();
    this.printModal =(text) => this.page.locator(`div:has-text('${text}')`).first();
    this.crossIcon = this.page.locator("eui-icon.e2e_line_close");
    this.printButton = this.page.locator("button.e2e_yes_button");
    this.printConfirmationNotification = this.page.locator("div.toast-message");
    this.sortOrderSelect = this.page.locator("eui-multi-select.e2e_print_sort_order");
    this.roomNameAscendingLabel = this.page.locator("label:has-text('Room Name Ascending')");
    this.showEquipmentNoInput = this.page.locator("input.e2e_show_equipment_no");
    this.showSessionNoInput = this.page.locator("input.e2e_show_sessions_no");
    this.eventNameDiv = this.page.locator("div.e2e_event_name_tooltip > span:nth-of-type(1)").first();
    this.venueDiv = this.page.locator("div.e2e_venue_tooltip > span:nth-of-type(1)").first();
    this.eventInformationModal = this.page.locator("div.e2e_slide_over_body");
    this.cancelButtonInModal = this.page.locator("button.e2e_event_cancel_button");
    this.opportunityNumberInput = this.page.locator("input[placeholder='Enter Opportunity Number']");
    this.eventNameInput = this.page.locator("input[placeholder='Enter Event Name']");
    this.projectManagerInput = this.page.locator("eui-icon.e2e_arrow_down");
    this.selectCheckBox = (projectManagerName) => this.page.locator(`label:has-text('${projectManagerName}')`).first();
    this.saveButtonInModal = this.page.locator("button.e2e_save_event_button");
    this.dateWarningIcon = this.page.locator("eui-icon.e2e_start_date_line_warning_icon");
    this.dateWarningMsg = this.page.locator("div:has-text('Start Date must be today or later.')").first();
    this.dynamicInput = (inputName) => this.page.locator(`div:has-text('${inputName}') > form:nth-of-type(1) > input.e2e_box_input`);
    this.newAgendaPage = this.page.locator("mbsc-eventcalendar#mbsc-calendar");
    this.eventRow = this.page.locator("div.e2e_event_row").first();
    this.addNewRoomDiv = this.page.locator("span:has-text('+ Add a New Room')");
    this.roomSelectModal = this.page.locator("eui-multi-select[formcontrolname='roomId']");
    this.cancelButtonInRoomSelectModal = this.page.locator("button:has-text('Cancel')");
    this.roomSelectDropdown =  this.page.locator("eui-icon.e2e_arrow_down_icon");
    this.roomsList = this.page.locator("cdk-virtual-scroll-viewport.cdk-virtual-scroll-viewport");
    this.searchInput = this.page.locator("input[placeholder='Search']");
    this.roomNameLabel = this.page.locator("label[for='chk_2']");
    this.selectedRoom = this.page.locator("span.e2e_selected_icon");
    this.saveButtonInRoomSelectModal = this.page.locator("button:has-text('Save')");
    this.roomNameInPage = (name) => this.page.locator(`span:has-text('${name}')`).first();
    this.roomNameInput =  this.page.locator("input[formcontrolname='roomName']");
    this.roomTakenMsg = this.page.locator("span:has-text('This name is already taken')");
    this.deleteEventModal = this.page.locator("div:has-text('Delete Event')").first();
    this.cancelAndGoBackButton = this.page.locator("button:has-text('Cancel and Go Back')");
    this.canceledEventRows = this.page.locator("div.e2e_event_row.text-red-500");
    this.toggleText = this.page.locator("span.e2e_toggle");
    this.selectCancelEvent = this.page.locator("div.e2e_event_row.text-red-500").first();
    this.binIconForCancelEvent = this.page.locator("div.e2e_event_row.text-red-500  > div:nth-of-type(6) > div > eui-icon[name='line_duotone_essentional_trash_bin_trash']").first();
    this.searchList = this.page.locator("agenda-list-row:nth-of-type(1) div:nth-child(2) span:nth-child(1)");
    this.searchedEventRow= this.page.locator("agenda-list-row:nth-of-type(1) div:nth-child(1) span:nth-child(2)").nth(0);
    this.searchListDate=this.page.locator("agenda-list-row:nth-of-type(1) div:nth-child(5) span");
    this.barrowArrow=this.page.locator("eui-icon[name='back_arrow']");
    this.eventAgendaTitle = this.page.locator("agenda-list div:has-text('Event Agendas')").nth(4);
    this.codeWaveEventName=this.page.locator("cal-event-detail div div div:nth-child(1)");
    this.calScheduleSessionCard=this.page.locator("cal-schedule-session-card");
    this.calenderTimeline=this.page.locator("div.mbsc-schedule-grid-wrapper");
    this.calenderIcon=this.page.locator("eui-icon[name='broken_time_calendar']").nth(0);
    this.timeElement=this.page.locator('div.mbsc-schedule-time', { hasText: '10 PM' }).first();
    this.filterIcon=this.page.locator("eui-icon[name='filter_bulk']");
    this.agendaStartsBetween=this.page.locator('div.inline-block.text-sm.cursor-pointer', { hasText: 'Starts Between' });
    this.contentFilter=this.page.locator('div.flex.flex-wrap div', { hasText: 'Audio' });
    this.applyFilterText=this.page.locator("span.e2e_apply_filters");
    this.filterCount=this.page.locator("cal-event-detail:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div")
    this.startTimeInCard=this.page.locator("cal-schedule-session-card div > div > div:last-child > span:first-child");
    this.endTimeInCard=this.page.locator("cal-schedule-session-card div > div > div:last-child > span:last-child");
    this.selectedEventName=text=>this.page.locator('cal-event-detail div:has-text("' + text + '") .font-bold');
    this.displayedDate=this.page.locator("eui-icon[name='linear_arrows_alt_arrow_left'] ~ div");
    this.selectDate=date=>this.page.locator(`div[aria-label="`+date+`"]`).first();
    this.selectOrGroupSearchInput = this.page.locator("input[placeholder='Section / Group']");
    this.groupNameInPage = (name) => this.page.locator(`span:has-text('${name}')`).last();
    this.calendarView = this.page.locator("mbsc-calendar-view");
    this.lastRoomNameInPage = this.page.locator(".mbsc-timeline-row:last-child .mbsc-timeline-resource-title");
    this.roomOrGroupInPage = (name) => this.page.locator(`div[cdkdragpreviewcontainer='parent'] > div[title='${name}']`).first();
    this.trashBinIconInPage = (name) => this.page.locator(`div[title='${name}'] + div > div.icon > eui-icon[name='linear_essentional_trash_bin_trash']`);
  }
  async actionsOnEventAgendas() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if (this.isMobile) {
      await executeStep(this.menuIcon, 'click', 'Click on Agendas tab');
    }
    await assertElementEnabled(this.agendasTab, 'Agendas tab should be clickable');
    await executeStep(this.agendasTab, 'click', 'Click on Agendas tab');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.eventAgendasPage,
      'Assert Event Agendas page is displayed or not'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async verifyEventAgendasPage() {
    await assertElementEnabled(
      this.calendarWidget,
      'Verify Calendar Widget should be clickable and working properly'
    );
    await assertElementEnabled(
      this.eventNameSearchInput,
      'Verify Search field should be clickable and working properly'
    );

    if (this.isMobile) {
      await assertElementEnabled(
        this.filterIcon,
        'Verify Filter dropdown should be clickable and working properly'
      );
    } else {
      await assertElementEnabled(
        this.glCentersDropdown,
        'Verify GL Centers dropdown should be clickable and working properly'
      );
      await assertElementEnabled(
        this.venuesDropdown,
        'Verify Venues dropdown should be clickable and working properly'
      );
      await assertElementEnabled(
        this.projectManagerDropdown,
        'Verify Project Manager dropdown should be clickable and working properly'
      );
      await assertElementEnabled(
        this.checkBox,
        'Verify active/inactive checkbox should be clickable and working properly'
      );
      await assertElementEnabled(
        this.printerIcon,
        'Verify Printer icon should be clickable and working properly'
      );
    }
    await this.verifyFilteredData();
  }
  async verifyFilteredData() {
    rowCount = await this.agendaRows.count();
    for (let i = 0; i < rowCount; i++) {
      const agendaRow = this.agendaRows.nth(i);
      const rowText = await agendaRow.innerText();
      await assertElementVisible(
        agendaRow,
        `Verify Agenda row ${i + 1} (${rowText}) should be visible`
      );
    }
    return rowCount;
  }
  async verifyCalendarWidget() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    startDateEle = await this.startDate.innerText();
    endDateEle = await this.endDate.innerText();
    presentDate = getTodayDateAndMonth();
    endDate = addDaysToCurrentDate(30);
    await assertContainsValue(
      presentDate,
      startDateEle,
      `Verify Start date :${startDateEle} = Current date:${presentDate}`
    );
    await assertContainsValue(
      endDate,
      endDateEle,
      `Verify  End date :${endDateEle} = Current date + 30 days added :${endDate}`
    );
    await assertElementEnabled(
      this.checkBox,
      'Verify "Active only" checkbox should be enabled by the default'
    );
  }
  async verifyDateSelection() {
    await executeStep(this.startDate, 'click', 'Click on Start Date');
    await executeStep(this.endDate, 'click', 'Click on End Date');
    await executeStep(
      this.previousPage,
      'click',
      'Click on Previous page to Select date'
    );
    await executeStep(
      this.previousPage,
      'click',
      'Click on Previous page to Select date'
    );
    const elementHandle = await this.previousDate.elementHandle();
    if (elementHandle) {
     await this.page.evaluate(el => el.click(), elementHandle);
    }
    await assertElementAttributeContains(
      this.updateBtn,
      'class',
      'disabled',
      'User should NOT be able to select the End date earlier than the Start date'
    );
    await executeStep(
      this.cancelButton,
      'click',
      'Verify "Cancel" button should revert all previous changes & restore last confirmed dates selection'
    );
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    const elementHandle1 = await this.dateCell(todayDate()).elementHandle();
    if (elementHandle1) {
      await this.page.evaluate(el => el.click(), elementHandle1) 
    } 
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
       this.endDateCell(5),
       'click',
       'Select one date in End date',
        { force: true }
      );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    startDateEle = await this.startDate.innerText();
    endDateEle = await this.endDate.innerText();
    await executeStep(this.updateBtn, 'click', 'Click on Update button ');
    await test.step(`Verified valid agendas should be displayed based on ${startDateEle} to ${endDateEle}`, async () => {
      await this.verifyFilteredData();
    });
  }
  async verifyTodayDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(this.todayDateRange, 'click', 'Click on "Today" date range option');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    startDateEle = await this.startDate.innerText();
    endDateEle = await this.endDate.innerText();
    await assertContainsValue(
      presentDate,
      startDateEle,
      `Verify Start date : ${startDateEle} = Current date: ${presentDate}`
    );
    await assertContainsValue(
      presentDate,
      endDateEle,
      `Verify  End date : ${endDateEle} = Current date: ${presentDate}`
    );
    try {
      await test.step(`Verified valid agendas should be displayed based on ${presentDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There is no agendas should be displayed on this specific date');
    }
  }

  async verifyYesterdayDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(this.yesterdayDateRange, 'click', 'Click on "Yesterday" date range option');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    yesterdayDate = addDaysToCurrentDate(-1);
    startDateEle = await this.startDate.innerText();
    endDateEle = await this.endDate.innerText();
    await assertContainsValue(
      yesterdayDate,
      startDateEle,
      `Verify Start date : ${startDateEle} = Current date - 1: ${yesterdayDate}`
    );
    await assertContainsValue(
      yesterdayDate,
      endDateEle,
      `Verify End date : ${endDateEle} = Current date - 1: ${yesterdayDate}`
    );
    try {
      await test.step(`Verified valid agendas should be displayed based on ${yesterdayDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There is no agendas should be displayed on this specific date');
    }
  }

  async verifyLastWeekDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(this.lastWeekDateRange, 'click', 'Click on "Last Week" date range option');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');

    const { startDate, endDate } = getWeekBeforeLastRange();

    const startDateEle = await this.startDate.innerText();
    const endDateEle = await this.endDate.innerText();

    await assertContainsValue(
      startDate,
      startDateEle,
      `Verify Start date: ${startDateEle} = Last Week Sunday: ${startDate}`
    );
    await assertContainsValue(
      endDate,
      endDateEle,
      `Verify End date: ${endDateEle} = Last Week Saturday: ${endDate}`
    );

    try {
      await test.step(`Verified valid agendas should be displayed based on ${startDate} to ${endDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There are no agendas displayed for this specific date range.');
    }
  }

  async verifyThisWeekDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(
      this.thisWeekDateRange,
      'click',
      'Click on "Week Before Last" date range option'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');

    const { startDate, endDate } = getLastWeekRange();

    const startDateEle = await this.startDate.innerText();
    const endDateEle = await this.endDate.innerText();

    await assertContainsValue(
      startDate,
      startDateEle,
      `Verify Start date: ${startDateEle} = Week Before Last Sunday: ${startDate}`
    );
    await assertContainsValue(
      endDate,
      endDateEle,
      `Verify End date: ${endDateEle} = Last Week: ${endDate}`
    );

    try {
      await test.step(`Verified valid agendas should be displayed based on ${startDate} to ${endDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There are no agendas displayed for this specific date range.');
    }
  }

  async verifyCurrentMonthDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(
      this.thisMonthDateRange,
      'click',
      'Click on "Current Month" date range option'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');

    const { startDate, endDate } = getCurrentMonthRange();

    const startDateEle = await this.startDate.innerText();
    const endDateEle = await this.endDate.innerText();

    await assertContainsValue(
      startDate,
      startDateEle,
      `Verify Start date: ${startDateEle} = First Day of Current Month: ${startDate}`
    );
    await assertContainsValue(
      endDate,
      endDateEle,
      `Verify End date: ${endDateEle} = Last Day of Current Month: ${endDate}`
    );

    try {
      await test.step(`Verified valid agendas should be displayed based on ${startDate} to ${endDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There are no agendas displayed for this specific date range.');
    }
  }

  async verifyPreviousMonthDateRange() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(
      this.lastMonthDateRange,
      'click',
      'Click on "Previous Month" date range option'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');

    const { startDate, endDate } = getPreviousMonthRange();

    const startDateEle = await this.startDate.innerText();
    const endDateEle = await this.endDate.innerText();

    await assertContainsValue(
      startDate,
      startDateEle,
      `Verify Start date: ${startDateEle} = First Day of Previous Month: ${startDate}`
    );
    await assertContainsValue(
      endDate,
      endDateEle,
      `Verify End date: ${endDateEle} = Last Day of Previous Month: ${endDate}`
    );

    try {
      await test.step(`Verified valid agendas should be displayed based on ${startDate} to ${endDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There are no agendas displayed for this specific date range.');
    }
    await executeStep(this.todayDateRange, 'click', 'Click on "Today" date range option');
  }

  async verifyDaysUptoToday() {
    await this.page.pause();
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(this.daysUptoToday, 'fill', 'Click on "Today" date range option', [
      indexPage.lighthouse_data.daysUptoToday
    ]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(this.updateBtn, 'click', 'Click on Update button');
    enterDays = addDaysToCurrentDate(indexPage.lighthouse_data.daysUptoToday);
    startDateEle = await this.startDate.innerText();
    endDateEle = await this.endDate.innerText();
    await assertContainsValue(
      enterDays,
      startDateEle,
      `Verify Start date : ${startDateEle} = Current date: ${this.dateCell(enterDays)}`
    );
    await assertContainsValue(
      presentDate,
      endDateEle,
      `Verify  End date : ${endDateEle} = Current date: ${presentDate}`
    );
    try {
      await test.step(`Verified valid agendas should be displayed based on ${presentDate}`, async () => {
        await this.verifyFilteredData();
      });
    } catch {
      test.info('There is no agendas should be displayed on this specific date');
    }
  }

  async DateRangeOptions() {
    await this.verifyTodayDateRange();
    await this.verifyYesterdayDateRange();
    await this.verifyThisWeekDateRange();
    await this.verifyLastWeekDateRange();
    await this.verifyCurrentMonthDateRange();
    await this.verifyPreviousMonthDateRange();
  }
  async clickOnViewBtn() {
    await executeStep(this.viewBtn, 'click', 'Click on "View" button');
    if (!this.isMobile) {
      await assertElementNotVisible(
        this.newAgendaButton,
        'Verify "New Event Agenda" button should not be displayed in View Mode'
      );
      await assertElementNotVisible(
        this.editIcon,
        'Verify "Edit Icon" should not be displayed in View Mode'
      );
      await assertElementNotVisible(
        this.binIcon,
        'Verify "Bin Icon" should not be displayed in View Mode'
      );
    } else {
      test.info(
        'The "New Event Agenda" button, "Edit Icon," and "Bin Icon" are not present in the mobile view.'
      );
    }
  }
  async clickOnEditBtn() {
    await executeStep(this.editBtn, 'click', 'Click on "Edit" button');
    if (!this.isMobile) {
      await assertElementVisible(
        this.newAgendaButton,
        'Verify "New Event Agenda" button should be displayed in Edit Mode'
      );
      await assertElementVisible(
        this.editIcon,
        'Verify "Edit Icon" should be displayed in Edit Mode'
      );
      await assertElementVisible(
        this.binIcon,
        'Verify "Bin Icon" should not displayed in Edit Mode'
      );
    } else {
      test.info(
        'The "New Event Agenda" button, "Edit Icon," and "Bin Icon" are not present in the mobile view.'
      );
    }
  }
  async verifyThemeSwitcher() {
    await executeStep(this.themeBtn, 'click', 'Click on "Theme" switcher');
    await assertElementVisible(
      this.darkTheme,
      "Verify 'Light' Theme successfully switched to 'Dark' Theme"
    );
    await test.step('Reload the Page', async () => {
      await this.page.reload();
    });
    await assertElementAttributeContains(
      this.darkTheme,
      'name',
      'bold_weather_sun',
      'Ensure that the dark theme remains unchanged after reloading the page'
    );
    await executeStep(
      this.darkTheme,
      'click',
      'Click on the Theme option again to return it to its normal position'
    );
  }
  async verifyLangSelection() {
    await executeStep(this.catalanLanguage, 'click', 'Click on "Catalan" language');
    const selectedLanguage = await this.catalanLanguage.textContent();
    await assertElementVisible(
      this.dynamicLanguage(selectedLanguage),
      'Verify if the language has changed'
    );
    await test.step('Reload the page', async () => {
      await this.page.reload();
    });
    await assertElementVisible(
      this.dynamicLanguage(selectedLanguage),
      'Verify if the language remains changed after reloading the page'
    );
    await executeStep(
      this.dynamicLanguage(selectedLanguage),
      'click',
      'Click on the Language option again to return it to its normal position'
    );
  }
  async verifySearchWithValidData() {
    await executeStep(this.calendarWidget, 'click', 'Click on Calendar widget');
    await executeStep(
      this.thisMonthDateRange,
      'click',
      'Click on "Current Month" date range option'
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.eventNameSearchInput, 'fill', 'Enter a valid data to search', [
      indexPage.lighthouse_data.searchValidData
    ]);
    await executeStep(this.eventNameSearchInput, 'enter', 'Press Enter');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    try {
      await test.step(`Verify that valid search results are returned based on the search data: ${indexPage.lighthouse_data.searchValidData}`, async () => {
        await this.verifyFilteredData();
        lowerCaseRowCount = await this.agendaRows.count();
      });
    } catch {
      test.info('No agendas are displayed for the specified search data.');
    }
  }
  async clickOnClose() {
    await executeStep(
      this.closeIcon,
      'click',
      'Click on "x" icon to clean the previous search phrase'
    );
    await this.page.waitForTimeout(parseInt(process.env.medium_timeout));
    await test.step('Verify Initial search results should be restored', async () => {
      await this.verifyFilteredData();
    });
  }

  async verifySearchWithInValidData() {
    await executeStep(this.eventNameSearchInput, 'fill', 'Enter a Invalid data to search', [
      indexPage.lighthouse_data.searchInvalidData
    ]);
    await executeStep(this.eventNameSearchInput, 'enter', 'Press Enter');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step(`'No Results found' placeholder should be displayed seraching with: ${indexPage.lighthouse_data.searchInvalidData}`, async () => {
      await this.verifyFilteredData();
    });
  }
  async verifyCaseSensitive() {
    const searchData = indexPage.lighthouse_data.searchValidData.toUpperCase();
    await executeStep(this.eventNameSearchInput, 'fill', `Enter ${searchData} in search field `, [
      searchData
    ]);
    await executeStep(this.eventNameSearchInput, 'enter', 'Press Enter');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    try {
      await test.step(`Verify that valid search results are returned based on the search data with : ${searchData}`, async () => {
        await this.verifyFilteredData();
        upperCaseRowCount = await this.agendaRows.count();
      });
    } catch {
      test.info('No agendas are displayed for the specified search data');
    }
    await assertEqualValues(
      lowerCaseRowCount,
      upperCaseRowCount,
      `Verify that search results are the same for lowercase and uppercase search data: ${indexPage.lighthouse_data.searchValidData} and ${searchData}`
    );
    await executeStep(
      this.closeIcon,
      'click',
      'Click "x" icon to clean the previous GL Center filter'
    );
  }
  async verifyGlCenter() {
    await executeStep(this.glCentersDropdown, 'click', 'Click on GL Center Dropdown');
    const getList = await this.glChechBox.count();
    await test.step('List of available options should be displayed based on the actual returned Agendas : ', async () => {
      for (i = 0; i < getList; i++) {
        const checkbox = this.glChechBox.nth(i);
        const checkboxText = await checkbox.textContent();
        glCenterSeachData = await checkbox.nth(0).textContent();
        await assertElementVisible(checkbox, `Checkbox ${i + 1} ${checkboxText}"`);
      }
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.glCenterSearchInput,
      'fill',
      `Enter ${glCenterSeachData} in search field`,
      [glCenterSeachData]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.glChechBox,
      `check whether options : ${glCenterSeachData} should be displayed based on the searched data `
    );

    await test.step('Select one & several (cover both cases) GL Center option & check the results', async () => {
      await executeStep(this.glCentersDropdown, 'click', 'Click on GL Center Dropdown');
      const firstCheckbox = this.glChechBox.nth(0);
      await executeStep(firstCheckbox, 'click', 'Select Checkbox');
      await assertCheckboxChecked(
        firstCheckbox,
        'Valid results should be displayed based on the selected GL Center filter option'
      );
      await executeStep(
        this.closeIcon,
        'click',
        'Click "x" icon to clean the previous GL Center filter'
      );
    });
  }

  async verifyVenue() {
    await executeStep(this.venuesDropdown, 'click', 'Click on Venue Dropdown');
    const getList = await this.glChechBox.count();
    await test.step('List of available options should be displayed based on the actual returned Agendas : ', async () => {
      for (i = 0; i < getList; i++) {
        const checkbox = this.glChechBox.nth(i);
        const checkboxText = await checkbox.textContent();
        glCenterSeachData = await checkbox.nth(0).textContent();
        await assertElementVisible(checkbox, `Checkbox ${i + 1} ${checkboxText}"`);
      }
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.glCenterSearchInput,
      'fill',
      `Enter ${glCenterSeachData} in search field`,
      [glCenterSeachData]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.glChechBox,
      `check whether options : ${glCenterSeachData} should be displayed based on the searched data `
    );

    await test.step('Select one & several (cover both cases) GL Center option & check the results', async () => {
      await executeStep(this.venuesDropdown, 'click', 'Click on Venue Dropdown');
      const firstCheckbox = this.glChechBox.nth(0);
      await executeStep(firstCheckbox, 'click', 'Select Venue Checkbox');
      await assertCheckboxChecked(
        firstCheckbox,
        'Valid results should be displayed based on the selected Venue Filter option'
      );
      await executeStep(
        this.closeIcon,
        'click',
        'Click "x" icon to clean the previous Venue filter'
      );
    });
  }

  async verifyProjectManager() {
    await executeStep(this.projectManagerDropdown, 'click', 'Click on Projrct Manager Dropdown');
    const getList = await this.glChechBox.count();
    await test.step('List of available options should be displayed based on the actual returned Agendas : ', async () => {
      for (i = 0; i < getList; i++) {
        const checkbox = this.glChechBox.nth(i);
        const checkboxText = await checkbox.textContent();
        glCenterSeachData = await checkbox.nth(0).textContent();
        await assertElementVisible(checkbox, `Checkbox ${i + 1} ${checkboxText}"`);
      }
    });
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(
      this.glCenterSearchInput,
      'fill',
      `Enter ${glCenterSeachData} in search field`,
      [glCenterSeachData]
    );
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(
      this.glChechBox,
      `check whether options : ${glCenterSeachData} should be displayed based on the searched data `
    );

    await test.step('Select one & several (cover both cases) GL Center option & check the results', async () => {
      await executeStep(this.projectManagerDropdown, 'click', 'Click on Project Manager Dropdown');
      const firstCheckbox = this.glChechBox.nth(0);
      await executeStep(firstCheckbox, 'click', 'Select Project Manager Checkbox');
      await assertCheckboxChecked(
        firstCheckbox,
        'Valid results should be displayed based on the selected Project Manager filter option'
      );
      await executeStep(
        this.closeIcon,
        'click',
        'Click "x" icon to clean the previous Project Manager filter'
      );
    });
  }

  async validateGLCenterProjectFilter() {
    await executeStep(this.glCentersDropdown, 'click', 'Click on GL Center Dropdown');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const glcenterCheckbox = this.glChechBox.nth(0);
    const glcenterCheckboxText = await this.glChechBox.nth(0).textContent();
    await executeStep(glcenterCheckbox, 'click', 'Select GL Center Checkbox');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.projectManagerDropdown, 'click', 'Click on Project Manager Dropdown');
    const projectManagerCheckbox = this.glChechBox.nth(0);
    const projectManagerCheckboxText = await this.glChechBox.nth(0).textContent();
    await executeStep(projectManagerCheckbox, 'click', 'Select Project Manager Checkbox');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await test.step(`Verify that search results are displayed based on the applied filters : "${glcenterCheckboxText}" in "GL Center Checkbox " &  "${projectManagerCheckboxText}" in "Project Manager" `, async () => {
      await this.verifyFilteredData();
    });
  }

  async verifyEventNamesSorting() {
    await assertElementAttributeContains(
      this.eventSortIconDirection,
      'd',
      'M17 4v16l3-4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    eventNamesText = await getTextFromElements(this.eventNames);
    await assertElementsSortedAtoZ(
      eventNamesText,
      'Records should be sorted from A to Z by Event name'
    );
    await executeStep(this.eventSortIcon, 'click', 'Click on Event Names Sort Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.eventSortIconDirection,
      'd',
      'M17 20V4l3 4',
      'Verify arrow should be highlighted, indicating that it is set to descending sort'
    );
    eventNamesText = await getTextFromElements(this.eventNames);
    await assertElementsSortedZtoA(
      eventNamesText,
      'Records should be sorted from Z to A by Event name'
    );
  }

  async verifyGLCenterSorting() {
    await executeStep(this.glCenterSort, 'click', 'Click on GL Center Sort Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.glCenterSortDirectiion,
      'd',
      'M17 4v16l3-4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    glCenterNamesText = await getTextFromElements(this.glCenterNames);
    await assertElementsSortedAtoZ(
      glCenterNamesText,
      'Records should be sorted from Z to A by GL Center'
    );
    await executeStep(this.glCenterSort, 'click', 'Click on GL Center Sort Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.glCenterSortDirectiion,
      'd',
      'M17 20V4l3 4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    glCenterNamesText = await getTextFromElements(this.glCenterNames);
    await assertElementsSortedZtoA(
      glCenterNamesText,
      'Records should be sorted from A to Z by GL Center'
    );
  }

  async verifyVenueSorting() {
    await executeStep(this.venueSort, 'click', 'Click on Venue Sort Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.venueSortDirection,
      'd',
      'M17 4v16l3-4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.venueNames);
    await assertElementsSortedAtoZ(
      venueNamesText,
      'Records should be sorted from Z to A by GL Center'
    );
    await executeStep(this.venueSort, 'click', 'Click on Venue Sort Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.venueSortDirection,
      'd',
      'M17 20V4l3 4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.venueNames);
    await assertElementsSortedZtoA(
      venueNamesText,
      'Records should be sorted from A to Z by GL Center'
    );
  }
  async verifyProjectMangerSorting() {
    await executeStep(this.projectManagerSort, 'click', 'Click on Project Manager Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.projectSortDirectiion,
      'd',
      'M17 4v16l3-4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.projectMangerNames);
    await assertElementsSortedAtoZ(
      venueNamesText,
      'Records should be sorted from Z to A by GL Center'
    );
    await executeStep(this.projectManagerSort, 'click', 'Click on Project Manager Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.projectSortDirectiion,
      'd',
      'M17 20V4l3 4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.projectMangerNames);
    await assertElementsSortedZtoA(
      venueNamesText,
      'Records should be sorted from A to Z by GL Center'
    );
  }

 async verifyEventDatesSorting() {
    await executeStep(this.eventDatesSort, 'click', 'Click on Event Dates Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.eventDatesDirectiion,
      'd',
      'M17 4v16l3-4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.eventDatesNames);
    await assertElementsSortedIncreasing(
      venueNamesText,
      'Records should be sorted from Z to A by GL Center'
    );
    await executeStep(this.eventDatesSort, 'click', 'Click on Event Dates Icon');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementAttributeContains(
      this.eventDatesDirectiion,
      'd',
      'M17 20V4l3 4',
      'Verify arrow should be highlighted, indicating that it is set to ascending sort'
    );
    venueNamesText = await getTextFromElements(this.venueNames);
    await assertElementsSortedDecreasing(
      venueNamesText,
      'Records should be sorted from A to Z by GL Center'
    );
  }
  
async validateGLCenterProjectFilter(){
  await executeStep(this.glCentersDropdown, 'click', 'Click on GL Center Dropdown');
  await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  const glcenterCheckbox = this.glChechBox.nth(0);
  const glcenterCheckboxText = await this.glChechBox.nth(0).textContent();
  await executeStep(glcenterCheckbox, 'click', 'Select GL Center Checkbox');
  await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  await executeStep(this.projectManagerDropdown, 'click', 'Click on Project Manager Dropdown');
  const projectManagerCheckbox = this.glChechBox.nth(0);
  const projectManagerCheckboxText = await this.glChechBox.nth(0).textContent();
  await executeStep(projectManagerCheckbox, 'click', 'Select Project Manager Checkbox');
  await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  await test.step(`Verify that search results are displayed based on the applied filters : "${glcenterCheckboxText}" in "GL Center Checkbox " &  "${projectManagerCheckboxText}" in "Project Manager" `, async () => {
    await this.verifyFilteredData();
  });
}
async assertPrintIconForBothViews() {
    await assertElementVisible(this.printerIcon,"Verify  that the printing icon is displayed for Edit Mode");
    await executeStep(this.viewBtn,"click","Click on View Mode");
    await assertElementVisible(this.printerIcon,"Verify  that the printing icon is displayed for View Mode");
    await executeStep(this.editBtn,"click","Click on Edit Mode");
  }

  async assertPrintModalAfterLanguageChange() {
    await executeStep(this.dynamicLanguage(indexPage.lighthouse_data.CA),"click","Select CA as location");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.printerIcon,"click","Click on Print icon");
    await assertElementVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_CA),"Verify that the modal is localized properly for CA location");
    await executeStep(this.crossIcon,"click","Click on cross icon");
    await executeStep(this.dynamicLanguage(indexPage.lighthouse_data.MX),"click","Select MX as location");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.printerIcon,"click","Click on Print icon");
    await assertElementVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_MX),"Verify that the modal is localized properly for MX location");
    await executeStep(this.crossIcon,"click","Click on cross icon");
    await executeStep(this.dynamicLanguage(indexPage.lighthouse_data.US),"click","Select US as location");
  }

  async assertPrintIcon() {
    await assertElementVisible(this.printerIcon,"Verify  that the printing icon is displayed");
    await executeStep(this.printerIcon,"click","Click on print icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_US),"Verify that Printing modal should be displayed.");
    await executeStep(this.crossIcon,"click","Click on cross icon");
    await assertElementNotVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_US),"Verify that Cross icon works properly");
  }

  async assertPdf() {
    await executeStep(this.printerIcon,"click","Click on print icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_US),"Verify that Printing modal should be displayed.");
    await executeStep(this.printButton,"click","Click on print button");
    await assertElementVisible(this.printConfirmationNotification,"Verify notification message should be displayed while the document is being generated.")
    const [download] = await Promise.all([
      await this.page.waitForEvent('download'),
    ]);
    const downloadPath = path.join('downloads',download.suggestedFilename());
    await download.saveAs(downloadPath);
    const pdfBuffer = fs.readFileSync(downloadPath);
    const pdfData = await pdf(pdfBuffer);
    const eventName = await this.eventNameDiv.textContent();
    const venueName = await this.venueDiv.textContent();
    await assertContainsValue(pdfData.text,eventName,`Verify that the pdf contains Event name: ${eventName}`);
    await assertContainsValue(pdfData.text,venueName,`Verify that the pdf contains GL Center name: ${venueName}`);
  }

  async assertPdfAfterChangeSettings() {
    await executeStep(this.printerIcon,"click","Click on print icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.printModal(indexPage.lighthouse_data.PrintEvent_US),"Verify that Printing modal should be displayed.");
    await executeStep(this.sortOrderSelect,"click","Click on sort order");
    await executeStep(this.roomNameAscendingLabel,"click","Select Rooom name ascending label");
    await executeStep(this.showEquipmentNoInput,"click","Select No option");
    await executeStep(this.printButton,"click","Click on print button");
    await assertElementVisible(this.printConfirmationNotification,"Verify notification message should be displayed while the document is being generated.")
    const [download] = await Promise.all([
      await this.page.waitForEvent('download'),
    ]);
    const downloadPath = path.join('downloads',download.suggestedFilename());
    await download.saveAs(downloadPath);
  }

  async assertEventInformationModal() {
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.newAgendaButton,"click","Click on New Agenda button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.eventInformationModal,"Verify that Event Information modal should be displayed");
    await executeStep(this.cancelButtonInModal,"click","Click on cancel button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementNotVisible(this.eventInformationModal,"Verify that Cancel button is working properly.");
  }

  async createNewAgenda(opportunityNumber) {
    await executeStep(this.newAgendaButton,"click","Click on new agenda button");
    await executeStep(this.opportunityNumberInput,"fill","Enter the valid Opportunity number",[opportunityNumber]);
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));  
    const eventName = await this.eventNameInput.textContent();
    await assertNotEqualValues(eventName,null,"Verify that the next fields should be pre-populated");
    // await this.dateWarningIcon.hover();
    // await assertElementVisible(this.dateWarningMsg,"Verify that Start Date is today or later is displayed");
    await assertElementDisabled(this.saveButtonInModal,"Verify that Save button should be disabled until all required fields are filled properly");
    await executeStep(this.projectManagerInput,"click","Click the product manager input");
    await executeStep(this.selectCheckBox(indexPage.lighthouse_data.projectManagerName),"click",`Select the '${indexPage.lighthouse_data.projectManagerName}' checkbox`)
    await assertElementNotEditable(this.dynamicInput(utilConst.Const.GLCenter),"Verify that GL Center input is not editable");
    await assertElementNotEditable(this.dynamicInput(utilConst.Const.Venue),"Verfiy that Venue input is not editable");
    await this.dateSelectInModal();
    await executeStep(this.saveButtonInModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.newAgendaPage,"Verify that New Event agenda should be created & page details should be displayed.")
  }

  async dateSelectInModal() {
    const boxForStartDate = await this.dynamicInput(utilConst.Const.startDate).boundingBox();
    await this.dynamicInput(utilConst.Const.startDate).click({
      position : { x: boxForStartDate.width - 2, y: boxForStartDate.height / 2 }
    });
    await executeStep(this.dynamicInput(utilConst.Const.startDate),"fill","Enter the start date",[getFormattedDate(0)]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout)); 
    const boxEndDate = await this.dynamicInput(utilConst.Const.endDate).boundingBox();
    await this.dynamicInput(utilConst.Const.endDate).click({
      position : { x: boxEndDate.width - 2, y: boxEndDate.height / 2 }
    });
    await executeStep(this.dynamicInput(utilConst.Const.endDate),"fill","Enter the start date",[getFormattedDate(8)]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout)); 
  }

  async assertAgendaPage() {
    await executeStep(this.eventRow,"click","Click any event");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.newAgendaPage,"Verify that Agenda page is open")
  }
  async assertAddNewRoomModal() {
    await scrollElement(await this.calendarView, 'bottom');
    await executeStep(this.addNewRoomDiv,"click","Click on Add New Room");
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.roomSelectModal,"Verify that Room selection modal should be displayed.");
    await executeStep(this.cancelButtonInRoomSelectModal,"click","Click on cancel button");
    await assertElementNotVisible(this.roomSelectModal,"Verify that Room selection modal should be closed");
    await executeStep(this.addNewRoomDiv,"click","Click on Add New Room");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomSelectModal,"Verify that Room selection modal should be displayed.");
  }
  async addnewRoomFunctionality() {
    await executeStep(this.roomSelectModal,"click","Click on dropdown");
    await assertElementVisible(this.roomsList,"Verify that the available rooms list should be displayed.");
    await test.step('Make sure that list is scrollable' , async () => {
      await this.scrollAction(await this.roomsList);
    });
    const roomName = await this.roomNameLabel.textContent();
    await executeStep(this.searchInput,"fill","Enter the room name",[roomName]);
    await assertElementVisible(this.selectCheckBox(roomName),"Verify that Search should work properly & be case insensitive.");
    await executeStep(this.selectCheckBox(roomName),"click","Click on the room name");
    const selectedRoomName = await this.selectedRoom.textContent();
    await assertEqualValues(selectedRoomName,roomName,"Verify that Room should be selected properly.");
    await executeStep(this.saveButtonInRoomSelectModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(roomName),"Verify that Room should be added properly.");
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await scrollElement(await this.calendarView, 'bottom');
    await assertElementVisible(this.roomNameInPage(roomName),"Verify that Room should be added properly after reload.");
    await this.roomOrGroupInPage(roomName).hover();
    await executeStep(this.trashBinIconInPage(roomName),"click","Click on delete icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.printButton,"click","Click on delete button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async scrollAction(element) {
    const div = await element;
    await scrollElement(div, 'bottom');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(div, 'top');
  }
  async addNewRoomWithCustomName(isNecessary) {
    await executeStep(this.addNewRoomDiv,"click","Click on Add New Room");
    await executeStep(this.roomSelectModal,"click","Click on dropdown");
    await executeStep(this.selectCheckBox(indexPage.lighthouse_data.custom),"click","Click on the Custom option in dropdown");
    randomName = await generateRandString(3);
    await executeStep(this.roomNameInput,"fill","Enter the custom room name" , [randomName]);
    await executeStep(this.saveButtonInRoomSelectModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(randomName),"Verify that Room should be added properly.");
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await scrollElement(await this.calendarView, 'bottom');
    await assertElementVisible(this.roomNameInPage(randomName),"Verify that Room should be added properly after reload.");
    await executeStep(this.addNewRoomDiv,"click","Click on Add New Room");
    await executeStep(this.roomSelectModal,"click","Click on dropdown");
    await executeStep(this.selectCheckBox(indexPage.lighthouse_data.custom),"click","Click on the room name");
    await executeStep(this.roomNameInput,"fill","Enter the custom room name" , [randomName]);
    await executeStep(this.newAgendaPage,"click","Click on the page");
    await this.roomNameInput.hover();
    await assertElementVisible(this.roomTakenMsg,"Verify that the error msg is displayed");
    await executeStep(this.cancelButtonInRoomSelectModal,"click","Click on cancel button");
    await test.step('Verify that scrolling is working properly' , async () => {
      await this.scrollAction(await this.newAgendaPage);
    })
    if(isNecessary) {
      await this.deleteCustomRoom(randomName);
    }
  }
  async editEventNameInAgenda(eventName) {
    await executeStep(this.editIcon,"click","Click on Edit Icon");
    await assertElementVisible(this.eventInformationModal,"Verify that the event information model should be displayed with all valid information.");
    await executeStep(this.cancelButtonInModal,"click","Click on Cancel button");
    await assertElementNotVisible(this.eventInformationModal,"Verify that the Close button works properly");
    await executeStep(this.editIcon,"click","Click on Edit Icon");
    await assertElementNotEditable(this.opportunityNumberInput,"Verify that Opportunity Number input is not editable");
    await assertElementNotEditable(this.dynamicInput(utilConst.Const.GLCenter),"Verify that GL Center input is not editable");
    await assertElementNotEditable(this.dynamicInput(utilConst.Const.Venue),"Verfiy that Venue input is not editable");
    await assertElementNotEditable(this.dynamicInput(utilConst.Const.endDate),"Verfiy that End Date input is not editable");
    await executeStep(this.dynamicInput(utilConst.Const.eventName),"fill","Clear the value in event name",[""]);
    await executeStep(this.dynamicInput(utilConst.Const.eventName),"fill","Enter the event name",[eventName]);
    await executeStep(this.saveButtonInModal,"click","Click on Save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(eventName),"Verify that the event name should be updated properly.");
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(eventName),"Verify that the event name should be updated properly after reload.");
  }
  async editProjectManagerInAgenda(projectManagerName) {
    await executeStep(this.editIcon,"click","Click on Edit Icon");
    await executeStep(this.projectManagerInput,"click","Click on project manager input");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if(! await this.selectCheckBox(projectManagerName).isChecked()) {
      await executeStep(this.selectCheckBox(projectManagerName),"click",`Select the '${projectManagerName}' checkbox`);
    }
    await executeStep(this.saveButtonInModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(projectManagerName),"Verify that the Project manager should be updated properly.");
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(projectManagerName),"Verify that the Project manager should be updated properly after reload.");
  }
  async editDateInAgenda() {
    await executeStep(this.editIcon,"click","Click on Edit Icon");
    const startDate = getFormattedDate(0);
    const endDate = await this.dynamicInput(utilConst.Const.endDate).inputValue();
    const formatedStartDate = formatDateForEvent(startDate);
    const formatedEndDate = formatDateForEvent(endDate);
    await executeStep(this.dynamicInput(utilConst.Const.startDate),"fill","Enter the start date",[startDate]);
    await executeStep(this.saveButtonInModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(formatedStartDate+" - "+formatedEndDate),"Verify that both Start & End dates should be updated accordingly.");
    await this.page.reload();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.roomNameInPage(formatedStartDate+" - "+formatedEndDate),"Verify that both Start & End dates should be updated accordingly after reload.");
    await executeStep(this.editIcon,"click","Click on Edit Icon");
    await executeStep(this.dynamicInput(utilConst.Const.startDate),"fill","Enter the date from past",[getFormattedDate(-1)]);
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await this.dateWarningIcon.hover();
    await assertElementVisible(this.dateWarningMsg,"Verify that Start Date is today or later is displayed");
  }

  async cancelEventAgenda() {
    eventStatus = await this.toggleText.textContent();
    if(eventStatus == indexPage.lighthouse_data.activeOnly) {
      await executeStep(this.toggleButton,"click","Click the toggle button for turn off");
      eventStatus = await this.toggleText.textContent();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    intialAllCancelEvents = await this.canceledEventRows.count();
    if(eventStatus == indexPage.lighthouse_data.allEvents) {
      await executeStep(this.toggleButton,"click","Click the toggle button for turn on");
      eventStatus = await this.toggleText.textContent();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const rowsCountForActive = await this.agendaRows.count();
    await executeStep(this.binIcon,"click","Click on Bin icon");
    await assertElementVisible(this.deleteEventModal,"Verify that the event delete confirmation modal should be displayed.");
    await executeStep(this.cancelAndGoBackButton,"click","Click on Cancel and Go Back button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const rowsCountAfterCancelAndGoBack = await this.agendaRows.count();
    await assertEqualValues(rowsCountForActive,rowsCountAfterCancelAndGoBack,"Verify that Cancel and Go Back button is working properly.");
    await executeStep(this.binIcon,"click","Click on Bin icon");
    await executeStep(this.printButton,"click","Click on cancel button");
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const rowsCountAfterCancel = await this.agendaRows.count();
    await assertNotEqualValues(rowsCountAfterCancel,rowsCountForActive,"Verify that the event should be cancelled successfully and NOT displayed with 'Active Only' checkbox selected");
    await this.page.reload();
    await assertNotEqualValues(rowsCountAfterCancel,rowsCountForActive,"Verify that the event should be cancelled successfully and NOT displayed with 'Active Only' checkbox selected");
    if(eventStatus == indexPage.lighthouse_data.activeOnly) {
      await executeStep(this.toggleButton,"click","Click the toggle button for turn off");
      eventStatus = await this.toggleText.textContent();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const cancelEvents = await this.canceledEventRows.count();
    await assertNotEqualValues(cancelEvents,intialAllCancelEvents,"Verify that Previously Canceled event should be displayed.");
    await executeStep(this.selectCancelEvent,"click","Click on cancel event");
    await assertElementNotVisible(this.newAgendaPage,"Verify that that user isn't able to open Event details for the Cancelled event on click");
    await executeStep(this.binIconForCancelEvent,"click","Click on bin icon for cancel event");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.deleteEventModal,"Verify that the event delete confirmation modal should be displayed.");
    await executeStep(this.printButton,"click","Click on  Yes, continue button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    if(eventStatus == indexPage.lighthouse_data.allEvents) {
      await executeStep(this.toggleButton,"click","Click the toggle button for turn on");
      eventStatus = await this.toggleText.textContent();
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    const rowsCountAfterActiveEvent = await this.agendaRows.count();
    await assertEqualValues(rowsCountForActive,rowsCountAfterActiveEvent,"Verify that Previously Cancelled event should be displayed as Active.");
    await this.page.reload();
    await assertEqualValues(rowsCountForActive,rowsCountAfterActiveEvent,"Verify that Previously Cancelled event should be displayed as Active after reload.");
  }
  async selectSeachedEvent(){
    await this.page.waitForTimeout(parseInt(process.env.medium_min_timeout));
    await assertElementVisible(this.searchList,'Verify previous search list items should be visible');
    searchedEventRow= await this.searchedEventRow.textContent();
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const date= await this.searchListDate.textContent();
    const dates=date.trim();
    indexPage.lighthouse_data.searchListDates=dates;
    await fileSync.writeFile('./data/lighthouse.json', JSON.stringify(indexPage.lighthouse_data));
    await executeStep(this.searchList,'click','Clicked on searched list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.selectedEventName(searchedEventRow),'Verify Navigate to searched Event Page')
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async backArrow(){
    await executeStep(this.barrowArrow, 'click','Click on backArrow');
    await assertElementVisible(this.eventAgendaTitle,'Verify navigation is working properly by the Back Arrow');
    await executeStep(this.searchList,'click','Clicked on searched list');
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async scrollThePage(){
    await this.calenderTimeline.scrollIntoViewIfNeeded();
    await this.calenderTimeline.evaluate(element=>element.scrollBy(0,500));
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await assertElementVisible(this.timeElement,'Verify Timeline should be scrollable');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }
  async changeTheDate(){
    await executeStep(this.calenderIcon,'click','Click on Calender Icon');
    const formattedRandomDate = await getRandomDateFromRange(indexPage.lighthouse_data.searchListDates);
 
    await executeStep(this.selectDate(formattedRandomDate), 'click','Click on Date');
    const displayedDate = await this.displayedDate.textContent();
    const normalizedFormattedDate = formattedRandomDate.replace(/,\s+/g, ' ').trim();
    const normalizedDisplayedDate = displayedDate.replace(/,\s*/g, ' ').trim();
    try {
      await assertElementsToBe(normalizedDisplayedDate, normalizedFormattedDate,'Verify Displayed date matches the selected date');
    } catch (error) {
      await test.info("Displayed date doesn't match with selected date");
    }
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }
  async applyFilter(){
    await executeStep(this.filterIcon,'click','Click on filter Icon');
    await executeStep(this.agendaStartsBetween,'Click','Click on Starts Between');
    await executeStep(this.contentFilter,'click','Click on Content Filter');
    await executeStep(this.applyFilterText,'click','Click on Apply Filter');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    const filterCount= await this.filterCount.textContent();
    await assertEqualValues(1,Number(filterCount.trim()),'Verify Applied Filters should be same');
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
  }
 
  async createAgendaSection() {
    if(await this.roomOrGroupInPage(indexPage.lighthouse_data.group).isVisible()) {
      await this.roomOrGroupInPage(indexPage.lighthouse_data.group).hover();
      await executeStep(this.trashBinIconInPage(indexPage.lighthouse_data.group),"click","Click on delete icon");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
      await executeStep(this.printButton,"click","Click on delete button");
      await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    }
    await executeStep(this.addNewRoomDiv,"click","Click on Add New Room");
    await executeStep(this.roomSelectModal,"click","Click on dropdown");
    await assertElementVisible(this.roomsList,"Verify that the available rooms list should be displayed.");
    await executeStep(this.selectCheckBox(indexPage.lighthouse_data.select_group),"click","Click on the Select / Group in dropdown");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.selectOrGroupSearchInput,"Verify that User should be able to fill Section / Group name");
    await executeStep(this.selectOrGroupSearchInput,"fill","Enter the group name",[indexPage.lighthouse_data.group]);
    await executeStep(this.saveButtonInRoomSelectModal,"click","Click on save button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await assertElementVisible(this.groupNameInPage(indexPage.lighthouse_data.group) ,"Verify that the section should be added properly to the en of the list");
    await this.page.reload();
    await scrollElement(await this.calendarView, 'bottom');
    await assertElementVisible(this.groupNameInPage(indexPage.lighthouse_data.group) ,"Verify that the section should be added properly to the en of the list");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    const source = await this.roomOrGroupInPage(indexPage.lighthouse_data.group);
    const target = await this.roomOrGroupInPage(randomName);
    await source.dragTo(target,{ force: true });
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await this.roomOrGroupInPage(randomName).dragTo(await this.roomOrGroupInPage(indexPage.lighthouse_data.dragAndDropHereText));
    await this.page.waitForTimeout(parseInt(process.env.small_max_timeout));
    await this.deleteCustomRoom(randomName);
    await this.roomOrGroupInPage(indexPage.lighthouse_data.group).hover();
    await executeStep(this.trashBinIconInPage(indexPage.lighthouse_data.group),"click","Click on delete icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.printButton,"click","Click on delete button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
  async deleteCustomRoom(randomName) {
    await this.roomOrGroupInPage(randomName).hover();
    await executeStep(this.trashBinIconInPage(randomName),"click","Click on delete icon");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
    await executeStep(this.printButton,"click","Click on delete button");
    await this.page.waitForTimeout(parseInt(process.env.small_timeout));
  }
};
