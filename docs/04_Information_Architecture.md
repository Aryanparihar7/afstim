# 04_Information_Architecture.md

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 02_User_Personas.md
* 03_User_Journey.md

---

# Purpose

This document defines how every piece of information inside ShipLab is organized.

The objective is to make the platform predictable, easy to navigate, and easy to scale while keeping the MVP focused.

Users should never wonder where something is located.

Every feature should have one obvious home.

---

# Information Architecture Principles

The architecture follows five principles.

1. One Purpose Per Screen
2. One Primary Action Per Screen
3. Progressive Disclosure
4. Consistent Navigation
5. Minimal Cognitive Load

---

# Platform Structure

ShipLab consists of four major areas.

```
Marketing Website

↓

Authentication

↓

Learning Platform

↓

Administration
```

---

# Marketing Website

Purpose:

Acquire visitors and convert them into trial users.

Pages:

* Landing Page
* Features
* Pricing
* FAQ
* Contact
* Login
* Sign Up

---

# Authentication

Purpose:

Secure access to the platform.

Pages:

* Login
* Register
* Forgot Password
* Email Verification

---

# Learning Platform

Purpose:

Deliver the complete learning experience.

Main Sections:

Dashboard

↓

Journey

↓

Mission

↓

Workspace

↓

Settings

---

# Dashboard

The dashboard is the user's home.

Contains:

* Continue Learning
* Current Journey
* Current Mission
* Reputation
* Builder Level
* Progress
* Recent Activity

Primary Action:

**Continue Mission**

---

# Journey

Purpose:

Display the learner's current roadmap.

Contains:

* Journey Overview
* Mission List
* Completion Progress
* Journey Objective

Users can only actively work on one mission at a time.

---

# Mission

Purpose:

Teach one practical capability.

Each Mission contains:

* Objective
* Explanation
* Task
* Validation
* Reflection
* Completion

---

# Workspace

The Workspace is the heart of the platform.

Layout:

```
Mission Instructions

↓

Code Editor

↓

Terminal

↓

Console

↓

Preview

↓

AI Mentor
```

The workspace layout remains consistent throughout the platform.

---

# AI Mentor

Purpose:

Provide contextual guidance.

The AI always understands:

* Current Journey
* Current Mission
* Current Progress

The learner should never need to explain their current context.

---

# Settings

Contains:

* Account
* Learning Preferences
* Editor Preferences
* Notifications
* Billing
* Privacy
* Support

---

# Contact & Feedback

Purpose:

Allow learners to communicate directly with ShipLab.

Sections:

* Contact Us
* Report a Bug
* Suggest a Feature
* General Feedback

Support Channels:

* Email
* LinkedIn (Founder)
* Support Form

Feedback should always be categorized to simplify review and prioritization.

---

# Administration

Purpose:

Operate the platform.

Sections:

* Dashboard
* Users
* Journeys
* Missions
* Subscriptions
* Reports
* Support

Administrative functionality is isolated from the learner experience.

---

# Navigation Rules

Every authenticated page must contain:

* Top Navigation
* Left Sidebar
* Main Content
* Right AI Panel (Workspace only)

Navigation should never change unexpectedly.

Consistency builds confidence.

---

# Search Architecture

Global Search should include:

* Journeys
* Missions
* Documentation
* Settings

Search should never return unrelated content.

---

# Content Hierarchy

The learning hierarchy is fixed.

```
Journey

↓

Mission

↓

Task

↓

Validation

↓

Reflection

↓

Completion
```

This hierarchy must remain consistent throughout the product.

---

# Growth Rules

Future features must fit naturally into this architecture.

If a feature cannot be placed without disrupting the structure, the architecture should be reviewed before implementation.

---

# Design Decisions

* Dashboard-first navigation.
* Workspace as the core experience.
* Consistent layout across missions.
* Feedback integrated into the platform.
* Minimal navigation depth.

---

# Known Risks

* Navigation becoming crowded over time.
* Future features increasing cognitive load.
* Poor organization reducing discoverability.

---

# Open Questions

* Should documentation live inside the workspace or open separately?
* Should notifications have a dedicated page or remain a dropdown?
* How should search rank AI-generated help versus official documentation?

---

# Dependencies

This document directly influences:

* Navigation Flow
* Wireframe Specification
* Design System
* Frontend Architecture
* Backend APIs
* Database Design

---

