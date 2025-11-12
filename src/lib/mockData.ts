/**
 * Mock data generators for the Hospital Management System
 * Provides sample data for all modules during UI development
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
} from '../types/enums';

import type * as Models from '../types/models';

// ============================================================================
// Utility Functions
// ============================================================================

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

// Sample data arrays
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary', 'William', 'Patricia', 'Richard', 'Jennifer', 'Thomas', 'Linda'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor'];
const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave', 'Lake Dr', 'Hill St'];
const cities = ['Springfield', 'Riverside', 'Fairview', 'Madison', 'Georgetown', 'Franklin', 'Clinton', 'Arlington', 'Salem', 'Bristol'];
const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Surgery', 'Radiology', 'Laboratory', 'Pharmacy', 'Administration'];
const specializations = ['Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Pediatrician', 'Emergency Medicine', 'General Surgeon', 'Radiologist', 'Pathologist', 'Pharmacist', 'Administrator'];

// ============================================================================
// Patient Mock Data
// ============================================================================

export function generateMockPatient(overrides?: Partial<Models.Patient>): Models.Patient {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const patientId = `P${randomInt(10000, 99999)}`;
  
  return {
    id: randomId(),
    patient_id: patientId,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: randomDate(new Date(1940, 0, 1), new Date(2020, 11, 31)),
    gender: randomElement([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    contact_phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    address: `${randomInt(100, 9999)} ${randomElement(streets)}, ${randomElement(cities)}, State ${randomInt(10000, 99999)}`,
    emergency_contact_name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    emergency_contact_phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    blood_type: randomElement(Object.values(BloodType)),
    allergies: randomBoolean() ? ['Penicillin', 'Peanuts'] : undefined,
    medical_history: randomBoolean() ? 'Hypertension, Diabetes Type 2' : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'system',
    ...overrides,
  };
}

export function generateMockPatients(count: number): Models.Patient[] {
  return Array.from({ length: count }, () => generateMockPatient());
}

// ============================================================================
// Appointment Mock Data
// ============================================================================

export function generateMockAppointment(overrides?: Partial<Models.Appointment>): Models.Appointment {
  const appointmentDate = randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const hour = randomInt(8, 17);
  const minute = randomElement([0, 15, 30, 45]);
  
  return {
    id: randomId(),
    patient_id: randomId(),
    provider_id: randomId(),
    appointment_date: appointmentDate,
    appointment_time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    duration_minutes: randomElement([15, 30, 45, 60]),
    appointment_type: randomElement(Object.values(AppointmentType)),
    status: randomElement(Object.values(AppointmentStatus)),
    notes: randomBoolean() ? 'Follow-up appointment for previous consultation' : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'system',
    ...overrides,
  };
}

export function generateMockAppointments(count: number): Models.Appointment[] {
  return Array.from({ length: count }, () => generateMockAppointment());
}

// ============================================================================
// Staff Mock Data
// ============================================================================

export function generateMockStaff(overrides?: Partial<Models.Staff>): Models.Staff {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const role = randomElement(Object.values(Role));
  
  return {
    id: randomId(),
    user_id: randomId(),
    employee_id: `E${randomInt(1000, 9999)}`,
    first_name: firstName,
    last_name: lastName,
    role,
    department: randomElement(departments),
    specialization: [Role.DOCTOR, Role.NURSE].includes(role) ? randomElement(specializations) : undefined,
    contact_phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
    employment_status: randomElement(Object.values(EmploymentStatus)),
    hire_date: randomDate(new Date(2010, 0, 1), new Date()),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockStaffMembers(count: number): Models.Staff[] {
  return Array.from({ length: count }, () => generateMockStaff());
}

// ============================================================================
// Inventory Mock Data
// ============================================================================

const inventoryItems = [
  { name: 'Surgical Gloves', category: InventoryCategory.MEDICAL_SUPPLIES, unit: 'box' },
  { name: 'Syringes 10ml', category: InventoryCategory.MEDICAL_SUPPLIES, unit: 'pack' },
  { name: 'Bandages', category: InventoryCategory.MEDICAL_SUPPLIES, unit: 'roll' },
  { name: 'Stethoscope', category: InventoryCategory.EQUIPMENT, unit: 'unit' },
  { name: 'Blood Pressure Monitor', category: InventoryCategory.EQUIPMENT, unit: 'unit' },
  { name: 'Paracetamol 500mg', category: InventoryCategory.PHARMACEUTICALS, unit: 'tablet' },
  { name: 'Amoxicillin 250mg', category: InventoryCategory.PHARMACEUTICALS, unit: 'capsule' },
  { name: 'Gauze Pads', category: InventoryCategory.CONSUMABLES, unit: 'pack' },
  { name: 'Alcohol Swabs', category: InventoryCategory.CONSUMABLES, unit: 'box' },
  { name: 'IV Fluid Bags', category: InventoryCategory.MEDICAL_SUPPLIES, unit: 'bag' },
];

export function generateMockInventoryItem(overrides?: Partial<Models.InventoryItem>): Models.InventoryItem {
  const item = randomElement(inventoryItems);
  const quantity = randomInt(0, 500);
  const reorderThreshold = randomInt(20, 100);
  
  return {
    id: randomId(),
    item_code: `INV${randomInt(1000, 9999)}`,
    item_name: item.name,
    category: item.category,
    quantity,
    unit_of_measure: item.unit,
    reorder_threshold: reorderThreshold,
    unit_cost: randomInt(5, 500),
    supplier: `${randomElement(['MedSupply', 'HealthCare', 'MediCorp', 'PharmaTech'])} Inc.`,
    location: `Warehouse ${randomElement(['A', 'B', 'C'])}-${randomInt(1, 20)}`,
    expiry_date: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockInventoryItems(count: number): Models.InventoryItem[] {
  return Array.from({ length: count }, () => generateMockInventoryItem());
}

export function generateMockInventoryTransaction(itemId: string, overrides?: Partial<Models.InventoryTransaction>): Models.InventoryTransaction {
  const transactionType = randomElement(Object.values(TransactionType));
  const quantityChange = transactionType === TransactionType.ADDITION ? randomInt(10, 100) : -randomInt(1, 50);
  
  return {
    id: randomId(),
    item_id: itemId,
    transaction_type: transactionType,
    quantity_change: quantityChange,
    quantity_after: randomInt(0, 500),
    reason: `${transactionType} - ${randomElement(['Regular stock update', 'Emergency usage', 'Routine maintenance', 'Expired items'])}`,
    performed_by: randomId(),
    created_at: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    ...overrides,
  };
}

// ============================================================================
// Clinical Mock Data
// ============================================================================

const symptoms = [
  { name: 'Fever', category: SymptomCategory.OTHER, system: 'General' },
  { name: 'Cough', category: SymptomCategory.RESPIRATORY, system: 'Respiratory' },
  { name: 'Chest Pain', category: SymptomCategory.CARDIOVASCULAR, system: 'Cardiovascular' },
  { name: 'Headache', category: SymptomCategory.NEUROLOGICAL, system: 'Nervous' },
  { name: 'Nausea', category: SymptomCategory.GASTROINTESTINAL, system: 'Digestive' },
  { name: 'Back Pain', category: SymptomCategory.MUSCULOSKELETAL, system: 'Musculoskeletal' },
  { name: 'Rash', category: SymptomCategory.DERMATOLOGICAL, system: 'Integumentary' },
  { name: 'Shortness of Breath', category: SymptomCategory.RESPIRATORY, system: 'Respiratory' },
  { name: 'Dizziness', category: SymptomCategory.NEUROLOGICAL, system: 'Nervous' },
  { name: 'Abdominal Pain', category: SymptomCategory.GASTROINTESTINAL, system: 'Digestive' },
];

export function generateMockSymptom(overrides?: Partial<Models.Symptom>): Models.Symptom {
  const symptom = randomElement(symptoms);
  
  return {
    id: randomId(),
    symptom_name: symptom.name,
    description: `Common symptom: ${symptom.name}`,
    category: symptom.category,
    body_system: symptom.system,
    severity_levels: ['Mild', 'Moderate', 'Severe'],
    created_at: new Date(),
    ...overrides,
  };
}

export function generateMockSymptoms(count: number): Models.Symptom[] {
  return Array.from({ length: count }, () => generateMockSymptom());
}

export function generateMockPatientSymptom(patientId: string, visitId: string, overrides?: Partial<Models.PatientSymptom>): Models.PatientSymptom {
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    symptom_id: randomId(),
    severity: randomElement(['Mild', 'Moderate', 'Severe']),
    onset_date: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    notes: randomBoolean() ? 'Patient reports worsening symptoms' : undefined,
    recorded_by: randomId(),
    recorded_at: new Date(),
    ...overrides,
  };
}

const medicines = [
  { name: 'Paracetamol', generic: 'Acetaminophen', category: 'Analgesic' },
  { name: 'Amoxicillin', generic: 'Amoxicillin', category: 'Antibiotic' },
  { name: 'Ibuprofen', generic: 'Ibuprofen', category: 'NSAID' },
  { name: 'Metformin', generic: 'Metformin', category: 'Antidiabetic' },
  { name: 'Lisinopril', generic: 'Lisinopril', category: 'Antihypertensive' },
  { name: 'Omeprazole', generic: 'Omeprazole', category: 'Proton Pump Inhibitor' },
  { name: 'Aspirin', generic: 'Acetylsalicylic Acid', category: 'Antiplatelet' },
  { name: 'Atorvastatin', generic: 'Atorvastatin', category: 'Statin' },
];

export function generateMockMedicine(overrides?: Partial<Models.Medicine>): Models.Medicine {
  const medicine = randomElement(medicines);
  
  return {
    id: randomId(),
    medicine_name: medicine.name,
    generic_name: medicine.generic,
    brand_names: [`${medicine.name} Brand A`, `${medicine.name} Brand B`],
    dosage_forms: randomElement([['Tablet'], ['Capsule'], ['Syrup'], ['Injection'], ['Tablet', 'Syrup']]),
    strength_options: randomElement([['500mg'], ['250mg', '500mg'], ['10mg', '20mg', '40mg']]),
    therapeutic_category: medicine.category,
    contraindications: ['Pregnancy', 'Liver disease'],
    side_effects: ['Nausea', 'Dizziness', 'Headache'],
    drug_interactions: ['Warfarin', 'Aspirin'],
    storage_requirements: 'Store at room temperature',
    created_at: new Date(),
    ...overrides,
  };
}

export function generateMockMedicines(count: number): Models.Medicine[] {
  return Array.from({ length: count }, () => generateMockMedicine());
}

export function generateMockPrescription(patientId: string, visitId: string, overrides?: Partial<Models.Prescription>): Models.Prescription {
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    medicine_id: randomId(),
    dosage: randomElement(['500mg', '250mg', '10mg', '20mg']),
    frequency: randomElement(['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours']),
    duration: randomElement(['7 days', '14 days', '30 days', '3 months']),
    quantity: randomInt(7, 90),
    special_instructions: randomBoolean() ? 'Take with food' : undefined,
    prescribed_by: randomId(),
    prescribed_at: new Date(),
    status: randomElement(Object.values(PrescriptionStatus)),
    ...overrides,
  };
}

const diagnoses = [
  { code: 'J00', name: 'Acute nasopharyngitis (common cold)', category: 'Respiratory' },
  { code: 'I10', name: 'Essential (primary) hypertension', category: 'Cardiovascular' },
  { code: 'E11', name: 'Type 2 diabetes mellitus', category: 'Endocrine' },
  { code: 'M54.5', name: 'Low back pain', category: 'Musculoskeletal' },
  { code: 'K21.9', name: 'Gastro-esophageal reflux disease', category: 'Digestive' },
  { code: 'J45.9', name: 'Asthma, unspecified', category: 'Respiratory' },
  { code: 'G43.9', name: 'Migraine, unspecified', category: 'Neurological' },
  { code: 'N39.0', name: 'Urinary tract infection', category: 'Genitourinary' },
];

export function generateMockDiagnosis(overrides?: Partial<Models.Diagnosis>): Models.Diagnosis {
  const diagnosis = randomElement(diagnoses);
  
  return {
    id: randomId(),
    diagnosis_code: diagnosis.code,
    diagnosis_name: diagnosis.name,
    description: `ICD-10 diagnosis: ${diagnosis.name}`,
    icd10_category: diagnosis.category,
    created_at: new Date(),
    ...overrides,
  };
}

export function generateMockDiagnoses(count: number): Models.Diagnosis[] {
  return Array.from({ length: count }, () => generateMockDiagnosis());
}

export function generateMockPatientDiagnosis(patientId: string, visitId: string, overrides?: Partial<Models.PatientDiagnosis>): Models.PatientDiagnosis {
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    diagnosis_id: randomId(),
    severity: randomElement(Object.values(DiagnosisSeverity)),
    status: randomElement(Object.values(DiagnosisStatus)),
    diagnosis_date: new Date(),
    clinical_notes: randomBoolean() ? 'Patient responding well to treatment' : undefined,
    diagnosed_by: randomId(),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockPatientVisit(patientId: string, overrides?: Partial<Models.PatientVisit>): Models.PatientVisit {
  return {
    id: randomId(),
    patient_id: patientId,
    provider_id: randomId(),
    visit_date: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
    visit_type: randomElement(Object.values(VisitType)),
    chief_complaint: randomElement(['Fever and cough', 'Chest pain', 'Headache', 'Abdominal pain', 'Back pain']),
    vital_signs: {
      temperature: randomInt(36, 39) + Math.random(),
      blood_pressure: `${randomInt(110, 140)}/${randomInt(70, 90)}`,
      heart_rate: randomInt(60, 100),
      respiratory_rate: randomInt(12, 20),
      oxygen_saturation: randomInt(95, 100),
      pain_level: randomInt(0, 10),
    },
    visit_summary: randomBoolean() ? 'Patient examined and treated' : undefined,
    follow_up_recommendations: randomBoolean() ? 'Follow up in 2 weeks' : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockPatientVisits(patientId: string, count: number): Models.PatientVisit[] {
  return Array.from({ length: count }, () => generateMockPatientVisit(patientId));
}

// ============================================================================
// Patient Flow Mock Data
// ============================================================================

export function generateMockPatientFlow(patientId: string, visitId: string, overrides?: Partial<Models.PatientFlow>): Models.PatientFlow {
  const arrivalTime = randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());
  const currentStage = randomElement(Object.values(FlowStage));
  
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    current_stage: currentStage,
    arrival_time: arrivalTime,
    discharge_time: currentStage === FlowStage.DISCHARGE ? new Date() : undefined,
    total_wait_time_minutes: currentStage === FlowStage.DISCHARGE ? randomInt(60, 300) : undefined,
    created_at: arrivalTime,
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockFlowTransition(flowId: string, overrides?: Partial<Models.FlowTransition>): Models.FlowTransition {
  const stages = Object.values(FlowStage);
  const fromIndex = randomInt(0, stages.length - 2);
  
  return {
    id: randomId(),
    flow_id: flowId,
    from_stage: stages[fromIndex],
    to_stage: stages[fromIndex + 1],
    transition_time: new Date(),
    performed_by: randomId(),
    notes: randomBoolean() ? 'Routine transition' : undefined,
    ...overrides,
  };
}

export function generateMockTriageRecord(patientId: string, flowId: string, overrides?: Partial<Models.TriageRecord>): Models.TriageRecord {
  return {
    id: randomId(),
    patient_id: patientId,
    flow_id: flowId,
    priority_level: randomElement(Object.values(PriorityLevel)),
    chief_complaint: randomElement(['Chest pain', 'Difficulty breathing', 'Severe headache', 'Abdominal pain', 'Trauma']),
    vital_signs: {
      temperature: randomInt(36, 39) + Math.random(),
      blood_pressure: `${randomInt(110, 160)}/${randomInt(70, 100)}`,
      heart_rate: randomInt(60, 120),
      respiratory_rate: randomInt(12, 24),
      oxygen_saturation: randomInt(90, 100),
      pain_level: randomInt(1, 10),
    },
    triage_notes: randomBoolean() ? 'Patient stable, monitoring required' : undefined,
    triaged_by: randomId(),
    triaged_at: new Date(),
    ...overrides,
  };
}

export function generateMockLaboratoryOrder(patientId: string, visitId: string, flowId: string, overrides?: Partial<Models.LaboratoryOrder>): Models.LaboratoryOrder {
  const testTypes = ['Blood Test', 'Urine Test', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound'];
  const testNames = ['Complete Blood Count', 'Urinalysis', 'Chest X-Ray', 'Abdominal CT', 'Brain MRI', 'Cardiac Echo'];
  
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    flow_id: flowId,
    test_type: randomElement(testTypes),
    test_name: randomElement(testNames),
    priority: randomElement(['routine', 'urgent', 'stat'] as const),
    status: randomElement(Object.values(LabOrderStatus)),
    ordered_by: randomId(),
    ordered_at: new Date(),
    sample_collected_at: randomBoolean() ? new Date() : undefined,
    results_available_at: randomBoolean() ? new Date() : undefined,
    results: randomBoolean() ? 'Results within normal limits' : undefined,
    notes: randomBoolean() ? 'Fasting required' : undefined,
    ...overrides,
  };
}

export function generateMockPharmacyDispense(prescriptionId: string, patientId: string, flowId: string, overrides?: Partial<Models.PharmacyDispense>): Models.PharmacyDispense {
  return {
    id: randomId(),
    prescription_id: prescriptionId,
    patient_id: patientId,
    flow_id: flowId,
    medicine_id: randomId(),
    quantity_dispensed: randomInt(7, 90),
    dispensed_by: randomId(),
    dispensed_at: new Date(),
    patient_counseling_provided: randomBoolean(),
    notes: randomBoolean() ? 'Patient counseled on side effects' : undefined,
    ...overrides,
  };
}

export function generateMockBillingRecord(patientId: string, visitId: string, flowId: string, overrides?: Partial<Models.BillingRecord>): Models.BillingRecord {
  const consultationFee = randomInt(50, 200);
  const medicationCost = randomInt(20, 150);
  const laboratoryCost = randomInt(100, 500);
  const procedureCost = randomInt(0, 1000);
  const totalAmount = consultationFee + medicationCost + laboratoryCost + procedureCost;
  
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    flow_id: flowId,
    consultation_fee: consultationFee,
    medication_cost: medicationCost,
    laboratory_cost: laboratoryCost,
    procedure_cost: procedureCost,
    total_amount: totalAmount,
    payment_status: randomElement(Object.values(PaymentStatus)),
    payment_method: randomElement(Object.values(PaymentMethod)),
    paid_amount: randomBoolean() ? totalAmount : randomInt(0, totalAmount),
    billing_date: new Date(),
    processed_by: randomId(),
    ...overrides,
  };
}

export function generateMockDischargeRecord(patientId: string, visitId: string, flowId: string, overrides?: Partial<Models.DischargeRecord>): Models.DischargeRecord {
  return {
    id: randomId(),
    patient_id: patientId,
    visit_id: visitId,
    flow_id: flowId,
    discharge_time: new Date(),
    discharge_type: randomElement(Object.values(DischargeType)),
    discharge_summary: 'Patient condition improved. Discharged with medications.',
    follow_up_required: randomBoolean(),
    follow_up_date: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) : undefined,
    discharge_medications: ['Paracetamol 500mg', 'Amoxicillin 250mg'],
    discharge_instructions: 'Rest, take medications as prescribed, follow up in 2 weeks',
    discharged_by: randomId(),
    ...overrides,
  };
}

// ============================================================================
// Bed Management Mock Data
// ============================================================================

export function generateMockBed(overrides?: Partial<Models.Bed>): Models.Bed {
  const floor = randomInt(1, 5);
  const roomNumber = `${floor}${randomInt(10, 99)}`;
  
  return {
    id: randomId(),
    bed_number: `B${floor}-${randomInt(1, 20)}`,
    bed_type: randomElement(Object.values(BedType)),
    department: randomElement(departments),
    floor,
    room_number: roomNumber,
    status: randomElement(Object.values(BedStatus)),
    daily_rate: randomInt(100, 500),
    amenities: randomBoolean() ? ['TV', 'WiFi', 'Private Bathroom'] : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockBeds(count: number): Models.Bed[] {
  return Array.from({ length: count }, () => generateMockBed());
}

export function generateMockBedAllocation(bedId: string, patientId: string, visitId: string, overrides?: Partial<Models.BedAllocation>): Models.BedAllocation {
  const allocatedAt = randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
  
  return {
    id: randomId(),
    bed_id: bedId,
    patient_id: patientId,
    visit_id: visitId,
    allocated_at: allocatedAt,
    expected_discharge_date: randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    actual_discharge_date: randomBoolean() ? new Date() : undefined,
    allocated_by: randomId(),
    notes: randomBoolean() ? 'Patient requires monitoring' : undefined,
    ...overrides,
  };
}

// ============================================================================
// Blood Bank Mock Data
// ============================================================================

export function generateMockBloodDonor(overrides?: Partial<Models.BloodDonor>): Models.BloodDonor {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  
  return {
    id: randomId(),
    donor_id: `D${randomInt(10000, 99999)}`,
    first_name: firstName,
    last_name: lastName,
    blood_type: randomElement(Object.values(BloodType)),
    date_of_birth: randomDate(new Date(1960, 0, 1), new Date(2000, 11, 31)),
    contact_phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    contact_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    address: `${randomInt(100, 9999)} ${randomElement(streets)}, ${randomElement(cities)}`,
    last_donation_date: randomBoolean() ? randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()) : undefined,
    eligibility_status: randomElement(Object.values(DonorEligibilityStatus)),
    total_donations: randomInt(0, 50),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockBloodDonors(count: number): Models.BloodDonor[] {
  return Array.from({ length: count }, () => generateMockBloodDonor());
}

export function generateMockBloodDonation(donorId: string, overrides?: Partial<Models.BloodDonation>): Models.BloodDonation {
  const donationDate = randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date());
  const expiryDate = new Date(donationDate.getTime() + 42 * 24 * 60 * 60 * 1000); // 42 days shelf life
  
  return {
    id: randomId(),
    donor_id: donorId,
    donation_date: donationDate,
    blood_type: randomElement(Object.values(BloodType)),
    quantity_ml: 450, // Standard donation
    expiry_date: expiryDate,
    status: randomElement(Object.values(BloodDonationStatus)),
    screening_results: 'All tests negative',
    collected_by: randomId(),
    notes: randomBoolean() ? 'Donor in good health' : undefined,
    ...overrides,
  };
}

export function generateMockBloodInventory(): Models.BloodInventory[] {
  return Object.values(BloodType).map(bloodType => ({
    blood_type: bloodType,
    available_units: randomInt(0, 50),
    total_quantity_ml: randomInt(0, 22500), // 50 units * 450ml
    expiring_soon_count: randomInt(0, 5),
    minimum_threshold: 10,
  }));
}

// ============================================================================
// Emergency Services Mock Data
// ============================================================================

export function generateMockAmbulance(overrides?: Partial<Models.Ambulance>): Models.Ambulance {
  return {
    id: randomId(),
    vehicle_number: `AMB-${randomInt(100, 999)}`,
    driver_name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    driver_contact: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    status: randomElement(Object.values(AmbulanceStatus)),
    last_maintenance_date: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
    next_maintenance_date: randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockAmbulances(count: number): Models.Ambulance[] {
  return Array.from({ length: count }, () => generateMockAmbulance());
}

export function generateMockEmergencyCall(overrides?: Partial<Models.EmergencyCall>): Models.EmergencyCall {
  return {
    id: randomId(),
    call_time: randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()),
    caller_name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    caller_contact: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    patient_name: randomBoolean() ? `${randomElement(firstNames)} ${randomElement(lastNames)}` : undefined,
    location: `${randomInt(100, 9999)} ${randomElement(streets)}, ${randomElement(cities)}`,
    emergency_type: randomElement(['Cardiac Arrest', 'Trauma', 'Stroke', 'Respiratory Distress', 'Accident']),
    description: 'Emergency medical assistance required',
    priority: randomElement(['critical', 'high', 'medium', 'low'] as const),
    status: randomElement(Object.values(EmergencyCallStatus)),
    received_by: randomId(),
    ...overrides,
  };
}

export function generateMockEmergencyCalls(count: number): Models.EmergencyCall[] {
  return Array.from({ length: count }, () => generateMockEmergencyCall());
}

export function generateMockEmergencyCase(callId: string, overrides?: Partial<Models.EmergencyCase>): Models.EmergencyCase {
  const dispatchTime = new Date(Date.now() - randomInt(30, 120) * 60 * 1000);
  const pickupTime = new Date(dispatchTime.getTime() + randomInt(10, 30) * 60 * 1000);
  const arrivalTime = new Date(pickupTime.getTime() + randomInt(15, 45) * 60 * 1000);
  
  return {
    id: randomId(),
    call_id: callId,
    ambulance_id: randomId(),
    case_handler_id: randomId(),
    patient_id: randomBoolean() ? randomId() : undefined,
    dispatch_time: dispatchTime,
    pickup_time: pickupTime,
    arrival_time: arrivalTime,
    patient_condition: randomElement(['Stable', 'Critical', 'Serious', 'Fair']),
    treatment_provided: 'First aid administered, vital signs monitored',
    outcome: randomElement(['Admitted', 'Treated and Released', 'Transferred', 'Deceased']),
    response_time_minutes: Math.floor((pickupTime.getTime() - dispatchTime.getTime()) / 60000),
    notes: randomBoolean() ? 'Patient transported safely' : undefined,
    ...overrides,
  };
}

// ============================================================================
// Financial Management Mock Data
// ============================================================================

export function generateMockInsuranceProvider(overrides?: Partial<Models.InsuranceProvider>): Models.InsuranceProvider {
  const providerNames = ['HealthFirst Insurance', 'MediCare Plus', 'United Health', 'Blue Cross', 'Aetna Health'];
  
  return {
    id: randomId(),
    provider_name: randomElement(providerNames),
    contact_person: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
    contact_phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    contact_email: 'contact@insurance.com',
    address: `${randomInt(100, 9999)} ${randomElement(streets)}, ${randomElement(cities)}`,
    policy_types: ['Individual', 'Family', 'Group', 'Senior'],
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockInsuranceProviders(count: number): Models.InsuranceProvider[] {
  return Array.from({ length: count }, () => generateMockInsuranceProvider());
}

export function generateMockPatientInsurance(patientId: string, providerId: string, overrides?: Partial<Models.PatientInsurance>): Models.PatientInsurance {
  const validFrom = randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date());
  const validUntil = new Date(validFrom.getTime() + 365 * 24 * 60 * 60 * 1000);
  
  return {
    id: randomId(),
    patient_id: patientId,
    provider_id: providerId,
    policy_number: `POL${randomInt(100000, 999999)}`,
    policy_type: randomElement(['Individual', 'Family', 'Group']),
    coverage_percentage: randomElement([50, 70, 80, 90, 100]),
    coverage_limit: randomInt(50000, 500000),
    valid_from: validFrom,
    valid_until: validUntil,
    status: randomElement(Object.values(InsuranceStatus)),
    ...overrides,
  };
}

export function generateMockAdvancePayment(patientId: string, overrides?: Partial<Models.AdvancePayment>): Models.AdvancePayment {
  const amount = randomInt(500, 5000);
  
  return {
    id: randomId(),
    patient_id: patientId,
    amount,
    payment_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    payment_method: randomElement(Object.values(PaymentMethod)),
    remaining_balance: randomInt(0, amount),
    received_by: randomId(),
    notes: randomBoolean() ? 'Advance payment for upcoming procedure' : undefined,
    ...overrides,
  };
}

export function generateMockExpense(overrides?: Partial<Models.Expense>): Models.Expense {
  const categories = ['Medical Supplies', 'Equipment', 'Utilities', 'Salaries', 'Maintenance', 'Marketing'];
  
  return {
    id: randomId(),
    expense_category: randomElement(categories),
    amount: randomInt(100, 10000),
    expense_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    vendor: `${randomElement(['MedSupply', 'TechCorp', 'ServicePro'])} Inc.`,
    payment_method: randomElement(Object.values(PaymentMethod)),
    description: 'Regular operational expense',
    approved_by: randomId(),
    receipt_number: `REC${randomInt(10000, 99999)}`,
    ...overrides,
  };
}

export function generateMockExpenses(count: number): Models.Expense[] {
  return Array.from({ length: count }, () => generateMockExpense());
}

export function generateMockIncome(overrides?: Partial<Models.Income>): Models.Income {
  return {
    id: randomId(),
    income_source: randomElement(Object.values(IncomeSource)),
    amount: randomInt(100, 5000),
    income_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    patient_id: randomBoolean() ? randomId() : undefined,
    description: 'Patient service payment',
    recorded_by: randomId(),
    ...overrides,
  };
}

export function generateMockIncomes(count: number): Models.Income[] {
  return Array.from({ length: count }, () => generateMockIncome());
}

export function generateMockHospitalCharge(overrides?: Partial<Models.HospitalCharge>): Models.HospitalCharge {
  const services = [
    { name: 'General Consultation', category: 'Consultation', amount: 100 },
    { name: 'Specialist Consultation', category: 'Consultation', amount: 200 },
    { name: 'X-Ray', category: 'Radiology', amount: 150 },
    { name: 'Blood Test', category: 'Laboratory', amount: 50 },
    { name: 'ICU Per Day', category: 'Bed Charges', amount: 500 },
    { name: 'General Ward Per Day', category: 'Bed Charges', amount: 100 },
  ];
  
  const service = randomElement(services);
  
  return {
    id: randomId(),
    service_name: service.name,
    service_category: service.category,
    charge_amount: service.amount,
    department: randomElement(departments),
    effective_from: randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date()),
    effective_until: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) : undefined,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockHospitalCharges(count: number): Models.HospitalCharge[] {
  return Array.from({ length: count }, () => generateMockHospitalCharge());
}

export function generateMockPayroll(staffId: string, overrides?: Partial<Models.Payroll>): Models.Payroll {
  const basicSalary = randomInt(3000, 10000);
  const allowances = randomInt(500, 2000);
  const deductions = randomInt(200, 1000);
  const bonuses = randomInt(0, 2000);
  const netSalary = basicSalary + allowances - deductions + bonuses;
  
  const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const periodEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
  return {
    id: randomId(),
    staff_id: staffId,
    pay_period_start: periodStart,
    pay_period_end: periodEnd,
    basic_salary: basicSalary,
    allowances,
    deductions,
    bonuses,
    net_salary: netSalary,
    payment_date: periodEnd,
    payment_method: randomElement(Object.values(PaymentMethod)),
    status: randomElement(Object.values(PayrollStatus)),
    processed_by: randomId(),
    ...overrides,
  };
}

// ============================================================================
// Enhanced Reporting Mock Data
// ============================================================================

export function generateMockBirthReport(motherPatientId: string, overrides?: Partial<Models.BirthReport>): Models.BirthReport {
  return {
    id: randomId(),
    mother_patient_id: motherPatientId,
    baby_name: `Baby ${randomElement(lastNames)}`,
    baby_gender: randomElement([Gender.MALE, Gender.FEMALE]),
    birth_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    birth_time: `${randomInt(0, 23).toString().padStart(2, '0')}:${randomInt(0, 59).toString().padStart(2, '0')}`,
    birth_weight_kg: randomInt(25, 45) / 10, // 2.5 to 4.5 kg
    birth_length_cm: randomInt(45, 55),
    delivery_type: randomElement(Object.values(DeliveryType)),
    attending_physician_id: randomId(),
    complications: randomBoolean() ? 'None' : undefined,
    certificate_number: `BC${randomInt(100000, 999999)}`,
    created_at: new Date(),
    ...overrides,
  };
}

export function generateMockDeathReport(patientId: string, overrides?: Partial<Models.DeathReport>): Models.DeathReport {
  return {
    id: randomId(),
    patient_id: patientId,
    death_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    death_time: `${randomInt(0, 23).toString().padStart(2, '0')}:${randomInt(0, 59).toString().padStart(2, '0')}`,
    cause_of_death: randomElement(['Cardiac Arrest', 'Respiratory Failure', 'Multiple Organ Failure', 'Stroke', 'Cancer']),
    place_of_death: randomElement(['Emergency Room', 'ICU', 'General Ward', 'Operating Theater']),
    certifying_physician_id: randomId(),
    certificate_number: `DC${randomInt(100000, 999999)}`,
    autopsy_required: randomBoolean(),
    created_at: new Date(),
    ...overrides,
  };
}

export function generateMockOperationReport(patientId: string, overrides?: Partial<Models.OperationReport>): Models.OperationReport {
  const startTime = `${randomInt(8, 16).toString().padStart(2, '0')}:${randomInt(0, 59).toString().padStart(2, '0')}`;
  const durationMinutes = randomInt(60, 300);
  const startHour = parseInt(startTime.split(':')[0]);
  const startMinute = parseInt(startTime.split(':')[1]);
  const endMinutes = startHour * 60 + startMinute + durationMinutes;
  const endHour = Math.floor(endMinutes / 60);
  const endMinute = endMinutes % 60;
  const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  
  return {
    id: randomId(),
    patient_id: patientId,
    operation_type: randomElement(['Appendectomy', 'Cholecystectomy', 'Hernia Repair', 'Knee Replacement', 'Cardiac Bypass']),
    operation_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    start_time: startTime,
    end_time: endTime,
    duration_minutes: durationMinutes,
    surgeon_id: randomId(),
    assistant_surgeons: [randomId(), randomId()],
    anesthetist_id: randomId(),
    operation_theater: `OT-${randomInt(1, 5)}`,
    pre_operative_diagnosis: 'Pre-operative diagnosis details',
    post_operative_diagnosis: 'Post-operative diagnosis details',
    procedure_performed: 'Surgical procedure performed successfully',
    complications: randomBoolean() ? 'None' : 'Minor bleeding controlled',
    outcome: randomElement(Object.values(OperationOutcome)),
    notes: randomBoolean() ? 'Patient tolerated procedure well' : undefined,
    created_at: new Date(),
    ...overrides,
  };
}

// ============================================================================
// Communication Mock Data
// ============================================================================

export function generateMockNotice(overrides?: Partial<Models.Notice>): Models.Notice {
  const titles = [
    'Hospital Maintenance Schedule',
    'New Safety Protocols',
    'Staff Meeting Announcement',
    'Holiday Schedule',
    'Equipment Training Session',
  ];
  
  return {
    id: randomId(),
    title: randomElement(titles),
    content: 'This is an important notice for all staff members. Please read carefully and acknowledge.',
    notice_type: randomElement(Object.values(NoticeType)),
    priority: randomElement(Object.values(NoticePriority)),
    posted_by: randomId(),
    posted_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    expiry_date: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) : undefined,
    target_roles: randomBoolean() ? [randomElement(Object.values(Role))] : undefined,
    status: randomElement(Object.values(NoticeStatus)),
    ...overrides,
  };
}

export function generateMockNotices(count: number): Models.Notice[] {
  return Array.from({ length: count }, () => generateMockNotice());
}

export function generateMockInternalMail(overrides?: Partial<Models.InternalMail>): Models.InternalMail {
  const subjects = [
    'Patient Care Update',
    'Department Meeting Minutes',
    'Equipment Request',
    'Schedule Change Notification',
    'Policy Update',
  ];
  
  return {
    id: randomId(),
    sender_id: randomId(),
    recipient_ids: [randomId(), randomId()],
    subject: randomElement(subjects),
    body: 'This is the content of the internal mail message. Please review and respond if necessary.',
    sent_at: randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()),
    read_by: randomBoolean() ? [randomId()] : [],
    priority: randomElement(Object.values(MailPriority)),
    attachments: randomBoolean() ? ['document.pdf'] : undefined,
    ...overrides,
  };
}

export function generateMockInternalMails(count: number): Models.InternalMail[] {
  return Array.from({ length: count }, () => generateMockInternalMail());
}

export function generateMockStaffSchedule(staffId: string, overrides?: Partial<Models.StaffSchedule>): Models.StaffSchedule {
  return {
    id: randomId(),
    staff_id: staffId,
    schedule_date: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    shift_type: randomElement(Object.values(ShiftType)),
    start_time: randomElement(['08:00', '14:00', '20:00', '00:00']),
    end_time: randomElement(['14:00', '20:00', '08:00', '12:00']),
    department: randomElement(departments),
    notes: randomBoolean() ? 'Regular shift' : undefined,
    created_by: randomId(),
    ...overrides,
  };
}

export function generateMockStaffSchedules(staffId: string, count: number): Models.StaffSchedule[] {
  return Array.from({ length: count }, () => generateMockStaffSchedule(staffId));
}

// ============================================================================
// Service Package Mock Data
// ============================================================================

export function generateMockServicePackage(overrides?: Partial<Models.ServicePackage>): Models.ServicePackage {
  const packages = [
    { name: 'Basic Health Checkup', services: ['Consultation', 'Blood Test', 'X-Ray'], price: 500 },
    { name: 'Comprehensive Health Checkup', services: ['Consultation', 'Blood Test', 'X-Ray', 'ECG', 'Ultrasound'], price: 1200 },
    { name: 'Diabetes Care Package', services: ['Consultation', 'HbA1c Test', 'Lipid Profile', 'Kidney Function Test'], price: 800 },
    { name: 'Cardiac Care Package', services: ['Consultation', 'ECG', 'Echo', 'Stress Test'], price: 1500 },
  ];
  
  const pkg = randomElement(packages);
  
  return {
    id: randomId(),
    package_name: pkg.name,
    description: `Comprehensive ${pkg.name.toLowerCase()} with all necessary tests and consultations`,
    included_services: pkg.services,
    package_price: pkg.price,
    validity_days: randomElement([30, 60, 90, 180]),
    discount_percentage: randomElement([5, 10, 15, 20]),
    status: randomElement(Object.values(PackageStatus)),
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

export function generateMockServicePackages(count: number): Models.ServicePackage[] {
  return Array.from({ length: count }, () => generateMockServicePackage());
}

export function generateMockPackageSubscription(patientId: string, packageId: string, overrides?: Partial<Models.PackageSubscription>): Models.PackageSubscription {
  const purchaseDate = randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date());
  const expiryDate = new Date(purchaseDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  
  return {
    id: randomId(),
    patient_id: patientId,
    package_id: packageId,
    purchase_date: purchaseDate,
    expiry_date: expiryDate,
    services_used: ['Consultation', 'Blood Test'],
    remaining_services: ['X-Ray', 'ECG'],
    status: randomElement(Object.values(PackageSubscriptionStatus)),
    ...overrides,
  };
}

export function generateMockDoctorOPDCharge(doctorId: string, overrides?: Partial<Models.DoctorOPDCharge>): Models.DoctorOPDCharge {
  return {
    id: randomId(),
    doctor_id: doctorId,
    specialization: randomElement(specializations),
    consultation_fee: randomInt(100, 500),
    follow_up_fee: randomInt(50, 250),
    effective_from: randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date()),
    effective_until: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) : undefined,
    ...overrides,
  };
}

// ============================================================================
// Quality Management Mock Data
// ============================================================================

export function generateMockInquiry(overrides?: Partial<Models.Inquiry>): Models.Inquiry {
  const subjects = [
    'Long waiting time',
    'Staff behavior concern',
    'Facility cleanliness',
    'Billing discrepancy',
    'Excellent service appreciation',
  ];
  
  return {
    id: randomId(),
    patient_id: randomBoolean() ? randomId() : undefined,
    inquiry_type: randomElement(Object.values(InquiryType)),
    subject: randomElement(subjects),
    description: 'Detailed description of the inquiry or feedback',
    department: randomBoolean() ? randomElement(departments) : undefined,
    submission_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    assigned_to: randomBoolean() ? randomId() : undefined,
    status: randomElement(Object.values(InquiryStatus)),
    priority: randomElement(['low', 'medium', 'high'] as const),
    resolution_notes: randomBoolean() ? 'Issue resolved satisfactorily' : undefined,
    resolved_date: randomBoolean() ? new Date() : undefined,
    satisfaction_rating: randomBoolean() ? randomInt(1, 5) : undefined,
    ...overrides,
  };
}

export function generateMockInquiries(count: number): Models.Inquiry[] {
  return Array.from({ length: count }, () => generateMockInquiry());
}

// ============================================================================
// Document Management Mock Data
// ============================================================================

export function generateMockDocument(overrides?: Partial<Models.Document>): Models.Document {
  const documentNames = [
    'Hospital Policy Manual',
    'Emergency Procedures',
    'Patient Consent Form',
    'Staff Training Materials',
    'Quality Assurance Report',
  ];
  
  return {
    id: randomId(),
    title: randomElement(documentNames),
    description: 'Important hospital document',
    document_type: randomElement(Object.values(DocumentType)),
    file_path: `/documents/${randomId()}.pdf`,
    file_size_bytes: randomInt(100000, 5000000),
    mime_type: 'application/pdf',
    version: randomInt(1, 5),
    tags: ['important', 'policy', 'procedure'],
    uploaded_by: randomId(),
    uploaded_at: randomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date()),
    expiry_date: randomBoolean() ? randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) : undefined,
    access_roles: [randomElement(Object.values(Role))],
    view_count: randomInt(0, 100),
    status: randomElement(Object.values(DocumentStatus)),
    ...overrides,
  };
}

export function generateMockDocuments(count: number): Models.Document[] {
  return Array.from({ length: count }, () => generateMockDocument());
}

// ============================================================================
// OPD/IPD Mock Data
// ============================================================================

export function generateMockOPDVisit(patientId: string, overrides?: Partial<Models.OPDVisit>): Models.OPDVisit {
  return {
    id: randomId(),
    patient_id: patientId,
    visit_date: randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    doctor_id: randomId(),
    department: randomElement(departments),
    token_number: `T${randomInt(1, 100).toString().padStart(3, '0')}`,
    consultation_fee: randomInt(100, 500),
    status: randomElement(Object.values(OPDVisitStatus)),
    visit_notes: randomBoolean() ? 'Patient consulted and treated' : undefined,
    ...overrides,
  };
}

export function generateMockOPDVisits(patientId: string, count: number): Models.OPDVisit[] {
  return Array.from({ length: count }, () => generateMockOPDVisit(patientId));
}

export function generateMockIPDAdmission(patientId: string, bedId: string, overrides?: Partial<Models.IPDAdmission>): Models.IPDAdmission {
  const admissionDate = randomDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), new Date());
  const totalStayDays = randomInt(1, 14);
  const actualDischargeDate = randomBoolean() ? new Date(admissionDate.getTime() + totalStayDays * 24 * 60 * 60 * 1000) : undefined;
  
  return {
    id: randomId(),
    patient_id: patientId,
    admission_date: admissionDate,
    admission_time: `${randomInt(0, 23).toString().padStart(2, '0')}:${randomInt(0, 59).toString().padStart(2, '0')}`,
    bed_id: bedId,
    admitting_doctor_id: randomId(),
    admission_type: randomElement(Object.values(IPDAdmissionType)),
    diagnosis: randomElement(['Pneumonia', 'Appendicitis', 'Fracture', 'Cardiac Event', 'Post-operative care']),
    expected_discharge_date: randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    actual_discharge_date: actualDischargeDate,
    total_stay_days: actualDischargeDate ? totalStayDays : undefined,
    total_charges: randomInt(5000, 50000),
    status: randomElement(Object.values(IPDAdmissionStatus)),
    discharge_summary: actualDischargeDate ? 'Patient recovered and discharged' : undefined,
    ...overrides,
  };
}

export function generateMockIPDAdmissions(patientId: string, count: number): Models.IPDAdmission[] {
  return Array.from({ length: count }, () => generateMockIPDAdmission(patientId, randomId()));
}

// ============================================================================
// Dashboard Mock Data
// ============================================================================

export function generateMockDashboardStats(): Models.DashboardStats {
  const bloodInventory: Record<BloodType, number> = {} as Record<BloodType, number>;
  Object.values(BloodType).forEach(type => {
    bloodInventory[type] = randomInt(5, 50);
  });
  
  return {
    total_patients: randomInt(500, 2000),
    upcoming_appointments: randomInt(10, 50),
    active_staff: randomInt(50, 200),
    low_stock_items: randomInt(0, 15),
    bed_occupancy_rate: randomInt(60, 95),
    blood_inventory_status: bloodInventory,
    active_emergency_cases: randomInt(0, 10),
    pending_inquiries: randomInt(5, 30),
  };
}

// ============================================================================
// Batch Generators
// ============================================================================

export function generateCompleteMockData() {
  return {
    patients: generateMockPatients(50),
    appointments: generateMockAppointments(100),
    staff: generateMockStaffMembers(30),
    inventory: generateMockInventoryItems(50),
    symptoms: generateMockSymptoms(20),
    medicines: generateMockMedicines(30),
    diagnoses: generateMockDiagnoses(20),
    beds: generateMockBeds(50),
    bloodDonors: generateMockBloodDonors(30),
    bloodInventory: generateMockBloodInventory(),
    ambulances: generateMockAmbulances(5),
    emergencyCalls: generateMockEmergencyCalls(20),
    insuranceProviders: generateMockInsuranceProviders(10),
    expenses: generateMockExpenses(50),
    incomes: generateMockIncomes(50),
    hospitalCharges: generateMockHospitalCharges(20),
    notices: generateMockNotices(15),
    internalMails: generateMockInternalMails(30),
    servicePackages: generateMockServicePackages(10),
    inquiries: generateMockInquiries(25),
    documents: generateMockDocuments(20),
    dashboardStats: generateMockDashboardStats(),
  };
}
