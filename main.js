/* ═══════════════════════════════════════════════
   HEMS ENERGY ROV — MAIN.JS
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── HERO SLIDER ──────────────────────────────
  let current = 0;
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  // Expose globally for inline onclick on dots
  window.goToSlide = goToSlide;

  setInterval(() => goToSlide((current + 1) % slides.length), 5000);


  // ── PARTICLES ────────────────────────────────
  const pContainer = document.getElementById('particles');
  if (pContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        --dx:${(Math.random() - 0.5) * 200};
        animation-duration:${Math.random() * 12 + 8}s;
        animation-delay:${Math.random() * 10}s;
        opacity:${Math.random() * 0.6 + 0.2};
      `;
      pContainer.appendChild(p);
    }
  }


  // ── NAVBAR SCROLL ────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── MOBILE NAV TOGGLE ───────────────────────
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navbar.classList.toggle('open');

      // on small screens, inject a mobile contact CTA into the dropdown
      const navLinks = document.querySelector('#navbar .nav-links');
      const existingMobileCTA = navLinks && navLinks.querySelector('.mobile-nav-cta');
      if (window.innerWidth <= 768 && navLinks) {
        if (!existingMobileCTA && !expanded) {
          const li = document.createElement('li');
          li.className = 'mobile-cta-item';
          li.innerHTML = '<button class="nav-cta mobile-nav-cta">Contact Us</button>';
          navLinks.appendChild(li);
        }
        if (existingMobileCTA && expanded) {
          existingMobileCTA.closest('li').remove();
        }
      }
    });
    // close nav when a link is clicked
    document.querySelectorAll('#navbar .nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navbar.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Ensure mobile CTA is removed and nav closed when resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const navLinks = document.querySelector('#navbar .nav-links');
      const existingMobileCTA = navLinks && navLinks.querySelector('.mobile-nav-cta');
      if (existingMobileCTA) existingMobileCTA.closest('li').remove();
      navbar.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });


  // ── HORIZONTAL CARD ROW CONTROLS (desktop only) ────────────
  function enhanceCardRows(selector) {
    // only apply enhancements when screen is wide enough
    if (window.innerWidth <= 768) return;
    document.querySelectorAll(selector).forEach(grid => {
      // avoid double-wrapping
      if (grid.closest('.card-row-wrapper')) return;
      // wrap grid in a container for positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'card-row-wrapper';
      grid.parentNode.insertBefore(wrapper, grid);
      wrapper.appendChild(grid);

      // create buttons
      const btnLeft = document.createElement('button');
      btnLeft.className = 'card-scroll-btn left';
      btnLeft.setAttribute('aria-label', 'Scroll left');
      btnLeft.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const btnRight = document.createElement('button');
      btnRight.className = 'card-scroll-btn right';
      btnRight.setAttribute('aria-label', 'Scroll right');
      btnRight.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      wrapper.appendChild(btnLeft);
      wrapper.appendChild(btnRight);

      // scrolling logic
      const scroller = grid;
      const step = () => Math.round(scroller.clientWidth * 0.8);

      function updateButtons() {
        btnLeft.disabled = scroller.scrollLeft <= 8;
        btnRight.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;
      }

      btnLeft.addEventListener('click', () => {
        scroller.scrollBy({ left: -step(), behavior: 'smooth' });
      });
      btnRight.addEventListener('click', () => {
        scroller.scrollBy({ left: step(), behavior: 'smooth' });
      });

      scroller.addEventListener('scroll', () => { requestAnimationFrame(updateButtons); });
      window.addEventListener('resize', () => { requestAnimationFrame(updateButtons); });

      // initial state
      updateButtons();

      // keyboard accessibility
      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { scroller.scrollBy({ left: step(), behavior: 'smooth' }); }
        if (e.key === 'ArrowLeft')  { scroller.scrollBy({ left: -step(), behavior: 'smooth' }); }
      });
    });
  }

  function removeEnhancements(selector) {
    document.querySelectorAll(selector).forEach(grid => {
      const wrapper = grid.closest('.card-row-wrapper');
      if (!wrapper) return;
      // remove buttons if present
      wrapper.querySelectorAll('.card-scroll-btn').forEach(b => b.remove());
      // move grid back out
      wrapper.parentNode.insertBefore(grid, wrapper);
      wrapper.remove();
    });
  }

  // initialize based on width
  if (window.innerWidth > 600) {
    enhanceCardRows('.services-grid');
    enhanceCardRows('.core-cards-grid');
    enhanceCardRows('.offer-grid');
  }

  // respond to resize: add or remove enhancements accordingly
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    if (w > 600 && lastWidth <= 600) {
      enhanceCardRows('.services-grid');
      enhanceCardRows('.core-cards-grid');
      enhanceCardRows('.offer-grid');
    } else if (w <= 600 && lastWidth > 600) {
      removeEnhancements('.services-grid');
      removeEnhancements('.core-cards-grid');
      removeEnhancements('.offer-grid');
    }
    lastWidth = w;
  });


  // ── DEPTH METER ──────────────────────────────
  const depthFill = document.getElementById('depthFill');
  const depthVal  = document.getElementById('depthVal');
  window.addEventListener('scroll', () => {
    const pct   = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const depth = Math.round(pct * 3000);
    if (depthFill) depthFill.style.height = (pct * 120) + 'px';
    if (depthVal)  depthVal.textContent   = depth + 'm';
  }, { passive: true });


  // ── SCROLL REVEAL ────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .step')
    .forEach(el => revealObs.observe(el));


  // ── COUNTER ANIMATION ────────────────────────
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      let start    = 0;
      const step   = target / 60;
      const timer  = setInterval(() => {
        start = Math.min(start + step, target);
        const val = Math.round(start);
        if (target >= 3000)     el.textContent = val + '+';
        else if (target === 24) el.textContent = val + '/7';
        else if (target === 98) el.textContent = val + '%';
        else                    el.textContent = val + '+';
        if (start >= target) clearInterval(timer);
      }, 25);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObs.observe(c));


  // ── STEP STAGGER ─────────────────────────────
  document.querySelectorAll('.step').forEach((s, i) => {
    s.style.transitionDelay = (i * 0.15) + 's';
  });


  // ── BACK TO TOP BUTTON ───────────────────────
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ── CORE CARDS STAGGER REVEAL ────────────────
  const coreCards = document.querySelectorAll('.core-card');
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 120);
      }
    });
  }, { threshold: 0.15 });
  coreCards.forEach(c => {
    c.classList.add('reveal');
    cardObs.observe(c);
  });


  // ── GALLERY PARALLAX (subtle) ─────────────────
  const galleryItems = document.querySelectorAll('.gallery-item img');
  window.addEventListener('scroll', () => {
    galleryItems.forEach(img => {
      const rect   = img.closest('.gallery-item').getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = `scale(1.06) translateY(${center * 0.03}px)`;
    });
  }, { passive: true });

});
