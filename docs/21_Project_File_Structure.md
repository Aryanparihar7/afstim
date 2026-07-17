# 21_Project_File_Structure.md

# Project File Structure

## Version 1.0

**Status:** Draft

**Project:** Afstim

---

# Purpose

This document defines the directory structure, naming conventions and organizational rules for the Afstim codebase.

A predictable project structure improves:

* Maintainability
* AI-assisted development
* Scalability
* Developer onboarding
* Code discoverability

Every file should have one obvious location.

---

# Project Philosophy

Organize the project by **feature**, not by file type.

Each feature owns its:

* UI
* API
* Business Logic
* Types
* Validation
* Tests

The project should read like the product itself.

---

# High-Level Repository Structure

```text
afstim/

├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # FastAPI backend
│
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── config/              # Shared configuration
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Shared utilities
│
├── docs/                    # Product & engineering documents
│
├── scripts/                 # Automation scripts
│
└── .github/                 # CI/CD workflows
```

This monorepo structure keeps the frontend, backend, shared packages and documentation together while remaining modular.

---

# Frontend Structure (apps/web)

```text
app/

features/

components/

lib/

styles/

public/
```

The `app/` directory contains route definitions.

The `features/` directory contains the product's business features.

---

# Feature Organization

Each feature should follow the same structure.

Example:

```text
features/

authentication/

dashboard/

journeys/

missions/

workspace/

billing/

feedback/

admin/
```

Every feature remains independent.

---

# Internal Feature Layout

Example:

```text
missions/

components/

hooks/

services/

api/

types/

validators/

tests/

constants/
```

This structure keeps all mission-related code together.

---

# Shared Components

Only components reused across multiple features belong in:

```text
packages/ui/
```

Examples:

Button

Input

Card

Modal

Dialog

Badge

Tabs

Avoid placing feature-specific components here.

---

# Backend Structure (apps/api)

```text
app/

core/

modules/

services/

middleware/

database/

tests/
```

The backend follows the same feature-first philosophy.

---

# Backend Modules

Examples:

```text
modules/

authentication/

users/

journeys/

missions/

workspace/

billing/

feedback/

notifications/

admin/
```

Each backend module owns:

Routes

Services

Schemas

Models

Repositories

Tests

---

# Database

Database-related files belong in:

```text
database/

migrations/

seeds/

schemas/
```

Schema changes must use migrations.

---

# API Organization

Every module owns its API.

Example:

```text
missions/

routes.py

service.py

schemas.py

repository.py

validators.py
```

Avoid large global API files.

---

# AI Module

The AI system remains isolated.

Example:

```text
modules/ai/

router/

context/

providers/

prompts/

responses/

tests/
```

Provider-specific implementations must never leak outside this module.

---

# Naming Conventions

Folders:

lowercase

singular or plural used consistently.

Files:

descriptive

lowercase_with_underscores (Python)

kebab-case or PascalCase where appropriate (Next.js/React conventions).

Components:

PascalCase

Functions:

camelCase (TypeScript)

snake_case (Python where idiomatic)

---

# Import Rules

Prefer feature-local imports.

Avoid deep relative imports.

Shared functionality should come from shared packages rather than duplicating code.

---

# Environment Files

Configuration belongs in environment variables.

Never commit secrets.

Provide an example environment file for local development.

---

# Static Assets

Store images, icons and fonts in dedicated asset directories.

Avoid scattering assets throughout feature folders unless tightly coupled to that feature.

---

# Tests

Tests should live close to the code they validate.

Each feature owns its own tests.

Shared testing utilities may exist in a common package.

---

# Documentation

All documentation belongs under:

```text
docs/
```

Suggested structure:

```text
docs/

product/

engineering/

architecture/

adr/

playbooks/
```

Architecture Decision Records (ADRs) should be stored in:

```text
docs/adr/
```

---

# Scripts

Automation belongs in:

```text
scripts/
```

Examples:

Database reset

Seed data

Deployment helpers

Maintenance tasks

Avoid placing scripts inside application code.

---

# CI/CD

GitHub workflows belong in:

```text
.github/workflows/
```

Automated checks should include:

Linting

Tests

Build verification

Deployment (where applicable)

---

# Project Rules

* One responsibility per module.
* One clear location for every file.
* Avoid duplicate utilities.
* Prefer composition over shared global state.
* Keep dependencies between features minimal.

---

# Refactoring Rules

Refactor only when:

* It improves clarity.
* It supports the current task.
* Existing behavior remains unchanged.
* Tests continue to pass.

Large structural refactors require explicit approval.

---

# Design Decisions

* Monorepo architecture.
* Feature-first organization.
* Modular backend.
* Shared UI package.
* Localized testing.
* Documentation stored with the repository.

---

# Known Risks

* Feature boundaries becoming unclear.
* Excessive shared utilities.
* Circular dependencies.
* Inconsistent naming.

These risks should be reviewed during code reviews.

---

# Future Evolution

The structure should evolve only when it clearly improves maintainability.

New modules should follow the same organizational principles.

---
