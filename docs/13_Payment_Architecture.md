# 13_Payment_Architecture.md

# Payment Architecture

## Version 1.0

**Status:** Draft

**Depends On:**

* 01_Product_Requirements_Document.md
* 08_Backend_Architecture.md
* 09_Database_Design.md
* 10_API_Specification.md
* 12_Authentication_Architecture.md

---

# Purpose

This document defines the payment architecture for ShipLab Version 1.

The payment system should be:

* Secure
* Reliable
* Maintainable
* Easy to integrate
* Easy to replace

Payment processing is delegated to trusted third-party providers.

---

# Payment Philosophy

ShipLab sells access to learning.

It does not process financial transactions directly.

Financial operations remain the responsibility of certified payment providers.

The platform only determines access based on verified subscription status.

---

# Supported Providers

Version 1

Primary Provider (India)

Razorpay

Future Provider (International)

Stripe

The application communicates through an internal Billing Service.

The rest of the system should remain independent of payment providers.

---

# Subscription Model

Version 1 supports:

One subscription plan.

Monthly recurring billing.

7-day free trial.

The learner has full platform access during the trial period.

Annual plans, lifetime plans, and team plans are intentionally excluded from the MVP.

---

# Payment Flow

Visitor

↓

Create Account

↓

Verify Email

↓

Complete Onboarding

↓

Free Trial Starts

↓

Access Learning Platform

↓

Trial Reminder

↓

Subscribe

↓

Payment Verification

↓

Subscription Activated

↓

Continue Learning

The payment experience should require as few steps as possible.

---

# Trial Management

Every new learner receives a 7-day free trial.

Rules:

One trial per account.

Trial begins only after onboarding is complete.

Progress created during the trial is permanently preserved.

When the trial expires:

Learning content becomes locked.

User data remains available.

The learner may subscribe at any time to continue.

---

# Billing Service

The Billing Service is the only component that communicates with payment providers.

Responsibilities:

* Create subscriptions
* Verify payments
* Receive payment events
* Update subscription status
* Handle cancellations

No other module communicates directly with Razorpay or Stripe.

---

# Subscription States

A learner may exist in one of the following states:

Trial

Active

Cancelled

Expired

Payment Pending

Suspended

These states determine platform access.

---

# Payment Verification

Payment success is never determined by the frontend.

Only verified payment events update subscription status.

This prevents client-side manipulation.

---

# Webhooks

Payment providers notify ShipLab through secure webhooks.

Examples:

Payment Successful

Subscription Renewed

Subscription Cancelled

Payment Failed

Trial Converted

Webhook events become the source of truth for subscription updates.

---

# Platform Access Rules

Active Subscription

↓

Full Access

Trial

↓

Full Access

Expired Trial

↓

Learning Locked

Cancelled Subscription

↓

Access Until Current Billing Period Ends

Payment Failure

↓

Grace Period (implementation policy)

↓

Learning Locked (if unresolved)

Progress is never deleted.

---

# Refund Philosophy

Refund requests are handled according to the published refund policy.

Financial processing remains the responsibility of the payment provider.

The platform updates access only after receiving verified payment status.

---

# Invoice Management

Invoices remain available through the payment provider.

ShipLab may display invoice history but should not generate invoices independently.

---

# Security Principles

Never store:

* Card numbers
* CVV
* Banking credentials

Only store:

* Subscription identifiers
* Payment references
* Subscription status

Sensitive payment information remains outside the application.

---

# Billing Notifications

Notify learners about:

Trial Expiry

Successful Payment

Payment Failure

Subscription Renewal

Subscription Cancellation

Notifications should remain informative and non-intrusive.

---

# Payment Failure Handling

If payment fails:

Inform the learner.

Explain the issue clearly.

Allow retry.

Preserve all learning progress.

Never delete user data because of payment failure.

---

# Cancellation

Learners may cancel at any time.

Cancellation should:

Prevent future renewals.

Allow access until the current billing period ends.

Require confirmation before completion.

---

# Scalability

The payment architecture should support future providers without requiring major changes to business logic.

The Billing Service acts as an abstraction layer.

---

# Audit Events

Record:

Trial Started

Subscription Activated

Subscription Renewed

Payment Failed

Subscription Cancelled

Refund Processed

These events support troubleshooting and reporting.

---

# Design Decisions

* Third-party payment providers.
* Billing abstraction layer.
* Monthly subscription only.
* Webhook-driven verification.
* One subscription plan for Version 1.

---

# Known Risks

* Payment provider outages.
* Webhook delivery failures.
* Payment disputes.
* Currency differences during international expansion.

These risks should be monitored continuously.

---

# Open Questions

* What should the grace period be after a failed renewal?
* Should discounted student pricing be introduced in a future version?
* Should annual plans be offered after MVP validation?

These questions are intentionally deferred until after Version 1 validation.

---

# Dependencies

This document directly influences:

* Billing Module
* Subscription Management
* User Access Control
* Admin Dashboard
* Analytics

---

# Document Status
