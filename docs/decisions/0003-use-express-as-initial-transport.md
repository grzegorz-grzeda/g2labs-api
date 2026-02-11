# ADR 0003 — Use Express as Initial Transport

## Status
Accepted

## Context

The first transport required is HTTP.
The server must be lightweight, simple, and extensible.

Future requirement:
Support CoAP without rewriting business logic.

## Decision

We will:

- Use Express.js for HTTP transport.
- Keep Express logic confined to `transports/http/`.
- Keep controllers thin:
  - Validate input
  - Call core services
  - Map errors to HTTP responses
- Never embed business logic inside route handlers.

We explicitly design services to be transport-agnostic
so they can later be reused by a CoAP transport.

## Alternatives Considered

1. Fastify
2. NestJS
3. Koa

## Consequences

Positive:
- Large ecosystem
- Minimal abstraction
- Easy onboarding

Negative:
- No built-in architecture enforcement
- Requires discipline to maintain layering
