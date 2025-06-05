// import { defineConfig } from 'cypress'
// import * as dotenv from 'dotenv'

// // Load .env variables into process.env
// dotenv.config()

// export default defineConfig({
//   e2e: {
//     baseUrl: process.env.BASE_URL,
//     env: {...process.env},
//     setupNodeEvents(on, config) {
//       return config
//     },
//   },
// })


import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

// Load environment variables from .env
dotenv.config()

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    env: {
      DEFAULT_USER: process.env.DEFAULT_USER,
      DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
      FAKE_USER_USERNAME: process.env.FAKE_USER_USERNAME,
      FAKE_USER_PASSWORD: process.env.FAKE_USER_PASSWORD,
      SIGNUP_USER: process.env.SIGNUP_USER,
      SIGNUP_PASSWORD: process.env.SIGNUP_PASSWORD,
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
