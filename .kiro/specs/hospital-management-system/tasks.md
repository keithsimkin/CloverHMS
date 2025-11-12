# Implementation Plan

## Phase 1: Project Foundation

- [ ] 1. Initialize Tauri + React + Vite project structure
  - Create new Tauri project with React and TypeScript template using `pnpm create tauri-app`
  - Configure Vite build settings for Tauri in vite.config.ts
  - Set up project folder structure (src/components, src/pages, src/lib, src/hooks, src/stores, src/services, src/types, src/config)
  - Initialize Git repository with .gitignore for Tauri/React projects
  - Install core dependencies: @supabase/supabase-js, @tanstack/react-query, @tanstack/react-router, react-hook-form, zod, zustand
  - _Requirements: 7.1, 7.2_

## Phase 2: Backend Setup

- [ ] 2. Configure Supabase and database schema
- [ ] 2.1 Set up Supabase project and connection
  - Create Supabase project at supabase.com and obtain API credentials
  - Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  - Create src/lib/supabase.ts with Supabase client configuration
  - Test connection by querying Supabase
  - _Requirements: 6.1, 5.10_

- [ ] 2.2 Create core database schema
  - Execute SQL for core tables: patients, appointments, staff, inventory_items, inventory_transactions
  - Execute SQL for clinical tables: symptoms, patient_symptoms, medicines, prescriptions, diagnoses, patient_diagnoses, patient_visits
  - Execute SQL for patient flow tables: patient_flows, flow_transitions, triage_records, laboratory_orders, pharmacy_dispenses, billing_records, discharge_records
  - Execute SQL for automation tables: agent_hooks, hook_executions, steering_rules
  - Create all database indexes for performance
  - _Requirements: 6.1, 1.1, 2.1, 3.1, 4.1, 11.1, 12.1, 13.1_

- [ ] 2.3 Create extended database schema
  - Execute SQL for bed management: beds, bed_allocations, bed_transfers
  - Execute SQL for blood bank: blood_donors, blood_donations, blood_usage
  - Execute SQL for emergency services: ambulances, emergency_calls, emergency_cases
  - Execute SQL for financial: insurance_providers, patient_insurance, insurance_claims, advance_payments, expenses, income, hospital_charges, payroll
  - Execute SQL for reporting: birth_reports, death_reports, operation_reports
  - Execute SQL for communication: notices, internal_mail, staff_schedules
  - Execute SQL for services: service_packages, package_subscriptions, doctor_opd_charges
  - Execute SQL for quality: inquiries
  - Execute SQL for documents: documents, document_versions
  - Execute SQL for OPD/IPD: opd_visits, ipd_admissions
  - Create all additional indexes
  - _Requirements: 15.1, 16.1, 17.1, 18.1, 19.1, 20.1, 21.1, 22.1, 23.1, 25.1_

- [ ] 2.4 Configure Row Level Security policies
  - Enable RLS on all core tables
  - Create RLS policies for base roles: admin, doctor, nurse, receptionist, inventory_manager, viewer
  - Create RLS policies for extended roles: lab_technician, pharmacist, accountant, hospital_admin
  - Test RLS policies with different user roles
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 24.1, 24.2, 24.3, 24.4_

## Phase 3: UI Foundation

- [ ] 3. Set up shadcn/ui and dark theme
- [ ] 3.1 Install and configure Tailwind CSS
  - Install Tailwind CSS, PostCSS, and Autoprefixer
  - Create tailwind.config.js with dark color scheme (Rich Black, Gunmetal, Prussian Blue, Cool Gray, Mint Cream, Imperial Red)
  - Configure Tailwind content paths to scan src/**/*.{ts,tsx}
  - Create src/index.css with Tailwind directives and custom CSS variables
  - Configure font families: Inter (body), Mona Sans (headings), Poppins (buttons)
  - _Requirements: 7.1, 7.2, 7.8_

- [ ] 3.2 Initialize shadcn/ui components
  - Run `pnpm dlx shadcn-ui@latest init` to initialize shadcn/ui
  - Install essential components: button, input, form, table, dialog, toast, card, select, calendar, tabs, badge, dropdown-menu, command, popover, separator, label, checkbox, textarea, alert, scroll-area
  - Verify components render correctly with dark theme
  - Test accessibility contrast ratios (AAA for primary text, AA for secondary)
  - _Requirements: 7.2, 7.5, 7.8_

- [ ] 4. Implement authentication system
- [ ] 4.1 Create authentication utilities and store
  - Create lib/auth.ts with authentication helper functions
  - Create stores/authStore.ts with Zustand for auth state management
  - Implement login, logout, and session management functions
  - Implement account lockout logic (3 failed attempts, 15-minute lockout)
  - Implement 30-minute inactivity timeout
  - _Requirements: 5.1, 5.2, 5.11_

- [ ] 4.2 Build login page and protected routes
  - Create pages/Login.tsx with email/password form using React Hook Form and Zod validation
  - Implement login form submission with Supabase Auth
  - Create route protection wrapper component
  - Set up TanStack Router with protected routes
  - Implement automatic redirect to login for unauthenticated users
  - _Requirements: 5.1, 5.2_

- [ ] 5. Implement role-based permission system
- [ ] 5.1 Create permission configuration and utilities
  - Create types/enums.ts with Permission enum
  - Create config/permissions.ts with role-to-permissions mapping
  - Create lib/permissions.ts with permission checking functions
  - Create hooks/usePermissions.ts for component-level permission checks
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

- [ ] 5.2 Implement permission-based UI rendering
  - Create ProtectedComponent wrapper that checks permissions
  - Implement navigation menu filtering based on user permissions
  - Add permission checks to all action buttons and forms
  - _Requirements: 5.12_

- [ ] 6. Build layout and navigation
- [ ] 6.1 Create main layout components
  - Create components/layout/Sidebar.tsx with navigation menu
  - Create components/layout/Header.tsx with user info and logout
  - Create components/layout/MainLayout.tsx combining sidebar and header
  - Implement responsive layout for different screen sizes
  - _Requirements: 7.3_

- [ ] 6.2 Set up routing and navigation
  - Create config/routes.ts with all application routes
  - Configure TanStack Router with route definitions
  - Implement navigation links in sidebar with active state
  - Add breadcrumb navigation in header
  - _Requirements: 7.3_

- [ ] 7. Implement patient management module
- [ ] 7.1 Create patient data models and services
  - Create types/models.ts with Patient interface
  - Create services/patientService.ts with CRUD operations
  - Create hooks/usePatients.ts with TanStack Query for data fetching
  - Implement patient search functionality with debouncing
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 7.2 Build patient list and search interface
  - Create components/patients/PatientList.tsx with table display
  - Implement pagination (20 records per page)
  - Create components/patients/PatientSearch.tsx with search input
  - Add loading indicators and empty states
  - _Requirements: 1.2, 1.4, 7.4_

- [ ] 7.3 Build patient form for create/edit
  - Create components/patients/PatientForm.tsx with React Hook Form
  - Implement Zod validation schema for patient data
  - Create form fields for all patient attributes (name, DOB, contact, emergency contact, blood type, allergies, medical history)
  - Implement form submission with optimistic updates
  - Display validation errors for missing required fields
  - _Requirements: 1.1, 1.3, 1.5_

- [ ] 7.4 Create patient details view
  - Create components/patients/PatientDetails.tsx showing full patient information
  - Display patient medical history and visit records
  - Add edit and delete actions with permission checks
  - _Requirements: 1.3_

- [ ] 7.5 Build patients page
  - Create pages/Patients.tsx integrating list, search, and form components
  - Implement create patient dialog
  - Implement edit patient dialog
  - Add toast notifications for success/error feedback
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.5_

- [ ] 8. Implement appointment scheduling module
- [ ] 8.1 Create appointment data models and services
  - Create Appointment interface in types/models.ts
  - Create services/appointmentService.ts with CRUD operations
  - Create hooks/useAppointments.ts with TanStack Query
  - Implement double-booking prevention logic
  - _Requirements: 2.2, 2.3_

- [ ] 8.2 Build calendar interface
  - Create components/appointments/AppointmentCalendar.tsx with day/week/month views
  - Integrate calendar library or build custom calendar component
  - Display appointments on calendar with color coding by status
  - Implement date navigation controls
  - _Requirements: 2.1_

- [ ] 8.3 Build appointment form
  - Create components/appointments/AppointmentForm.tsx with React Hook Form
  - Implement patient selection dropdown with search
  - Implement provider (staff) selection dropdown
  - Add date/time pickers for appointment scheduling
  - Add appointment type and notes fields
  - Implement validation and double-booking check
  - _Requirements: 2.2, 2.3_

- [ ] 8.4 Implement appointment notifications
  - Create notification service for upcoming appointments
  - Query appointments within 24 hours
  - Display pending notifications list in dashboard
  - _Requirements: 2.4_

- [ ] 8.5 Build appointments page
  - Create pages/Appointments.tsx with calendar and list views
  - Implement create appointment dialog
  - Implement edit/cancel/reschedule appointment actions
  - Add toast notifications for actions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 9. Implement staff management module
- [ ] 9.1 Create staff data models and services
  - Create Staff interface in types/models.ts
  - Create services/staffService.ts with CRUD operations
  - Create hooks/useStaff.ts with TanStack Query
  - _Requirements: 3.1_

- [ ] 9.2 Build staff list and filtering
  - Create components/staff/StaffList.tsx with table display
  - Implement filtering by department, role, and employment status
  - Add search functionality for staff members
  - _Requirements: 3.3_

- [ ] 9.3 Build staff form
  - Create components/staff/StaffForm.tsx with React Hook Form
  - Add fields for employee ID, name, role, department, specialization, contact info, employment status, hire date
  - Implement unique employee ID validation
  - Link staff to Supabase auth users for system access
  - _Requirements: 3.1, 3.2, 3.5_

- [ ] 9.4 Build staff schedule view
  - Create components/staff/StaffSchedule.tsx displaying shifts and availability
  - Implement schedule calendar view
  - _Requirements: 3.4_

- [ ] 9.5 Build staff page
  - Create pages/Staff.tsx integrating list, form, and schedule components
  - Implement create/edit/deactivate staff actions (admin only)
  - Add permission checks for staff management
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 10. Implement inventory management module
- [ ] 10.1 Create inventory data models and services
  - Create InventoryItem and InventoryTransaction interfaces in types/models.ts
  - Create services/inventoryService.ts with CRUD and transaction operations
  - Create hooks/useInventory.ts with TanStack Query
  - Implement low-stock alert logic
  - _Requirements: 4.1, 4.2_

- [ ] 10.2 Build inventory list and categories
  - Create components/inventory/InventoryList.tsx with table display
  - Group inventory items by category
  - Display low-stock alerts with visual indicators
  - Implement search and filtering
  - _Requirements: 4.1, 4.2, 4.4_

- [ ] 10.3 Build inventory item form
  - Create components/inventory/InventoryItemForm.tsx with React Hook Form
  - Add fields for item code, name, category, quantity, unit of measure, reorder threshold, cost, supplier, location, expiry date
  - Implement validation for required fields
  - _Requirements: 4.1_

- [ ] 10.4 Build inventory transaction interface
  - Create components/inventory/InventoryTransaction.tsx for recording transactions
  - Implement transaction types (addition, usage, adjustment, disposal)
  - Update inventory quantity after transaction
  - Display transaction history for each item
  - _Requirements: 4.3, 4.5_

- [ ] 10.5 Build inventory page
  - Create pages/Inventory.tsx integrating list, form, and transaction components
  - Implement create/edit inventory items
  - Implement record transaction dialog
  - Add permission checks for inventory management
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 11. Implement medical knowledge databases
- [ ] 11.1 Create symptoms database and interface
  - Create Symptom and PatientSymptom interfaces in types/models.ts
  - Create services/clinicalService.ts with symptom operations
  - Create hooks/useSymptoms.ts for symptom data fetching
  - Seed symptoms database with common symptoms across categories
  - _Requirements: 11.1, 11.5_

- [ ] 11.2 Build symptom search and selection
  - Create components/clinical/SymptomSearch.tsx with searchable dropdown
  - Implement search by name or category with 2-second response time
  - Display symptom details (description, category, body system)
  - _Requirements: 11.2_

- [ ] 11.3 Create medicines database and interface
  - Create Medicine and Prescription interfaces in types/models.ts
  - Add medicine operations to services/clinicalService.ts
  - Create hooks/useMedicines.ts for medicine data fetching
  - Seed medicines database with common medications
  - _Requirements: 12.1, 12.2_

- [ ] 11.4 Build medicine search and prescription
  - Create components/clinical/MedicineSearch.tsx with searchable dropdown
  - Implement search by name, generic name, or therapeutic category
  - Display medicine details (dosage forms, strength options, contraindications, side effects, interactions)
  - _Requirements: 12.5_

- [ ] 11.5 Implement drug interaction warnings
  - Create drug interaction checking logic in services/clinicalService.ts
  - Display warnings when prescribing multiple medicines with known interactions
  - _Requirements: 12.4_

- [ ] 11.6 Create diagnosis database and interface
  - Create Diagnosis and PatientDiagnosis interfaces in types/models.ts
  - Add diagnosis operations to services/clinicalService.ts
  - Create hooks/useDiagnoses.ts for diagnosis data fetching
  - Seed diagnoses database with ICD-10 codes and descriptions
  - _Requirements: 13.1_

- [ ] 11.7 Build diagnosis search and recording
  - Create components/clinical/DiagnosisSearch.tsx with searchable dropdown
  - Implement diagnostic suggestions based on recorded symptoms
  - Add fields for severity, status, and clinical notes
  - _Requirements: 13.2, 13.3, 13.5, 13.6_

- [ ] 12. Implement clinical workflow integration
- [ ] 12.1 Create patient visit data models and services
  - Create PatientVisit interface in types/models.ts
  - Add visit operations to services/clinicalService.ts
  - Create hooks/useVisits.ts for visit data fetching
  - _Requirements: 14.1_

- [ ] 12.2 Build patient visit interface
  - Create components/clinical/PatientVisitForm.tsx for documenting visits
  - Display patient history (previous symptoms, diagnoses, active prescriptions)
  - Implement guided workflow: symptoms → diagnosis → prescription
  - Add vital signs entry section
  - Add chief complaint and visit summary fields
  - _Requirements: 14.1, 14.2_

- [ ] 12.3 Integrate symptoms recording in visit
  - Add symptom selection and recording to visit form
  - Link recorded symptoms to visit record
  - Display timestamp and recording user
  - _Requirements: 11.3, 11.4_

- [ ] 12.4 Integrate diagnosis recording in visit
  - Add diagnosis selection and recording to visit form
  - Associate symptoms with diagnoses
  - Display diagnosis history for patient
  - _Requirements: 13.2, 13.3, 13.4_

- [ ] 12.5 Integrate prescription creation in visit
  - Add prescription form to visit interface
  - Create prescription records linked to visit
  - Display prescription history for patient
  - _Requirements: 12.3, 12.6_

- [ ] 12.6 Build visit summary and reports
  - Create visit summary section with all recorded data
  - Add follow-up recommendations field
  - Implement visit report generation (print/export)
  - _Requirements: 14.3, 14.4, 14.5_

- [ ] 12.7 Build clinical page
  - Create pages/Clinical.tsx with patient search and visit interface
  - Implement start visit workflow
  - Display patient clinical history
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 13. Implement patient flow management
- [ ] 13.1 Create patient flow data models and services
  - Create PatientFlow, FlowTransition, FlowStage interfaces in types/models.ts
  - Create services/patientFlowService.ts with flow operations
  - Create hooks/usePatientFlow.ts for flow data fetching
  - _Requirements: Requirements for patient flow from arrival to discharge_

- [ ] 13.2 Build patient flow dashboard
  - Create components/flow/FlowDashboard.tsx showing all patients in hospital
  - Display patients grouped by current stage
  - Show wait time indicators for each patient
  - Implement color coding by priority level
  - Add quick actions to transition patients between stages
  - _Requirements: Patient flow tracking_

- [ ] 13.3 Implement patient registration flow
  - Create flow start function when patient arrives
  - Set initial stage to REGISTRATION
  - Record arrival time
  - Link flow to patient and visit records
  - _Requirements: Patient flow - registration stage_

- [ ] 13.4 Build triage interface
  - Create TriageRecord interface in types/models.ts
  - Create components/triage/TriageForm.tsx for triage assessment
  - Add vital signs entry (temperature, BP, heart rate, respiratory rate, O2 saturation, pain level)
  - Add priority level selection (critical, urgent, semi-urgent, non-urgent)
  - Add chief complaint field
  - Record triage timestamp and user
  - Transition patient to TRIAGE stage
  - _Requirements: Patient flow - triage stage_

- [ ] 13.5 Build triage page
  - Create pages/Triage.tsx with queue of patients waiting for triage
  - Display triage form for selected patient
  - Show priority-based ordering
  - _Requirements: Patient flow - triage stage_

- [ ] 13.6 Implement laboratory orders
  - Create LaboratoryOrder interface in types/models.ts
  - Create components/laboratory/LabOrderForm.tsx for ordering tests
  - Add test type, test name, and priority fields
  - Track order status (ordered, sample collected, in progress, completed, cancelled)
  - Record results when available
  - Transition patient to LABORATORY stage when tests ordered
  - _Requirements: Patient flow - laboratory stage_

- [ ] 13.7 Build laboratory page
  - Create pages/Laboratory.tsx with pending lab orders
  - Implement sample collection tracking
  - Implement results entry interface
  - Display completed results
  - _Requirements: Patient flow - laboratory stage_

- [ ] 13.8 Implement pharmacy dispensing
  - Create PharmacyDispense interface in types/models.ts
  - Create components/pharmacy/DispenseForm.tsx for medication dispensing
  - Link to prescriptions from visits
  - Record quantity dispensed and counseling provided
  - Transition patient to PHARMACY stage
  - _Requirements: Patient flow - pharmacy stage_

- [ ] 13.9 Build pharmacy page
  - Create pages/Pharmacy.tsx with pending prescriptions
  - Display prescription details
  - Implement dispense interface
  - Track dispensing history
  - _Requirements: Patient flow - pharmacy stage_

- [ ] 13.10 Implement billing system
  - Create BillingRecord interface in types/models.ts
  - Create components/billing/BillingForm.tsx for generating bills
  - Calculate total from consultation fee, medication cost, laboratory cost, procedure cost
  - Track payment status (pending, partial, paid)
  - Record payment method and amount paid
  - Transition patient to BILLING stage
  - _Requirements: Patient flow - billing stage_

- [ ] 13.11 Build billing page
  - Create pages/Billing.tsx with pending bills
  - Display bill breakdown
  - Implement payment recording interface
  - Generate receipts
  - _Requirements: Patient flow - billing stage_

- [ ] 13.12 Implement discharge process
  - Create DischargeRecord interface in types/models.ts
  - Create components/flow/DischargeForm.tsx for patient discharge
  - Add discharge type, summary, follow-up requirements, medications, and instructions fields
  - Record discharge time
  - Calculate total visit time
  - Transition patient to DISCHARGE stage
  - _Requirements: Patient flow - discharge stage_

- [ ] 13.13 Build patient flow page
  - Create pages/PatientFlow.tsx with real-time flow dashboard
  - Display queue management for each stage
  - Implement stage transition controls
  - Show flow metrics and statistics
  - _Requirements: Patient flow management_

- [ ] 14. Implement dashboard and reporting
- [ ] 14.1 Build dashboard statistics
  - Create components/dashboard/StatsCards.tsx showing key metrics
  - Display total patients, upcoming appointments, active staff, low-stock items
  - Implement real-time data updates
  - _Requirements: 8.1_

- [ ] 14.2 Build appointment statistics
  - Create components/dashboard/AppointmentStats.tsx with charts
  - Display appointments by day, week, or month
  - Show appointment trends over time
  - _Requirements: 8.2_

- [ ] 14.3 Build patient demographics
  - Create components/dashboard/PatientDemographics.tsx with charts
  - Display age distribution
  - Show visit frequency statistics
  - _Requirements: 8.3_

- [ ] 14.4 Build staff utilization report
  - Create components/dashboard/StaffUtilization.tsx with charts
  - Display appointment counts per provider
  - Show staff workload distribution
  - _Requirements: 8.4_

- [ ] 14.5 Implement report export
  - Create export utility for CSV format
  - Add export buttons to all report components
  - _Requirements: 8.5_

- [ ] 14.6 Build dashboard page
  - Create pages/Dashboard.tsx integrating all dashboard components
  - Implement responsive grid layout
  - Add date range filters for reports
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 15. Implement agent hooks system
- [ ] 15.1 Create agent hooks data models and services
  - Create AgentHook and HookExecution interfaces in types/models.ts
  - Create services/agentService.ts with hook operations
  - Create hooks/useAgentHooks.ts for hook data fetching
  - _Requirements: 9.1_

- [ ] 15.2 Build hook execution engine
  - Implement event emitter for hook triggers
  - Create hook execution logic for different action types (validate, notify, generate_recommendation)
  - Record hook execution results
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 15.3 Build hooks configuration interface
  - Create components/settings/HooksManager.tsx for managing hooks
  - Implement create/edit/delete hook forms
  - Add enable/disable toggle for hooks
  - Display hook execution history
  - _Requirements: 9.1, 9.5_

- [ ] 15.4 Integrate hooks with patient events
  - Trigger hooks on patient.created and patient.updated events
  - Implement data completeness validation hook
  - _Requirements: 9.2_

- [ ] 15.5 Integrate hooks with appointment events
  - Trigger hooks on appointment.created event
  - Implement scheduling conflict check hook
  - Implement appointment notification hook
  - _Requirements: 9.3_

- [ ] 15.6 Integrate hooks with inventory events
  - Trigger hooks on inventory.low_stock event
  - Implement purchase order recommendation hook
  - _Requirements: 9.4_

- [ ] 16. Implement agent steering system
- [ ] 16.1 Create steering rules data models and services
  - Create SteeringRule interface in types/models.ts
  - Add steering operations to services/agentService.ts
  - Create hooks/useSteeringRules.ts for steering data fetching
  - _Requirements: 10.1_

- [ ] 16.2 Build steering rules loader
  - Implement loader for .kiro/steering directory
  - Parse steering rule configuration files
  - Apply rules based on conditions (role, context)
  - _Requirements: 10.1, 10.4_

- [ ] 16.3 Integrate steering with data validation
  - Apply steering rules to patient record validation
  - Apply steering rules to appointment validation
  - Apply steering rules to inventory validation
  - Apply steering rules to clinical data validation
  - _Requirements: 10.2, 10.3_

- [ ] 16.4 Build steering rules configuration interface
  - Create components/settings/SteeringManager.tsx for managing rules
  - Implement create/edit/delete rule forms
  - Add enable/disable toggle for rules
  - Provide documentation templates for custom rules
  - _Requirements: 10.5_

- [ ] 17. Build settings page
- [ ] 17.1 Create settings page structure
  - Create pages/Settings.tsx with tabbed interface
  - Add tabs for user profile, agent hooks, steering rules, system settings
  - _Requirements: Settings management_

- [ ] 17.2 Build user profile settings
  - Create components/settings/UserProfile.tsx for updating user info
  - Implement password change functionality
  - Display user role and permissions
  - _Requirements: User profile management_

- [ ] 17.3 Integrate hooks and steering managers
  - Add HooksManager component to settings page
  - Add SteeringManager component to settings page
  - _Requirements: 9.5, 10.5_

- [ ] 18. Implement error handling and loading states
- [ ] 18.1 Create error handling utilities
  - Create error types enum in types/enums.ts
  - Create error transformation utilities
  - Implement global error boundary component
  - _Requirements: Error handling_

- [ ] 18.2 Add loading indicators
  - Create loading spinner component
  - Add loading states to all data fetching operations
  - Implement skeleton loaders for tables and cards
  - _Requirements: 7.4_

- [ ] 18.3 Implement toast notifications
  - Configure toast provider in App.tsx
  - Add success/error toasts to all CRUD operations
  - Implement network error notifications
  - _Requirements: 7.5, 6.3_

- [ ] 19. Polish UI and user experience
- [ ] 19.1 Implement responsive design
  - Test all pages on different screen sizes
  - Adjust layouts for mobile and tablet views
  - Ensure touch-friendly interactions
  - _Requirements: UI/UX_

- [ ] 19.2 Add keyboard shortcuts
  - Implement common keyboard shortcuts (Ctrl+S for save, Esc to close dialogs)
  - Add keyboard navigation for forms
  - _Requirements: UI/UX_

- [ ] 19.3 Optimize performance
  - Implement code splitting for routes
  - Add memoization to expensive computations
  - Optimize re-renders with React.memo
  - _Requirements: Performance_

- [ ] 20. Create sample data and seed database
  - Create database seed script with sample patients, staff, appointments, inventory items
  - Seed symptoms database with comprehensive symptom list
  - Seed medicines database with common medications
  - Seed diagnoses database with ICD-10 codes
  - _Requirements: Testing and demonstration_

- [ ] 21. Build and package application
- [ ] 21.1 Configure Tauri build settings
  - Update tauri.conf.json with app metadata
  - Configure app icons and splash screen
  - Set up code signing (optional)
  - _Requirements: Deployment_

- [ ] 21.2 Build platform-specific installers
  - Build Windows .msi installer
  - Build macOS .dmg installer (if on macOS)
  - Build Linux .deb/.AppImage (if on Linux)
  - _Requirements: Deployment_

- [ ] 21.3 Test installers
  - Install and test application on target platforms
  - Verify database connection and functionality
  - Test all major workflows end-to-end
  - _Requirements: Deployment_

- [ ] 22. Implement bed management module
- [ ] 22.1 Create bed data models and services
  - Create Bed, BedAllocation, BedTransfer interfaces in types/models.ts
  - Create services/bedService.ts with bed operations
  - Create hooks/useBeds.ts for bed data fetching
  - Implement bed availability checking logic
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 22.2 Build bed list and visualization
  - Create components/beds/BedList.tsx with table display
  - Create components/beds/BedMap.tsx with visual floor plan
  - Implement color coding by bed status
  - Add filtering by department, floor, type, and status
  - _Requirements: 15.5, 15.6_

- [ ] 22.3 Build bed allocation interface
  - Create components/beds/BedAllocationForm.tsx for assigning beds
  - Implement patient selection and bed selection
  - Add expected discharge date field
  - Display bed occupancy history
  - _Requirements: 15.4, 15.8_

- [ ] 22.4 Build bed management page
  - Create pages/BedManagement.tsx with bed list and map
  - Implement bed allocation dialog
  - Implement bed transfer functionality
  - Display bed occupancy rates and statistics
  - _Requirements: 15.1, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10_

- [ ] 23. Implement blood bank management module
- [ ] 23.1 Create blood bank data models and services
  - Create BloodDonor, BloodDonation, BloodUsage interfaces in types/models.ts
  - Create services/bloodBankService.ts with blood bank operations
  - Create hooks/useBloodBank.ts for blood bank data fetching
  - Implement blood inventory calculation logic
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 23.2 Build blood donor management
  - Create components/bloodbank/DonorList.tsx with donor table
  - Create components/bloodbank/DonorForm.tsx for donor registration
  - Display donation history for each donor
  - Track donor eligibility status
  - _Requirements: 16.1, 16.9_

- [ ] 23.3 Build blood donation tracking
  - Create components/bloodbank/DonationForm.tsx for recording donations
  - Add blood type, quantity, and expiry date fields
  - Implement screening results entry
  - _Requirements: 16.3_

- [ ] 23.4 Build blood inventory management
  - Create components/bloodbank/BloodInventory.tsx showing stock by blood type
  - Display low stock alerts
  - Display expiring blood units alerts
  - Implement blood usage recording
  - _Requirements: 16.4, 16.5, 16.6, 16.7_

- [ ] 23.5 Build blood bank pages
  - Create pages/BloodDonors.tsx for donor management
  - Create pages/BloodInventory.tsx for inventory tracking
  - Generate blood bank reports
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_

- [ ] 24. Implement emergency services module
- [ ] 24.1 Create emergency services data models and services
  - Create Ambulance, EmergencyCall, EmergencyCase, CaseHandler interfaces in types/models.ts
  - Create services/emergencyService.ts with emergency operations
  - Create hooks/useEmergency.ts for emergency data fetching
  - Implement response time calculation logic
  - _Requirements: 17.1, 17.2, 17.3_

- [ ] 24.2 Build ambulance management
  - Create components/emergency/AmbulanceList.tsx with ambulance table
  - Create components/emergency/AmbulanceForm.tsx for ambulance registration
  - Track ambulance status and availability
  - Display maintenance schedule
  - _Requirements: 17.1, 17.2_

- [ ] 24.3 Build emergency call logging
  - Create components/emergency/EmergencyCallForm.tsx for call recording
  - Add caller information, location, and emergency type fields
  - Implement priority assignment
  - Display active emergency calls
  - _Requirements: 17.3_

- [ ] 24.4 Build emergency case management
  - Create components/emergency/CaseManagement.tsx for case tracking
  - Implement ambulance dispatch functionality
  - Assign case handlers to cases
  - Track case status and timeline
  - Record patient condition and treatment
  - _Requirements: 17.4, 17.5, 17.6, 17.7, 17.8_

- [ ] 24.5 Build emergency services pages
  - Create pages/Ambulances.tsx for ambulance management
  - Create pages/EmergencyCalls.tsx for call logging
  - Create pages/EmergencyCases.tsx for case tracking
  - Generate emergency response reports
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10_

- [ ] 25. Implement financial management enhancements
- [ ] 25.1 Create insurance management models and services
  - Create InsuranceProvider, PatientInsurance, InsuranceClaim interfaces in types/models.ts
  - Create services/insuranceService.ts with insurance operations
  - Create hooks/useInsurance.ts for insurance data fetching
  - _Requirements: 18.1, 18.2_

- [ ] 25.2 Build insurance management interface
  - Create components/financial/InsuranceProviderList.tsx
  - Create components/financial/PatientInsuranceForm.tsx
  - Create components/financial/ClaimProcessing.tsx
  - Implement insurance verification and claim submission
  - _Requirements: 18.1, 18.2_

- [ ] 25.3 Implement advance payments
  - Create components/financial/AdvancePaymentForm.tsx
  - Track advance payment balance
  - Apply advance payments to bills
  - _Requirements: 18.3_

- [ ] 25.4 Build expense and income tracking
  - Create components/financial/ExpenseForm.tsx for expense recording
  - Create components/financial/IncomeTracking.tsx for income recording
  - Categorize expenses and income
  - _Requirements: 18.5, 18.6_

- [ ] 25.5 Implement hospital charges configuration
  - Create components/financial/ChargesConfiguration.tsx
  - Allow setting service prices
  - Track effective dates for pricing
  - _Requirements: 18.7_

- [ ] 25.6 Build payroll management
  - Create components/financial/PayrollForm.tsx for salary processing
  - Calculate net salary with allowances, deductions, and bonuses
  - Track payment status
  - Generate payroll reports
  - _Requirements: 18.11, 18.12_

- [ ] 25.7 Build financial management pages
  - Create pages/Insurance.tsx for insurance management
  - Create pages/AdvancePayments.tsx
  - Create pages/Expenses.tsx for expense tracking
  - Create pages/Income.tsx for income tracking
  - Create pages/HospitalCharges.tsx for pricing configuration
  - Create pages/Payroll.tsx for payroll management
  - Generate comprehensive financial reports
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10, 18.11, 18.12_

- [ ] 26. Implement enhanced reporting module
- [ ] 26.1 Create birth and death reporting
  - Create BirthReport and DeathReport interfaces in types/models.ts
  - Create services/reportingService.ts with reporting operations
  - Create components/reports/BirthReportForm.tsx
  - Create components/reports/DeathReportForm.tsx
  - Generate birth and death certificates
  - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [ ] 26.2 Create operation reporting
  - Create OperationReport interface in types/models.ts
  - Create components/reports/OperationReportForm.tsx
  - Track operation details, duration, and outcome
  - Generate operation theater utilization reports
  - _Requirements: 19.5, 19.6, 19.7_

- [ ] 26.3 Build enhanced reporting pages
  - Create pages/BirthReports.tsx for birth reporting
  - Create pages/DeathReports.tsx for death reporting
  - Create pages/OperationReports.tsx for surgical reporting
  - Implement report export to PDF and CSV
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10_

- [ ] 27. Implement communication system
- [ ] 27.1 Create communication data models and services
  - Create Notice, InternalMail, StaffSchedule interfaces in types/models.ts
  - Create services/communicationService.ts with communication operations
  - Create hooks/useCommunication.ts for communication data fetching
  - _Requirements: 20.1, 20.4, 20.7_

- [ ] 27.2 Build notice board
  - Create components/communication/NoticeBoard.tsx for displaying notices
  - Create components/communication/NoticeForm.tsx for creating notices
  - Implement notice expiry and archiving
  - Filter notices by target roles
  - _Requirements: 20.1, 20.2, 20.3, 20.10_

- [ ] 27.3 Build internal mail system
  - Create components/communication/MailInbox.tsx for viewing messages
  - Create components/communication/ComposeMailForm.tsx for sending messages
  - Implement recipient selection by role or individual
  - Display unread message count
  - _Requirements: 20.4, 20.5, 20.6_

- [ ] 27.4 Build staff schedule viewer
  - Create components/communication/ScheduleCalendar.tsx for viewing schedules
  - Display staff shifts and availability
  - Send notifications for schedule changes
  - _Requirements: 20.7, 20.8, 20.9_

- [ ] 27.5 Build communication pages
  - Create pages/NoticeBoard.tsx for notice management
  - Create pages/InternalMail.tsx for messaging
  - Create pages/StaffSchedules.tsx for schedule viewing
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10_

- [ ] 28. Implement service packages and pricing
- [ ] 28.1 Create service package models and services
  - Create ServicePackage, PackageSubscription, DoctorOPDCharge interfaces in types/models.ts
  - Create services/packageService.ts with package operations
  - Create hooks/usePackages.ts for package data fetching
  - _Requirements: 21.1, 21.5_

- [ ] 28.2 Build package management
  - Create components/services/PackageList.tsx for displaying packages
  - Create components/services/PackageForm.tsx for creating packages
  - Define included services and pricing
  - Track package subscriptions
  - _Requirements: 21.1, 21.2, 21.3, 21.4_

- [ ] 28.3 Build doctor OPD charge configuration
  - Create components/services/DoctorChargeForm.tsx
  - Configure consultation and follow-up fees by doctor
  - Track effective dates for pricing
  - _Requirements: 21.5, 21.6_

- [ ] 28.4 Build service management pages
  - Create pages/ServicePackages.tsx for package management
  - Create pages/DoctorCharges.tsx for OPD charge configuration
  - Generate package performance reports
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8_

- [ ] 29. Implement quality management
- [ ] 29.1 Create inquiry management models and services
  - Create Inquiry interface in types/models.ts
  - Create services/qualityService.ts with inquiry operations
  - Create hooks/useInquiries.ts for inquiry data fetching
  - _Requirements: 22.1, 22.2_

- [ ] 29.2 Build inquiry management interface
  - Create components/quality/InquiryList.tsx for displaying inquiries
  - Create components/quality/InquiryForm.tsx for submitting inquiries
  - Assign inquiries to staff for resolution
  - Track inquiry status and resolution
  - _Requirements: 22.2, 22.3, 22.4, 22.5, 22.6_

- [ ] 29.3 Build quality management page
  - Create pages/Inquiries.tsx for inquiry management
  - Generate inquiry reports and satisfaction metrics
  - Calculate resolution times
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10_

- [ ] 30. Implement document management
- [ ] 30.1 Create document management models and services
  - Create Document, DocumentVersion interfaces in types/models.ts
  - Create services/documentService.ts with document operations
  - Create hooks/useDocuments.ts for document data fetching
  - Integrate with Supabase Storage for file uploads
  - _Requirements: 23.1, 23.2_

- [ ] 30.2 Build document management interface
  - Create components/documents/DocumentList.tsx for displaying documents
  - Create components/documents/DocumentUpload.tsx for uploading files
  - Implement document search and filtering
  - Track document versions
  - _Requirements: 23.3, 23.4, 23.5_

- [ ] 30.3 Implement document access control
  - Apply role-based access to documents
  - Track document views and downloads
  - Implement document sharing
  - _Requirements: 23.6, 23.7, 23.8_

- [ ] 30.4 Build document management page
  - Create pages/Documents.tsx for document management
  - Implement document expiry tracking
  - Generate document management reports
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10_

- [ ] 31. Implement enhanced user roles
- [ ] 31.1 Update permission system for new roles
  - Add Lab Technician, Pharmacist, Accountant, Hospital Admin to role enum
  - Update config/permissions.ts with new role permissions
  - Update RLS policies for new roles
  - _Requirements: 24.1, 24.2, 24.3, 24.4_

- [ ] 31.2 Update UI for new roles
  - Update navigation menu for new roles
  - Create role-specific dashboards
  - Implement role-appropriate feature access
  - _Requirements: 24.5, 24.6, 24.7, 24.8, 24.9, 24.10_

- [ ] 32. Implement OPD and IPD management
- [ ] 32.1 Create OPD/IPD data models and services
  - Create OPDVisit and IPDAdmission interfaces in types/models.ts
  - Create services/opdIpdService.ts with OPD/IPD operations
  - Create hooks/useOPDIPD.ts for OPD/IPD data fetching
  - _Requirements: 25.1, 25.2, 25.3_

- [ ] 32.2 Build OPD management interface
  - Create components/opd/OPDQueue.tsx for outpatient queue
  - Create components/opd/OPDVisitForm.tsx for OPD visits
  - Generate token numbers for patients
  - Track OPD visit status
  - _Requirements: 25.2, 25.4_

- [ ] 32.3 Build IPD management interface
  - Create components/ipd/IPDAdmissionForm.tsx for patient admission
  - Integrate with bed allocation
  - Track admission and discharge dates
  - Calculate stay duration and charges
  - _Requirements: 25.3, 25.5, 25.6, 25.7_

- [ ] 32.4 Build OPD and IPD pages
  - Create pages/OPD.tsx for outpatient management
  - Create pages/IPD.tsx for inpatient management
  - Display separate statistics for OPD and IPD
  - Generate OPD and IPD reports
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8, 25.9, 25.10_

- [ ] 33. Update database schema with new tables
- [ ] 33.1 Execute SQL for new tables
  - Execute SQL for beds, bed_allocations tables
  - Execute SQL for blood bank tables (blood_donors, blood_donations, blood_usage)
  - Execute SQL for emergency services tables (ambulances, emergency_calls, emergency_cases)
  - Execute SQL for financial tables (insurance_providers, patient_insurance, insurance_claims, advance_payments, expenses, income, hospital_charges, payroll)
  - Execute SQL for reporting tables (birth_reports, death_reports, operation_reports)
  - Execute SQL for communication tables (notices, internal_mail, staff_schedules)
  - Execute SQL for service tables (service_packages, package_subscriptions, doctor_opd_charges)
  - Execute SQL for quality tables (inquiries)
  - Execute SQL for document tables (documents, document_versions)
  - Execute SQL for OPD/IPD tables (opd_visits, ipd_admissions)
  - Create all new indexes
  - _Requirements: All new feature requirements_

- [ ] 33.2 Update RLS policies for new tables
  - Create RLS policies for all new tables
  - Test policies with different user roles
  - _Requirements: Security and access control_

- [ ] 34. Update navigation and routing
- [ ] 34.1 Add new routes
  - Add routes for all new pages in config/routes.ts
  - Update TanStack Router configuration
  - _Requirements: Navigation_

- [ ] 34.2 Update sidebar navigation
  - Add navigation items for new modules
  - Group related items in navigation sections
  - Apply permission-based filtering
  - _Requirements: Navigation_

- [ ] 35. Update dashboard with new metrics
- [ ] 35.1 Add new dashboard cards
  - Add bed occupancy rate card
  - Add blood inventory status card
  - Add active emergency cases card
  - Add pending inquiries card
  - _Requirements: Dashboard enhancements_

- [ ] 35.2 Add new dashboard charts
  - Add OPD vs IPD patient chart
  - Add financial revenue chart
  - Add emergency response time chart
  - _Requirements: Dashboard enhancements_

- [ ] 36. Create sample data for new features
  - Create seed data for beds and bed types
  - Create seed data for blood donors and donations
  - Create seed data for ambulances
  - Create seed data for insurance providers
  - Create seed data for service packages
  - Create seed data for hospital charges
  - _Requirements: Testing and demonstration_

- [ ] 37. Create documentation
- [ ] 37.1 Write user documentation
  - Create user guide for each module including new features
  - Document role-based access and permissions for all roles
  - Create quick start guide
  - _Requirements: Documentation_

- [ ] 37.2 Write developer documentation
  - Document project structure and architecture
  - Create API documentation for all services
  - Document complete database schema and relationships
  - Create contribution guidelines
  - _Requirements: Documentation_

- [ ] 37.3 Create README and setup instructions
  - Write comprehensive README.md with project overview
  - Document installation and setup steps
  - Include Supabase configuration instructions
  - Add screenshots and demo video
  - _Requirements: Documentation_
