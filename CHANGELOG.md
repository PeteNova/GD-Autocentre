# Changelog — GD Autocentre Website

All notable changes to the live site ([gd-autocentre.vercel.app](https://gd-autocentre.vercel.app)).

Format: [Keep a Changelog](https://keepachangelog.com/). Versioned by session date.
Full narrative history lives in `../gd-data/roadmap.json` → `sessions[]`.

---

## [2026-04-21] — Session 5

### Added
- JSON-driven freeform hero pinboard (`docs/hero-notes.json` → `window.GD_PINBOARD_API`). Multiple stickies, each with position %, size px, colour, rotation, label, text. Empty array = no hero stickies (backwards-compatible).
- Hero notes renderer in `index.html`: desktop absolute overlay `#heroNotes` inside `.hero`. Resize listener re-renders on breakpoint crossings.
- Five sticky colour variants (yellow/orange/pink/blue/green) + wobble rotation + drop-shadow.
- **Six tape variations** (`applyTape()`) distributed via deterministic hash of note `id`, so visual placement stays stable across re-renders. 35% v1, 15% each v2–v6.
- **Auto-expiring stickies** via optional `expires_at: "YYYY-MM-DD"` field (p2_10). `isNotExpired()` filters by London time, inclusive of the expiry day. Notes without the field never expire.
- **Mobile opt-in stickies**: hero notes are OFF by default on mobile. Per-note opt-in via `visible_on_mobile: true` (editor checkbox). Opted-in notes render in the pinboard column on mobile with a 📌 emoji pin on top (replacing the desktop tape) and a plain × close button in the top-right corner.
- **Per-visitor dismissal**: clicking × on a mobile sticky stores its id in `localStorage.gd_dismissed_hero_notes` so it stays hidden on subsequent visits. Pinboard collapses entirely when nothing opts-in and no legacy user-notes remain.
- Initial `docs/hero-notes.json` seeded with three real stickies: Warriors vs Bears match (blue, expires 2026-05-02), Bank holiday notice (pink, expires 2026-05-04), Warriors training (orange, expires 2026-04-25). All default to desktop-only.
- `tools/editor-module.html` (25 KB): floating panel with Add/Delete, text/label/rotation/colour/W/H/X/Y + `expires_at` + `visible_on_mobile` controls, live JSON preview, Copy/Download/Import/Reset. Pointer-events drag + corner resize, clamped to hero bounds. WIP persisted in localStorage.
- `tools/build-editor.mjs`: zero-dep Node script that splices the editor module into a noindex'd copy of `index.html` → `tools/hero-editor.html` for Gin to use as a visual editor.
- **Zero-dependency local dev server**: `tools/dev-server.mjs` (Node HTTP, port 8080, path-traversal guard), `tools/dev-server.cmd` (double-click launcher, auto-opens editor URL), `tools/dev-server-restart.cmd` (kills stale PID on port before restart).
- `docs/hero-editor.md`: 5-part walkthrough for Gin (bookmark editor URL → design pinboard → copy JSON → paste into GitHub → verify).

### Changed
- Replaced dormant `ANNOUNCEMENT_CSV_URL` single-cell-sheet branch with `HERO_NOTES_URL = 'docs/hero-notes.json'` + cache-bust + `isValidHeroNote()` schema validation (silent fallback on malformed JSON).
- About section tagline font `Playwrite GB J` → `Caveat` to match sticky-note handwritten vibe.
- Refined cyber `--fg-dim` brightened `#9098b0` → `#a4acc0` — WORKSHOP RATE / MOT FROM / AVERAGE REVIEW / TURNAROUND now readable without changing opacity.

### Removed
- User-facing "Add note" button on the pinboard — stickies are curated by Gin via the editor only.
- `docs/announcement-sheet.md` — single-cell Google Sheet approach obsoleted by JSON editor.

### Fixed
- Editor module `ReferenceError: Cannot access 'hep' before initialization` — hoisted `const hep` declaration above dependent functions in `waitForApi()`.

### Internal
- Roadmap `p2_09` and `p2_10` marked **done** (completed 2026-04-21).
- Roadmap `p2_11` remains `to_consider` — full month-view calendar scheduling UI, only to be built if Gin explicitly asks after using `expires_at` for a few months.
- Mobile UX went through several iterations before landing on the final opt-in + emoji-pin + × dismiss model: desktop tape → CSS pushpin → bottom-right "Aktualności" toggle → hidden entirely → opt-in with 📌 emoji + dismiss. Iterations left no residue in the shipped code.

---

## [2026-04-21] — Session 5 housekeeping

### Internal
- Approved plan for **unified schedule sticker** — future replacement for p2_07 Sheet CSV overrides. Special sticker in `docs/hero-notes.json` with `type: "schedule"` + `entries[]` drives hero-render + opening-hours logic + Call Gin offline tip from one source. Implementation deferred; plan persisted in `~/.claude/plans/`.
- Backfilled `roadmap.json` session 4 with 4 previously-missing mobile-hero fold commits (`5746a7a`, `734a855`, `b566a46`, `f916740`) — experiment shipped then reverted, net-zero on main.
- Created `~/.claude/skills/gd-update/` (modelled on `sophia-update`) for reusable session-finalization workflow: roadmap update → CHANGELOG update → selective git-add → optional commit + push with hard-rule "zero push without explicit yes".

---

## [2026-04-20] — Session 4

### Added
- **Opening hours override system** (p2_07): `index.html` fetches a CSV-published Google Sheet and overrides the default Mon–Fri schedule for matching dates. Silent fallback to defaults on any error. `OVERRIDES_CSV_URL` constant empty until Gin wires it.
- `docs/opening-hours-overrides.csv` starter (UK bank holidays 2026–2027 + Christmas/NYE early closes, 19 rows).
- `docs/opening-hours-sheet.md`: 35-step walkthrough for Gin (download CSV → create Sheet → import → publish CSV → wire URL via GitHub web editor → verify). No CLI required.
- **Call Gin offline UX**: `.is-offline` class greys the button + adds `cursor: not-allowed` + opacity 0.75 + suppresses cyber shine. `tel:` stays clickable so voicemail still works.
- **Dynamic offline tooltip** via `data-tip` attribute on wrapper — built from same schedule source as status dot. Names next open window (weekday/weekend/override-aware).
- **Mobile tap-to-reveal** for offline button: first tap shows tooltip + blocks dial, second tap dials. Auto-hide after 6s or tap-elsewhere.
- Live ONLINE/OFFLINE status tags next to phone numbers in contact section — green/grey dot + Mon–Fri hours, right-aligned.

### Changed
- Reverted hero mobile CTA reorder — Call Gin stays on top regardless of phone-open state (simpler mental model).
- Location section: softer panel tint via `color-mix(bg-2, white 4%)`, dropped hard border, overlapped adjacent section borders with negative margin + `z-index`.
- Quote form (cyber variant): dropped hard border, softer tinted bg, restored diagonal corner notches (top-left + bottom-right).
- Quote form fields: removed borders, used `color-mix(bg-2, black 6%)` inset well so fields read in light mode; accent focus bar via `box-shadow`.
- Reviews section: removed inline top/bottom borders; unified card borders at `--line`.
- Editorial hero: fixed cramped bottom spacing via `margin-top: 64px` on `.trust`.

### Removed
- CTA strip banner ("Ready to book?") — redundant with hero + contact.

### Internal
- Mobile hero fold experiment (net-zero): shipped two variants — fill viewport like desktop (`5746a7a`), then fold-ends-at-hero-meta-border (`734a855`). Both reverted (`b566a46`, `f916740`).

---

## [2026-04-20] — Session 3

### Added
- Subtle in-box "Also send via WhatsApp" follow-up button on quote-form success (auto-hide 15s→20s).
- Tooltip UX: 450ms appearance delay on hover/focus; explicit `font-style: normal` to block italic leak from editorial variant's `.big-phone`.

### Changed
- Quote form confirmation: two-line success message naming destination mailbox (`info@gdautocentre.com`) + echoing customer's reply channel (email/phone).
- Submit button restyle (variant A): solid WhatsApp green `#25D366` + notch clip-path, hover darkens to `#128C7E` — replaces cyan-violet gradient in refined cyber variant.
- Submit button width: content-sized (`justify-self: start` on grid) instead of full-width.

### Fixed
- Contact section email typo: `info@gdautocentre.co.uk` → `info@gdautocentre.com` (was silently misrouting enquiries).
- Replaced automatic `wa.me` popup (800ms, stole focus on mobile) with opt-in button — no more focus theft.

### Internal
- Web3Forms delivery verified end-to-end: Piotr submitted live form → email confirmed landed in Gin's inbox.
- Removed accidentally committed `index_previous.html` backup from repo.

---

## [2026-04-19] — Session 2

### Added
- **Full SEO on-page deployment**: `<title>`, meta description, OG tags, Twitter Card, canonical URL (p1_02).
- **schema.org AutoRepair JSON-LD** with address, phone, services, opening hours, coordinates.
- Real Google review quotes embedded: V.D., P.B., D.S., A.F., T.C. with GBP deep-links.
- `sitemap.xml` + `robots.txt` committed and deployed (p1_03).
- `googleeae965ac6124f163.html` — Google Search Console verification file (p1_04). **Do not delete.**

### Changed
- Mobile-first phone CTAs — WhatsApp primary throughout, landline secondary with tooltip explanation.
- Google Maps embed: removed dark filter (`filter: none`).
- Hero caption grid alignment + glass-effect tooltip with brand-orange border.
- Tooltip font-weight reduced 300 → 200.

### Internal
- GSC verified via HTML file method. Sitemap submitted to GSC 2026-04-19.
- Estimated SEO score post-deploy: ~78/100.
