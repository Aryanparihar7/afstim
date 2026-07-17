# Afstim Design Language

Version: 1.0

Status: Active

Owner:
Afstim Product Team

---

# Purpose

This document defines the permanent visual language of Afstim.

Unlike sprint documents, these principles apply to the entire product.

Every interface should follow these guidelines unless an explicit exception has been approved.

The objective is to create a product that feels timeless, premium, calm, and engineering-focused.

---

# Core Philosophy

Afstim is not a marketing website.

Afstim is a professional software platform.

The interface should prioritize:

- clarity
- hierarchy
- consistency
- focus
- craftsmanship

Visual polish exists to improve usability—not to attract attention.

Whenever a visual decision is uncertain, choose the simpler solution.

---

# Design Principles

## 1. Clarity First

Every design element must communicate purpose.

Nothing should exist purely for decoration.

Users should immediately understand:

- what is important
- what is interactive
- what is secondary

---

## 2. Calm Interfaces

The interface should never feel busy.

Avoid:

- unnecessary gradients
- excessive shadows
- loud colors
- decorative animation

Users should feel relaxed while using Afstim.

---

## 3. Consistency Over Creativity

Consistency creates trust.

Whenever possible:

Reuse

instead of

reinvent.

Spacing

Typography

Borders

Buttons

Cards

Motion

Colors

should all follow shared systems.

---

# Typography Philosophy

Typography is the primary communication tool.

Rules:

• Clear hierarchy

• Comfortable reading width

• Consistent spacing

• Tight but readable tracking

• Strong heading contrast

Maximum readable paragraph width should remain approximately 60–70 characters.

Long paragraphs should never span the full width of large screens.

---

# Whitespace Philosophy

Whitespace is not empty space.

Whitespace guides attention.

Every page should contain:

- breathing room
- intentional separation
- visual rhythm

Crowded layouts are considered defects.

Large empty regions are acceptable when they improve focus.

---

# Visual Hierarchy

Users should instinctively know where to look.

Priority order:

Primary

↓

Secondary

↓

Supporting

↓

Muted

↓

Decorative

Typography

Spacing

Contrast

Elevation

Motion

must reinforce this hierarchy.

Never rely on color alone.

---

# Color Philosophy

Afstim uses color intentionally.

Neutral colors form the interface.

Accent colors communicate interaction.

The Indigo brand color is reserved for:

- Primary actions
- Active navigation
- Recommended plans
- Focus indicators
- Brand identity

Decorative elements should avoid brand colors whenever possible.

Accent colors lose meaning when overused.

---

# Surface Philosophy

Surfaces communicate structure.

Cards

Panels

Sections

Navigation

Dialogs

should feel related through shared surface rules.

Every surface consumes shared design tokens.

Individual components should not invent visual styles.

---

# Border Philosophy

Borders define structure—not decoration.

Borders should remain subtle.

Heavy borders should be avoided.

Borders should never become the dominant visual element.

---

# Radius Philosophy

Corner radius communicates softness.

Afstim uses concentric geometry.

Outer containers use larger radii.

Inner elements use proportionally smaller radii.

Radius values originate from centralized design tokens.

---

# Elevation Philosophy

Elevation communicates interaction.

Not importance.

Depth should remain subtle.

Avoid dramatic shadows.

Avoid floating interfaces.

Shadows should become visible only when necessary.

Every shadow originates from shared elevation tokens.

---

# Motion Philosophy

Motion exists to:

Guide attention

Communicate hierarchy

Provide interaction feedback

Improve perceived quality

Motion must never:

Delay interaction

Distract users

Become decorative

Continuous animation should be avoided.

Reduced Motion preferences must always be respected.

---

# Atmosphere Philosophy

Backgrounds should support content.

Never compete with it.

Atmosphere should be nearly invisible.

Subtle lighting

Gentle depth

Section transitions

Soft visual rhythm

are preferred over obvious effects.

Glassmorphism is prohibited.

Heavy gradients are prohibited.

Visual noise should remain extremely restrained.

---

# Interaction Philosophy

Interactive elements should feel immediate.

Buttons

Links

Cards

Navigation

must provide responsive feedback.

Feedback should feel:

fast

predictable

subtle

Hover interactions should communicate possibility.

Tap interactions should communicate confirmation.

---

# Spacing System

Spacing follows semantic layers.

Page

↓

Section

↓

Content

↓

Component

↓

Element

Components should consume spacing tokens rather than arbitrary spacing values.

---

# Design Tokens

Every reusable visual property must originate from centralized tokens.

Examples include:

Typography

Spacing

Radius

Borders

Elevation

Motion

Backgrounds

Opacity

Transitions

Individual components should consume tokens instead of defining local values.

---

# Accessibility

Accessibility is part of the design.

Maintain:

WCAG-compliant contrast

Visible keyboard focus

Readable typography

Comfortable touch targets

Reduced Motion support

Accessible interfaces are considered premium interfaces.

---

# Performance

Visual quality must never compromise performance.

Prefer:

GPU-friendly animations

Minimal DOM complexity

Shared components

Reusable tokens

Avoid expensive visual effects that negatively impact responsiveness.

---

# What Afstim Avoids

Afstim intentionally avoids:

- flashy animations
- visual clutter
- unnecessary gradients
- heavy glassmorphism
- decorative shadows
- oversized borders
- inconsistent spacing
- inconsistent typography
- random accent colors
- arbitrary component styling

---

# Design Review Checklist

Before any interface is approved, verify:

✓ Typography hierarchy

✓ Visual hierarchy

✓ Spacing consistency

✓ Whitespace rhythm

✓ Border consistency

✓ Surface consistency

✓ Radius consistency

✓ Elevation consistency

✓ Motion consistency

✓ Color consistency

✓ Accessibility

✓ Responsive behaviour

✓ Performance

---

# Guiding Question

Before introducing any visual element, ask:

> Does this improve clarity?

If the answer is no,

it should not be added.