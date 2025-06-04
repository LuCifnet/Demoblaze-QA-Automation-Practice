import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

// Load .env variables into process.env
dotenv.config()

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {...process.env},
    setupNodeEvents(on, config) {
      return config
    },
  },
})
