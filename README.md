# Bookento

**Multi Service Provider Platform** — Enterprise SaaS built with Next.js 16, React 19, and TypeScript.

A dual-panel platform (User + Provider) for discovering, booking, and managing multi-category service appointments — similar to UrbanClap/Urban Company at scale.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TailwindCSS v4, Shadcn UI, Radix UI |
| State | TanStack Query (server), Zustand (UI) |
| Forms | React Hook Form + Zod |
| HTTP | Axios with interceptors |
| Animation | Framer Motion |
| Lists | React Virtuoso |

## Getting Started

### Prerequisites

- Node.js >= 20
- npm or pnpm

### Installation

```bash
# Clone and install
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Guest-only routes (login, register)
│   ├── (user)/             # User panel routes
│   └── (provider)/         # Provider panel routes (/provider/*)
├── components/
│   ├── ui/                 # Shadcn UI primitives (Phase 2)
│   ├── layout/             # Shell layouts, bottom nav
│   └── shared/             # EmptyState, MetricCard, etc.
├── features/               # Feature-isolated modules
│   ├── auth/
│   ├── booking/
│   ├── appointments/
│   ├── chat/
│   ├── earnings/
│   └── ...
├── services/api/           # Axios client, endpoints, error handling
├── store/                  # Zustand stores (UI state only)
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities, query client
├── types/                  # Shared TypeScript types
├── constants/              # Routes, query keys, status enums
├── config/                 # App configuration
├── providers/              # React context providers
└── styles/                 # Global CSS, theme tokens
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design, reusable module map, and phase roadmap.

### Dual Panel Routing

| Panel | Base Path | Auth |
|-------|-----------|------|
| User | `/` | `/login` |
| Provider | `/provider` | `/provider/login` |

### State Management Rules

- **TanStack Query** — All API/server data (never duplicate in Zustand)
- **Zustand** — Theme, modals, drawers, booking draft, filters only
- **React Hook Form + Zod** — All form validation

### Security

- JWT stored in **httpOnly cookies** (never localStorage)
- Role-based middleware (user vs provider)
- Provider status gating (pending/rejected cannot access dashboard)
- CSRF-ready headers

## Development Phases

| Phase | Status | Scope |
|-------|--------|-------|
| 1 | ✅ Complete | Architecture, structure, config |
| 2 | Pending | Design system, Shadcn components |
| 3 | Pending | Authentication flows |
| 4 | Pending | Provider panel |
| 5 | Pending | User panel |
| 6-12 | Pending | Booking, Chat, Appointments, Payments, Settings, Optimization, Testing |

## License

Private — All rights reserved.
