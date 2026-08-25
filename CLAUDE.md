# Documentation Repository Standards

Standards and conventions for `shovels-docs`, the public-facing Shovels documentation site.

This is a **Mintlify documentation site**. It contains MDX content, `docs.json` configuration,
and static assets. There is no application code here: no Python, no test suite, no build
pipeline beyond Mintlify itself.

---

## Working Relationship

We're colleagues working together - no formal hierarchy.

**Core principles:**
- If you lie to me, I'll find a new partner
- YOU MUST speak up immediately when you don't know something or we're in over our heads
- When you disagree with my approach, YOU MUST push back, citing specific technical reasons if you have them. If it's just a gut feeling, say so. If you're uncomfortable pushing back out loud, just say "I have a bad feeling about this". I'll know what you mean
- YOU MUST call out bad ideas, unreasonable expectations, and mistakes - I depend on this
- NEVER be agreeable just to be nice - I need your honest technical judgment
- NEVER utter the phrase "You're absolutely right!" You are not a sycophant. We're working together because I value your opinion
- YOU MUST ALWAYS ask for clarification rather than making assumptions
- If you're having trouble, YOU MUST STOP and ask for help, especially for tasks where human input would be valuable
- You have issues with memory formation both during and between conversations. Use your journal to record important facts and insights, as well as things you want to remember before you forget them
- You search your journal when you're trying to remember or figure stuff out

**Rule #1**: If you want exception to ANY rule, YOU MUST STOP and get explicit permission from the user first. BREAKING THE LETTER OR SPIRIT OF THE RULES IS FAILURE.

---

## Generated Content: The API Reference Is Not In This Repo

**Before searching this repository for API documentation, read this.**

The entire **API Reference** tab of the docs site is generated at build time from the Shovels
OpenAPI specification. It is configured in `docs.json`:

```json
"openapi": {
  "source": "https://api.shovels.ai/spec/v2/openapi.production.yaml",
  "directory": "api-reference"
}
```

**No file in this repository backs those pages.** A grep for an endpoint path, a field name, a
parameter default, or a response schema will return zero results even when the published docs
plainly show it.

**An empty grep result here does not mean the content is undocumented.** It usually means the
content is in the spec.

### What this means for a task

- Asked to change an endpoint's parameters, defaults, types, descriptions, or response schema?
  That is a **spec change on the API side**, not a change to this repo. Say so and stop rather
  than editing prose pages that merely mention the field.
- Asked to change a quickstart, tutorial, data dictionary, FAQ, troubleshooting, or release note?
  That is hand-written MDX under `docs/` or `release-notes/` and is editable here.
- A task may be **partly** each. Fix the hand-written pages, and report the spec portion as
  out-of-scope for this repo instead of silently leaving it undone.

### Verify before concluding

To confirm whether something is spec-owned, fetch the spec directly rather than inferring from an
empty grep:

```bash
curl -s https://api.shovels.ai/spec/v2/openapi.production.yaml | grep -n "field_name"
```

---

## Local Preview and Validation

This repository has **no unit tests**. Do not look for a test suite, and do not stop to ask
which tests to run — there are none. Validation is the two commands below.

```bash
# Local preview at http://localhost:3000
mint dev

# On a custom port
mint dev --port 3333

# Link validation
mint broken-links
```

**Before committing, run `mint broken-links`.**

Interpreting its output requires care:

- Links under `/api-reference/*` are reported as broken but are **false positives**. Those pages
  are generated remotely, so the validator cannot resolve them. Ignore them.
- The baseline on a clean `main` is **66 flagged links**, of which exactly one is genuine:
  `/foundations-permit-availability` (tracked separately).
- What matters is **the count relative to the baseline, not zero.** If your branch reports more
  than `main` does, you introduced a broken link. Run the command on `main` to compare rather
  than assuming.

**Verify rendered output, not just the build.** A page can build cleanly, return HTTP 200, and
still be wrong — navigation in particular. Changes to `docs.json` navigation, Mintlify
components, or anything under the API Reference tab must be checked in a running `mint dev`
preview by actually looking at the page. Programmatic checks alone are not sufficient evidence.

---

## Content Standards

**Scope discipline:**
- Make the SMALLEST reasonable change that achieves the outcome
- YOU MUST NEVER make content changes unrelated to your current task. If you notice something
  that should be fixed but is unrelated, raise it rather than fixing it silently
- YOU MUST MATCH the voice, structure, and formatting of surrounding pages. Consistency within
  the docs trumps external style guides
- YOU MUST NOT change whitespace that does not affect rendered output

**Atomic changes:**
- Break work into small, self-contained steps, each wrapped in its own commit
- Keep git history bisectable

**Writing:**
- Every page needs frontmatter with `title`; add `description` for anything a reader may land on
  from search
- Use Mintlify components (`<Info>`, `<Note>`, `<Warning>`, `<Tabs>`, `<CodeGroup>`, `<Frame>`,
  `<Update>`) rather than hand-rolled markdown equivalents
- Write evergreen content. NEVER reference what a page used to say, or describe something as
  "new", "improved", or "enhanced" — what is new today is stale in six months
- Prefer explaining WHY over restating WHAT the interface already shows

**File naming:**
- kebab-case for MDX files, e.g. `shovels-api-introduction.mdx`
- Prefix by category where it helps: `data-dictionary-*`, `tutorial-*`, `shovels-online-*`,
  `shovels-api-*`

**Links:**
- Internal links are root-relative and omit the extension, e.g. `/docs/shovels-faq`
- Contact links use `support@shovels.ai` and `sales@shovels.ai` — note the `.ai` domain

---

## Version Control & Git

**Commit frequency:**
- YOU MUST commit frequently throughout the process, even if the high-level task is not done

**Pre-commit hooks:**
- NEVER SKIP OR EVADE OR DISABLE A PRE-COMMIT HOOK

**Staging changes:**
- NEVER use `git add -A` unless you've just run `git status` — you don't want to commit stray
  scratch files

**Temporal context:**
- YOU MUST NEVER leave temporal context in a commit message (like "recently refactored",
  "moved"). The body describes the repository as it is
- If you name something "new" or "enhanced" or "improved", you've probably made a mistake and
  MUST STOP and ask

---

## Commit Message Guidelines

Follow these rules for great Git commit messages:

### Format Rules

1. **Separate subject from body** with a blank line
2. **Limit subject line to 50 characters** - forces concise, thoughtful descriptions
3. **Capitalize the subject line** - begin with capital letter
4. **No period at end** of subject line - saves space
5. **Use imperative mood** in subject line - write as command ("Add feature" not "Added feature")
6. **Wrap body at 72 characters** - ensures readability across tools
7. **Explain what and why, not how** - focus on reasons for change and problem solved

### Content Rules

** NEVER include:**
- Process tracking: "Step 5", "Phase 2", "Task ABC-123"
- Ticket IDs: ENG-123, JIRA-456, issue #789, Linear references
- Metrics: "200 LOC", "95% coverage", "within target"
- Temporal context (past): "recently refactored", "previously moved", "used to be"
- Temporal context (future): "will fix later", "next step", "TODO", "this prepares for"
- Self-praise: "successfully", "perfect", "excellent"
- Irrelevant details: test counts, files changed, tool promotions
- Verbose bloat: Restating subject line, over-explaining obvious changes

** ALWAYS include:**
- Technical rationale (WHY architecturally)
- Timeless context (readable in 6 months without project docs)
- Tradeoffs (if accepting debt, explain)

### Examples

**Bad - Temporal context (future):**
```
Add an About page to the API Reference

Explains that the reference is generated from the spec.

Next step: add the same notice to the README.
```
**BAD** - "Next step" refers to future work - not evergreen

**Bad - Temporal context (past):**
```
Move the pagination guidance into the FAQ

This used to live in the API introduction but was recently
split out when we reorganized the troubleshooting pages.
```
**BAD** - "used to live", "recently" - refers to history

**Bad - Process tracking:**
```
Update knowledge base articles (Step 2, Phase 4.1 complete)

Files changed: 12, links checked: 66
```
**BAD** - "Step 2", "Phase 4.1", metrics

**Bad - Ticket references and verbose bloat:**
```
Correct the contact addresses in the FAQ

Replace the support and sales mailto links with the correct
domain.

This follows MAR-340 Goal #2 to clean up outbound links across
the documentation. All four links in the FAQ now point at the
right place instead of the old ones.
```
**BAD** - "MAR-340" ticket reference, verbose restatement of obvious

**Good - Evergreen, explains WHY:**
```
Publish an About page for the API Reference

The API Reference tab is generated from the OpenAPI
specification, but nothing on the rendered site said so.
Readers had no route for reporting an endpoint that
disagreed with the live API.
```
**GOOD** - Timeless context, explains the reason for the page

**Good - Concise context:**
```
Fix contact email domain in the FAQ

Four support and sales links pointed at shovels.com, which
does not resolve. Readers hitting those links got nothing.
```
**GOOD** - Clear WHY (dead links), no ticket refs, no bloat

**Key principles:**
- Subject line communicates the change clearly
- Body provides context and reasoning
- Focus on why the change was necessary
- Help future developers understand the decision
- Write as if describing the codebase NOW, not its history or future

---

## Repository Integration

**Project documentation:**
- YOU MUST read `README.md` for the project overview
- `docs.json` is the Mintlify configuration: navigation, theming, redirects, and the OpenAPI
  source. There is no `package.json` or `pyproject.toml` in this repo — Mintlify is installed
  globally via `npm i -g mintlify`

**Linear Issue Integration:**
- ALWAYS use Linear MCP to read Linear issues and get correct git branch names
- Use Linear MCP tools to fetch issue details before starting work
- Get the git branch name from the Linear issue to ensure automatic linking

---

## Release Notes Process

Monthly release notes are published to `release-notes/release-notes.mdx` following this workflow:

### File Structure
- Single file containing all releases in reverse chronological order (newest first)
- Each release uses Mintlify's `<Update>` component
- Version format: `V2.1.X` where X increments monthly
- Date format: `YYYY-MM-DD`

### Three-Tab Organization
Every release must have three tabs with consistent structure:

1. **Online Tab** - Shovels web platform updates
   - New features and product announcements
   - Permits dataset updates
   - Geocoding improvements
   - User-facing changes

2. **API Tab** - REST API changes
   - New endpoints and features
   - API enhancements and improvements
   - Permits dataset updates (same as Online)
   - Geocoding improvements (same as Online)
   - ALWAYS end with: `<Info>✅ **No breaking changes.** All existing integrations continue to work unchanged.</Info>` (unless there are breaking changes)

3. **EDL (Enterprise Data License) Tab** - Enterprise data updates
   - Permits dataset updates (same as Online/API)
   - Geocoding improvements (same as Online/API)
   - Data quality enhancements

### Formatting Conventions
**Bold numbers only, not entire lines:**
- ✅ CORRECT: `Permits filed in February 2026: **156K**`
- ❌ WRONG: `**Permits filed in February 2026:** **156K**`
- ✅ CORRECT: `Electrical Permits: **+388K**`
- ❌ WRONG: `**Electrical Permits:** **+388K**`
- ✅ CORRECT: `**1.8M** Records`
- ❌ WRONG: `**1.8M Records**`

**Section headers:**
- Use consistent emoji prefixes: `### 🏗️ Permits Dataset`, `### 📍 Geocoding Improvements`, `### ⚡ API Enhancements`
- Use `**Bold**` for subsection titles like `**New Permits Discovered**`

### Monthly Workflow
1. User receives release notes email from HubSpot (currently manual copy/paste)
2. Use `/release-notes` skill to automate the entire process
3. Skill automatically:
   - Creates a new branch (format: `{month}-{year}-release-notes`)
   - Calculates next version number (reads current and increments)
   - Prompts for email content
   - Parses content into appropriate tabs
   - Applies bold-numbers-only formatting
   - Inserts at top of file
   - Optionally starts local preview
   - Commits changes with proper message

### Version Numbering
- Read the latest release version from the file
- Increment the patch number (e.g., V2.1.5 → V2.1.6)
- Use current date in YYYY-MM-DD format

---
