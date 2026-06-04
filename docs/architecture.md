# Architecture

## Overview

A single-deployment web application for pastoral care management. The frontend is a Vite + Preact SPA, built to static files and served by a Hono server in production. Hono also handles all API routes. Supabase provides the database, authentication, and row-level security.

## Core Decisions

### Single Deployment

Everything runs through one Railway service. Hono is the only running process in production — it serves the Vite-built static assets and handles all API requests. Vite is build-time only.

This was chosen over edge functions or split deployments for simplicity, cost predictability, and because the Supabase + edge function connection pooling problem is avoided entirely.

### Hono as Server

Hono was chosen for its TypeScript-first design, lightweight footprint, and natural fit with a single-server deployment on Railway. In development, Vite proxies API requests to the Hono server.

### Supabase — Auth and RLS

Supabase is used for:
- **PostgreSQL** — primary data store
- **Auth** — invite-only authentication, no public registration
- **Row Level Security** — the primary security enforcement layer

Supabase's generated TypeScript types and JS client are NOT used for database queries. All queries go through Drizzle ORM.

### Drizzle ORM + drizzle-kit

Drizzle ORM is used server-side in Hono for all database queries. It was chosen over Prisma (which bypasses RLS) and the Supabase JS client (which has weaker query ergonomics) because it:
- Preserves RLS through Supabase's connection pooler with a session helper
- Provides a TypeScript-native, SQL-close query API
- Has first-class Supabase support and is recommended by Supabase
- Uses a single tool (drizzle-kit) for all migration management

**drizzle-kit manages all migrations:**
- Schema changes → `drizzle-kit generate` (auto-generated from TypeScript schema)
- RLS policies, triggers, functions → `drizzle-kit generate --custom` (hand-written SQL in Drizzle-managed files)

All migrations run in order and are tracked in Drizzle's migration history. One tool, one migration history.

### RLS Session Helper

Every Drizzle query must be wrapped in the RLS session helper defined in `packages/db`. This helper:

1. Opens a transaction via Supabase's connection pooler (transaction mode)
2. Sets the authenticated user context so RLS policies fire correctly
3. Executes the query with RLS active
4. Commits or rolls back

This is the critical piece that makes Drizzle + RLS work. It must never be bypassed.

### Validation — Zod 4

Zod 4 is used for all runtime validation. Schemas are defined once in `packages/shared` and consumed by both the web frontend and the Hono API. This prevents schema drift between the two layers.

Zod 4 implements the Standard Schema spec (`~standard`), which allows schemas to be passed directly to TanStack Form validators without any adapter package.

### Forms — TanStack Form

TanStack Form (`@tanstack/preact-form`) handles all frontend form state and validation. Zod 4 schemas from `packages/shared` are passed directly as `validators.onChange` (and `validators.onSubmit`) on individual fields — the Standard Schema integration removes any need for a separate `@tanstack/zod-form-adapter`.

### LightningCSS

LightningCSS is used as the CSS processor in Vite on the frontend. No PostCSS, no Tailwind, no CSS-in-JS. LightningCSS handles modern CSS features, nesting, and vendor prefixing natively at build time.

### Monorepo — PNPM + Nx

PNPM workspaces with Nx for task orchestration, build caching, and project graph awareness. Nx task dependencies ensure `web` builds before `api` serves in production.

### Hosting — Railway Hobby

Railway Hobby (~$5/month) runs the single Hono server. Chosen for its persistent server model, simple GitHub-connected deploys, and straightforward fit with a Node-based single-service architecture.

Vercel and Cloudflare Workers were considered but rejected — both push toward edge/serverless patterns that complicate Supabase connections and fragment the single deployment model.

## Production Build Pipeline

1. Nx builds `web` (Vite outputs to `apps/web/dist`)
2. Nx builds `api` (Hono server compiled)
3. Hono serves `apps/web/dist` as static files
4. Hono handles all `/api/*` routes

The Nx task dependency graph ensures step 1 always precedes steps 2 and 3.

## Development Setup

Vite dev server runs with a proxy config that forwards `/api/*` requests to the local Hono server. Supabase runs locally via `supabase start`. Nx loads `.env` from the workspace root automatically.

## Planning Center Integration

Planning Center is used for contact data retrieval only — it is the canonical source for congregation members. The app does not write back to Planning Center.

Sync is triggered manually or on a schedule. During sync, a Server-Sent Events (SSE) stream from Hono to the client provides real-time progress visibility without requiring a job queue infrastructure.

See `docs/planning-center.md` for full integration details.

## Key Constraints

- Pastoral data is highly sensitive and confidential
- No public registration — all users are invited by a super-admin
- The app is not a PWA — offline capability is not a v1 requirement
- The app does not write back to Planning Center under any circumstances
