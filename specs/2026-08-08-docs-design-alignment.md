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

`mint.json` maps `Light` to `colors.background.light` and `Dark` to
`colors.background.dark`. In the brand list those words name pigments, a pale
cream and a near-black ink. In Mintlify they mean "the background colour in
light mode" and "in dark mode". The names collided, and the result is a theme
that looks plausible but derives from nothing.

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

`mint.json`:

- `font.body.family` to `IBM Plex Sans`
- `colors.background.light` to `#FCFBF8`
- remove `background.style: gradient` (the app has no gradients)

`style.css` (new, repo root):

- a warm replacement for Mintlify's grey ramp, scoped to light mode
- `@import` for IBM Plex Mono, which Mintlify does not request because it is
  not named in config
- reading size
- heading weight and tracking
- mono for `code`, `pre`, `kbd`, `samp`
- micro-label table headers on the `#F0ECDF` band, 13px cells, `#DAD3BD` rule

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

## Verified

Run against the repo with `mintlify@4.2.771` before writing this document:

- A root `.css` file **is** applied on a `mint.json` project. Custom CSS does
  not require migrating to `docs.json`.
- `font.body.family` accepts arbitrary Google Font names; the dev server
  requests `family=IBM+Plex+Sans`.
- Mintlify only requests the families named in config, so the mono tier must be
  imported in the stylesheet or it silently falls back.
- Computed styles after the change: `th` at Poppins 10.5px/700/uppercase/0.08em
  on `#F0ECDF`, `td` at Plex Sans 13px, `code` at IBM Plex Mono, body at 16px
  `#6B695C`, headings at `#101727`.
- Sweeping every element in the document for Mintlify's cold ramp values
  returns zero matches, for both text and background, chrome included.
- Toggling `.dark` leaves the ramp on Mintlify's defaults, confirming the
  override does not reach dark mode.

## Out of scope

**Dark mode.** Left exactly as it is. It is not unanchored: the marketing
refresh uses `#101727` as a real surface with `#E9BE51` eyebrows and links, so
the current config is closer to the brand's direction than to a mistake. It
will be revisited with the refresh.

**`docs.json` migration.** Not required for anything above.

The navigation restructure is safe: the generated `docs.json` keeps all 110
pages in order and splits `docs/knowledge-base/*` from `docs/*` correctly.
`topbarLinks`, `topbarCtaButton`, `footerSocials`, `anchors` and `metadata` all
survive under new names.

Four settings are silently lost, with no error:

| Setting | `mint.json` | after migration |
| --- | --- | --- |
| `theme` | `prism` | `maple` |
| `layout` | `sidenav` | dropped |
| `feedback` | suggestEdit, thumbsRating, raiseIssue | dropped |
| API tab `description` | ~1,500 chars of intro, auth, curl | dropped |

The theme and layout changes are visible: the masthead logo and search move
into the sidebar. Losing `feedback` removes the "Was this page helpful?" widget
and the suggest-edit and raise-issue links.

`layout`, `feedback` and the tab description can be restored by hand. `theme`
cannot. The v2 themes are `mint`, `maple`, `palm`, `willow`, `linden`,
`almond`, `aspen`, `sequoia` and `luma`; `prism` is not among them and has no
v2 equivalent. Production therefore runs a theme that no longer exists in the
product, and migrating means choosing a replacement. `maple` is what the CLI
picks on its own, not a decision anyone has made.

This makes the migration a design choice rather than a port, and it should be
scoped as one.

**`mintlify dev` does not preview production.** It writes a `docs.json` into
the repo root on start and renders from it, so local preview shows the migrated
v2 site while production still serves `mint.json`. Confirmed by editing the
generated `docs.json`'s theme and watching the local render follow it while
`mint.json` was unchanged. Local review is therefore accurate for colour and
type, which come from this stylesheet and from config values that migrate
cleanly, but not for layout or theme. `docs.json` is gitignored so it cannot
reach production by accident.

**Marketing refresh realignment.** Separate work, per the decision above.

## Open

- **Info callouts.** `#2563EB` is the app's own `--info` and is faithful, but it
  is the only cold value in the system and reads loud as a full-width callout on
  a warm ground. Docs lean on `<Info>` far harder than the app does. Keep, or
  derive a warm Info from the primary.
- **Mono field names.** Dictionary tables render field names as plain text
  because the MDX does not backtick them. Either edit the tables, or scope
  `td:first-child` to mono on those pages, which assumes column one is always
  an identifier.
- **Permit tag chips.** Approved in principle. Needs a decision on whether they
  are worth the ongoing maintenance of keeping the tag families in sync with
  the app.
- **Sidebar icons.** Currently mixed metaphors at inconsistent weight. Unifying
  them via `icons.library` requires the migration.
- **Yellow drift.** The mark uses `#E8BD51` (`shovels-navbar-logo.svg`,
  `shovels-footer-logo.svg`, marketing `input.css`) and so does the app. The
  marketing Tailwind config, its README and the 2026 refresh all use `#E9BE51`.
  The difference is imperceptible but it is two values for one brand colour
  across four repos. Left untouched here because it is a brand decision, not a
  docs decision.

## Risks

Docs will read as a different neutral system from the new marketing site until
the app and the refresh reconcile. This is accepted, and is the direct
consequence of the decision above.
