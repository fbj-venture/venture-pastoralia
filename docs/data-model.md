# Data Model

## Overview

Six tables. The security boundary is between `contact_log` (public to all authenticated users) and `interactions` (private to the author). These are intentionally separate tables — never views or filtered queries of the same table.

## Tables

### `profiles`

Extends Supabase `auth.users`. Created automatically on user invite acceptance.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | References `auth.users.id` |
| `full_name` | `text` | |
| `role` | `enum` | `super_admin`, `pastor`, `elder`, `deacon` |
| `is_active` | `boolean` | False = revoked. Revoked users cannot authenticate |
| `planning_center_id` | `text` | Nullable. Links profile to PC person record |
| `invited_by` | `uuid` | References `profiles.id`. Nullable for first super-admin |
| `created_at` | `timestamptz` | |

### `people`

Congregation members and visitors. Sourced from Planning Center or added locally.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | |
| `full_name` | `text` | |
| `source` | `enum` | `planning_center`, `local` |
| `created_by` | `uuid` | References `profiles.id` |
| `planning_center_id` | `text` | Nullable. Populated on sync or after merge |
| `last_synced_at` | `timestamptz` | Nullable. Only for PC-sourced records |
| `created_at` | `timestamptz` | |

**Note:** Local records created for visitors may later be merged with a Planning Center record. See Merge Strategy below.

### `contact_log`

Public record of contact. Visible to all authenticated users. Contains no sensitive content.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | |
| `person_id` | `uuid` | References `people.id` |
| `contacted_by` | `uuid` | References `profiles.id` |
| `contacted_at` | `timestamptz` | |
| `note` | `text` | Nullable. Non-sensitive only |
| `is_visitor` | `boolean` | Default false. True when record is a first-visit entry for a new visitor |
| `created_at` | `timestamptz` | |

### `interactions`

Private pastoral notes. Visible only to the author, pastors, and super-admins.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | |
| `person_id` | `uuid` | References `people.id` |
| `performed_by` | `uuid` | References `profiles.id` — the author |
| `interaction_type` | `enum` | `visit`, `call`, `message`, `other` |
| `interacted_at` | `timestamptz` | |
| `notes` | `text` | Sensitive content |
| `created_at` | `timestamptz` | |

**Note:** Interactions are intentionally not linked to `contact_log` entries. The two layers are independent. Team members coordinate involvement through personal conversation, not through the app.

### `follow_ups`

Scheduled next actions. Visibility inherits from the parent interaction.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | |
| `interaction_id` | `uuid` | References `interactions.id` |
| `assigned_to` | `uuid` | References `profiles.id` |
| `due_at` | `timestamptz` | |
| `completed_at` | `timestamptz` | Nullable |
| `note` | `text` | Nullable |
| `created_at` | `timestamptz` | |

### `sync_log`

Planning Center sync history. Fed by the SSE stream during active syncs.

| Field | Type | Notes |
|---|---|---|
| `id` | `uuid` | |
| `triggered_by` | `uuid` | References `profiles.id` |
| `status` | `enum` | `running`, `completed`, `failed` |
| `started_at` | `timestamptz` | |
| `completed_at` | `timestamptz` | Nullable |
| `records_synced` | `integer` | Nullable |
| `error_message` | `text` | Nullable |

## Row Level Security

RLS is the primary security enforcement layer. All database access goes through the Supabase JS client, which respects RLS automatically. Direct Postgres connections are never used in application code.

| Table | Read | Insert | Update | Delete |
|---|---|---|---|---|
| `profiles` | All authenticated | Super-admin only | Super-admin only | Never |
| `people` | All authenticated | All authenticated | Creator or super-admin | Creator or super-admin |
| `contact_log` | All authenticated | All authenticated | Never | Never |
| `interactions` | Author, pastor, super-admin | All authenticated | Author only | Author only |
| `follow_ups` | Same as parent interaction | Author of parent interaction | Author of parent interaction | Author of parent interaction |
| `sync_log` | All authenticated | Pastor, super-admin | Never | Never |

**Note:** `contact_log` records are intentionally immutable once created. They are a historical record.

## Visitor Flow

When a visitor is added:
1. A `people` record is created with `source: local`
2. A `contact_log` record is created immediately with `is_visitor: true`
3. The visitor appears in the public contact history from that moment

## Person Merge Strategy

When a local visitor record needs to be linked to their Planning Center record after they join the congregation:

1. Super-admin identifies the `local` person record and the PC-synced duplicate as the same person
2. Before proceeding, the system verifies the PC-synced record has zero related records (`contact_log`, `interactions`, `follow_ups`). If any exist, the merge is aborted and the super-admin is alerted.
3. PC data is written into the existing `local` record — `planning_center_id` populated, `source` updated to `planning_center`, PC fields merged in
4. The PC-created duplicate record is hard deleted
5. No relinking of related records is required — all history already references the surviving local record

This operation is super-admin only and requires explicit confirmation with both records displayed side by side before committing.
