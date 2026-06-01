// ── Formular-Statusmeldung ────────────────────────────────
(function () {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const box    = document.getElementById('formStatus');
  if (status && box) {
    if (status === 'success') {
      box.textContent = '✓ Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
      box.className   = 'form-status form-status--success';
    } else {
      box.textContent = '✗ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an kontakt@angela-wolber.de';
      box.className   = 'form-status form-status--error';
    }
    box.style.display = 'block';
    history.replaceState(null, '', window.location.pathname + '#contact');
  }
})();

// ── Kontaktformular via Formspree (ohne Weiterleitung) ────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const box = document.getElementById('formStatus');
    const btn = contactForm.querySelector('button[type="submit"]');
    const btnText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet …'; }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        contactForm.reset();
        if (box) {
          box.textContent = '✓ Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Ich melde mich schnell.';
          box.className = 'form-status form-status--success';
          box.style.display = 'block';
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        throw new Error('Serverfehler');
      }
    } catch (err) {
      if (box) {
        box.textContent = '✗ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie direkt an kontakt@angela-wolber.de';
        box.className = 'form-status form-status--error';
        box.style.display = 'block';
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btnText; }
    }
  });
}

// ── Jahr im Footer ────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Header-Schatten beim Scrollen ─────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile Navigation ─────────────────────────────────────
const toggle = document.querySelector('.nav-toggle');
const nav    = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ── Bücher-Filter ─────────────────────────────────────────
const tabs  = document.querySelectorAll('.filter-tab');
const cards = document.querySelectorAll('.book-card');
if (tabs.length && cards.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

// ── Sanfte Einblend-Animation beim Scrollen ───────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.book-card, .about-inner, .contact-form, .reveal, .service-card, .price-card, .sample-card, .highlight-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
