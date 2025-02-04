const fs = require('node:fs/promises');
const axios = require('axios');
require('dotenv').config();
const data = require('../data/apidata.json');
const indexPage = require('./index.page');
let isValid;
const { expect, test } = require('@playwright/test');
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false,
});

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
  const response = await axios.get(url, { params ,httpsAgent: agent,});
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
  endDateObj.setDate(today.getDate() + 8); 
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
  const formattedDate = today.toLocaleDateString('en-US', options).replace(',', ''); 
  return formattedDate;
}
function nextWeekDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeekDayObj = new Date(today);
  nextWeekDayObj.setDate(today.getDate() + 7); 
  const nextWeekDay = nextWeekDayObj.getDate().toString();
  return nextWeekDay;
}

function previousWeekDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const previousWeekDateObj = new Date(today);
  previousWeekDateObj.setDate(today.getDate() - 7); 
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
function addDaysToCurrentDate(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return formatDate(today);
}
function getDateBasedOnDays(days) {
  const today = new Date(2025, 0, 1); 
  today.setDate(today.getDate() + days);
  const getDate = today.getDate();
  return getDate;
}

function getDayNameBasedOnDays(days) {
  const today = new Date(2025, 0, 1); 
  today.setDate(today.getDate() + days);
  const options = { weekday: 'long' };
  const dayName = today.toLocaleDateString('en-US', options);
  return dayName;
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

async function assertElementVisible(element, customText) {
  await test.step(customText, async () => {
    await expect(element).toBeVisible();
  });
}

async function assertValueToBe(actual, customText, expected) {
  await test.step(customText, async () => {
    await expect(expected).toBe(actual);
  });
}

async function assertElementNotVisible(element, customText) {
  await test.step(customText, async () => {
    await expect(element).not.toBeVisible();
  });
}

async function assertElementFocused(element, customText) {
  await test.step(customText, async () => {
    await expect(element).toBeFocused();
  });
}

async function assertEqualValues(value1, value2, customText) {
  await test.step(customText, async () => {
    await expect(value1).toEqual(value2);
  });
}
async function assertContainsValue(value1, value2, customText) {
  await test.step(customText, async () => {
    await expect(value1).toContain(value2);
  });
}

async function assertNotEqualValues(value1, value2, customText) {
  await test.step(customText, async () => {
    await expect(value1).not.toEqual(value2);
  });
}

async function assertElementHidden(page, selector, customText) {
  await test.step(customText, async () => {
    await expect(value1).not.toEqual(value2);
  });
  const element = await page.$(selector);
  await expect(element).not.toBeNull();
  await expect(element).toBeHidden();
}

async function assertTextPresent(page, text, customText) {
  await test.step(customText, async () => {
    await expect(page.locator(`text=${text}`)).toBeVisible();
  });
}

async function assertElementHaveText(page, selector, text, customText) {
  await test.step(customText, async () => {
    const element = await page.locator(selector);
    await expect(element).toHaveText(text);
  });
}

async function assertElementContainsText(element, text, customText) {
  await test.step(customText, async () => {
    await expect(element).toContainText(text);
  });
}

async function assertUrlContains(page, substring, customText) {
  await test.step(customText, async () => {
    const url = page.url();
    expect(url).toContain(substring);
  });
}

async function assertGreaterThan(value1, value2, customText) {
  await test.step(customText, async () => {
    await expect(value1).toBeGreaterThan(value2);
  });
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

async function assertElementAttribute(page, selector, attribute, value, customText) {
  await test.step(customText, async () => {
    const element = await page.locator(selector);
    const attributeValue = await element.getAttribute(attribute);
    expect(attributeValue).toBe(value);
  });
}

async function assertElementAttributeContains(locator, attribute, value, customText) {
  await test.step(customText, async () => {
    const attributeValue = await locator.getAttribute(attribute);
    expect(attributeValue).toContain(value);
  });
}

async function assertElementEnabled(element, customText) {
  await test.step(customText, async () => {
    const isEnabled = await element.isEnabled();
    expect(isEnabled).toBe(true);
  });
}

async function assertElementDisabled(element, customText) {
  await test.step(customText, async () => {
    const isDisabled = await element.isDisabled();
    expect(isDisabled).toBe(true);
  });
}

async function assertInputValue(page, selector, value, customText) {
  await test.step(customText, async () => {
    const element = await page.locator(selector);
    const inputValue = await element.inputValue();
    expect(inputValue).toBe(value);
  });
}

async function clickAndWaitForNavigation(page, selector, timeout = 30000) {
  const [response] = await Promise.all([page.waitForNavigation({ timeout }), page.click(selector)]);
  return response;
}

async function assertCheckboxChecked(element, customText) {
  await test.step(customText, async () => {
    const isChecked = await element.isChecked();
    expect(isChecked).toBe(true);
  });
}

async function assertCheckboxUnchecked(page, selector, customText) {
  await test.step(customText, async () => {
    const element = await page.locator(selector);
    const isChecked = await element.isChecked();
    expect(isChecked).toBe(false);
  });
}

async function assertElementInnerHtml(page, selector, html, customText) {
  await test.step(customText, async () => {
    const element = await page.locator(selector);
    const innerHtml = await element.innerHTML();
    expect(innerHtml).toBe(html);
  });
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
async function assertIsNumber(value, customText) {
  await test.step(customText, async () => {
    const numberValue = Number(value);
    expect(typeof numberValue).toBe('number');
  });
}
function getTodayDateAndYear() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${day}, ${year}`;
  return formattedDate;
}
async function checkVisibleElementColors(page, selector, expectedColor, customText) {
  await test.step(customText, async () => {
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
  });
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
async function verifyNavigationElements(page, locator, expectedArray, language) {
  const navigationItems = await page.locator(locator);
  for (let i = 0; i < expectedArray.length; i++) {
    const itemText = await navigationItems.nth(i).textContent();
    await test.step(`Verify that the value "${itemText.trim()}" is in "${language}"`, async () => {
      await expect(itemText.trim()).toEqual(expectedArray[i]);
    });
  }
}
async function clickRemindMeTomorrowButton(page) {
  const buttonLocator = page.locator("//button[text()='Remind Me Tomorrow']");
  try {
    await buttonLocator.waitFor({ state: 'visible', timeout: 5000 });
    await buttonLocator.click();
  } catch (error) {
    test.info("The 'Remind Me Tomorrow' button did not appear.");
  }
}

function checkTimeFormat(time) {
  const twelveHourFormatRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?[APap][Mm]$/;
  const twentyFourHourFormatRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (twelveHourFormatRegex.test(time)) {
    return '12 Hours';
  } else if (twentyFourHourFormatRegex.test(time)) {
    return '24 Hours';
  } else {
    return 'Invalid time format';
  }
}

function extractTime(text) {
  const timeRegex = /\b(\d{1,2}:\d{2}(?: ?[APMapm]{2})?)\b/;
  const match = text.match(timeRegex);
  return match ? match[0] : 'Time not found';
}

function getLastWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const lastSundayOffset = dayOfWeek === 0 ? -7 : -(dayOfWeek + 0);
  const startDate = addDaysToCurrentDate(lastSundayOffset); 
  const endDate = addDaysToCurrentDate(lastSundayOffset + 6); 
  return { startDate, endDate };
}
async function assertElementTrue(element) {
  expect(element).toBe(true);
}
async function assertElementColor(elementLocator, expectedColor) {
  const color = await elementLocator.evaluate(el => {
    return window.getComputedStyle(el).color;
  });
  expect(color).toBe(expectedColor);
}
async function verifyBackgroundColor(page, locator, expectedColor) {
  const actualColor = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    return window.getComputedStyle(element).backgroundColor;
  }, locator);
  expect(actualColor).toBe(expectedColor);
}
async function assertElementToBeEnabled(element) {
  await expect(element).toBeEnabled();
}
async function getFlowsheetCard(
  page,
  totalCardsLocator,
  flowsheetCardLocatorFn,
  jobNumberLocatorFn,
  defaultJobNumber,
  excludeText = 'TestAuto'
) {
  const totalRoomCount = await page.locator(totalCardsLocator).count();

  for (let i = 1; i <= totalRoomCount; i++) {
    const flowsheetCardXPath = flowsheetCardLocatorFn(i);
    const jobNumberXPath = jobNumberLocatorFn(i);

    try {
      await page.locator(flowsheetCardXPath).waitFor({ state: 'visible', timeout: 12000 });
    } catch (error) {
      continue;
    }
    const text = await page.locator(flowsheetCardXPath).textContent();
    if (text.includes(excludeText)) {
      continue;
    }
    const jobNumber = await page.locator(jobNumberXPath).textContent();
    if (jobNumber && jobNumber.trim() !== '') {
      return jobNumber;
    } else {
      return defaultJobNumber;
    }
  }
  return defaultJobNumber;
}
async function assertButtonDisabled(element) {
  const isButtonDisabled = await element.isDisabled();
  await expect(isButtonDisabled).toBe(true);
}
async function generateInvalidEmail() {
  const randomString = Math.random().toString(36).substring(2, 15);
  const invalidDomains = ['example', 'test', 'invalid', 'no-domain', 'wrong-format'];
  const randomDomain = invalidDomains[Math.floor(Math.random() * invalidDomains.length)];

  return `${randomString}@${randomDomain}`;
}

function getWeekStartDate() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(today.setDate(diff));
  const month = (monday.getMonth() + 1).toString();
  const dayOfMonth = monday.getDate().toString();
  const year = monday.getFullYear();
  return `${month}/${dayOfMonth}/${year}`;
}

function getLastWeekStartDate() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - (day === 0 ? 6 : day - 1) - 7;
  const lastMonday = new Date(today.setDate(diff));
  const month = (lastMonday.getMonth() + 1).toString();
  const dayOfMonth = lastMonday.getDate().toString();
  const year = lastMonday.getFullYear();
  return `${month}/${dayOfMonth}/${year}`;
}

function getLastMonthStartDate() {
  const today = new Date();
  const year = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const month = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const lastMonthStart = new Date(year, month, 1);
  const formattedMonth = (lastMonthStart.getMonth() + 1).toString();
  const dayOfMonth = lastMonthStart.getDate().toString();
  const formattedYear = lastMonthStart.getFullYear();
  return `${formattedMonth}/${dayOfMonth}/${formattedYear}`;
}

function getWeekBeforeLastRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekBeforeLastSundayOffset = dayOfWeek === 0 ? -14 : -(dayOfWeek + 7);
  const startDate = addDaysToCurrentDate(weekBeforeLastSundayOffset);
  const endDate = addDaysToCurrentDate(weekBeforeLastSundayOffset + 6);
  return { startDate, endDate };
}

function getCurrentMonthRange() {
  const today = new Date();
  const startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1)); 
  const endDate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)); 
  return { startDate, endDate };
}

function getPreviousMonthRange() {
  const today = new Date();
  const startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); 
  const endDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); 
  return { startDate, endDate };
}

async function assertElementsSortedZtoA(eventNames, customText) {
  await test.step(customText, async () => {
    if (!Array.isArray(eventNames) || eventNames.length === 0) {
      throw new Error('eventNames must be a non-empty array');
    }
    const trimmedNames = eventNames.map(name => name.replace(/^\d+-/, '').trim());
    const sortedNames = [...trimmedNames].sort((a, b) => b.localeCompare(a));

    expect(trimmedNames).toEqual(sortedNames);
  });
}

async function assertElementsSortedAtoZ(eventNames, customText) {
  await test.step(customText, async () => {
    if (!Array.isArray(eventNames) || eventNames.length === 0) {
      throw new Error('eventNames must be a non-empty array');
    }
    const trimmedNames = eventNames.map(name => name.replace(/^\d+-/, '').trim());
    const sortedNames = [...trimmedNames].sort((a, b) => a.localeCompare(b));

    expect(trimmedNames).toEqual(sortedNames);
  });
}

async function getTextFromElements(selector) {
  const textArray = await selector.evaluateAll(elements => {
    return elements.map(element => element.textContent.trim());
  });
  return textArray;
}
async function assertElementsSortedIncreasing(eventNumbers, customText) {
  await test.step(customText, async () => {
    if (!Array.isArray(eventNumbers) || eventNumbers.length === 0) {
      throw new Error('eventNumbers must be a non-empty array');
    }

    const trimmedNumbers = eventNumbers.map(number => number.replace(/^\D+/g, '').trim()); 
    const sortedNumbers = [...trimmedNumbers].sort((a, b) => parseInt(a) - parseInt(b));

    expect(trimmedNumbers).toEqual(sortedNumbers);
  });
}
async function assertElementsSortedDecreasing(eventNumbers, customText) {
  await test.step(customText, async () => {
    if (!Array.isArray(eventNumbers) || eventNumbers.length === 0) {
      throw new Error('eventNumbers must be a non-empty array');
    }

    const trimmedNumbers = eventNumbers.map(number => number.replace(/^\D+/g, '').trim()); 
    const sortedNumbers = [...trimmedNumbers].sort((a, b) => parseInt(b) - parseInt(a)); 

    expect(trimmedNumbers).toEqual(sortedNumbers);
  });
}

async function assertElementNotEditable(element, customText) {
  await test.step(customText, async () => {
    const isEditable = await element.isEditable();
    expect(isEditable).toBe(false);
  });
}

function getFormattedDate(daysToAdd = 0) {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


function formatDateForEvent(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const generateRandomNote = async () => {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `test_note_${randomNumber}`;
};

async function assertElementsToBe(element1, element2,customText) {
  await test.step(customText, async()=>{
    expect(element1).toBe(element2);
  })
}
async function getRandomDateFromRange(dateRange) {
  const [startDateStr, endDateStr] = dateRange.split(' - ');
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const diffInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const randomDays = Math.floor(Math.random() * diffInDays);
  const randomDate = new Date(startDate);
  randomDate.setDate(randomDate.getDate() + randomDays);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = randomDate.toLocaleDateString('en-US', options);
  return formattedDate.trim();
}

function formatTimeTo12Hour(time) {
  let isPM = false;
  if (time.includes('PM')) {
    isPM = true;
    time = time.replace('PM', '').trim();
  } else if (time.includes('AM')) {
    time = time.replace('AM', '').trim();
  }
  let [hours, minutes] = time.split(':').map(Number);
  if (isPM && hours !== 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0;
  }
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  return `${hours}:${minutes} ${period}`;
}

function getPreviousDateFromToday(days) {
  const today = new Date();
  const previousDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const formattedDate = 
      String(previousDate.getMonth() + 1).padStart(2, '0') + '/' +
      String(previousDate.getDate()).padStart(2, '0') + '/' +
      previousDate.getFullYear();

  return formattedDate;
}

function getFutureDateFromToday(days) {
  const today = new Date();
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  const formattedDate = 
      String(futureDate.getMonth() + 1).padStart(2, '0') + '/' +
      String(futureDate.getDate()).padStart(2, '0') + '/' +
      futureDate.getFullYear();
  return formattedDate;
}
function formatFutureDate(daysToAdd){
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysToAdd);

  const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  return futureDate.toLocaleDateString('en-US', options);
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
  assertElementFocused,
  assertValueToBe,
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
  addDaysToCurrentDate,
  todayDateWithoutMonthYear,
  getTodayDateAndMonth,
  getPreviousWeekDateAndMonth,
  getNextWeekDateAndMonth,
  getFormattedTodayDate,
  validateLastSyncedText,
  verifyNavigationElements,
  clickRemindMeTomorrowButton,
  checkTimeFormat,
  extractTime,
  getDateBasedOnDays,
  getDayNameBasedOnDays,
  getLastWeekRange,
  getWeekBeforeLastRange,
  getCurrentMonthRange,
  getPreviousMonthRange,
  assertElementTrue,
  assertElementColor,
  verifyBackgroundColor,
  assertElementToBeEnabled,
  getFlowsheetCard,
  assertButtonDisabled,
  generateInvalidEmail,
  getWeekStartDate,
  getLastWeekStartDate,
  getLastMonthStartDate,
  assertElementsSortedAtoZ,
  assertElementsSortedZtoA,
  getTextFromElements,
  assertElementsSortedIncreasing,
  assertElementsSortedDecreasing,
  assertElementNotEditable,
  getFormattedDate,
  formatDateForEvent,
  generateRandomNote,
  assertElementsToBe,
  getRandomDateFromRange,
  formatTimeTo12Hour,
  getPreviousDateFromToday,
  getFutureDateFromToday,
  formatFutureDate
};
