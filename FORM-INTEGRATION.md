# Wiring your existing forms into the new database

Your "Find a Tutor" and "Become a Tutor" forms currently only email you
(Formspree/EmailJS/etc). **Leave that email exactly as it is** — it's a
good instant notification. We're just also saving a copy into Supabase so
it shows up in the admin panel.

## 1. Add the Supabase client to both form pages

In `find-a-tutor.html` and `become-a-tutor.html`, just before `</body>`,
add (if not already present from elsewhere on the page):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const ACE_DB = window.supabase.createClient(
    "https://YOUR-PROJECT-REF.supabase.co",   // same as admin/assets/config.js
    "YOUR-ANON-PUBLIC-KEY"                     // same as admin/assets/config.js
  );
</script>
```

## 2. In your existing submit handler, add one insert call

Find wherever your form's JS currently handles submission (the code that
runs when the "Submit & Find My Tutor" / "Register as a Tutor" button is
clicked, likely fetch()-ing Formspree or similar). Add a Supabase insert
**alongside** it — don't remove the email step.

### Find a Tutor (students table)

```js
await ACE_DB.from('students').insert({
  parent_name: document.getElementById('parentName').value,      // adjust field ids to match your form
  student_name: document.getElementById('studentName').value,
  phone: document.getElementById('phone').value,
  email: document.getElementById('email').value || null,
  dob: document.getElementById('dob').value || null,
  school: document.getElementById('school').value || null,
  locality: document.getElementById('locality').value || null,
  area: document.getElementById('area').value || null,
  student_class: document.getElementById('studentClass').value || null,
  board: document.getElementById('board').value || null,
  subjects: Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(el => el.value).join(', '),
  preferred_days: document.getElementById('days').value || null,
  preferred_timing: document.getElementById('timing').value || null,
  mode: document.getElementById('mode').value || null,
  special_requirements: document.getElementById('specialReq').value || null,
});
```

### Become a Tutor (teachers table)

```js
await ACE_DB.from('teachers').insert({
  full_name: document.getElementById('fullName').value,
  phone: document.getElementById('phone').value,
  email: document.getElementById('email').value || null,
  locality: document.getElementById('locality').value || null,
  area: document.getElementById('area').value || null,
  subjects: Array.from(document.querySelectorAll('input[name="subjects"]:checked')).map(el => el.value).join(', '),
  classes_taught: document.getElementById('classesTaught').value || null,
  boards: document.getElementById('boards').value || null,
  experience_years: document.getElementById('experience').value || null,
  qualification: document.getElementById('qualification').value || null,
  availability: document.getElementById('availability').value || null,
});
```

**Note:** the exact `document.getElementById(...)` calls above are
placeholders — swap them for whatever IDs/names your actual form fields
use. If you're not sure, share the form's HTML/JS and the exact insert
code can be written to match it precisely.

Wrap the insert in the same try/catch as your existing submit logic so a
Supabase hiccup never blocks the email from going out (or the "Thank
you" message from showing) — treat it as a best-effort second copy of
the data, not a required step.

## 3. That's it

New registrations will now appear in `admin/students.html` and
`admin/teachers.html` automatically, right alongside the emails you
already get.
