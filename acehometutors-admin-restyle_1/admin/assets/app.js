// ============================================================
// Ace Home Tutors — Admin shared logic
// Loaded on every admin page after config.js + supabase-js CDN
// ============================================================

// Guarded so a blocked CDN or missing config surfaces as a readable message
// on the Self-check page rather than a hard crash on every admin screen.
const sb = (window.supabase && window.supabase.createClient && window.ACE_SUPABASE_URL)
  ? window.supabase.createClient(window.ACE_SUPABASE_URL, window.ACE_SUPABASE_ANON_KEY)
  : null;

// ---------- Auth guard: call at the top of every protected page ----------
async function requireAuth() {
  if (!sb) {
    document.body.innerHTML = '<div style="padding:2rem;font-family:system-ui">Could not reach the database. Open <a href="diagnose.html">Self-check</a> for details.</div>';
    return null;
  }
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ============================================================
// Icons
// ============================================================
const ICONS = {
  overview: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/></svg>',
  students: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>',
  teachers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z"/><path d="M6.5 10.6V15c0 1.9 2.5 3.4 5.5 3.4s5.5-1.5 5.5-3.4v-4.4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2.2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 1.9"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
};

// ---------- Brand lockup, used in the sidebar and on the login card ----------
function brandMarkup(sublabel) {
  return `<span class="tile">A</span><span><b>AC<i>E</i> Home Tutors</b>${sublabel ? `<small>${sublabel}</small>` : ''}</span>`;
}

// ============================================================
// Sidebar
// ============================================================
const NAV_GROUPS = [
  { title: 'Operations', links: [
    { href: 'dashboard.html', icon: 'overview', label: 'Overview' },
    { href: 'calendar.html',  icon: 'calendar', label: 'Schedule', badge: 'sessions' },
  ]},
  { title: 'Records', links: [
    { href: 'students.html',  icon: 'students', label: 'Students', badge: 'newStudents' },
    { href: 'teachers.html',  icon: 'teachers', label: 'Tutors',   badge: 'newTeachers' },
  ]},
  { title: 'Setup', links: [
    { href: 'diagnose.html',  icon: 'check', label: 'Self-check' },
  ]}
];

function renderSidebar(activePage) {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;

  const groups = NAV_GROUPS.map(g => `
      <div class="grp">${g.title}</div>
      <nav class="nav">
        ${g.links.map(l => `
          <a href="${l.href}" class="${l.href === activePage ? 'active' : ''}">
            ${ICONS[l.icon] || ''}
            <span>${l.label}</span>
            ${l.badge ? `<span class="count" data-count="${l.badge}" hidden></span>` : ''}
          </a>`).join('')}
      </nav>`).join('');

  mount.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="brand">${brandMarkup('Admin')}</div>
      ${groups}
      <div class="sidebar-foot">
        <span class="av" id="who-avatar">A</span>
        <span class="idty"><b>Site Admin</b><small id="who-email">&nbsp;</small></span>
        <button class="signout" id="signout-btn">Sign out</button>
      </div>
    </aside>`;

  document.getElementById('signout-btn').addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.href = 'login.html';
  });

  if (sb) sb.auth.getSession().then(({ data }) => {
    if (!data || !data.session) return;
    const email = data.session.user.email || '';
    const el = document.getElementById('who-email');
    const av = document.getElementById('who-avatar');
    if (el) el.textContent = email;
    if (av && email) av.textContent = email.slice(0, 2).toUpperCase();
  });

  loadNavCounts();
}

// Red pills next to the nav items — how much is waiting for attention.
async function loadNavCounts() {
  if (!sb) return;
  const today = new Date().toISOString().slice(0, 10);
  const [s, t, ses] = await Promise.all([
    sb.from('students').select('id, status'),
    sb.from('teachers').select('id, status'),
    sb.from('sessions').select('id, session_date, status').gte('session_date', today)
  ]);

  const counts = {
    newStudents: (s.data || []).filter(r => r.status === 'new').length,
    newTeachers: (t.data || []).filter(r => r.status === 'new').length,
    sessions:    (ses.data || []).filter(r => r.status !== 'cancelled').length
  };

  document.querySelectorAll('[data-count]').forEach(el => {
    const n = counts[el.getAttribute('data-count')];
    if (n) { el.textContent = n; el.hidden = false; }
    else { el.hidden = true; }
  });
}

// ============================================================
// Topbar
// ============================================================
function renderTopbar(opts) {
  const mount = document.getElementById('topbar-mount');
  if (!mount) return;
  const o = opts || {};

  mount.innerHTML = `
    <header class="topbar">
      <button class="menu-btn" id="menu-btn" aria-label="Open menu">&#9776;</button>
      <div class="mtile"><span class="tile">A</span><b>AC<i>E</i></b></div>
      <div>
        <h1>${escapeHtml(o.title || '')}</h1>
        <div class="sub">${o.subtitle || ''}</div>
      </div>
      <div class="spacer"></div>
      ${o.search === false ? '' : `
        <label class="search">
          ${ICONS.search}
          <input type="search" id="topbar-search" placeholder="${escapeHtml(o.searchPlaceholder || 'Search tutors, students…')}" autocomplete="off">
        </label>`}
      ${o.action ? `<a class="btn btn-primary" href="${o.action.href || '#'}" id="topbar-action">${ICONS.plus}<span class="lbl">${escapeHtml(o.action.label)}</span></a>` : ''}
    </header>`;

  setupMobileMenu();
}

function setupMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', (e) => { e.stopPropagation(); sidebar.classList.toggle('open'); });
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) sidebar.classList.remove('open');
  });
}

// A friendly "Monday, 18 August 2026" line for the topbar subtitle.
function todayLine(suffix) {
  const d = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return escapeHtml(d) + (suffix ? ' &middot; ' + suffix : '');
}

// ============================================================
// Small helpers
// ============================================================
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
  const dt = new Date(d + (String(d).length === 10 ? 'T00:00:00' : ''));
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// "16:00:00" → "4:00 PM"
function fmtTime(t) {
  if (!t) return '—';
  const bits = String(t).split(':');
  let h = parseInt(bits[0], 10);
  const m = bits[1] || '00';
  if (isNaN(h)) return t;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ap;
}

// Which pill colour a status gets.
const STATUS_TONE = {
  new: 'p-urgent',
  matched: 'p-warn', verified: 'p-warn', demo_scheduled: 'p-warn',
  active: 'p-ok', completed: 'p-ok',
  scheduled: 'p-info',
  inactive: 'p-mut', cancelled: 'p-mut'
};

function badge(status) {
  const key = String(status || 'new').toLowerCase();
  const tone = STATUS_TONE[key] || 'p-mut';
  return `<span class="pill ${tone}">${escapeHtml(key.replace(/_/g, ' '))}</span>`;
}

// Deterministic avatar colour so the same person is always the same colour.
const AV_COLOURS = ['#0099FF', '#12885A', '#FF3210', '#8A1FD1', '#0A6FC2', '#D97C10'];
function avatarFor(name) {
  const n = String(name || '?').trim();
  let hash = 0;
  for (let i = 0; i < n.length; i++) hash = (hash * 31 + n.charCodeAt(i)) >>> 0;
  const initials = n.split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
  return `<span class="av" style="background:${AV_COLOURS[hash % AV_COLOURS.length]}">${escapeHtml(initials)}</span>`;
}

function person(name, sub) {
  return `<span class="person">${avatarFor(name)}<span><b>${escapeHtml(name || '—')}</b>${sub ? `<small>${escapeHtml(sub)}</small>` : ''}</span></span>`;
}

// "Maths, Science" → chips. Pass a max to keep narrow columns from ballooning.
function subjectChips(str, max) {
  if (!str) return '<span class="muted">—</span>';
  const all = String(str).split(',').map(s => s.trim()).filter(Boolean);
  const shown = max ? all.slice(0, max) : all;
  const rest = all.length - shown.length;
  return '<span class="subj">'
    + shown.map(s => `<span>${escapeHtml(s)}</span>`).join('')
    + (rest > 0 ? `<span title="${escapeHtml(all.join(', '))}">+${rest}</span>` : '')
    + '</span>';
}

function toast(msg, isError) {
  let el = document.getElementById('ace-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ace-toast';
    el.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);padding:11px 18px;border-radius:10px;font-size:13.5px;font-weight:700;z-index:200;box-shadow:0 8px 24px rgba(16,24,39,.25);transition:opacity .2s;color:#fff;';
    document.body.appendChild(el);
  }
  el.style.background = isError ? '#D6321A' : '#12885A';
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2600);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
