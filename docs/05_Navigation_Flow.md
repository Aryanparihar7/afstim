# 05_Navigation_Flow.md

# Navigation Flow

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 02_User_Personas.md
* 03_User_Journey.md
* 04_Information_Architecture.md

---

# Purpose

This document defines how users navigate throughout ShipLab.

Navigation should feel predictable, consistent, and effortless.

The learner should always know:

* Where they are
* What they are doing
* What comes next

Every navigation decision should reduce confusion.

---

# Navigation Principles

ShipLab follows these navigation principles.

1. One Primary Goal Per Screen

Every screen has one dominant action.

Users should never wonder what to do next.

---

2. Consistent Navigation

Navigation components remain in the same position throughout the platform.

Consistency reduces cognitive load.

---

3. Progressive Navigation

Only relevant navigation options are shown.

Users should not be distracted by future functionality.

---

4. No Dead Ends

Every page must provide an obvious next action.

No screen should trap the learner.

---

# Public Navigation Flow

Visitor

↓

Landing Page

↓

Features

↓

Pricing

↓

FAQ

↓

Contact

↓

Sign Up

↓

Login

---

# Authentication Flow

Sign Up

↓

Email Verification

↓

Onboarding

↓

Dashboard

---

Existing User

↓

Login

↓

Dashboard

---

Forgot Password

↓

Email Verification

↓

Reset Password

↓

Login

---

# Dashboard Flow

Dashboard

↓

Continue Mission

↓

Workspace

↓

Mission Complete

↓

Return Dashboard

↓

Next Mission

The dashboard acts as the central hub.

Users should always return here after completing significant milestones.

---

# Journey Navigation

Dashboard

↓

Current Journey

↓

Journey Overview

↓

Active Mission

↓

Workspace

↓

Mission Complete

↓

Journey Overview

↓

Next Mission

Learners should only have one active mission at any given time.

---

# Mission Navigation

Mission Overview

↓

Read Objective

↓

Open Workspace

↓

Build

↓

Validate

↓

Reflection

↓

Mission Complete

↓

Next Mission

Users should never skip validation.

---

# Workspace Navigation

Mission Instructions

↓

Code Editor

↓

Run Code

↓

Terminal Output

↓

AI Guidance (if required)

↓

Validation

↓

Mission Complete

The workspace remains visually consistent across every mission.

---

# AI Mentor Flow

User Action

↓

Supported Event Trigger

↓

Context Collection

↓

AI Response

↓

Learner Continues

The AI should never interrupt the learner unnecessarily.

AI appears only when it adds value.

---

# Trial Flow

Visitor

↓

Register

↓

Email Verification

↓

Onboarding

↓

7-Day Trial Starts

↓

Learning Platform

↓

Trial Reminder

↓

Subscription

↓

Continue Learning

If payment is not completed:

Learning content becomes locked.

User progress remains preserved.

---

# Settings Navigation

Dashboard

↓

Settings

↓

Account

Learning

Editor

Notifications

Billing

Privacy

Support

Users should return to their previous page after saving changes.

---

# Contact & Feedback Flow

Any Page

↓

Help / Feedback

↓

Choose Category

* Report Bug
* Feature Request
* General Feedback
* Contact Support

↓

Submit

↓

Confirmation

Feedback submission should require as few steps as possible.

---

# Error Navigation

Unexpected Error

↓

Friendly Error Message

↓

Suggested Recovery

↓

Retry

OR

Return to Previous Screen

Users should never encounter unrecoverable navigation paths.

---

# Navigation Components

## Top Navigation

Visible on all authenticated pages.

Contains:

* Logo
* Current Journey
* Search
* Reputation
* Notifications
* Profile

---

## Left Sidebar

Primary navigation.

Contains:

* Dashboard
* Journey
* Missions
* Settings

The sidebar remains fixed throughout the learning experience.

---

## Right Panel

Visible only inside the Workspace.

Contains:

* AI Mentor

The panel may be collapsed but should remain easily accessible.

---

# Navigation States

Every page should clearly indicate:

Current Location

Current Journey

Current Mission

Current Progress

Next Recommended Action

---

# Mobile Navigation

Version 1 prioritizes desktop.

Mobile users may:

* View account
* Manage billing
* Read documentation

Mission implementation remains desktop-first.

---

# Accessibility

Navigation must support:

* Keyboard navigation
* Clear focus states
* Readable labels
* Consistent placement

---

# Design Decisions

* Dashboard is the home screen after login.
* Continue Mission is the primary call-to-action.
* Navigation is shallow to reduce complexity.
* Workspace remains visually consistent.
* Feedback is always accessible.

---

# Known Risks

* Navigation becoming crowded as new features are added.
* Learners bypassing important steps.
* Excessive clicks reducing momentum.

These risks should be reviewed before Version 2.

---

# Open Questions

* Should users be able to bookmark missions?
* Should search include AI conversation history?
* Should completed journeys remain pinned on the dashboard?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* Wireframe Specification
* Design System
* Frontend Architecture
* User Interface Development
* AI Workspace Design

---

