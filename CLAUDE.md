# Pastoral Care App — Claude Code Context

This is a pastoral care management web application for a church pastor and small team. It helps manage visits, follow-ups, and contact history for congregation members and visitors.

## Quick Reference

- Full documentation is in `/docs`
- Architecture decisions: `docs/architecture.md`
- Data model and schema: `docs/data-model.md`
- Build layers and status: `docs/layers.md`
- Planning Center integration: `docs/planning-center.md`
- Security model: `docs/security.md`

## Stack

- **Frontend:** Vite + Preact (TypeScript)
- **API:** Hono (TypeScript) — serves static frontend assets in production and handles all API routes
- **Database:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Types:** Supabase generated TypeScript types via Supabase CLI
- **Migrations:** Supabase CLI
- **Monorepo:** PNPM workspaces + Nx
- **Hosting:** Railway (Hobby plan)

## Monorepo Structure

```
apps/
  web/          # Vite + Preact frontend
  api/          # Hono API server
packages/
  db/           # Supabase client, generated types, schema
  shared/       # Shared TypeScript types consumed by both web and api
docs/
  architecture.md
  data-model.md
  layers.md
  planning-center.md
  security.md
```

## TypeScript Setup Requirements

This project is TypeScript end-to-end. These are non-negotiable setup requirements, not optional conventions:

- **All files are `.ts` or `.tsx`** — no JavaScript files anywhere in the project, including config files where TypeScript alternatives exist
- **Every app and package has its own `tsconfig.json`** — with a root `tsconfig.base.json` that all others extend
- **Strict mode is enabled everywhere** — `"strict": true` in `tsconfig.base.json`. Never disable or relax strict mode
- **ESM throughout** — `"type": "module"` in all `package.json` files. No CommonJS
- **Node 24** — pinned via `.nvmrc` (containing `24`) and `"engines": { "node": ">=24.0.0" }` in root `package.json`
- **Supabase generated types** are the source of truth for database types — never manually write database types

## Key Conventions

- All database access goes through the Supabase JS client — never direct Postgres queries (preserves RLS)
- All API calls go through Hono — never direct Supabase calls from the frontend
- RLS is the security layer — never rely solely on application-level checks for access control
- Migrations are managed exclusively through the Supabase CLI — never edited manually in the dashboard
- All user management (invite, revoke, role assignment) is server-side only, never client-triggered directly

## Development

```bash
# Start local Supabase
supabase start

# Start development servers
pnpm dev

# Generate Supabase types
supabase gen types typescript --local > packages/db/src/database.types.ts

# Run migrations
supabase db push
```

## Environment Variables

See `.env.example` for required variables. Never commit `.env` files.
