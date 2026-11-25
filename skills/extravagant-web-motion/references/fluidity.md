# Fluidity: Frame Budgets, Threads and Cost Drivers

Companion to `restraint.md`. Restraint governs **how much** motion; fluidity governs **how expensive** each frame
is. Same split as before:

- **Citable**: browser vendors, standards, or the GSAP author state it, with a URL.
- **Chosen**: nobody publishes a number, so this skill picks one and names it a decision.

## The frame budget

| display | budget per frame | Source |
| --- | --- | --- |
| 60 Hz | **16.6 ms** | web.dev, *Animations and performance* |
| 120 Hz | **8.3 ms** | derived (16.6/2); no vendor page states the 120 number directly |
| compositing sub-slice | **4–5 ms** | web.dev, *Stick to compositor-only properties* |

Stages in order of increasing cost: **composite < paint < layout**. web.dev: "layout is the part that matters with
regard to the frame rate, and it's the part to avoid" — geometry changes invalidate layout for the whole document
("Layout is normally scoped to the whole document").

Inside a frame, order is fixed: `rAF` callbacks → style → layout → paint → composite. JavaScript that runs after
another script invalidated style forces the recomputation to happen **inside** the frame (forced synchronous
layout). Chrome's own insight page names the failure mode: "Multiple forced reflows in quick succession is called
*layout thrashing*."

## Cost driver table

| What animates | Where it runs | Cost shape |
| --- | --- | --- |
| `transform`, `opacity` (2D) | compositor | linear in pixels composited; no main thread per frame |
| `clip-path` | repaint of the clip area | small for small areas; scales with animated area |
| `box-shadow` | paint | multi-pass; combinations cost "2.2C not C": paint times are not additive |
| `filter: blur()` | paint/GPU | Gaussian kernel grows with r²; "anything that involves a blur… is going to take longer to paint" (Chrome) |
| `backdrop-filter` | GPU + repaint of backdrop | capture + blur every frame when content behind changes |
| `width`/`height`/`top`/`left` | layout → paint → composite | worst case: full-document layout per frame |

web.dev numbers: a 1200×800 image costs ~5.76 GB/min of fill rate at 60fps when painted every frame; layer memory
is nontrivial, "every layer you create requires memory and management". Promoting an element to its own layer can
*cost* more than it saves if the element repaints anyway — measuring beats doctrine.

## What the vendors say about blur and glass

- Chrome, *Simplify paint complexity*: "anything that involves a blur (like a shadow, for example) is going to take
  longer to paint". Blur is the most expensive filter function; radius matters quadratically: `blur(20px)` ≳ 6×
  `blur(8px)` (measured, mironsoft.de; mark as measured opinion, not vendor data).
- `backdrop-filter` re-captures and re-blurs the backdrop **every frame** the content behind it changes. Sections
  with `backdrop-filter` over animated content are the most expensive glass: one source recommends limiting it to
  **2–3 concurrently visible elements** (alivedise.github.io, FEE-210; vendor-adjacent course material, not a
  browser vendor).
- Static `box-shadow` is cheap; **animated** box-shadow repaints every frame (xerobit.dev, measured: cost grows
  sharply across a grid of 100 cards).
- Nothing normative exists for a "maximum blur radius" or a safe blur-area ratio — the numbers above are measured
  opinions, and this file marks them as such.

## Textures, images, video

- Off-main-thread image decoding is the modern default; `decoding="async"` (or `img.decode()`) keeps the decode
  from blocking paint (web.dev, *Image performance*).
- `content-visibility: auto` + `contain-intrinsic-size` skips layout, style and paint for off-screen subtrees; one
  measured case reports **15×** less layout cost on a long page (jangwook.net, measured opinion).
- A playing `<video>` generally stays composited while it plays, but any change *on top of it* (overlay, filter,
  blend) forces it back into paint. Do not put moving glass over a playing video; count video-driven sections in
  the same moving-area budget as everything else.

## Layout and event hygiene

- **Read everything, then write everything.** web.dev's canonical fix for thrashing is batching; never interleave
  `getBoundingClientRect`/`offsetWidth` reads with `style` writes inside one frame loop. If a library does it
  internally, do not fight it — just do not add a second unbatched loop.
- Geometry lookups in high-frequency events (`pointermove`, `scroll`, `wheel`) must be cached on enter and
  invalidated on scroll/resize; reading layout per event is both a forced reflow per event and a GC hazard.
- `overscroll-behavior: contain` on scroll-jacked sections; passive listeners for `touch`/`wheel` unless the handler
  calls `preventDefault`.
- GSAP: use `quickSetter`/`quickTo` for pointer-scale work — the docs describe quickTo as reusing a single internal
  tween so 60Hz event firing does not allocate. Never create tweens inside a `pointermove` handler.

## Layer promotion: the folklore is dead

Paul Lewis (Chrome team) names the trick directly: the "go faster" null transform — `-webkit-transform:
translate3d(0,0,0)` / `translateZ(0)` — **was** a Chrome-era hack, then replaced by intent: `will-change`. The
modern verdict across the corpus:

1. The browser promotes automatically while an element animates.
2. Manual promotion costs memory per layer; "hundreds or thousands of layers… make the page slower, not faster".
3. `will-change` belongs in the 200 ms window before a known animation, removed after (MDN: last resort; css.dev:
   "use it on a few elements you have measured").

Rule: **no null-transform hacks, ever**. If a layer is needed, `will-change` inside its window; if the budget in
`restraint.md` (B8) is exceeded, the answer is fewer promoted elements, not more promotion.

## Weight budget (chosen, labeled as a decision)

No standards body publishes a total-motion budget. The anchors that exist:

- HTTP Archive median mobile page, 2024: **~2.3 MB total**, median JS **~455 KB compressed**.
- Alex Russell's device-matrix estimate, cited in a 2025 performance-budgets piece: **~365 KB of compressed JS**
  for a 3-second interactive load on a median phone.
- web.dev's "first performance budget": **~170 KB compressed critical-path** as a floor for low-end networks — a
  floor for resource hygiene, not a motion budget.

Chosen budgets for this skill:

| Budget | Value | Basis |
| --- | --- | --- |
| F1 | **JS for the motion layer ≤ 365 KB compressed** | Russell's estimate; everything else lazy |
| F2 | **Total page weight ≤ 2.5 MB** for a motion page | just above the 2024 mobile median |
| F3 | **backdrop-filter ≤ 3 per viewport** | the one vendor-adjacent number found |
| F4 | **No animated blur over an area > 25% of viewport** | invented; the r² cost makes large blur the worst case |
| F5 | **Promoted layers ≤ 12 concurrently** (ties to B8) | memory per layer, MDN "not too many elements" |
| F6 | **No more than 1 non-composited animation running concurrently** | from web.dev's warning that non-composited work janks on low-end devices |
| F7 | **Zero `translate3d(0,0,0)` / `translateZ(0)` hacks** | Aerotwist 2013/2014 — the trick is a decade dead |

## Where the experts disagree

| Question | Positions | Resolution here |
| --- | --- | --- |
| `will-change` vs auto-promotion | web.dev: pre-apply in a 200 ms window; MDN: last resort only | Both: apply inside the window, remove after; never blanket |
| Null-transform layer hacks | Dead since 2014 (Aerotwist) but still repeated in 2026 blog posts | Measure; never prescribe |
| `content-visibility` | web.dev: use it widely; measured case: 15× saving; other sources warn about scrollbar shift without `contain-intrinsic-size` | Use it, always paired with `contain-intrinsic-size` |
| Frame budget at 120 Hz | No vendor page states 8.3 ms explicitly | Derived arithmetically; label as derived |

## Known gaps

- No vendor publishes per-property paint costs beyond box-shadow/blur examples (the old csstriggers.com matrix is
  unmaintained; Chromium's property-trigger table lives in source, not in docs).
- The 2–3 backdrop-filter limit is course material, not a browser vendor statement.
- Video compositor behavior varies by engine; the claim above is Chromium-leaning.
- Every "measured opinion" here is a single source without a replication.
