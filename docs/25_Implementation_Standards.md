# 25 — Implementation Standards

Version: 1.0

Status: Approved Architecture

Depends On

- 21_Project_File_Structure.md
- 22_Design_Language.md
- 23_Authentication_Blueprint.md
- 24_Authentication_Architecture_Audit.md

Applies To

All future implementation sprints.

---

# Goal

Define a single implementation standard for the entire Afstim codebase.

This document establishes the engineering rules that every module must follow during implementation.

No sprint may override these standards unless an Architecture Decision Record (ADR) explicitly approves the change.

---

# Engineering Philosophy

Code should be

- readable
- predictable
- testable
- scalable
- maintainable
- secure

Consistency is preferred over cleverness.

Architecture always takes precedence over implementation speed.

---

# Implementation Pipeline

Every feature follows the same lifecycle.

Architecture

↓

Implementation Plan

↓

Approval

↓

Production Implementation

↓

Walkthrough

↓

Verification

↓

Audit

↓

Commit

No production implementation begins before architecture approval.

---

# Layered Architecture

Every feature follows the same structure.

UI

↓

Route Handler

↓

Service

↓

Repository

↓

Database

Responsibilities must never leak across layers.

---

# Layer Responsibilities

## UI

Responsible for

- rendering
- user interaction
- accessibility

Must never

- access Prisma
- contain business rules

---

## Route Handlers

Responsible for

- request parsing
- response formatting
- service delegation

Must remain thin.

---

## Services

Responsible for

- business rules
- orchestration
- workflows

Must never

- render UI
- access React
- know HTTP details

---

## Repositories

Responsible only for

- database communication

Repositories own every Prisma query.

Business logic is forbidden.

---

## Database

Stores data only.

No application rules belong here.

---

# DTO Rule

Every API response must pass through a DTO.

Flow

Database

↓

Repository

↓

Service

↓

Mapper

↓

DTO

↓

API

Database entities must never leave the backend.

---

# Validation Rule

Validation must exist exactly once.

Validation belongs in dedicated validators.

Never duplicate validation logic.

The server remains authoritative.

---

# Error Handling

Every module must define

- custom error types
- user-safe messages
- internal logging

Never expose

- stack traces
- database errors
- implementation details

---

# Logging

Log

- important events
- failures
- security events

Never log

- passwords
- tokens
- cookies
- secrets
- personally sensitive information

---

# Naming Conventions

Files

kebab-case

Examples

user-profile.ts

session-service.ts

password-reset.ts

---

Components

PascalCase

Example

ProfileCard.tsx

---

Hooks

useCamelCase

Example

useSession()

---

Constants

UPPER_SNAKE_CASE

Example

MAX_LOGIN_ATTEMPTS

---

Variables

camelCase

---

Types

PascalCase

---

Interfaces

PascalCase

Do not prefix with "I".

---

Enums

PascalCase

Members use PascalCase.

---

# Folder Structure

Every feature follows

feature/

components/

services/

repositories/

validators/

types/

constants/

errors/

mappers/

dto/

tests/

No feature should invent its own layout.

---

# Component Rules

Components should

- have one responsibility
- receive explicit props
- avoid hidden dependencies

Prefer composition over inheritance.

---

# Server Components

Server Components are the default.

Use Client Components only when required for

- state
- effects
- browser APIs
- animation
- user interaction

Avoid unnecessary `"use client"`.

---

# Styling Rules

Use

- Design Tokens
- Tailwind utilities
- semantic classes

Avoid

- hardcoded colors
- arbitrary spacing
- inline styles

Design Tokens → Theme → Components

---

# Accessibility

Every feature must support

- keyboard navigation
- visible focus states
- semantic HTML
- ARIA where appropriate
- sufficient contrast

Accessibility is mandatory.

---

# Security

Every implementation must

- validate input
- sanitize output where needed
- trust server state
- follow least privilege

Security checks belong on the server.

---

# Testing Standards

Every module should include

Unit Tests

↓

Integration Tests

↓

End-to-End Tests

Manual QA follows automated testing.

---

# Performance

Prefer

- server rendering
- lazy loading
- efficient queries
- memoization only when justified

Avoid premature optimization.

Measure before optimizing.

---

# Documentation

Every sprint must produce

- Implementation Plan
- Walkthrough
- Verification
- Modified File List

Architecture changes require documentation updates.

---

# Code Review Checklist

Before merging, verify

✓ Architecture respected

✓ Single Responsibility maintained

✓ Repository isolation

✓ Service isolation

✓ DTO usage

✓ Validation centralized

✓ No duplicated logic

✓ Accessible UI

✓ Security rules followed

✓ TypeScript passes

✓ ESLint passes

✓ Tests pass

✓ Documentation updated

---

# Definition of Done

A feature is complete only when

- Architecture is approved
- Production code is implemented
- Tests pass
- Verification succeeds
- Documentation is updated
- Audit passes

---

# Change Management

Any change affecting

- architecture
- folder structure
- design language
- implementation standards

must be reviewed before implementation.

Major architectural changes should be documented through an Architecture Decision Record (ADR).

---

# Scope

These standards apply to

- Landing Website
- Authentication
- Dashboard
- Learning Engine
- Projects
- Deployments
- AI Mentor
- Resume Builder
- Portfolio
- Billing
- Admin
- Documentation
- Future modules

This document is the authoritative implementation standard for the Afstim codebase.