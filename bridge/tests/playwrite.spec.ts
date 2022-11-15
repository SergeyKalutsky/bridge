import { test, Page } from '@playwright/test';
import { ElectronApplication } from 'playwright-core';
import { ElectronAppInfo, startApp } from './electronHelpers';

let appWindow: Page;
let appInfo: ElectronAppInfo;
let electronApp: ElectronApplication;

test.beforeAll(async () => {
  const startAppResponse = await startApp();
  appWindow = startAppResponse.appWindow;
  appInfo = startAppResponse.appInfo;
  electronApp = startAppResponse.electronApp;
});

test('test click', async () => {
  // Click button.
  await appWindow.locator('xpath=//span[contains(text(), "hh")]').click();
});


test.afterAll(async () => {
  await appWindow.screenshot({ path: 'screenshots/final-screen.png' });
  await appWindow.context().close();
});
