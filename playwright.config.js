// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { on } = require('events');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  timeout : 6*60*1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ["allure-playwright",
    {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: true,
      environmentInfo: {
        framework: "playwright",
      },
    },
  ]
],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout:120000,
    headless:false,
    video:'on',
    logLevel: 'error',
    screenshot:'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
       testMatch:['tests/flowsheet.spec.js','tests/flowsheet_card_tab.spec.js','tests/schedule.spec.js']
      
    },
    {
      name: "Mobile_Chrome",
      use: {
        ...devices["Pixel 7"],
        isMobile: true,
      },
      testMatch:['tests/flowsheet.spec.js','tests/flowsheet_card_tab.spec.js','tests/schedule.spec.js']
    },
    {
      name: "Mobile_Safari",
      use: {
        ...devices["iPhone 12"],
        isMobile: true,
      },
      testMatch:['tests/flowsheet.spec.js','tests/flowsheet_card_tab.spec.js','tests/schedule.spec.js']
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

