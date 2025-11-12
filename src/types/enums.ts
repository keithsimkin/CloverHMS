/**
 * Enums and constants for the Hospital Management System
 */

// User Roles
export enum Role {
  ADMIN = 'admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  LAB_TECHNICIAN = 'lab_technician',
  PHARMACIST = 'pharmacist',
  ACCOUNTANT = 'accountant',
  INVENTORY_MANAGER = 'inventory_manager',
  VIEWER = 'viewer',
}

// Permissions
export enum Permission {
  // Patient permissions
  PATIENT_VIEW = 'patient:view',
  PATIENT_CREATE = 'patient:create',
  PATIENT_UPDATE = 'patient:update',
  PATIENT_DELETE = 'patient:delete',

  // Appointment permissions
  APPOINTMENT_VIEW = 'appointment:view',
  APPOINTMENT_CREATE = 'appointment:create',
  APPOINTMENT_UPDATE = 'appointment:update',
  APPOINTMENT_DELETE = 'appointment:delete',

  // Staff permissions
  STAFF_VIEW = 'staff:view',
  STAFF_MANAGE = 'staff:manage',

  // Inventory permissions
  INVENTORY_VIEW = 'inventory:view',
  INVENTORY_MANAGE = 'inventory:manage',

  // Clinical permissions
  CLINICAL_VIEW = 'clinical:view',
  CLINICAL_RECORD = 'clinical:record',
  PRESCRIBE_MEDICINE = 'clinical:prescribe',

  // System permissions
  SYSTEM_ADMIN = 'system:admin',
  REPORTS_VIEW = 'reports:view',
  SETTINGS_MANAGE = 'settings:manage',
}

// Gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// Blood Types
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

// Appointment Types
export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow-up',
  EMERGENCY = 'emergency',
  PROCEDURE = 'procedure',
}

// Appointment Status
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Employment Status
export enum EmploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}

// Inventory Categories
export enum InventoryCategory {
  MEDICAL_SUPPLIES = 'medical_supplies',
  EQUIPMENT = 'equipment',
  PHARMACEUTICALS = 'pharmaceuticals',
  CONSUMABLES = 'consumables',
}

// Transaction Types
export enum TransactionType {
  ADDITION = 'addition',
  USAGE = 'usage',
  ADJUSTMENT = 'adjustment',
  DISPOSAL = 'disposal',
}

// Symptom Categories
export enum SymptomCategory {
  RESPIRATORY = 'respiratory',
  CARDIOVASCULAR = 'cardiovascular',
  NEUROLOGICAL = 'neurological',
  GASTROINTESTINAL = 'gastrointestinal',
  MUSCULOSKELETAL = 'musculoskeletal',
  DERMATOLOGICAL = 'dermatological',
  OTHER = 'other',
}

// Prescription Status
export enum PrescriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
}

// Diagnosis Severity
export enum DiagnosisSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

// Diagnosis Status
export enum DiagnosisStatus {
  SUSPECTED = 'suspected',
  CONFIRMED = 'confirmed',
  RESOLVED = 'resolved',
  CHRONIC = 'chronic',
}

// Visit Types
export enum VisitType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow-up',
  EMERGENCY = 'emergency',
}

// Patient Flow Stages
export enum FlowStage {
  REGISTRATION = 'registration',
  WAITING = 'waiting',
  TRIAGE = 'triage',
  CONSULTATION = 'consultation',
  EXAMINATION = 'examination',
  DIAGNOSIS = 'diagnosis',
  TREATMENT = 'treatment',
  LABORATORY = 'laboratory',
  PHARMACY = 'pharmacy',
  BILLING = 'billing',
  DISCHARGE = 'discharge',
}

// Priority Levels
export enum PriorityLevel {
  CRITICAL = 'critical',
  URGENT = 'urgent',
  SEMI_URGENT = 'semi-urgent',
  NON_URGENT = 'non-urgent',
}

// Laboratory Order Status
export enum LabOrderStatus {
  ORDERED = 'ordered',
  SAMPLE_COLLECTED = 'sample_collected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
}

// Payment Methods
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  INSURANCE = 'insurance',
  BANK_TRANSFER = 'bank_transfer',
}

// Discharge Types
export enum DischargeType {
  ROUTINE = 'routine',
  AGAINST_MEDICAL_ADVICE = 'against_medical_advice',
  TRANSFER = 'transfer',
  DECEASED = 'deceased',
}

// Bed Types
export enum BedType {
  GENERAL = 'general',
  ICU = 'icu',
  PRIVATE = 'private',
  SEMI_PRIVATE = 'semi_private',
  EMERGENCY = 'emergency',
}

// Bed Status
export enum BedStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  UNDER_CLEANING = 'under_cleaning',
  UNDER_MAINTENANCE = 'under_maintenance',
  RESERVED = 'reserved',
}

// Blood Donation Status
export enum BloodDonationStatus {
  AVAILABLE = 'available',
  USED = 'used',
  EXPIRED = 'expired',
  DISCARDED = 'discarded',
}

// Donor Eligibility Status
export enum DonorEligibilityStatus {
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  DEFERRED = 'deferred',
}

// Ambulance Status
export enum AmbulanceStatus {
  AVAILABLE = 'available',
  ON_CALL = 'on_call',
  UNDER_MAINTENANCE = 'under_maintenance',
  OUT_OF_SERVICE = 'out_of_service',
}

// Emergency Call Status
export enum EmergencyCallStatus {
  RECEIVED = 'received',
  DISPATCHED = 'dispatched',
  PATIENT_PICKED_UP = 'patient_picked_up',
  ARRIVED_AT_HOSPITAL = 'arrived_at_hospital',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Insurance Status
export enum InsuranceStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Insurance Claim Status
export enum InsuranceClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

// Income Sources
export enum IncomeSource {
  CONSULTATION = 'consultation',
  PROCEDURE = 'procedure',
  PHARMACY = 'pharmacy',
  LABORATORY = 'laboratory',
  BED_CHARGES = 'bed_charges',
  OTHER = 'other',
}

// Payroll Status
export enum PayrollStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  PAID = 'paid',
}

// Delivery Types
export enum DeliveryType {
  NORMAL = 'normal',
  CESAREAN = 'cesarean',
  ASSISTED = 'assisted',
}

// Operation Outcomes
export enum OperationOutcome {
  SUCCESSFUL = 'successful',
  COMPLICATIONS = 'complications',
  FAILED = 'failed',
}

// Notice Types
export enum NoticeType {
  ANNOUNCEMENT = 'announcement',
  ALERT = 'alert',
  POLICY = 'policy',
  EVENT = 'event',
}

// Notice Priority
export enum NoticePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Notice Status
export enum NoticeStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
}

// Mail Priority
export enum MailPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

// Shift Types
export enum ShiftType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
  FULL_DAY = 'full_day',
}

// Package Status
export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Package Subscription Status
export enum PackageSubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  FULLY_USED = 'fully_used',
}

// Inquiry Types
export enum InquiryType {
  COMPLAINT = 'complaint',
  SUGGESTION = 'suggestion',
  COMPLIMENT = 'compliment',
  GENERAL = 'general',
}

// Inquiry Status
export enum InquiryStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

// Document Types
export enum DocumentType {
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  FORM = 'form',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

// Document Status
export enum DocumentStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
}

// OPD Visit Status
export enum OPDVisitStatus {
  WAITING = 'waiting',
  IN_CONSULTATION = 'in_consultation',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// IPD Admission Types
export enum IPDAdmissionType {
  EMERGENCY = 'emergency',
  PLANNED = 'planned',
  TRANSFER = 'transfer',
}

// IPD Admission Status
export enum IPDAdmissionStatus {
  ADMITTED = 'admitted',
  DISCHARGED = 'discharged',
  TRANSFERRED = 'transferred',
}

// Agent Hook Event Types
export enum HookEventType {
  PATIENT_CREATED = 'patient.created',
  PATIENT_UPDATED = 'patient.updated',
  APPOINTMENT_CREATED = 'appointment.created',
  INVENTORY_LOW_STOCK = 'inventory.low_stock',
}

// Agent Hook Action Types
export enum HookActionType {
  VALIDATE = 'validate',
  NOTIFY = 'notify',
  GENERATE_RECOMMENDATION = 'generate_recommendation',
}

// Steering Rule Types
export enum SteeringRuleType {
  VALIDATION = 'validation',
  FORMATTING = 'formatting',
  POLICY = 'policy',
}

// Error Types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
}
