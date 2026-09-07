// Ace Home Tutors — Admin
// Minimal nav wiring shared by every admin page. Each page is a real
// .html file (dashboard.html, students.html, teachers.html, calendar.html),
// so "navigation" here just highlights the current page in the sidebar —
// no view-switching JS is required. Kept as a single small file so the
// FastAPI/WordPress backend can swap it out for real data later.

(function () {
  var here = (window.location.pathname.split('/').pop() || 'dashboard.html');

  document.querySelectorAll('[data-page]').forEach(function (el) {
    var isActive = el.getAttribute('data-page') === here;
    el.classList.toggle('active', isActive);
  });

  var signout = document.querySelector('[data-action="sign-out"]');
  if (signout) {
    signout.addEventListener('click', function () {
      // Wire this up to the real auth/session logic when the backend
      // (FastAPI or WordPress admin) is connected.
      window.location.href = 'login.html';
    });
  }
})();
