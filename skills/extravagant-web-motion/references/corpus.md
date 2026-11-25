# Motion Corpus: Invariants vs Fingerprints

Evidence base for this skill. Eight sites, stacks confirmed in live HTML/JS — never from Awwwards technology tags.
Two rounds: (I) five Awwwards SOTD sites from a Nov 2026 window; (II) a falsification round on four sites supplied
by the user, two of them new.

**Sampling caveats**: round I is SOTD winners from one three-week window, judged by a similar jury. Round II adds a
newer Nuxt 4 studio site and a Webflow-hosted portfolio, one of which is not an Awwwards entry at all. Read the
result as "competitive practice 2026", never as law. Re-sample before treating any invariant as eternal.

## Sites

| # | Site | Confirmed stack | Signature techniques | Degradation | Contradicts the original reference |
| --- | --- | --- | --- | --- | --- |
| 0 | artemiilebedev.com | Webflow, GSAP 3.12.7, ScrollTrigger, Lenis 1.3.23, three.js 0.160 (lazy), hls.js 1.5.7 + Mux | CSS transitions for nav (main-thread stalls ~100ms), easing `.16,1,.3,1`, immersive hero behind 992px + fine pointer + `localStorage` mode | per-mode gate; RM media query; 3s preload gate, 8s job timeout, ≤3 HLS retries | — (the only site of eight with a full-experience gate) |
| a | threejspunk.com | Vite SPA, Three.js r187 + WebGPU/TSL, GSAP 3.15.0. No Lenis, no ScrollTrigger | runtime quality ladder (`targetFps:50`, DPR step-down), `?_lite` escape hatch, DPR whitelist `[1,1.25,1.5,2]` | RM only for in-game typed text; heavy path degraded by measured frame time | immersion never width/pointer gated; degradation is measured, not declared |
| b | 197historiasilustradas.com | Next.js App Router, Prismic, Tailwind v4, GSAP + `@gsap/react`, **Lenis 1.3.17 via Locomotive Scroll 5.0.0** | framework `ViewTransition` component + `::view-transition-old(.loading-out)` CSS; `clipPath polygon()` menu `power3.inOut`; `.line-mask` reveals | 4 RM blocks + `::view-transition-*` overrides; per-feature `GRID_BREAKPOINT_PX` 768 | six-value easing token set incl. `--ease-anticipate:cubic-bezier(1,-.4,.35,.95)` |
| c | two26.studio | Webflow + GSAP **3.15.0** CDN (SplitText, ScrollTrigger, DrawSVG, MotionPath, CustomEase, CustomBounce), Lenis 1.1.20, jQuery 3.5.1 | loader hard-skipped under RM; `timeScale(0.75)`; card-deck `yPercent` reveals; magnetism on `mousemove`, unconditional | `(pointer:coarse)` tunes Lenis duration/touchMultiplier only; no `hover`/`fine` gate anywhere | pointer-expressive interaction shipped to everyone and softened; GSAP owns nav where site 0 uses CSS |
| d | agrumeafarm.it | Nuxt 3/Vue, Lenis + GSAP bundled | transitions from CSS custom properties (`--page-transition-duration`); char-roll menu `translate3d(0,±100%,0)` with 18ms stagger; clamp-based mobile tokens | RM zeroes the transition **variables**, so one code path collapses; hover effects inside `(hover:hover) and (pointer:fine)` | per-interaction gates; Material `cubic-bezier(.4,0,.2,1)` |
| e | guillaumecolombel.fr | Nuxt 3, GSAP 3.15.0 + SplitText, three.js WebGL/WebGPU dynamically imported, Howler lazy | WebGL mounted per route via `import()`, `.no-gl` CSS fallback; quality table by tier; MSAA by DPR | RM **shortens** (`.55 → .3`); audio early-returns on `(pointer: coarse)` | degradation is a number, not a mode |
| f | laboiteaslides.fr | Nuxt 4.6.4, Vue Router, unhead, Lenis (`html.lenis-stopped`, `data-lenis-prevent`), custom 3D data layer `#SYNTHRA` (renderer chunk not located) | 700vh scroll-scrub header (`.@whole{height:700vh}`); nav as pure CSS `transition-timing-function:cubic-bezier(.13,.93,.13,.93)`; `mask-composite` glass system with `@property --glassIntensity` | **no `prefers-reduced-motion` anywhere**; width+height device classes (`min-width:768px and min-height:435px`); no pointer query at all | does the opposite of the discipline: 700vh scrub and a loader with zero RM branch |
| g | scottsnyder.webflow.io | Webflow shell + custom bundle (Vercel), GSAP **3.13.0** (ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG, Draggable, MotionPath, CustomEase), Lenis 1.3.11, three-style WebGL | `gsap.defaults({ease:"expo.out",duration:1.2})`; CSS `linear()` springs and `--quart-out`; SplitText `mask:"words"` with `y:"110%"→"0%"` | RM via `matchMedia`; width gate at 1024px only; `IntersectionObserver` with `observerMargin`; `maxPixelRatio:2` | gates on reduced-motion + width, never on hover/pointer; springs and quart, not `.16,1,.3,1` |

## Falsification round (sites f, g, and re-checks of b, c)

| Invariant | f laboiteaslides | g scottsnyder | c two26 | b 197 | Verdict |
| --- | --- | --- | --- | --- | --- |
| I1 `prefers-reduced-motion` handled | **FAILS** (zero occurrences) | holds | holds | holds | **HOLDS 7/8** (site a: typed text only) |
| I2 easing named/centralized | fails (one curve reused inline) | holds (defaults + tokens) | named GSAP eases, no CSS tokens | mostly tokens, plus inline `expo.*` | **HOLDS if "named" counts; REFUTED if "CSS tokens" is required** |
| I3 overflow-mask text reveal | unverified | holds | partial (card deck, not text) | holds | **WEAKENS — common technique (~4/8), not an invariant** |
| I4 no full-experience gate | holds | holds (1024px width only) | holds | holds | **HOLDS 7/8 — site 0 is the only exception** |
| I5 heavy assets lazy | holds (exports + `modulepreload`) | holds (IO + margin) | partial (CDN libs, `loading="lazy"`, but a preloaded image list) | holds | **HOLDS 7/8** |
| I6 no shared house curve | holds | holds | holds | holds | **HOLDS 8/8 — `.16,1,.3,1` appears in no other site** |

### Corrections to earlier claims

- **two26 has no `IntersectionObserver` at all** (previously listed as unverified): reveals are ScrollTrigger-driven. Its magnetism uses `mousemove` with no capability check; the heading-magnetism embed in the page is commented out.
- **197 does instantiate a smooth-scroll engine**, confirmed: Lenis 1.3.17 embedded through Locomotive Scroll 5.0.0 (previously "CSS artifacts only").
- **197 does not call `document.startViewTransition` itself**: it renders a framework `ViewTransition` component and styles it with `::view-transition-*` CSS. The navigation transition is still CSS-owned, not GSAP-owned.
- **No site among f, g, b, c uses a `hover:hover` + `pointer:fine` + persisted-mode gate.** Combined with round I, site 0 is one of eight — its triple gate is site-specific.

## Where these sites fail their own users

The corpus celebrates these sites; it must also record the bill. Evidence against the aesthetic this skill was built
from:

- **Greenspector** audited [10 Awwwards-nominated sites](https://greenspector.com/en/resources/blog/analysis_sites_nominated_mobile_excellence_awwwards/):
  one at **more than 400 HTTP requests and 12 MB**, one with "perpetual movements (without the possibility of control)",
  one with "about 40 accessibility errors".
- **NN/g**: scroll-triggered reveals cost patience — "even one extra second is enough for users to notice a delay" —
  and motion should serve communication "rather than to induce delight or entertain users".
- **Tatiana Mac**, writing from lived BPPV: animation "especially when overused and abused, can make people very ill".
- **WebAIM**: animated scrolling beyond ~250 ms is a vestibular trigger, and scrolljacking is "highly likely" to cause
  symptoms. Two of the eight catalogued sites ship smooth-scroll engines; those sit above the threshold.

Consequences this skill accepts, with the numbers in `restraint.md`:

1. Award-site motion is **not** automatically good. It is the aesthetic under audit, not the target.
2. Auto-repeating motion without a pause control is a WCAG 2.2.2 failure regardless of how well it is crafted.
3. A page measuring 12 MB of assets cannot be defended as "cinematic", only as expensive.
4. The strongest review signal is a reviewer noticing the animation at all (Carbon: if it is frequently noticed,
   remove or minimise it).

## What survives as a rule

1. **Handle reduced motion explicitly** — 7/8, and the one that ignores it (f: 700vh scroll-scrub, loader, zero RM) is a defect to avoid, not a style choice.
2. **Have a named easing vocabulary** — CSS custom properties *or* named GSAP eases. Scattered magic numbers and a single curve reused everywhere are the failure mode. Do not prescribe the values: no two sites share a curve.
3. **Degrade per feature** — 7/8. A whole "immersive mode" behind width + pointer + persisted state is one site's decision, never the default abstraction.
4. **Lazy-load the heavy module** — 7/8, with route-level dynamic import, `IntersectionObserver`, or a deferred class swap; always paired with a poster or CSS fallback.
5. **Visible by default / idempotent scripts** — retained from round I (site 0 only), still cheap insurance.

## Downgraded from rule to technique

- **Overflow-mask text reveals**: the workhorse in about half the corpus, not universal. Use when type is the subject.
- **Smooth scroll (Lenis)**: present in 5/8. Optional, never assumed.
- **Quality ladders / DPR steps**: only the WebGL-heavy sites do it; required *if* you ship a heavy scene, irrelevant otherwise.

## Four reduced-motion forms that ship

| Form | Seen in | Trade-off |
| --- | --- | --- |
| Zero the custom properties (`--page-transition-duration:0ms`) | d | one code path, cannot drift; needs tokens first |
| Override named pseudo-elements (`::view-transition-old(.x){animation:none}`) | b | the only way to reach browser-owned transitions |
| Global `animation:none!important; transition:none!important` | e | obvious blast radius; kills useful feedback too |
| Shorten instead of remove (`.55 → .3`, `timeScale`) | c, e | keeps affordances; must be verified by hand |

## Fingerprints (one site only — never prescribe)

WebGPU/TSL + `?_lite` + adaptive DPR (a). `::view-transition` class naming and the overshoot curve (b).
`timeScale(0.75)` + CustomBounce + unconditional magnetism (c). Zeroed transition variables (d). Quality table by
tier and `(resolution: Xdppx)` listeners (e). 700vh scroll-scrub and `mask-composite` glass (f).
`gsap.defaults` house ease plus `linear()` springs (g). The 992px + fine-pointer + `localStorage` mode (0).

## Unverified — do not quote as fact

- f: the WebGL renderer/GSAP chunk was not located among 56 `__vite__mapDeps` entries; only the 3D data layer and CSS are confirmed.
- g: three.js `REVISION` not seen; WebGL confirmed from canvas/config code only.
- b: Lenis instantiation seen as a minified `new a(` inside the Locomotive wrapper, not a literal `new Lenis(`.
- awwwards technology tags were cross-checked against live HTML for site (a) only.
- Nobody in either round watched the animations. Every technique above is read from code and CSS, never from playback.
