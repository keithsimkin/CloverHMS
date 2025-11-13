# Implementation Plan

## Phase 1: Project Foundation & UI Setup

- [x] 1. Initialize Tauri + React + Vite project structure
  - Create new Tauri project with React and TypeScript template using `pnpm create tauri-app`
  - Configure Vite build settings for Tauri in vite.config.ts
  - Set up project folder structure (src/components, src/pages, src/lib, src/hooks, src/stores, src/services, src/types, src/config)
  - Initialize Git repository with .gitignore for Tauri/React projects
  - Install core dependencies: @supabase/supabase-js, @tanstack/react-query, @tanstack/react-router, react-hook-form, zod, zustand
  - _Requirements: 7.1, 7.2_

## Phase 2: UI Foundation & Design System

- [x] 2. Set up shadcn/ui and dark theme









- [x] 2.1 Install and configure Tailwind CSS

  - Install Tailwind CSS, PostCSS, and Autoprefixer
  - Create tailwind.config.js with dark color scheme (Rich Black, Gunmetal, Prussian Blue, Cool Gray, Mint Cream, Imperial Red)
  - Configure Tailwind content paths to scan src/**/*.{ts,tsx}
  - Create src/index.css with Tailwind directives and custom CSS variables

  - Configure font families: Inter (body), Mona Sans (headings), Poppins (buttons)
  - _Requirements: 7.1, 7.2, 7.8_

- [x] 2.2 Initialize shadcn/ui components

  - Run `pnpm dlx shadcn-ui@latest init` to initialize shadcn/ui
  - Install essential components: button, input, form, table, dialog, toast, card, select, calendar, tabs, badge, dropdown-menu, command, popover, separator, label, checkbox, textarea, alert, scroll-area
  - Verify components render correctly with dark theme
  - Test accessibility contrast ratios (AAA for primary text, AA for secondary)
  - _Requirements: 7.2, 7.5, 7.8_

- [-] 3. Build layout and navigation structure


- [x] 3.1 Create main layout components


  - Create components/layout/Sidebar.tsx with navigation menu
  - Create components/layout/Header.tsx with user info and logout
  - Create components/layout/MainLayout.tsx combining sidebar and header
  - Implement responsive layout for different screen sizes
  - _Requirements: 7.3_

- [x] 3.2 Set up routing and navigation


  - Create config/routes.ts with all application routes
  - Configure TanStack Router with route definitions
  - Implement navigation links in sidebar with active state
  - Add breadcrumb navigation in header
  - _Requirements: 7.3_

- [x] 3.3 Create mock data types and utilities









  - Create types/models.ts with all data interfaces (Patient, Appointment, Staff, Inventory, Clinical, Flow, etc.)
  - Create types/enums.ts with all enums (Permission, Role, Status types, Priority, etc.)
  - Create lib/mockData.ts with sample data generators for all modules
  - _Requirements: All modules_

## Phase 3: Core Module UI Components

- [x] 4. Build patient management UI






- [x] 4.1 Build patient list and search interface


  - Create components/patients/PatientList.tsx with table display using mock data
  - Implement pagination (20 records per page)
  - Create components/patients/PatientSearch.tsx with search input
  - Add loading indicators and empty states
  - _Requirements: 1.2, 1.4, 7.4_

- [x] 4.2 Build patient form for create/edit


  - Create components/patients/PatientForm.tsx with React Hook Form
  - Implement Zod validation schema for patient data
  - Create form fields for all patient attributes (name, DOB, contact, emergency contact, blood type, allergies, medical history)
  - Display validation errors for missing required fields
  - _Requirements: 1.1, 1.3, 1.5_

- [x] 4.3 Create patient details view


  - Create components/patients/PatientDetails.tsx showing full patient information
  - Display patient medical history and visit records (mock data)
  - Add edit and delete action buttons
  - _Requirements: 1.3_

- [x] 4.4 Build patients page


  - Create pages/Patients.tsx integrating list, search, and form components
  - Implement create patient dialog
  - Implement edit patient dialog
  - Add toast notifications for success/error feedback
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.5_

- [x] 5. Build appointment scheduling UI




- [x] 5.1 Build calendar interface


  - Create components/appointments/AppointmentCalendar.tsx with day/week/month views
  - Integrate calendar library or build custom calendar component
  - Display appointments on calendar with color coding by status (mock data)
  - Implement date navigation controls
  - _Requirements: 2.1_

- [x] 5.2 Build appointment form


  - Create components/appointments/AppointmentForm.tsx with React Hook Form
  - Implement patient selection dropdown with search (mock data)
  - Implement provider (staff) selection dropdown (mock data)
  - Add date/time pickers for appointment scheduling
  - Add appointment type and notes fields
  - Implement validation
  - _Requirements: 2.2, 2.3_

- [x] 5.3 Build appointment notifications display


  - Create components/appointments/AppointmentNotifications.tsx
  - Display upcoming appointments list (mock data)
  - Show notification badges
  - _Requirements: 2.4_

- [x] 5.4 Build appointments page


  - Create pages/Appointments.tsx with calendar and list views
  - Implement create appointment dialog
  - Implement edit/cancel/reschedule appointment actions
  - Add toast notifications for actions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 6. Build staff management UI




- [x] 6.1 Build staff list and filtering


  - Create components/staff/StaffList.tsx with table display (mock data)
  - Implement filtering by department, role, and employment status
  - Add search functionality for staff members
  - _Requirements: 3.3_

- [x] 6.2 Build staff form


  - Create components/staff/StaffForm.tsx with React Hook Form
  - Add fields for employee ID, name, role, department, specialization, contact info, employment status, hire date
  - Implement unique employee ID validation
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 6.3 Build staff schedule view


  - Create components/staff/StaffSchedule.tsx displaying shifts and availability (mock data)
  - Implement schedule calendar view
  - _Requirements: 3.4_

- [x] 6.4 Build staff page


  - Create pages/Staff.tsx integrating list, form, and schedule components
  - Implement create/edit/deactivate staff actions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7. Build inventory management UI




- [x] 7.1 Build inventory list and categories


  - Create components/inventory/InventoryList.tsx with table display (mock data)
  - Group inventory items by category
  - Display low-stock alerts with visual indicators
  - Implement search and filtering
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 7.2 Build inventory item form


  - Create components/inventory/InventoryItemForm.tsx with React Hook Form
  - Add fields for item code, name, category, quantity, unit of measure, reorder threshold, cost, supplier, location, expiry date
  - Implement validation for required fields
  - _Requirements: 4.1_

- [x] 7.3 Build inventory transaction interface


  - Create components/inventory/InventoryTransaction.tsx for recording transactions
  - Implement transaction types (addition, usage, adjustment, disposal)
  - Display transaction history for each item (mock data)
  - _Requirements: 4.3, 4.5_

- [x] 7.4 Build inventory page


  - Create pages/Inventory.tsx integrating list, form, and transaction components
  - Implement create/edit inventory items
  - Implement record transaction dialog
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

## Phase 4: Clinical Workflow UI

- [x] 8. Build clinical knowledge database UI





- [x] 8.1 Build symptom search and selection


  - Create components/clinical/SymptomSearch.tsx with searchable dropdown (mock data)
  - Display symptom details (description, category, body system)
  - _Requirements: 11.2_

- [x] 8.2 Build medicine search and prescription


  - Create components/clinical/MedicineSearch.tsx with searchable dropdown (mock data)
  - Display medicine details (dosage forms, strength options, contraindications, side effects, interactions)
  - _Requirements: 12.5_

- [x] 8.3 Build drug interaction warnings display


  - Create components/clinical/DrugInteractionWarning.tsx
  - Display warnings when prescribing multiple medicines
  - _Requirements: 12.4_

- [x] 8.4 Build diagnosis search and recording


  - Create components/clinical/DiagnosisSearch.tsx with searchable dropdown (mock data)
  - Add fields for severity, status, and clinical notes
  - _Requirements: 13.2, 13.3, 13.5, 13.6_

- [x] 9. Build patient visit and clinical workflow UI





- [x] 9.1 Build patient visit interface


  - Create components/clinical/PatientVisitForm.tsx for documenting visits
  - Display patient history (previous symptoms, diagnoses, active prescriptions) (mock data)
  - Implement guided workflow: symptoms → diagnosis → prescription
  - Add vital signs entry section
  - Add chief complaint and visit summary fields
  - _Requirements: 14.1, 14.2_

- [x] 9.2 Integrate symptoms recording in visit


  - Add symptom selection and recording to visit form
  - Display timestamp and recording user
  - _Requirements: 11.3, 11.4_

- [x] 9.3 Integrate diagnosis recording in visit


  - Add diagnosis selection and recording to visit form
  - Associate symptoms with diagnoses
  - Display diagnosis history for patient (mock data)
  - _Requirements: 13.2, 13.3, 13.4_

- [x] 9.4 Integrate prescription creation in visit


  - Add prescription form to visit interface
  - Display prescription history for patient (mock data)
  - _Requirements: 12.3, 12.6_

- [x] 9.5 Build visit summary and reports


  - Create visit summary section with all recorded data
  - Add follow-up recommendations field
  - Implement visit report generation (print/export)
  - _Requirements: 14.3, 14.4, 14.5_

- [x] 9.6 Build clinical page


  - Create pages/Clinical.tsx with patient search and visit interface
  - Implement start visit workflow
  - Display patient clinical history (mock data)
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

## Phase 5: Patient Flow Management UI

- [x] 10. Build patient flow dashboard UI





- [x] 10.1 Build patient flow dashboard

  - Create components/flow/FlowDashboard.tsx showing all patients in hospital (mock data)
  - Display patients grouped by current stage
  - Show wait time indicators for each patient
  - Implement color coding by priority level
  - Add quick actions to transition patients between stages
  - _Requirements: Patient flow tracking_

- [x] 10.2 Build patient registration flow UI


  - Create components/flow/RegistrationForm.tsx for patient arrival
  - Record arrival time
  - Link flow to patient and visit records
  - _Requirements: Patient flow - registration stage_

- [x] 11. Build triage UI





- [x] 11.1 Build triage interface


  - Create components/triage/TriageForm.tsx for triage assessment
  - Add vital signs entry (temperature, BP, heart rate, respiratory rate, O2 saturation, pain level)
  - Add priority level selection (critical, urgent, semi-urgent, non-urgent)
  - Add chief complaint field
  - _Requirements: Patient flow - triage stage_

- [x] 11.2 Build triage page


  - Create pages/Triage.tsx with queue of patients waiting for triage (mock data)
  - Display triage form for selected patient
  - Show priority-based ordering
  - _Requirements: Patient flow - triage stage_

- [x] 12. Build laboratory UI





- [x] 12.1 Build laboratory orders interface


  - Create components/laboratory/LabOrderForm.tsx for ordering tests
  - Add test type, test name, and priority fields
  - Track order status (ordered, sample collected, in progress, completed, cancelled)
  - _Requirements: Patient flow - laboratory stage_

- [x] 12.2 Build laboratory page


  - Create pages/Laboratory.tsx with pending lab orders (mock data)
  - Implement sample collection tracking interface
  - Implement results entry interface
  - Display completed results
  - _Requirements: Patient flow - laboratory stage_

- [x] 13. Build pharmacy UI





- [x] 13.1 Build pharmacy dispensing interface


  - Create components/pharmacy/DispenseForm.tsx for medication dispensing
  - Link to prescriptions from visits (mock data)
  - Record quantity dispensed and counseling provided
  - _Requirements: Patient flow - pharmacy stage_

- [x] 13.2 Build pharmacy page


  - Create pages/Pharmacy.tsx with pending prescriptions (mock data)
  - Display prescription details
  - Implement dispense interface
  - Track dispensing history
  - _Requirements: Patient flow - pharmacy stage_

- [x] 14. Build billing UI




- [x] 14.1 Build billing interface


  - Create components/billing/BillingForm.tsx for generating bills
  - Calculate total from consultation fee, medication cost, laboratory cost, procedure cost
  - Track payment status (pending, partial, paid)
  - Record payment method and amount paid
  - _Requirements: Patient flow - billing stage_

- [x] 14.2 Build billing page


  - Create pages/Billing.tsx with pending bills (mock data)
  - Display bill breakdown
  - Implement payment recording interface
  - Generate receipts
  - _Requirements: Patient flow - billing stage_

- [x] 15. Build discharge UI





- [x] 15.1 Build discharge interface

  - Create components/flow/DischargeForm.tsx for patient discharge
  - Add discharge type, summary, follow-up requirements, medications, and instructions fields
  - Calculate total visit time
  - _Requirements: Patient flow - discharge stage_

- [x] 15.2 Build patient flow page


  - Create pages/PatientFlow.tsx with real-time flow dashboard
  - Display queue management for each stage
  - Implement stage transition controls
  - Show flow metrics and statistics (mock data)
  - _Requirements: Patient flow management_



## Phase 6: Extended Features UI

- [x] 16. Build bed management UI


- [x] 16.1 Build bed list and visualization

  - Create components/beds/BedList.tsx with table display (mock data)
  - Create components/beds/BedMap.tsx with visual floor plan
  - Implement color coding by bed status
  - Add filtering by department, floor, type, and status
  - _Requirements: 15.5, 15.6_


- [x] 16.2 Build bed allocation interface

  - Create components/beds/BedAllocationForm.tsx for assigning beds
  - Implement patient selection and bed selection
  - Add expected discharge date field
  - Display bed occupancy history (mock data)
  - _Requirements: 15.4, 15.8_


- [x] 16.3 Build bed management page

  - Create pages/BedManagement.tsx with bed list and map
  - Implement bed allocation dialog
  - Implement bed transfer functionality
  - Display bed occupancy rates and statistics (mock data)
  - _Requirements: 15.1, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10_

- [x] 17. Build blood bank UI




- [x] 17.1 Build blood donor management

  - Create components/bloodbank/DonorList.tsx with donor table (mock data)
  - Create components/bloodbank/DonorForm.tsx for donor registration
  - Display donation history for each donor
  - Track donor eligibility status
  - _Requirements: 16.1, 16.9_


- [x] 17.2 Build blood donation tracking

  - Create components/bloodbank/DonationForm.tsx for recording donations
  - Add blood type, quantity, and expiry date fields
  - Implement screening results entry
  - _Requirements: 16.3_

- [x] 17.3 Build blood inventory management


  - Create components/bloodbank/BloodInventory.tsx showing stock by blood type (mock data)
  - Display low stock alerts
  - Display expiring blood units alerts
  - Implement blood usage recording
  - _Requirements: 16.4, 16.5, 16.6, 16.7_

- [x] 17.4 Build blood bank pages


  - Create pages/BloodDonors.tsx for donor management
  - Create pages/BloodInventory.tsx for inventory tracking
  - Generate blood bank reports
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_

- [x] 18. Build emergency services UI




- [x] 18.1 Build ambulance management


  - Create components/emergency/AmbulanceList.tsx with ambulance table (mock data)
  - Create components/emergency/AmbulanceForm.tsx for ambulance registration
  - Track ambulance status and availability
  - Display maintenance schedule
  - _Requirements: 17.1, 17.2_

- [x] 18.2 Build emergency call logging


  - Create components/emergency/EmergencyCallForm.tsx for call recording
  - Add caller information, location, and emergency type fields
  - Implement priority assignment
  - Display active emergency calls (mock data)
  - _Requirements: 17.3_



- [x] 18.3 Build emergency case management

  - Create components/emergency/CaseManagement.tsx for case tracking
  - Implement ambulance dispatch functionality
  - Assign case handlers to cases
  - Track case status and timeline
  - Record patient condition and treatment

  - _Requirements: 17.4, 17.5, 17.6, 17.7, 17.8_

- [x] 18.4 Build emergency services pages

  - Create pages/Ambulances.tsx for ambulance management
  - Create pages/EmergencyCalls.tsx for call logging
  - Create pages/EmergencyCases.tsx for case tracking
  - Generate emergency response reports
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10_

- [x] 19. Build financial management UI




- [x] 19.1 Build insurance management interface


  - Create components/financial/InsuranceProviderList.tsx (mock data)
  - Create components/financial/PatientInsuranceForm.tsx
  - Create components/financial/ClaimProcessing.tsx
  - Implement insurance verification and claim submission
  - _Requirements: 18.1, 18.2_

- [x] 19.2 Build advance payments interface

  - Create components/financial/AdvancePaymentForm.tsx
  - Track advance payment balance
  - Apply advance payments to bills
  - _Requirements: 18.3_

- [x] 19.3 Build expense and income tracking

  - Create components/financial/ExpenseForm.tsx for expense recording
  - Create components/financial/IncomeTracking.tsx for income recording
  - Categorize expenses and income
  - _Requirements: 18.5, 18.6_

- [x] 19.4 Build hospital charges configuration

  - Create components/financial/ChargesConfiguration.tsx
  - Allow setting service prices
  - Track effective dates for pricing
  - _Requirements: 18.7_

- [x] 19.5 Build payroll management

  - Create components/financial/PayrollForm.tsx for salary processing
  - Calculate net salary with allowances, deductions, and bonuses
  - Track payment status
  - Generate payroll reports
  - _Requirements: 18.11, 18.12_

- [x] 19.6 Build financial management pages


  - Create pages/Insurance.tsx for insurance management
  - Create pages/AdvancePayments.tsx
  - Create pages/Expenses.tsx for expense tracking
  - Create pages/Income.tsx for income tracking
  - Create pages/HospitalCharges.tsx for pricing configuration
  - Create pages/Payroll.tsx for payroll management
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10, 18.11, 18.12_

## Phase 7: Reporting & Communication UI

- [x] 20. Build enhanced reporting UI





- [x] 20.1 Build birth and death reporting


  - Create components/reports/BirthReportForm.tsx
  - Create components/reports/DeathReportForm.tsx
  - Generate birth and death certificates
  - _Requirements: 19.1, 19.2, 19.3, 19.4_

- [x] 20.2 Build operation reporting

  - Create components/reports/OperationReportForm.tsx
  - Track operation details, duration, and outcome
  - Generate operation theater utilization reports
  - _Requirements: 19.5, 19.6, 19.7_

- [x] 20.3 Build enhanced reporting pages


  - Create pages/BirthReports.tsx for birth reporting
  - Create pages/DeathReports.tsx for death reporting
  - Create pages/OperationReports.tsx for surgical reporting
  - Implement report export to PDF and CSV
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10_

- [x] 21. Build communication system UI









- [x] 21.1 Build notice board


  - Create components/communication/NoticeBoard.tsx for displaying notices (mock data)
  - Create components/communication/NoticeForm.tsx for creating notices
  - Implement notice expiry and archiving
  - Filter notices by target roles
  - _Requirements: 20.1, 20.2, 20.3, 20.10_

- [x] 21.2 Build internal mail system


  - Create components/communication/MailInbox.tsx for viewing messages (mock data)
  - Create components/communication/ComposeMailForm.tsx for sending messages
  - Implement recipient selection by role or individual
  - Display unread message count
  - _Requirements: 20.4, 20.5, 20.6_

- [x] 21.3 Build staff schedule viewer


  - Create components/communication/ScheduleCalendar.tsx for viewing schedules (mock data)
  - Display staff shifts and availability
  - Send notifications for schedule changes
  - _Requirements: 20.7, 20.8, 20.9_

- [x] 21.4 Build communication pages


  - Create pages/NoticeBoard.tsx for notice management
  - Create pages/InternalMail.tsx for messaging
  - Create pages/StaffSchedules.tsx for schedule viewing
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10_


- [x] 22. Build service packages and pricing UI






- [x] 22.1 Build package management



  - Create components/services/PackageList.tsx for displaying packages (mock data)
  - Create components/services/PackageForm.tsx for creating packages
  - Define included services and pricing
  - Track package subscriptions
  - _Requirements: 21.1, 21.2, 21.3, 21.4_

- [x] 22.2 Build doctor OPD charge configuration


  - Create components/services/DoctorChargeForm.tsx
  - Configure consultation and follow-up fees by doctor
  - Track effective dates for pricing
  - _Requirements: 21.5, 21.6_

- [x] 22.3 Build service management pages


  - Create pages/ServicePackages.tsx for package management
  - Create pages/DoctorCharges.tsx for OPD charge configuration
  - Generate package performance reports
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8_

- [ ] 23. Build quality management UI

- [x] 23.1 Build inquiry management interface





  - Create components/quality/InquiryList.tsx for displaying inquiries (mock data)
  - Create components/quality/InquiryForm.tsx for submitting inquiries
  - Assign inquiries to staff for resolution
  - Track inquiry status and resolution
  - _Requirements: 22.2, 22.3, 22.4, 22.5, 22.6_

- [x] 23.2 Build quality management page
  - Create pages/Inquiries.tsx for inquiry management
  - Generate inquiry reports and satisfaction metrics
  - Calculate resolution times
  - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10_

- [x] 24. Build document management UI

- [x] 24.1 Build document management interface
  - Create components/documents/DocumentList.tsx for displaying documents (mock data)
  - Create components/documents/DocumentUpload.tsx for uploading files
  - Implement document search and filtering
  - Track document versions
  - _Requirements: 23.3, 23.4, 23.5_

- [x] 24.2 Build document management page
  - Create pages/Documents.tsx for document management
  - Implement document expiry tracking
  - Generate document management reports
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10_

- [x] 25. Build OPD and IPD management UI

- [x] 25.1 Build OPD management interface
  - Create components/opd/OPDQueue.tsx for outpatient queue (mock data)
  - Create components/opd/OPDVisitForm.tsx for OPD visits
  - Generate token numbers for patients
  - Track OPD visit status
  - _Requirements: 25.2, 25.4_

- [x] 25.2 Build IPD management interface
  - Create components/ipd/IPDAdmissionForm.tsx for patient admission
  - Integrate with bed allocation
  - Track admission and discharge dates
  - Calculate stay duration and charges
  - _Requirements: 25.3, 25.5, 25.6, 25.7_

- [x] 25.3 Build OPD and IPD pages
  - Create pages/OPD.tsx for outpatient management
  - Create pages/IPD.tsx for inpatient management
  - Display separate statistics for OPD and IPD (mock data)
  - Generate OPD and IPD reports
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8, 25.9, 25.10_

## Phase 8: Dashboard & Analytics UI

- [x] 26. Build dashboard and reporting UI




- [x] 26.1 Build dashboard statistics


  - Create components/dashboard/StatsCards.tsx showing key metrics (mock data)
  - Display total patients, upcoming appointments, active staff, low-stock items
  - Add bed occupancy rate, blood inventory status, active emergency cases, pending inquiries
  - _Requirements: 8.1_

- [x] 26.2 Build appointment statistics


  - Create components/dashboard/AppointmentStats.tsx with charts (mock data)
  - Display appointments by day, week, or month
  - Show appointment trends over time
  - _Requirements: 8.2_

- [x] 26.3 Build patient demographics


  - Create components/dashboard/PatientDemographics.tsx with charts (mock data)
  - Display age distribution
  - Show visit frequency statistics
  - Add OPD vs IPD patient chart
  - _Requirements: 8.3_

- [x] 26.4 Build staff utilization report


  - Create components/dashboard/StaffUtilization.tsx with charts (mock data)
  - Display appointment counts per provider
  - Show staff workload distribution
  - _Requirements: 8.4_

- [x] 26.5 Build financial charts


  - Create components/dashboard/FinancialCharts.tsx (mock data)
  - Add financial revenue chart
  - Display expense vs income trends
  - _Requirements: Dashboard enhancements_

- [x] 26.6 Build emergency response charts


  - Create components/dashboard/EmergencyStats.tsx (mock data)
  - Add emergency response time chart
  - Display case resolution metrics
  - _Requirements: Dashboard enhancements_


- [x] 26.7 Implement report export

  - Create export utility for CSV and PDF formats
  - Add export buttons to all report components
  - _Requirements: 8.5_

- [x] 26.8 Build dashboard page


  - Create pages/Dashboard.tsx integrating all dashboard components
  - Implement responsive grid layout
  - Add date range filters for reports
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

## Phase 9: Authentication & Permissions UI

- [x] 27. Implement authentication UI





- [x] 27.1 Create authentication store and utilities

  - Create stores/authStore.ts with Zustand for auth state management (mock authentication)
  - Create lib/auth.ts with authentication helper functions
  - Implement mock login, logout, and session management functions
  - _Requirements: 5.1, 5.2_


- [x] 27.2 Build login page

  - Create pages/Login.tsx with email/password form using React Hook Form and Zod validation
  - Implement login form submission (mock authentication)
  - Add error handling and validation messages
  - _Requirements: 5.1, 5.2_

- [x] 27.3 Implement route protection


  - Create route protection wrapper component
  - Implement automatic redirect to login for unauthenticated users
  - Update TanStack Router with protected routes
  - _Requirements: 5.1, 5.2_

- [x] 28. Implement role-based permission system UI





- [x] 28.1 Create permission configuration

  - Update types/enums.ts with Permission enum and all user roles
  - Create config/permissions.ts with role-to-permissions mapping for all roles (admin, doctor, nurse, receptionist, lab_technician, pharmacist, accountant, inventory_manager, hospital_admin, viewer)
  - Create lib/permissions.ts with permission checking functions
  - Create hooks/usePermissions.ts for component-level permission checks
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 24.1, 24.2, 24.3, 24.4_


- [x] 28.2 Implement permission-based UI rendering

  - Create ProtectedComponent wrapper that checks permissions
  - Implement navigation menu filtering based on user permissions
  - Add permission checks to all action buttons and forms
  - Create role-specific dashboards
  - _Requirements: 5.12, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10_

- [x] 29. Build settings and agent configuration UI




- [x] 29.1 Build user profile settings


  - Create components/settings/UserProfile.tsx for updating user info
  - Implement password change functionality (mock)
  - Display user role and permissions
  - _Requirements: User profile management_

- [x] 29.2 Build agent hooks configuration interface


  - Create components/settings/HooksManager.tsx for managing hooks (mock data)
  - Implement create/edit/delete hook forms
  - Add enable/disable toggle for hooks
  - Display hook execution history
  - _Requirements: 9.1, 9.5_

- [x] 29.3 Build steering rules configuration interface


  - Create components/settings/SteeringManager.tsx for managing rules (mock data)
  - Implement create/edit/delete rule forms
  - Add enable/disable toggle for rules
  - Provide documentation templates for custom rules
  - _Requirements: 10.5_

- [x] 29.4 Build settings page


  - Create pages/Settings.tsx with tabbed interface
  - Add tabs for user profile, agent hooks, steering rules, system settings
  - Integrate all settings components
  - _Requirements: Settings management_

## Phase 10: UI Polish & Error Handling

- [-] 30. Implement error handling and loading states



- [x] 30.1 Create error handling utilities


  - Create error types enum in types/enums.ts
  - Create error transformation utilities
  - Implement global error boundary component
  - _Requirements: Error handling_

- [x] 30.2 Add loading indicators


  - Create loading spinner component
  - Add loading states to all data fetching operations
  - Implement skeleton loaders for tables and cards
  - _Requirements: 7.4_

- [x] 30.3 Implement toast notifications




  - Configure toast provider in App.tsx
  - Add success/error toasts to all CRUD operations
  - Implement network error notifications
  - _Requirements: 7.5, 6.3_

- [-] 31. Polish UI and user experience



- [x] 31.1 Implement responsive design


  - Test all pages on different screen sizes
  - Adjust layouts for mobile and tablet views
  - Ensure touch-friendly interactions
  - _Requirements: UI/UX_

- [x] 31.2 Add keyboard shortcuts


  - Implement common keyboard shortcuts (Ctrl+S for save, Esc to close dialogs)
  - Add keyboard navigation for forms
  - _Requirements: UI/UX_

- [x] 31.3 Optimize performance


  - Implement code splitting for routes
  - Add memoization to expensive computations
  - Optimize re-renders with React.memo
  - _Requirements: Performance_

- [-] 31.4 Update navigation for all modules

  - Update config/routes.ts with all routes
  - Update sidebar navigation with all modules
  - Group related items in navigation sections
  - Apply permission-based filtering
  - _Requirements: Navigation_

## Phase 11: Backend Integration

- [ ] 32. Configure Supabase and database connection
- [ ] 32.1 Set up Supabase project and connection
  - Create Supabase project at supabase.com and obtain API credentials
  - Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
  - Create src/lib/supabase.ts with Supabase client configuration
  - Test connection by querying Supabase
  - _Requirements: 6.1, 5.10_

- [ ] 33. Create database schema
- [ ] 33.1 Create core database schema
  - Execute SQL for core tables: patients, appointments, staff, inventory_items, inventory_transactions
  - Execute SQL for clinical tables: symptoms, patient_symptoms, medicines, prescriptions, diagnoses, patient_diagnoses, patient_visits
  - Execute SQL for patient flow tables: patient_flows, flow_transitions, triage_records, laboratory_orders, pharmacy_dispenses, billing_records, discharge_records
  - Create all database indexes for performance
  - _Requirements: 6.1, 1.1, 2.1, 3.1, 4.1, 11.1, 12.1, 13.1_

- [ ] 33.2 Create extended database schema
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
  - Execute SQL for automation: agent_hooks, hook_executions, steering_rules
  - Create all additional indexes
  - _Requirements: 15.1, 16.1, 17.1, 18.1, 19.1, 20.1, 21.1, 22.1, 23.1, 25.1_

- [ ] 33.3 Configure Row Level Security policies
  - Enable RLS on all tables
  - Create RLS policies for all roles: admin, doctor, nurse, receptionist, lab_technician, pharmacist, accountant, inventory_manager, hospital_admin, viewer
  - Test RLS policies with different user roles
  - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 24.1, 24.2, 24.3, 24.4_

- [ ] 34. Create service layer for backend integration
- [ ] 34.1 Create patient services
  - Create services/patientService.ts with CRUD operations using Supabase
  - Create hooks/usePatients.ts with TanStack Query for data fetching
  - Implement patient search functionality with debouncing
  - Replace mock data with real API calls in patient components
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 34.2 Create appointment services
  - Create services/appointmentService.ts with CRUD operations using Supabase
  - Create hooks/useAppointments.ts with TanStack Query
  - Implement double-booking prevention logic
  - Replace mock data with real API calls in appointment components
  - _Requirements: 2.2, 2.3_

- [ ] 34.3 Create staff services
  - Create services/staffService.ts with CRUD operations using Supabase
  - Create hooks/useStaff.ts with TanStack Query
  - Replace mock data with real API calls in staff components
  - _Requirements: 3.1_

- [ ] 34.4 Create inventory services
  - Create services/inventoryService.ts with CRUD and transaction operations using Supabase
  - Create hooks/useInventory.ts with TanStack Query
  - Implement low-stock alert logic
  - Replace mock data with real API calls in inventory components
  - _Requirements: 4.1, 4.2_

- [ ] 34.5 Create clinical services
  - Create services/clinicalService.ts with symptom, medicine, diagnosis, and visit operations using Supabase
  - Create hooks/useSymptoms.ts, hooks/useMedicines.ts, hooks/useDiagnoses.ts, hooks/useVisits.ts
  - Implement drug interaction checking logic
  - Seed symptoms, medicines, and diagnoses databases
  - Replace mock data with real API calls in clinical components
  - _Requirements: 11.1, 11.5, 12.1, 12.2, 13.1_

- [ ] 34.6 Create patient flow services
  - Create services/patientFlowService.ts with flow operations using Supabase
  - Create hooks/usePatientFlow.ts for flow data fetching
  - Replace mock data with real API calls in patient flow components
  - _Requirements: Patient flow tracking_

- [ ] 34.7 Create bed management services
  - Create services/bedService.ts with bed operations using Supabase
  - Create hooks/useBeds.ts for bed data fetching
  - Implement bed availability checking logic
  - Replace mock data with real API calls in bed management components
  - _Requirements: 15.1, 15.2, 15.3_

- [ ] 34.8 Create blood bank services
  - Create services/bloodBankService.ts with blood bank operations using Supabase
  - Create hooks/useBloodBank.ts for blood bank data fetching
  - Implement blood inventory calculation logic
  - Replace mock data with real API calls in blood bank components
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [ ] 34.9 Create emergency services
  - Create services/emergencyService.ts with emergency operations using Supabase
  - Create hooks/useEmergency.ts for emergency data fetching
  - Implement response time calculation logic
  - Replace mock data with real API calls in emergency components
  - _Requirements: 17.1, 17.2, 17.3_

- [ ] 34.10 Create financial services
  - Create services/insuranceService.ts with insurance operations using Supabase
  - Create hooks/useInsurance.ts for insurance data fetching
  - Replace mock data with real API calls in financial components
  - _Requirements: 18.1, 18.2_

- [ ] 34.11 Create reporting services
  - Create services/reportingService.ts with reporting operations using Supabase
  - Replace mock data with real API calls in reporting components
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7_

- [ ] 34.12 Create communication services
  - Create services/communicationService.ts with communication operations using Supabase
  - Create hooks/useCommunication.ts for communication data fetching
  - Replace mock data with real API calls in communication components
  - _Requirements: 20.1, 20.4, 20.7_

- [ ] 34.13 Create service package services
  - Create services/packageService.ts with package operations using Supabase
  - Create hooks/usePackages.ts for package data fetching
  - Replace mock data with real API calls in service package components
  - _Requirements: 21.1, 21.5_

- [ ] 34.14 Create quality management services
  - Create services/qualityService.ts with inquiry operations using Supabase
  - Create hooks/useInquiries.ts for inquiry data fetching
  - Replace mock data with real API calls in quality management components
  - _Requirements: 22.1, 22.2_

- [ ] 34.15 Create document management services
  - Create services/documentService.ts with document operations using Supabase
  - Create hooks/useDocuments.ts for document data fetching
  - Integrate with Supabase Storage for file uploads
  - Replace mock data with real API calls in document management components
  - _Requirements: 23.1, 23.2_

- [ ] 34.16 Create OPD/IPD services
  - Create services/opdIpdService.ts with OPD/IPD operations using Supabase
  - Create hooks/useOPDIPD.ts for OPD/IPD data fetching
  - Replace mock data with real API calls in OPD/IPD components
  - _Requirements: 25.1, 25.2, 25.3_

- [ ] 35. Implement authentication with Supabase
- [ ] 35.1 Integrate Supabase Auth
  - Update lib/auth.ts with Supabase authentication functions
  - Update stores/authStore.ts to use Supabase Auth
  - Implement login, logout, and session management with Supabase
  - Implement account lockout logic (3 failed attempts, 15-minute lockout)
  - Implement 30-minute inactivity timeout
  - Update login page to use real authentication
  - _Requirements: 5.1, 5.2, 5.11_

- [ ] 36. Implement agent hooks system
- [ ] 36.1 Create agent hooks services
  - Create services/agentService.ts with hook operations using Supabase
  - Create hooks/useAgentHooks.ts for hook data fetching
  - Replace mock data with real API calls in hooks manager
  - _Requirements: 9.1_

- [ ] 36.2 Build hook execution engine
  - Implement event emitter for hook triggers
  - Create hook execution logic for different action types (validate, notify, generate_recommendation)
  - Record hook execution results
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 36.3 Integrate hooks with events
  - Trigger hooks on patient.created, patient.updated, appointment.created, inventory.low_stock events
  - Implement data completeness validation hook
  - Implement scheduling conflict check hook
  - Implement appointment notification hook
  - Implement purchase order recommendation hook
  - _Requirements: 9.2, 9.3, 9.4_

- [ ] 37. Implement agent steering system
- [ ] 37.1 Create steering rules services
  - Add steering operations to services/agentService.ts using Supabase
  - Create hooks/useSteeringRules.ts for steering data fetching
  - Replace mock data with real API calls in steering manager
  - _Requirements: 10.1_

- [ ] 37.2 Build steering rules loader
  - Implement loader for .kiro/steering directory
  - Parse steering rule configuration files
  - Apply rules based on conditions (role, context)
  - _Requirements: 10.1, 10.4_

- [ ] 37.3 Integrate steering with data validation
  - Apply steering rules to patient record validation
  - Apply steering rules to appointment validation
  - Apply steering rules to inventory validation
  - Apply steering rules to clinical data validation
  - _Requirements: 10.2, 10.3_

## Phase 12: Testing & Deployment

- [ ] 38. Create sample data and seed database
  - Create database seed script with sample patients, staff, appointments, inventory items
  - Seed symptoms database with comprehensive symptom list
  - Seed medicines database with common medications
  - Seed diagnoses database with ICD-10 codes
  - Create seed data for beds and bed types
  - Create seed data for blood donors and donations
  - Create seed data for ambulances
  - Create seed data for insurance providers
  - Create seed data for service packages
  - Create seed data for hospital charges
  - _Requirements: Testing and demonstration_

- [ ] 39. End-to-end testing
- [ ] 39.1 Test patient management workflow
  - Test patient registration, search, edit, and view
  - Verify data persistence and validation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 39.2 Test appointment scheduling workflow
  - Test appointment creation, editing, cancellation
  - Verify double-booking prevention
  - Test appointment notifications
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 39.3 Test clinical workflow
  - Test patient visit documentation
  - Test symptom, diagnosis, and prescription recording
  - Verify drug interaction warnings
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 39.4 Test patient flow workflow
  - Test complete patient journey from registration to discharge
  - Verify stage transitions and wait time tracking
  - Test triage, laboratory, pharmacy, billing, and discharge processes
  - _Requirements: Patient flow management_

- [ ] 39.5 Test authentication and permissions
  - Test login/logout functionality
  - Verify role-based access control for all roles
  - Test permission-based UI rendering
  - Verify RLS policies
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10_

- [ ] 39.6 Test extended features
  - Test bed management, blood bank, emergency services
  - Test financial management, reporting, communication
  - Test service packages, quality management, document management
  - Test OPD/IPD management
  - _Requirements: All extended feature requirements_

- [ ] 39.7 Test agent hooks and steering
  - Test hook execution on various events
  - Verify steering rules application
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 40. Create documentation
- [ ] 40.1 Write user documentation
  - Create user guide for each module including all features
  - Document role-based access and permissions for all roles
  - Create quick start guide
  - _Requirements: Documentation_

- [ ] 40.2 Write developer documentation
  - Document project structure and architecture
  - Create API documentation for all services
  - Document complete database schema and relationships
  - Create contribution guidelines
  - _Requirements: Documentation_

- [ ] 40.3 Create README and setup instructions
  - Write comprehensive README.md with project overview
  - Document installation and setup steps
  - Include Supabase configuration instructions
  - Add screenshots and demo video
  - _Requirements: Documentation_

- [ ] 41. Build and package application
- [ ] 41.1 Configure Tauri build settings
  - Update tauri.conf.json with app metadata
  - Configure app icons and splash screen
  - Set up code signing (optional)
  - _Requirements: Deployment_

- [ ] 41.2 Build platform-specific installers
  - Build Windows .msi installer
  - Build macOS .dmg installer (if on macOS)
  - Build Linux .deb/.AppImage (if on Linux)
  - _Requirements: Deployment_

- [ ] 41.3 Test installers
  - Install and test application on target platforms
  - Verify database connection and functionality
  - Test all major workflows end-to-end
  - _Requirements: Deployment_
