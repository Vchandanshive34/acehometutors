// ============================================================
// Ace Home Tutors — Admin shared logic
// Loaded on every admin page after config.js + supabase-js CDN
// ============================================================

const sb = window.supabase.createClient(window.ACE_SUPABASE_URL, window.ACE_SUPABASE_ANON_KEY);

// ---------- Auth guard: call at the top of every protected page ----------
async function requireAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ---------- Sidebar ----------
function renderSidebar(activePage) {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;
  const links = [
    { href: 'dashboard.html', icon: '&#9670;', label: 'Dashboard' },
    { href: 'students.html', icon: '&#128100;', label: 'Students / Parents' },
    { href: 'teachers.html', icon: '&#127891;', label: 'Teachers' },
    { href: 'calendar.html', icon: '&#128197;', label: 'Calendar' },
  ];
  mount.innerHTML = `
    <div class="sidebar" id="sidebar">
      <div class="brand">Ace <small>Admin</small></div>
      <nav class="nav">
        ${links.map(l => `<a href="${l.href}" class="${l.href === activePage ? 'active' : ''}"><span class="icon">${l.icon}</span>${l.label}</a>`).join('')}
      </nav>
      <div class="sidebar-foot">
        <div class="who" id="who-email">&nbsp;</div>
        <button class="signout" id="signout-btn">Sign out</button>
      </div>
    </div>`;
  document.getElementById('signout-btn').addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.href = 'login.html';
  });
  sb.auth.getSession().then(({ data }) => {
    const el = document.getElementById('who-email');
    if (el && data.session) el.textContent = data.session.user.email;
  });
}

function setupMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ---------- Small helpers ----------
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + (d.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function badge(status) {
  const cls = 'badge-' + String(status || 'new').toLowerCase().replace(/\s+/g, '_');
  return `<span class="badge ${cls}">${escapeHtml(status || 'new')}</span>`;
}

function toast(msg, isError) {
  let el = document.getElementById('ace-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ace-toast';
    el.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:11px 18px;border-radius:8px;font-size:13.5px;font-weight:600;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .2s;';
    document.body.appendChild(el);
  }
  el.style.background = isError ? '#F0685E' : '#45CBB8';
  el.style.color = isError ? '#2A0E0C' : '#062924';
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2600);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
