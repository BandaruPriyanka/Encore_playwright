const { executeStep } = require('../../utils/action');
const { test } = require('@playwright/test');
require('dotenv').config();

exports.DashboardPage = class DashboardPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
  }
};
