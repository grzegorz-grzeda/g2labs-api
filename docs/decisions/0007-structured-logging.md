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
- Use a shared log envelope across all layers with event-specific fields.
- Profile differences:
  - VPS: info level by default
  - RPi: debug level optional

### Log Structure

All logs share a common envelope. Domain and transport logs add
their own fields on top.

Common envelope fields:
- `ts` (ISO timestamp)
- `level` (debug/info/warn/error)
- `service`
- `env` (vps/rpi)
- `event` (machine-readable event name)
- `msg` (human-readable summary)
- `requestId` (correlation id)
- `traceId` (optional)

#### HTTP-Level Logs (Transport)

Purpose: traffic, routing, latency, status.

Example:
```json
{
  "event": "http.request.completed",
  "msg": "Request completed",
  "requestId": "req_01H...",
  "method": "POST",
  "route": "/v1/notes",
  "path": "/v1/notes",
  "status": 201,
  "durationMs": 42,
  "clientIp": "203.0.113.4",
  "userAgent": "curl/8.0"
}
```

#### High-Level Action Logs (Service or Controller)

Purpose: "who did what, when, why" for business actions.

Example:
```json
{
  "event": "note.created",
  "msg": "Note created",
  "requestId": "req_01H...",
  "actor": {
    "type": "user",
    "id": "user_123",
    "roles": ["admin"]
  },
  "target": {
    "type": "note",
    "id": "note_789"
  },
  "reason": "user_initiated",
  "context": {
    "source": "api",
    "clientApp": "web"
  }
}
```

#### Field Conventions

- `actor`: who performed the action (`type`, `id`, `roles`)
- `target`: what was affected (`type`, `id`)
- `reason`: why it happened (`user_initiated`, `system_policy`, `automation`)
- `context`: how/where it happened (`source`, `clientApp`, `feature`)
- `decision`: authorization/validation outcome (`allowed`, `denied`, `rule`)
- `error`: failure details (`code`, `message`, `details`)

### Log Outputs

Default output is stdout/stderr. This supports containerized and systemd
deployments on VPS and keeps RPi lightweight.

Profile guidance:
- VPS: stdout/stderr only
- RPi: stdout/stderr by default; optional file sink if required

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
