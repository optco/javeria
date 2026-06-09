// ============================================
// Javeria Profile - Main JavaScript
// ============================================

// ---------- Helper: resolve dot-notation paths ----------
function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : ''), obj);
}

// ---------- Populate the entire page from AGENT_CONFIG ----------
(function populatePage() {
  if (typeof AGENT_CONFIG === 'undefined') {
    console.error('config.js not loaded');
    return;
  }
  const C = AGENT_CONFIG;

  // 1. TEXT CONTENT — anything with data-text="path"
  document.querySelectorAll('[data-text]').forEach(el => {
    const val = resolve(C, el.dataset.text);
    if (val !== '' && val !== undefined) el.textContent = val;
  });

  // 2. HREF — anything with data-href="path"
  document.querySelectorAll('[data-href]').forEach(el => {
    const val = resolve(C, el.dataset.href);
    if (!val) return;
    const prefix = el.dataset.hrefPrefix || '';
    el.setAttribute('href', prefix + val);
  });

  // 3. BACKGROUND IMAGE — data-bg="path"
  document.querySelectorAll('[data-bg]').forEach(el => {
    const val = resolve(C, el.dataset.bg);
    if (val) el.style.backgroundImage = `url('${val}')`;
  });

  // 4. SRC ATTRIBUTE — data-src="path" (for images)
  document.querySelectorAll('[data-src]').forEach(el => {
    const val = resolve(C, el.dataset.src);
    if (val) el.setAttribute('src', val);
  });

  // 5. FORM VALUES — data-value="path" (hidden inputs)
  document.querySelectorAll('[data-value]').forEach(el => {
    const val = resolve(C, el.dataset.value);
    if (val !== '') el.setAttribute('value', val);
  });

  // 6. FAVICON
  const favicon = document.getElementById('favicon');
  if (favicon && C.company.logo) favicon.setAttribute('href', C.company.logo);

  // 7. AREAS LIST (generated from array)
  const areasEl = document.getElementById('areas-link');
  if (areasEl && C.areas && C.areas.length) {
    areasEl.innerHTML = 'Areas Serviced:<br>' +
      C.areas.map(a => '● ' + a).join('<br>');
  }

  // 8. META TAGS
  const setMeta = (selector, content) => {
    const el = document.querySelector(selector);
    if (el && content) el.setAttribute('content', content);
  };
  if (C.seo) {
    document.title = C.seo.pageTitle || '';
    setMeta('meta[name="description"]', C.seo.description);
    setMeta('meta[name="author"]', C.name.full);
    setMeta('meta[name="keywords"]', C.seo.keywords);
    setMeta('meta[property="og:title"]', C.seo.pageTitle);
    setMeta('meta[property="og:description"]', C.seo.description);
    setMeta('meta[property="og:image"]', C.seo.ogImage || C.profileImage);
    setMeta('meta[property="og:url"]', C.seo.ogUrl);
    setMeta('meta[property="og:site_name"]', C.company.name);
    setMeta('meta[property="profile:first_name"]', C.name.first);
    setMeta('meta[property="profile:last_name"]', C.name.last);
    setMeta('meta[property="profile:username"]', C.social.tiktokUsername);
    setMeta('meta[name="twitter:title"]', C.seo.pageTitle);
    setMeta('meta[name="twitter:description"]', C.seo.description);
    setMeta('meta[name="twitter:image"]', C.seo.ogImage || C.profileImage);
    setMeta('meta[name="twitter:creator"]', C.seo.twitterCreator);
  }

  // 9. SCHEMA.ORG JSON-LD
  const schemaEl = document.getElementById('json-ld-schema');
  if (schemaEl) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": C.name.full,
      "jobTitle": C.title,
      "url": C.seo.ogUrl || C.profileUrl,
      "image": C.profileImage,
      "telephone": C.contact.phone,
      "email": C.contact.email,
      "sameAs": [C.social.tiktok, C.social.instagram],
      "worksFor": {
        "@type": "Organization",
        "name": C.company.name,
        "url": C.company.url,
        "formerName": C.company.formerName
      },
      "knowsAbout": C.expertise || []
    };
    schemaEl.textContent = JSON.stringify(schema, null, 2);
  }
})();

// ---------- Theme Toggle ----------
(function() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const STORAGE_KEY = 'agent-theme-preference';

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    toggle.style.transform = 'scale(0.9) rotate(180deg)';
    setTimeout(() => { toggle.style.transform = 'scale(1) rotate(0deg)'; }, 150);
  };

  applyTheme(getPreferredTheme());

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
    if ('vibrate' in navigator) navigator.vibrate(10);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });
})();

// ---------- Mobile Inline Form Toggle ----------
(function() {
  const trigger = document.getElementById('contact-trigger-mobile');
  const wrapper = document.getElementById('contact-form-mobile');
  const closeBtn = document.getElementById('contact-close-mobile');
  if (!trigger || !wrapper) return;

  const toggleForm = (show) => {
    wrapper.classList.toggle('active', show);
    trigger.setAttribute('aria-expanded', show ? 'true' : 'false');
    if (show) {
      setTimeout(() => {
        const firstInput = wrapper.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  };

  trigger.addEventListener('click', () => toggleForm(!wrapper.classList.contains('active')));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleForm(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrapper.classList.contains('active')) toggleForm(false);
  });
})();

// ---------- Desktop Modal Form Toggle ----------
(function() {
  const modal = document.getElementById('contact-modal');
  const openBtn = document.getElementById('open-contact-modal');
  const closeBtn = document.getElementById('close-contact-modal');
  if (!modal || !openBtn) return;

  const toggleModal = (show) => {
    modal.classList.toggle('active', show);
    if (show) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstInput = modal.querySelector('input, textarea');
        if (firstInput) firstInput.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }
  };

  openBtn.addEventListener('click', () => toggleModal(true));
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleModal(false); });
  modal.addEventListener('click', (e) => { if (e.target === modal) toggleModal(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) toggleModal(false);
  });
})();