# Clover HMS

A comprehensive, open-source desktop application for complete hospital operations management. Built with modern technologies for reliability, security, and ease of use in clinical environments.

## Overview

Clover HMS provides an integrated platform for managing all aspects of hospital operations—from patient registration and clinical workflows to financial management and quality assurance. Designed for hospitals, clinics, and healthcare facilities of all sizes.

## Key Features

### Clinical Operations
- **Patient Management**: Complete digital records with demographics, medical history, allergies, and emergency contacts
- **Appointment Scheduling**: Intelligent calendar-based scheduling with provider availability and conflict prevention
- **OPD/IPD Management**: Separate workflows for outpatient and inpatient departments
- **Clinical Workflows**: Integrated symptom recording, diagnosis management with ICD-10 codes, and prescription system with drug interaction warnings
- **Patient Flow Tracking**: End-to-end tracking from registration → triage → consultation → treatment → pharmacy → billing → discharge
- **Bed Management**: Real-time bed allocation, status tracking, visual floor plans, and occupancy analytics

### Medical Services
- **Laboratory Services**: Test ordering, sample tracking, results entry, and automated report generation
- **Pharmacy Management**: Medicine inventory, prescription fulfillment, dispensing tracking, and expiry alerts
- **Blood Bank**: Donor management, blood inventory by type, donation tracking, and expiry monitoring
- **Emergency Services**: Ambulance management, emergency call logging, case tracking, and response time analytics
- **Operation Theater Management**: Surgical procedure tracking, OT scheduling, and outcome reporting

### Financial Management
- **Billing & Payments**: Comprehensive billing system with multiple payment methods (cash, card, insurance, online)
- **Insurance Management**: Provider management, policy verification, and automated claim processing
- **Advance Payments**: Deposit tracking and application to bills
- **Expense & Income Tracking**: Categorized financial tracking with detailed reports
- **Hospital Charges**: Configurable service pricing and package management
- **Payroll Processing**: Staff salary management with allowances, deductions, and bonuses

### Administrative Functions
- **Staff Management**: Employee profiles, role-based access control (RBAC), schedule tracking, and department organization
- **Inventory Management**: Medical supplies and equipment tracking with automated low-stock alerts
- **Document Management**: Secure document storage with versioning and granular access control
- **Communication System**: Internal notice board, messaging, and staff schedule distribution
- **Service Packages**: Bundled service offerings with package pricing
- **Quality Management**: Patient feedback collection, complaint tracking, and resolution monitoring

### Reporting & Analytics
- **Real-time Dashboard**: Live metrics for patients, appointments, beds, inventory, and finances
- **Clinical Reports**: Birth certificates, death certificates, operation reports, and patient summaries
- **Financial Reports**: Income statements, expense analysis, payment tracking, and payroll reports
- **Operational Reports**: Appointment statistics, patient demographics, staff utilization, bed occupancy, and emergency response times

## User Roles

Clover HMS supports role-based access control with the following roles:

- **System Administrator**: Full system access including user management and system configuration
- **Hospital Admin**: Hospital-wide management, reporting, and staff oversight
- **Doctor**: Patient records, appointments, clinical documentation, prescriptions, and operations
- **Nurse**: Patient care documentation, vital signs, bed management, and medication administration
- **Receptionist**: Patient registration, appointment scheduling, and OPD/IPD management
- **Lab Technician**: Laboratory test management, sample collection, and results entry
- **Pharmacist**: Medicine inventory, prescription fulfillment, and dispensing
- **Accountant**: Financial management, billing, payments, payroll, and financial reports
- **Inventory Manager**: Supply management and inventory transactions
- **Read-Only Viewer**: View-only access across all modules for auditing and oversight

## Technology Stack

### Core Technologies
- **Desktop Framework**: Tauri 2.x (Rust backend, cross-platform)
- **Frontend**: React 19+ with TypeScript (strict mode)
- **Build Tool**: Vite 7
- **Backend**: Supabase (PostgreSQL with Row Level Security, Auth, Storage, Realtime)
- **UI Components**: shadcn/ui (Radix UI primitives + Tailwind CSS 4)
- **State Management**: Zustand (client state), TanStack Query (server state with caching)
- **Forms**: React Hook Form + Zod validation
- **Routing**: TanStack Router (type-safe routing)
- **Icons**: Heroicons + Lucide React

### Design Philosophy
- **Modern Dark Theme**: Professional color palette optimized for clinical environments
- **Desktop-First**: Native desktop performance with responsive design for tablets
- **Accessibility**: AAA compliance with high contrast ratios for various lighting conditions
- **Typography**: Inter (body), Mona Sans (headings), Poppins (accents) for excellent readability

## Prerequisites

- Node.js 18+ and pnpm
- Rust (for Tauri)
- Supabase account and project

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd clover-hms
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

For frontend development (browser):
```bash
pnpm dev
```

For desktop development (Tauri):
```bash
pnpm tauri:dev
```

### 5. Build for production

```bash
pnpm tauri:build
```

This will generate platform-specific installers in `src-tauri/target/release/bundle/`.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui base components
│   ├── layout/      # Layout components
│   ├── patients/    # Patient-specific components
│   ├── appointments/# Appointment components
│   └── ...          # Other feature components
├── pages/           # Page components (routes)
├── lib/             # Core utilities
├── hooks/           # Custom React hooks
├── stores/          # Zustand stores
├── services/        # Business logic layer
├── types/           # TypeScript definitions
└── config/          # Configuration files
```

## Available Scripts

- `pnpm dev` - Run Vite dev server (browser)
- `pnpm tauri:dev` - Run Tauri desktop app
- `pnpm tauri:build` - Build production installers
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Security & Compliance

- **Row Level Security (RLS)**: Database-first security with PostgreSQL RLS policies
- **Role-Based Access Control (RBAC)**: Granular permissions enforced at both database and UI levels
- **Secure Authentication**: Supabase Auth with JWT tokens
- **Data Encryption**: Encrypted data at rest and in transit
- **Audit Trails**: Comprehensive logging of all critical operations

## Platform Support

Clover HMS builds native installers for:
- **Windows**: `.msi` installer
- **macOS**: `.dmg` installer
- **Linux**: `.deb` and `.AppImage` packages

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/hospital-management-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/hospital-management-system/discussions)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Acknowledgments

Built with modern open-source technologies and designed for the healthcare community.
