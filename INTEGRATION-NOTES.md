# Integration Notes — Lightbox on the Landing Page

## 1. Where did you put the lightbox triggers, and why does that placement make sense?

The triggers (`class="gallery__thumb"`) are on the `<img>` elements inside the existing
`.photo` cards in the `<section class="gallery">` block in `index.html`.

This placement is the natural choice because the gallery is already the visual centrepiece of
the page — the `<section class="gallery">` grid exists specifically to showcase photos. Wiring
the lightbox to the images inside those cards means every thumbnail in the gallery is a
trigger. There is no second, separate element to click; the photo itself is the call to action.

The `<img>` element (not the wrapping `.photo` div) gets the class so the click target is the
image surface only — not the card caption text below it. A user clicking the caption text would
not accidentally open the lightbox.

The lightbox container div and `<script>` tag sit at the bottom of `<body>`, after `<footer>`.
The script is placed last so the DOM is fully parsed before `querySelectorAll('.gallery__thumb')`
runs; no `DOMContentLoaded` wrapper is needed.

---

## 2. What content did you choose, and what does it represent?

Four photos that together sketch a picture of the person behind the page:

| File | Caption | What it represents |
|---|---|---|
| `workspace.jpg` | "Where the code gets written" | The day-to-day environment — a laptop, coffee, a notebook — something every software student identifies with |
| `campus.jpg` | "Campus in autumn" | A sense of place; the physical setting of the degree |
| `team.jpg` | "Team problem-solving session" | Collaboration — shows that the work happens with people, not just alone |
| `hike.jpg` | "Weekend summit — Pacific Northwest" | Life outside the IDE; communicates interests and geographic identity |

This set creates a small narrative arc: workspace → campus → teammates → weekend. A visitor
can scan four images and get a sense of who this person is before reading a word of bio text.
None of the images are the starter's SVG samples.

---

## 3. How did you reconcile class names?

**Decision: change the existing `<img>` elements to use the starter's class name.**

The starter defines all behaviour around `.gallery__thumb`. The landing page's existing images
had no class at all (styles were applied via the descendant selector `.photo img` in
`style.css`). Adding `class="gallery__thumb"` to each `<img>` was the least-invasive change:

- `style.css` continues to control the card layout (`.photo`, `.gallery` grid) unchanged.
- `lightbox.css` controls the thumbnail cursor and hover lift via `.gallery__thumb`.
- `lightbox.js` selects triggers via `document.querySelectorAll('.gallery__thumb')` — no JS
  changes were needed to accommodate the existing HTML structure.

The alternative — renaming the starter's class to `.photo img` — would have required editing
`lightbox.js`, `lightbox.css`, and the HTML. Adopting the starter's name required only one
attribute addition per `<img>` tag.

---

## 4. What CSS conflicts did you have to resolve, and how?

### Conflict 1 — duplicate `.gallery` block

Both `style.css` and the original `lightbox.css` defined a `.gallery` ruleset with different
`grid-template-columns` values:

| File | `grid-template-columns` |
|---|---|
| `style.css` | `repeat(auto-fill, minmax(250px, 1fr))` |
| `lightbox.css` (original) | `repeat(auto-fill, minmax(160px, 1fr))` |

**Resolution:** removed the entire `.gallery` block from `lightbox.css`. The gallery grid is a
page-layout concern that belongs in `style.css`; lightbox.css has no business redefining it.
The lightbox only needs to know about `.gallery__thumb` (thumbnail behaviour) and `.lightbox`
(the overlay).

### Conflict 2 — thumbnail `height` and `display`

`style.css` sets `.photo img { height: 250px; object-fit: cover; display: block; }` via a
descendant selector. The original `lightbox.css` set `.gallery__thumb { aspect-ratio: 1/1; }`
which would have fought the fixed `height`. Both cannot win.

**Resolution:** removed `aspect-ratio` from `.gallery__thumb` in `lightbox.css` and let
`style.css`'s `height: 250px` rule stand. The starter's `aspect-ratio` was a sensible default
for a standalone demo page with no existing card layout, but it's wrong here where the card
height is already controlled.

### Conflict 3 — visual style of the overlay

The starter's backdrop used `rgba(0,0,0,0.85)` — pure black. The landing page's text and
border colours are based on `#262626` (a very dark but not pure black). The mismatch was
subtle but visible when the overlay opened over the page.

**Resolution:** changed the backdrop colour in `lightbox.css` to `rgba(38,38,38,0.92)` — the
`#262626` page text colour at 92% opacity. The image frame `border-radius` was also changed
from `4px` to `8px` to match the `.photo` card `border-radius` in `style.css`. The caption
gained a `border-top` using `#0095f6` (the page's link accent colour) at low opacity, tying
the overlay typography to the page's colour system without being distracting.
