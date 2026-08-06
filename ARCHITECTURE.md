# Bookento — Architecture Document

> Multi Service Provider Platform — Enterprise SaaS Architecture (Phase 1)

## 1. System Overview

Bookento is a dual-panel SaaS platform (User + Provider) built as a **modular monolith** in Next.js 16, designed for future extraction into microservices without architectural rewrites.

## 2. Architectural Principles

| Principle | Implementation |
|-----------|----------------|
| **Feature Isolation** | Each domain lives in `src/features/{domain}/` |
| **Server-First** | Server Components by default; `"use client"` only when needed |
| **Single Source of Truth** | TanStack Query for server state; Zustand for UI-only state |
| **Type Safety** | Shared types in `src/types/`; Zod schemas per feature |
| **Security** | JWT in httpOnly cookies; middleware RBAC; no localStorage tokens |
| **Scalability** | Virtualized lists, code splitting, optimistic updates |

## 3. Reusable Module Map

See full documentation in project README for layouts, hooks, types, and API layer details.

## 4. Feature Domains

auth, booking, appointments, chat, earnings, services, packages, branches, posts, reels, ratings, categories, wallet, user, provider

## 5. Phase Roadmap

| Phase | Scope |
|-------|-------|
| 1 | Architecture, structure, config |
| 2 | Design system, theme, UI components |
| 3 | Authentication |
| 4 | Provider panel |
| 5 | User panel |
| 6-12 | Booking, Chat, Appointments, Payments, Settings, Optimization, Testing |
