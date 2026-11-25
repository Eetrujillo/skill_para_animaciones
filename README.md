# skill_para_animaciones

A reusable motion-design skill for the Pi agent, plus the test bench that audits it.

## Contents

- `skills/extravagant-web-motion/` — the skill: `SKILL.md` (the runtime contract), `references/` (pattern library,
  a corpus of eight verified sites, degradation contract, craft lessons) and `assets/` (seven self-contained HTML
  demos, no build step, no remote fonts).
- `motion-lab/` — the test bench: serves a lab UI and mounts the skill's assets, so every demo is audited against
  the same contract and its reference-site fingerprints are listed.

## Skill

Point `~/.agents/skills/extravagant-web-motion` at `skills/extravagant-web-motion` (symlink or copy) and the agent
picks it up by its description. It encodes high-impact web motion under a declared performance budget: motion tiers,
compositor-only rules, per-feature degradation, and the distinction between invariants and one-site fingerprints.

## Lab

```bash
cd motion-lab && node serve.mjs        # → http://127.0.0.1:4815/index.html
```

Two scored axes and one informational: contract checks (scored), saturation budgets (scored, from `restraint.md`),
and fingerprints (unscored). Serve over HTTP — `file://` forbids same-origin iframe introspection.
`motion-lab/README.md` lists every check and, more importantly, what the lab cannot test.

## Evidence

The patterns are not invented. `references/corpus.md` records eight sites with their stacks verified in live HTML,
a falsification round over four more URLs, and an explicit list of the claims that did not survive it — plus what
remains unverified. `references/restraint.md` separates citable limits (WCAG, WebAIM, Apple, Carbon, Material,
web.dev) from the saturation budgets this skill chose for itself.
