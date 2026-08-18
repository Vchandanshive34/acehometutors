# Manual GitHub upload — Ace Home Tutors

Everything you need is in the two folders next to this file. Nothing else
from your repo changes.

Repo: https://github.com/Vchandanshive34/acehometutors

---

## What was actually wrong

Your seven main pages had **no `<!doctype html>`, no `<html>`, no `<head>`,
and no viewport meta tag**. Browsers fall back to "quirks mode" for pages
like that and assume a **980px-wide screen**, then shrink the whole desktop
layout down to fit the phone.

The responsive CSS in your stylesheet was written correctly the whole time —
it just never ran, because the browser thought every phone was a 980px
desktop. Adding the document shell turns all of it back on.

---

## Step 1 — Replace 7 HTML files

Folder: `1-REPLACE-these-7-html-files/`

These go in the **root** of the repo, replacing the files already there.

For each of the 7 files:

1. Open https://github.com/Vchandanshive34/acehometutors
2. Click the file name (e.g. `index.html`)
3. Click the **pencil icon** (top right) to edit
4. Click in the text area, select everything (**Ctrl+A** / **Cmd+A**), press **Delete**
5. Open the matching file from `1-REPLACE-these-7-html-files/` in any text
   editor, select all, copy
6. Paste into the GitHub editor
7. Scroll down, click **Commit changes**

Files, in any order:

- index.html
- about.html
- services.html
- contact.html
- faq.html
- find-a-tutor.html
- become-a-tutor.html

**Faster alternative:** on the repo's main page click **Add file → Upload
files**, then drag all 7 files in at once. GitHub replaces same-named files
automatically. This is one commit instead of seven.

---

## Step 2 — Add 35 banner images

Folder: `2-UPLOAD-to-assets-banners/`

1. In the repo, click into `assets`, then `banners`
2. Click **Add file → Upload files**
3. Drag in **all 35 files** from `2-UPLOAD-to-assets-banners/` at once
4. Commit message: `Add responsive banner variants`
5. Click **Commit changes**

These are new files and don't overwrite anything. Your six original
`*-banner.jpg` files must stay where they are — they're still used as the
fallback for older browsers.

---

## Step 3 — Delete the duplicate folder (optional)

`acehometutors-admin-restyle_1/` is an old backup copy of the admin screens,
about 272 KB, not referenced by the live site.

1. Click into `acehometutors-admin-restyle_1`
2. Click the **⋯** menu (top right) → **Delete directory**
3. Commit

Skip this if you'd rather keep the backup. Nothing else depends on it.

---

## Step 4 — Check it worked

Wait 2–3 minutes for GitHub Pages to rebuild, then open
https://vchandanshive34.github.io/acehometutors/ on your phone.

You should see: a hamburger menu instead of a squeezed desktop navbar,
headings and body text at readable size without pinch-zooming, and stat
cards stacked in two columns rather than four tiny ones.

If it still looks the same, hard-refresh (**Ctrl+Shift+R** / **Cmd+Shift+R**)
— phones cache aggressively.

---

## Measured before / after

Headless Chromium, all 7 pages, at 360 / 390 / 768 / 1366 / 1920 px:

| | before | after |
|---|---|---|
| Pages stuck in quirks mode | 7 | 0 |
| Text smaller than 12px | 49 nodes | 0 |
| Tap targets under 24px (WCAG AA) | 3 | 0 |
| Banner payload, mobile | 468 KB | 223 KB |
| Banner payload, desktop | 468 KB | 110 KB |
| Sideways scrolling | none | none |

---

## Two things to know

**1. A pre-existing JS error, not from these changes.**
`find-a-tutor.html` and `become-a-tutor.html` throw
`Cannot read properties of undefined (reading 'createClient')` when the
jsDelivr CDN that serves the Supabase library fails to load. I could not
reproduce it with working network access, so it's most likely only a
sandbox artifact — but it behaves identically before and after these
changes, so nothing here caused or fixed it. Worth a look in your browser
console on the live site.

**2. Your Supabase keys are public.**
`admin/assets/config.js` contains your Supabase URL and anon key, and it's
in a public repo. That's normal for an anon key **only if** Row Level
Security is switched on for every table. If RLS is off, anyone can read and
write your data. Worth checking in the Supabase dashboard before anything
else.
