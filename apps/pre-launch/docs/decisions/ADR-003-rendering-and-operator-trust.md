# ADR-003 Visual rendering and operator trust

**Status** Proposed · **Date** 2026-11-26

Use independently layered art and semantic HTML, with CSS-first motion and pre-rendered 3D art. An interactive 3D renderer can be considered after acquiring approved assets and demonstrating a visual gap within the performance budget. Static composition plus progressive enhancement retains the main experience on mobile and unsupported browsers.

Use a dedicated managed operator identity system with mandatory MFA plus local server-side grants and fresh second-factor evidence. Waitlist ownership verification uses dedicated signed-purpose credentials. Platform identity reuse would couple the module to an unimplemented shared service, while self-managed operator auth would add credential and recovery ownership. Managed identity adds an operating cost and requires staging proof of the strict authorization contract. [Reference design](../DESIGN.md) · [Security controls](../SECURITY_PRIVACY.md)
