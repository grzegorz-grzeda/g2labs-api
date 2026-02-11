# ADR 0004 — Support VPS and Raspberry Pi Profiles

## Status
Accepted

## Context

The API server must run in two environments:

1. VPS (public-facing, secure)
2. Raspberry Pi (local, possibly LAN-only)

These environments have different requirements:
- Authentication strictness
- Logging verbosity
- Rate limiting
- MongoDB connection configuration

We want one codebase, not forks.

## Decision

We will implement profile-based configuration using `APP_PROFILE`.

Supported profiles:
- vps
- rpi

Configuration rules:

- Centralized configuration in `infra/config/`.
- Environment variables override profile defaults.
- No secrets committed to repository.
- Profiles may differ in:
  - Auth requirement
  - CORS settings
  - Rate limiting
  - Logging level
  - Mongo URI

## Alternatives Considered

1. Separate branches for VPS and RPi
2. Hardcoded environment detection
3. Multiple codebases

## Consequences

Positive:
- Single codebase
- Clean deployment separation
- Predictable configuration behavior

Negative:
- Slightly more complex config bootstrap
