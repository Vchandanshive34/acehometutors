// Header scroll effect
const hdr = document.querySelector('header.site');
if (hdr) {
  window.addEventListener('scroll', function() {
    hdr.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

// Mobile navigation
const burger = document.querySelector('.nav-burger');
const mm = document.querySelector('.mobile-menu');
if (burger && mm) {
  const setOpen = function (open) {
    mm.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', function () { setOpen(mm.hidden); });
  mm.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mm.hidden) setOpen(false);
  });
}

// Scroll reveal animations
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(el);
  });
  
  const style = document.createElement('style');
  style.textContent = '.reveal.in { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
}
