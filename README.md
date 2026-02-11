# Small API Server — IoT Control Plane & Edge Gateway

## Overview

This project is a modular, extensible IoT backend system built in Node.js with TypeScript.

It consists of a single codebase that runs in two profiles:

* **VPS (Control Plane)** — remote access, users, dashboards, third-party API aggregation.
* **RPi (Edge Gateway)** — device interaction, offline operation, telemetry caching, local dashboard.

The architecture follows strict layered principles:

* `core/` — transport-agnostic business logic
* `infra/` — MongoDB, configuration, logging
* `transports/` — HTTP (Express), future CoAP
* Composition root in `index.ts`

The system is designed to support:

* Offline-first IoT behavior
* Remote management
* Future CoAP device communication
* Clean separation of concerns
* Extensibility via feature modules

---

# High-Level Architecture

## Control Plane (VPS)

The VPS instance is responsible for:

* Remote access (web UI / mobile app)
* User authentication and admin roles
* Device overview across gateways
* Long-term telemetry aggregation
* Third-party API aggregation (e.g., weather)
* Command orchestration

The VPS does NOT communicate directly with devices.

It communicates only with gateways (RPi instances).

---

## Edge Gateway (RPi)

The Raspberry Pi instance is responsible for:

* Direct communication with IoT devices
* Local telemetry ingestion
* Offline operation
* Caching measurements
* Executing commands locally
* Syncing with VPS when internet is available
* Optional local dashboard on LAN

The RPi must operate without internet connectivity.

---

# Communication Model

## Gateway → VPS (Push-Based Sync)

The RPi pushes data to the VPS periodically.

Sync includes:

* Telemetry batches
* Device state changes
* Event logs

The VPS responds with:

* Pending commands
* Configuration updates

This model works behind NAT and avoids inbound connections to the RPi.

---

# Core Concepts

## Device

A device is identified by:

* `deviceId`
* `gatewayId`
* metadata (type, location, tags)

Devices belong to gateways.

---

## Telemetry

Telemetry events are immutable records:

* timestamp
* deviceId
* measurement payload
* source (edge or control plane)

On RPi:

* Stored locally first
* Marked as pending upload

On VPS:

* Stored long-term
* Used for dashboards and analytics

---

## Commands

Commands represent desired actions:

* target device
* payload
* status lifecycle:

  * queued
  * sent
  * acknowledged
  * completed / failed

Commands originate from VPS and are executed by RPi.

---

# Profiles

The application supports two runtime profiles:

```
APP_PROFILE=vps
APP_PROFILE=rpi
```

Profiles determine:

* Enabled modules
* Authentication strictness
* Logging level
* Rate limiting
* Mongo configuration
* Available endpoints

---

# Technology Stack

* Node.js
* TypeScript
* Express (HTTP transport)
* MongoDB (official driver)
* Zod (validation at transport edge)
* Vitest (testing)
* Future: CoAP transport for device communication

---

# Project Structure

```
src/
  core/          # Domain, services, ports, errors
  infra/         # Mongo, config, logger
  transports/
    http/        # Express routes, controllers, middleware
    coap/        # Future device transport
  index.ts       # Composition root

config/          # Profile-based configuration
docs/decisions/  # ADRs (architecture decisions)
tests/           # Unit & integration tests
```

---

# Architecture Principles

## 1. Transport-Agnostic Core

The core layer:

* Does not import Express
* Does not import Mongo
* Throws typed ApplicationError subclasses
* Operates on DTOs and domain types

This allows:

* HTTP transport today
* CoAP transport tomorrow
* Clean unit testing

---

## 2. Repository Pattern

Core defines repository interfaces.

Infra implements them using MongoDB.

Controllers never access Mongo directly.

---

## 3. Validation at Transport Edge

All incoming HTTP input is validated with Zod.

Services assume validated DTOs.

---

## 4. Explicit Dependency Injection

All wiring happens in `index.ts`.

No global singletons.
No auto-discovery containers.
Dependencies are passed explicitly.

---

## 5. Offline-First Gateway Design

On RPi:

* Telemetry is stored locally.
* Events are queued in an "outbox".
* Sync process sends batches to VPS.
* Commands are executed locally.

This ensures:

* Devices work without internet.
* Data is not lost during outages.

---

# Security Model

## VPS

* User authentication (simple initially)
* Admin role
* Gateway tokens for sync
* Rate limiting
* Structured logging
* HTTPS via reverse proxy

## RPi

* LAN binding by default
* Optional local authentication
* Gateway token for VPS sync
* Future: device-level authentication

---

# Future Roadmap

* Add CoAP transport for device ↔ gateway
* Add OSCORE or DTLS for secure device communication
* Add scheduling engine (timers / automation)
* Add weather aggregation module
* Add metrics endpoint
* Add command retry policies
* Add device shadow state

---

# Development

## Run in Development

```
npm run dev
```

## Build for Production

```
npm run build
npm start
```

## Run Tests

```
npm test
```

---

# Design Goals

* Clean architecture
* Modular feature-based development
* IoT-first mindset
* Offline capability
* Remote control capability
* Extensible and maintainable
* Safe for long-term evolution

---

# Philosophy

This system is not just an Express backend.

It is:

* A control plane
* An edge gateway
* A sync engine
* A device abstraction layer
* A foundation for future IoT automation

It is intentionally structured to evolve.
