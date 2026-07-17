# 17. Product Modules

ShipLab Version 1 consists of independent modules.

Every module should be developed separately.

Every module exposes clearly defined APIs.

Every module can evolve independently.

Modules communicate only through approved interfaces.

This architecture allows AI coding agents to build features without creating tight coupling.

---

# Module Overview

1.
Landing Website

2.
Authentication

3.
Onboarding

4.
Dashboard

5.
Journey Engine

6.
Mission Engine

7.
Code Workspace

8.
AI Mentor

9.
Assessment Engine

10.
Deployment Engine

11.
Reputation Engine

12.
Profile

13.
Billing

14.
Settings

15.
Notifications

16.
Admin Dashboard

---

# 18. Landing Website

Purpose

Acquire users.

The landing page should not explain technology.

It should sell transformation.

Hero Statement

Build your first production-ready application.

Not your first project.

Sections

• Hero

• Social Proof

• Why ShipLab

• Product Demo

• Journey Preview

• Features

• Success Stories

• Pricing

• FAQ

• Footer

The landing page should never overwhelm users.

---

# 19. Authentication

Authentication should be frictionless.

Supported Methods

• Google

• GitHub

• Email

The first login should take less than one minute.

Password complexity should be handled automatically.

Users should never lose progress.

---

# 20. Onboarding

This is one of the most important experiences.

The goal is not collecting information.

The goal is understanding the learner.

The onboarding should feel like a conversation.

Questions

What do you want to build?

What is your experience level?

Have you deployed software before?

Do you know Git?

Do you know Python?

Have you worked with databases?

Do you have a GitHub account?

Do you have a domain?

Do you have hosting experience?

Preferred learning speed?

Estimated duration

Less than three minutes.

---

# 21. AI Roadmap Generation

Once onboarding finishes,

the AI creates a personalized roadmap.

Example

Journey

↓

Python Foundation

↓

Backend Development

↓

Database

↓

Authentication

↓

Deployment

↓

Custom Domain

↓

Production

↓

Portfolio

No two learners necessarily receive identical paths.

---

# 22. Dashboard

The dashboard is the home screen.

Purpose

Give clarity.

The learner should instantly understand

Current Journey

Current Mission

Current Reputation

Next Milestone

Projects Built

Deployment Progress

Builder Level

Today's Goal

Recent Achievements

Everything should be visible within five seconds.

---

# Dashboard Layout

Top Navigation

↓

Current Journey Card

↓

Continue Mission Button

↓

Progress Timeline

↓

Today's Mission

↓

Builder Statistics

↓

Recent Activity

↓

Recommended Next Step

---

# 23. Journey Engine

Journeys are the highest level of learning.

Each journey solves one real-world outcome.

Examples

Launch Your First SaaS

Deploy Your Portfolio

Build an AI Application

Create an API

Build an E-commerce Website

Journeys never teach isolated concepts.

They teach complete products.

---

# Journey Structure

Journey

↓

Mission

↓

Challenge

↓

Implementation

↓

Reflection

↓

Launch

↓

Completion

---

# 24. Mission Engine

Missions are atomic learning units.

Each mission should teach exactly one meaningful capability.

Examples

Mission

Create Login API

Mission

Connect PostgreSQL

Mission

Deploy Backend

Mission

Buy Domain

Mission

Configure HTTPS

Mission

Create Docker Image

Mission

Deploy Database

Mission

Enable Monitoring

Every mission ends with verification.

---

# Mission Anatomy

Objective

↓

Requirements

↓

Resources

↓

Implementation

↓

Run Code

↓

AI Feedback

↓

Self Reflection

↓

Validation

↓

Mission Complete

---

# 25. Code Workspace

The workspace is the heart of ShipLab.

Everything revolves around implementation.

The workspace consists of

Mission Panel

↓

Monaco Editor

↓

Integrated Terminal

↓

AI Mentor

↓

Console

↓

Output Preview

↓

File Explorer

This layout should remain consistent across all missions.

---

# Workspace Layout

------------------------------------------------

Mission

Editor

AI Mentor

------------------------------------------------

Terminal

Console

Preview

------------------------------------------------

The layout should feel familiar to VS Code users.

---

# 26. Mission Panel

The mission panel is always visible.

It should answer

Why am I here?

What am I building?

What should I do?

When am I finished?

The learner should never need to guess.

---

# 27. Code Execution

Users can execute code directly inside the workspace.

Execution should feel instant.

The AI should NOT activate every keystroke.

AI activates only on meaningful events.

Events

Run

Save

Deploy

Commit

Error

Assessment

Request Help

This reduces cost while maintaining responsiveness.

---

# 28. AI Mentor

The AI mentor appears as one intelligent assistant.

Internally it may route to specialized systems,

but the learner should experience one mentor.

Responsibilities

Explain

Guide

Review

Debug

Challenge

Recommend

Encourage

The mentor should never simply paste complete solutions without educational value.

---

# 29. AI Trigger Rules

Allowed Triggers

Run

Deploy

Compilation Error

Terminal Error

Git Error

Assessment Failure

Help Button

Checkpoint Review

Forbidden Triggers

Typing

Cursor Movement

Scrolling

Idle State

This dramatically reduces inference costs.

---

# 30. Reflection

Every mission ends with reflection.

Questions include

Why did this work?

What changed?

Could you repeat it?

What would happen if HTTPS were removed?

Reflection converts experience into understanding.

---

# End of Part 2