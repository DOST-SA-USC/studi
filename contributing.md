# Contributing Guidelines

Thanks for your interest in contributing! 🎉 This document outlines the workflow and standards we follow to keep the project clean, consistent, and easy to maintain. Please read through before making changes.

---

## 🛠 Development Workflow

1. **Fork & Clone**
   - Fork the repository to your own GitHub account.
   - Clone your fork locally:
     ```sh
     git clone https://github.com/DOST-SA-USC/studi.git
     cd studi
     bun install
     ```

2. **Create a Branch**
   - Always branch off `main`.
   - Use descriptive names:
     ```
     feature/add-login
     fix/navbar-bug
     docs/update-readme
     ```

3. **Make Changes**
   - Follow our coding standards (see below).
   - Run checks locally before committing:
     ```sh
     bun run lint
     bun run typecheck
     bun run test
     ```

4. **Commit Messages**
   - We follow [Conventional Commits](https://www.conventionalcommits.org/):
     ```
     feat: add login form
     fix: correct navbar alignment on mobile
     docs: update installation steps in README
     style: reformat code with Prettier
     refactor: simplify auth middleware
     perf: improve image loading speed
     test: add unit test for user service
     chore: update dependencies
     ```

5. **Push & Open a Pull Request**
   - Push your branch to your fork.
   - Open a Pull Request (PR) against the `main` branch of this repo.
   - Ensure CI checks pass (lint, typecheck, tests).
   - Request at least **one reviewer** from the team.

---

## 🎨 Coding Standards

- **Formatting**: Automatically handled by Prettier.
- **Linting**: ESLint is enforced — fix all warnings and errors.
- **Type Safety**: TypeScript must pass without errors.

---

## ✅ Pull Request Checklist

Before submitting your PR:

- [ ] My branch is up to date with `main`.
- [ ] My code passes `bun run lint`.
- [ ] My code passes `bun run typecheck`.
- [ ] My tests pass with `bun run test`.
- [ ] I updated documentation (if applicable).
- [ ] I used a valid commit message format.

---

## 🔒 Branch Protection

- All changes must go through Pull Requests.
- CI checks must pass before merging.

---

## 💬 Questions?

If you’re unsure about anything, feel free to open an issue or start a discussion. We’d rather answer a “silly” question early than fix a big problem later. 🚀
