# Planning Center Integration

## Overview

Planning Center (PC) is used for contact data retrieval only. The app reads from
PC and never writes back to it. PC is the canonical source for congregation
member data.

## Authentication

> **TODO:** Document chosen auth method (OAuth or API key) and token storage
> approach once decided.

## Sync Strategy

Sync is triggered manually by a pastor or super-admin, or optionally on a
schedule. During sync:

1. Hono fetches contacts from the PC API
2. Each contact is upserted into the `people` table — existing records updated,
   new records inserted
3. `last_synced_at` is updated on each synced record
4. A `sync_log` record tracks the run status, start/end time, records synced,
   and any errors
5. Progress is streamed to the client via Server-Sent Events (SSE) from the Hono
   `/api/sync/stream` endpoint

## SSE Stream

The SSE stream provides real-time sync progress to the client without requiring
a job queue. The client connects to the SSE endpoint before triggering sync and
receives progress events until the sync completes or fails.

If the client disconnects mid-sync, the sync job continues server-side. On
reconnection, the client queries `sync_log` for current status rather than
relying on the stream.

## Field Mappings

> **TODO:** Add PC API field mappings to `people` table fields once the working
> mapping is available.

The mapping should document:

- Which PC API endpoint(s) are used
- Which PC fields map to which `people` fields
- Which PC fields are ignored
- How PC person IDs are stored (`planning_center_id`)

## Upsert Logic

- Match on `planning_center_id`
- If a record with that `planning_center_id` exists, update it
- If no record exists, insert a new one with `source: planning_center`
- Never overwrite a `local` record's `planning_center_id` during sync — this is
  reserved for the merge flow

## Constraints

- The app never writes to Planning Center under any circumstances
- Sync can only be triggered by pastor or super-admin roles
- Local person records (`source: local`) are never modified by the sync process
