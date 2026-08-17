# One-time setup: connect the admin panel to your GitHub account

The admin panel at `yoursite.com/admin/` edits your site by committing
directly to your `acehometutors` GitHub repo. For that to work securely,
GitHub needs a small "OAuth proxy" in the middle. This is a one-time,
15-minute setup. It's free — no ongoing cost.

## Step 1 — Create a GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
   (direct link: https://github.com/settings/applications/new)
2. Fill in:
   - **Application name:** Ace Home Tutors CMS
   - **Homepage URL:** `https://vchandanshive34.github.io/acehometutors/`
   - **Authorization callback URL:** you'll fill this in after Step 2 — leave
     it as `https://TEMP.workers.dev/callback` for now, you'll edit it in a minute.
3. Click **Register application**.
4. Click **Generate a new client secret** and copy both the **Client ID**
   and **Client Secret** somewhere safe. You'll paste them into Cloudflare
   in Step 2. (Anyone with the secret could edit your site, so don't share it.)

## Step 2 — Deploy the OAuth proxy on Cloudflare (free)

1. Go to https://dash.cloudflare.com and sign up / log in (free account is fine).
2. In the sidebar: **Workers & Pages → Create → Create Worker**.
3. Give it a name, e.g. `ace-tutors-cms-auth` — Cloudflare will give it a URL like
   `https://ace-tutors-cms-auth.YOURSUBDOMAIN.workers.dev`. Copy that URL.
4. Click **Edit code**, delete the placeholder code, and paste in the contents
   of `admin/oauth-worker.js` (in this same folder). Click **Deploy**.
5. Go to the Worker's **Settings → Variables and Secrets** and add two secrets:
   - `GITHUB_CLIENT_ID` = the Client ID from Step 1
   - `GITHUB_CLIENT_SECRET` = the Client Secret from Step 1
   Save.
6. Go back to your GitHub OAuth App (Step 1) and update the
   **Authorization callback URL** to:
   `https://ace-tutors-cms-auth.YOURSUBDOMAIN.workers.dev/callback`
   (use your actual Worker URL). Save.

## Step 3 — Point the CMS at your proxy

1. Open `admin/config.yml` in your repo.
2. Find the line:
   ```
   base_url: https://YOUR_WORKER_URL
   ```
3. Replace `https://YOUR_WORKER_URL` with your actual Worker URL from Step 2
   (no trailing slash), e.g.:
   ```
   base_url: https://ace-tutors-cms-auth.yoursubdomain.workers.dev
   ```
4. Commit and push.

## Step 4 — Log in

1. Visit `https://vchandanshive34.github.io/acehometutors/admin/`
2. Click **Login with GitHub**, authorize the app.
3. You should see three collections: **Tutors**, **Testimonials**,
   **Services / Subjects**. Edit, add, or remove entries and click
   **Publish** — it commits straight to your repo and the live site
   updates within a minute or two (however long GitHub Pages takes to rebuild).

## Notes

- Only people with push access to your GitHub repo (or repo collaborators
  you add) can log in and publish changes — GitHub's own login screen
  handles that, there's no separate password to manage.
- If login fails with a redirect/callback error, double check the
  callback URL in the GitHub OAuth App **exactly** matches
  `<your worker URL>/callback`.
- If you ever want to lock the admin panel down further (e.g. IP allowlist),
  that's a Cloudflare Worker setting, not something this proxy code needs
  changed for.
