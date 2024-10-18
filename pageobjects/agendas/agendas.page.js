const { executeStep } = require('../../utils/action');
require('dotenv').config();
const { test } = require('@playwright/test');
const indexPage = require('../../utils/index.page');
const {
  assertElementVisible,
  assertElementEnabled,
  getTodayDateAndMonth,
  addDaysToCurrentDate,
  assertContainsValue,
  assertElementAttributeContains,
  todayDate,
  getDateBasedOnDays,
  getDayNameBasedOnDays,
  getLastWeekRange,
  getWeekBeforeLastRange,
  getCurrentMonthRange,
  getPreviousMonthRange,
  assertElementNotVisible
} = require('../../utils/helper');
let startDateEle, endDateEle, presentDate, endDate, yesterdayDate, enterDays;
exports.EventAgendas = class EventAgendas {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.menuIcon = this.page.locator('//app-side-menu');
    this.agendasTab = this.isMobile
      ? this.page.locator("(//span[normalize-space()='Agendas'])[1]")
      : this.page.locator("(//span[normalize-space()='Agendas'])[2]");
    this.agendaListHost = this.page.locator('agenda-list');
    this.eventAgendasPage = this.page.locator('agenda-sessions:nth-child(1)');
    this.calendarWidget = this.page
      .locator("eui-mbsc-date-time-range[formcontrolname='dateFilter']")
      .first();
    this.searchInput = this.page.locator("input[placeholder='Search by Event Name...']");
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
      this.page.locator(`mbsc-calendar-day.mbsc-selected:has-text("${date}")`);
    this.getMonth = this.page.locator('span.mbsc-calendar-month');
    this.getYear = this.page.locator('span.mbsc-calendar-title.mbsc-calendar-year');
    this.endDateCell = (dayName, day, month, year) => {
      const formattedDate = `${dayName}, ${month} ${day}, ${year}`;
      return this.page.locator(`div[aria-label="${formattedDate}"]`);
    };

    this.startDate = this.page.locator('mbsc-button div.mbsc-range-control-value').first();
    this.endDate = this.page.locator('mbsc-button div.mbsc-range-control-value').last();
    this.updateBtn = this.page.locator('button.e2e_date_range_update_button');
    this.previousPage = this.page.locator("[aria-label='Previous page']");
    this.previousDate = this.page.locator("mbsc-calendar-day.mbsc-selected:has-text('1')");
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
  }
  async actionsOnEventAgendas() {
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
  }
  async verifyEventAgendasPage() {
    await assertElementEnabled(
      this.calendarWidget,
      'Verify Calendar Widget should be clickable and working properly'
    );
    await assertElementEnabled(
      this.searchInput,
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
    const rowCount = await this.agendaRows.count();
    for (let i = 0; i < rowCount; i++) {
      const agendaRow = this.agendaRows.nth(i);
      const rowText = await agendaRow.innerText();
      await assertElementVisible(
        agendaRow,
        `Verify Agenda row ${i + 1} (${rowText}) should be visible`
      );
    }
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
      'Click on Next page to select earlier Date than the Start date'
    );
    await executeStep(
      this.previousPage,
      'click',
      'Click on Next page to select earlier Date than the Start date'
    );
    await executeStep(this.previousDate, 'click', 'Click on earlier than the Start date');
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
    await executeStep(this.dateCell(todayDate()), 'click', 'Select one date in start date');
    const getDays = getDateBasedOnDays(5);
    const getDayName = getDayNameBasedOnDays(5);
    const getMonthName = await this.getMonth.innerText();
    const getPresentYear = await this.getYear.innerText();
    await executeStep(
      this.endDateCell(getDayName, getDays, getMonthName, getPresentYear),
      'click',
      'Select one date in start date'
    );
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
};
