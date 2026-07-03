const revealItems = document.querySelectorAll('.reveal');
const sectionItems = document.querySelectorAll('.section-watch');
const railItems = document.querySelectorAll('.rail-dot');
const panoFrames = document.querySelectorAll('iframe[data-src]');
const iframeShells = document.querySelectorAll('[data-iframe-shell]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const setActive = (id) => {
  let target = id;
  if (['project-02', 'project-03', 'project-04', 'project-05', 'panorama'].includes(id)) target = 'project-01';
  railItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.target === target);
  });
};

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (visible) {
    setActive(visible.target.dataset.section);
  }
}, { threshold: [0.18, 0.35, 0.55], rootMargin: '-18% 0px -42% 0px' });

sectionItems.forEach((section) => sectionObserver.observe(section));

const loadFrame = (frame) => {
  if (!frame.src && frame.dataset.src) {
    frame.src = frame.dataset.src;
  }
};

const frameObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadFrame(entry.target);
      frameObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '500px 0px', threshold: 0.01 });

panoFrames.forEach((frame) => frameObserver.observe(frame));

let activeShell = null;

const releaseIframe = () => {
  if (activeShell) {
    activeShell.classList.remove('is-active');
    activeShell = null;
  }
  document.body.classList.remove('iframe-scroll-lock');
};

const activateIframe = (shell) => {
  if (activeShell && activeShell !== shell) {
    activeShell.classList.remove('is-active');
  }
  activeShell = shell;
  shell.classList.add('is-active');
  document.body.classList.add('iframe-scroll-lock');
  const frame = shell.querySelector('iframe[data-src]');
  if (frame) loadFrame(frame);
};

iframeShells.forEach((shell) => {
  const shield = shell.querySelector('.iframe-shield');
  if (shield) {
    shield.addEventListener('click', () => activateIframe(shell));
  }
  shell.addEventListener('mouseleave', releaseIframe);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') releaseIframe();
});

document.addEventListener('click', (event) => {
  if (activeShell && !activeShell.contains(event.target)) releaseIframe();
});

const cards = document.querySelectorAll('.tilt-card');

cards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    if (window.matchMedia('(max-width: 860px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
