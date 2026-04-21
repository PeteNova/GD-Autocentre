# Hero editor — how to use it

The homepage hero has a **pinboard of sticky notes**. The yellow ones
are written by visitors (they're private, saved in each visitor's own
browser). The **orange / coloured** ones are yours, Gin — announcements,
offers, "back at 15:00", whatever you want pinned for everyone to see.

To design those stickies, open one URL:

> **https://gd-autocentre.vercel.app/tools/hero-editor.html**

Bookmark it. That page looks identical to the live homepage, but with
an extra **editor panel** floating bottom-right. Anything you do in the
panel is local to your browser until you **publish** (Parts 3–4 below).

---

## Day-to-day workflow

### Part 1 — Open the editor

1. Click your bookmark (or type the URL above).
2. You see the real hero, plus a dark panel bottom-right titled
   **"Hero editor (N)"** where N is how many stickies you have.
3. Any stickies you were working on last time are restored
   automatically. They're not yet on the live site — you'll publish
   them in Part 4.

### Part 2 — Design the pinboard

- Click **`+ Add sticky`** → a new yellow note appears at centre.
- **Click** the note to select it (it gets an orange outline).
- **Drag** it with the mouse/finger → reposition anywhere in the hero.
- **Drag the bottom-right corner** → resize.
- In the panel you can change:
  - **Text** — what's written on the note
  - **Colour** — yellow / orange / pink / blue / green (5 chips)
  - **Label** — tiny text at the top ("From Gin", "Today", or blank)
  - **Rotation** — ±6° slider for a hand-pinned feel
  - **Size** and **Position** — exact pixel/percent values
- Repeat for as many stickies as you want (soft max ~6 looks tidy).

To remove a sticky: select it, click **`Delete selected`**.

### Part 3 — Export

When happy, click **`Copy to clipboard`** on the panel.
You've just copied the layout as JSON text.

(Alternative: **`Download JSON`** saves a file called `hero-notes.json`
to your Downloads.)

### Part 4 — Publish

This is the only step that reaches the live site.

1. Go to the data file on GitHub:
   **https://github.com/PeteNova/GD-Autocentre/blob/master/docs/hero-notes.json**
2. Click the pencil icon **✎** ("Edit this file").
3. Select everything in the editor (Ctrl/Cmd + A) and delete it.
4. Paste the JSON you copied in Part 3 (Ctrl/Cmd + V).
5. Scroll down. In **Commit changes**:
   - Message: `Update hero notes` (or anything — free text)
   - Keep "Commit directly to the `master` branch" selected.
   - Click **Commit changes**.
6. Wait about 30 seconds — Vercel redeploys automatically.

### Part 5 — Verify

Open https://gd-autocentre.vercel.app in a new private/incognito tab
(so you don't see a cached version). Your stickies should appear on the
hero where you placed them.

That's it. Come back any time, tweak, export, paste, commit.

---

## Tips

- The editor **remembers your work** between sessions (in your
  browser's local storage). So if you close the tab, reopen it
  tomorrow — your layout is still there. But it's NOT on the live site
  until you publish.
- You can **start fresh** any time with the **`Reset all`** button.
- Want to load the currently-published layout back into the editor?
  Click the refresh button in the browser — if the editor has no
  local WIP saved, it pulls the live `hero-notes.json`.
- The **`Import JSON…`** button lets you paste a JSON blob back in
  (useful if you want to pick up edits from another browser).
- Collapse the panel with the **`−`** button in its header to see the
  full hero without the panel in the way.

---

## Mobile

The editor panel warns you: **on mobile the stickies fold into a
top-right column** (the same place the yellow visitor notes live) and
positions are ignored — because free placement doesn't work on narrow
screens. Your colour, size, label, rotation, and text are all still
respected.

Design on desktop; trust that mobile will fold things tidily.

---

## Something went wrong?

- **"Panel shows 0 stickies but the live site still has some."** — your
  local editor state was empty when you opened it; hit Reset, then
  refresh the page, then click into the URL bar and press Enter to do
  a proper reload. The editor will re-fetch the live JSON.
- **"I committed but the site still shows the old stickies."** — Vercel
  takes ~30 s to redeploy; then do a hard-reload (Ctrl/Cmd + Shift + R)
  to bypass your browser cache.
- **"I pasted garbage into `hero-notes.json` and the hero is broken."**
  — the site silently ignores malformed JSON and renders no hero
  stickies, so it won't actually look broken. But open GitHub and
  paste `[]` (two characters — an empty array) into the file, commit,
  and you're back to a clean slate.

---

## What's NOT in scope

- Visitor yellow notes in the top-right column — those are personal to
  each visitor. The editor doesn't touch them.
- Scheduling / auto-expiry ("hide this sticky after Friday"). Not yet.
  Re-edit + commit when you want it gone.
- Markdown formatting (bold, links). Plain text only — keeps the
  hand-written feel.
