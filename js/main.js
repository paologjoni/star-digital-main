const WHATSAPP_NUMBER = '355682128669';
const INSTAGRAM_HANDLE = 'stardigital.app';
const CONTACT_EMAIL = 'contact@stardigital.app';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpqgnwav';

initNavbar();
initMobileMenu();
initScrollReveal();
initParticles();
initContactForm();
setActiveNavLink();

/* ── Navbar scroll effect ── */
function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    menu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  menu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', close);
  });
}

/* ── Scroll reveal (Intersection Observer) ── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseFloat(entry.target.dataset.delay || 0);
      entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '-80px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Hero particles ── */
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  for (let i = 0; i < 60; i++) {
    const span = document.createElement('span');
    span.className = 'hero__particle';
    const size = (Math.random() * 2 + 1).toFixed(1);
    const op = (Math.random() * 0.5 + 0.1).toFixed(2);
    const dur = (Math.random() * 3 + 2).toFixed(1);
    const delay = (Math.random() * 4).toFixed(1);
    span.style.cssText = `
      top:${(Math.random() * 100).toFixed(1)}%;
      left:${(Math.random() * 100).toFixed(1)}%;
      width:${size}px;
      height:${size}px;
      --op:${op};
      --dur:${dur}s;
      animation:twinkle ${dur}s ease-in-out infinite ${delay}s;
    `;
    container.appendChild(span);
  }
}

/* ── Active nav link ── */
function setActiveNavLink() {
  const page = document.body.dataset.page;
  if (!page) return;

  const map = {
    home:     '[data-nav="home"]',
    about:    '[data-nav="about"]',
    services: '[data-nav="services"]',
    contact:  '[data-nav="contact"]'
  };

  document.querySelectorAll(map[page] || '').forEach(el => el.classList.add('active'));
}

/* ── Contact form ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const spinner    = document.getElementById('submit-spinner');
  const successEl  = document.getElementById('form-success');
  const errorEl    = document.getElementById('form-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* loading state */
    submitBtn.disabled = true;
    submitText.textContent = t('contact.sending');
    spinner.style.display = 'block';
    errorEl?.classList.remove('visible');

    const data = {
      name:        form.querySelector('#field-name')?.value,
      email:       form.querySelector('#field-email')?.value,
      phone:       form.querySelector('#field-phone')?.value,
      business:    form.querySelector('#field-business')?.value,
      projectType: form.querySelector('#select-project-type')?.value,
      budget:      form.querySelector('#select-budget')?.value,
      message:     form.querySelector('#field-message')?.value,
    };

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.style.display = 'none';
        if (successEl) {
          successEl.querySelector('p').textContent = t('contact.successMsg');
          successEl.classList.add('visible');
        }
      } else {
        throw new Error('server error');
      }
    } catch {
      if (errorEl) {
        errorEl.querySelector('span').textContent = t('contact.errorMsg');
        errorEl.classList.add('visible');
      }
      submitBtn.disabled = false;
      submitText.textContent = t('contact.submitButton');
      spinner.style.display = 'none';
    }
  });
}
