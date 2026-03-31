import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  
  /* Configuración global para los tests */
  use: {
    /* ✅ 1. Activamos la URL base para que sepa dónde está tu app */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    /* ❌ 2. Quitamos Safari (WebKit) porque da error en tu Mac 2015
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }, 
    */
  ],

  /* ✅ 3. Activamos el servidor para que Playwright prenda la web solo */
  webServer: {
    command: 'npm run dev', // Usamos dev para que arranque rápido
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});