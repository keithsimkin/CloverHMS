# Project Structure

## Directory Organization

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Root component with routing
├── components/              # Reusable UI components
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Sidebar, Header, MainLayout
│   ├── patients/           # Patient-specific components
│   ├── appointments/       # Appointment components
│   ├── staff/              # Staff management components
│   ├── inventory/          # Inventory components
│   ├── clinical/           # Clinical workflow components
│   ├── flow/               # Patient flow components
│   ├── triage/             # Triage components
│   ├── laboratory/         # Laboratory components
│   ├── pharmacy/           # Pharmacy components
│   ├── billing/            # Billing components
│   └── common/             # Shared components
├── pages/                  # Page components (one per route)
│   ├── Dashboard.tsx
│   ├── Patients.tsx
│   ├── Appointments.tsx
│   ├── Staff.tsx
│   ├── Inventory.tsx
│   ├── Clinical.tsx
│   ├── PatientFlow.tsx
│   ├── Triage.tsx
│   ├── Laboratory.tsx
│   ├── Pharmacy.tsx
│   ├── Billing.tsx
│   ├── Settings.tsx
│   └── Login.tsx
├── lib/                    # Core utilities
│   ├── supabase.ts        # Supabase client config
│   ├── auth.ts            # Authentication utilities
│   ├── permissions.ts     # RBAC utilities
│   └── utils.ts           # Helper functions
├── hooks/                  # Custom React hooks
│   ├── usePatients.ts
│   ├── useAppointments.ts
│   ├── useAuth.ts
│   └── usePermissions.ts
├── stores/                 # Zustand stores
│   ├── authStore.ts
│   └── uiStore.ts
├── types/                  # TypeScript definitions
│   ├── database.ts        # Supabase generated types
│   ├── models.ts          # Domain models
│   └── enums.ts           # Enums and constants
├── services/              # Business logic layer
│   ├── patientService.ts
│   ├── appointmentService.ts
│   ├── clinicalService.ts
│   ├── patientFlowService.ts
│   └── agentService.ts
└── config/                # Configuration
    ├── routes.ts          # Route definitions
    ├── permissions.ts     # Permission mappings
    └── theme.ts           # Theme configuration

src-tauri/               # Tauri backend (Rust)
├── src/
│   └── main.rs          # Tauri entry point
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration

.kiro/                   # Kiro workspace
├── specs/               # Project specifications
└── steering/            # AI assistant steering rules
```

## Architectural Patterns

### Component Organization
- **Pages**: Top-level route components, orchestrate data fetching and layout
- **Components**: Reusable UI pieces, organized by feature domain
- **UI Components**: Base shadcn/ui components, no business logic

### Data Flow
- **Services**: Encapsulate Supabase API calls and business logic
- **Hooks**: Custom hooks wrap services with TanStack Query for caching
- **Stores**: Zustand for client-side state (auth, UI preferences)

### Permission System
- Role-based access control (RBAC) enforced at database (RLS) and UI levels
- Permission checks in components using `usePermissions` hook
- Navigation menu filtered by user role

### Naming Conventions
- **Files**: PascalCase for components (`PatientList.tsx`), camelCase for utilities (`patientService.ts`)
- **Components**: PascalCase (`PatientForm`)
- **Functions/Variables**: camelCase (`getPatients`, `patientData`)
- **Types/Interfaces**: PascalCase (`Patient`, `Appointment`)
- **Constants/Enums**: UPPER_SNAKE_CASE (`PERMISSION`, `ERROR_TYPE`)

### Code Organization Rules
- One component per file
- Co-locate related components in feature folders
- Keep components small and focused (< 200 lines)
- Extract complex logic into custom hooks or services
- Use TypeScript strict mode
- Prefer composition over inheritance
