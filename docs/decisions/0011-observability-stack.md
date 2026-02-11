# ADR 0011 — Observability Stack (Logs, Metrics, Tracing)

## Status
Accepted

## Context

We need operational visibility across two environments:
- VPS: public-facing, needs diagnostics and alerting
- RPi: local, resource-constrained

We already use structured logging with correlation IDs.
We need a lightweight, consistent approach for metrics and tracing
that does not couple core services to HTTP semantics.

## Decision

- Keep structured logs as the primary source of observability.
- Add metrics collection at the transport and infra edges.
- Make tracing optional and only enabled by config.

Rules:
- Metrics are gathered in transports and infra only (no metrics in core).
- Expose metrics via an HTTP endpoint (VPS profile) and allow it to be
  disabled for RPi by default.
- Metrics must be labeled with minimal, low-cardinality labels
  (service, route, method, status class).
- Tracing is opt-in and configured via APP_PROFILE and env vars.

Suggested default stack:
- Logs: existing structured logger
- Metrics: Prometheus-compatible exporter
- Tracing: OpenTelemetry (optional)

## Alternatives Considered

1. Logs only
2. Full tracing everywhere by default
3. Vendor-specific observability SDK

## Consequences

Positive:
- Clear baseline for debugging and performance tracking
- Lightweight defaults for RPi
- No impact on core services or future CoAP compatibility

Negative:
- Requires some setup and monitoring infrastructure
- Opt-in tracing means incomplete traces unless enabled consistently
