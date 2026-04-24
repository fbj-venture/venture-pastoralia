# Security

## Principles

- Pastoral data is highly sensitive and confidential
- RLS is the primary security enforcement layer — application-level checks are
  secondary
- All database access goes through Kysely on the server, always wrapped in the
  RLS session helper — this is non-negotiable
- The RLS session helper in `packages/db` must be used for every query without
  exception — never bypass it
- All user management operations are server-side only via Hono — never triggered
  directly from the client
- No user can self-register under any circumstances

## Authentication

Supabase Auth is used with public registration disabled at the project level.
The only entry point is an email invite sent by a super-admin via the Hono API (
`POST /api/users/invite`).

On invite acceptance, a Supabase Auth trigger automatically creates a `profiles`
record with the role assigned at invite time.

## Roles

| Role          | Capabilities                                                                                        |
|---------------|-----------------------------------------------------------------------------------------------------|
| `super_admin` | Full access. Invite users, assign roles, revoke access, merge person records, read all interactions |
| `pastor`      | Read all interactions. Trigger PC sync. Log contacts and interactions                               |
| `elder`       | Log contacts and interactions. Read own interactions only                                           |
| `deacon`      | Log contacts and interactions. Read own interactions only                                           |

## Super-Admin Protection

There must always be at least one active super-admin. The system enforces this
server-side in Hono:

- Before processing any role change or revocation that affects a super-admin,
  the API counts active super-admins
- If the operation would result in zero active super-admins, the request is
  rejected with a clear error
- This check is never client-enforced — it lives exclusively in the Hono API
  layer
- Super-admins can revoke one another's super-admin rights, subject to the above
  constraint

## Row Level Security Policies

All RLS policies are defined in Supabase migrations and managed via the Supabase
CLI.

### `profiles`

- **Read:** Any authenticated, active user
- **Insert:** Super-admin only (via server-side invite flow)
- **Update:** Super-admin only
- **Delete:** Never — profiles are never deleted, only deactivated via
  `is_active: false`

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

All RLS policies include a check that `is_active = true` on the requesting
user's profile. A revoked user whose Supabase Auth session has not yet expired
is denied at the RLS layer even if their token is still valid.

## Person Merge

The person merge operation (linking a local visitor record to a PC duplicate) is
super-admin only and is performed server-side via Hono. It requires:

1. Explicit confirmation from the super-admin with both records displayed
2. A pre-merge validation check that the PC duplicate has zero related records
3. A hard delete of the PC duplicate — only permissible after validation passes

## Sensitive Data Handling

- Interaction notes are never logged, cached, or transmitted beyond the
  authenticated request
- The SSE sync stream carries only progress metadata — never person or
  interaction data
- No pastoral content is stored in `sync_log`
