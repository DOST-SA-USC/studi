# About Studi

Studi is a directory of all resources and academic notes for the DOST-SA-USC community.

## Project Overview

This project serves as a centralized knowledge base for the DOST Scholars Association at USC, providing a platform to share academic resources, notes, and documentation.

Currently, the site is based on the [Dockit](https://github.com/themefisher/dockit-astro) template, which provides a modern foundation for building documentation sites. The template offers multi-language support, theming, and advanced navigation features that will be utilized as the content grows.

**Built With:**

- [Astro](https://astro.build) - Static site generator
- [Starlight](https://starlight.astro.build) - Documentation theme for Astro
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Bun](https://bun.sh) - JavaScript runtime and package manager

## File Structure

```
dockit/
├── docs/                      # Project documentation
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images and media files
│   ├── components/           # Astro components
│   │   ├── override-components/  # Starlight component overrides
│   │   └── user-components/      # Custom components
│   ├── config/               # Configuration files
│   │   ├── config.json      # Site configuration
│   │   ├── locals.json      # Localization settings
│   │   ├── menu.*.json      # Navigation menus (per language)
│   │   ├── sidebar.json     # Sidebar configuration
│   │   ├── social.json      # Social media links
│   │   └── theme.json       # Theme customization
│   ├── content/              # Markdown content
│   │   ├── docs/            # Documentation pages
│   │   │   ├── en/          # English content
│   │   │   ├── fr/          # French content
│   │   │   └── ...
│   │   ├── i18n/            # Internationalization strings
│   │   └── sections/        # Reusable content sections
│   ├── lib/                  # Utility functions
│   ├── styles/              # Global styles
│   └── tailwind-plugin/     # Custom Tailwind plugins
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
└── commitlint.config.cjs    # Commit message linting
```

## Key Features

### Multi-language Support

- Built-in i18n with English and French translations
- Easy to add more languages via config files
- Per-language menu and sidebar configurations

### Customization

- Theme colors and fonts via `src/config/theme.json`
- Component overrides for Starlight defaults
- Custom Tailwind plugins for Bootstrap-style grid and theming

### Content Management

- Markdown-based content in `src/content/docs/`
- Organized by language and category
- Support for MDX for component usage in content

### Developer Experience

- Fast development with Bun and Astro
- Hot module replacement
- Type-safe with TypeScript
- Code quality enforced with ESLint and Prettier
- Git hooks with Husky for automated checks

## Configuration Files

- **`src/config/config.json`** - Site metadata, SEO settings
- **`src/config/theme.json`** - Colors, fonts, and visual theming
- **`src/config/menu.*.json`** - Top navigation menu per language
- **`src/config/sidebar.json`** - Sidebar navigation structure
- **`src/config/social.json`** - Social media links and icons

## About the Template

This project uses the [Dockit Astro template](https://github.com/themefisher/dockit-astro) by Themefisher as its base. Dockit provides a solid foundation with modern web technologies including Astro, Starlight, and Tailwind CSS.

As the project evolves, content and features will be customized specifically for the DOST-SA-USC community's needs.
