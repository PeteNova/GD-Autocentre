# Opening hours overrides — Google Sheet

The website follows a default schedule:

- **Workshop (landline 01452 422 405)** — Mon–Fri 09:00–17:30
- **Phone (mobile 07894 550 082)** — Mon–Fri 09:00–18:00

This default is baked into the site. The Google Sheet below lets Gin
override a single day — for bank holidays, Christmas, early closes,
etc. — without editing any code.

---

## How it works

1. Gin creates and owns one Google Sheet.
2. The sheet is **published to the web as CSV**.
3. The site fetches that CSV on every page load and checks if today's
   date has a row.
4. If yes → banner, Call Gin button state, phone tags, and hero status
   all reflect the override.
5. If no → site uses the normal Mon–Fri schedule above.
6. If the sheet can't be reached → site silently falls back to the
   default schedule. The site never breaks because of sheet issues.

---

## Sheet template

**Columns (row 1 must be exactly these headers, lowercase or any case):**

| date | status | open | close | note |
|------|--------|------|-------|------|

**Row format:**

- `date` — ISO date `YYYY-MM-DD` (e.g. `2026-12-25`)
- `status` — either `closed` or `open`
- `open` — `HH:MM` when status is `open` (ignored when `closed`)
- `close` — `HH:MM` when status is `open` (ignored when `closed`)
- `note` — short text shown next to the status (optional)

**Example:**

```
date,status,open,close,note
2026-12-24,open,09:00,14:00,Christmas Eve early close
2026-12-25,closed,,,Christmas Day
2026-12-26,closed,,,Boxing Day
2026-12-31,open,09:00,14:00,New Year's Eve early close
2027-01-01,closed,,,New Year's Day
2027-04-02,closed,,,Good Friday
2027-04-05,closed,,,Easter Monday
```

Rules:

- One row per date.
- Dates in the past are harmless — they're ignored.
- Unknown `status` values are ignored.
- Malformed rows (e.g. `open` without times) are ignored.

---

## Setting up the sheet (one-time, for Gin)

A starter CSV with UK bank holidays 2026–2027 lives at
`docs/opening-hours-overrides.csv` in this repo. You can either:

**Option A — Import the starter CSV (fastest):**

1. Go to https://sheets.google.com and create a new empty spreadsheet.
   Name it `GD Autocentre — Opening Hours Overrides`.
2. File → **Import** → **Upload** → drag
   `docs/opening-hours-overrides.csv` from the repo.
3. Import location: **Replace current sheet**. Separator: **Comma**.
   Click Import data.
4. Review the dates — remove anything you don't want, add more rows for
   your own off-days.
5. Skip to **Publish to the web** below.

**Option B — Start from scratch:**

1. Go to https://sheets.google.com and create a new spreadsheet.
   Name it `GD Autocentre — Opening Hours Overrides`.
2. In row 1, type the headers: `date`, `status`, `open`, `close`, `note`
   (one per column).
3. Add rows for the holidays / exceptions (example above).

---

**Publish to the web** (both options end here):

4. **Publish to the web:**
   - File → Share → **Publish to web**
   - On the left dropdown: choose the sheet (usually "Sheet1")
   - On the right dropdown: **Comma-separated values (.csv)**
   - Click **Publish**
   - Confirm the dialog
   - Copy the URL shown — it looks like:
     `https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?output=csv`
5. Paste that URL into `index.html`, inside the `OVERRIDES_CSV_URL`
   constant (search for the exact string `OVERRIDES_CSV_URL = ''` and
   replace `''` with `'<that URL>'`). Commit and push — Vercel will
   redeploy automatically.

Once the URL is set, every page visit refetches the sheet, so any edit
Gin makes in the sheet is live on the next page load (no code change,
no deploy).

---

## Editing workflow (Gin's day-to-day)

- Add a row for a date → goes into effect immediately.
- Remove a row → date reverts to the default schedule.
- No need to tell anyone, no need to push anything — just save the sheet.

---

## Checking it works

1. Add a row for **today** with `status = closed` and `note = Test`.
2. Open the site (hard refresh: Ctrl/Cmd + Shift + R).
3. The top banner should show **OFFLINE** with a "Test" note; the
   **Call Gin** button should be greyed out with its tooltip; the
   phone tags in the contact section should show grey dots.
4. Delete the test row; refresh — everything back to normal.

---

## Known limits (documented, not bugs)

- Only **today** is checked. Future rows are waiting patiently for
  their date to come up.
- Phone and workshop windows share the same `open` / `close` on an
  override day. Default schedule still distinguishes them (09:00–17:30
  vs 09:00–18:00).
- No recurring schedule changes (e.g. "every Saturday open"). The
  full weekly calendar is a planned phase 2 feature.
- No customer bookings. That's phase 3.
