# Docs element inventory

Every distinct UI surface the docs render, what paints it, and who owns it.

This exists because the first pass at the alignment scoped its stylesheet to
`#content-area`, aligned the content column, and left the chrome on Mintlify's
defaults. Nothing caught the gap, because nothing enumerated the elements. This
document is the scope, the checklist and the verification plan at once.

Measured against production with `mintlify@4.2.772`. "Before" is what
docs.shovels.ai rendered prior to this work.

## Owners

| Owner | Meaning |
| --- | --- |
| `config` | Expressible in `docs.json`. Preferred: survives Mintlify's markup changes. |
| `ramp` | Follows automatically from redefining `--gray-50`…`--gray-950`. |
| `css` | Needs a selector in `style.css`, because Mintlify hardcodes the value. |
| `content` | Lives in MDX, not in theming. |

## Why the ramp is not sufficient on its own

Mintlify resolves most colour through its own token ramp, declared as
space-separated RGB channels: `.text-gray-700 { color: rgb(var(--gray-700)) }`.
Redefining that ramp warms every element it reaches, including components this
stylesheet has never heard of.

It does not reach everything. Some rules carry hardcoded Tailwind v4 values in
`oklch`, which no `--gray-*` override can intercept. Table headers are the
clearest case: they render `oklch(0.21 0.034 264.665)`, Tailwind's own
`gray-900`, while table cells in the same table resolve through `--gray-700`.
Those elements need selectors.

Verification therefore cannot be "the ramp is warm". It has to be "no element
on the page resolves to a cold value", swept element by element.

## Page

| Element | Hook | Before | Target | Owner |
| --- | --- | --- | --- | --- |
| Ground | `span#background-color` | `#EAE2CF` | `#FCFBF8` | config |
| Gradient wash | `span.absolute` sibling | emerald radial at 10% | none | config |
| Navbar band | `div#navbar-transition` | follows ground | follows ground | config |

## Chrome

| Element | Hook | Before | Target | Owner |
| --- | --- | --- | --- | --- |
| Logo | `img.nav-logo` | one PNG, both themes | app SVG + dark variant | config |
| Search | `#search-bar-entry` | Poppins 14, `#EAE2CF`, r12 | subtle fill + hairline | css |
| Assistant | `#assistant-entry` | as search | as search | css |
| CTA button | `#topbar-cta-button` | Poppins 14/400 | primary, r8 | css |
| Navbar link | `.navbar-link` | Poppins 14/400 `#707372` | Plex Sans, secondary ink | ramp |
| Tab | `.nav-tabs-item` | Poppins 14/500 `#252827` | Plex Sans, ink | ramp |
| Anchor | `.nav-anchor` | Poppins 14/500 `#505352` | Plex Sans, secondary ink | ramp |
| Theme toggle | `#theme-preference-menu-trigger` | default | inherit ramp | ramp |
| Footer | `footer` | Poppins 16 | Plex Sans, hairline | ramp |

## Sidebar

| Element | Hook | Before | Target | Owner |
| --- | --- | --- | --- | --- |
| **Group label** | `#sidebar .sidebar-title` | Poppins 14/600, sentence case | **micro-label** | css |
| Item | `#sidebar .sidebar-group a` | Poppins 14/400 `#3E4140` | Plex Sans, secondary ink | ramp |
| Item, active | same, `aria-current` | primary at 10%, `#01654D` | unchanged, already derives | — |

The group label is the app's most recognisable device and the largest single
win available. It was proposed in the original audit, demonstrated in the
approved specimen, and never implemented.

## Content

| Element | Hook | Before | Target | Owner |
| --- | --- | --- | --- | --- |
| Eyebrow | `.eyebrow` | Poppins 14/600 `#01654D` | **micro-label** | css |
| h1 | `#content-area h1` | Poppins 36/600, `-0.9px` | ink `#101727` | ramp |
| h2–h4 | `#content-area h2…h4` | Poppins, default tracking | 600, `-0.02em` | css |
| Body | `#content-area p, li` | Poppins 18/28 `#3E4140` | Plex Sans 16/1.65 | css |
| Inline code | `#content-area code` | paperMono 12.25, **`#1E40AF`** | Plex Mono, palette ink | css |
| Code block | `#content-area pre` | paperMono 12, github-light | Plex Mono, warm syntax | config + css |
| Card | `.card` | r16, cold border, no shadow | r10, `#E2DCC9`, warm shadow | css |
| Table header | `table th` | Poppins 14/600, **oklch cold** | micro-label on `#F0ECDF` | css |
| Table cell | `table td` | Poppins 14/400 | Plex Sans 13 | css |
| Field name | `details td:first-child` | plain text | Plex Mono 500 | css |
| Accordion | `details.accordion` | r12 | `--accordion-*` tokens | css |
| Accordion title | `[data-component-part="accordion-title"]` | Poppins 16/500 | ink | ramp |
| Callout ×5 | `.callout[class*="bg-…"]` | Tailwind scales, r16 | app feedback palette | css |
| Pagination | `[data-component-part="pagination-title"]` | Poppins 14/600 | Plex Sans | ramp |
| Feedback | `.feedback-toolbar` | present | inherit ramp | ramp |

Callout variants map to Tailwind scales, not to component names: `<Info>`
renders on `neutral`, `<Note>` on `blue`, `<Tip>` on `green`, `<Warning>` on
`yellow`, `<Danger>` on `red`. Selectors key on the scale, not the component.

## API reference

| Element | Hook | Before | Target | Owner |
| --- | --- | --- | --- | --- |
| Method badge | `span` with method text | Poppins 8.8/700, `#2AB673`, `#15803D` | `#01654D` family | css |
| Parameter name | `[class*="param"]` | paperMono 12 `#57534E` | Plex Mono | css |

## Not reachable

| Thing | Why |
| --- | --- |
| API tab description | v2 navigation has no `description` on a tab. ~1,500 characters of intro, auth and a curl example are already absent from production. Restoring it means making it a page. |
| Permit tag chips | No content home. Tags appear only as JSON literals inside code spans. |
| Sidebar icon metaphors | `icons.library` picks one library; the mixed metaphors are per-item choices in the navigation. |

## Defects found while measuring

Neither is a design problem, both are user-visible.

**Monetary ranges parse as LaTeX.** On the API data dictionary, `"$1M-$5M"`
renders as `”1M−1M-1M−5M”` — the dollar signs open and close a math span and
the text is destroyed. `styling.latex` is `false` in the production config and
the KaTeX span renders anyway. Fixed by escaping the dollar signs in the MDX.

**Dictionary tables clip at five columns.** Pre-existing, and a content
decision rather than a theming one.
