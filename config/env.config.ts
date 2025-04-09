export const envConfig = {
  baseUrl: 'https://api.vkho.net',
  apiVersion: 'v1',
  timeout: 30000,
  retryAttempts: 3,
  environments: {
    development: {
      baseUrl: 'https://api.vkho.net',
      apiKey: process.env.API_KEY || '',
    },
    staging: {
      baseUrl: 'https://api.vkho.net',
      apiKey: process.env.STAGING_API_KEY || '',
    },
    production: {
      baseUrl: 'https://api.vkho.net',
      apiKey: process.env.PROD_API_KEY || '',
    },
  },
}; 