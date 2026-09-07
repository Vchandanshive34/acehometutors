# Ace Home Tutors — Admin

Static admin console for Ace Home Tutors: the live `dashboard.html` content
(Dashboard / Students-Parents / Teachers / Calendar, 7 stat tiles, "No
registrations yet" empty tables) rebuilt in the branded light theme — white
cards, cool-grey background, icon-badged tiles, logo lockup, search bar and
"New assignment" button.

## Structure

```
.
├── index.html                 redirects to admin/dashboard.html
└── admin/
    ├── dashboard.html          Dashboard (stat tiles + recent registrations)
    ├── students.html           Students / Parents
    ├── teachers.html           Teachers
    ├── calendar.html           Calendar
    └── assets/
        ├── css/admin.css       shared theme (colors, layout, tables)
        └── js/admin.js         sidebar active-state + sign-out wiring
```

Every page is plain HTML/CSS/JS — no build step. Open `admin/dashboard.html`
directly in a browser, or serve the folder with any static file server.

Stat tiles and the "Recently registered" tables are currently hard-coded to
their empty state (`0`, "No registrations yet") to match a fresh install.
Wire them up to your backend (FastAPI, WordPress admin, etc.) by replacing
the static markup in each `<table class="data">` / `.tile .n` with your
templating or a small fetch() call.

## Deploying

This is a static site, so it can be hosted as-is from GitHub Pages, Netlify,
Vercel, or any static host, or dropped into an existing site's `/admin`
folder (e.g. `candiestesting.in/admin/dashboard.html`).

## Pushing to GitHub

```bash
cd ace-admin
git init
git add .
git commit -m "Ace Home Tutors admin dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
