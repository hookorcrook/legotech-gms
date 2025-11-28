// Theme handling
(function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem('pf-theme');
  const isDark = stored ? stored === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', isDark);
})();

function setTheme(mode) {
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('pf-theme', isDark ? 'dark' : 'light');
}

// Mobile menu
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('show');
    } else {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('show');
    }
  });
}

// Theme toggles
const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}
if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });
}

// Counters
const counters = document.querySelectorAll('[data-counter]');
let counted = false;
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10) || 0;
  const duration = 1200;
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * (target - start) + start);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counters.forEach(animateCounter);
      counted = true;
      observer.disconnect();
    }
  });
}, { threshold: 0.3 });
if (counters.length) observer.observe(counters[0]);

// Pricing calculator
const planSelect = document.getElementById('planSelect');
const addOns = document.querySelectorAll('.add-on');
const totalEl = document.getElementById('total');
const totalNote = document.getElementById('totalNote');
function updateTotal() {
  const base = parseFloat(planSelect?.value || '0');
  const add = Array.from(addOns).reduce((sum, cb) => sum + (cb.checked ? parseFloat(cb.value || '0') : 0), 0);
  const total = base + add;
  if (totalEl) totalEl.textContent = `$${total}`;
  if (totalNote) totalNote.textContent = '+ tax';
}
if (planSelect) planSelect.addEventListener('change', updateTotal);
addOns.forEach(cb => cb.addEventListener('change', updateTotal));
updateTotal();

// Contact form
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formMsg) {
      formMsg.classList.remove('hidden');
      setTimeout(() => formMsg.classList.add('hidden'), 4000);
    }
    form.reset();
  });
}

// Year
document.getElementById('year').textContent = new Date().getFullYear();