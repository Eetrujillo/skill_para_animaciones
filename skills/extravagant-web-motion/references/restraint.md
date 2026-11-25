# Restraint: How Much Motion Is Too Much

Companion to `corpus.md`. The corpus records what the industry **does**; this file records what it can be held
to. Two kinds of number live here and they must never be mixed:

- **Citable**: a standard, a vendor, or a named expert states it. Quoted with its source.
- **Chosen**: nobody states a number, so this skill picks one and says so. These are decisions, not findings.

A rule citing a source it does not have is worse than no rule.

## Citable limits

| Limit | Value | Source | Type |
| --- | --- | --- | --- |
| Auto-moving content >5s needs pause/stop/hide | **5000 ms** | [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | normative |
| Hover and scroll-into-view count as "starts automatically" | — | WCAG 2.2.2 notes | normative |
| Auto-**updating** content has no 5s exemption | — | WCAG 2.2.2 | normative |
| More than one moving element: one shared control suggested | — | WCAG 2.2.2 (explicitly non-normative) | advisory |
| Interaction-triggered motion must be disableable | — | [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) (AAA) | normative |
| Flashing ceiling | **3 per second**, area **87,296 px²**, luminance delta **20 cd/m²** | [WCAG 2.3.1](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) | normative |
| Animated scroll beyond which it is problematic | **~250 ms** | [WebAIM](https://webaim.org/articles/seizure/) | expert |
| Oscillation frequency to avoid | **0.2 Hz**, nothing at the periphery of vision | [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion.md) | vendor |
| No motion on frequent interactions; never make people wait | — | Apple HIG | vendor |
| Micro-interaction band; motion ceiling | **90–120 ms**; **700 ms** | [Carbon](https://carbondesignsystem.com/guidelines/motion/overview/) | vendor |
| Duration token ceiling | **1000 ms** (extra-long4) | Material tokens | vendor |
| Keep motion on the focused element | — | [Fluent 2](https://fluent2.microsoft.design/motion/) | vendor |
| Long task; good / poor INP | **50 ms**; **200 / 500 ms** | [web.dev INP](https://web.dev/articles/inp) | vendor |
| Compositing time budget | **4–5 ms** | [web.dev layers](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count) | vendor |
| `will-change` window | **200 ms** before the change | [web.dev](https://web.dev/articles/animations-and-performance) | vendor |
| `will-change` as last resort, never a precaution | — | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) | vendor |

### The test that outranks all of them

> "The best interface motion may go unnoticed… Is your motion frequently noticed by average users? If so, consider
> removing or minimizing it." — Carbon

If a reviewer's first reaction is "wow, the animation", that is a finding, not a compliment.

## Chosen budgets (ours, not the industry's)

No source publishes a limit for concurrence, promoted layers, scrubbed scenes, stagger, or moving area. Verified
absent across Material, Apple, Carbon, Fluent, Polaris, GOV.UK. These are our numbers; change them deliberately.

| Budget | Value | Why this number |
| --- | --- | --- |
| **B1** Focal motion per viewport | **1** | only one element may dominate attention; the rest supports |
| **B2** Concurrent animations at peak | **≤ 8** | past that, focus jumps between elements instead of following one |
| **B3** Entrance settle time | **≤ 1200 ms** | Material's own ceiling, applied to the whole entrance including stagger |
| **B4** Moving area at peak | **≤ 35 %** of viewport | full-bleed motion is the vestibular trigger; a third leaves room for hero work |
| **B5** Infinite loops per page | **≤ 1**, with a visible pause control | WCAG 2.2.2 floor; one because two compete |
| **B6** Smooth-scroll settle | **≤ 250 ms** | WebAIM; beyond it, ship native scroll or expose a control |
| **B7** Pinned / scrubbed scenes | **≤ 1 per viewport, ≤ 3 per page** | each one steals the scroll from the user |
| **B8** Promotion candidates | **≤ 12** concurrent; `will-change` only within 200 ms | memory per layer; MDN's last-resort rule |
| **B9** Motion families per page | **≤ 2** | a page that uses fade, slide, scale, blur and mask reads as five pages |
| **B10** Silence | 1 static section per 2 motion-heavy ones | motion needs contrast to be legible |
| **B11** Stagger | **40–90 ms** per step, **≤ 8 steps** | beyond 8 the wait is no longer perceived as choreography |

## Where the sources disagree

| Question | Positions | Resolution here |
| --- | --- | --- |
| Short or cinematic? | Carbon caps at 700 ms; WebAIM flags >250 ms of animated scroll; Material ships 700–1000 ms tokens; Apple allows long set pieces | Duration follows distance and consequence, but nothing user-blocking exceeds **B3**; only unpinned hero moments may be long |
| Stagger or one at a time? | Fluent prefers staggering; Smashing says never animate several elements at once | Stagger under **B11** limits; never stagger content the user must read immediately |
| `will-change`? | web.dev: pre-apply within 200 ms; MDN: last resort only | Follow web.dev's window, MDN's restraint: apply in the 200 ms before, remove after |
| 5 s as a rule or a floor? | WCAG permits any auto-motion ≤5 s with no control; Apple and Carbon argue against auto-repeat regardless | Treat 5 s as the legal floor and **B5** as the design floor |
| Is delight a goal? | Fluent: "delightful animation draws people in"; NN/g: not "to induce delight"; Apple: not motion for its own sake | Delight is a side effect of precision, never an objective with its own budget |

## What this forbids outright

- Motion that cannot be turned off when it is triggered by interaction (WCAG 2.3.3).
- Any automatic loop over 5 s without pause/stop (WCAG 2.2.2).
- Anything above 3 flashes per second or in the 87,296 px² danger area (WCAG 2.3.1).
- Smooth scroll that hijacks the wheel past 250 ms with no way back to native scrolling.
- `will-change` left on permanent elements.
- A second full-bleed motion in the same viewport as the hero.

## Known gaps in this file

- No source gives a safe **motion amplitude** or percentage of viewport; B4 is our invention and should be revised
  against real user testing.
- VeDA's own page returned 403, so the widely repeated "peripheral / large visual field" numbers are attributed to
  Apple HIG here, not to VeDA.
- Salesforce SLDS duration tokens are unverified: their token page 404s and only a third-party copy exists.
- The Awwwards-specific critique rests on one industry audit plus two opinion sources; it is directionally strong,
  not a controlled study.
