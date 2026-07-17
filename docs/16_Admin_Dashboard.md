# 16_Admin_Dashboard.md

# Admin Dashboard

## Version 1.0

**Status:** Draft

**Depends On:**

* 01_Product_Requirements_Document.md
* 08_Backend_Architecture.md
* 09_Database_Design.md
* 10_API_Specification.md
* 14_Mission_Engine.md
* 15_Journey_Engine.md

---

# Purpose

The Admin Dashboard enables the Afstim team to operate, monitor and improve the platform.

It is an internal operational tool.

It is not part of the learner experience.

Every administrative feature should directly support operating the MVP.

---

# Admin Philosophy

The Admin Dashboard exists to answer three questions.

1. Is the platform healthy?

2. Are learners progressing?

3. What needs attention?

Everything else is secondary.

---

# Administrative Roles

Version 1 supports three roles.

Administrator

Support

Content Manager

Each role receives only the permissions required for its responsibilities.

---

# Dashboard Overview

The dashboard should provide a high-level operational summary.

Display:

* Total Users
* Active Users
* Trial Users
* Paid Users
* Active Journeys
* Active Missions
* AI Requests
* Feedback Received
* Open Support Requests
* Platform Status

The dashboard should prioritize actionable information.

---

# User Management

Administrators can:

View Users

Search Users

Filter Users

View Progress

View Subscription Status

Deactivate Accounts

Reactivate Accounts

Reset Learning Progress (confirmation required)

Administrators cannot impersonate learners in Version 1.

---

# Journey Management

Content Managers can:

Create Journeys

Edit Journeys

Archive Journeys

Publish Journeys

Duplicate Journeys

Assign Difficulty

Reorder Journeys

Only published Journeys become visible to learners.

---

# Mission Management

Content Managers can:

Create Missions

Edit Missions

Preview Missions

Archive Missions

Publish Missions

Duplicate Missions

Reorder Missions

Mission templates should maintain a consistent structure.

---

# Mission Library

The Mission Library is the central repository of all missions.

Each mission stores:

Title

Objective

Difficulty

Estimated Duration

Prerequisites

Validation Rules

Publication Status

Associated Journey(s)

The Mission Library serves as the foundation for AI-generated personalized roadmaps.

---

# Learner Progress

Administrators may view:

Current Journey

Current Mission

Completion Percentage

Validation Attempts

Deployment Status

Recent Activity

Progress data is read-only except for approved administrative actions.

---

# Subscription Management

Administrators can view:

Active Plans

Trial Users

Expired Trials

Payment Failures

Renewals

Cancellation Requests

Financial transactions remain managed by the payment provider.

---

# Feedback Management

All learner feedback should appear in a centralized dashboard.

Categories include:

Bug Report

Feature Request

General Feedback

Support Request

Positive Feedback

Administrators should be able to:

Filter

Search

Assign Status

Mark Resolved

Export Reports

Feedback should support continuous product improvement.

---

# AI Monitoring

The dashboard should display operational AI metrics.

Examples:

Total Requests

Average Response Time

Failed Requests

Provider Availability

Estimated Token Usage

The dashboard monitors operational health rather than conversation content.

---

# Platform Monitoring

Display:

System Status

API Health

Database Status

Authentication Status

Payment Status

AI Status

The objective is early detection of operational issues.

---

# Reports

Version 1 supports:

New Registrations

Trial Conversion Rate

Journey Completion Rate

Mission Completion Rate

Deployment Success Rate

Feedback Trends

Reports should focus on actionable insights.

---

# Search

Administrators should be able to search:

Users

Journeys

Missions

Feedback

Support Requests

Search results should be fast and relevant.

---

# Notifications

Administrative notifications include:

Critical Errors

Payment Provider Issues

AI Provider Issues

Deployment Failures

System Warnings

Notifications should prioritize urgency.

---

# Security

Administrative routes require elevated permissions.

Sensitive actions require confirmation.

Administrative activity should be recorded for auditing.

---

# Audit Log

Record:

User Deactivation

Mission Publication

Journey Publication

Settings Changes

Administrative Login

Permission Changes

Audit logs improve accountability and troubleshooting.

---

# Dashboard Performance

The Admin Dashboard should remain responsive.

Large datasets should use:

Pagination

Filtering

Searching

Avoid loading unnecessary information.

---

# Accessibility

Administrative interfaces should support:

Keyboard Navigation

Readable Contrast

Clear Labels

Responsive Layouts

Accessibility remains a product requirement.

---

# Design Decisions

* Operational simplicity over feature abundance.
* Mission Library as the single source of learning content.
* Clear separation between learner and administrator interfaces.
* Read-only learner progress with controlled administrative actions.
* Focus on actionable operational metrics.

---

# Known Risks

* Dashboard complexity increasing over time.
* Excessive administrative permissions.
* Large datasets reducing responsiveness.

These risks should be reviewed as the platform scales.

---

# Open Questions

* Should mission version history be introduced in Version 2?
* Should bulk publishing be supported later?
* Should AI-generated content suggestions assist Content Managers in the future?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* Mission Engine
* Journey Engine
* Content Management
* Analytics
* Reporting
* Platform Operations

---

