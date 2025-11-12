---
inclusion: always
---

# Technology Stack

## Core Stack

- **Desktop**: Tauri 2.x (Rust backend, cross-platform)
- **Frontend**: React 18+ with TypeScript (strict mode)
- **Build**: Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **UI**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **State**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod validation
- **Routing**: TanStack Router (type-safe)

## Development Patterns

### Data Flow
- Services layer (`src/services/`) encapsulates all Supabase calls
- Custom hooks (`src/hooks/`) wrap services with TanStack Query for caching/mutations
- Zustand stores (`src/stores/`) for client-only state (auth, UI preferences)
- Never call Supabase directly from components - always use services

### Component Guidelines
- Use shadcn/ui components from `src/components/ui/` as base
- Feature components in domain folders (`src/components/patients/`, etc.)
- Keep components under 200 lines - extract logic to hooks/services
- Use `@heroicons/react` outline icons for primary UI, solid for emphasis

### Forms & Validation
- Always use React Hook Form with Zod schemas
- Define schemas in same file as form component or in `src/types/`
- Validate on blur for better UX

### Database & Security
- PostgreSQL via Supabase with Row Level Security (RLS) enforced
- All queries respect user roles via RLS policies
- Use `usePermissions` hook for UI-level permission checks
- Never bypass RLS - security is database-first

### TypeScript
- Strict mode enabled - no implicit any
- Generate Supabase types: `pnpm supabase gen types typescript`
- Domain models in `src/types/models.ts`, DB types in `src/types/database.ts`

## Key Commands

```bash
# Development
pnpm install              # Install dependencies
pnpm tauri dev           # Run desktop app (Tauri + React)
pnpm dev                 # Run frontend only (browser)

# Production
pnpm tauri build         # Build installers (.msi, .dmg, .deb, .AppImage)

# Code Quality
pnpm type-check          # TypeScript validation
pnpm lint                # ESLint
pnpm format              # Prettier

# Testing
pnpm test                # Run unit tests
pnpm test:watch          # Watch mode
pnpm test:e2e            # E2E tests
```

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Code Style

- Use `pnpm` as package manager (not npm/yarn)
- Async/await over promises chains
- Functional components with hooks (no class components)
- Prefer composition over prop drilling - use context sparingly
- Extract reusable logic to custom hooks
- Use TypeScript inference where possible, explicit types for public APIs
