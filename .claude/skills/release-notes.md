# Release Notes Skill

Automates the monthly release notes publishing process for Shovels documentation.

## Usage

Invoke with `/release-notes` to start the release notes workflow.

## What This Skill Does

1. **Calculates version and date:**
   - Reads the latest release version from `release-notes/release-notes.mdx`
   - Increments the patch number (e.g., V2.1.5 → V2.1.6)
   - Uses current date in YYYY-MM-DD format

2. **Prompts for content:**
   - Asks user to paste the release notes email content

3. **Parses and formats:**
   - Extracts sections from the email content
   - Organizes content into three tabs (Online, API, EDL)
   - Applies bold-numbers-only formatting convention
   - Adds proper Mintlify MDX structure

4. **Inserts release:**
   - Adds new release at the top of the file
   - Maintains existing releases

## Instructions

When this skill is invoked:

1. **Check git status and create branch:**
   - Run `git status` to verify repository state
   - Determine the current month and year for branch name
   - Create branch name format: `{month}-{year}-release-notes` (e.g., "march-2026-release-notes")
   - Create and checkout the new branch: `git checkout -b {branch-name}`

2. **Read the current release notes file:**
   ```
   Read /Users/morganfriberg/Documents/GitHub/shovels-docs/release-notes/release-notes.mdx
   ```

3. **Determine next version:**
   - Extract the latest version label (e.g., "V2.1.5")
   - Increment the patch number to get the next version (e.g., "V2.1.6")
   - Get current date in YYYY-MM-DD format

4. **Ask the user to provide the email content:**
   ```
   Please paste the release notes email content below:
   ```

5. **Parse the email content:**
   - Identify main sections (new features, Permits Dataset, Geocoding, API Enhancements, etc.)
   - Extract metrics and numbers
   - Organize by appropriate tab

6. **Format according to conventions:**
   - **Bold numbers only, not entire lines**
   - Use consistent section headers with emojis
   - Structure into three tabs:
     - **Online:** New features + Permits + Geocoding
     - **API:** New features + API Enhancements + Permits + Geocoding + No breaking changes note
     - **EDL:** Permits + Geocoding

7. **Apply MDX structure:**
   ```mdx
   <Update label="V2.1.X" description="YYYY-MM-DD">
     <Tabs>
       <Tab title="Online">
         ### Introduction
         [Introduction paragraph]

         ### ✨ New
         [New features]

         ### 🏗️ Permits Dataset
         [Permits content]

         ### 📍 Geocoding Improvements
         [Geocoding content]
       </Tab>
       <Tab title="API">
         [Same structure with API-specific sections]

         <Info>
           ✅ **No breaking changes.** All existing integrations continue to work unchanged.
         </Info>
       </Tab>
       <Tab title="EDL (Enterprise Data License)">
         [Same structure with EDL-specific sections]
       </Tab>
     </Tabs>
   </Update>
   ```

8. **Insert at the top of the file:**
   - Place the new release immediately after the frontmatter and before the previous V2.1.X release
   - Preserve all existing releases

9. **Start local preview (optional):**
   - Ask user if they want to preview locally with `mintlify dev`
   - If yes, start the dev server in background

10. **Commit the changes:**
    - After user confirms the changes look good, offer to commit
    - Suggested commit message format:
      ```
      Add [Month] [Year] release notes

      Release V2.1.X with [brief summary of major updates].

      Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
      ```
    - Stage only the release-notes.mdx file
    - Create the commit

## Formatting Rules

### Bold Numbers Only
- ✅ `Permits filed in February 2026: **156K**`
- ❌ `**Permits filed in February 2026:** **156K**`

### Section Headers
- `### 🏗️ Permits Dataset`
- `### 📍 Geocoding Improvements`
- `### ⚡ API Enhancements`
- `### ✨ New`

### Subsection Titles
- `**New Permits Discovered**`
- `**Additional Permits Geocoded**`

### Common Patterns
- Permit counts: `Permits filed in February 2026: **156K**`
- Category growth: `Electrical Permits: **+388K** - Largest category growth this release`
- Record counts: `**1.8M** Records`

## Example Output Structure

See `release-notes/release-notes.mdx` for examples of properly formatted releases.
