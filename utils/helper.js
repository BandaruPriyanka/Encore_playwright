const fs = require("node:fs/promises");
const axios = require("axios");
require("dotenv").config();
const data = require("../data/apidata.json");
const {expect } = require('@playwright/test');

function getTodayDate() {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  data.asOf = formattedDate;
  fs.writeFile("./data/apidata.json", JSON.stringify(data));
}

function generateRandString(numOfItr) {
  var genChars = "abcdefghijklmnopqrstuvwxyz12345";
  var returnStr = "";
  for (var i = 0; i < parseInt(numOfItr); i++) {
    returnStr =
      returnStr + genChars.charAt(Math.round(genChars.length * Math.random()));
  }
  return "TestAuto_" + returnStr;
}

async function lighthouseApi() {
  const url = process.env.api_url;
  getTodayDate();
  const params = {
    locationId: data.locationId,
    asOf: data.asOf,
    apiKey: data.apiKey,
  };
  const response = await axios.get(url, { params });
  console.log(response.status);
}

function startDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const startDay = today.getDate().toString().padStart(2, "0");
  const startDate = `${month}/${startDay}/${year}`;
  return startDate;
}

function endDate() {
  const today = new Date();
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() + 8);
  const endYear = endDateObj.getFullYear();
  const endMonth = (endDateObj.getMonth() + 1).toString().padStart(2, "0");
  const endDay = endDateObj.getDate().toString().padStart(2, "0");
  const endDate = `${endMonth}/${endDay}/${endYear}`;
  return endDate;
}

function todayDate() {
  const today = new Date();
  const todayDate = today.getDate().toString();
  return todayDate;
}

function nextDayDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const nextDayDate = today.getDate();
  return nextDayDate;
}

async function scrollElement(element, scrollTo) {
  await element.evaluate((el, scrollTo) => {
    el.scrollTop = scrollTo === "bottom" ? el.scrollHeight : 0;
  }, scrollTo);
}

// Check if an element is visible
async function assertElementVisible(element) {
  await expect(element).not.toBeNull();
  await expect(element).toBeVisible();
}

// Assert that two values are equal (case insensitive)
async function assertEqualValues(value1, value2) {
 await expect(value1).toEqual(value2);
}

// Check if an element is hidden
async function assertElementHidden(page, selector) {
  const element = await page.$(selector);
 await expect(element).not.toBeNull();
  await expect(element).toBeHidden();
}

// Check if the page contains specific text
async function assertTextPresent(page, text) {
  await expect(page.locator(`text=${text}`)).toBeVisible();
}

// Check if an element contains specific text
async function assertElementHaveText(page, selector, text) {
  const element = await page.locator(selector);
  await expect(element).toHaveText(text);
}

// Check if an element contains  text
async function assertElementContainsText(element,text) {
  // const element = await page.locator(selector);
  await expect(element).toContainText(text);
}

// Check if the URL contains a specific substring
async function assertUrlContains(page, substring) {
  const url = page.url();
  expect(url).toContain(substring);
}

// Take a screenshot of an element
async function screenshotElement(page, selector, path) {
  const element = await page.locator(selector);
  await element.screenshot({ path });
}

// Wait for an element to be visible
async function waitForElementVisible(page, selector, timeout = 30000) {
  await page.locator(selector).waitFor({ state: "visible", timeout });
}

// Wait for an element to be hidden
async function waitForElementHidden(page, selector, timeout = 30000) {
  await page.locator(selector).waitFor({ state: "hidden", timeout });
}

// Assert that a specific attribute of an element matches a value
async function assertElementAttribute(page, selector, attribute, value) {
  const element = await page.locator(selector);
  const attributeValue = await element.getAttribute(attribute);
  expect(attributeValue).toBe(value);
}
// Check if an element is enabled
async function assertElementEnabled(page, selector) {
  const element = await page.locator(selector);
  const isEnabled = await element.isEnabled();
  expect(isEnabled).toBe(true);
}

// Check if an element is disabled
async function assertElementDisabled(page, selector) {
  const element = await page.locator(selector);
  const isDisabled = await element.isDisabled();
  expect(isDisabled).toBe(true);
}

// Assert the value of an input field
async function assertInputValue(page, selector, value) {
  const element = await page.locator(selector);
  const inputValue = await element.inputValue();
  expect(inputValue).toBe(value);
}

// Click an element and wait for navigation
async function clickAndWaitForNavigation(page, selector, timeout = 30000) {
  const [response] = await Promise.all([
    page.waitForNavigation({ timeout }),
    page.click(selector),
  ]);
  return response;
}

// Check if a checkbox is checked
async function assertCheckboxChecked(page, selector) {
  const element = await page.locator(selector);
  const isChecked = await element.isChecked();
  expect(isChecked).toBe(true);
}

// Check if a checkbox is unchecked
async function assertCheckboxUnchecked(page, selector) {
  const element = await page.locator(selector);
  const isChecked = await element.isChecked();
  expect(isChecked).toBe(false);
}

// Get and assert the inner HTML of an element
async function assertElementInnerHtml(page, selector, html) {
  const element = await page.locator(selector);
  const innerHtml = await element.innerHTML();
  expect(innerHtml).toBe(html);
}

// Wait for an element to have a specific class
async function waitForElementClass(page, selector, className, timeout = 30000) {
  const element = await page.locator(selector);
  await element.waitFor({ state: "attached", timeout });
  const classes = await element.getAttribute("class");
  expect(classes).toContain(className);
}
// Write content to a file
async function writeFileSync(filePath, content) {
  await fs.writeFileSync(filePath, content, "utf8");
}
// Read content from a file
async function readFileSync(filePath) {
  await fs.readFileSync(filePath, "utf8");
}

// Append content to a file
function appendFileSync(filePath, content) {
  fs.appendFileSync(filePath, content, "utf8");
}

module.exports = {
  getTodayDate,
  generateRandString,
  lighthouseApi,
  startDate,
  endDate,
  todayDate,
  nextDayDate,
  scrollElement,
  assertElementVisible,
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
  waitForElementClass,
  writeFileSync,
  readFileSync,
  appendFileSync,
  assertEqualValues
};
