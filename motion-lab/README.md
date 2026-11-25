# Motion Lab

A test bench for the `extravagant-web-motion` skill. It loads each demo asset in an iframe and audits it on
**three independent axes**:

1. **Contract** (scored): motion inventory declared, reduced-motion branch, named easing layer, no remote fonts,
   idempotent script guard, no sidecar assets, inline JS parses, only compositor properties transitioned, hidden
   start states scoped to a JS class, running animations compositor-only, no console errors, and which degradation
   branch is actually active in your environment.
2. **Fingerprints** (unscored): decisions that belong to one reference site and must not harden into rules —
   its easing values, a full-experience width+pointer gate, a persisted immersive mode, its video pipeline
   constants. Listed, never penalised: the demos are deliberately one instantiation.
3. **Saturation** (measured against declared budgets in `references/restraint.md`): peak animated elements in a
   100 ms window, entrance settle time, moving area at peak, infinite loops and their pause control, smooth-scroll
   settle, pinned scenes, promotion candidates. GSAP is invisible to the Web Animations API, so it is counted
   through a `MutationObserver` on `style` attributes; CSS animations come from `getAnimations()`. Both sources
   are unioned. Scroll used to be measured by pushing the frame; the declared Lenis duration is now checked too,
   because a programmatic push cannot see what the tween would really do.
4. **Fluidity** (from `references/fluidity.md`): long-animation-frame entries (`PerformanceObserver('long-animation-frame')`)
   recorded during a scripted scroll pulse across the frame, plus the worst frame duration. In a browser that
   cannot emit LoAF entries the row reports `manual` — an unverified zero is never scored as a pass.

The audit reads the real files: CSSOM rules, `document.getAnimations()` keyframes, and the source text. It is not a
screenshot gallery.

## Quick start

```bash
node serve.mjs                 # → http://127.0.0.1:4815/index.html
node serve.mjs --port 5000
node serve.mjs --assets /path/to/extravagant-web-motion/assets
```

The server must be used; `file://` forbids same-origin iframe introspection, so the lab would see nothing.

## Where the assets come from

Served at `/assets/`, resolved in this order:

1. `--assets <dir>`
2. `EWM_ASSETS` environment variable
3. `lab.config.json` → `{ "assets": "<path>" }`
4. `../skills/extravagant-web-motion/assets` (this repo)
5. `~/.agents/skills/extravagant-web-motion/assets` (standalone install)

Override it when the skill lives somewhere else. Nothing is copied: the lab always audits the live skill files.

## Keys

`1`–`7` switch pattern. `d` / `t` / `m` switch the preview viewport (1440 / 834 / 390 px). Viewport presets resize
the iframe for real, so the demos' media queries respond — that part is a genuine test.

## What it cannot test

- **Whether the budgets are right**: the saturation numbers in `references/restraint.md` are this skill's chosen
  policy, not a standard. No source publishes a concurrency, layer, or moving-area limit; each budget says so.
- **Whether it feels good**: nobody here watches animations. Everything is read from code.
- Reduced motion, pointer capability, keyboard and 60fps remain manual checks, listed with instructions in the UI.

## Limits of the detectors

The audit is heuristic, not semantic. A curve written as a named GSAP ease will not trip the easing-value
fingerprint; a device gate written in an unusual syntax can slip through. Treat findings as signals, not proof.
