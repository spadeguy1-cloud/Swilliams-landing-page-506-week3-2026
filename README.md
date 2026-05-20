# CS 506 — Week 3 Starter

A small image-overlay ("lightbox") feature in ~40 lines of vanilla JavaScript. This is the reference implementation you'll read carefully, adapt to your own photos, and integrate into your landing page.

## What's here

```
506-week3-2026/
├── index.html          # Demo page — open this to see the lightbox working
├── js/
│   └── lightbox.js     # The implementation (~40 lines)
├── css/
│   └── lightbox.css    # Overlay, centering, transitions
├── images/             # Sample images (you'll replace these)
└── package.json        # Has a serve script
```

## Run the demo

```bash
npm install
npm run serve
```

Then open http://localhost:8080. Click any thumbnail — the lightbox opens. Click the dark backdrop or press Escape to close.

## What you'll do this week

This starter is what you're **ingesting** into your own website repo. The Week 3 assignment walks the full workflow:

1. Pull this starter into your existing repo via `git merge course/main --allow-unrelated-histories`
2. Read `js/lightbox.js` carefully (Task 2 asks you specific questions about it)
3. Integrate the lightbox on your own landing page with your own photos (Task 3)
4. Merge to main when done, tag the result as **v0.1.0** — your portfolio's first release

See the Week 3 assignment handout for full instructions, grading criteria, and submission details.

## What's in the lightbox code

Four concepts on display — the same four the lecture covers:

- **DOM** — how the code locates elements it needs
- **Events** — three `addEventListener` calls that wire user actions to code
- **State** — a single object holding what the lightbox remembers, read by a render function
- **Security** — `textContent` and `setAttribute` used to prevent XSS

These aren't lightbox-specific concepts. They're the foundation of every piece of modern front-end JavaScript you'll ever read.

---

*CS 506 · Cloud Web Application Engineering with AI*
