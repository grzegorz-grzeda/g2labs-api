# Copilot Instructions — Small Extensible API Server

This document defines STRICT rules for code generation in this repository.
Copilot must follow these rules.

---

# 1. General Principles

- The project is written in **TypeScript**.
- The architecture follows a **clean layered structure**.
- Business logic must be transport-independent.
- MongoDB access must be abstracted behind repository interfaces.
- The codebase must support future addition of CoAP without rewriting core logic.

---

# 2. Layering Rules (MANDATORY)

The project is divided into these layers:

- `src/core/`
- `src/infra/`
- `src/transports/`

## 2.1 Allowed Dependencies

- `transports` → may depend on `core`
- `infra` → may depend on `core`
- `core` → must NOT depend on `infra` or `transports`

## 2.2 Strict Prohibitions

Copilot MUST NOT:

- Access MongoDB directly from controllers
- Implement business logic in Express route handlers
- Import Express types into `core`
- Import Mongo driver into `core`
- Throw raw string errors
- Return HTTP responses from services

---

# 3. Core Layer Rules (`src/core/`)

The core layer contains:

- domain models
- services
- DTOs
- ports (interfaces)
- typed errors

## 3.1 Services

- Contain all business logic
- Must be pure application logic
- May depend only on:
  - ports
  - domain types
  - DTOs
  - errors

## 3.2 Ports

- Defined as TypeScript interfaces
- Represent external dependencies (repositories, clock, etc.)
- Implemented in `infra/`

## 3.3 Errors

Use typed error classes only:

- `ValidationError`
- `NotFoundError`
- `UnauthorizedError`
- `ForbiddenError`
- `ConflictError`
- `InternalError`

Never throw plain strings or generic `Error` without wrapping.

---

# 4. Infrastructure Layer Rules (`src/infra/`)

## 4.1 Repository Pattern

- All database access must go through repository implementations.
- Repositories implement interfaces from `core/ports`.

Example:
- `NoteRepository` (interface in core)
- `MongoNoteRepository` (implementation in infra)

## 4.2 Mongo Rules

- Expose IDs as strings externally.
- Internally use `ObjectId`.
- Map `_id` to `id` at repository boundary.
- Do not leak Mongo-specific types outside infra.

---

# 5. HTTP Transport Rules (`src/transports/http/`)

## 5.1 Controllers

Controllers must:

1. Validate input
2. Call a service
3. Return standardized JSON response

Controllers must NOT:

- Contain business logic
- Access repositories
- Build Mongo queries

## 5.2 Response Format

Success:
```json
{ "data": ... }

Error:
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```
## 5.3 Error Mapping

Controllers or middleware must map core errors to HTTP status codes:
- ValidationError → 400
- UnauthorizedError → 401
- ForbiddenError → 403
- NotFoundError → 404
- ConflictError → 409
- InternalError → 500

6. Validation Rules

All incoming HTTP input must be validated at the transport layer.
Use schema validation (e.g., Zod).
Only validated DTOs may be passed to services.
Services must assume input is valid.

7. Configuration Rules

Use profile-based config via APP_PROFILE.
Supported profiles:
- vps
- rpi

Do not hardcode secrets.
Config must be centralized in src/infra/config/.

8. Logging Rules

Use structured logging.
Do not log secrets.
Do not log full request bodies for sensitive routes.
Logger must be injectable when possible.

9. Extensibility Rules

Each feature module must contain:
Service (core)
Repository port (core)
Repository implementation (infra)
Controller (transport)
Route registration
Modules must be self-contained and follow existing structure.

10. CoAP Future Compatibility

All business logic must remain transport-agnostic.
When adding features:
Do not assume HTTP-only semantics (cookies, redirects, sessions).
Do not embed HTTP response logic inside services.
Design services so they can be called from a future CoAP handler.

11. Testing Expectations

Core services should be unit-testable without Express or Mongo.
Transport layer may be integration tested.
Repositories may be tested with a test database.

12. Code Quality Rules

Use explicit return types for exported functions.
Avoid any.
Prefer small functions.
Avoid deep nesting.
Use async/await consistently.

13. When Generating New Features

Copilot must:
Create/extend a core service.
Add or update repository port if needed.
Implement infra repository.
Add controller + route.
Add validation schema.
Use typed errors.
Follow response format.