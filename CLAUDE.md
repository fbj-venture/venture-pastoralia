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

- **Frontend:** Vite + Preact (TypeScript) + LightningCSS
- **API:** Hono (TypeScript) — serves static frontend assets in production and handles all API routes
- **Database:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Query builder:** Kysely with `kysely-supabase` type bridge — server-side only, RLS-preserving
- **Types:** Supabase generated TypeScript types via Supabase CLI, translated to Kysely-compatible types via `KyselifyDatabase`
- **Migrations:** Supabase CLI
- **Monorepo:** PNPM workspaces + Nx
- **Hosting:** Railway (Hobby plan)

## Monorepo Structure

```
apps/
  web/          # Vite + Preact frontend with LightningCSS
  api/          # Hono API server
packages/
  db/           # Kysely client, generated types, schema, RLS session helper
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
- **Supabase generated types** are the source of truth for database types — never manually write database types. These are translated to Kysely-compatible types via `KyselifyDatabase` from `kysely-supabase`

## Key Conventions

- All database access goes through Kysely on the server — never direct Postgres queries without the RLS session helper, never from the frontend
- All API calls go through Hono — never direct database calls from the frontend
- RLS is the security layer — every Kysely query must be wrapped in the RLS session helper in `packages/db`. Never bypass this
- Migrations are managed exclusively through the Supabase CLI — never edited manually in the dashboard
- All user management (invite, revoke, role assignment) is server-side only, never client-triggered directly
- LightningCSS is the CSS processor — no PostCSS, no Tailwind, no CSS-in-JS

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


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->