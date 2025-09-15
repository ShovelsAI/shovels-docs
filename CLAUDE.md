# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Shovels documentation repository, built with Mintlify. It contains public-facing product and API documentation for Shovels, a platform that provides building permit and contractor data through both an online interface and REST API.

## Development Commands

### Local Development
```bash
# Install Mintlify globally (requires Node.js v19+)
npm i -g mintlify

# Start local development server
mintlify dev

# Run on custom port
mintlify dev --port 3333
```

The local preview will be available at `http://localhost:3000`.

### Validation
```bash
# Check for broken links in documentation
mintlify broken-links
```

### Updates
```bash
# Update to latest Mintlify version
npm i -g mintlify@latest
```

## Architecture

### Project Structure
- `mint.json` - Main Mintlify configuration file defining site structure, navigation, theming, and API integration
- `docs/` - Contains all MDX documentation files organized by topic:
  - Introduction and quickstart guides
  - Tutorials for both Shovels Online and API
  - Data dictionaries and reference materials
  - Troubleshooting guides
  - Foundation concepts
- `assets/` - Images, logos, and static assets
- `release-notes/` - Version release documentation
- Root-level MDX files: `development.mdx`, `quickstart.mdx`

### Key Configuration Elements
- **API Integration**: Configured to pull OpenAPI spec from `https://api.shovels.ai/v2/openapi.production.yaml`
- **Theming**: Custom Shovels branding with green primary colors (#01654D) and Poppins font
- **Navigation**: Organized into logical groups (Tutorials, Troubleshooting, Platform Reference, etc.)
- **External Links**: Integrated with data dictionary spreadsheet, coverage dashboard, Discord community

### Content Types
1. **Product Documentation**: User guides for Shovels Online platform
2. **API Documentation**: REST API reference with interactive playground
3. **Tutorials**: Step-by-step guides for common use cases
4. **Data Dictionaries**: Field definitions and data structure references
5. **Troubleshooting**: FAQ and problem resolution guides
6. **Foundation Content**: Core concepts about permits and construction data

## Release Notes Process

### Structure
- All release notes are maintained in a single file: `release-notes/release-notes.mdx`
- Uses Mintlify's `<Update>` component with version label and date
- Each release contains separate `<Tab>` sections for different product areas:
  - **Online**: Shovels web platform updates
  - **API**: REST API changes and announcements
  - **EDL (Enterprise Data License)**: Enterprise data updates

### Release Note Format
```mdx
<Update label="V2.0.X" description="YYYY-MM-DD">
  <Tabs>
    <Tab title="Online">
      ### ✨ New
      - New features and additions

      ### 🚀 Upgrades
      - Improvements and enhancements

      ### 🐞 Bug Fixes
      - Fixed issues
    </Tab>
    <Tab title="API">
      ### ✨ New / ⚠️ Final Reminder / ‼️ Action Required
      - API-specific content, including breaking changes
    </Tab>
    <Tab title="EDL (Enterprise Data License)">
      ### ✨ New Permit Records / 🚀 Expanded Jurisdiction Coverage
      - Data updates and new coverage areas
    </Tab>
  </Tabs>
</Update>
```

### Adding New Releases
- New releases are added at the top of the file (newest first)
- Navigation is automatically handled by the single file reference in `mint.json`
- Use consistent emoji prefixes and section naming
- Include specific numbers and statistics when available (permit counts, new jurisdictions, etc.)

## File Naming Conventions
- Use kebab-case for MDX files (e.g., `shovels-api-introduction.mdx`)
- Prefix files by category when logical (e.g., `data-dictionary-*`, `tutorial-*`, `shovels-online-*`, `shovels-api-*`)

## Content Guidelines
- All content files use MDX format supporting Mintlify components
- Include proper frontmatter with title and description
- Use Mintlify-specific components like `<Info>`, `<CodeGroup>`, `<Frame>`, etc.
- API documentation automatically generated from OpenAPI spec