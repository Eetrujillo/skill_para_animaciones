# Craft Lessons From a Real Awwwards SOTD

Source: `artemiilebedev.com`, Awwwards Site of the Day (Nov 22, 2026). Evidence gathered by reading the live
document and the three custom scripts the site ships as `.txt` on its CDN.

Stack observed: Webflow build, GSAP 3.12.7 + ScrollTrigger, Lenis 1.3.23, three.js 0.160 loaded lazily by the
hero script, hls.js 1.5.7 over Mux HLS streams, custom nav, hero and video-pipeline scripts.

## 1. The extravagance is cheap at frame level

Almost every moving property is `transform`, `opacity` or `clip-path`. The expensive things — WebGL, video,
3D — are gated and lazy. Cinematic is a composition of cheap moves, not a pile of expensive effects.

**Rule**: if a beautiful idea needs a layout property, redesign the idea until it needs a transform.

## 2. Two motion engines, chosen by failure mode

The site's own nav script moves menu links with CSS transitions and explains why in a comment: the main thread,
and every GSAP frame with it, stalls in ~100ms chunks while a page loads.

**Rule**: motion that must survive a stalled main thread goes to CSS. GSAP is for timelines and scrub, not for
single-state feedback.

## 3. A deliberately small easing vocabulary

Observed curves: `expo.out` and `power2.out` for entries; `cubic-bezier(0.16, 1, 0.3, 1)` (an expo-out) and
`cubic-bezier(0.33, 0, 0.2, 1)` for states. No `linear` on UI, no elastic everywhere.

**Rule**: two or three curves per project, reused. Variety comes from duration and stagger, not from a curve zoo.

## 4. Gates by input device, not just by width

The immersive hero only exists under `(min-width: 992px) and (hover: hover) and (pointer: fine)`, and its mode
(`carousel` / `fullscreen`) persists in `localStorage`.

**Rule**: decide by capability (pointer precision, hover) plus width. Mobile gets a coherent calmer experience,
not a compressed desktop one. Persist the user's mode choice.

## 5. Spend the robustness budget where the user feels it

The video script implements a preload gate (~3s), a load job timeout (~8s), at most 3 fatal HLS retries, and
`IntersectionObserver`-gated decode.

**Rule**: a stunning section that stalls on load is a failed section. Timeouts, retries and poster fallbacks are
part of the animation, not cleanup.

## 6. Version-stamped idempotent scripts

Every custom script starts by writing a version onto `window` and returning early if it already matches, so a
re-execution (Webflow re-init, client-side navigation) never double-binds listeners or stacks timelines.

**Rule**: guard every injected script with a version stamp and return early; always pair it with a teardown path
for `hls`, ScrollTrigger instances and ticker callbacks.

## Anti-patterns this site avoids

- No `width`/`height` animation for layout changes (tiles are pre-sized and transformed).
- No library for what CSS does better.
- No unbounded `will-change`.
- No animation blocking first paint of the new view during navigation.
