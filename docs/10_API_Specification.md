# 10_API_Specification.md

# API Specification

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 08_Backend_Architecture.md
* 09_Database_Design.md

---

# Purpose

This document defines the API standards for ShipLab Version 1.

The API should be:

* Predictable
* Consistent
* Secure
* Easy to understand
* Easy for AI coding agents to extend

Every endpoint should follow these standards.

---

# API Philosophy

The API exists to expose business capabilities.

It should never expose internal implementation details.

Clients should interact with resources rather than database structures.

---

# API Style

Version 1 uses REST APIs.

Reasons:

* Wide ecosystem support
* Excellent AI tooling
* Mature documentation
* Easy frontend integration

---

# API Versioning

All APIs should be versioned.

Example:

/api/v1/

Future breaking changes should introduce a new version rather than modifying existing contracts.

---

# Authentication

Protected endpoints require authentication.

Public endpoints:

* Landing content
* Pricing
* FAQ
* Contact

Authenticated endpoints:

* Dashboard
* Journeys
* Missions
* Workspace
* Progress
* Billing
* Feedback

---

# Authorization

Authentication identifies the user.

Authorization determines what the user may access.

Users may access only their own learning data.

Administrative endpoints require administrator privileges.

---

# Request Standards

Requests should use standard HTTP methods.

GET

Retrieve data.

POST

Create resources.

PUT

Replace resources.

PATCH

Update resources.

DELETE

Remove resources where permitted.

---

# Response Format

Every successful response follows one consistent structure.

Contains:

* Success status
* Requested data
* Optional metadata

Clients should not need different parsing logic for different endpoints.

---

# Error Response

Every error should contain:

* Error code
* Human-readable message
* Optional recovery suggestion

Internal stack traces must never be exposed.

---

# Resource Groups

Version 1 defines the following API groups:

Authentication

Users

Journeys

Missions

Progress

Workspace

AI Mentor

Billing

Feedback

Notifications

Administration

Each group owns its own endpoints.

---

# Authentication APIs

Responsibilities:

* Login
* Logout
* Registration
* Session Validation
* Email Verification

---

# User APIs

Responsibilities:

* Profile
* Preferences
* Reputation
* Builder Level

---

# Journey APIs

Responsibilities:

* Retrieve journeys
* Journey details
* Current progress
* Completion status

---

# Mission APIs

Responsibilities:

* Retrieve mission
* Submit validation
* Complete reflection
* Mark completion

Mission completion must always pass validation.

---

# Progress APIs

Responsibilities:

* Current mission
* Current journey
* Resume state
* Learning history

Progress should update automatically after successful validation.

---

# AI Mentor APIs

Responsibilities:

* Submit supported events
* Retrieve AI guidance
* Context preparation

The API should remain event-driven.

The AI should not receive every keystroke.

---

# Billing APIs

Responsibilities:

* Trial status
* Subscription status
* Payment verification
* Invoice retrieval

Sensitive payment processing remains with the payment provider.

---

# Feedback APIs

Responsibilities:

* Submit feedback
* Report bugs
* Feature requests
* Contact support

Feedback should always include a category.

---

# Notification APIs

Responsibilities:

* Retrieve notifications
* Mark notifications as read

Notifications should remain user-specific.

---

# Administration APIs

Responsibilities:

* User management
* Journey management
* Mission management
* Reports

Administrative APIs require elevated permissions.

---

# Pagination

Large collections should support pagination.

Clients should not receive unnecessarily large payloads.

---

# Filtering

Supported resources may provide filtering.

Filtering should remain simple and predictable.

---

# Searching

Search endpoints should return relevant results.

Search behavior should remain consistent across resources.

---

# Rate Limiting

Public APIs should implement reasonable rate limits.

Authenticated users should receive limits appropriate for normal learning activity.

The goal is protection, not restriction.

---

# Validation

Every request must be validated.

Invalid requests should return clear error messages.

Validation failures should explain what needs to be corrected.

---

# Logging

API requests should log operational events.

Logs should never include sensitive personal information.

---

# Security

Every endpoint should follow secure defaults.

Never trust client input.

Never expose internal identifiers unnecessarily.

Protect sensitive operations with appropriate authorization.

---

# Documentation

Every endpoint should document:

Purpose

Inputs

Outputs

Permissions

Possible responses

Dependencies

Examples

Documentation should remain synchronized with implementation.

---

# Design Decisions

* REST architecture.
* Consistent response structure.
* Event-driven AI endpoints.
* Versioned APIs.
* Resource-oriented organization.

---

# Known Risks

* API contract changes affecting clients.
* Poor endpoint organization.
* Excessive payload sizes.

These risks should be reviewed during development.

---

# Open Questions

* When should background jobs expose status endpoints?
* Should bulk administrative operations be introduced later?
* At what scale should internal APIs be separated from public APIs?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* Frontend Development
* Backend Services
* Authentication
* AI Integration
* Admin Dashboard
* Future API Documentation

---

