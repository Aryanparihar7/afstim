# 09_Database_Design.md

# Database Design

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 08_Backend_Architecture.md

---

# Purpose

This document defines the logical database structure for ShipLab Version 1.

The database should be:

* Simple
* Relational
* Maintainable
* Scalable
* Easy for AI-assisted development

The schema should support the MVP without introducing unnecessary complexity.

---

# Database Philosophy

The database stores information.

The application enforces business rules.

Business logic must never depend on complex database procedures.

The database should remain the single source of truth for persistent application data.

---

# Database Technology

Primary Database

PostgreSQL

Reason:

* Mature relational database
* Excellent AI ecosystem support
* Strong consistency
* Easy migration path
* Reliable for SaaS applications

---

# Core Entities

Version 1 contains the following primary entities:

* User
* Journey
* Mission
* UserJourney
* UserMission
* Subscription
* Feedback
* Notification

Each entity represents a single responsibility.

---

# User Entity

Stores:

* Basic profile
* Authentication reference
* Reputation
* Builder Level
* Preferences
* Account status

Every learner owns exactly one User record.

---

# Journey Entity

Stores:

* Journey title
* Description
* Difficulty
* Estimated duration
* Publication status

Journeys are reusable.

Multiple users can complete the same Journey.

---

# Mission Entity

Stores:

* Mission title
* Description
* Journey reference
* Mission order
* Validation requirements
* Estimated completion time

A Mission belongs to exactly one Journey.

---

# UserJourney Entity

Tracks:

* Current progress
* Completion status
* Start date
* Completion date

This separates learner progress from Journey definitions.

---

# UserMission Entity

Tracks:

* Mission status
* Validation state
* Reflection completed
* Completion timestamp

Mission definitions remain unchanged while learner progress is stored independently.

---

# Subscription Entity

Stores:

* Plan
* Trial status
* Renewal date
* Subscription status
* Payment provider reference

Payment details remain with the payment provider whenever possible.

---

# Feedback Entity

Stores:

* Category
* Message
* Status
* Submission date
* User reference

Supported categories:

* Bug Report
* Feature Request
* General Feedback
* Contact Request

---

# Notification Entity

Stores:

* Notification type
* Read status
* Created date
* User reference

Notifications remain user-specific.

---

# Entity Relationships

User

↓

UserJourney

↓

Journey

↓

Mission

↓

UserMission

This separation allows many users to progress independently through the same learning content.

---

# Data Integrity

Every record should maintain referential integrity.

Orphaned records should not exist.

Relationships should remain explicit.

---

# Deletion Policy

Version 1 uses soft deletion where appropriate.

Learning history should not be removed accidentally.

Permanent deletion should require explicit administrative action.

---

# Auditing

Important actions should be timestamped.

Examples:

* Journey started
* Mission completed
* Subscription activated
* Feedback submitted

These timestamps support reporting and troubleshooting.

---

# Security

Sensitive user information should be protected.

Only required data should be stored.

Passwords should never be stored directly by the application.

Authentication providers manage credential security.

---

# Performance Principles

Optimize for:

* Simple queries
* Clear relationships
* Maintainable schema

Avoid premature optimization.

Additional indexes should be introduced only after performance analysis.

---

# Backup Strategy

Regular backups should be supported.

Recovery procedures should be documented.

Backups should be tested periodically.

---

# Migration Philosophy

Schema changes should occur through controlled database migrations.

Manual production changes should be avoided.

Every migration should be reversible where practical.

---

# Design Decisions

* Relational database.
* Separate content from learner progress.
* Soft deletion for important records.
* Authentication delegated to external provider.
* Clear ownership of every entity.

---

# Known Risks

* Poor schema evolution.
* Excessive table coupling.
* Scope expansion increasing complexity.

These risks should be reviewed before major schema changes.

---

# Open Questions

* When should activity history become its own entity?
* Should mission reflections be stored independently in Version 2?
* At what scale should analytics move to a separate reporting database?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* API Specification
* Backend Services
* Authentication
* Progress Tracking
* Admin Dashboard

---

