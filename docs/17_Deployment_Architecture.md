# 17_Deployment_Architecture.md

# Deployment Architecture

## Version 1.0

**Status:** Draft

**Depends On:**

* 08_Backend_Architecture.md
* 11_AI_Architecture.md
* 13_Payment_Architecture.md
* 14_Mission_Engine.md
* 15_Journey_Engine.md

---

# Purpose

This document defines the deployment architecture for Afstim Version 1.

It covers:

1. Deployment of the Afstim platform.
2. Deployment workflow taught to learners.

Both are essential to the product.

---

# Deployment Philosophy

Deployment is not the final step.

Deployment is part of learning.

Learners should deploy continuously throughout their journey rather than waiting until the end.

Deployment should become a familiar engineering habit.

---

# Platform Deployment

Afstim uses a modern cloud deployment architecture.

Frontend

↓

Vercel

Backend

↓

Railway

Database

↓

Supabase PostgreSQL

Storage

↓

Supabase Storage

Authentication

↓

Clerk

Payments

↓

Razorpay

AI

↓

Cloud-First Hybrid Architecture

Each component should remain independently deployable.

---

# Environment Strategy

Version 1 supports three environments.

Development

↓

Staging

↓

Production

Each environment remains isolated.

Configuration should never be hardcoded.

---

# Continuous Deployment

Version 1 should support continuous deployment.

Workflow

Developer Push

↓

Git Repository

↓

Automatic Build

↓

Deployment

↓

Health Check

↓

Production

Manual deployment should be unnecessary for normal releases.

---

# Configuration

Configuration should use environment variables.

Examples include:

Database Connection

Authentication Keys

Payment Keys

AI Keys

API URLs

Sensitive values must never appear in source code.

---

# Secrets Management

Secrets should be stored securely.

Examples:

API Keys

Authentication Secrets

Webhook Secrets

Database Credentials

Secrets should remain encrypted and environment-specific.

---

# Monitoring

Platform deployment should monitor:

Application Availability

API Health

Database Connectivity

Authentication Availability

Payment Availability

AI Availability

Failures should be detected quickly.

---

# Backup Strategy

Regular backups should exist for:

Database

Configuration

Critical application data

Recovery procedures should be documented and periodically tested.

---

# Learner Deployment Philosophy

Every learner should deploy real software.

Deployment is mandatory.

The learner should understand every major deployment step.

The objective is confidence, not memorization.

---

# Learner Deployment Workflow

Build Application

↓

Run Locally

↓

Validate

↓

Deploy

↓

Verify Deployment

↓

Connect Database

↓

Configure Environment Variables

↓

Connect Domain

↓

Enable HTTPS

↓

Production Ready

This workflow becomes the standard deployment sequence throughout Afstim.

---

# Deployment Validation

Deployment is complete only when:

Application is publicly accessible.

Required services are functioning.

Validation checks pass.

Deployment success should be objectively verifiable.

---

# AI Deployment Coach

The AI Mentor supports deployment by:

Explaining deployment concepts.

Helping interpret deployment errors.

Guiding configuration.

Explaining infrastructure decisions.

The AI should encourage understanding rather than simply providing commands.

---

# Deployment Failure

Failure should become part of learning.

If deployment fails:

Explain the failure.

Recommend the next step.

Allow retry.

Never reset learner progress.

---

# Supported Deployment Targets

Version 1 teaches deployment using a curated set of beginner-friendly platforms.

Examples include:

Railway

Vercel

Supabase

These platforms should remain consistent throughout the learning experience.

Additional deployment targets may be introduced in future versions.

---

# Domain Configuration

Learners should understand:

What a domain is.

How to purchase one.

How to connect it.

How DNS works at a practical level.

How HTTPS is enabled.

The objective is practical deployment knowledge.

---

# Production Readiness

A learner's project is considered production-ready when:

Deployment succeeds.

Environment variables are configured.

Database is connected.

Domain functions correctly (where applicable).

HTTPS is active.

The learner understands the deployment workflow.

---

# Deployment Analytics

Version 1 records:

Deployment Started

Deployment Successful

Deployment Failed

Average Deployment Time

Common Failure Categories

Analytics should improve future learning content.

---

# Security

Deployment should follow secure defaults.

Never expose secrets publicly.

Encourage least-privilege access.

Use HTTPS whenever possible.

Security is part of deployment, not an afterthought.

---

# Design Decisions

* Continuous deployment.
* Cloud-native infrastructure.
* Mandatory learner deployment.
* Cloud-First Hybrid AI.
* Beginner-friendly deployment platforms.
* Practical production readiness.

---

# Known Risks

* Cloud provider outages.
* Platform changes by hosting providers.
* Learner deployment failures.
* Misconfigured environment variables.

These risks should be monitored and addressed through documentation and AI guidance.

---

# Open Questions

* When should Docker become mandatory?
* Should learners eventually deploy to AWS directly?
* Should custom infrastructure journeys be introduced in Version 2?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* Mission Engine
* Journey Engine
* AI Mentor
* Backend Services
* Platform Operations
* Future Infrastructure Journeys

---


