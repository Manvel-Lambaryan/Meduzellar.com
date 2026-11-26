# ADR-002 Database-backed email delivery

**Status** Proposed · **Date** 2026-11-26

Persist email intent with subscription and campaign writes in the same PostgreSQL transaction. Use a scheduled, bounded worker with leases and fencing, one provider idempotency identity per delivery, and durable outcome tracking. On unknown provider outcomes, reconcile within the supported key window and hold unresolved work after expiry.

Post-response work lacks the durability needed for verification and dispatch. An external queue would still require an outbox or a transaction bridge. Revisit that option if the measured queue latency or processing capacity misses the approved target. Provider bulk contacts and scheduled broadcasts would add synchronization boundaries and reduce cancellation granularity. The proposed individual-send model keeps consent and operator approval in Postgres. Before releasing a campaign, the owner must approve the attainable throughput window and review sender quotas. [Delivery operations](../EMAIL_OPERATIONS.md) · [Cost model](../DEPLOYMENT_AND_COSTS.md)
