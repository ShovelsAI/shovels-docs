# Docs design alignment

Bring docs.shovels.ai onto the design system defined in
`shovels-online/app/globals.css`, so the documentation and the product read as
one surface.

## Problem

The docs theme was configured by mapping a four-line brand list onto Mintlify's
config slots. `shovels-marketing/README.md` reads:

```
Primary:   #01654D
Secondary: #E9BE51
Dark:      #101727
Light:     #EAE2CF
```

The config mapped `Light` onto the background colour for light mode and `Dark`
onto the background colour for dark mode. In the brand list those words name
pigments, a pale cream and a near-black ink. In Mintlify they name surfaces.
The names collided, and the result is a theme that looks plausible but derives
from nothing.

The evidence that `#EAE2CF` was never a surface: it appears in three files
across the whole marketing repo (the Tailwind config that declares it, the
README that documents it, and a treemap visualisation). `shovels-light` has
zero uses in marketing templates, as does `shovels-dark`. The app never paints
either as a surface. Only the docs do.

Measured consequences on the live site:

- Body copy renders `#3E4140`, a cold grey that is not a Shovels colour, on
  `#EAE2CF`.
- White cards sit on that cream at 1.29:1 and read as stickers. The app's
  `#FFFFFF` on `#FCFBF8` is 1.03:1, held by a hairline and a warm shadow.
- Body copy is set in Poppins at 18px. In the app Poppins is the structure
  tier, used for page titles at 21px and micro-labels at 10.5px, and never
  sets a paragraph.
- There is no identifier tier. Inline code falls back to `paperMono`,
  Mintlify's own theme font.

## Decision

Align to the app, not to the marketing site.

The app is the only Shovels surface with a written design system: `globals.css`
states its own rules ("every neutral derives from the brand cream, never a cold
gray ramp"; "one true-yellow accent stroke per screen"; "red never marks
caution"). Marketing has a licensed display face and two enforced colours.
Docs readers also arrive from the product, not from the marketing funnel.

The 2026 marketing refresh moves further from the app: white ground, Tailwind
cold greys (`#F3F4F6`, `#F9FAFB`), body copy on `system-ui`, 16px card radius,
pill buttons. The app and the refresh are now two incompatible neutral systems.
Realigning docs with the refresh is deliberately out of scope here and will be
taken as separate work once the two systems reconcile.

What all three surfaces already agree on, and what is therefore safe in any
future direction: emerald `#01654D` as the action colour, `#101727` as ink, a
rationed yellow accent, and uppercase letter-spaced micro-label eyebrows.

## Tokens

Light mode only. Every value is copied from `globals.css`; nothing is invented.
Ratios are WCAG 2.1 against the page ground.

| Role | Value | Contrast |
| --- | --- | --- |
| Page | `#FCFBF8` | — |
| Card | `#FFFFFF` | 1.03 |
| Subtle fill (code, table band) | `#F0ECDF` | — |
| Hairline | `#E2DCC9` | — |
| Table rule | `#DAD3BD` | — |
| Ink | `#101727` | 17.29 AAA |
| Secondary ink | `#6B695C` | 5.34 AA |
| Primary | `#01654D` | 6.83 AA |
| Accent | `#E8BD51` | decorative only |

One deliberate deviation: micro-labels use `#6B695C` rather than the app's
`#837E6C`, which measures 3.93 and fails AA at small sizes. Docs are read at
reading distance; the app's dense chrome is not.

The table rule is `#DAD3BD` rather than the app's `#E2DCC9` (1.33 against the
page) for the same reason.

## Type

Three faces, three jobs, mirroring the app and never crossing:

| Tier | Face | Use |
| --- | --- | --- |
| Structure | Poppins | headings and micro-labels only |
| Data | IBM Plex Sans | prose, tables, everything read |
| Identifier | IBM Plex Mono | code, API paths, field names, IDs |

Both Plex faces are free Google fonts. Headings keep Poppins but at weight 600
and `-0.02em` rather than bold at default tracking, matching the app's page
titles. Body drops from 18px to 16px at 1.65.

## Where each change lives

Mintlify config carries what it can express; the rest is a root stylesheet.
`specs/2026-08-08-docs-element-inventory.md` maps every surface to its owner.

`docs.json`:

- `fonts.body.family` to `IBM Plex Sans`
- `background.color.light` to `#FCFBF8`
- no `background.decoration` (the app has no gradients)
- `styling.codeblocks.theme.light` to `css-variables`, so syntax colour comes
  from the palette rather than from github-light
- `logo.light` and `logo.dark` to the vector marks
- `theme` pinned, see below

`style.css` (repo root):

- a warm replacement for Mintlify's grey ramp, scoped to light mode
- `@import` for IBM Plex Mono. Mintlify requests only the families named in
  config, and the schema has slots for `heading` and `body` only, with
  `additionalProperties: false`. There is no way to declare a third.
- the micro-label, on the section eyebrow, the sidebar group and the table
  header
- reading size, heading weight and tracking
- mono for `code`, `pre`, `kbd`, `samp`, and for dictionary field names
- the palette's syntax colours, under Mintlify's `--mint-*` namespace
- callout, card, accordion, search and table surfaces

### Colour is set at the ramp, not at the element

Mintlify resolves every text, border and fill colour through its own Tailwind
ramp: `.text-gray-700 { color: rgb(var(--gray-700)) }`. Its default ramp is
cold, biased green-cyan, which is exactly what the app's palette rule forbids.

Redefining `--gray-50` through `--gray-950` at the root warms every element
Mintlify colours, including components this stylesheet has never heard of.
Selecting elements individually does not work: an earlier version of this file
enumerated `p, li, td` and left 31 elements on the cold grey, among them the
accordion titles on the data dictionary pages, which are the most prominent
text on exactly the pages the change was aimed at.

The override is scoped to `:root:not(.dark)`. The 300 and 400 steps carry
dark-mode body text and 950 carries dark-mode borders, and dark mode is
deliberately untouched.

## The config was already migrated

`mint.json` was never what production ran. The hosted build migrates it to
`docs.json` at deploy time, and the payload docs.shovels.ai serves carries
`"$schema": "https://mintlify.com/docs.json"` with `"theme": "mint"`.

That reframes the migration from a decision into a description. Committing the
generated config changes which layer decides the settings, not what ships.

The theme is why it could not wait. `prism` has no v2 equivalent — the enum is
`mint`, `maple`, `palm`, `willow`, `linden`, `almond`, `aspen`, `sequoia`,
`luma` — so the migrator substitutes one, and the two migrators disagree: the
hosted build resolves `prism` to `mint`, `mintlify@4.2.772` resolves it to
`maple`. The skin therefore depended on which migrator ran, and a change on
Mintlify's side could have reskinned the docs with no commit here. `theme` is
pinned to `mint`, which is what production already rendered, so the port is
visually neutral.

Owning the config also reaches `styling.codeblocks`, `icons.library` and
`appearance`, none of which the v1 schema can express.

What migration actually costs, measured rather than assumed:

| Setting | `mint.json` | on production today |
| --- | --- | --- |
| `theme` | `prism` | `mint`, substituted |
| `layout` | `sidenav` | absent |
| `feedback` | suggestEdit, thumbsRating, raiseIssue | **renders anyway** |
| API tab `description` | ~1,500 chars | absent |

Only the tab description is a real loss, and it was already lost: v2 navigation
has no `description` on a tab, so it cannot be restored in config. That intro,
the authentication note and the curl example need to become a page.

`feedback` was previously recorded here as dropped. It is not — `.feedback-toolbar`
renders on production, because v2 enables it by default.

## Verified

Run against the repo and against production with `mintlify@4.2.772`:

- Mintlify requests only the families named in config. `fonts` accepts
  `heading` and `body` and sets `additionalProperties: false`, so the mono tier
  must be imported in the stylesheet or it silently falls back.
- The page ground is painted by `span#background-color`, bound to
  `bg-background-light`, so config owns it and this stylesheet does not.
- The ramp is necessary but not sufficient. Table headers render
  `oklch(0.21 0.034 264.665)`, Tailwind's own `gray-900`, while the cells
  beside them resolve through `--gray-700`. Hardcoded values need selectors.
- Mintlify renames Shiki's css-variables namespace. The emitted markup reads
  `color: var(--mint-token-function, #0068d6)`, so the variables are `--mint-*`.
  Set under `--shiki-*` they are inert, which is how they were first written.
- Callouts force their contents to the variant colour with
  `[&_code]:text-current!`. Recolouring the fill alone leaves blue code on a
  cream ground; the variant's own colour has to change.
- Computed after the change: sidebar group, eyebrow and `th` at Poppins
  10.5/700/uppercase/0.08em; `td` at Plex Sans 13px; body 16px `#6B695C`;
  headings `#101727`; syntax entirely on-palette with zero off-palette values.

## Out of scope

**Dark mode.** Left as it is. It is not unanchored: the marketing refresh uses
`#101727` as a real surface with `#E9BE51` eyebrows and links, so the current
config is closer to the brand's direction than to a mistake. It will be
revisited with the refresh. Every colour rule here is scoped to
`:root:not(.dark)` and the code theme keeps `github-dark`.

**`mintlify dev` still does not render production.** Config is no longer the
difference — both now read the same committed `docs.json`. Navigation is: the
dev server server-renders every `/docs/*` page with the Knowledge Base tree,
where production renders the correct eight Documentation groups. Colour and
type are trustworthy locally; tab and sidebar structure must be checked on the
deployed preview.

**Marketing refresh realignment.** Separate work, per the decision above.

## Open

- **Permit tag chips.** Approved in principle. Needs a decision on whether they
  are worth keeping the tag families in sync with the app, and they have no
  content home today: tags appear only as JSON literals inside code spans.
- **Sidebar icons.** Mixed metaphors at inconsistent weight. `icons.library` is
  now reachable, but it selects one library and the metaphors are per-item
  choices in the navigation, so unifying them is a content pass.
- **API tab description.** Needs to become a page, per above.
- **Yellow drift.** The mark uses `#E8BD51` (`shovels-navbar-logo.svg`,
  `shovels-footer-logo.svg`, marketing `input.css`) and so does the app. The
  marketing Tailwind config, its README and the 2026 refresh all use `#E9BE51`.
  The difference is imperceptible but it is two values for one brand colour
  across four repos. Left untouched because it is a brand decision, not a docs
  decision.

## Risks

Docs will read as a different neutral system from the new marketing site until
the app and the refresh reconcile. This is accepted, and is the direct
consequence of the decision above.
