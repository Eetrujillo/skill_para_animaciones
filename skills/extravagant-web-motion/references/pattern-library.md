# Pattern Library

Seven reusable motion patterns. Each entry states what it is for, its trigger, the properties it may animate,
its timing, its performance budget, and the demo asset that implements it. Copy the spec; never copy a site's look.

Every demo is a single self-contained HTML file: no build, no remote fonts, no local assets. Libraries come from
CDN and only the ones named below.

## Token block — one instantiation, not a brand

Paste it as a starting point, then replace the values. The verified corpus spans eight sites and shares no curve:
what is invariant is a *named* easing layer, never the numbers.

```css
:root{
  --bg:#0a0a0b; --surface:#141416; --fg:#f5f3ef; --dim:#8b8b87; --line:#26262a;
  --accent:#d7ff3e;
  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-in:cubic-bezier(.33,0,.2,1);
  --dur-micro:200ms; --dur-enter:600ms; --dur-hero:1000ms;
  --gutter:clamp(20px,4vw,64px);
  --font-display:Georgia,"Times New Roman",serif;
  --font-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;
  --font-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
```

Baseline page body: `background:var(--bg); color:var(--fg); font-family:var(--font-sans)`.
Labels and metadata use `--font-mono` uppercase with `letter-spacing:.08em`.

## 01 — Scroll narrative

- **Asset**: `assets/01-scroll-narrative.html`
- **Use when**: the story must be read at scroll speed: layered parallax, a pinned scene, a horizontal strip.
- **Libraries**: GSAP 3.12.7 + ScrollTrigger, Lenis 1.3.23. Lenis is optional: only 5 of the 8 sampled sites use a smooth-scroll engine.
- **Trigger**: `ScrollTrigger` with `scrub: true` for continuous motion; discrete `once:true` reveals for text.
- **Properties**: `y`, `scale`, `opacity` only. Lines of text reveal through a wrapping `overflow:hidden` parent with the inner line at `y:110%` → `0`.
- **Timing**: scrub motions are not timed; discrete reveals `--dur-enter`, stagger `0.06s`.
- **Lenis sync**: `lenis.on('scroll', ScrollTrigger.update)`, drive `lenis.raf` from `gsap.ticker`, then `gsap.ticker.lagSmoothing(0)`. Never run two scroll loops.
- **Budget**: at most one pinned scrub scene per viewport; pin length ≤ 2× viewport; no more than ~8 parallax layers on screen.
- **Degradation**: reduced motion → no Lenis, no pin, reveal everything at once; mobile → keep reveals, drop the horizontal strip.

## 02 — Fullscreen morph carousel

- **Asset**: `assets/02-morph-carousel.html`
- **Use when**: a grid of work must become a single immersive piece and return, without a page load.
- **Technique**: every tile is a full-stage box positioned by `x`/`y`/`scale` so it *looks* like a grid cell. Fullscreen is `scale:1, x:0, y:0` with the active tile raised in `z-index`. No `width`/`height` animation, no layout thrash, no FLIP reads at animation time.
- **Optional 3D**: add three.js 0.160 with a plane per tile and a distortion shader only when true depth or image distortion is the point; otherwise the transform morph is cheaper and sharper.
- **Trigger**: click, `Enter`, arrow keys, and drag/wheel on the active tile.
- **Timing**: `--dur-hero` with `--ease-out`; reverse with `--ease-in`; stagger neighbour tiles by `0.03s`.
- **Budget**: ≤ 12 tiles; decode images at the size they render; `will-change:transform` only during the tween; one active tile has priority.
- **Degradation**: fine-pointer gate for the immersive layer; touch and reduced motion get a plain link-through gallery with the same content.
- **Variant**: skip the device gate entirely and degrade quality numerically instead (measured frame time, DPR ladder, `?_lite` flag) — that is what the two catalogued 3D sites do.

## 03 — Expandable navigation

- **Asset**: `assets/03-expandable-nav.html`
- **Use when**: the menu is a moment, not a list: full-bleed overlay, oversized type, links that arrive.
- **Technique**: overlay expands with `clip-path: inset()` on a fixed layer; each link sits in an `overflow:hidden` row and rises from `y:100%`; the hovered link shifts by `0.8em` via **CSS transition**, not GSAP.
- **Why CSS here**: nav motion must survive a stalled main thread while the next page loads. Valid when navigation reloads the document; if routing is client-side and nothing stalls, a GSAP timeline is equally correct.
- **Variant**: keep the overlay open state on CSS custom properties and zero those properties under reduced motion — one code path, no branching.
- **Timing**: overlay `--dur-enter` `--ease-out`, links stagger `0.06s`, hover shift `--dur-micro`.
- **Budget**: overlay covers the viewport → animate `clip-path` or `transform`, never `height`; pause scroll (Lenis `stop()`) while open and restore on close.
- **Degradation**: reduced motion → instant overlay, no stagger; keyboard → `Escape` closes, focus trapped inside, focus restored to the trigger.

## 04 — Page transition

- **Asset**: `assets/04-page-transition.html`
- **Use when**: navigating between views should read as one continuous space.
- **Technique**: `document.startViewTransition` with `view-transition-name` on the shared element; fallback is a GSAP-driven overlay wipe with `clip-path` that resolves before the new content paints.
- **Timing**: total ≤ 700ms; the outgoing wipe must not delay the first paint of the new view by more than 100ms.
- **Budget**: one overlay layer, `position:fixed`, `pointer-events:none` while idle; never transition the whole document.
- **Degradation**: reduced motion → cross-fade only, 120ms; no View Transitions API → overlay wipe; no JS → plain navigation.
- **Variant**: let View Transitions own navigation and keep GSAP for in-section timelines; the overlay wipe stays as the fallback, not the primary.

## 05 — Kinetic typography

- **Asset**: `assets/05-kinetic-type.html`
- **Use when**: type is the image: split reveals, scroll-linked skew, an infinite marquee band.
- **Technique**: split once into `<span>` per word/char at load; animate `transform` and `opacity` per span. Marquee is a duplicated track translated by a CSS keyframe, `animation-play-state` paused on hover.
- **Timing**: `--dur-hero` for hero lines, `--dur-enter` for secondary, marquee 18–30s linear is allowed for a loop (it is not a UI transition).
- **Budget**: ≤ 400 spans total; split once, never re-split on resize without clearing; `aria-label` on the original text with `aria-hidden` on the split spans.
- **Degradation**: reduced motion → text present, no split animation; no JS → full text renders as one block.

## 06 — Video pipeline

- **Asset**: `assets/06-video-pipeline.html`
- **Use when**: the section is video, so the animation is playback quality.
- **Technique**: `IntersectionObserver` plays/pauses; `hls.js` 1.5.7 attaches only when `canPlayType('application/vnd.apple.mpegurl')` is empty; preload gate (~3s) and load job timeout (~8s); at most 3 fatal retries then poster fallback; `muted`, `playsinline`, `preload="none"`.
- **Timing**: fade in on `playing`, 300ms; never animate inside the video element.
- **Budget**: one decoder per viewport; unmount `hls` on destroy; quality capped (e.g. `min_resolution=720p`); never autoplay more than one element.
- **Degradation**: reduced motion → poster only with an explicit play button; autoplay blocked → poster + play affordance; save-data or slow connection → poster; no `hls.js` and no native HLS → poster.

## 07 — Magnetic cursor

- **Asset**: `assets/07-magnetic-cursor.html`
- **Use when**: pointer interaction is part of the identity: a lerped cursor, targets that pull, media that reacts.
- **Technique**: one fixed cursor element moved with `gsap.quickTo` (lerp ~0.15); magnetic targets translate a fraction of the distance to the pointer, capped by radius; media reacts with `scale`/`skew` only.
- **Timing**: continuous lerp; release back with `--ease-out` `--dur-micro`.
- **Budget**: one `pointermove` listener, throttled through `gsap.ticker`; never query `getBoundingClientRect` per move — cache on `mouseenter` and invalidate on scroll/resize.
- **Degradation**: `(hover:hover) and (pointer:fine)` only; hide the native cursor only when the custom one is active; reduced motion → native cursor, no magnetism; keyboard → focus styles always visible.
- **Variant**: ship the magnetism everywhere and soften it on touch (one sampled SOTD does exactly that) instead of disabling it by capability.

## Corpus mapping

Full evidence, invariants, fingerprints and sampling caveats: `corpus.md`.

| Site | Patterns evidenced | Variant it proves |
| --- | --- | --- |
| artemiilebedev.com | 01, 02, 03, 06, 07 | CSS-transition nav; immersive mode behind a device gate; HLS pipeline |
| threejspunk.com | 02 (3D), 06 | measured quality ladder, `?_lite` escape hatch, no smooth scroll at all |
| 197historiasilustradas.com | 03, 04, 05 | View Transitions own navigation; `clipPath` menu; CSS-driven reveals |
| two26.studio | 03, 05, 07 | GSAP-owned nav; Lenis tuned per pointer; hover effects shipped without a capability gate |
| agrumeafarm.it | 04, 05 | transition driven by zeroed CSS variables; char-roll menu with 18ms stagger |
| guillaumecolombel.fr | 02, 06 | route-level dynamic import; quality tiers; reduced motion as a shorter duration |
