(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
  const safeStorage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (_) { /* storage may be unavailable */ } }
  };

  const projectData = {
    scooter: {
      title: 'E-Scooter Rental Management System', category: 'System analysis & design',
      description: 'I developed a system design for an e-scooter rental service that helps users rent, track, and return vehicles efficiently. The focus was making the business rules visible before implementation.',
      bullets: ['Mapped the complete rental lifecycle from availability to return.', 'Translated user and administrator needs into system requirements.', 'Used multiple UML views to clarify behaviour, timing, and responsibilities.'], tags: ['UML', 'Draw.io / Lucidchart', 'System analysis']
    },
    health: {
      title: 'Personal Health Monitoring Application', category: 'Web application / system design',
      description: 'This concept helps users record food intake, sleep patterns, physical activities, and social interactions. The system then turns that information into recommendations that encourage healthier habits.',
      bullets: ['Designed the journey for capturing small, recurring health signals.', 'Explored relationships between user activity, stored data, and recommendations.', 'Practised balancing useful detail with a simple user experience.'], tags: ['UML modeling', 'Database design', 'System analysis']
    },
    bus: {
      title: 'Bus Ticketing System for Kuching City', category: 'System design',
      description: 'I analysed and designed a bus ticketing platform for passengers who need to search routes, purchase tickets, and manage bookings across Kuching City.',
      bullets: ['Modelled interactions between passengers, administrators, and the platform.', 'Outlined business processes for route search and ticket purchase.', 'Used diagrams to communicate requirements before development.'], tags: ['UML diagrams', 'Business process modeling', 'Database design']
    },
    student: {
      title: 'Student Database Management System', category: 'Desktop application / data',
      description: 'A relational database project for storing, updating, and retrieving student information efficiently. It gave me practical experience with SQL thinking and CRUD operations.',
      bullets: ['Designed tables and relationships for structured student records.', 'Practised create, read, update, and delete workflows.', 'Used SQL queries to keep information easy to retrieve and maintain.'], tags: ['MySQL', 'SQL', 'CRUD operations']
    },
    portfolio: {
      title: 'Portfolio Website', category: 'Web application',
      description: 'A personal portfolio that makes my education, technical skills, projects, and learning direction easy to understand in one place.',
      bullets: ['Built a responsive single-page experience with plain HTML, CSS, and JavaScript.', 'Added accessible navigation, progressive reveals, filters, and a working front-end form.', 'Created a visual language inspired by network diagrams and technical notebooks.'], tags: ['HTML', 'CSS', 'JavaScript', 'GitHub']
    }
  };

  const skillData = {
    python: ['Python', 'For structured problem solving, scripting, and exploring how data can inform better decisions.'],
    java: ['Java', 'For learning object-oriented programming and building a dependable foundation in application logic.'],
    html: ['HTML', 'For creating clear, semantic page structures that give content a strong and accessible foundation.'],
    css: ['CSS', 'For translating structure into responsive interfaces with intentional rhythm, contrast, and hierarchy.'],
    javascript: ['JavaScript', 'For adding useful interaction, feedback, progressive enhancement, and human-friendly details.'],
    mysql: ['MySQL', 'For modelling relationships, querying structured data, and understanding how information should be organised.']
  };

  const initTheme = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    const storedTheme = safeStorage.get('haikal-theme');
    if (storedTheme === 'dark') document.documentElement.dataset.theme = 'dark';
    const syncThemeLabel = () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      const icon = toggle.querySelector('.theme-icon');
      if (icon) icon.textContent = isDark ? '☀' : '◐';
    };
    syncThemeLabel();
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme !== 'dark';
      if (isDark) document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      safeStorage.set('haikal-theme', isDark ? 'dark' : 'light');
      syncThemeLabel();
    });
  };

  const initMobileMenu = () => {
    const menu = document.querySelector('.menu-toggle');
    const nav = byId('site-nav');
    if (!menu || !nav) return;
    const closeMenu = () => {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
      if (!open) nav.querySelector('a')?.focus();
    });
    selectAll('.nav-link').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); }, { passive: true });
  };

  const initScrollState = () => {
    const progress = byId('scroll-progress-bar');
    const topButton = byId('back-to-top');
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      if (progress) progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
      if (topButton) topButton.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  };

  const initActiveNavigation = () => {
    const links = selectAll('.nav-link');
    const sections = ['home', 'projects', 'about', 'contact'].map(byId).filter(Boolean);
    if (!('IntersectionObserver' in window) || !sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  };

  const initRevealEffects = () => {
    const items = selectAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: .12 });
    items.forEach((item) => observer.observe(item));
  };

  const initProjectFilters = () => {
    const buttons = selectAll('.filter-button');
    const cards = selectAll('.project-card');
    const status = byId('filter-status');
    if (!buttons.length || !cards.length) return;
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      buttons.forEach((item) => { item.classList.toggle('is-selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      let visible = 0;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) visible += 1;
      });
      if (status) status.textContent = `Showing ${filter === 'all' ? 'all ' : ''}${visible} project${visible === 1 ? '' : 's'}`;
    }));
  };

  const initProjectDialog = () => {
    const dialog = byId('project-dialog');
    const close = byId('dialog-close');
    if (!dialog || !close) return;
    const title = byId('dialog-title'); const category = byId('dialog-category'); const description = byId('dialog-description'); const bullets = byId('dialog-bullets'); const tags = byId('dialog-tags');
    const closeDialog = () => { if (typeof dialog.close === 'function' && dialog.open) dialog.close(); else dialog.removeAttribute('open'); };
    selectAll('[data-open-project]').forEach((button) => button.addEventListener('click', () => {
      const data = projectData[button.dataset.openProject];
      if (!data) return;
      if (title) title.textContent = data.title;
      if (category) category.textContent = data.category;
      if (description) description.textContent = data.description;
      if (bullets) bullets.innerHTML = data.bullets.map((item) => `<li>${item}</li>`).join('');
      if (tags) tags.innerHTML = data.tags.map((item) => `<span>${item}</span>`).join('');
      if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    }));
    close.addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  };

  const initSkills = () => {
    const detail = byId('skill-detail');
    const chips = selectAll('.skill-chip');
    if (!detail || !chips.length) return;
    const label = detail.querySelector('strong'); const description = detail.querySelector('p');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      const data = skillData[chip.dataset.skill];
      if (!data) return;
      chips.forEach((item) => item.classList.toggle('is-active', item === chip));
      if (label) label.textContent = data[0];
      if (description) description.textContent = data[1];
    }));
  };

  const initCopyEmail = () => {
    const button = byId('copy-email'); const feedback = byId('copy-feedback');
    if (!button || !feedback) return;
    button.addEventListener('click', async () => {
      const email = 'heavonodysseus@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        feedback.textContent = 'Email copied to clipboard.';
      } catch (_) {
        feedback.textContent = email;
      }
      window.setTimeout(() => { feedback.textContent = ''; }, 3500);
    });
  };

  const initMessageForm = () => {
    const form = byId('message-form'); const status = byId('form-status');
    if (!form || !status) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = byId('visitor-name'); const email = byId('visitor-email'); const message = byId('visitor-message');
      if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
        status.textContent = 'Please complete your name, email, and message first.';
        (name?.value.trim() ? email : name)?.focus();
        return;
      }
      if (!email.validity.valid) { status.textContent = 'Please enter a valid email address.'; email.focus(); return; }
      status.textContent = `Thanks, ${name.value.trim()} — your note is ready to send. This front-end demo does not transmit data.`;
      form.reset();
    });
  };

  const initAnchors = () => {
    selectAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }));
  };

  const init = () => {
    initTheme(); initMobileMenu(); initScrollState(); initActiveNavigation(); initRevealEffects(); initProjectFilters(); initProjectDialog(); initSkills(); initCopyEmail(); initMessageForm(); initAnchors();
    const year = byId('current-year'); if (year) year.textContent = String(new Date().getFullYear());
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
