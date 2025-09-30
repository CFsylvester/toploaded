import { defineConfig } from 'drizzle-kit';
const dbUrl =
  process.env.ENVIRONMENT === 'production' ? process.env.PROD_DB_URL : process.env.STAGING_DB_URL;

if (!dbUrl) {
  throw new Error('Database URL is not defined');
}

export default defineConfig({
  schema: './src/db/schema', // folder with your pgTable files
  out: './drizzle', // where SQL migrations will be written
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: dbUrl,
  },
});
