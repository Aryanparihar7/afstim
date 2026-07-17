# Product Requirements Document (PRD)
## Version 1.0
### Product: ShipLab
### Status: Draft
### Depends On:
- 00_Product_Bible.md

---

# 1. Introduction

This document defines the functional and non-functional requirements for ShipLab Version 1 (MVP).

It serves as the primary implementation guide for developers, designers, AI coding agents, testers, and future contributors.

The objective is to ensure every feature is implemented consistently and aligns with the Product Bible.

This document intentionally focuses on the MVP.

Anything outside the MVP belongs to future roadmap documents.

---

# 2. Product Overview

ShipLab is a mission-based software engineering platform that teaches users how to build and launch production-ready software.

Instead of watching disconnected tutorials, learners complete guided journeys where every lesson immediately becomes a real implementation task.

Every completed journey ends with a production-ready application that can be shared publicly.

---

# 3. Product Goals

Version 1 has five primary goals.

Goal 1

Teach users how software is built in the real world.

---

Goal 2

Guide users from idea to production without requiring multiple external learning resources.

---

Goal 3

Create confidence in deployment and software delivery.

---

Goal 4

Help users build a portfolio-ready project.

---

Goal 5

Reduce friction between learning and implementation using AI assistance.

---

# 4. Non Goals (Version 1)

Version 1 will NOT attempt to solve the following problems.

• Multi-language learning

• Interview preparation

• DSA practice

• Competitive programming

• Mobile development

• AI application generation

• Enterprise DevOps

• Team collaboration

• Social networking

• Marketplace for projects

These are explicitly excluded from the MVP.

---

# 5. Target User

Primary User

Computer Science students who understand basic programming but cannot independently launch software.

Typical examples

• BCA

• MCA

• B.Tech

• Self-taught developers

• Career switchers

---

# 6. Core User Problem

Today the learner experiences something like this.

Learn Python

↓

Learn HTML

↓

Learn CSS

↓

Learn React

↓

Learn Git

↓

Learn Docker

↓

Learn AWS

↓

Watch another tutorial

↓

Google another error

↓

Stack Overflow

↓

YouTube

↓

Confusion

↓

Quit

ShipLab removes this fragmentation.

---

# 7. Product Promise

Every learner who completes the first journey will have:

✓ One production-ready application

✓ One deployed backend

✓ One deployed frontend

✓ One connected database

✓ HTTPS enabled

✓ Custom domain configured

✓ Git repository

✓ Portfolio project

---

# 8. Success Criteria

A learner is considered successful when all of the following are true.

• Application is publicly accessible.

• Domain is connected.

• HTTPS works.

• User understands each deployment step.

• User can explain what happened.

• User can repeat the deployment independently.

---

# 9. Product Philosophy

ShipLab teaches software engineering through execution.

Everything inside the platform must answer one question.

"Does this help the learner ship software?"

If the answer is no,

the feature should not exist.

---

# 10. Product Structure

The platform has four primary layers.

Layer 1

Marketing Website

Purpose

Acquire customers.

---

Layer 2

Authentication

Purpose

Manage accounts.

---

Layer 3

Learning Platform

Purpose

Teach users through missions.

---

Layer 4

Administration

Purpose

Manage the entire ecosystem.

---

# 11. Platform Architecture

Marketing Website

↓

Authentication

↓

Onboarding

↓

Dashboard

↓

Journey

↓

Mission

↓

Implementation

↓

Reflection

↓

Reward

↓

Next Mission

---

# 12. Learning Architecture

Journey

↓

Mission

↓

Task

↓

Implementation

↓

AI Review

↓

Checkpoint

↓

Mission Complete

↓

Reward

↓

Next Mission

---

# 13. Core Product Components

Version 1 contains the following major systems.

1.
Authentication System

2.
Journey Engine

3.
Mission Engine

4.
Progress Tracking

5.
AI Mentor

6.
Code Editor

7.
Assessment Engine

8.
Reward System

9.
Deployment Engine

10.
Billing

11.
User Profile

12.
Settings

13.
Admin Dashboard

Every future feature belongs to one of these systems.

---

# 14. Navigation Philosophy

The user should never feel lost.

Every screen answers three questions.

Where am I?

What am I doing?

What should I do next?

If a screen cannot answer these three questions,

the design is incorrect.

---

# 15. Design Philosophy

The UI should feel like professional software.

Not educational software.

Visual Inspiration

Nothing

Linear

Vercel

Stripe

Framer

The interface should be calm, elegant, spacious and minimal.

Animations should communicate progress rather than decoration.

---

# 16. Emotional Design

The learner should experience a progression of emotions.

Curiosity

↓

Understanding

↓

Confidence

↓

Achievement

↓

Pride

↓

Ownership

↓

Momentum

Every mission should contribute to this emotional journey.

---

# End of Part 1