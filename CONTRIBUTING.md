# Contributing Guide

Welcome to **Toploaded**! This guide explains how to get a local environment running, how we handle schema changes (Drizzle + Supabase), and the expectations for code quality and PRs.

---

## Quick Start

```bash
# 0) Make sure direnv loads env vars
direnv allow

# 1) Install deps
yarn install

# 2) Apply DB migrations (required on fresh clones)
yarn db:migrate

# 3) Pull the latest types from Supabase
yarn db:types

# 4) Run the dev server
yarn dev
```

---

## Environment

We use **direnv** to load environment variables from `.envrc`.

Required variables:

```sh
export NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon>"
export SUPABASE_SERVICE_ROLE_KEY="<service-role>"
export DATABASE_URL="postgres://postgres:<password>@<host>:5432/postgres?sslmode=require"
export SUPABASE_PROJECT_REF="<project-ref>"
```

Validate:

```bash
echo $SUPABASE_PROJECT_REF
supabase --version
```

---

## Project Structure

```
/supabase
  /types/database.ts        # generated types from live DB
/src
  /app                      # Next.js routes (App Router)
  /db
    index.ts                # drizzle client
    /schema                 # pgTable definitions + relations + barrel
  /lib/supabase             # browser.ts, server.ts, admin.ts
  /types/db.ts              # re-exports Database type
/scripts
  migrate.ts                # applies migrations from /drizzle
/drizzle                    # generated SQL migrations (do commit)
```

---

## Database Development Workflow

We are **DB-first** with Drizzle migrations and Supabase types.

### When changing the schema

1. Edit or add `pgTable` files in `src/db/schema/`.
2. Generate SQL migrations:

```bash
yarn db:gen
```

3. Apply migrations to the Supabase database:

```bash
yarn db:migrate
```

4. Regenerate TypeScript types from the live database:

```bash
yarn db:types
```

> Always run **db:types** after migrating so the application stays strongly typed.

### Adding Row Level Security (RLS)

- RLS policies should live in SQL migrations created by Drizzle Kit or hand-written.
- Name policies clearly and scope them by `auth.uid()` (or service role where appropriate).
- If you add RLS, verify both **anonymous** and **service role** behavior with quick smoke tests in a route handler or script.

### Seeds (optional)

- Prefer **idempotent** seeds (use `on conflict do nothing` or `insert ... where not exists` patterns).
- If you include seed scripts, store them in `/supabase/seeds` or `/scripts/seed.ts`.

### Version Control for Database Files

**What to commit:**

- ✅ `/drizzle/*.sql` - Migration files (essential for team sync and deployments)
- ✅ `/src/db/schema/*` - Your Drizzle schema definitions
- ✅ `/supabase/types/database.ts` - Generated types (after running `yarn db:types`)

**What NOT to commit:**

- ❌ `/drizzle/meta/` - Environment-specific metadata (already in `.gitignore`)

**Why commit migration files?**

- **Team synchronization:** Everyone gets the same database structure
- **Deployment consistency:** Production applies the exact same schema changes
- **Database version control:** Historical record of schema evolution
- **Rollback capability:** Can revert to previous database states if needed

**Example workflow:**

```bash
# 1. You add a new table to your schema
vim src/db/schema/products.ts

# 2. Generate migration
yarn db:gen  # Creates drizzle/0003_add_products.sql

# 3. Apply locally and regenerate types
yarn db:migrate
yarn db:types

# 4. Commit the migration file (but not meta/)
git add drizzle/0003_add_products.sql src/db/schema/products.ts supabase/types/database.ts
git commit -m "feat: add products table"

# 5. Teammate pulls and applies
git pull
yarn db:migrate  # Applies your migration to their local DB
```

---

## Production Deployments & Database Migrations

### ⚠️ Critical: Production Database Updates

**NEVER run `yarn db:migrate` directly against production.** This could cause downtime or data loss.

### Recommended Production Workflow

#### Option 1: Manual Migration (Current Setup)

1. **Deploy code first** (without running migrations)
2. **Test migrations on staging** environment first
3. **Run migrations manually** during maintenance window:

   ```bash
   # Set production env vars
   export DATABASE_URL="postgres://postgres:<prod-password>@<prod-host>:5432/postgres?sslmode=require"
   export SUPABASE_PROJECT_REF="<prod-project-ref>"

   # Apply migrations
   yarn db:migrate
   ```

4. **Verify** application works with new schema
5. **Monitor** for any issues

#### Option 2: Automated CI/CD (Recommended)

Set up GitHub Actions to handle deployments:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - run: yarn install --frozen-lockfile
      - run: yarn build

      # Apply migrations to production
      - name: Run Database Migrations
        env:
          DATABASE_URL: ${{ secrets.PROD_DATABASE_URL }}
          SUPABASE_PROJECT_REF: ${{ secrets.PROD_SUPABASE_PROJECT_REF }}
        run: yarn db:migrate

      # Deploy to Vercel
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Migration Safety Checklist

Before deploying migrations to production:

- [ ] **Test on staging** with production-like data
- [ ] **Backup database** before applying migrations
- [ ] **Review migration SQL** for potential issues:
  - Adding NOT NULL columns without defaults
  - Dropping columns that might still be in use
  - Large table alterations that could cause locks
- [ ] **Plan rollback strategy** if something goes wrong
- [ ] **Schedule during low-traffic** periods if possible
- [ ] **Monitor application** after deployment

### Emergency Rollback

If you need to rollback a migration:

1. **Revert the code** deployment first
2. **Manually rollback database** changes:

   ```sql
   -- Example: If you added a column, drop it
   ALTER TABLE users DROP COLUMN new_column;

   -- If you changed a constraint, revert it
   ALTER TABLE users DROP CONSTRAINT new_constraint;
   ```

3. **Update migration history** to prevent re-application

### Environment-Specific Considerations

- **Staging**: Should mirror production env vars and run same migration process
- **Production**: Use connection pooling, read replicas if available
- **Development**: Can use `db:push` for quick prototyping (bypasses migrations)

### Monitoring Production Migrations

After applying migrations:

- Check application logs for database errors
- Monitor query performance for any regressions
- Verify all features work as expected
- Check database metrics (connection counts, query times)

---

## Code Style & Conventions

- **Language:** TypeScript
- **Lint/Format:** ESLint + Prettier (run `yarn lint` if configured)
- **Imports:** Use the `@/*` alias for `/src/*`
- **Foldering:**
  - `/src/db/**` = Drizzle schema & client only
  - `/src/models/**` = domain validation (Zod) and helpers (if present)
  - `/src/lib/supabase/**` = Supabase clients (browser/server/admin)
- **Naming:**
  - Tables: `snake_case`
  - Columns: `snake_case`
  - TS types: `PascalCase` (e.g., `type User`)
- **Error handling:** Throw typed errors for server actions/handlers; surface user-friendly messages in UI.

---

## Branching & Commits

- **Branches:** `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`
- **Commits:** Conventional style encouraged
  - `feat: add inventory_items table`
  - `fix: correct relation in graded_cards`
  - `chore: regen supabase types`
- Keep commits scoped and readable. Squash on merge if the history is noisy.

---

## Pull Requests

- PR title: short, descriptive (`feat: graded card pricing snapshots`)
- Include:
  - What changed & why
  - Screenshots or sample queries (when helpful)
  - DB changes (link to migration files)
  - Post-merge steps (if any)
- CI should at least build and type-check. If we add tests, they must pass.

---

## Testing (lightweight for now)

- Prefer **server actions** or **route handlers** for integration-style tests (smoke tests that touch the DB).
- Keep tests deterministic; avoid relying on external services unless mocked.
- If you add heavy test infra, document how to run it in this file.

---

## Common Tasks

```bash
# Generate SQL migrations from schema changes
yarn db:gen

# Apply migrations to Supabase
yarn db:migrate

# Regenerate Supabase types after schema changes
yarn db:types

# Start dev server
yarn dev

# Production build and run
yarn build && yarn start
```

---

## Troubleshooting

- **Cannot find module '@/...'**  
  Ensure `tsconfig.json` has:

  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": { "@/*": ["src/*"] }
    }
  }
  ```

- **`Invalid project ref format` when running db:types**  
  Your shell doesn’t have `SUPABASE_PROJECT_REF`. If using direnv, ensure `.envrc` has `export SUPABASE_PROJECT_REF=...` and run `direnv allow`.

- **SSL / connection issues**  
  The `DATABASE_URL` must include `sslmode=require` for Supabase.

- **Migrations run but types are stale**  
  Always run `yarn db:types` after `yarn db:migrate`.

---

## Security Notes

- Never commit `.envrc` values to public repos.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code.
- Review RLS policies in PRs; treat them like code.

---

Thanks for contributing! If something here is unclear, open an issue or drop a PR improving this guide.
