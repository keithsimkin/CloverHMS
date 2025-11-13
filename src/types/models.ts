/**
 * Domain models for the Hospital Management System
 */

import {
  Role,
  Gender,
  BloodType,
  AppointmentType,
  AppointmentStatus,
  EmploymentStatus,
  InventoryCategory,
  TransactionType,
  SymptomCategory,
  PrescriptionStatus,
  DiagnosisSeverity,
  DiagnosisStatus,
  VisitType,
  FlowStage,
  PriorityLevel,
  LabOrderStatus,
  PaymentStatus,
  PaymentMethod,
  DischargeType,
  BedType,
  BedStatus,
  BloodDonationStatus,
  DonorEligibilityStatus,
  AmbulanceStatus,
  EmergencyCallStatus,
  InsuranceStatus,
  InsuranceClaimStatus,
  IncomeSource,
  PayrollStatus,
  DeliveryType,
  OperationOutcome,
  NoticeType,
  NoticePriority,
  NoticeStatus,
  MailPriority,
  ShiftType,
  PackageStatus,
  PackageSubscriptionStatus,
  InquiryType,
  InquiryStatus,
  DocumentType,
  DocumentStatus,
  OPDVisitStatus,
  IPDAdmissionType,
  IPDAdmissionStatus,
  HookEventType,
  HookActionType,
  SteeringRuleType,
  ErrorType,
} from './enums';

// ============================================================================
// Core Models
// ============================================================================

export interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: Gender;
  contact_phone: string;
  contact_email?: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type?: BloodType;
  allergies?: string[];
  medical_history?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_date: Date;
  appointment_time: string;
  duration_minutes: number;
  appointment_type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

export interface Staff {
  id: string;
  user_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: Role;
  department: string;
  specialization?: string;
  contact_phone: string;
  contact_email: string;
  employment_status: EmploymentStatus;
  hire_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryItem {
  id: string;
  item_code: string;
  item_name: string;
  category: InventoryCategory;
  quantity: number;
  unit_of_measure: string;
  reorder_threshold: number;
  unit_cost?: number;
  supplier?: string;
  location?: string;
  expiry_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  transaction_type: TransactionType;
  quantity_change: number;
  quantity_after: number;
  reason?: string;
  performed_by: string;
  created_at: Date;
}

// ============================================================================
// Clinical Models
// ============================================================================

export interface Symptom {
  id: string;
  symptom_name: string;
  description: string;
  category: SymptomCategory;
  body_system: string;
  severity_levels: string[];
  created_at: Date;
}

export interface PatientSymptom {
  id: string;
  patient_id: string;
  visit_id: string;
  symptom_id: string;
  severity: string;
  onset_date?: Date;
  notes?: string;
  recorded_by: string;
  recorded_at: Date;
}

export interface Medicine {
  id: string;
  medicine_name: string;
  generic_name: string;
  brand_names: string[];
  dosage_forms: string[];
  strength_options: string[];
  therapeutic_category: string;
  contraindications?: string[];
  side_effects?: string[];
  drug_interactions?: string[];
  storage_requirements?: string;
  created_at: Date;
}

export interface Prescription {
  id: string;
  patient_id: string;
  visit_id: string;
  medicine_id: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  special_instructions?: string;
  prescribed_by: string;
  prescribed_at: Date;
  status: PrescriptionStatus;
}

export interface Diagnosis {
  id: string;
  diagnosis_code: string;
  diagnosis_name: string;
  description: string;
  icd10_category: string;
  created_at: Date;
}

export interface PatientDiagnosis {
  id: string;
  patient_id: string;
  visit_id: string;
  diagnosis_id: string;
  severity: DiagnosisSeverity;
  status: DiagnosisStatus;
  diagnosis_date: Date;
  clinical_notes?: string;
  diagnosed_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface VitalSigns {
  temperature?: number;
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  pain_level?: number;
}

export interface PatientVisit {
  id: string;
  patient_id: string;
  provider_id: string;
  visit_date: Date;
  visit_type: VisitType;
  chief_complaint: string;
  vital_signs?: VitalSigns;
  visit_summary?: string;
  follow_up_recommendations?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// Patient Flow Models
// ============================================================================

export interface PatientFlow {
  id: string;
  patient_id: string;
  visit_id: string;
  current_stage: FlowStage;
  arrival_time: Date;
  discharge_time?: Date;
  total_wait_time_minutes?: number;
  created_at: Date;
  updated_at: Date;
}

export interface FlowTransition {
  id: string;
  flow_id: string;
  from_stage: FlowStage;
  to_stage: FlowStage;
  transition_time: Date;
  performed_by: string;
  notes?: string;
}

export interface TriageRecord {
  id: string;
  patient_id: string;
  flow_id: string;
  priority_level: PriorityLevel;
  chief_complaint: string;
  vital_signs: VitalSigns;
  triage_notes?: string;
  triaged_by: string;
  triaged_at: Date;
}

export interface LaboratoryOrder {
  id: string;
  patient_id: string;
  visit_id: string;
  flow_id: string;
  test_type: string;
  test_name: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: LabOrderStatus;
  ordered_by: string;
  ordered_at: Date;
  sample_collected_at?: Date;
  results_available_at?: Date;
  results?: string;
  notes?: string;
}

export interface PharmacyDispense {
  id: string;
  prescription_id: string;
  patient_id: string;
  flow_id: string;
  medicine_id: string;
  quantity_dispensed: number;
  dispensed_by: string;
  dispensed_at: Date;
  patient_counseling_provided: boolean;
  notes?: string;
}

export interface BillingRecord {
  id: string;
  patient_id: string;
  visit_id: string;
  flow_id: string;
  consultation_fee?: number;
  medication_cost?: number;
  laboratory_cost?: number;
  procedure_cost?: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  paid_amount?: number;
  billing_date: Date;
  processed_by: string;
}

export interface DischargeRecord {
  id: string;
  patient_id: string;
  visit_id: string;
  flow_id: string;
  discharge_time: Date;
  discharge_type: DischargeType;
  discharge_summary: string;
  follow_up_required: boolean;
  follow_up_date?: Date;
  discharge_medications?: string[];
  discharge_instructions: string;
  discharged_by: string;
}

// ============================================================================
// Bed Management Models
// ============================================================================

export interface Bed {
  id: string;
  bed_number: string;
  bed_type: BedType;
  department: string;
  floor: number;
  room_number: string;
  status: BedStatus;
  daily_rate: number;
  amenities?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface BedAllocation {
  id: string;
  bed_id: string;
  patient_id: string;
  visit_id: string;
  allocated_at: Date;
  expected_discharge_date?: Date;
  actual_discharge_date?: Date;
  allocated_by: string;
  notes?: string;
}

export interface BedTransfer {
  id: string;
  patient_id: string;
  from_bed_id: string;
  to_bed_id: string;
  transfer_date: Date;
  reason: string;
  transferred_by: string;
}

// ============================================================================
// Blood Bank Models
// ============================================================================

export interface BloodDonor {
  id: string;
  donor_id: string;
  first_name: string;
  last_name: string;
  blood_type: BloodType;
  date_of_birth: Date;
  contact_phone: string;
  contact_email?: string;
  address: string;
  last_donation_date?: Date;
  eligibility_status: DonorEligibilityStatus;
  total_donations: number;
  created_at: Date;
  updated_at: Date;
}

export interface BloodDonation {
  id: string;
  donor_id: string;
  donation_date: Date;
  blood_type: BloodType;
  quantity_ml: number;
  expiry_date: Date;
  status: BloodDonationStatus;
  screening_results?: string;
  collected_by: string;
  notes?: string;
}

export interface BloodUsage {
  id: string;
  donation_id: string;
  patient_id: string;
  usage_date: Date;
  quantity_ml: number;
  blood_type: BloodType;
  prescribed_by: string;
  administered_by: string;
  notes?: string;
}

export interface BloodInventory {
  blood_type: BloodType;
  available_units: number;
  total_quantity_ml: number;
  expiring_soon_count: number;
  minimum_threshold: number;
}

// ============================================================================
// Emergency Services Models
// ============================================================================

export interface Ambulance {
  id: string;
  vehicle_number: string;
  driver_name: string;
  driver_contact: string;
  status: AmbulanceStatus;
  last_maintenance_date?: Date;
  next_maintenance_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface EmergencyCall {
  id: string;
  call_time: Date;
  caller_name: string;
  caller_contact: string;
  patient_name?: string;
  location: string;
  emergency_type: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: EmergencyCallStatus;
  received_by: string;
}

export interface EmergencyCase {
  id: string;
  call_id: string;
  ambulance_id?: string;
  case_handler_id: string;
  patient_id?: string;
  dispatch_time?: Date;
  pickup_time?: Date;
  arrival_time?: Date;
  patient_condition: string;
  treatment_provided?: string;
  outcome: string;
  response_time_minutes?: number;
  notes?: string;
}

export interface CaseHandler {
  id: string;
  staff_id: string;
  specialization: string;
  availability_status: 'available' | 'on_duty' | 'off_duty';
  active_cases: number;
}

// ============================================================================
// Financial Management Models
// ============================================================================

export interface InsuranceProvider {
  id: string;
  name: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  coverage_details?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PatientInsurance {
  id: string;
  patient_id: string;
  provider_id: string;
  policy_number: string;
  coverage_amount: number;
  expiry_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface InsuranceClaim {
  id: string;
  patient_insurance_id: string;
  provider_id: string;
  billing_record_id: string;
  claim_number: string;
  claim_date: Date;
  claim_amount: number;
  approved_amount?: number;
  status: ClaimStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AdvancePayment {
  id: string;
  patient_id: string;
  amount: number;
  payment_date: Date;
  payment_method: PaymentMethod;
  remaining_balance: number;
  received_by: string;
  notes?: string;
}

export interface Expense {
  id: string;
  expense_category: string;
  amount: number;
  expense_date: Date;
  vendor: string;
  payment_method: PaymentMethod;
  description: string;
  approved_by?: string;
  receipt_number?: string;
}

export interface Income {
  id: string;
  income_source: IncomeSource;
  amount: number;
  income_date: Date;
  patient_id?: string;
  description: string;
  recorded_by: string;
}

export interface HospitalCharge {
  id: string;
  service_name: string;
  service_category: string;
  charge_amount: number;
  department?: string;
  effective_from: Date;
  effective_until?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Payroll {
  id: string;
  staff_id: string;
  pay_period_start: Date;
  pay_period_end: Date;
  basic_salary: number;
  allowances: number;
  deductions: number;
  bonuses: number;
  net_salary: number;
  payment_date: Date;
  payment_method: PaymentMethod;
  status: PayrollStatus;
  processed_by: string;
}

// ============================================================================
// Enhanced Reporting Models
// ============================================================================

export interface BirthReport {
  id: string;
  mother_patient_id: string;
  baby_name: string;
  baby_gender: Gender;
  birth_date: Date;
  birth_time: string;
  birth_weight_kg: number;
  birth_length_cm: number;
  delivery_type: DeliveryType;
  attending_physician_id: string;
  complications?: string;
  certificate_number?: string;
  created_at: Date;
}

export interface DeathReport {
  id: string;
  patient_id: string;
  death_date: Date;
  death_time: string;
  cause_of_death: string;
  place_of_death: string;
  certifying_physician_id: string;
  certificate_number?: string;
  autopsy_required: boolean;
  created_at: Date;
}

export interface OperationReport {
  id: string;
  patient_id: string;
  operation_type: string;
  operation_date: Date;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  surgeon_id: string;
  assistant_surgeons: string[];
  anesthetist_id: string;
  operation_theater: string;
  pre_operative_diagnosis: string;
  post_operative_diagnosis: string;
  procedure_performed: string;
  complications?: string;
  outcome: OperationOutcome;
  notes?: string;
  created_at: Date;
}

// ============================================================================
// Communication Models
// ============================================================================

export interface Notice {
  id: string;
  title: string;
  content: string;
  notice_type: NoticeType;
  priority: NoticePriority;
  posted_by: string;
  posted_date: Date;
  expiry_date?: Date;
  target_roles?: Role[];
  status: NoticeStatus;
}

export interface InternalMail {
  id: string;
  sender_id: string;
  recipient_ids: string[];
  subject: string;
  body: string;
  sent_at: Date;
  read_by: string[];
  priority: MailPriority;
  attachments?: string[];
}

export interface StaffSchedule {
  id: string;
  staff_id: string;
  schedule_date: Date;
  shift_type: ShiftType;
  start_time: string;
  end_time: string;
  department: string;
  notes?: string;
  created_by: string;
}

// ============================================================================
// Service Package Models
// ============================================================================

export interface ServicePackage {
  id: string;
  package_name: string;
  description: string;
  included_services: string[];
  package_price: number;
  validity_days: number;
  discount_percentage?: number;
  status: PackageStatus;
  created_at: Date;
  updated_at: Date;
}

export interface PackageSubscription {
  id: string;
  patient_id: string;
  package_id: string;
  purchase_date: Date;
  expiry_date: Date;
  services_used: string[];
  remaining_services: string[];
  status: PackageSubscriptionStatus;
}

export interface DoctorOPDCharge {
  id: string;
  doctor_id: string;
  specialization: string;
  consultation_fee: number;
  follow_up_fee: number;
  effective_from: Date;
  effective_until?: Date;
}

// ============================================================================
// Quality Management Models
// ============================================================================

export interface Inquiry {
  id: string;
  patient_id?: string;
  inquiry_type: InquiryType;
  subject: string;
  description: string;
  department?: string;
  submission_date: Date;
  assigned_to?: string;
  status: InquiryStatus;
  priority: 'low' | 'medium' | 'high';
  resolution_notes?: string;
  resolved_date?: Date;
  satisfaction_rating?: number;
}

// ============================================================================
// Document Management Models
// ============================================================================

export interface Document {
  id: string;
  title: string;
  description?: string;
  document_type: DocumentType;
  file_path: string;
  file_size_bytes: number;
  mime_type: string;
  version: number;
  tags: string[];
  uploaded_by: string;
  uploaded_at: Date;
  expiry_date?: Date;
  access_roles?: Role[];
  view_count: number;
  download_count: number;
  status: DocumentStatus;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_path: string;
  changes_description: string;
  created_by: string;
  created_at: Date;
}

// ============================================================================
// OPD/IPD Models
// ============================================================================

export interface OPDVisit {
  id: string;
  patient_id: string;
  visit_date: Date;
  doctor_id: string;
  department: string;
  token_number: string;
  consultation_fee: number;
  status: OPDVisitStatus;
  visit_notes?: string;
  chief_complaint?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPDAdmission {
  id: string;
  patient_id: string;
  admission_date: Date;
  admission_time: string;
  bed_id: string;
  admitting_doctor_id: string;
  admission_type: IPDAdmissionType;
  diagnosis: string;
  expected_discharge_date?: Date;
  actual_discharge_date?: Date;
  total_stay_days?: number;
  total_charges: number;
  status: IPDAdmissionStatus;
  discharge_summary?: string;
  admission_notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// Agent Automation Models
// ============================================================================

export interface AgentHook {
  id: string;
  name: string;
  description: string;
  event_type: HookEventType;
  enabled: boolean;
  action_type: HookActionType;
  configuration: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface HookExecution {
  id: string;
  hook_id: string;
  triggered_at: Date;
  event_data: Record<string, unknown>;
  result: 'success' | 'failure';
  output?: unknown;
  error_message?: string;
}

export interface SteeringRule {
  id: string;
  name: string;
  description: string;
  rule_type: SteeringRuleType;
  applies_to: 'patient' | 'appointment' | 'inventory' | 'clinical';
  conditions?: {
    role?: Role[];
    context?: string;
  };
  rule_definition: Record<string, unknown>;
  enabled: boolean;
  created_at: Date;
}

// ============================================================================
// Error Handling Models
// ============================================================================

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// ============================================================================
// Dashboard & Analytics Models
// ============================================================================

export interface DashboardStats {
  total_patients: number;
  upcoming_appointments: number;
  active_staff: number;
  low_stock_items: number;
  bed_occupancy_rate: number;
  blood_inventory_status: Record<BloodType, number>;
  active_emergency_cases: number;
  pending_inquiries: number;
}

export interface FlowMetrics {
  average_wait_time_per_stage: Record<FlowStage, number>;
  total_patients_processed: number;
  bottleneck_stages: FlowStage[];
  staff_utilization: Record<string, number>;
}
