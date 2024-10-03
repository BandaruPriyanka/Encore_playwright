# Encore

## Project Overview

This project is designed to perform automated testing using **Playwright** across multiple platforms, including desktop browsers, mobile Chrome, and iOS Safari. It covers both UI and functional testing to ensure a seamless user experience across devices.

The test suite includes:

- **UI Tests**: For verifying functionality and visual aspects of the application in desktop browsers like Chrome and Firefox.
- **Mobile Tests (Chrome)**: For testing the application on mobile Chrome to ensure it works on smaller screens and mobile environments.
- **iOS Tests (Mobile Safari)**: For validating the application's performance and behavior on iOS devices using Safari.

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

1. **Node.js** (Version 14 or later)

   - Node.js is required to run the Playwright test suite.
   - You can download Node.js from [node.js](https://nodejs.org/)

   To check if Node.js is installed and to verify the version, run the following command in your terminal:

   ```bash
   node -v.

   ```

2. **Visual Studio Code**

   - Use a code editor like [Visual Studio Code](https://code.visualstudio.com/) or any editor of your choice.

3. **Browser**
   - Ensure you have a supported browser installed (e.g., Chrome, Firefox, Edge).
     After ensuring you have these prerequisites, follow the Installation steps to set up the project.

## Installation

Clone the repository:
git clone https://github.com/BandaruPriyanka/Encore_playwright

Navigate to the project directory:
cd your-repo

Install the dependencies:
npm install

## Project Folder Structure

```
Encore
├── data
├── pageobjects
│ ├── flowsheet
│ │ └── flowsheet.page.js
│ ├── schedule
│ │ └── schedule.page.js
│ ├── customer
│ │ └── customer.page.js
│ ├── chat
│ │ └── chat.page.js
│ └── event
│ └── event.page.js
├── tests
│ ├── flowsheet.spec.js
│ ├── schedule.spec.js
│ ├── customer.spec.js
│ ├── chat.spec.js
│ └── event.spec.js
├── utils
│ ├── action.js
│ ├── const.js
│ ├── helper.js
│ └── index.page.js
├── env
├── azure-pipeline.yml
├── package-lock.json
├── package.json
├── playwright.config.js
└── README.md
```

## Running Tests

- Before running any test case run this to clean allure results : `npm run clean:allure-results`

- Before running lighthouse testcases run the below commands for creating the data:
  `npm run createdata1` and `npm run createdata2`

- To run **UI** tests follow this command : `npm run ui`

- To run **Mobile** tests follow this command : `npm run mobile_chrome`

- To run **iOS** tests follow this command : `npm run ios`

- To generate allure report : `npm run allure-report`
