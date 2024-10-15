const { executeStep } = require('../../utils/action');
require('dotenv').config();
const {
  assertElementVisible,
  assertElementEnabled,
  getTodayDateAndMonth,
  addDaysToCurrentDate,
  assertContainsValue,
  assertElementAttributeContains,
  todayDate
} = require('../../utils/helper');
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
    this.startDate = this.page.locator('mbsc-button div.mbsc-range-control-value').first();
    this.endDate = this.page.locator('mbsc-button div.mbsc-range-control-value').last();
    this.updateBtn = this.page.locator('button.e2e_date_range_update_button');
    this.previousPage = this.page.locator("[aria-label='Previous page']");
    this.previousDate = this.page.locator("mbsc-calendar-day.mbsc-selected:has-text('1')");
    this.cancelButton = this.page.locator('button.e2e_date_range_cancel_button');
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
    const startDateEle = await this.startDate.innerText();
    const endDateEle = await this.endDate.innerText();
    const presentDate = getTodayDateAndMonth();
    const endDate = addDaysToCurrentDate(30);
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
    await executeStep(this.dateCell(19), 'click', 'Select one date in start date');
    await executeStep(this.updateBtn, 'click', 'Click on Update button ');
    await this.verifyFilteredData();
  }
};
