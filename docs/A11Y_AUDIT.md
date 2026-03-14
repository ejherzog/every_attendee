# Accessibility (a11y) Audit — EveryAttendee

**Audit date:** March 2026  
**Scope:** Full site (layout and all routes)

---

## Summary

Manual code review and structure audit. Automated tools (e.g. Lighthouse, pa11y) were not run in this environment; run them locally with the dev server for additional checks.

---

## Critical issues

### 1. Form labels not associated with inputs (multiple pages)

**WCAG 1.3.1 (Info and Relationships), 3.3.2 (Labels or Instructions)**

- **Login** (`/login`): `<Label>` has no `for`, inputs have no `id`. Screen readers cannot associate “Username” / “Password” with their fields.
- **Host event create** (`/host/event/create`): All labels (Event Name, Start, End, Event Code, Location, Address, Host, Image URL, Description) lack `for`; inputs lack `id`.
- **Host event edit** (`/host/event/[event_code]/edit`): Same pattern — labels and inputs not associated.
- **RsvpForm** (contact/notes): Labels for Phone, Email, Notes lack `for` even though inputs have `id="phone"`, `id="email"`, `id="notes"` — add `for` to those labels.
- **GuestCard**: Some labels use `for`/`id`; ensure every form control has an associated label.

**Fix:** Add unique `id` to each form control and matching `for` on the corresponding `<Label>` (or wrap the input in the label).

---

### 2. Missing main landmark

**WCAG 1.3.1, 2.4.1 (Bypass Blocks)**

- Root layout has no `<main>`. The main content (the `<slot>`) is not wrapped in a landmark, so screen reader users cannot jump to “main content” and the page structure is unclear.

**Fix:** Wrap the main content in `<main id="main-content">` in `+layout.svelte`.

---

### 3. No skip link

**WCAG 2.4.1 (Bypass Blocks)**

- There is no “Skip to main content” link. Keyboard and screen reader users must move through the full nav before reaching page content on every load.

**Fix:** Add a skip link as the first focusable element (e.g. “Skip to main content” linking to `#main-content`), styled to be visible on focus.

---

## High priority

### 4. Inconsistent heading hierarchy

- **Homepage** (`/`): First visible heading is `<h2>You're Invited!</h2>`. The primary page title should be `<h1>`.
- **Login** (`/login`): No visible `<h1>`; only `<title>Host Login</title>` in head. Add an on-page `<h1>` (e.g. “Host Login”).
- **Credits** (`/credits`): Main title is `<h3>Credits</h3>`. If no other page content provides an `<h1>`, consider using `<h1>` here for the page purpose, or ensure a consistent hierarchy (e.g. layout or parent provides `<h1>`).

**Fix:** Ensure each page has exactly one `<h1>` that describes the page, and that headings do not skip levels (e.g. h1 → h2 → h3).

---

### 5. External links (new window)

**WCAG 3.2.5 (Change on Request) — best practice**

- **Credits** and any other pages: Links with `target="_blank"` do not have:
  - `rel="noopener noreferrer"` (security and behavior).
  - An accessible indication that the link opens in a new window (e.g. `aria-label="… (opens in new window)"` or visible text).

**Fix:** Add `rel="noopener noreferrer"` to all `target="_blank"` links. Add visible or screen-reader text (e.g. “(opens in new window)”) or `aria-label` so users know the link behavior.

---

## Medium priority

### 6. Images without alt text

- **Host event create** (`/host/event/create`): `<Image class="..." src={image_url}>` has no `alt` attribute. Decorative images should have `alt=""`; meaningful images need a short description.

**Fix:** Add `alt` to all `<Image>` (and `<img>`) components — e.g. `alt="Event image preview"` or `alt=""` if purely decorative.

---

### 7. Error messages and form validation

- Create-account and other forms show errors in `<p class="text-danger">` near the field. Associating errors with inputs via `aria-describedby` (and optionally `aria-invalid`) improves screen reader feedback.

**Fix:** Give the error element an `id` and set the input’s `aria-describedby` to that id when the error is shown; set `aria-invalid="true"` on the input when invalid.

---

### 8. Logout button styling

- Layout uses `<button style="all: unset; ...">Logout</button>`. The layout also has `button:focus { outline: revert; }`, which restores focus outline. Ensure the button retains a visible focus indicator and is clearly actionable (e.g. looks like a link or button).

---

## Low priority / already in good shape

- **`app.html`**: `<html lang="en">` is set.
- **Create-account page**: Password visibility toggles have `aria-label` (“Hide password” / “Show password”).
- **Required fields**: Many inputs use `required` and `aria-required="true"`.
- **Create-account & invite**: Email and other key inputs have proper `id`/`for` and `autocomplete` where applicable.

---

## Recommended next steps

1. Fix all **label–input associations** (Critical #1) across login, host event create/edit, RsvpForm, and GuestCard.
2. Add **`<main>`** and a **skip link** (Critical #2 and #3) in the root layout.
3. Fix **heading hierarchy** and add missing **h1** where needed (High #4).
4. Add **`rel="noopener noreferrer"`** and **new-window indication** for external links (High #5).
5. Add **alt text** to images (Medium #6).
6. Run **Lighthouse** (Accessibility) and **axe DevTools** (or pa11y) on key routes with the dev server and fix any further issues.
7. Do a **keyboard-only** pass (Tab, Enter, Escape) and a **screen reader** pass (e.g. VoiceOver, NVDA) on main flows (home, login, create account, event create, RSVP).

---

## How to run automated a11y checks locally

With the dev server running (`npm run dev`):

```bash
# Single page (example: homepage)
npx pa11y http://localhost:5173/

# Lighthouse accessibility report (HTML)
npx lighthouse http://localhost:5173/ --only-categories=accessibility --output=html --output-path=./a11y-report.html
```

Repeat for other important URLs (e.g. `/login`, `/create-account`, `/credits`, `/event`, `/host/dashboard`, `/host/invite`).
