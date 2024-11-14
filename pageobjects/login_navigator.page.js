require('dotenv').config();
const { executeStep } = require('../utils/action');

exports.NavigatorLoginPage = class NavigatorLoginPage {
  constructor(page) {
    this.page = page;
    this.inputEmailId = this.page.locator('#userNameInput');
    this.inputPassword = this.page.locator('#passwordInput');
    this.signInBtn = this.page.locator('#submitButton');
  }

  async login_navigator(email_id, password) {
    await executeStep(this.inputEmailId, 'fill', 'Fill in the email field', [email_id]);
    await executeStep(this.inputPassword, 'fill', 'Fill in the password field', [password]);
    await executeStep(this.signInBtn, 'click', 'Click the sign-in button');
  }
};
