//pageobjects
import { LoginPage } from '../pageobjects/login_opportunity.page';
import { CreateData } from '../pageobjects/createdata.page';
import { NavigatorLoginPage } from '../pageobjects/login_navigator.page';
import { FlowSheetPage } from '../pageobjects/flowsheet/flowsheet.page';
import { FlowsheetCardAndTab } from '../pageobjects/flowsheet/flowsheet_card_tab.page';
import { SchedulePage } from '../pageobjects/schedule/schedule.page';

//datafile
import api_data from '../data/apidata.json';
import lighthouse_data from '../data/lighthouse.json';
import navigator_data from '../data/navigator.json';
import opportunity_data from '../data/opportunity.json';

export {
  LoginPage,
  CreateData,
  NavigatorLoginPage,
  FlowSheetPage,
  FlowsheetCardAndTab,
  SchedulePage,
  api_data,
  lighthouse_data,
  navigator_data,
  opportunity_data
};
