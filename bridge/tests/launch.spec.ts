import { _electron as electron, test } from '@playwright/test'

test('launch app', async () => {
    const electronApp = await electron.launch({ args: ['./src/index.ts'] })
    // close app
    await electronApp.close()
  })