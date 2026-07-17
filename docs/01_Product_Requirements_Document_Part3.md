# 31. Navigation System

The navigation system should prioritize clarity over feature density.

The learner should never feel lost.

Navigation should remain consistent across the platform.

Version 1 consists of four primary navigation areas.

Top Navigation

Left Sidebar

Workspace

Right Context Panel

---

# 32. Top Navigation

The top navigation remains visible throughout the authenticated experience.

Items

• Logo

• Current Journey

• Search

• Reputation

• Notifications

• Profile

Purpose

Allow quick access to essential actions without distracting from learning.

---

# 33. Left Sidebar

The left sidebar represents the learner's current roadmap.

Items

Dashboard

Current Journey

Current Mission

Completed Missions

Projects

Settings

The sidebar should collapse on smaller screens.

---

# 34. Dashboard Navigation

The dashboard is the user's home.

Sections

Continue Learning

Today's Progress

Current Journey

Recent Activity

Achievements

Recent Deployments

The primary CTA should always be:

Continue Mission

Never:

Browse Courses

Explore Content

Watch Videos

---

# 35. Journey Navigation

Users enter a Journey.

A Journey contains multiple Missions.

Only one Mission is active at a time.

Completed Missions become read-only references.

Future Missions remain locked until prerequisites are satisfied or the competency assessment is passed.

---

# 36. Mission Navigation

Each Mission consists of four sections.

Overview

↓

Build

↓

Validate

↓

Complete

The learner always knows which phase they're currently in.

---

# 37. Workspace Navigation

The workspace is intentionally distraction-free.

Visible components

Mission Instructions

↓

Code Editor

↓

Terminal

↓

Console Output

↓

AI Mentor

The layout remains identical across all missions.

Consistency reduces cognitive load.

---

# 38. AI Mentor Panel

The AI panel is permanently docked on the right side.

The panel can be collapsed but never removed.

Responsibilities

Explain concepts

Answer questions

Review errors

Guide deployment

Suggest improvements

The AI should reference the current mission context automatically.

---

# 39. Progress Tracking

Progress is based on mission completion.

Not video completion.

Not time spent.

Each Mission contributes toward:

Journey Completion

Builder Reputation

Deployment Readiness

Project Completion

Progress updates only after validation.

---

# 40. Validation System

A mission is complete only when the required outcome is verified.

Examples

Application runs successfully.

Database connection works.

Deployment succeeds.

HTTPS is active.

Domain resolves correctly.

The learner cannot manually mark missions as complete.

---

# 41. Assessment System

Learners may attempt a competency assessment to skip foundational missions.

Assessment Rules

The assessment is practical.

No multiple-choice questions.

Users demonstrate understanding by completing small implementation tasks.

Passing unlocks eligible missions.

Failing redirects the learner to the recommended mission.

---

# 42. Free Trial Flow

Every new user receives a 7-day free trial.

Flow

Sign Up

↓

Verify Email

↓

Complete Onboarding

↓

Trial Starts

↓

Access Full Platform

↓

Trial Reminder

↓

Subscription Prompt

↓

Payment

↓

Continue Learning

If payment is not completed after the trial expires, access to learning content is suspended while preserving all user progress.

---

# 43. Subscription Management

The platform supports recurring subscriptions.

Users can:

View plan

View renewal date

Cancel renewal

Update payment method

Download invoices

Subscription changes should never affect saved progress.

---

# 44. Error Handling

Errors should be actionable.

Never display technical jargon alone.

Instead of

"500 Internal Server Error"

Display

"We couldn't save your progress right now. Please try again in a moment."

Where possible, provide recovery actions.

---

# 45. Empty States

Every empty state should guide the learner.

Example

No Projects

Display

"You haven't launched your first project yet."

Primary Action

Start First Journey

Every empty screen should encourage the next meaningful action.

---

# 46. Loading States

Loading should communicate progress.

Use skeleton loaders where appropriate.

Avoid blank screens.

Long-running operations (such as deployment checks) should provide status updates instead of indefinite spinners.

---

# 47. Accessibility

Version 1 should support:

Keyboard navigation

Readable typography

High contrast where required

Clear focus indicators

Responsive layouts

Accessibility is not optional; it is part of product quality.

---

# End of Part 3