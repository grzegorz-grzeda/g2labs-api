# ADR 0006 — Validate Input at the Transport Edge

## Status
Accepted

## Context

Incoming requests must be validated to:
- protect core logic from malformed data
- provide consistent client-facing errors
- avoid duplicated validation inside every service method

Validation mechanisms differ by transport:
- HTTP uses JSON bodies, query params, headers
- CoAP uses payloads and options

Core should remain transport-neutral.

## Decision

- All inbound input validation happens in the **transport layer**.
- Validated data is converted into **DTOs** and passed into core services.
- Core services may assume DTOs are valid and well-typed.

Rules:
- Define validation schemas under `src/transports/http/validators/`.
- Validation failures must become `ValidationError` (or be mapped to it).
- DTOs must not reference Express types or request objects.

## Alternatives Considered

1. Validate inside core services (duplicated and transport-specific)
2. No validation (unsafe and fragile)
3. Validate partially in controllers and partially in services

## Consequences

Positive:
- Core remains clean and reusable across transports
- Predictable client errors
- Reduced duplicated validation logic

Negative:
- Requires maintaining schema definitions at the transport edge
