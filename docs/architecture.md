# Architecture

## Overview

A single-deployment web application for pastoral care management. The frontend
is a Vite + Preact SPA, built to static files and served by a Hono server in
production. Hono also handles all API routes. Supabase provides the database,
authentication, and row-level security.

## Core Decisions

### Single Deployment

Everything runs through one Railway service. Hono is the only running process in
production — it serves the Vite-built static assets and handles all API
requests. Vite is build-time only.

This was chosen over edge functions or split deployments for simplicity, cost
predictability, and because the Supabase + edge function connection pooling
problem is avoided entirely.

### Hono as Server

Hono was chosen for its TypeScript-first design, lightweight footprint, and
natural fit with a single-server deployment on Railway. In development, Vite
proxies API requests to the Hono server.

### Supabase — All Services

Supabase is used for all of the following:

- **PostgreSQL** — primary data store
- **Auth** — invite-only authentication, no public registration
- **Row Level Security** — the primary security enforcement layer
- **Generated TypeScript types** — via Supabase CLI for end-to-end type safety
- **Migrations** — managed exclusively through the Supabase CLI

### Kysely as Query Builder

Kysely is used server-side in Hono for all database queries. It was chosen over
Prisma because Prisma bypasses Supabase RLS by connecting as a superuser. Kysely
preserves RLS through a session helper that wraps every query in a transaction
and sets the authenticated user context before execution.

The `kysely-supabase` package bridges Supabase's generated TypeScript types into
Kysely's type system via `KyselifyDatabase`. The workflow is:

1. Supabase CLI generates `database.types.ts` from the live schema
2. `KyselifyDatabase` translates those types into Kysely's interface
3. Kysely queries are fully typed against the actual database schema

All database access is server-side only. The frontend never touches the database
directly.

### RLS Session Helper

Every Kysely query must be wrapped in the RLS session helper defined in
`packages/db`. This helper:

1. Opens a transaction
2. Sets `SET LOCAL role = authenticated` and the user's JWT claims
3. Executes the query with RLS policies active
4. Commits or rolls back

This is the critical piece that makes Kysely + RLS work. It must never be
bypassed.

### LightningCSS

LightningCSS is used as the CSS processor in Vite on the frontend. No PostCSS,
no Tailwind, no CSS-in-JS. LightningCSS handles modern CSS features, nesting,
and vendor prefixing natively at build time.

### Monorepo — PNPM + Nx

PNPM workspaces with Nx for task orchestration, build caching, and project graph
awareness. Nx task dependencies ensure `web` is built before `api` serves in
production.

### Hosting — Railway Hobby

Railway Hobby (~$5/month) runs the single Hono server. Chosen for its persistent
server model, simple GitHub-connected deploys, and straightforward fit with a
Node-based single-service architecture.

Vercel and Cloudflare Workers were considered but rejected — both push toward
edge/serverless patterns that complicate Supabase connections and fragment the
single deployment model.

## Production Build Pipeline

1. Nx builds `web` (Vite outputs to `apps/web/dist`)
2. Nx builds `api` (Hono server)
3. Hono serves `apps/web/dist` as static files
4. Hono handles all `/api/*` routes

The Nx task dependency graph ensures step 1 always precedes steps 2 and 3.

## Development Setup

Vite dev server runs with a proxy config that forwards `/api/*` requests to the
local Hono server. Supabase runs locally via `supabase start`.

## Planning Center Integration

Planning Center is used for contact data retrieval only — it is the canonical
source for congregation members. The app does not write back to Planning Center.

Sync is triggered manually or on a schedule. During sync, a Server-Sent Events (
SSE) stream from Hono to the client provides real-time progress visibility
without requiring a job queue infrastructure.

See `docs/planning-center.md` for full integration details.

## Key Constraints

- Pastoral data is highly sensitive and confidential
- No public registration — all users are invited by a super-admin
- The app is not a PWA — offline capability is not a v1 requirement
- The app does not write back to Planning Center under any circumstances
