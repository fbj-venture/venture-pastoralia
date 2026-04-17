# Build Layers

Each layer is production-quality and independently usable before the next layer begins. No layer is considered complete until it is deployed and working in production.

## Layer Status Key

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Layer 1 — Auth & User Management

**Goal:** A working, invite-only authentication system with role-based user management.

**Scope:**
- [ ] Monorepo scaffold — PNPM workspaces + Nx, `apps/web`, `apps/api`, `packages/db`, `packages/shared`
- [ ] Supabase project setup — local dev with Supabase CLI
- [ ] Supabase Auth configured — public registration disabled
- [ ] `profiles` table and migration
- [ ] Supabase Auth trigger — auto-creates `profiles` record on invite acceptance
- [ ] Super-admin invite flow — server-side only via Hono API
- [ ] Role assignment on invite
- [ ] Revoke user access — sets `is_active: false`
- [ ] Super-admin protection — system refuses any action that would leave zero active super-admins
- [ ] Super-admins can revoke one another's super-admin rights
- [ ] Basic authenticated UI shell — login, logout, session handling
- [ ] Railway deployment — production environment running

**Acceptance criteria:**
- A super-admin can invite a new user by email with a role assigned
- An invited user can accept the invite and log in
- A super-admin can revoke any user's access
- A super-admin can revoke another super-admin's rights
- The system refuses to leave zero active super-admins
- No user can self-register

---

## Layer 2 — Planning Center Sync + Local Person Creation

**Goal:** Planning Center contacts are accessible in the app, and local people can be added manually.

**Scope:**
- [ ] `people` table and migration
- [ ] `sync_log` table and migration
- [ ] Planning Center OAuth or API key setup
- [ ] Sync endpoint in Hono — fetches PC contacts and upserts into `people`
- [ ] SSE stream from Hono to client — real-time sync progress
- [ ] Sync triggered manually by pastor/super-admin
- [ ] Scheduled sync (optional for this layer)
- [ ] People list view — searchable, shows source indicator
- [ ] Person detail view — basic PC data displayed
- [ ] Add local person form — name and contact basics
- [ ] Generated Supabase TypeScript types — `packages/db/src/database.types.ts`

**Acceptance criteria:**
- A pastor can trigger a PC sync and see real-time progress
- Synced PC contacts appear in the people list
- A local person can be added manually
- Source is clearly indicated on each person record
- People are searchable by name

**See:** `docs/planning-center.md` for API field mappings and sync details

---

## Layer 3 — Log Contact

**Goal:** Any authenticated user can log a contact against any person.

**Scope:**
- [ ] `contact_log` table and migration
- [ ] Log contact form — person, date/time, optional note
- [ ] Contact log visible on person detail view
- [ ] Last contacted summary visible in people list

**Acceptance criteria:**
- Any authenticated user can log a contact against any person
- Contact log is visible to all authenticated users
- People list shows who was last contacted and when

---

## Layer 4 — Private Interaction

**Goal:** Authenticated users can log private pastoral notes against a person.

**Scope:**
- [ ] `interactions` table and migration
- [ ] Log interaction form — person, type, date/time, private notes
- [ ] Interactions visible on person detail view — only to author, pastor, super-admin
- [ ] Interaction type selector — visit, call, message, other

**Acceptance criteria:**
- Any authenticated user can log a private interaction
- Only the author, pastors, and super-admins can read interaction notes
- Other authenticated users see no indication that private interactions exist for a person

---

## Layer 5 — Contact History View

**Goal:** A clear, useful view of a person's full contact history.

**Scope:**
- [ ] Person detail view — unified timeline of contact log entries
- [ ] Private interactions shown inline for authorised users — hidden for others
- [ ] Chronological ordering
- [ ] Last contacted summary accurate and prominent

**Acceptance criteria:**
- Authorised users see a full timeline including private interactions
- Unauthorised users see only the public contact log
- The view is clear and usable on both desktop and mobile

---

## Layer 6 — Visitor Follow-up Flag

**Goal:** Visitors can be added quickly and flagged for follow-up.

**Scope:**
- [ ] Add visitor flow — minimal form, name and basic details
- [ ] `contact_log` record created automatically with `is_visitor: true` on visitor creation
- [ ] Visitors flagged visually in the people list and contact log
- [ ] Visitor list or filter view — shows all visitors needing follow-up

**Acceptance criteria:**
- Any authenticated user can add a visitor in under 60 seconds
- Visitor appears immediately in the public contact log
- Visitors are clearly distinguishable from regular contacts
- Team members can see which visitors have not yet been followed up

---

## Layer 7 — Person Merge

**Goal:** Local visitor records can be linked to their Planning Center record after joining.

**Scope:**
- [ ] Merge UI — super-admin only, displays both records side by side
- [ ] Pre-merge validation — aborts if PC duplicate has any related records
- [ ] Merge operation — writes PC data into local record, hard deletes PC duplicate
- [ ] Confirmation step required before committing
- [ ] Merge logged for audit purposes

**Acceptance criteria:**
- Super-admin can identify and merge a local visitor record with a PC duplicate
- All history on the local record is preserved intact
- PC duplicate is deleted cleanly
- Merge is aborted with a clear error if the PC record has related data
- Merge cannot be performed without explicit confirmation
