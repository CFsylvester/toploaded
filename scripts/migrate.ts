// scripts/migrate.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function main() {
  const connection = postgres(process.env.DB_URL!, {
    max: 1,
    prepare: false, // avoids unnamed statement issues on Supabase
    ssl: 'require' as any, // Supabase needs SSL
  });

  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: './drizzle' }); // relative to repo root

  await connection.end();
  console.log('✅ Migrations applied');
}

main().catch(e => {
  console.error('❌ Migration failed:', e);
  process.exit(1);
});
