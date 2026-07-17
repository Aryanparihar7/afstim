# 06_Wireframe_Specification.md

# Wireframe Specification

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 02_User_Personas.md
* 03_User_Journey.md
* 04_Information_Architecture.md
* 05_Navigation_Flow.md

---

# Purpose

This document specifies the structural layout of every page in ShipLab.

It defines the placement of components, user interactions, hierarchy, and expected behavior.

Visual styling is intentionally excluded.

Design decisions belong to the Design System document.

---

# Design Philosophy

Every screen should answer three questions within five seconds.

* Where am I?
* What should I do?
* What happens next?

Every page should contain one primary action.

---

# Global Layout

All authenticated pages follow a consistent structure.

```
----------------------------------------------------
Top Navigation
----------------------------------------------------

Left Sidebar | Main Content

----------------------------------------------------
```

Only the Workspace includes the AI Mentor panel.

---

# Landing Page

Purpose

Convert visitors into trial users.

Layout

Hero Section

↓

Value Proposition

↓

Journey Preview

↓

Why ShipLab

↓

How It Works

↓

Pricing

↓

FAQ

↓

Contact

↓

Footer

Primary CTA

**Start Free Trial**

---

# Login Page

Components

* Logo
* Welcome Message
* Email Login
* Google Login
* GitHub Login
* Forgot Password
* Create Account

Primary CTA

Login

---

# Registration Page

Components

* Name
* Email
* Password
* Google Signup
* GitHub Signup
* Terms Acceptance

Primary CTA

Create Account

---

# Onboarding

Layout

Progress Indicator

↓

Question

↓

Answer Options

↓

Continue

↓

Next Question

The user should answer one question at a time.

Never display a long form.

---

# Dashboard

Layout

```
----------------------------------------------------
Top Navigation
----------------------------------------------------

Sidebar

----------------------------------------------------

Current Journey Card

Continue Mission Button

Progress Overview

Builder Statistics

Recent Activity

Recommended Next Step

----------------------------------------------------
```

Primary CTA

Continue Mission

---

# Journey Page

Components

Journey Title

↓

Journey Objective

↓

Progress

↓

Mission Timeline

↓

Current Mission

↓

Next Locked Mission

Primary CTA

Continue Current Mission

---

# Mission Page

Components

Mission Title

↓

Mission Objective

↓

Learning Context

↓

Requirements

↓

Open Workspace

Primary CTA

Open Workspace

---

# Workspace

Desktop Layout

```
---------------------------------------------------------

Mission Panel

Code Editor

AI Mentor

---------------------------------------------------------

Terminal

Console

Preview

---------------------------------------------------------
```

Mission Panel Width

20%

Editor Width

55%

AI Mentor Width

25%

The proportions may be adjusted slightly during implementation, but the editor should remain the dominant element.

---

# Mission Panel

Contains

Mission Title

Objective

Checklist

Resources

Validation Criteria

Completion Status

The mission panel remains fixed while coding.

---

# Code Editor

Contains

* File Explorer
* Tabs
* Monaco Editor

Editor is the primary workspace.

---

# Terminal

Displays

* Commands
* Output
* Build Status
* Deployment Status

Terminal remains collapsible.

---

# Preview Panel

Displays

Running application preview whenever applicable.

Unavailable previews should display a clear explanation instead of an empty screen.

---

# AI Mentor

Components

Conversation

Suggestions

Mission Context

Help Actions

The AI automatically understands the learner's current mission.

The learner should not repeatedly explain context.

---

# Reflection Screen

Appears after validation.

Components

Reflection Questions

Answer Box

Continue Button

Reflection is mandatory before mission completion.

---

# Mission Complete Screen

Components

Success Animation

Mission Summary

Reputation Earned

Journey Progress

Next Mission Button

The learner should feel genuine accomplishment.

---

# Settings

Sections

Account

Learning

Editor

Notifications

Billing

Privacy

Support

Each section appears as a separate tab.

---

# Contact & Feedback

Layout

Category Selector

↓

Message

↓

Optional Screenshot (Future)

↓

Submit

↓

Confirmation

Categories

* Bug Report
* Feature Request
* General Feedback
* Contact Support

Primary CTA

Submit Feedback

---

# Billing

Components

Current Plan

Trial Status

Renewal Date

Payment Method

Invoices

Cancel Subscription

Primary CTA

Manage Subscription

---

# Admin Dashboard

Components

Overview Cards

↓

Users

↓

Journeys

↓

Missions

↓

Subscriptions

↓

Reports

↓

Support

Administrative functions should remain visually separate from the learner experience.

---

# Empty States

Every empty state should contain:

Headline

Short Explanation

Primary Action

Example

"No active journey yet."

Primary Action

Start First Journey

---

# Loading States

Use skeleton loading for content-heavy screens.

Display progress indicators for longer-running operations.

Avoid blank pages.

---

# Error States

Every error page should include:

Clear Explanation

Recovery Action

Retry Button

Return Button

Never expose internal technical details.

---

# Responsive Behaviour

Desktop

Full experience.

Laptop

Full experience with responsive spacing.

Tablet

Read-only learning support.

Mobile

Account management, billing, documentation and contact only.

Mission implementation remains desktop-first.

---

# Accessibility

All screens should support:

Keyboard navigation

Visible focus indicators

Consistent spacing

Readable typography

Sufficient color contrast

---

# Design Decisions

* Workspace is the primary experience.
* Code editor receives the largest visual emphasis.
* Every screen has one primary action.
* Reflection is required before completion.
* Feedback remains easily accessible.

---

# Known Risks

* Workspace becoming visually crowded.
* Sidebar growing too large.
* Excessive scrolling inside missions.

These should be evaluated during usability testing.

---

# Open Questions

* Should the mission checklist remain expanded by default?
* Should terminal and preview be resizable?
* Should users be able to rearrange workspace panels?

These decisions are deferred until usability testing.

---

# Dependencies

This document directly influences:

* Design System
* Frontend Architecture
* Component Library
* UI Development
* AI Workspace

---

