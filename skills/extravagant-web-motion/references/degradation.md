# Degradation Contract

Every pattern in this skill ships the following branches in the same file as the animation. Write them first.

## Reduced motion

Detect once, at startup:

```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
```

Rules:

- Reduced motion is not "no design": keep layout, type, images and color; remove movement, scrub, pin, parallax, magnetism and autoplay.
- Content that would be revealed by animation must be visible by default in CSS. Animation adds a start state; it never owns visibility.
- Re-evaluate on change: `reduce.addEventListener('change', apply)`, and tear down loops on entry, rebuild on exit.
- CSS side always declares a `.reduce` class on `<html>` so both branches can be styled from one place.

### Four forms that ship — pick one per project, never none

| Form | Mechanism | Trade-off |
| --- | --- | --- |
| Zero the custom properties | `--page-transition-duration:0ms` inside the RM block | one code path, cannot drift; needs tokens to exist first |
| Override named pseudo-elements | `::view-transition-old(.x){animation:none}` | the only way to reach browser-owned View Transitions |
| Kill globally | `*,:after,:before{animation:none!important;transition:none!important}` | obvious blast radius; also kills useful feedback |
| Shorten instead of remove | `.55 → .3` duration, `timeScale(0.75)` | keeps feedback affordances; must be verified by hand |

Shortening is legitimate only when the remaining motion carries meaning (press feedback, focus). Removing is the
default for decorative entrance, parallax, scrub, pin, magnetism and autoplay.

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
}
```

## Pointer and device gates

Default is **per-feature degradation**, which held in 5/5 of the sampled corpus: shorten the interaction, lower the
resolution, drop a layer. Gating an entire experience behind a device query is the exception, and when you use it,
say why in the motion inventory.

| Gate | Query | What changes |
| --- | --- | --- |
| Hover niceties | `(hover:hover) and (pointer:fine)` | magnetic pull, custom cursor, tilt |
| Immersive layer (optional) | `(min-width:992px) and (hover:hover) and (pointer:fine)` | WebGL scene, drag carousel — needs a functional equivalent |
| Touch | `(hover:none)` | native cursor, larger targets, swipe instead of drag-lerp |
| Small viewport | `(max-width:991px)` | single column, shorter pin, no horizontal strip |
| Coarse pointer on tablet | `(pointer:coarse)` | keep visuals, drop magnetism and audio autoplay |

Numeric degradation to prefer before removing anything: duration, stagger count, parallax layer count, pixel
ratio, MSAA samples, number of animated tiles, video quality cap.

Never gate content behind a capability. A gated feature must have a functional equivalent for the ungated branch.

## No-JS and failed script

The page must remain readable with JavaScript disabled or a CDN blocked:

- reveal state is the default; hidden start states are applied by script after it is known to run;
- no `opacity:0` in the stylesheet for essential content;
- `<noscript>` for anything that truly needs a notice;
- `<video>` ships a `poster` so the section has an image without any library.

## Bandwidth and playback

- `preload="none"` + `IntersectionObserver` before any buffering.
- Cap quality (e.g. `min_resolution=720p`) and never autoplay more than one element.
- Timeouts and bounded retries: preload gate ~3s, load job ~8s, ≤3 fatal retries, then poster.
- Respect `navigator.connection.saveData` and `effectiveType` in `('slow-2g','2g','3g')` by staying on the poster.

## Keyboard and focus

- Custom cursors and magnetic targets never replace focus styles; `:focus-visible` stays visible on every interactive element.
- Overlays trap focus, close on `Escape`, and restore focus to the trigger.
- Carousel and morph views expose `ArrowLeft`/`ArrowRight`/`Enter`/`Escape` and a visible close control.
- Split-text animations keep the accessible name: `aria-label` on the container, `aria-hidden` on generated spans.

## Verification checklist

1. Reduced motion: no movement, all content visible, no remaining ticker work.
2. JS disabled: page reads, images and video posters present, no blank sections.
3. Touch device or narrow viewport: no immersive layer, no custom cursor, actions reachable.
4. Slow 3G throttling: no layout shift, poster shown, no blocking request before first paint.
5. Keyboard only: every action reachable, focus visible, `Escape` closes overlays.
6. DevTools performance: no long task over 50ms during transitions; animated layers composite.
7. Heavy scenes: quality ladder responds to a throttled CPU, and the low-power escape hatch actually reduces work.
