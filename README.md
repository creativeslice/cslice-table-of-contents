# Table of Contents Block

A WordPress block plugin by Creative Slice that adds a dynamic table of contents block, automatically generating navigation from page headings.

## Features

- Automatically generates navigation from page headings
- Tracks scroll position and highlights active section
- Two display styles:
  - Default vertical list
  - Horizontal scrolling navigation
- Full block editor customization:
  - Typography settings with font size and weight controls
  - Background color with opacity support
  - Border controls (color, width, style, radius)
  - Box shadow
  - Spacing (margin and padding)
  - Wide and full width alignment
- Blur effect for semi-transparent backgrounds if white background is used
- No JavaScript overhead on pages without TOC
- Clean, efficient vanilla JS scroll tracking

## Requirements

- WordPress 6.7 or later
- PHP 8.0 or later
- Node.js 20+ for development

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

4. Create plugin zip:
```bash
npm run plugin-zip
```
