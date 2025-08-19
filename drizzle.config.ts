import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema', // folder with your pgTable files
  out: './drizzle', // where SQL migrations will be written
  dialect: 'postgresql',
  strict: true,
  verbose: true,
});
