/* Ace Home Tutors — renders tutors, testimonials & services from /data/*.json
   so the CMS admin panel can edit content without touching HTML. */
(function () {
  var ICONS = {
    board: '<path d="M3 6.5 12 3l9 3.5-9 3.5-9-3.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M6 9v5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V9" stroke="currentColor" stroke-width="1.7"/><path d="M21 6.5V12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    middle: '<path d="M4 5h16v14H4zM4 9h16M9 5v14" stroke="currentColor" stroke-width="1.7"/>',
    board_exam: '<path d="M6 3h9l4 4v14H6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    senior: '<path d="M12 4 2 9l10 5 8-4v6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><path d="M6 11.5V16c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4.5" stroke="currentColor" stroke-width="1.7"/>',
    entrance: '<path d="m12 3 2.5 5.3L20 9l-4 4 1 6-5-2.8L7 19l1-6-4-4 5.5-.7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    online: '<rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 20h8M12 17v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function initials(name) {
    return String(name || '').trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
  }

  function fetchJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('Failed to load ' + path);
      return r.json();
    });
  }

  function renderServices(items) {
    var wrap = document.querySelector('.cats');
    if (!wrap) return;
    wrap.innerHTML = items.map(function (s) {
      var subs = (s.subs || []).map(function (sub) { return '<span>' + esc(sub) + '</span>'; }).join('');
      return (
        '<article class="cat reveal">' +
        '<span class="ic"><svg viewBox="0 0 24 24" fill="none">' + (ICONS[s.icon] || ICONS.board) + '</svg></span>' +
        '<span class="tag">' + esc(s.tag) + '</span>' +
        '<h3>' + esc(s.title) + '</h3>' +
        '<p>' + esc(s.description) + '</p>' +
        '<div class="subs">' + subs + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function renderTutors(items) {
    var wrap = document.querySelector('.tutors');
    if (!wrap) return;
    wrap.innerHTML = items.map(function (t) {
      var chips = (t.subjects || []).map(function (sub) {
        return '<span class="chip' + (sub.highlighted ? ' on' : '') + '">' + esc(sub.name) + '</span>';
      }).join('');
      return (
        '<article class="tutor reveal">' +
        '<div class="t-top">' +
        '<span class="avatar" style="width:48px;height:48px;font-size:1rem;">' + esc(initials(t.name)) + '</span>' +
        '<div><h3>' + esc(t.name) + '</h3>' +
        '<div class="t-meta"><svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" stroke-width="1.7"/></svg>' + esc(t.location) + '</div>' +
        '<div class="t-exp"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>' + esc(t.experience) + '</div>' +
        '</div></div>' +
        '<div class="t-sub">' + chips + '</div>' +
        '<div class="t-foot"><span class="lvl">Teaches <b>' + esc(t.teaches) + '</b></span></div>' +
        '</article>'
      );
    }).join('');
  }

  function renderTestimonials(items) {
    var wrap = document.querySelector('.quotes');
    if (!wrap) return;
    var star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.3 6.9.9-5 4.8 1.2 6.8L12 17.6 5.9 20.8 7.1 14l-5-4.8 6.9-.9z"/></svg>';
    wrap.innerHTML = items.map(function (q) {
      var rating = Math.max(0, Math.min(5, q.rating || 5));
      return (
        '<figure class="quote reveal" style="margin:0;">' +
        '<div class="stars" aria-label="' + rating + ' out of 5">' + star.repeat(rating) + '</div>' +
        '<p>&quot;' + esc(q.quote) + '&quot;</p>' +
        '<figcaption class="who"><span class="av">' + esc((q.name || '?')[0]) + '</span><span><b>' + esc(q.name) + '</b><span>' + esc(q.role) + '</span></span></figcaption>' +
        '</figure>'
      );
    }).join('');
  }

  function revealNew() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      io.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      fetchJSON('data/services.json').then(function (d) { renderServices(d.services || []); }).catch(function (e) { console.error(e); }),
      fetchJSON('data/tutors.json').then(function (d) { renderTutors(d.tutors || []); }).catch(function (e) { console.error(e); }),
      fetchJSON('data/testimonials.json').then(function (d) { renderTestimonials(d.testimonials || []); }).catch(function (e) { console.error(e); })
    ]).then(revealNew);
  });
})();
