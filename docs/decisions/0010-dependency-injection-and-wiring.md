# ADR 0010 — Dependency Injection and Application Wiring Strategy

## Status
Accepted

## Context

The system uses layered architecture:

- core (business logic)
- infra (Mongo, config, logger)
- transports (HTTP now, CoAP later)

We need a consistent way to wire dependencies:

- Services depend on repository ports
- Controllers depend on services
- Repositories depend on Mongo client
- Transports depend on services
- Everything depends on config and logger

We want to avoid:

- Hidden global singletons
- Circular imports
- Tight coupling between modules
- Framework-heavy DI containers

The system must remain lightweight and understandable.

## Decision

We will use **manual dependency injection with explicit wiring in the bootstrap layer**.

### 1. No global service singletons

- Services are created explicitly.
- Repositories are created explicitly.
- Dependencies are passed via constructors or factory functions.

### 2. Composition root

All dependency wiring happens in `src/index.ts`.

Example pattern:

- Load config
- Initialize logger
- Connect Mongo client
- Instantiate repositories
- Instantiate services (inject repositories)
- Register transports (inject services)

This file is the only place where infra and transport layers are connected.

### 3. Dependency passing style

Preferred approach:

- Use constructor injection for classes.
- Or factory functions that accept a `deps` object.

Example:

```ts
const noteRepository = new MongoNoteRepository(mongoClient)
const noteService = new NoteService({ noteRepository })
registerNoteRoutes(app, { noteService })
```

4. No automatic container

We will NOT use:
- Inversify
- Awilix
- NestJS container
- Reflect-metadata injection

Reason:
- Adds complexity
- Not needed at current scale
- Harder to debug
- Overkill for small API server

5. Dependency boundaries

Rules:
- Core services depend only on ports (interfaces).
- Infra implements ports.
- Transports depend on services only.
- Transports must not import repositories directly.

Alternatives Considered
- Global singleton exports (e.g. export const noteService = ...)
- Dependency injection container library
- Framework-based auto-wiring (NestJS)

Consequences

Positive:
- Explicit and readable wiring
- Easy to debug
- No magic behavior
- Easy to test services independently
- Fully compatible with future CoAP transport

Negative:
- Slightly more boilerplate
- Bootstrap file grows as project grows (manageable with grouping)
- Future Considerations

If the project grows significantly:
- We may introduce a lightweight DI container.
- Or split bootstrap into smaller composition modules.
- For now, manual explicit wiring is preferred.