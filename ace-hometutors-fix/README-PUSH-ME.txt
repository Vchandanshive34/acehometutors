Ace Home Tutors — files to push
===============================

Unzip this at the ROOT of your repo (the folder that has index.html
and the CNAME file in it).

WHAT GOES WHERE
---------------
  find-a-tutor.html        overwrites the existing file
  become-a-tutor.html      overwrites the existing file
  admin/                   REPLACES the existing admin folder
  sql/schema.sql           overwrites (unchanged, included for reference)


IMPORTANT — DELETE THE OLD admin/ FOLDER FIRST
----------------------------------------------
Do not just copy on top of it. The old admin folder keeps its files in
admin/assets/js/ and admin/assets/css/ . The new one does not use those
folders, so copying on top leaves the old broken files behind and they
will still be served.

  git rm -r admin
  # now unzip / copy this admin folder in
  git add -A
  git commit -m "Fix form submissions reaching admin dashboard"
  git push

After unzipping, admin/ should contain exactly these 10 files:

  admin/dashboard.html
  admin/students.html
  admin/teachers.html
  admin/calendar.html
  admin/login.html
  admin/index.html
  admin/diagnose.html
  admin/assets/app.js
  admin/assets/admin.css
  admin/assets/config.js

If you see admin/assets/js/ or admin/assets/css/ afterwards, the old
folder was not removed. Delete those two folders.


TWO THINGS TO DO IN SUPABASE (project ugpnaobvrzyefokhomvk)
-----------------------------------------------------------
Nothing in this zip can do these, and without both the dashboard stays
empty even after a clean deploy.

1. SQL Editor -> New query -> paste sql/schema.sql -> Run.
   Safe to re-run. This gives the website permission to save enquiries.

2. Authentication -> Users -> Add user, with an email and password.
   That is your dashboard login. Without it you cannot get in at all.


HOW TO CHECK IT WORKED
----------------------
1. Wait for GitHub Pages to rebuild (a minute or two).
2. Go to /admin/login.html and sign in.
3. Open /admin/diagnose.html — it reports whether website forms are
   reaching the database.
4. Fill in the parent form on find-a-tutor.html as a test. The address
   bar must STAY on your own site. If it jumps to a formspree.io page,
   the old find-a-tutor.html is still being served.
5. Your test should now appear on the dashboard and under Students.
6. Delete the test row in the Supabase table editor so counts start clean.


WHAT WAS CHANGED
----------------
find-a-tutor.html
  * removed action="https://formspree.io/f/xyegneow" method="POST" from
    the form tag — that is what made the browser navigate away to
    Formspree before the database code could run
  * the submit handler is attached immediately instead of inside
    setTimeout(..., 1000), and now waits for the Supabase library
  * date of birth and school are now saved (collected but dropped before)
  * blocking alert() popups replaced with an inline error message
  * Formspree still gets an email copy, sent with fetch()

become-a-tutor.html
  * no longer crashes before attaching its submit handler when the
    Supabase CDN is slow or blocked
  * added the Formspree email copy it never had
  * "Less than 1 year" experience now stores 0.5 instead of nothing

admin/
  * replaced the static design mockup (every tile hard-coded to 0, tabs
    and "New assignment" button with no click handler) with the real
    panel that queries Supabase
  * renamed "admin (2).css" to admin.css — every page loads
    assets/admin.css, so the "(2)" alone broke all styling
  * added assets/config.js, which was missing entirely and which every
    admin page loads to get the Supabase URL and key

KNOWN GAP: profile photos and CVs on the tutor form are still not stored
anywhere. File uploads need a Supabase Storage bucket — separate work.

SECURITY NOTE: the Supabase anon key is visible in the page source. That
is normal and safe ONLY because row-level security is on and restrictive.
Never add a public SELECT policy to students or teachers — that would make
every parent's and tutor's phone number readable by anyone. The
service_role key must never go in this repo.
