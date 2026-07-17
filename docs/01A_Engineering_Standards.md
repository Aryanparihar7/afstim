# Engineering Standards
## Version 1.0

Status:
Draft

Depends On:

00_Product_Bible.md

01_Product_Requirements_Document.md

---

# Purpose

This document defines the engineering standards for ShipLab.

Every developer.

Every AI Coding Agent.

Every future contributor.

Must follow these standards.

The objective is consistency.

Not individual preference.

---

# Engineering Philosophy

The codebase should be:

Simple.

Readable.

Predictable.

Maintainable.

Scalable.

Every engineering decision should prioritize clarity over cleverness.

---

# AI Development Philosophy

AI is treated as a software engineer.

Not an architect.

Architecture decisions belong to approved documentation.

AI must never invent architecture.

AI only implements approved specifications.

---

# Golden Rule

Never write code before reading:

Product Bible

↓

Product Requirements Document

↓

Engineering Standards

↓

Current Module Specification

Only then should implementation begin.

---

# Folder Philosophy

Every folder should have one responsibility.

Folders should never become dumping grounds.

If a folder requires explanation,

its structure is probably incorrect.

---

# Separation of Concerns

Presentation

↓

Business Logic

↓

Data Access

↓

Infrastructure

No layer should directly bypass another.

---

# File Size

Target

Less than 300 lines.

Maximum

500 lines.

If exceeded,

consider splitting the file.

---

# Function Size

Target

20–40 lines.

Maximum

80 lines.

Large functions usually indicate multiple responsibilities.

---

# Naming Philosophy

Names should explain intent.

Avoid abbreviations.

Good

MissionProgressService

Bad

MPS

Good

CurrentJourneyController

Bad

CJCtrl

---

# Variables

Names should describe purpose.

Never use

data

temp

obj

abc

Whenever possible,

use meaningful names.

---

# Comments

Comments explain WHY.

Code explains HOW.

Avoid comments like

Increment i

Instead explain business reasoning.

---

# Magic Numbers

Never hardcode important values.

Move them into configuration.

Good

TRIAL_DAYS

Bad

7

---

# Configuration

Configuration should never be scattered.

Environment-specific values belong outside application logic.

---

# Error Handling

Every error should be:

Predictable

Actionable

Logged

Recoverable

Never expose internal system details to users.

---

# Logging

Log meaningful events.

Avoid excessive logging.

Never log:

Passwords

Secrets

Payment credentials

Sensitive personal information

---

# API Philosophy

APIs should be:

Simple

Predictable

Versioned

RESTful

Responses should follow one consistent structure.

---

# Database Philosophy

Business logic never belongs inside database queries.

Database stores information.

Application performs decisions.

---

# Business Logic

Business rules belong in dedicated services.

Never inside UI.

Never inside database models.

---

# Reusability

Duplicate code should be avoided.

Common behavior belongs in reusable modules.

---

# Dependencies

Minimize external dependencies.

Every dependency increases maintenance cost.

Add only when justified.

---

# Security

Never trust user input.

Validate every request.

Sanitize every input.

Authorize every protected action.

---

# Performance

Optimize for readability first.

Optimize performance only after measurement identifies a bottleneck.

Premature optimization is discouraged.

---

# Documentation

Every module requires:

Purpose

Inputs

Outputs

Dependencies

Known limitations

---

# Testing Philosophy

Critical business logic should be testable.

Every bug fixed should reduce the chance of recurrence.

---

# AI Coding Rules

AI must never:

Invent new product features.

Modify approved architecture.

Rename approved APIs.

Change database schema without documentation.

Ignore existing coding conventions.

AI should:

Follow documentation.

Reuse existing modules.

Prefer simple implementations.

Ask for clarification rather than guessing.

---

# Git Philosophy

Every commit represents one logical change.

Never combine unrelated work.

Commit history should tell the story of product development.

---

# Code Review Checklist

Before merging:

✓ Documentation updated.

✓ No duplicate code.

✓ Naming follows standards.

✓ Error handling implemented.

✓ Logging reviewed.

✓ Security considered.

✓ Tests executed.

✓ PRD requirements satisfied.

---

# Final Engineering Principle

Future developers should understand this codebase without needing the original authors.

Code should communicate intent.

Documentation should communicate decisions.

Architecture should communicate structure.