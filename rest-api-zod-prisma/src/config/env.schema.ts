export const envSchema = {
  type: 'object',
  required: [ 'PORT', 'DATABASE_URL', 'JWT_SECRET' ],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    DATABASE_URL: {
      type: 'string'
    },
    JWT_SECRET: {
      type: 'string'
    }
  }
}