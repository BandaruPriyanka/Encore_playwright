require('dotenv').config();
const { executeStep } = require('../utils/action');
exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.isMobile = this.page.context()._options.isMobile;
    this.inputEmail = this.page.locator("//input[@type='email']");
    this.submitButton = this.page.locator("//input[@type='submit']");
    this.inputPassword = this.page.locator("//input[@type='password']");
    this.noButton = this.page.locator("//input[@type='button']");
    this.profileButton = this.page.locator("//div[@id='mectrl_headerPicture']");
  }

  async login(email, password) {
    await executeStep(this.inputEmail, 'fill', 'Fill in the email field', [email]);
    await executeStep(this.submitButton, 'click', 'Click the submit button for emai');
    await executeStep(this.inputPassword, 'fill', 'Fill in the password field', [password]);
    await executeStep(this.submitButton, 'click', 'Click the submit button for password');
    if (!this.isMobile) {
      await executeStep(this.noButton, 'click', 'Click the no button');
    }
  }
};
