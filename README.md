# Tauri + React + Typescript

# Hospital Management System (HMS)

An open-source desktop application for comprehensive hospital operations management built with Tauri, React, TypeScript, and Supabase.

## Features

- **Patient Management**: Digital records with demographics, medical history, and emergency contacts
- **Appointment Scheduling**: Calendar-based scheduling with provider availability
- **Clinical Workflows**: Integrated symptom recording, diagnosis management, and prescription system
- **Patient Flow Tracking**: End-to-end tracking from registration through discharge
- **Staff Management**: Employee profiles with role-based access control
- **Inventory Management**: Medical supplies tracking with low-stock alerts
- **Financial Management**: Billing, payments, insurance, and payroll
- **Reporting & Analytics**: Comprehensive dashboards and reports

## Technology Stack

- **Desktop Framework**: Tauri 2.x
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod validation
- **Routing**: TanStack Router

## Prerequisites

- Node.js 18+ and pnpm
- Rust (for Tauri)
- Supabase account and project

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd hospital-management-system
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

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
