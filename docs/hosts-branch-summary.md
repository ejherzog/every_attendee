# Hosts branch summary

Summary of the **hosts** branch (`cursor first pass of host invites`) for re-creating the feature on top of `main` (Drizzle).

## Overview

- **Branch:** `hosts` (1 commit ahead of its base, which was pre-Drizzle).
- **Goal:** Let existing hosts invite new hosts by email; invitees get a link to set their own username/password and become app users.

## 1. Database

### New table: `host_invites`

```sql
CREATE TABLE host_invites (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email varchar(400) NOT NULL UNIQUE,
    token text NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by_user_id integer REFERENCES app_users(id)
);

CREATE INDEX idx_host_invites_token ON host_invites(token);
CREATE INDEX idx_host_invites_expires_at ON host_invites(expires_at);
```

- **email:** Invitee email; UNIQUE so one pending invite per email.
- **token:** Secret in the invite link; UNIQUE.
- **expires_at:** Link valid until this time (e.g. 14 days).
- **created_by_user_id:** Optional; app user who created the invite.

### New DB functions (to implement with Drizzle)

- **insertHostInvite(email, token, expiresAt, createdByUserId?)**  
  Insert one row into `host_invites`. Used when creating an invite.

- **getHostInviteByToken(token)**  
  Select from `host_invites` where `token = $1` and `expires_at > NOW()`. Return one row or null. Used on set-password page to validate the link.

- **deleteHostInviteByToken(token)**  
  Delete from `host_invites` where `token = $1`. Used after successful signup so the link can’t be reused.

- **insertAppUser(username, passwordHash, personId?)**  
  Insert into `app_users`, return `id`. Used when the invitee completes set-password (create account). (May already exist on main; if not, add it.)

## 2. Routes and UI

### Host invite flow

- **Route:** `/host/invite`
- **Files:** `src/routes/host/invite/+page.server.ts`, `+page.svelte`
- **Behavior:**
  - Form: single field “Email”.
  - POST: validate email, generate token, set `expiresAt` (e.g. 14 days), optionally set `createdByUserId` from `locals.session?.userId`, call `insertHostInvite`.
  - On success: show invite link (e.g. `https://origin/set-password?token=...`), “Copy link” button.
  - Handle unique constraint (e.g. 23505) → “That email already has a pending invite.”
- **Token:** 32 random bytes hex-encoded (e.g. `crypto.getRandomValues` + `toString(16)`).

### Set password (invite signup)

- **Route:** `/set-password`
- **Files:** `src/routes/set-password/+page.server.ts`, `+page.svelte`
- **Behavior:**
  - **Load:** Read `token` from URL; call `getHostInviteByToken(token)`. If invalid/expired, return `valid: false`; else return `valid: true`, `email`, `token`.
  - **Form:** username, password, password confirm.
  - **POST:** Validate token again with `getHostInviteByToken`; validate username (required, regex e.g. `[a-zA-Z0-9_-]+`), check not taken (`getUser`); validate password length and match. Then:
    - `insertAppUser(username, passwordHash, personId?)` (personId can be null for now).
    - `deleteHostInviteByToken(token)`.
    - Create session (e.g. `createSession`, set cookie), redirect (e.g. dashboard).
  - **Validation:** username uniqueness, password length (e.g. 8+), password confirm match; clear error messages as in existing code.

### Dashboard link

- **File:** `src/routes/host/dashboard/+page.svelte`
- **Change:** Add a link (or button) to `/host/invite` (e.g. “Invite a host”).

## 3. Implementation notes for Drizzle

- Add `host_invites` to `src/lib/server/db/schema.ts` and create a migration (or baseline) for the new table.
- In `src/lib/server/database.ts` (or a dedicated module), implement the four functions above using the existing `db` Drizzle client and the new `host_invites` table; keep the same function names/signatures so the route code can stay the same.
- `getHostInviteByToken` should return a single object or null; map Drizzle’s camelCase columns to the shape expected by set-password (e.g. `expires_at`, `created_at`, `created_by_user_id` if the rest of the app uses snake_case for that route).
- Re-use existing auth helpers (`hashPassword`, `createSession`, etc.) and session cookie handling on set-password.

## 4. Files to add or touch (when re-creating on main)

| Path | Action |
|------|--------|
| `docs/SQL.md` | Add `host_invites` DDL (optional; schema lives in Drizzle). |
| `src/lib/server/db/schema.ts` | Add `hostInvites` table. |
| `src/lib/server/database.ts` | Add `insertHostInvite`, `getHostInviteByToken`, `deleteHostInviteByToken`, `insertAppUser` (if missing). |
| `src/routes/host/invite/+page.server.ts` | (Re)create; logic as above. |
| `src/routes/host/invite/+page.svelte` | (Re)create; form + success state + copy link. |
| `src/routes/set-password/+page.server.ts` | (Re)create; load + action using the four DB functions. |
| `src/routes/set-password/+page.svelte` | (Re)create; form and validation UX. |
| `src/routes/host/dashboard/+page.svelte` | Add link to `/host/invite`. |
| Migration | Add migration for `host_invites` (e.g. `npm run db:generate` then `db:migrate`). |

Once this is done on a branch based on `main`, the hosts invite feature is restored with Drizzle and no merge conflicts with the big Drizzle refactor.
