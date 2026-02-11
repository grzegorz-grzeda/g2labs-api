# ADR 0007 — Use Structured Logging With Correlation IDs

## Status
Accepted

## Context

We need operational visibility in two environments:
- VPS: public-facing, needs auditability and debugging
- RPi: local, needs lightweight and readable logs

Plain text logs become hard to search and analyze.
We also need to correlate logs across a single request.

## Decision

- Use structured logging (JSON) via a single logger abstraction.
- HTTP transport must attach a correlation/request ID for each request.
- Logs must avoid secrets and sensitive payloads.

Rules:
- Logger is initialized in `infra/logger/`.
- Controllers/middleware log:
  - request start/end
  - route, method, duration
  - correlation id
- Never log secrets (tokens, passwords, raw auth headers).
- Profile differences:
  - VPS: info level by default
  - RPi: debug level optional

## Alternatives Considered

1. Console logging only
2. Text logs with ad-hoc formatting
3. Different logging libs per environment

## Consequences

Positive:
- Better debugging and observability
- Logs can be indexed/searchable (VPS)
- Consistent format across app layers

Negative:
- Requires discipline to avoid logging sensitive data
