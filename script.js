// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Testimonial slider (dots + arrows scroll the track on mobile / cycle highlight on desktop)
const track = document.getElementById('testimonialTrack');
const cards = track.children;
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current = 0;

for (let i = 0; i < cards.length; i++) {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
}

function updateDots() {
  [...dotsContainer.children].forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function goTo(index) {
  current = (index + cards.length) % cards.length;
  updateDots();
  const isMobile = window.innerWidth <= 960;
  if (isMobile) {
    cards[current].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

// ============ STORYTELLING FLOW ============
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll-reveal: fade/slide each .reveal block in as it enters the viewport
const revealEls = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// Story rail: highlight the current chapter as the user scrolls, and fill the progress line
const storyRail = document.getElementById('storyRail');
const railFill = document.getElementById('railFill');
const railStops = storyRail ? [...storyRail.querySelectorAll('.story-rail__stop')] : [];
const chapters = [...document.querySelectorAll('[data-chapter]')];

railStops.forEach(stop => {
  stop.addEventListener('click', () => {
    const target = document.querySelector(stop.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

function setActiveChapter(index) {
  railStops.forEach((stop, i) => stop.classList.toggle('is-active', i === index));
  if (railFill) railFill.style.height = `${(index / (railStops.length - 1)) * 100}%`;
}

if (chapters.length && railStops.length) {
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = chapters.indexOf(entry.target);
        setActiveChapter(idx);
      }
    });
  }, { threshold: 0.5 });

  chapters.forEach(section => chapterObserver.observe(section));
}