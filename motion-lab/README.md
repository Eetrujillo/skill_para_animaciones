# Motion Lab

A test bench for the `extravagant-web-motion` skill. It loads each demo asset in an iframe and audits it on
**two independent axes**:

1. **Contract** (scored): motion inventory declared, reduced-motion branch, named easing layer, no remote fonts,
   idempotent script guard, no sidecar assets, inline JS parses, only compositor properties transitioned, hidden
   start states scoped to a JS class, running animations compositor-only, no console errors, and which degradation
   branch is actually active in your environment.
2. **Fingerprints** (unscored): decisions that belong to one reference site and must not harden into rules —
   its easing values, a full-experience width+pointer gate, a persisted immersive mode, its video pipeline
   constants. These are listed, never penalised: the demos are deliberately one instantiation.

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

- **Reduced motion**: depends on your OS or DevTools › Rendering › `prefers-reduced-motion`. The lab reports the
  environment instead of faking it.
- **Pointer capability**: `hover:hover` / `pointer:fine` cannot be emulated from a page, so gated branches stay off
  and the audit says so explicitly.
- **Keyboard and 60fps**: listed as manual checks with instructions.
- **Whether it feels good**: nobody here watches animations. Everything is read from code.

## Limits of the detectors

The audit is heuristic, not semantic. A curve written as a named GSAP ease will not trip the easing-value
fingerprint; a device gate written in an unusual syntax can slip through. Treat findings as signals, not proof.
