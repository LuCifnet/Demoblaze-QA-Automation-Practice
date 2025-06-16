import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

export default defineConfig({
  video: true,
  reporter: 'cypress-mochawesome-reporter', 
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true,
    charts: false,
    reportPageTitle: 'DemoBlaze Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: process.env.BASE_URL,
    retries: {
      runMode: 1,
      openMode: 1,
    },
    env: {
      DEFAULT_USER: process.env.DEFAULT_USER,
      DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
      FAKE_USER_USERNAME: process.env.FAKE_USER_USERNAME,
      FAKE_USER_PASSWORD: process.env.FAKE_USER_PASSWORD,
      SIGNUP_USER: process.env.SIGNUP_USER,
      SIGNUP_PASSWORD: process.env.SIGNUP_PASSWORD,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on) 
      return config
    },
  },
})
