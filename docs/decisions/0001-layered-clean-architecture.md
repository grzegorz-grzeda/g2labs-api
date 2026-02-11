# ADR 0001 — Use Layered Clean Architecture

## Status
Accepted

## Context

The API server must:

- Support HTTP initially
- Support CoAP in the future
- Be extensible
- Be testable without transport or database
- Avoid business logic duplication

A simple MVC approach tightly coupled to Express would make adding
CoAP difficult and reduce long-term flexibility.

## Decision

We will use a layered architecture with strict separation:

- `core/` — business logic, domain, services, ports, errors
- `infra/` — MongoDB, configuration, logging
- `transports/` — HTTP (Express), future CoAP

Dependency direction:

- transports → core
- infra → core
- core → no dependencies on infra or transports

Business logic must be transport-agnostic and persistence-agnostic.

## Alternatives Considered

1. Classic Express MVC (controllers + models)
2. Monolithic structure without separation
3. Framework-heavy solution (NestJS)

## Consequences

Positive:
- Easy addition of CoAP transport
- Core logic is easily unit-testable
- Clear module boundaries
- Reduced architectural drift

Negative:
- Slightly more boilerplate
- Requires discipline
