// app.js — shared interactivity for Anasazi Security site

document.addEventListener('DOMContentLoaded', () => {
  // Theme (default dark, allow toggle)
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  let theme = 'dark';
  root.setAttribute('data-theme', theme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
    });
  }

  // Sticky header hide-on-scroll-down
  const header = document.querySelector('.header');
  let lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (header) {
        if (y > lastY && y > 120) {
          header.classList.add('header--hidden');
        } else {
          header.classList.remove('header--hidden');
        }
      }
      lastY = y;
    },
    { passive: true }
  );

  // Mobile menu
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => mobileMenu.classList.add('is-open'));
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
  }
  document.querySelectorAll('[data-mobile-menu] a').forEach((a) => {
    a.addEventListener('click', () => mobileMenu && mobileMenu.classList.remove('is-open'));
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // FAQ accordion
  document.querySelectorAll('.accordion-item').forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.accordion-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Animated stat counters
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const counterIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterIO.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => counterIO.observe(el));
  }

  // Quote form -> mailto fallback (static site, no backend)
  const quoteForm = document.querySelector('[data-quote-form]');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(quoteForm);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const email = data.get('email') || '';
      const service = data.get('service') || '';
      const location = data.get('location') || '';
      const details = data.get('details') || '';
      const subject = encodeURIComponent('Quote Request — ' + name);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService needed: ${service}\nJobsite location: ${location}\n\nDetails:\n${details}`
      );
      window.location.href = `mailto:bradwhitlatch@gmail.com?subject=${subject}&body=${body}`;
      const confirmEl = document.querySelector('[data-form-confirm]');
      if (confirmEl) confirmEl.hidden = false;
    });
  }
});
