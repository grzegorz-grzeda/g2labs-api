# ADR 0009 — Security Baseline With VPS-First Defaults

## Status
Accepted

## Context

The server runs in two environments:

- VPS: public-facing, threat model includes internet exposure
- RPi: local, often LAN-only, but may still be reachable or misconfigured

We need a baseline that is secure by default on VPS,
while still allowing pragmatic local usage on RPi.

## Decision

Security baseline:

### VPS profile (default: strict)
- Authentication required (API key or JWT)
- CORS locked down to known origins (if browser clients exist)
- Basic rate limiting enabled
- HTTPS termination via reverse proxy (recommended)
- No debug endpoints exposed publicly

### RPi profile (default: pragmatic but safe)
- Authentication recommended (may be configurable to disable)
- Bind to LAN interface only by default (not 0.0.0.0 unless intentional)
- CORS permissive only if needed and limited to local origins
- Rate limiting optional

Common rules:
- Validate all inputs (see ADR 0006)
- Do not log secrets (see ADR 0007)
- Use typed errors (see ADR 0005)

## Alternatives Considered

1. No auth because “personal project”
2. Same strict settings everywhere (painful on LAN prototyping)
3. Forked codebases for VPS and RPi

## Consequences

Positive:
- Safe VPS defaults reduce risk significantly
- RPi remains convenient but not careless
- Works well with profile-based configuration (ADR 0004)

Negative:
- Requires implementing at least simple auth and config toggles
