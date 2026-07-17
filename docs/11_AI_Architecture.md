# 11_AI_Architecture.md

# AI Architecture

## Version 1.0

**Status:** Draft

**Depends On:**

* 00_Product_Bible.md
* 01_Product_Requirements_Document.md
* 08_Backend_Architecture.md
* 10_API_Specification.md

---

# Purpose

This document defines how Artificial Intelligence operates inside ShipLab.

The objective is to provide intelligent guidance while keeping the system:

* Affordable
* Maintainable
* Modular
* Scalable
* Educational

AI exists to improve learning.

It does not replace learning.

---

# AI Philosophy

The AI Mentor is a teacher.

Not an autopilot.

The learner should understand why something works.

The AI should encourage independent thinking.

It should avoid completing entire missions automatically.

---

# High-Level Architecture

Every AI request follows the same flow.

Learner Action

↓

Event Detection

↓

Context Collection

↓

AI Router

↓

Selected AI Capability

↓

Response

↓

Learner Continues

No component communicates directly with external AI providers.

---

# AI Components

Version 1 consists of the following logical components.

AI Router

Context Builder

Teacher

Debugger

Deployment Coach

Response Formatter

These are logical responsibilities.

They do not need to exist as separate services in Version 1.

---

# AI Router

Purpose

Determine how every AI request should be handled.

Responsibilities

Receive requests

Classify request type

Collect required context

Select appropriate AI capability

Return formatted response

The Router becomes the single entry point for AI.

---

# Context Builder

Purpose

Provide the AI with relevant project information.

Context may include:

Current Journey

Current Mission

Project Structure

Current File

Recent Errors

Deployment State

User Skill Level

The learner should never need to repeatedly explain their current situation.

---

# Teacher

Purpose

Explain concepts.

Examples

Programming concepts

Git

Deployment

Databases

Security

Networking

The Teacher should encourage understanding rather than memorization.

---

# Debugger

Purpose

Help learners understand errors.

Responsibilities

Explain errors

Suggest debugging steps

Recommend likely causes

Encourage investigation

The Debugger should avoid immediately giving the final solution whenever learning would benefit from guided discovery.

---

# Deployment Coach

Purpose

Guide deployment-related tasks.

Examples

Environment variables

Domain configuration

HTTPS

Hosting

Deployment failures

Production checks

Deployment guidance should remain practical and sequential.

---

# Response Formatter

Purpose

Present AI responses consistently.

Responses should:

Be concise.

Be educational.

Reference the current mission.

Suggest the next step.

Avoid unnecessary technical complexity.

---

# AI Trigger Events

The AI activates only on supported events.

Supported events include:

Run Code

Save File

Deployment

Terminal Error

Validation Failure

Assessment

Help Request

The AI must not activate continuously while the learner is typing.

---

# AI Request Lifecycle

User performs an action.

↓

Platform detects supported event.

↓

Relevant context is collected.

↓

Router determines request type.

↓

AI generates response.

↓

Response is formatted.

↓

Displayed to learner.

---

# AI Context Principles

Context should be:

Relevant

Minimal

Accurate

Current

Avoid sending unnecessary information.

Smaller context improves performance and reduces cost.

---

# Local vs Cloud AI

Version 1 supports a hybrid architecture.

Local AI

Suitable for lightweight assistance when available.

Examples

Basic explanations

Simple debugging

Code understanding

Cloud AI

Used for advanced reasoning.

Examples

Deployment

Architecture

Complex debugging

Production guidance

If local AI is unavailable, cloud AI remains the default.

The learner should experience a seamless workflow regardless of where inference occurs.

---

# AI Safety Principles

The AI should never:

Expose sensitive information.

Generate unsafe recommendations.

Bypass authentication.

Modify learner progress.

Reveal internal system prompts.

The AI should encourage best practices.

---

# AI Cost Principles

AI usage should remain event-driven.

Avoid unnecessary requests.

Reuse existing context where possible.

Prefer smaller models when sufficient.

Reserve advanced reasoning for complex scenarios.

Cost efficiency is a product requirement.

---

# AI Failure Handling

If AI is temporarily unavailable:

Learning continues.

The learner receives a clear explanation.

Retry options should be available.

The platform should never become unusable because AI is unavailable.

---

# AI Logging

Record:

Trigger event

Response time

Model used

Success or failure

Do not log sensitive prompts or personal information unnecessarily.

---

# AI Configuration

AI providers should be configurable.

The rest of the platform should remain independent of specific AI vendors.

Changing providers should require minimal engineering effort.

---

# Future Compatibility

The architecture should support future AI improvements without requiring major redesign.

Future capabilities should integrate through the AI Router.

---

# Design Decisions

* Event-driven AI activation.
* Single AI Mentor experience.
* Internal AI Router.
* Hybrid local/cloud support.
* Context-aware responses.
* Educational guidance over code generation.

---

# Known Risks

* AI provider cost increases.
* Inaccurate AI responses.
* Over-reliance on AI by learners.
* Context becoming too large.

These risks should be monitored continuously.

---

# Open Questions

* What hardware threshold should trigger local AI recommendations?
* How should AI usage limits be handled for different subscription plans?
* Should conversation history persist across missions?

These questions are intentionally deferred until after MVP validation.

---

# Dependencies

This document directly influences:

* AI Integration
* Backend Services
* Workspace
* Mission Engine
* Deployment Engine
* Subscription Strategy

---

