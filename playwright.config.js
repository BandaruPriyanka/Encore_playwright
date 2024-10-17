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
  timeout: 8 * 60 * 1000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? undefined : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // ['html'],
    [
      'allure-playwright',
      {
        detail: false,
        outputFolder: 'allure-results',
        suiteTitle: false,
        environmentInfo: {
          framework: 'playwright'
        }
      }
    ]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    actionTimeout: 120000,
    headless: false,
    video: 'on',
    logLevel: 'error',
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'global_setup',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['tests/global_setup.spec.js']
    },
    {
      name: 'create_data1',
      use: { ...devices['Desktop Chrome'], isCreateData1: true },
      testMatch: ['tests/create_data.spec.js']
    },
    {
      name: 'create_data2',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['tests/create_data.spec.js']
    },
    {
      name: 'complimentary_job',
      use: { ...devices['Desktop Chrome'], isCreateData1: true, isComplimentary: true },
      testMatch: ['tests/create_data.spec.js']
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: './data/storageState.json' },
      testMatch: [
        'tests/flowsheet.spec.js',
        'tests/flowsheet_card_tab.spec.js',
        'tests/schedule.spec.js',
        'tests/customers.spec.js',
        'tests/chats.spec.js',
       'tests/my_profile.spec.js',
        'tests/location_profile.spec.js',
        'tests/lhs_event_agendas.spec.js',
        'tests/dashboard.spec.js'
      ],
      // dependencies: ['global_setup']
    },
    {
      name: 'docusign_disabled_all_Desktop_Chrome',
      testMatch: ['tests/docuSign_disable.spec.js'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './data/storageState.json'
      }
      //dependencies: ['global_setup', 'create_data2']
    },
    {
      name: 'docusign_disabled_all_Pixel_7',
      testMatch: ['tests/docuSign_disable.spec.js'],
      use: {
        ...devices['Pixel 7'],
        isMobile: true,
        storageState: './data/storageState.json'
      }
      //dependencies: ['global_setup', 'create_data2']
    },
    {
      name: 'docusign_disabled_all_iPhone_12',
      testMatch: ['tests/docuSign_disable.spec.js'],
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        storageState: './data/storageState.json'
      }
      // dependencies: ['global_setup', 'create_data2']
    },
    {
      name: 'Mobile_Chrome',
      use: {
        ...devices['Pixel 7'],
        isMobile: true,
        storageState: './data/storageState.json'
      },
      testMatch: [
        'tests/flowsheet.spec.js',
        'tests/flowsheet_card_tab.spec.js',
        'tests/schedule.spec.js',
        'tests/customers.spec.js',
        'tests/chats.spec.js',
        'tests/my_profile.spec.js',
        'tests/location_profile.spec.js',
        'tests/lhs_event_agendas.spec.js',
        'tests/dashboard.spec.js'
      ]
      // dependencies: ['global_setup', 'create_data1']
    },
    {
      name: 'Mobile_Safari',
      use: {
        ...devices['iPhone 12'],
        isMobile: true,
        storageState: './data/storageState.json'
      },
      testMatch: [
        'tests/flowsheet.spec.js',
        'tests/flowsheet_card_tab.spec.js',
        'tests/schedule.spec.js',
        'tests/customers.spec.js',
        'tests/chats.spec.js',
        'tests/my_profile.spec.js',
        'tests/location_profile.spec.js',
        'tests/lhs_event_agendas.spec.js',
        'tests/dashboard.spec.js'
      ]
      // dependencies: ['global_setup', 'create_data1']
    }
  ]
});
