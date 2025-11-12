# Requirements Document

## Introduction

This document outlines the requirements for an open-source Hospital Management System (HMS). The HMS is a desktop application built with Tauri, Vite, and shadcn/ui components, using Supabase for database and storage. The application features a black and white color scheme and provides comprehensive hospital operations management including patient records, appointments, staff management, and inventory tracking.

## Glossary

- **HMS**: Hospital Management System - The desktop application being developed
- **Patient Record**: Digital record containing patient demographic and medical information
- **Appointment**: Scheduled meeting between a patient and healthcare provider
- **Staff Member**: Hospital employee including doctors, nurses, and administrative personnel
- **Inventory Item**: Medical supplies, equipment, or pharmaceutical items tracked by the system
- **Supabase**: Backend-as-a-Service platform providing database and storage functionality
- **Tauri**: Framework for building desktop applications using web technologies
- **shadcn/ui**: Collection of reusable UI components built with Radix UI and Tailwind CSS
- **Agent Hook**: Automated workflow that executes when specific events occur in the system
- **Agent Steering**: Configuration rules that guide system behavior and enforce policies
- **System Administrator**: User role with full system access including user management and configuration
- **Doctor**: User role with access to patient medical records and appointments
- **Nurse**: User role with access to patient care documentation and schedules
- **Receptionist**: User role with access to appointment scheduling and patient registration
- **Inventory Manager**: User role with access to inventory and supply management
- **Read-Only Viewer**: User role with view-only access to system data
- **Symptom**: Observable or experienced indication of a medical condition
- **Medicine**: Pharmaceutical substance used for treatment or prevention of disease
- **Diagnosis**: Medical determination of a patient's condition or disease
- **Prescription**: Written order for medicine including dosage and administration instructions
- **ICD-10**: International Classification of Diseases, 10th revision - standardized diagnostic codes
- **Patient Visit**: Clinical encounter between patient and healthcare provider documented in the system
- **OPD**: Outpatient Department - Department handling patients who do not require overnight hospitalization
- **IPD**: Inpatient Department - Department handling patients requiring admission and overnight stay
- **Bed**: Hospital bed resource that can be allocated to admitted patients
- **Blood Donor**: Individual who donates blood to the hospital blood bank
- **Blood Unit**: Single unit of donated blood stored in inventory
- **Ambulance**: Emergency vehicle used for patient transport
- **Emergency Case**: Critical medical situation requiring immediate attention
- **Case Handler**: Staff member assigned to manage emergency cases
- **Insurance Provider**: External organization providing health insurance coverage
- **Service Package**: Bundled set of medical services offered at a package price
- **Notice**: Hospital-wide announcement or notification
- **Document**: Digital file stored in the system for reference
- **Lab Technician**: User role with access to laboratory test management
- **Pharmacist**: User role with access to pharmacy and medicine dispensing
- **Accountant**: User role with access to financial management and reporting
- **Hospital Admin**: User role with hospital-wide management capabilities

## Requirements

### Requirement 1: Patient Management

**User Story:** As a hospital administrator, I want to manage patient records digitally, so that I can efficiently store and retrieve patient information.

#### Acceptance Criteria

1. THE HMS SHALL provide a form to create new patient records with fields for name, date of birth, contact information, and medical history
2. WHEN a user searches for a patient by name or ID, THE HMS SHALL display matching patient records within 2 seconds
3. THE HMS SHALL allow authorized users to update existing patient information
4. THE HMS SHALL display patient records in a list view with pagination showing 20 records per page
5. WHEN a user attempts to create a patient record with missing required fields, THE HMS SHALL display validation error messages

### Requirement 2: Appointment Scheduling

**User Story:** As a receptionist, I want to schedule and manage patient appointments, so that I can coordinate healthcare provider availability with patient needs.

#### Acceptance Criteria

1. THE HMS SHALL provide a calendar interface to view appointments by day, week, or month
2. WHEN a user creates an appointment, THE HMS SHALL require selection of patient, healthcare provider, date, time, and appointment type
3. THE HMS SHALL prevent double-booking by displaying an error when attempting to schedule overlapping appointments for the same provider
4. WHEN an appointment time approaches within 24 hours, THE HMS SHALL display the appointment in a pending notifications list
5. THE HMS SHALL allow users to cancel or reschedule existing appointments

### Requirement 3: Staff Management

**User Story:** As a hospital administrator, I want to manage staff member profiles and schedules, so that I can track personnel information and availability.

#### Acceptance Criteria

1. THE HMS SHALL store staff member information including name, role, department, contact details, and employment status
2. THE HMS SHALL provide role-based access where administrators can create, update, and deactivate staff accounts
3. WHEN viewing staff lists, THE HMS SHALL allow filtering by department, role, or employment status
4. THE HMS SHALL display staff schedules showing assigned shifts and availability
5. THE HMS SHALL require unique employee identification numbers for each staff member

### Requirement 4: Inventory Management

**User Story:** As a hospital inventory manager, I want to track medical supplies and equipment, so that I can maintain adequate stock levels and prevent shortages.

#### Acceptance Criteria

1. THE HMS SHALL maintain inventory records with item name, category, quantity, unit of measure, and reorder threshold
2. WHEN inventory quantity falls below the reorder threshold, THE HMS SHALL display the item in a low-stock alert list
3. THE HMS SHALL allow users to record inventory transactions including additions, usage, and adjustments
4. THE HMS SHALL display current inventory levels grouped by category
5. THE HMS SHALL generate inventory transaction history showing date, type, quantity change, and user who performed the transaction

### Requirement 5: Authentication and Authorization

**User Story:** As a system administrator, I want to control user access to the system with granular role-based permissions, so that I can ensure data security and appropriate access levels for different staff members.

#### Acceptance Criteria

1. THE HMS SHALL require users to authenticate with email and password before accessing the application
2. WHEN a user enters incorrect credentials three consecutive times, THE HMS SHALL lock the account for 15 minutes
3. THE HMS SHALL implement role-based access control with the following roles: System Administrator, Doctor, Nurse, Receptionist, Inventory Manager, and Read-Only Viewer
4. WHERE a user has System Administrator role, THE HMS SHALL grant full access to all features including user management, system configuration, and all data operations
5. WHERE a user has Doctor role, THE HMS SHALL grant access to view and update patient records, view appointments, and access medical history
6. WHERE a user has Nurse role, THE HMS SHALL grant access to view patient records, update vital signs and notes, and view appointment schedules
7. WHERE a user has Receptionist role, THE HMS SHALL grant access to create and manage appointments, create patient records, and view basic patient information
8. WHERE a user has Inventory Manager role, THE HMS SHALL grant access to manage inventory items, record transactions, and view inventory reports
9. WHERE a user has Read-Only Viewer role, THE HMS SHALL grant access to view data without modification capabilities across all modules
10. THE HMS SHALL integrate with Supabase authentication and row-level security for user management
11. WHEN a user session is inactive for 30 minutes, THE HMS SHALL automatically log out the user
12. THE HMS SHALL display only the navigation menu items and features that the authenticated user has permission to access

### Requirement 6: Data Persistence and Synchronization

**User Story:** As a hospital staff member, I want my data to be reliably saved and synchronized, so that I can access up-to-date information across sessions.

#### Acceptance Criteria

1. THE HMS SHALL store all patient, appointment, staff, and inventory data in Supabase database
2. WHEN a user creates or updates a record, THE HMS SHALL save changes to Supabase within 3 seconds
3. IF the network connection is lost during a save operation, THEN THE HMS SHALL display an error message and retain unsaved changes locally
4. THE HMS SHALL retrieve data from Supabase when the application starts
5. WHEN multiple users update the same record simultaneously, THE HMS SHALL apply the most recent change and notify users of conflicts

### Requirement 7: User Interface and Design

**User Story:** As a hospital staff member, I want a clean and intuitive interface, so that I can navigate the system efficiently without extensive training.

#### Acceptance Criteria

1. THE HMS SHALL implement a dark color scheme using Rich Black, Gunmetal, Prussian Blue, Cool Gray, and Mint Cream throughout the application
2. THE HMS SHALL use Imperial Red for error states and destructive actions
3. THE HMS SHALL use Inter as the primary font for body text, Mona Sans for headings, and Poppins for buttons and labels
4. THE HMS SHALL use shadcn/ui components for all interactive elements including buttons, forms, tables, and dialogs
5. THE HMS SHALL provide a navigation menu to access patient management, appointments, staff, and inventory sections
6. THE HMS SHALL display loading indicators when fetching data from Supabase
7. WHEN a user performs an action, THE HMS SHALL provide visual feedback through toast notifications or status messages
8. THE HMS SHALL maintain AAA accessibility contrast ratios for primary text and AA ratios for secondary text

### Requirement 8: Reporting and Analytics

**User Story:** As a hospital administrator, I want to view reports and statistics, so that I can make informed decisions about hospital operations.

#### Acceptance Criteria

1. THE HMS SHALL display a dashboard showing total patients, upcoming appointments, active staff, and low-stock inventory items
2. THE HMS SHALL generate appointment statistics showing total appointments by day, week, or month
3. THE HMS SHALL provide patient demographics summary including age distribution and visit frequency
4. THE HMS SHALL display staff utilization showing appointment counts per healthcare provider
5. THE HMS SHALL allow exporting reports to CSV format

### Requirement 9: Agent Hooks for Automation

**User Story:** As a hospital administrator, I want to configure automated workflows using agent hooks, so that routine tasks can be performed automatically when specific events occur.

#### Acceptance Criteria

1. THE HMS SHALL provide a configuration interface to create and manage agent hooks
2. WHEN a patient record is created or updated, THE HMS SHALL trigger a configured hook to validate data completeness
3. WHEN an appointment is scheduled, THE HMS SHALL trigger a hook to check for scheduling conflicts and send notifications
4. WHEN inventory quantity falls below reorder threshold, THE HMS SHALL trigger a hook to generate purchase order recommendations
5. THE HMS SHALL allow users to enable, disable, or delete configured hooks through the settings interface

### Requirement 10: Agent Steering for Customization

**User Story:** As a system administrator, I want to configure agent steering rules, so that I can customize system behavior and enforce hospital-specific policies.

#### Acceptance Criteria

1. THE HMS SHALL load steering rules from configuration files in the .kiro/steering directory
2. THE HMS SHALL apply steering rules to enforce data validation standards for patient records, appointments, and inventory
3. WHEN processing user inputs, THE HMS SHALL apply active steering rules to guide data formatting and validation
4. THE HMS SHALL allow conditional steering rules that apply based on user role or data context
5. THE HMS SHALL provide documentation templates for creating custom steering rules specific to hospital workflows

### Requirement 11: Medical Knowledge Database - Symptoms

**User Story:** As a doctor, I want to access a comprehensive symptoms database, so that I can document patient symptoms accurately and reference symptom information during diagnosis.

#### Acceptance Criteria

1. THE HMS SHALL maintain a symptoms database with symptom name, description, category, severity levels, and associated body systems
2. WHEN a user searches for symptoms by name or category, THE HMS SHALL display matching results within 2 seconds
3. THE HMS SHALL allow doctors to record patient symptoms by selecting from the database and adding notes
4. THE HMS SHALL link recorded symptoms to patient visit records with timestamp and recording user
5. THE HMS SHALL provide symptom categories including respiratory, cardiovascular, neurological, gastrointestinal, musculoskeletal, and dermatological

### Requirement 12: Medical Knowledge Database - Medicines

**User Story:** As a doctor, I want to access a medicines database and prescribe medications, so that I can provide accurate treatment and maintain prescription records.

#### Acceptance Criteria

1. THE HMS SHALL maintain a medicines database with medicine name, generic name, brand names, dosage forms, strength options, and usage instructions
2. THE HMS SHALL store medicine information including contraindications, side effects, drug interactions, and storage requirements
3. WHEN a doctor prescribes medicine, THE HMS SHALL create a prescription record linked to the patient with medicine details, dosage, frequency, duration, and special instructions
4. THE HMS SHALL display drug interaction warnings when prescribing multiple medicines to the same patient
5. THE HMS SHALL allow searching medicines by name, generic name, or therapeutic category
6. THE HMS SHALL track prescription history showing all medicines prescribed to a patient with dates and prescribing doctor

### Requirement 13: Diagnosis Management

**User Story:** As a doctor, I want to record and manage patient diagnoses, so that I can maintain accurate medical records and track patient conditions over time.

#### Acceptance Criteria

1. THE HMS SHALL maintain a diagnosis database with diagnosis codes, names, descriptions, and ICD-10 classification
2. WHEN a doctor records a diagnosis, THE HMS SHALL link it to the patient record with diagnosis date, severity, status, and clinical notes
3. THE HMS SHALL allow doctors to associate recorded symptoms with diagnoses to document clinical reasoning
4. THE HMS SHALL display patient diagnosis history showing all past and current diagnoses with dates and treating physicians
5. THE HMS SHALL support diagnosis status tracking including suspected, confirmed, resolved, and chronic
6. THE HMS SHALL provide diagnostic suggestions based on recorded symptoms using keyword matching

### Requirement 14: Clinical Workflow Integration

**User Story:** As a doctor, I want an integrated clinical workflow, so that I can efficiently document patient visits from symptoms to diagnosis to treatment.

#### Acceptance Criteria

1. THE HMS SHALL provide a patient visit interface that guides doctors through symptom recording, diagnosis, and prescription steps
2. WHEN a doctor starts a patient visit, THE HMS SHALL display patient history including previous symptoms, diagnoses, and active prescriptions
3. THE HMS SHALL allow doctors to create visit summaries that include recorded symptoms, diagnoses made, medicines prescribed, and follow-up recommendations
4. THE HMS SHALL link all visit data including symptoms, diagnoses, and prescriptions to a single visit record with timestamp
5. THE HMS SHALL generate visit reports that can be printed or exported for patient records

### Requirement 15: Bed Management

**User Story:** As a nurse, I want to manage hospital bed allocation and status, so that I can efficiently assign beds to admitted patients and track bed availability.

#### Acceptance Criteria

1. THE HMS SHALL maintain bed records with bed number, bed type, department, floor, room number, and current status
2. THE HMS SHALL support bed types including general, ICU, private, semi-private, and emergency
3. THE HMS SHALL track bed status including available, occupied, under_cleaning, under_maintenance, and reserved
4. WHEN a patient is admitted, THE HMS SHALL allow staff to allocate an available bed to the patient
5. THE HMS SHALL display a visual bed map showing bed locations and status with color coding
6. THE HMS SHALL allow filtering beds by department, floor, type, and status
7. WHEN a bed becomes available, THE HMS SHALL update the status and make it available for allocation
8. THE HMS SHALL track bed occupancy history including patient, admission date, and discharge date
9. THE HMS SHALL calculate and display bed occupancy rates by department and overall
10. THE HMS SHALL allow configuration of bed pricing based on bed type

### Requirement 16: Blood Bank Management

**User Story:** As a blood bank manager, I want to manage blood donors and blood inventory, so that I can maintain adequate blood supply and track donations.

#### Acceptance Criteria

1. THE HMS SHALL maintain blood donor records with name, blood type, contact information, and donation history
2. THE HMS SHALL support blood types including A+, A-, B+, B-, AB+, AB-, O+, and O-
3. THE HMS SHALL record blood donations with donor, donation date, blood type, quantity, and expiry date
4. THE HMS SHALL track blood inventory showing available units by blood type
5. WHEN blood inventory for a type falls below minimum threshold, THE HMS SHALL display low stock alert
6. THE HMS SHALL allow recording blood usage with patient, blood type, quantity, and usage date
7. THE HMS SHALL track blood unit expiry dates and display alerts for units expiring within 7 days
8. THE HMS SHALL generate blood bank reports showing donations, usage, and current inventory by blood type
9. THE HMS SHALL maintain donor eligibility status based on last donation date
10. THE HMS SHALL calculate and display blood inventory turnover rates

### Requirement 17: Emergency Services Management

**User Story:** As an emergency coordinator, I want to manage ambulances and emergency cases, so that I can coordinate rapid response to medical emergencies.

#### Acceptance Criteria

1. THE HMS SHALL maintain ambulance records with vehicle number, driver name, contact number, and availability status
2. THE HMS SHALL track ambulance status including available, on_call, under_maintenance, and out_of_service
3. WHEN an emergency call is received, THE HMS SHALL record caller information, location, emergency type, and call time
4. THE HMS SHALL allow dispatching available ambulances to emergency calls
5. THE HMS SHALL assign case handlers to emergency cases for coordination
6. THE HMS SHALL track emergency case status including received, dispatched, patient_picked_up, arrived_at_hospital, and completed
7. THE HMS SHALL record emergency case details including patient condition, treatment provided, and outcome
8. THE HMS SHALL display active emergency cases with real-time status updates
9. THE HMS SHALL generate emergency response reports showing response times and outcomes
10. THE HMS SHALL calculate average response time from call to patient pickup

### Requirement 18: Financial Management and Billing

**User Story:** As an accountant, I want comprehensive financial management tools, so that I can track hospital revenue, expenses, and generate financial reports.

#### Acceptance Criteria

1. THE HMS SHALL support insurance management with insurance provider details, policy verification, and claim processing
2. WHEN generating a bill, THE HMS SHALL allow applying insurance coverage and calculating patient responsibility
3. THE HMS SHALL track advance payments and deposits from patients
4. THE HMS SHALL maintain a chart of accounts for hospital financial tracking
5. THE HMS SHALL record hospital expenses with category, amount, date, vendor, and payment method
6. THE HMS SHALL track hospital income from various sources including consultations, procedures, pharmacy, and laboratory
7. THE HMS SHALL configure hospital charges for services, procedures, and consultations
8. THE HMS SHALL generate financial reports including income statements, expense reports, and revenue analysis
9. THE HMS SHALL support multiple payment methods including cash, card, insurance, and bank transfer
10. THE HMS SHALL track payment status and generate aging reports for outstanding payments
11. THE HMS SHALL process staff payroll with salary, deductions, bonuses, and payment history
12. THE HMS SHALL generate payroll reports showing salary disbursements by department and period

### Requirement 19: Enhanced Reporting

**User Story:** As a hospital administrator, I want comprehensive reporting capabilities, so that I can track hospital operations and comply with regulatory requirements.

#### Acceptance Criteria

1. THE HMS SHALL generate birth reports with mother details, baby details, birth date, time, weight, and attending physician
2. THE HMS SHALL create birth certificates that can be printed or exported
3. THE HMS SHALL generate death reports with patient details, death date, time, cause of death, and certifying physician
4. THE HMS SHALL create death certificates that can be printed or exported
5. THE HMS SHALL track surgical operations with operation type, surgeon, date, duration, and outcome
6. THE HMS SHALL generate operation reports showing scheduled and completed surgeries
7. THE HMS SHALL create operation theater utilization reports
8. THE HMS SHALL generate comprehensive payment reports with revenue breakdown by service type
9. THE HMS SHALL provide date range filtering for all reports
10. THE HMS SHALL allow exporting all reports to PDF and CSV formats

### Requirement 20: Communication System

**User Story:** As a hospital staff member, I want internal communication tools, so that I can stay informed and communicate with colleagues efficiently.

#### Acceptance Criteria

1. THE HMS SHALL provide a notice board for hospital-wide announcements
2. THE HMS SHALL allow administrators to create, edit, and delete notices
3. THE HMS SHALL display notices with title, content, posted date, and expiry date
4. THE HMS SHALL provide an internal mail system for staff communication
5. WHEN sending internal mail, THE HMS SHALL allow selecting recipients by role or individual staff members
6. THE HMS SHALL display unread message count and notification for new messages
7. THE HMS SHALL maintain a staff schedule calendar showing shifts and availability
8. THE HMS SHALL allow staff to view their assigned schedules
9. THE HMS SHALL send notifications for schedule changes
10. THE HMS SHALL archive expired notices automatically

### Requirement 21: Service Packages and Pricing

**User Story:** As a hospital administrator, I want to manage service packages and pricing, so that I can offer bundled services and configure consultation fees.

#### Acceptance Criteria

1. THE HMS SHALL allow creation of service packages with package name, description, included services, and package price
2. THE HMS SHALL display available packages to reception staff during patient registration
3. THE HMS SHALL apply package pricing when services are rendered
4. THE HMS SHALL track package utilization and revenue
5. THE HMS SHALL configure doctor OPD consultation charges by doctor and specialization
6. THE HMS SHALL apply appropriate consultation fees during appointment billing
7. THE HMS SHALL allow seasonal or promotional pricing for packages
8. THE HMS SHALL generate package performance reports

### Requirement 22: Quality Management

**User Story:** As a quality manager, I want to track patient feedback and complaints, so that I can improve hospital services and patient satisfaction.

#### Acceptance Criteria

1. THE HMS SHALL provide an inquiry management system for patient feedback and complaints
2. THE HMS SHALL record inquiry details including patient, inquiry type, description, and submission date
3. THE HMS SHALL support inquiry types including complaint, suggestion, compliment, and general inquiry
4. THE HMS SHALL assign inquiries to staff members for resolution
5. THE HMS SHALL track inquiry status including submitted, under_review, resolved, and closed
6. THE HMS SHALL allow staff to add responses and resolution notes to inquiries
7. THE HMS SHALL notify patients when their inquiry is resolved
8. THE HMS SHALL generate inquiry reports showing resolution times and satisfaction metrics
9. THE HMS SHALL categorize inquiries by department for targeted improvements
10. THE HMS SHALL calculate average resolution time by inquiry type

### Requirement 23: Document Management

**User Story:** As a hospital administrator, I want a document management system, so that I can store and organize hospital documents securely.

#### Acceptance Criteria

1. THE HMS SHALL provide document storage with support for PDF, images, and office documents
2. THE HMS SHALL organize documents by document type including policies, procedures, forms, and reports
3. THE HMS SHALL allow uploading documents with title, description, document type, and tags
4. THE HMS SHALL support document versioning with version history
5. THE HMS SHALL allow searching documents by title, type, tags, or content
6. THE HMS SHALL implement access control for sensitive documents based on user role
7. THE HMS SHALL track document views and downloads
8. THE HMS SHALL allow document sharing with specific users or roles
9. THE HMS SHALL provide document expiry tracking for time-sensitive documents
10. THE HMS SHALL generate document management reports showing storage usage and access patterns

### Requirement 24: Enhanced User Roles

**User Story:** As a system administrator, I want additional specialized user roles, so that I can provide appropriate access to different hospital staff members.

#### Acceptance Criteria

1. WHERE a user has Lab Technician role, THE HMS SHALL grant access to laboratory test management, sample collection, and results entry
2. WHERE a user has Pharmacist role, THE HMS SHALL grant access to pharmacy inventory, prescription fulfillment, and medicine dispensing
3. WHERE a user has Accountant role, THE HMS SHALL grant access to financial management, billing, payments, and financial reports
4. WHERE a user has Hospital Admin role, THE HMS SHALL grant access to hospital-wide management, reporting, and staff management excluding system configuration
5. THE HMS SHALL allow Lab Technicians to view assigned test orders and update test status
6. THE HMS SHALL allow Pharmacists to view prescriptions and record medicine dispensing
7. THE HMS SHALL allow Accountants to manage accounts, process payments, and generate financial reports
8. THE HMS SHALL allow Hospital Admins to view all reports and manage non-technical settings
9. THE HMS SHALL restrict system configuration and user management to System Administrator role only
10. THE HMS SHALL display role-appropriate dashboard and navigation menu for each user role

### Requirement 25: OPD and IPD Management

**User Story:** As a receptionist, I want to manage both outpatient and inpatient departments, so that I can handle different types of patient visits efficiently.

#### Acceptance Criteria

1. THE HMS SHALL distinguish between OPD and IPD appointments and visits
2. WHEN registering an OPD patient, THE HMS SHALL create an outpatient visit record without bed allocation
3. WHEN admitting an IPD patient, THE HMS SHALL create an inpatient visit record and require bed allocation
4. THE HMS SHALL display separate queues for OPD and IPD patients
5. THE HMS SHALL track IPD patient admission date, expected discharge date, and actual discharge date
6. THE HMS SHALL calculate IPD stay duration and apply per-day charges based on bed type
7. THE HMS SHALL allow transferring patients between beds during IPD stay
8. THE HMS SHALL generate OPD and IPD statistics separately
9. THE HMS SHALL display current IPD census showing occupied beds and admitted patients
10. THE HMS SHALL require discharge summary for IPD patients before final discharge
