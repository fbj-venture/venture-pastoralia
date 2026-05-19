# Security

## Principles

- Pastoral data is highly sensitive and confidential
- RLS is the primary security enforcement layer — application-level checks are secondary
- All database access goes through Drizzle ORM on the server, always wrapped in the RLS session helper in `packages/db` — this is non-negotiable and must never be bypassed
- All user management operations are server-side only via Hono — never triggered directly from the client
- No user can self-register under any circumstances

## Authentication

Supabase Auth is used with public registration disabled at the project level. The only entry point is an email invite sent by a super-admin via the Hono API (`POST /api/users/invite`).

On invite acceptance, a Postgres trigger automatically creates a `profiles` record with the role assigned at invite time. This trigger is defined as a custom drizzle-kit migration.

## Roles

| Role | Capabilities |
|---|---|
| `super_admin` | Full access. Invite users, assign roles, revoke access, merge person records, read all interactions |
| `pastor` | Read all interactions. Trigger PC sync. Log contacts and interactions |
| `elder` | Log contacts and interactions. Read own interactions only |
| `deacon` | Log contacts and interactions. Read own interactions only |

## Super-Admin Protection

There must always be at least one active super-admin. The system enforces this server-side in Hono:

- Before processing any role change or revocation that affects a super-admin, the API counts active super-admins
- If the operation would result in zero active super-admins, the request is rejected with a clear error
- This check is never client-enforced — it lives exclusively in the Hono API layer
- Super-admins can revoke one another's super-admin rights, subject to the above constraint

## Row Level Security Policies

All RLS policies are defined as custom drizzle-kit migrations in `packages/db/drizzle`. They are version-controlled alongside the schema and applied in order with the rest of the migration history.

### `profiles`
- **Read:** Any authenticated, active user
- **Insert:** Super-admin only (via server-side invite flow)
- **Update:** Super-admin only
- **Delete:** Never — profiles are never deleted, only deactivated via `is_active: false`

### `people`
- **Read:** Any authenticated, active user
- **Insert:** Any authenticated, active user
- **Update:** Record creator or super-admin
- **Delete:** Record creator or super-admin

### `contact_log`
- **Read:** Any authenticated, active user
- **Insert:** Any authenticated, active user
- **Update:** Never — contact log is immutable
- **Delete:** Never — contact log is immutable

### `interactions`
- **Read:** Record author (`performed_by`), pastor role, super-admin role
- **Insert:** Any authenticated, active user
- **Update:** Record author only
- **Delete:** Record author only

### `follow_ups`
- **Read:** Same as parent `interaction`
- **Insert:** Author of parent `interaction` only
- **Update:** Author of parent `interaction` only
- **Delete:** Author of parent `interaction` only

### `sync_log`
- **Read:** Any authenticated, active user
- **Insert:** Pastor role, super-admin role (server-side only)
- **Update:** Never
- **Delete:** Never

## Active User Check

All RLS policies include a check that `is_active = true` on the requesting user's profile. A revoked user whose Supabase Auth session has not yet expired is denied at the RLS layer even if their token is still valid.

## RLS Session Helper

The RLS session helper in `packages/db` must be used for every Drizzle query. It:

1. Connects through Supabase's connection pooler in transaction mode
2. Sets the authenticated user context before executing the query
3. Ensures RLS policies fire correctly for that user's role
4. Commits or rolls back the transaction

Bypassing the session helper — even accidentally — removes all RLS protection for that query. Claude Code must never generate Drizzle queries outside of this helper.

## Person Merge

The person merge operation is super-admin only and is performed server-side via Hono. It requires:

1. Explicit confirmation from the super-admin with both records displayed
2. A pre-merge validation check that the PC duplicate has zero related records
3. A hard delete of the PC duplicate — only permissible after validation passes

## Sensitive Data Handling

- Interaction notes are never logged, cached, or transmitted beyond the authenticated request
- The SSE sync stream carries only progress metadata — never person or interaction data
- No pastoral content is stored in `sync_log`
