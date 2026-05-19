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
- **Query builder / ORM:** Drizzle ORM with drizzle-kit — server-side only, RLS-preserving
- **Migrations:** drizzle-kit (schema migrations auto-generated from TypeScript schema; RLS policies, triggers, and functions via `drizzle-kit generate --custom`)
- **Monorepo:** PNPM workspaces + Nx
- **Hosting:** Railway (Hobby plan)

## Monorepo Structure

```
apps/
  web/          # Vite + Preact frontend with LightningCSS
  api/          # Hono API server
packages/
  db/           # Drizzle client, schema definitions, migrations, RLS helper
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
- **Drizzle schema is the source of truth for database types** — never manually write database types independently of the schema

## Key Conventions

- All database access goes through Drizzle on the server — never from the frontend
- Every Drizzle query must be executed via the RLS session helper in `packages/db` — never bypass it
- All API calls go through Hono — never direct database calls from the frontend
- RLS is the security layer — never rely solely on application-level checks for access control
- Schema migrations are managed exclusively through drizzle-kit — never edited manually in the Supabase dashboard
- RLS policies, triggers, and database functions are managed as custom drizzle-kit migrations
- All user management (invite, revoke, role assignment) is server-side only, never client-triggered directly
- LightningCSS is the CSS processor — no PostCSS, no Tailwind, no CSS-in-JS

## Development

```bash
# Start local Supabase
supabase start

# Start development servers
pnpm dev

# Generate a migration from schema changes
drizzle-kit generate

# Generate a custom migration (for RLS policies, triggers, functions)
drizzle-kit generate --custom

# Apply migrations
drizzle-kit migrate

# Run Drizzle Studio (local DB browser)
drizzle-kit studio
```

## Environment Variables

See `.env.example` for required variables. Never commit `.env` files.
Nx loads `.env` from the workspace root automatically when running targets.


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