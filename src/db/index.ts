// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index'; // barrel exports

const dbUrl =
  process.env.ENVIRONMENT === 'production' ? process.env.PROD_DB_URL : process.env.STAGING_DB_URL;
const queryClient = postgres(dbUrl!, { max: 1 }); // server-only
export const db = drizzle(queryClient, { schema });
