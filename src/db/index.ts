// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index'; // barrel exports

const queryClient = postgres(process.env.DB_URL!, { max: 1 }); // server-only
export const db = drizzle(queryClient, { schema });
