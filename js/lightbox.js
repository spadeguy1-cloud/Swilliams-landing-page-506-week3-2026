// CS 506 · Week 3 Starter · Lightbox
// A small image-overlay feature, ~40 lines of vanilla JavaScript.
// Four concepts on display: DOM, events, state, security.

// ── DOM refs (cached once at load time) ─────────────────────────────────
const lb       = document.querySelector('.lightbox');
const lbImg    = lb.querySelector('.lightbox__img');
const lbCap    = lb.querySelector('.lightbox__caption');
const thumbs   = document.querySelectorAll('.gallery__thumb');

// ── State ───────────────────────────────────────────────────────────────
const state = {
  isOpen: false,
  index: 0,
  images: [
    {
      src:     'images/workspace.jpg',
      caption: 'Where the code gets written — laptop, coffee, and a notebook full of ideas.',
    },
    {
      src:     'images/campus.jpg',
      caption: 'Campus in autumn — the walk between classes that clears your head.',
    },
    {
      src:     'images/team.jpg',
      caption: 'Team problem-solving session — three heads are better than one.',
    },
    {
      src:     'images/hike.jpg',
      caption: 'Weekend summit in the Pacific Northwest — the best way to step away from the screen.',
    },
  ],
};

// ── Mutators ────────────────────────────────────────────────────────────
function openLightbox(i) {
  state.isOpen = true;
  state.index = i;
  render();
}

function closeLightbox() {
  state.isOpen = false;
  render();
}

// ── Render (state → DOM) ────────────────────────────────────────────────
function render() {
  if (state.isOpen) {
    const { src, caption } = state.images[state.index];
    lbImg.setAttribute('src', src);
    lbCap.textContent = caption;
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('open');
  } else {
    lb.setAttribute('aria-hidden', 'true');
    lb.classList.remove('open');
  }
}

// ── Event listeners ─────────────────────────────────────────────────────
thumbs.forEach((thumb, i) => {
  thumb.addEventListener('click', () => openLightbox(i));
});

lb.addEventListener('click', (e) => {
  if (e.target === lb) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.isOpen) closeLightbox();
});
