import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

const installedChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4180',
    browserName: 'chromium',
    launchOptions: existsSync(installedChrome) ? { executablePath: installedChrome } : {},
    trace: 'retain-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4180',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
