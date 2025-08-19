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
1) Edit or add `pgTable` files in `src/db/schema/`.
2) Generate SQL migrations:
```bash
yarn db:gen
```
3) Apply migrations to the Supabase database:
```bash
yarn db:migrate
```
4) Regenerate TypeScript types from the live database:
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
