# Product brief

**Status** Proposed for Phase A sign-off

Create a credible Meduzellar first impression and collect consent for an official launch announcement. The primary path is visitor → registration → verification → active subscription → owner-approved notification. Visitors can unsubscribe and request deletion. Staff can manage one official-launch campaign, view aggregate outcomes, and recover interrupted work.

The reference composition uses the MR monogram, wordmark, robotic jellyfish, metallic and sapphire-glass Coming Soon headline, five capability cards, waitlist and configured social links. The cards describe forthcoming Marketplace, Jobs, Communication, Calls & Meetings and AI Assistant capabilities. Platform accounts, Marketplace, Network, Telegram, AI, product infrastructure and unrelated marketing sit outside this module.

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| PL-01 | Cinematic page with real HTML controls. | Owner review of desktop/tablet/mobile screenshots. Brand assets, readable type and accurately labelled feature cards. |
| PL-02 | Accessible responsive form and reduced motion. | Keyboard and screen-reader walkthrough, automated scan and 320–1920 CSS px browser matrix. |
| PL-03 | Consent, deduplication and verification. | Versioned consent and one pending record under concurrent registration. Valid proof activates. Confirmation queues once per consent generation. |
| PL-04 | Unsubscribe and deletion. | Browser and one-click flows suppress new sends. Verified deletion removes data under the approved policy, including restore handling. |
| PL-05 | Controlled campaign. | Immutable preview, bounded test send, eligible count, MFA and explicit owner approval, durable scheduling, pause and cancel. |
| PL-06 | Durable delivery and reconciliation. | Recovery from worker interruption, provider timeout and out-of-order events. One delivery identity per campaign and subscriber, with visible unknown outcomes. |
| PL-07 | Production readiness. | Dedicated environments, access review, signed events, privacy notice, spend limits, restore exercise and release authorization. |

Use the supplied Coming Soon heading and ecosystem description. Proposed consent copy is “Email me when Meduzellar launches.” Place the privacy notice beside an affirmative, unchecked control. Verification and confirmation fulfil the request. Broader marketing, analytics pixels and account migration require separate approval and disclosed purpose.

English is the proposed initial UI and email locale. Keep UI and message content in locale resources and use English for unknown locale values. The Product Owner supplies real social destinations, canonical URL, controller identity and privacy contact.

Proposed service objectives are p95 verification handoff within five minutes during normal operation and launch dispatch within the approved campaign window. Report provider acceptance separately from receiving-server delivery. Target WCAG 2.2 AA and field p75 LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. Pre-release lab results are preliminary. [Design](DESIGN.md) · [Verification plan](PROGRESS.md)
