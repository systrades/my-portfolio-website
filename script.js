/* =====================================================
   SISON ASALU — Portfolio JavaScript (Redesigned)
   ===================================================== */

/* ─── DOM References ──────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const backToTop   = document.getElementById('back-to-top');
const navItems    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const formSuccess = document.getElementById('form-success');
const cursorDot   = document.getElementById('cursorDot');
const cursorRing  = document.getElementById('cursorRing');

/* ─── 1. Custom Cursor ────────────────────────────── */
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow via RAF
function animateRing() {
  const ease = 0.12;
  ringX += (mouseX - ringX) * ease;
  ringY += (mouseY - ringY) * ease;

  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';

  requestAnimationFrame(animateRing);
}
animateRing();

// Expand ring on hoverable elements
const hoverEls = document.querySelectorAll('a, button, .tech-tag, .project-card, .contact-item');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─── 2. Navbar: scroll + active link ────────────── */
function onScroll() {
  // Scrolled state
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Back-to-top visibility
  backToTop.classList.toggle('visible', window.scrollY > 500);

  // Active nav link highlight
  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) currentSection = section.id;
  });

  navItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── 3. Hamburger Menu ───────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ─── 4. Typed Text Animation ─────────────────────── */
const typedEl     = document.getElementById('typed');
const phrases     = [
  'Software Developer',
  'Problem Solver',
  'Clean Code Advocate',
  'Full-Stack Builder',
  'Always Learning'
];
let phraseIndex   = 0;
let charIndex     = 0;
let isDeleting    = false;
const typeSpeed   = 75;
const deleteSpeed = 40;
const pauseEnd    = 2000;
const pauseStart  = 400;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, pauseEnd);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, pauseStart);
      return;
    }
  }

  setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
}

setTimeout(type, 1000);

/* ─── 5. Scroll-Reveal (IntersectionObserver) ──────── */
const animateEls = document.querySelectorAll('[data-animate]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

animateEls.forEach(el => revealObserver.observe(el));

/* ─── 6. Skill Bar Animations ─────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill  = entry.target;
      const width = fill.dataset.width || 0;
      setTimeout(() => {
        fill.style.width = width + '%';
      }, 150);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.25 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ─── 7. Stat Counter Animation ───────────────────── */
const statNumbers = document.querySelectorAll('.stat-number[data-count]');

function countUp(el, end) {
  const duration   = 2000;
  const step       = 16;
  const totalSteps = duration / step;
  let current = 0;

  const timer = setInterval(() => {
    current += end / totalSteps;
    if (current >= end) {
      el.textContent = end;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      countUp(el, end);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ─── 8. Contact Form ─────────────────────────────── */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      shakeForm();
      highlightEmpty([
        { field: contactForm.name,    empty: !name },
        { field: contactForm.email,   empty: !email },
        { field: contactForm.message, empty: !message }
      ]);
      return;
    }

    if (!isValidEmail(email)) {
      contactForm.email.focus();
      setFieldError(contactForm.email);
      return;
    }

    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.style.display    = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled       = true;

    // Simulate API call — replace with EmailJS or backend
    setTimeout(() => {
      btnText.style.display    = 'inline-flex';
      btnLoading.style.display = 'none';
      submitBtn.disabled       = false;

      formSuccess.style.display = 'flex';
      contactForm.reset();

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1600);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field) {
  field.style.borderColor = '#ef4444';
  field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.15)';
  field.addEventListener('input', () => {
    field.style.borderColor = '';
    field.style.boxShadow   = '';
  }, { once: true });
}

function highlightEmpty(fields) {
  fields.forEach(({ field, empty }) => {
    if (empty) setFieldError(field);
  });
}

function shakeForm() {
  const form = contactForm;
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-8px)' },
    { transform: 'translateX(8px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(0)' },
  ];
  form.animate(keyframes, { duration: 400, easing: 'ease-in-out' });
}

/* ─── 9. Back to Top ──────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── 10. Smooth Hero Reveal on Load ──────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
    setTimeout(() => el.classList.add('in-view'), 200 + i * 200);
  });
});

/* ─── 11. Parallax tilt on hero photo ─────────────── */
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth  - 0.5) * 10;
    const y = (e.clientY / innerHeight - 0.5) * 10;
    photoFrame.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    photoFrame.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
  });
}

/* ─── 12. Stagger children inside revealed cards ──── */
const staggerParents = document.querySelectorAll('.projects-grid, .timeline, .about-stats');

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('[data-animate]');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('in-view'), i * 120);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

staggerParents.forEach(el => staggerObserver.observe(el));