# ADR 0008 — Use Self-Contained Feature Modules With Explicit Registration

## Status
Accepted

## Context

The project must be extensible: we want to add new “features” without
rewiring the whole server or mixing unrelated code.

We also want Copilot to follow a repeatable pattern.

## Decision

We adopt a feature module approach where each module has:

- core service logic (in `src/core/services/` or `src/core/**`)
- optional repository port (in `src/core/ports/`)
- infra repository implementation (in `src/infra/mongo/repositories/`)
- transport controllers/routes/validators (in `src/transports/http/**`)

Modules are added via explicit registration:
- `registerXRoutes(app, deps)` for HTTP
- later `registerXCoapHandlers(server, deps)` for CoAP

Dependency injection:
- Services receive ports (repositories) via constructor or factory.
- Transports receive services via a `deps` object from bootstrap.

Rules:
- No hidden global registries for modules.
- Avoid circular imports by keeping each module’s wiring in transport layer or bootstrap.

## Alternatives Considered

1. Flat “controllers/services/models” structure without modules
2. Auto-discovery plugin loading (filesystem scanning)
3. Framework-based module system (NestJS)

## Consequences

Positive:
- Repeatable pattern for new features
- Easier to maintain boundaries
- Easier to onboard and to guide Copilot

Negative:
- Some boilerplate in route wiring and DI setup
