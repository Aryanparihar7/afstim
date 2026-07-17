# 20_AI_Development_Playbook.md

# AI Development Playbook

## Version 1.0

**Status:** Draft

**Project:** Afstim

---

# Purpose

This document defines how AI coding agents must develop Afstim.

It is the operational handbook for all AI-assisted software development.

Every AI agent contributing to Afstim must follow this playbook before writing or modifying code.

The goal is to ensure that independently generated code behaves as if it were written by a single experienced engineering team.

---

# Core Philosophy

AI is a software engineer.

Not a code generator.

Every implementation decision should prioritize:

* Maintainability
* Readability
* Simplicity
* Modularity
* Consistency

Speed is important, but never at the cost of long-term quality.

---

# Source of Truth

Before beginning any task, the AI must treat the documentation repository as the source of truth.

If implementation conflicts with documentation:

Documentation wins.

The AI should never invent product behavior that has not been documented.

---

# Mandatory Reading Order

Before starting work, the AI should review the relevant documents in this order:

1. Product Bible
2. Product Requirements Document
3. Engineering Standards
4. Information Architecture
5. Navigation Flow
6. Wireframe Specification
7. Design System
8. Relevant Architecture Document
9. Current Module Specification

The AI should not read unrelated documents unless required.

---

# Development Workflow

Every task follows the same workflow.

Understand

↓

Plan

↓

Implement

↓

Test

↓

Review

↓

Integrate

↓

Document

Skipping steps is not permitted.

---

# Module-First Development

Afstim is built module by module.

Examples:

Authentication

Dashboard

Journey Engine

Mission Engine

Workspace

AI Mentor

Billing

Admin Dashboard

The AI should never attempt to build multiple unrelated modules simultaneously.

---

# Vertical Slice Rule

Every completed module must include:

Frontend

Backend

API

Database integration (if applicable)

Testing

Documentation updates

A feature is complete only when it works end-to-end.

---

# Planning Before Coding

Before writing code, the AI should produce:

* Objective
* Scope
* Dependencies
* Risks
* Files affected
* Testing approach

Implementation begins only after the plan is internally validated.

---

# Engineering Rules

The AI must:

Write small, focused components.

Separate business logic from presentation.

Avoid duplicate code.

Prefer composition over inheritance.

Keep functions focused on one responsibility.

Avoid unnecessary abstractions.

---

# Frontend Standards

Use:

Next.js

React

TypeScript

Tailwind CSS

shadcn/ui

UI should follow the Design System exactly.

Business logic must not live inside React components.

---

# Backend Standards

Use:

FastAPI

Python

REST APIs

Service-layer architecture

Database access should remain isolated from business logic.

---

# Database Rules

Use PostgreSQL.

Every schema change must use migrations.

Relationships should remain explicit.

Avoid premature optimization.

---

# API Rules

All APIs must:

Be versioned.

Validate input.

Return consistent responses.

Handle errors predictably.

Follow REST conventions.

---

# AI Integration Rules

The AI Mentor is event-driven.

The AI should never implement continuous code monitoring.

Every AI interaction passes through the internal AI Router.

Provider-specific logic must remain isolated.

---

# UI Rules

Every page should have:

One primary purpose.

One primary action.

Predictable navigation.

Consistent spacing.

Minimal visual noise.

Whitespace is intentional.

---

# Coding Style

Code should be:

Readable

Predictable

Self-documenting

Avoid clever solutions that reduce clarity.

Optimize for future maintainers.

---

# Error Handling

Every feature should fail gracefully.

Never expose internal implementation details.

Always provide a recovery path where practical.

---

# Testing Before Completion

Every completed task must verify:

* Expected behavior
* Edge cases
* Error handling
* Accessibility
* Regression impact

The AI should not declare a task complete without testing.

---

# Documentation Updates

If implementation changes architecture or behavior, the AI must identify the affected documentation.

Documentation and implementation should remain synchronized.

---

# Git Workflow

Every module should be developed in an isolated branch.

Suggested workflow:

Feature Branch

↓

Development

↓

Testing

↓

Review

↓

Merge

Avoid unrelated changes within the same branch.

---

# Refactoring Policy

The AI may improve existing code only when:

* The change is directly related to the assigned task.
* Behavior remains unchanged.
* Tests continue to pass.

Large-scale refactoring requires explicit approval.

---

# Scope Protection

The AI should not introduce new product features.

If a potentially valuable idea is identified:

Record it.

Do not implement it.

Version 1 remains protected from scope expansion.

---

# Third-Party Services

External services should remain behind internal abstraction layers.

Examples:

Authentication Service

Billing Service

AI Router

Storage Service

Future provider changes should require minimal code changes.

---

# Security Rules

Never hardcode:

* API keys
* Secrets
* Passwords
* Tokens

Use environment variables.

Validate all external input.

Follow secure defaults.

---

# Performance Philosophy

Measure before optimizing.

Avoid premature optimization.

Prefer simple, maintainable solutions unless performance data proves otherwise.

---

# Completion Checklist

Before marking work complete, verify:

* Requirements satisfied.
* Architecture followed.
* Design System respected.
* Tests passed.
* No unnecessary complexity introduced.
* Documentation updated if required.

---

# AI Handoff

When finishing a task, the AI should provide:

Completed Work

Files Modified

Remaining Tasks

Known Limitations

Recommended Next Step

This ensures seamless continuation between AI sessions.

---

# Definition of Done

A task is complete only when:

It works.

It is tested.

It follows the documented architecture.

It integrates cleanly with existing modules.

It does not introduce regressions.

---

# Design Decisions

* Documentation-first development.
* Module-first implementation.
* Vertical slice architecture.
* AI-agnostic workflow.
* Consistency over speed.
* Scope protection.

---

# Known Risks

* AI context loss during long sessions.
* Unapproved architectural changes.
* Code duplication.
* Documentation drift.

These risks should be mitigated through disciplined adherence to this playbook.

---

# Future Evolution

This playbook should evolve as Afstim grows.

Any major changes to the engineering process should be documented here before becoming standard practice.

---