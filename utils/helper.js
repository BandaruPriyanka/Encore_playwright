const fs = require('node:fs/promises');
const axios = require('axios');
require('dotenv').config();
const data = require('../data/apidata.json');
const indexPage = require('./index.page');
let isValid;
const { expect} = require('@playwright/test');

function getTodayDate() {
  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  data.asOf = formattedDate;
  fs.writeFile('./data/apidata.json', JSON.stringify(data));
}

function generateRandString(numOfItr) {
  var genChars = 'abcdefghijklmnopqrstuvwxyz12345';
  var returnStr = '';
  for (var i = 0; i < parseInt(numOfItr); i++) {
    returnStr = returnStr + genChars.charAt(Math.round(genChars.length * Math.random()));
  }
  return 'TestAuto_' + returnStr;
}

async function lighthouseApi(isCreateData1) {
  const url = process.env.api_url;
  getTodayDate();
  let location;
  if (isCreateData1) {
    location = indexPage.opportunity_data.centerId_createData1;
  } else {
    location = indexPage.opportunity_data.centerId_createData2;
  }
  const params = {
    locationId: location,
    asOf: data.asOf,
    apiKey: data.apiKey
  };
  const response = await axios.get(url, { params });
}

function startDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const startDay = today.getDate().toString().padStart(2, '0');
  const startDate = `${month}/${startDay}/${year}`;
  return startDate;
}

function endDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() + 8); // Add 8 days
  const endYear = endDateObj.getFullYear();
  const endMonth = (endDateObj.getMonth() + 1).toString().padStart(2, '0');
  const endDay = endDateObj.getDate().toString().padStart(2, '0');
  const endDate = `${endMonth}/${endDay}/${endYear}`;
  return endDate;
}

function todayDateFullFormate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString();
  const startDay = today.getDate().toString();
  const startDate = `${month}/${startDay}/${year}`;
  return startDate;
}
function getFormattedTodayDate() {
  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options).replace(',', ''); // Remove comma between day and year
  return formattedDate;
}
function nextWeekDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeekDayObj = new Date(today);
  nextWeekDayObj.setDate(today.getDate() + 7); // Add 7 days
  const nextWeekDay = nextWeekDayObj.getDate().toString();
  return nextWeekDay;
}

function previousWeekDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const previousWeekDateObj = new Date(today);
  previousWeekDateObj.setDate(today.getDate() - 7); // subtract 7 days
  const previousWeekDay = previousWeekDateObj.getDate().toString();
  return previousWeekDay;
}

function todayDate() {
  const today = new Date();
  const todayDate = today.getDate().toString();
  return todayDate;
}

function todayDateWithLeadingZero() {
  const today = new Date();
  const todayDate = today.getDate().toString().padStart(2, '0');
  return todayDate;
}
function todayDateWithoutMonthYear() {
  const today = new Date();
  return today.getDate().toString();
}
function nextDayDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const nextDayDate = today.getDate();
  return nextDayDate;
}

function validDiscountGenerator() {
  const randomNumber = Math.floor(Math.random() * 25) + 1;
  return randomNumber.toString();
}

function invalidDiscountGenerator() {
  const randomNumber = Math.floor(Math.random() * (80 - 26 + 1)) + 26;
  return randomNumber.toString();
}

function calculateTotalAmountAfterDiscount(originalPrice, discountPercentage) {
  const discountAmount = (discountPercentage / 100) * originalPrice;
  const totalAmount = originalPrice - discountAmount;
  return totalAmount;
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, '0');
  const formattedTime = `${hours}`;
  return formattedTime;
}
function getCurrentMonth() {
  const now = new Date();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const monthIndex = now.getMonth();
  return months[monthIndex];
}

function formatDate(date) {
  const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(',', '');
}

function getTodayDateAndMonth() {
  const today = new Date();
  return formatDate(today);
}

function getPreviousWeekDateAndMonth() {
  const today = new Date();
  const previousWeek = new Date(today);
  previousWeek.setDate(today.getDate() - 7);
  return formatDate(previousWeek);
}
function getNextWeekDateAndMonth() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  return formatDate(nextWeek);
}

async function scrollElement(element, scrollTo) {
  await element.evaluate((el, scrollTo) => {
    el.scrollTop = scrollTo === 'bottom' ? el.scrollHeight : 0;
  }, scrollTo);
}

async function assertElementVisible(element) {
  await expect(element).toBeVisible();
}

async function assertElementNotVisible(element) {
  await expect(element).not.toBeVisible();
}

async function assertEqualValues(value1, value2) {
  await expect(value1).toEqual(value2);
}
async function assertContainsValue(value1, value2) {
  expect(value1).toContain(value2);
}

async function assertNotEqualValues(value1, value2) {
  await expect(value1).not.toEqual(value2);
}

async function assertElementHidden(page, selector) {
  const element = await page.$(selector);
  await expect(element).not.toBeNull();
  await expect(element).toBeHidden();
}

async function assertTextPresent(page, text) {
  await expect(page.locator(`text=${text}`)).toBeVisible();
}

async function assertElementHaveText(page, selector, text) {
  const element = await page.locator(selector);
  await expect(element).toHaveText(text);
}

async function assertElementContainsText(element, text) {
  await expect(element).toContainText(text);
}

async function assertUrlContains(page, substring) {
  const url = page.url();
  expect(url).toContain(substring);
}

async function assertGreaterThan(value1, value2) {
  await expect(value1).toBeGreaterThan(value2);
}

async function screenshotElement(page, selector, path) {
  const element = await page.locator(selector);
  await element.screenshot({ path });
}

async function waitForElementVisible(page, selector, timeout = 30000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

async function waitForElementHidden(page, selector, timeout = 30000) {
  await page.locator(selector).waitFor({ state: 'hidden', timeout });
}

async function assertElementAttribute(page, selector, attribute, value) {
  const element = await page.locator(selector);
  const attributeValue = await element.getAttribute(attribute);
  expect(attributeValue).toBe(value);
}

async function assertElementAttributeContains(locator, attribute, value) {
  const attributeValue = await locator.getAttribute(attribute);
  expect(attributeValue).toContain(value);
}

async function assertElementEnabled(element) {
  const isEnabled = await element.isEnabled();
  expect(isEnabled).toBe(true);
}

async function assertElementDisabled(element) {
  const isDisabled = await element.isDisabled();
  expect(isDisabled).toBe(true);
}

async function assertInputValue(page, selector, value) {
  const element = await page.locator(selector);
  const inputValue = await element.inputValue();
  expect(inputValue).toBe(value);
}

async function clickAndWaitForNavigation(page, selector, timeout = 30000) {
  const [response] = await Promise.all([page.waitForNavigation({ timeout }), page.click(selector)]);
  return response;
}

async function assertCheckboxChecked(page, selector) {
  const element = await page.locator(selector);
  const isChecked = await element.isChecked();
  expect(isChecked).toBe(true);
}

async function assertCheckboxUnchecked(page, selector) {
  const element = await page.locator(selector);
  const isChecked = await element.isChecked();
  expect(isChecked).toBe(false);
}

async function assertElementInnerHtml(page, selector, html) {
  const element = await page.locator(selector);
  const innerHtml = await element.innerHTML();
  expect(innerHtml).toBe(html);
}

async function waitForElementClass(page, selector, className, timeout = 30000) {
  const element = await page.locator(selector);
  await element.waitFor({ state: 'attached', timeout });
  const classes = await element.getAttribute('class');
  expect(classes).toContain(className);
}

async function writeFileSync(filePath, content) {
  await fs.writeFileSync(filePath, content, 'utf8');
}

async function readFileSync(filePath) {
  await fs.readFileSync(filePath, 'utf8');
}

function appendFileSync(filePath, content) {
  fs.appendFileSync(filePath, content, 'utf8');
}
async function assertIsNumber(value) {
  const numberValue = Number(value);
  expect(typeof numberValue).toBe('number'); // Assert that it is of type 'number'
}
function getTodayDateAndYear() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${day}, ${year}`;
  return formattedDate;
}
async function checkVisibleElementColors(page, selector, expectedColor) {
  const elements = await page.$$(selector);
  let visibleElementCount = 0;
  for (const element of elements) {
    const isVisible = await element.isVisible();
    if (isVisible) {
      const elementColor = await element.evaluate(
        el => getComputedStyle(el).fill || getComputedStyle(el).color
      );
      expect(elementColor).toBe(expectedColor);
      visibleElementCount++;
    }
  }
}
async function validateLastSyncedText(lastSyncedText) {
  const match = lastSyncedText.match(/(\d+)([a-zA-Z]+)/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    isValid = false;
    if (unit.includes('w') || unit.includes('hr') || unit.includes('min')) {
      isValid = value > 0;
    }
    return isValid;
  } else {
    throw new Error('Could not parse the last synced value.');
  }
}
async function verifyNavigationElements(page, locator, expectedArray,language) {
  const navigationItems = await page.locator(locator);
  for (let i = 0; i < expectedArray.length; i++) {
      const itemText = await navigationItems.nth(i).textContent();
      await test.step(`Verify that the value "${itemText.trim()}" is in "${language}"` , async () => {
        await expect(itemText.trim()).toEqual(expectedArray[i]);
      })
  }
}
async function clickRemindMeTomorrowButton(page) {
  const buttonLocator = page.locator("//button[text()='Remind Me Tomorrow']");
  try {
    await buttonLocator.waitFor({ state: 'visible', timeout: 5000 }); 
    await buttonLocator.click(); 
  } catch (error) {
    console.log("The 'Remind Me Tomorrow' button did not appear.");
  }
}

module.exports = {
  getTodayDate,
  generateRandString,
  lighthouseApi,
  startDate,
  endDate,
  todayDateFullFormate,
  nextWeekDate,
  previousWeekDate,
  todayDate,
  todayDateWithLeadingZero,
  nextDayDate,
  validDiscountGenerator,
  invalidDiscountGenerator,
  calculateTotalAmountAfterDiscount,
  formatCurrency,
  getFormattedTime,
  getCurrentMonth,
  scrollElement,
  assertElementVisible,
  assertElementNotVisible,
  assertElementHidden,
  assertTextPresent,
  assertElementHaveText,
  assertElementContainsText,
  assertUrlContains,
  screenshotElement,
  waitForElementVisible,
  waitForElementHidden,
  assertElementAttribute,
  assertElementEnabled,
  assertElementDisabled,
  assertInputValue,
  clickAndWaitForNavigation,
  assertCheckboxChecked,
  assertCheckboxUnchecked,
  assertElementInnerHtml,
  assertGreaterThan,
  waitForElementClass,
  writeFileSync,
  readFileSync,
  appendFileSync,
  assertEqualValues,
  assertNotEqualValues,
  assertIsNumber,
  assertElementAttributeContains,
  checkVisibleElementColors,
  assertContainsValue,
  getTodayDateAndYear,
  todayDateWithoutMonthYear,
  getTodayDateAndMonth,
  getPreviousWeekDateAndMonth,
  getNextWeekDateAndMonth,
  getFormattedTodayDate,
  validateLastSyncedText,
  verifyNavigationElements,
  clickRemindMeTomorrowButton
};
