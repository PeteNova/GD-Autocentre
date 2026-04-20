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

## Setting up the sheet — step by step (one-time, for Gin)

You need: a Google account, a web browser, and ~10 minutes.
**No coding, no CLI, no software to install.**

### Part 1 — Download the starter file

1. Open the repo on GitHub in your browser:
   https://github.com/PeteNova/GD-Autocentre
2. Click the folder **`docs`**.
3. Click the file **`opening-hours-overrides.csv`**.
4. On the right side, click **Download raw file** (the ⬇ icon).
5. The file saves as `opening-hours-overrides.csv` in your Downloads.

### Part 2 — Create the Google Sheet

6. Go to https://sheets.google.com. Sign in if needed.
7. Click **Blank spreadsheet** (the big `+` card).
8. At the top left, click the filename "Untitled spreadsheet" and
   rename it to: **`GD Autocentre — Opening Hours Overrides`**.
9. Top menu: **File** → **Import**.
10. In the dialog, click the **Upload** tab.
11. Drag `opening-hours-overrides.csv` from your Downloads into the
    dialog (or click "Browse" and pick it).
12. Import settings:
    - Import location: **Replace current sheet**
    - Separator type: **Comma** (or "Detect automatically")
    - Convert text to numbers, dates, and formulas: **No**
    (important — keeps "09:00" as text, not a time number)
13. Click **Import data**.

You should now see 19 rows of UK bank holidays and Christmas /
New Year early-closes. Row 1 is the header: `date, status, open,
close, note`.

### Part 3 — Review and adjust

14. Scroll through the dates. Delete any row you don't want (right-click
    the row number → Delete row).
15. Add your own off-days: click into the next empty row and fill the
    5 cells. Date format is strict: `YYYY-MM-DD` (e.g. `2026-07-15`).
16. Any edits you make now — or at any time in the future — are saved
    automatically. No "Save" button.

### Part 4 — Publish to the web as CSV

17. Top menu: **File** → **Share** → **Publish to web**.
18. In the dialog:
    - Left dropdown: **Sheet1** (the default — whatever tab holds your
      data)
    - Right dropdown: **Comma-separated values (.csv)**
19. Click **Publish**.
20. Confirm the dialog ("Are you sure you want to publish this?") →
    **OK**.
21. Google shows a URL that looks like:
    `https://docs.google.com/spreadsheets/d/e/2PACX-<long-code>/pub?output=csv`
22. **Copy that URL** (Ctrl/Cmd + C). You'll paste it in Part 5.
23. Close the dialog.

### Part 5 — Point the website at the sheet

This is the only code change — one line, done in GitHub's web editor.
**No CLI, no Git, just clicks.**

24. Go to the file on GitHub:
    https://github.com/PeteNova/GD-Autocentre/blob/master/index.html
25. Press **`t`** (GitHub shortcut opens the file finder — skip if
    unfamiliar), or use **Ctrl/Cmd + F** to search the file.
26. Click the pencil icon **✎** in the top-right of the file view
    ("Edit this file").
27. Press **Ctrl/Cmd + F** in the editor and search for:
    `OVERRIDES_CSV_URL`
28. You'll find this line:
    `const OVERRIDES_CSV_URL = '';`
29. Replace the empty quotes with your URL from step 22. The line
    should now look like:
    `const OVERRIDES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-…/pub?output=csv';`
    (keep the single quotes and the semicolon — only replace the empty
    `''`).
30. Scroll to the bottom of the page. In the **Commit changes** box:
    - Commit message: `Wire opening-hours sheet URL`
    - Leave "Commit directly to the master branch" selected.
    - Click **Commit changes**.
31. Done. Vercel automatically redeploys the site in ~30 seconds.

### Part 6 — Verify

32. After ~1 minute, open https://gd-autocentre.vercel.app in a private
    browser window (to bypass cache).
33. If today's date is in your sheet, you should see the override
    reflected immediately (banner, Call Gin button state, phone tags).
34. If today's date is **not** in the sheet, you should see the normal
    Mon–Fri 09:00–17:30 / 09:00–18:00 behaviour — unchanged from
    before. This is correct.
35. From now on, just edit the Google Sheet — changes are live within
    seconds of a page reload. Never touch GitHub again unless you
    change the sheet's URL.

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
