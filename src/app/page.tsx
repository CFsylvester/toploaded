// src/app/page.tsx
import { db } from '@/db';
import { tenants } from '@/db/schema/tenants';

export default async function Home() {
  await db.insert(tenants).values({ name: 'Demo Tenant', slug: 'demo' }).onConflictDoNothing?.();

  const rows = await db.select().from(tenants);
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Tenants</h1>
      <pre className="mt-4">{JSON.stringify(rows, null, 2)}</pre>
    </main>
  );
}
