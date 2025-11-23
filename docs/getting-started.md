# Getting Started

This guide will help you set up the project locally for development.

## Prerequisites

### Installing Bun

This project uses [Bun](https://bun.sh) as its JavaScript runtime and package manager.

**Why Bun?**

- **Speed**: Bun is significantly faster than npm/yarn for installing dependencies and running scripts
- **All-in-one**: Combines package manager, bundler, test runner, and runtime in one tool
- **Drop-in replacement**: Compatible with Node.js and npm packages
- **Built-in TypeScript**: Native TypeScript support without extra configuration

**Installation:**

macOS/Linux:

```bash
curl -fsSL https://bun.sh/install | bash
```

Windows:

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verify installation:

```bash
bun --version
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd dockit
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Install commitlint config:**
   ```bash
   bun add -d @commitlint/config-conventional
   ```

## Development

Start the development server:

```bash
bun run dev
```

The site will be available at `http://localhost:4321`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Git Workflow

This project uses Husky for Git hooks:

- **pre-commit**: Runs lint-staged to lint and format staged files
- **commit-msg**: Validates commit messages using commitlint

### Commit Message Format

Follow the conventional commits specification:

```
<type>(<scope>): <subject>

Examples:
- feat: add new search feature
- fix: resolve navigation bug
- docs: update getting started guide
- style: format code with prettier
- refactor: restructure component hierarchy
- chore: update dependencies
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
