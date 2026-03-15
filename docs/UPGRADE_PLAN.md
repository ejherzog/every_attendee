# Dependency Security Upgrade Plan

This document outlines a phased approach to address the remaining npm audit vulnerabilities (cookie, esbuild, svelte) after the safe `npm audit fix` already applied.

**Phase 1 applied:** SvelteKit ^2.55.0, adapter-node ^5.x, Vite ^5.4, overrides for `cookie` and `esbuild`. Vulnerabilities reduced from 15 to 6 (all Svelte-related; see Phase 2).

---

## Current State (after `npm audit fix`)

| Package              | Current  | Vulnerabilities |
|----------------------|----------|-----------------|
| cookie (via Kit)     | <0.7.0   | Out-of-bounds chars in cookie name/path/domain |
| esbuild (via Vite, drizzle-kit) | ≤0.24.2 | Dev server request/response exposure |
| svelte               | ^4.2.7   | XSS, mXSS, SSR issues (fixed in >5.53.4) |

**Note:** The Svelte advisories apply to `svelte <= 5.53.4`. Svelte 4.x is below that, so fixing the Svelte CVEs requires upgrading to Svelte 5.53.5+.

---

## Phase 1: Low-risk upgrades (do first)

Goal: Fix cookie and reduce exposure from esbuild without leaving Svelte 4.

### 1.1 Bump SvelteKit and adapter

- **@sveltejs/kit** `^2.17.1` → `^2.55.0` (or latest 2.x)
- **@sveltejs/adapter-node** `^5.2.2` → match Kit (e.g. `^5.x` latest)

This pulls in a fixed `cookie` and other Kit security fixes.

```bash
npm install @sveltejs/kit@^2.55.0
npm install @sveltejs/adapter-node@latest
```

### 1.2 Upgrade Vite and Svelte plugin

- **vite** `^5.0.3` → `^6.0.0` (SvelteKit 2.55 supports Vite 6)
- **@sveltejs/vite-plugin-svelte** `^3.0.0` → `^4.0.0` or latest compatible

Newer Vite uses a patched esbuild, which addresses the dev-server advisory.

```bash
npm install -D vite@^6 @sveltejs/vite-plugin-svelte@latest
```

### 1.3 Force safe esbuild and cookie via overrides

- **esbuild:** drizzle-kit still pulls in a vulnerable esbuild via `@esbuild-kit/esm-loader`. Force `esbuild >= 0.25.0` in the root `package.json`.
- **cookie:** SvelteKit 2.x depends on `cookie < 0.7.0`. Force `cookie >= 0.7.0` to address the cookie advisory.

In **package.json**:

```json
"overrides": {
  "cookie": ">=0.7.0",
  "esbuild": ">=0.25.0"
}
```

Then: `rm -rf node_modules package-lock.json && npm install`

**Phase 1 outcome:** Cookie and esbuild-related issues are resolved. Svelte XSS/mXSS/SSR issues (6 moderate) remain until Phase 2.

**Note:** Vite was kept at ^5.4 (not 6) because `@sveltejs/vite-plugin-svelte@3` only supports Vite 5. Moving to Vite 6 is part of Phase 2 when upgrading to Svelte 5 and the v4+ plugin.

---

## Phase 2: Svelte 5 upgrade (fixes Svelte CVEs)

Goal: Move to Svelte 5.53.5+ to clear the remaining Svelte advisories.

### 2.1 Upgrade Svelte and Svelte ecosystem

- **svelte** `^4.2.7` → `^5.53.0` (or latest 5.53.x)
- **svelte-check** → latest (Svelte 5–compatible)
- **@sveltejs/vite-plugin-svelte** → ensure latest (e.g. 5.x or 6.x for Svelte 5)

```bash
npm install -D svelte@^5.53.0 svelte-check@latest
npm install -D @sveltejs/vite-plugin-svelte@latest
```

### 2.2 Upgrade Svelte-dependent UI packages

- **svelte-multiselect** `^10.2.0` → `^11.6.3` (has Svelte 5 support; may require `ondrop` and similar props to be functions, not strings).
- **svelte-markdown** – check npm for a Svelte 5–compatible version; test rendering.
- **svelte-markdown-input** – check compatibility; test in host event create/edit flows.
- **@sveltestrap/sveltestrap** – currently has [known Svelte 5 type/rendering issues](https://github.com/sveltestrap/sveltestrap/issues/79). Options:
  - Upgrade to latest and run `npm run check` / manual tests.
  - If blocking: stay on Svelte 4 for now (and accept remaining Svelte vulns) or evaluate an alternative UI library.

### 2.3 Code and config changes for Svelte 5

- **Run the Svelte 5 migration tool** (if you use the official migrator) for runes and other breaking changes.
- **Event handlers:** In Svelte 5, event attributes must be functions (e.g. `ondrop={() => false}` instead of `ondrop="return false"`). Fix any usage in your components and in svelte-multiselect usage.
- **SvelteKit:** Ensure `@sveltejs/kit` is on 2.55+; it supports Svelte 5.
- Re-run **svelte-check** and fix type errors, especially from Sveltestrap.

### 2.4 Test thoroughly

- All pages that use **MultiSelect**, **SvelteMarkdown**, **svelte-markdown-input**, and **Sveltestrap** (see grep results in `src/routes` and `src/lib`).
- SSR and any `contenteditable` or `bind:innerText` / `bind:textContent` usage (mentioned in the advisories).
- Build and preview: `npm run build && npm run preview`.

**Phase 2 outcome:** Svelte-related CVEs addressed. If Sveltestrap is too broken on Svelte 5, you can either pause Phase 2 and stay on Phase 1 + overrides, or plan a UI library change.

---

## Phase 3: Optional / follow-up

### 3.1 Drizzle-kit

- Watch [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) for releases that drop `@esbuild-kit/esm-loader` or bump esbuild (e.g. PRs #4819, #4430).
- After they ship, you can remove the `esbuild` override from `package.json` and run `npm audit` again.

### 3.2 Lockfile and CI

- Commit `package-lock.json` after each phase.
- Add a CI step: `npm audit --audit-level=high` (or `moderate`) so regressions are caught.

---

## Quick reference: commands

```bash
# Phase 1
npm install @sveltejs/kit@^2.55.0 @sveltejs/adapter-node@latest
npm install -D vite@^6 @sveltejs/vite-plugin-svelte@latest
# Add "overrides": { "esbuild": ">=0.25.0" } in package.json, then:
rm -rf node_modules package-lock.json && npm install

# Phase 2 (after Phase 1)
npm install -D svelte@^5.53.0 svelte-check@latest @sveltejs/vite-plugin-svelte@latest
npm install svelte-multiselect@^11.6.3
npm run check
npm run build && npm run preview
```

---

## Risk summary

| Phase | Risk | Mitigation |
|-------|------|------------|
| 1     | Low  | SvelteKit 2.x and Vite 6 are well aligned; override is a known workaround |
| 2     | Medium | Svelte 5 can require code changes; Sveltestrap has known issues – test before full rollout |
| 3     | Low  | Optional; only after upstream drizzle-kit changes |

If you want to minimize change, do **Phase 1 only** and add the **esbuild** override; you will have addressed cookie and esbuild. To clear all current audit findings, complete **Phase 2** and resolve or work around Sveltestrap on Svelte 5.
