# ADR 0005 — Use Typed Errors in Core With Transport Mapping

## Status
Accepted

## Context

We will support multiple transports (HTTP now, CoAP later).
Each transport has different response codes and conventions.

If core returns HTTP-specific responses (status codes, Express `res` usage),
it becomes impossible to reuse the same logic for CoAP.

We also want predictable error handling across the codebase.

## Decision

- Core will throw **typed error classes** from `src/core/errors/`.
- Transports will catch/map these errors to protocol responses.

Core error types include:
- `ValidationError`
- `NotFoundError`
- `UnauthorizedError`
- `ForbiddenError`
- `ConflictError`
- `InternalError`

Rules:
- Core must never throw raw strings.
- Core must not throw generic `Error` unless wrapped as `InternalError`.
- Errors must expose a stable `code` and a human-readable `message`.
- Optional `details` may be attached for debugging/client display.

Transport mapping examples:
- HTTP: errors → status codes + `{ error: { code, message, details } }`
- CoAP: errors → CoAP response codes + payload

## Alternatives Considered

1. Returning `{ ok: false, ... }` result objects instead of throwing
2. Throwing generic `Error` and string-matching messages
3. Handling errors only in controllers

## Consequences

Positive:
- Transport-agnostic core logic
- Consistent, testable error behavior
- Clean mapping to both HTTP and CoAP

Negative:
- Requires defining and maintaining error classes
