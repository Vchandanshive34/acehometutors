# Ace Home Tutors — Admin Panel Setup Guide

This adds a password-protected admin dashboard to your existing GitHub
Pages site, backed by a free Supabase database. No servers to run —
it's all static files + Supabase, so it works fine on GitHub Pages.

What you're getting:
- `admin/login.html` — sign-in page
- `admin/dashboard.html` — overview stats + recent registrations
- `admin/students.html` — full CRUD for parent/student registrations
- `admin/teachers.html` — full CRUD for teacher registrations
- `admin/calendar.html` — shared calendar of scheduled sessions, filterable per student or per teacher
- `sql/schema.sql` — the database structure

Total setup time: about 15 minutes.

---

## Step 1 — Create your Supabase project

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Give it a name (e.g. `acehometutors`), set a database password
   (save it somewhere), pick the region closest to India (e.g.
   Singapore), and create the project. Wait ~2 minutes for it to spin up.

## Step 2 — Create the tables

1. In your Supabase project, open **SQL Editor** (left sidebar) → **New query**.
2. Open `sql/schema.sql` from this package, copy all of it, paste it in, and click **Run**.
3. You should see "Success. No rows returned." — this created the
   `students`, `teachers`, and `sessions` tables with the right
   permissions already configured (public forms can only add new rows;
   only a signed-in admin can view/edit/delete).

## Step 3 — Get your API keys

1. In Supabase: **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `admin/assets/config.js` in this package and paste them in:

```js
window.ACE_SUPABASE_URL = "https://xxxxxxxx.supabase.co";
window.ACE_SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

The anon key is safe to expose in frontend code — it can only do what
the database policies allow (public insert, admin-only read/write),
nothing more.

## Step 4 — Create your admin login

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the email and password you want to log into the admin panel
   with (e.g. `admin@acehometutors.com`). Tick **Auto Confirm User**.
3. That's your login for `admin/login.html`. Add more admin users the
   same way if more than one person needs access.

## Step 5 — Add the admin folder to your site

1. Copy the whole `admin/` folder into the root of your
   `acehometutors` GitHub repo (same level as `index.html`), so the
   structure looks like:

   ```
   acehometutors/
     index.html
     find-a-tutor.html
     become-a-tutor.html
     ...
     admin/
       login.html
       dashboard.html
       students.html
       teachers.html
       calendar.html
       assets/
         config.js
         admin.css
         app.js
   ```

2. Commit and push. It'll be live at:
   `https://vchandanshive34.github.io/acehometutors/admin/login.html`

**On privacy:** GitHub Pages can't password-protect files at the server
level — the admin HTML/CSS/JS files are technically downloadable by
anyone who knows the URL, same as any file on the site. That's fine
here, because they're empty shells with no data in them. All the actual
registration data lives in Supabase and is blocked by Row Level Security
unless someone is signed in with a real admin account created in Step 4.
Nobody can read or change data without logging in. If you'd rather the
admin URLs not be discoverable at all, the safer long-term option is
moving the admin panel off GitHub Pages onto something like Vercel or
Netlify with real access control — happy to help with that later if it
becomes a concern.

## Step 6 — Connect your public forms

See `FORM-INTEGRATION.md` in this package — a few lines added to your
existing "Find a Tutor" and "Become a Tutor" form scripts so new
submissions save into the database (your existing email notifications
keep working exactly as they do now).

## Step 7 — Try it out

1. Visit `.../admin/login.html`, sign in with the account from Step 4.
2. Add a test student and a test teacher from the dashboard.
3. Go to **Calendar**, click any date, and schedule a session between
   them — you'll see it appear on both the student's and the teacher's
   filtered calendar view (use the "Calendar" link next to each row in
   the Students/Teachers tables).

---

## How the calendar works

Each row in `sessions` links one student + one teacher (optional) to a
date/time. `calendar.html` shows everything by default; use the
**All students** / **All teachers** dropdowns to filter down to one
person, or click the **Calendar** link on any row in `students.html` /
`teachers.html` to jump straight to that person's filtered view.

## Managing statuses

- **Students**: new → matched → demo_scheduled → active / inactive
- **Teachers**: new → verified → active / inactive
- **Sessions**: scheduled → completed / cancelled

These are just labels stored as text — edit the `<select>` options in
the HTML if you want different stages later.

## Adding more admin users later

Repeat Step 4 in Supabase Authentication → Users any time.

## Costs

Supabase's free tier (500MB database, 50k monthly active users) is far
more than a single-city tutoring business needs — this should run at
$0/month indefinitely.
