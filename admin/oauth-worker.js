/**
 * OAuth proxy for Decap CMS <-> GitHub, deployed as a Cloudflare Worker.
 *
 * Deploy steps: see admin/OAUTH_SETUP.md in this same folder.
 *
 * Required environment variables (set in Cloudflare dashboard, NOT in this file):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const redirectUri = `${url.origin}/callback`;
      const githubAuthUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${env.GITHUB_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=repo,user`;
      return Response.redirect(githubAuthUrl, 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response(
          "OAuth error: " + (tokenData.error_description || tokenData.error || "unknown"),
          { status: 400 }
        );
      }

      const payload = JSON.stringify({
        token: tokenData.access_token,
        provider: "github",
      });

      const html = `<!doctype html><html><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.removeEventListener("message", receiveMessage, false);
      window.opener.postMessage(
        'authorization:github:success:${payload.replace(/'/g, "\\'")}',
        e.origin
      );
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body></html>`;

      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Ace Home Tutors CMS OAuth proxy is running.", { status: 200 });
  },
};
