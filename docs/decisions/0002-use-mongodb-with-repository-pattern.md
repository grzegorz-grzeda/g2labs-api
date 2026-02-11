# ADR 0002 — Use MongoDB with Repository Pattern

## Status
Accepted

## Context

The API server needs flexible schema and rapid iteration.
The initial use case does not require relational joins.

Direct Mongo usage inside controllers would tightly couple
business logic to persistence and prevent future storage changes.

## Decision

We will:

- Use MongoDB as primary datastore.
- Use the official MongoDB Node.js driver.
- Abstract database access behind repository interfaces.

Core layer defines repository interfaces in `core/ports/`.

Infra layer implements them in:
`infra/mongo/repositories/`.

Repositories must:
- Map ObjectId to string IDs at the boundary.
- Not leak Mongo-specific types outside infra.

## Alternatives Considered

1. PostgreSQL
2. Mongoose ODM
3. Direct Mongo calls from services

## Consequences

Positive:
- Persistence is replaceable
- Core is storage-agnostic
- Clear separation of concerns

Negative:
- Slightly more boilerplate than direct DB access
