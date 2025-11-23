# Contributing to Studi

Thank you for your interest in contributing to Studi! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/studi.git`
3. Install dependencies: `bun install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

See [docs/getting-started.md](../docs/getting-started.md) for detailed setup instructions.

## How to Contribute

### Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) to report bugs. Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) to suggest new features. Explain:

- What problem it solves
- How it benefits the community
- Possible implementation approach

### Adding Content

Use the [Content Request template](.github/ISSUE_TEMPLATE/content_request.md) or submit a PR directly with:

- Well-structured markdown files
- Proper categorization
- Clear and accurate information
- Proper attribution if using external resources

## Development Workflow

### 1. Code Style

- Follow the existing code style
- Use ESLint and Prettier: `bun run lint` and `bun run format`
- Write clear, descriptive commit messages

### 2. Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

Examples:

- `feat: add physics notes for chapter 5`
- `fix: resolve broken navigation links`
- `docs: update contributing guidelines`
- `style: improve mobile responsiveness`

### 3. Testing

Before submitting a PR:

- [ ] Test locally: `bun run dev`
- [ ] Run linter: `bun run lint`
- [ ] Run formatter: `bun run format`
- [ ] Build successfully: `bun run build`
- [ ] Test on different browsers
- [ ] Verify responsive design (if UI changes)

### 4. Pull Requests

1. Update your branch with the latest main: `git pull origin main`
2. Push your changes: `git push origin feature/your-feature-name`
3. Open a Pull Request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)
4. Fill out all relevant sections of the template
5. Link related issues
6. Request review from maintainers

## Code Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

## Content Guidelines

### Adding Academic Notes

- Use clear, concise language
- Include examples where helpful
- Organize content logically
- Add proper metadata (subject, topic, level)
- Credit original sources

### File Naming

- Use kebab-case: `example-file-name.md`
- Be descriptive but concise
- Group related files in appropriate directories

### Markdown Style

- Use proper heading hierarchy (H1 → H2 → H3)
- Include code fences for code blocks with language specification
- Add alt text to images
- Use relative links for internal navigation

## Community

- Be respectful and inclusive
- Help others in discussions
- Share knowledge and resources
- Follow the code of conduct

## Questions?

If you have questions, feel free to:

- Open a discussion on GitHub
- Ask in existing issues
- Reach out to maintainers

Thank you for contributing to the DOST-SA-USC community! 🎓
