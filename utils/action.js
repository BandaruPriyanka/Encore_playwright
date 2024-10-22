import { allure } from 'allure-playwright';

export async function executeStep(element, action, description, data, timeout = 60000) {
  await allure.step(description, async () => {
    const options = timeout ? { timeout } : {};

    switch (action) {
      case 'click':
        await element.click(options);
        break;
      case 'fill':
        await element.fill(data[0], options);
        break;
      case 'selectOption':
        if (typeof data[0] === 'object') {
          await element.selectOption(data[0]);
        } else {
          await element.selectOption({ value: data[0] });
        }
        break;
      case 'navigate':
        await element.goto(data[0], options);
        break;
      case 'type':
        await element.type(data[0], options);
        break;
      case 'tap':
        await element.tap(options);
        break;
      case 'scroll':
        await element.scrollIntoViewIfNeeded(options);
        break;
      case 'doubleclick':
        await element.dblclick();
        break;
      case 'hover':
        await element.hover();
        break;
      case 'enter':
        await element.press('Enter', options);
        break;
    }
  });
}
