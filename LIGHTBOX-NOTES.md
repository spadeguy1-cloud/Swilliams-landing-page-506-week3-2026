# Lightbox Code Notes

Reading notes on `js/lightbox.js` and `css/lightbox.css` — the four concepts the Week 3
lecture covers: DOM, Events, State, and Security.

---

## 1. DOM

### What DOM querying is doing here

The file opens with four `querySelector` / `querySelectorAll` calls:

```js
const lb     = document.querySelector('.lightbox');
const lbImg  = lb.querySelector('.lightbox__img');
const lbCap  = lb.querySelector('.lightbox__caption');
const thumbs = document.querySelectorAll('.gallery__thumb');
```

**Why they are cached at the top instead of queried inside functions**

DOM queries are comparatively expensive — the browser has to walk the element tree every
time. Caching the result in a `const` at load time means the lookup happens once. Every
subsequent read (`lbImg.setAttribute(...)`, `lb.classList.add(...)`) goes directly to the
stored reference with no repeated tree traversal.

**`document.querySelector` vs `lb.querySelector`**

`document.querySelector` searches the entire document. `lb.querySelector` scopes the search
to children of `lb`. Using `lb.querySelector` for `lbImg` and `lbCap` is both faster (smaller
search tree) and more precise — it expresses the intent that those elements live *inside* the
lightbox, not just anywhere on the page.

**`querySelector` vs `querySelectorAll`**

`querySelector` returns the first matching `Element` (or `null`). `querySelectorAll` returns a
static `NodeList` of every match. The thumbnails use `querySelectorAll` because there are
multiple `.gallery__thumb` elements; the lightbox elements use `querySelector` because each
class appears exactly once.

---

## 2. Events

Three `addEventListener` calls wire user actions to code:

### Thumbnail click — opens the lightbox

```js
thumbs.forEach((thumb, i) => {
  thumb.addEventListener('click', () => openLightbox(i));
});
```

Each thumbnail gets its own listener. The closure captures `i` (the loop index), so the
callback knows *which* image was clicked. When the user clicks thumbnail 2, `openLightbox(2)`
runs, setting `state.index = 2` and loading the correct image.

### Backdrop click — closes the lightbox

```js
lb.addEventListener('click', (e) => {
  if (e.target === lb) closeLightbox();
});
```

The listener is on the outer `.lightbox` div (the full-screen backdrop), not on the inner
image or caption. If the user clicks the image itself, `e.target` is `.lightbox__img`, not
`.lightbox`, so the guard `e.target === lb` fails and the lightbox stays open. Only a click on
the dark backdrop area (the `.lightbox` element directly) triggers close. This is a common
**event target guard** pattern.

### Keyboard Escape — closes the lightbox

```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.isOpen) closeLightbox();
});
```

Keyboard events bubble up to `document`. The guard `state.isOpen` prevents `closeLightbox()`
from running when the lightbox is already closed (a no-op, but cleaner).

---

## 3. State

### The state object

```js
const state = {
  isOpen: false,
  index: 0,
  images: [
    { src: 'images/sample-1.svg', caption: 'Sample image one — replace with your own' },
    { src: 'images/sample-2.svg', caption: 'Sample image two — a second photo' },
    { src: 'images/sample-3.svg', caption: 'Sample image three — a third' },
  ],
};
```

All the information the lightbox needs to remember lives in one object:

| Property | What it tracks |
|---|---|
| `isOpen` | Whether the overlay is currently visible |
| `index` | Which image from the array is being shown |
| `images` | The full list of image sources and captions |

### The pattern: mutate state, then call render

```js
function openLightbox(i) {
  state.isOpen = true;
  state.index  = i;
  render();
}

function closeLightbox() {
  state.isOpen = false;
  render();
}
```

Neither `openLightbox` nor `closeLightbox` touch the DOM directly. They change the state
object, then hand off to `render`. This separation means you can add a third action later
(e.g., `nextImage`) by writing one more mutator — `render` already knows how to reflect any
state into the DOM.

### The render function

```js
function render() {
  if (state.isOpen) {
    const { src, caption } = state.images[state.index];
    lbImg.setAttribute('src', src);
    lbCap.textContent = caption;
    lb.classList.add('open');
  } else {
    lb.classList.remove('open');
  }
}
```

`render` is a pure translation from state to DOM. It reads `state`, asks "what should the
page look like right now?", and makes it so. The CSS class `open` is toggled here — the visual
transition (fade-in) is handled entirely in CSS, keeping JS and CSS concerns separated.

---

## 4. Security

### `textContent` instead of `innerHTML`

```js
lbCap.textContent = caption;
```

`textContent` treats its value as plain text. Any `<`, `>`, or `&` characters in `caption`
are rendered as literal characters on screen — they are never parsed as HTML tags.

If `innerHTML` were used instead:

```js
// UNSAFE — do not do this
lbCap.innerHTML = caption;
```

…and a caption contained something like `<img src=x onerror="stealCookies()">`, the browser
would execute it. `textContent` makes that impossible because the string is never handed to
the HTML parser.

### `setAttribute` for the image `src`

```js
lbImg.setAttribute('src', src);
```

Setting an attribute via `setAttribute` goes through the DOM API rather than re-parsing HTML.
For `src` specifically, the browser will load the URL but will not execute scripts. Contrast
with injecting raw HTML via `innerHTML`, which could embed event handlers.

### Why this matters even for a class project

Caption content could come from a URL hash, a query string, or a database in a real app. The
habit of choosing `textContent` over `innerHTML` whenever you only need to display text —
not render HTML — is the single most common XSS prevention step in front-end code.

---

## 5. CSS notes

### How the overlay is hidden and shown

The lightbox starts `display: none` with `opacity: 0`. Adding the class `open` switches it
to `display: flex` and `opacity: 1`:

```css
.lightbox {
  display: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.lightbox.open {
  display: flex;
  opacity: 1;
}
```

The `transition` applies to `opacity` but not to `display` (CSS cannot animate between
`none` and `flex`). The result is: the element appears instantly (display change), then fades
in over 200 ms (opacity transition). The fade-out on close is not visible because `display:
none` removes the element from layout immediately — this is a known limitation of this
technique. A smoother close requires a JS-driven two-step: transition opacity first, then set
`display: none` after the transition ends.

### `position: fixed; inset: 0`

`inset: 0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. Combined with
`position: fixed`, this stretches the backdrop to cover the entire viewport regardless of
scroll position.

### `z-index: 1000`

Places the overlay above all normal page content. If your landing page uses any elements
with a `z-index` above 1000, raise this value accordingly.

---

## Integration checklist (Task 3)

When adding the lightbox to your own landing page:

- [ ] Copy `js/lightbox.js` and `css/lightbox.css` into your repo
- [ ] Add `<link rel="stylesheet" href="css/lightbox.css">` in `<head>`
- [ ] Add `<script src="js/lightbox.js"></script>` before `</body>`
- [ ] Add `class="gallery__thumb"` to each `<img>` in your gallery
- [ ] Add the lightbox container HTML (`.lightbox` div with `.lightbox__img` and `.lightbox__caption`)
- [ ] Update `state.images` array in `lightbox.js` with your actual image paths and captions
- [ ] Test thumbnail click, backdrop click, and Escape key
