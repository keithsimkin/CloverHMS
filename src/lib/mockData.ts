/**
 * Mock data generators for development and testing
 */

import {
  Bed,
  BedAllocation,
  Patient,
  PatientVisit,
  PatientFlow,
  TriageRecord,
  LaboratoryOrder,
} from '@/types/models';
import {
  BedStatus,
  BedType,
  Gender,
  BloodType,
  VisitType,
  FlowStage,
  PriorityLevel,
  LabOrderStatus,
} from '@/types/enums';

// Generate mock patients
export function generateMockPatients(count: number = 20): Patient[] {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `patient-${i + 1}`,
    patient_id: `P${String(i + 1).padStart(5, '0')}`,
    first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
    last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
    date_of_birth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    gender: [Gender.MALE, Gender.FEMALE][Math.floor(Math.random() * 2)],
    contact_phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    contact_email: `patient${i + 1}@example.com`,
    address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
    emergency_contact_name: 'Emergency Contact',
    emergency_contact_phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    blood_type: Object.values(BloodType)[Math.floor(Math.random() * Object.values(BloodType).length)] as BloodType,
    allergies: [],
    medical_history: '',
    created_at: new Date(),
    updated_at: new Date(),
    created_by: 'system',
  }));
}

// Generate a single mock patient
export function generateMockPatient(): Patient {
  return generateMockPatients(1)[0];
}

// Generate mock patient visit
export function generateMockPatientVisit(patientId: string): PatientVisit {
  const visitTypes = Object.values(VisitType);
  const complaints = [
    'Fever and cough',
    'Chest pain',
    'Abdominal pain',
    'Headache',
    'Back pain',
    'Shortness of breath',
    'Dizziness',
    'Nausea and vomiting',
  ];

  return {
    id: `visit-${patientId}-${Date.now()}`,
    patient_id: patientId,
    provider_id: `staff-${Math.floor(Math.random() * 10) + 1}`,
    visit_date: new Date(),
    visit_type: visitTypes[Math.floor(Math.random() * visitTypes.length)],
    chief_complaint: complaints[Math.floor(Math.random() * complaints.length)],
    vital_signs: {
      temperature: 36.5 + Math.random() * 2,
      blood_pressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
      heart_rate: 60 + Math.floor(Math.random() * 40),
      respiratory_rate: 12 + Math.floor(Math.random() * 8),
      oxygen_saturation: 95 + Math.floor(Math.random() * 5),
      pain_level: Math.floor(Math.random() * 11),
    },
    created_at: new Date(),
    updated_at: new Date(),
  };
}

// Generate mock patient flow
export function generateMockPatientFlow(
  patientId: string,
  visitId: string,
  options?: Partial<PatientFlow>
): PatientFlow {
  const stages = Object.values(FlowStage);
  const arrivalTime = new Date();
  arrivalTime.setHours(arrivalTime.getHours() - Math.floor(Math.random() * 4));

  return {
    id: `flow-${patientId}-${Date.now()}`,
    patient_id: patientId,
    visit_id: visitId,
    current_stage: options?.current_stage || stages[Math.floor(Math.random() * stages.length)],
    arrival_time: options?.arrival_time || arrivalTime,
    discharge_time: options?.discharge_time,
    total_wait_time_minutes: Math.floor(Math.random() * 120) + 10,
    created_at: new Date(),
    updated_at: new Date(),
    ...options,
  };
}

// Generate mock triage record
export function generateMockTriageRecord(patientId: string, flowId: string): TriageRecord {
  const priorities = Object.values(PriorityLevel);
  const complaints = [
    'Severe chest pain',
    'Difficulty breathing',
    'High fever',
    'Severe headache',
    'Abdominal pain',
    'Injury from fall',
    'Allergic reaction',
    'Persistent cough',
  ];

  return {
    id: `triage-${flowId}`,
    patient_id: patientId,
    flow_id: flowId,
    priority_level: priorities[Math.floor(Math.random() * priorities.length)],
    chief_complaint: complaints[Math.floor(Math.random() * complaints.length)],
    vital_signs: {
      temperature: 36.5 + Math.random() * 2,
      blood_pressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
      heart_rate: 60 + Math.floor(Math.random() * 40),
      respiratory_rate: 12 + Math.floor(Math.random() * 8),
      oxygen_saturation: 95 + Math.floor(Math.random() * 5),
      pain_level: Math.floor(Math.random() * 11),
    },
    triage_notes: 'Patient appears stable',
    triaged_by: `staff-${Math.floor(Math.random() * 10) + 1}`,
    triaged_at: new Date(),
  };
}

// Generate mock laboratory order
export function generateMockLaboratoryOrder(
  patientId: string,
  visitId: string,
  flowId: string
): LaboratoryOrder {
  const tests = [
    { type: 'Blood Test', name: 'Complete Blood Count (CBC)' },
    { type: 'Blood Test', name: 'Blood Glucose' },
    { type: 'Blood Test', name: 'Lipid Profile' },
    { type: 'Blood Test', name: 'Liver Function Test' },
    { type: 'Blood Test', name: 'Kidney Function Test' },
    { type: 'Blood Test', name: 'Thyroid Function Test' },
    { type: 'Urine Test', name: 'Urinalysis' },
    { type: 'Imaging', name: 'X-Ray Chest' },
    { type: 'Cardiac', name: 'ECG' },
    { type: 'Imaging', name: 'Ultrasound Abdomen' },
  ];
  const statuses = Object.values(LabOrderStatus);
  const priorities: ('routine' | 'urgent' | 'stat')[] = ['routine', 'urgent', 'stat'];

  const orderedAt = new Date();
  orderedAt.setHours(orderedAt.getHours() - Math.floor(Math.random() * 24));

  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const hasResults = status === LabOrderStatus.COMPLETED;
  const test = tests[Math.floor(Math.random() * tests.length)];

  return {
    id: `lab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    patient_id: patientId,
    visit_id: visitId,
    flow_id: flowId,
    test_type: test.type,
    test_name: test.name,
    ordered_by: `staff-${Math.floor(Math.random() * 10) + 1}`,
    ordered_at: orderedAt,
    status,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    sample_collected_at: status !== LabOrderStatus.ORDERED ? new Date(orderedAt.getTime() + 30 * 60000) : undefined,
    results_available_at: hasResults ? new Date(orderedAt.getTime() + 120 * 60000) : undefined,
    results: hasResults ? 'Test results within normal range' : undefined,
    notes: 'Standard laboratory test',
  };
}

// Generate mock beds
export function generateMockBeds(): Bed[] {
  const departments = ['General Ward', 'ICU', 'Emergency', 'Pediatrics', 'Maternity'];
  const beds: Bed[] = [];
  let bedCounter = 1;

  departments.forEach((department, deptIndex) => {
    const bedsPerDept = department === 'ICU' ? 10 : 20;
    const floor = deptIndex + 1;

    for (let i = 0; i < bedsPerDept; i++) {
      const bedNumber = `${department.substring(0, 3).toUpperCase()}-${String(bedCounter).padStart(3, '0')}`;
      const roomNumber = `${floor}${String(Math.floor(i / 4) + 1).padStart(2, '0')}`;
      
      let bedType: BedType;
      let dailyRate: number;
      
      if (department === 'ICU') {
        bedType = BedType.ICU;
        dailyRate = 500;
      } else if (i % 5 === 0) {
        bedType = BedType.PRIVATE;
        dailyRate = 300;
      } else if (i % 5 === 1) {
        bedType = BedType.SEMI_PRIVATE;
        dailyRate = 200;
      } else {
        bedType = BedType.GENERAL;
        dailyRate = 100;
      }

      const statuses = Object.values(BedStatus);
      const status = statuses[Math.floor(Math.random() * statuses.length)] as BedStatus;

      beds.push({
        id: `bed-${bedCounter}`,
        bed_number: bedNumber,
        bed_type: bedType,
        department,
        floor,
        room_number: roomNumber,
        status,
        daily_rate: dailyRate,
        amenities: bedType === BedType.PRIVATE ? ['TV', 'Private Bathroom', 'WiFi'] : [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      bedCounter++;
    }
  });

  return beds;
}

// Generate mock bed allocations
export function generateMockBedAllocations(beds: Bed[], patients: Patient[]): BedAllocation[] {
  const occupiedBeds = beds.filter((b) => b.status === BedStatus.OCCUPIED);
  
  return occupiedBeds.map((bed, index) => {
    const patient = patients[index % patients.length];
    const allocatedAt = new Date();
    allocatedAt.setDate(allocatedAt.getDate() - Math.floor(Math.random() * 10));
    
    const expectedDischarge = new Date(allocatedAt);
    expectedDischarge.setDate(expectedDischarge.getDate() + Math.floor(Math.random() * 7) + 3);

    return {
      id: `allocation-${bed.id}`,
      bed_id: bed.id,
      patient_id: patient.id,
      visit_id: `visit-${index + 1}`,
      allocated_at: allocatedAt,
      expected_discharge_date: expectedDischarge,
      actual_discharge_date: undefined,
      allocated_by: 'system',
      notes: 'Mock allocation',
    };
  });
}

// Calculate bed occupancy rate
export function calculateBedOccupancyRate(beds: Bed[]): number {
  const occupiedCount = beds.filter((b) => b.status === BedStatus.OCCUPIED).length;
  return beds.length > 0 ? (occupiedCount / beds.length) * 100 : 0;
}

// Get bed statistics
export function getBedStatistics(beds: Bed[]) {
  return {
    total: beds.length,
    available: beds.filter((b) => b.status === BedStatus.AVAILABLE).length,
    occupied: beds.filter((b) => b.status === BedStatus.OCCUPIED).length,
    underCleaning: beds.filter((b) => b.status === BedStatus.UNDER_CLEANING).length,
    underMaintenance: beds.filter((b) => b.status === BedStatus.UNDER_MAINTENANCE).length,
    reserved: beds.filter((b) => b.status === BedStatus.RESERVED).length,
    occupancyRate: calculateBedOccupancyRate(beds),
  };
}

// Blood Bank Mock Data
import {
  BloodDonor,
  BloodDonation,
  BloodInventory,
  Staff,
} from '@/types/models';
import {
  DonorEligibilityStatus,
  BloodDonationStatus,
} from '@/types/enums';

export function generateMockBloodDonors(count: number = 30): BloodDonor[] {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return Array.from({ length: count }, (_, i) => {
    const lastDonation = Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000) : undefined;
    
    return {
      id: `donor-${i + 1}`,
      donor_id: `D${String(i + 1).padStart(5, '0')}`,
      first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
      last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
      blood_type: Object.values(BloodType)[Math.floor(Math.random() * Object.values(BloodType).length)] as BloodType,
      date_of_birth: new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      contact_phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      contact_email: `donor${i + 1}@example.com`,
      address: `${Math.floor(Math.random() * 9999) + 1} Main St, City, State`,
      last_donation_date: lastDonation,
      eligibility_status: lastDonation && (Date.now() - lastDonation.getTime()) < 56 * 24 * 60 * 60 * 1000
        ? DonorEligibilityStatus.DEFERRED
        : DonorEligibilityStatus.ELIGIBLE,
      total_donations: Math.floor(Math.random() * 20),
      created_at: new Date(),
      updated_at: new Date(),
    };
  });
}

export function generateMockBloodDonations(donors: BloodDonor[]): BloodDonation[] {
  const donations: BloodDonation[] = [];
  
  donors.forEach((donor) => {
    const donationCount = Math.min(donor.total_donations, 5);
    for (let i = 0; i < donationCount; i++) {
      const donationDate = new Date(Date.now() - (i * 60 + Math.random() * 30) * 24 * 60 * 60 * 1000);
      const expiryDate = new Date(donationDate);
      expiryDate.setDate(expiryDate.getDate() + 42);
      
      const isExpired = expiryDate < new Date();
      const isUsed = !isExpired && Math.random() > 0.6;
      
      donations.push({
        id: `donation-${donor.id}-${i}`,
        donor_id: donor.id,
        donation_date: donationDate,
        blood_type: donor.blood_type,
        quantity_ml: 450,
        expiry_date: expiryDate,
        status: isExpired ? BloodDonationStatus.EXPIRED : isUsed ? BloodDonationStatus.USED : BloodDonationStatus.AVAILABLE,
        screening_results: 'Negative',
        collected_by: 'system',
        notes: '',
      });
    }
  });
  
  return donations;
}

export function calculateBloodInventory(donations: BloodDonation[]): BloodInventory[] {
  const inventory: Record<string, BloodInventory> = {};
  
  Object.values(BloodType).forEach((bloodType) => {
    const typeDonations = donations.filter(
      (d) => d.blood_type === bloodType && d.status === BloodDonationStatus.AVAILABLE
    );
    
    const expiringCount = typeDonations.filter((d) => {
      const daysUntilExpiry = Math.floor((new Date(d.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    }).length;
    
    inventory[bloodType] = {
      blood_type: bloodType,
      available_units: typeDonations.length,
      total_quantity_ml: typeDonations.reduce((sum, d) => sum + d.quantity_ml, 0),
      expiring_soon_count: expiringCount,
      minimum_threshold: 5,
    };
  });
  
  return Object.values(inventory);
}

export function generateMockStaff(count: number = 20): Staff[] {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const departments = ['Emergency', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology'];
  const roles = ['doctor', 'nurse', 'receptionist', 'lab_technician', 'pharmacist'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `staff-${i + 1}`,
    employee_id: `E${String(i + 1).padStart(5, '0')}`,
    first_name: firstNames[Math.floor(Math.random() * firstNames.length)],
    last_name: lastNames[Math.floor(Math.random() * lastNames.length)],
    role: roles[Math.floor(Math.random() * roles.length)] as any,
    department: departments[Math.floor(Math.random() * departments.length)],
    specialization: i % 3 === 0 ? 'Cardiology' : undefined,
    contact_phone: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    contact_email: `staff${i + 1}@hospital.com`,
    employment_status: 'active' as any,
    hire_date: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), 1),
    created_at: new Date(),
    updated_at: new Date(),
  }));
}

export function generateMockStaffSchedules(staffId: string, count: number = 10): any[] {
  const shiftTypes = ['morning', 'afternoon', 'evening', 'night'];
  const departments = ['Emergency', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology'];
  
  return Array.from({ length: count }, (_, i) => {
    const scheduleDate = new Date();
    scheduleDate.setDate(scheduleDate.getDate() + i);
    
    const shiftType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
    let startTime = '08:00';
    let endTime = '16:00';
    
    switch (shiftType) {
      case 'morning':
        startTime = '08:00';
        endTime = '16:00';
        break;
      case 'afternoon':
        startTime = '12:00';
        endTime = '20:00';
        break;
      case 'evening':
        startTime = '16:00';
        endTime = '00:00';
        break;
      case 'night':
        startTime = '20:00';
        endTime = '08:00';
        break;
    }
    
    return {
      id: `schedule-${staffId}-${i + 1}`,
      staff_id: staffId,
      schedule_date: scheduleDate,
      shift_type: shiftType,
      start_time: startTime,
      end_time: endTime,
      department: departments[Math.floor(Math.random() * departments.length)],
      notes: i % 3 === 0 ? 'On-call duty' : undefined,
      created_by: 'system',
    };
  });
}

// Service Package Mock Data
import {
  ServicePackage,
  PackageSubscription,
} from '@/types/models';
import {
  PackageStatus,
  PackageSubscriptionStatus,
} from '@/types/enums';

export function generateMockServicePackages(): ServicePackage[] {
  const packages: ServicePackage[] = [
    {
      id: 'pkg-1',
      package_name: 'Basic Health Checkup',
      description: 'Comprehensive basic health screening including blood tests, vitals check, and general consultation',
      included_services: [
        'Complete Blood Count (CBC)',
        'Blood Sugar Test',
        'Blood Pressure Check',
        'General Physician Consultation',
        'BMI Assessment',
      ],
      package_price: 150.00,
      validity_days: 30,
      discount_percentage: 10,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-15'),
    },
    {
      id: 'pkg-2',
      package_name: 'Cardiac Care Package',
      description: 'Complete cardiac health assessment with ECG, echo, and cardiologist consultation',
      included_services: [
        'ECG',
        'Echocardiogram',
        'Lipid Profile',
        'Cardiologist Consultation',
        'Stress Test',
      ],
      package_price: 450.00,
      validity_days: 60,
      discount_percentage: 15,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-01-20'),
      updated_at: new Date('2024-01-20'),
    },
    {
      id: 'pkg-3',
      package_name: 'Diabetes Management',
      description: 'Comprehensive diabetes screening and management package',
      included_services: [
        'HbA1c Test',
        'Fasting Blood Sugar',
        'Post-Prandial Blood Sugar',
        'Kidney Function Test',
        'Endocrinologist Consultation',
        'Dietitian Consultation',
      ],
      package_price: 300.00,
      validity_days: 90,
      discount_percentage: 20,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-01'),
    },
    {
      id: 'pkg-4',
      package_name: 'Women\'s Wellness',
      description: 'Comprehensive health package designed for women\'s health needs',
      included_services: [
        'Pap Smear',
        'Mammography',
        'Bone Density Test',
        'Thyroid Function Test',
        'Gynecologist Consultation',
        'Nutritionist Consultation',
      ],
      package_price: 500.00,
      validity_days: 90,
      discount_percentage: 18,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-02-10'),
      updated_at: new Date('2024-02-10'),
    },
    {
      id: 'pkg-5',
      package_name: 'Senior Citizen Care',
      description: 'Specialized health package for senior citizens with comprehensive screening',
      included_services: [
        'Complete Blood Count',
        'Lipid Profile',
        'Kidney Function Test',
        'Liver Function Test',
        'Chest X-Ray',
        'ECG',
        'Geriatric Consultation',
        'Physiotherapy Session',
      ],
      package_price: 600.00,
      validity_days: 120,
      discount_percentage: 25,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-02-15'),
      updated_at: new Date('2024-02-15'),
    },
    {
      id: 'pkg-6',
      package_name: 'Executive Health Checkup',
      description: 'Premium comprehensive health screening for busy professionals',
      included_services: [
        'Complete Blood Count',
        'Lipid Profile',
        'Liver Function Test',
        'Kidney Function Test',
        'Thyroid Profile',
        'Chest X-Ray',
        'ECG',
        'Ultrasound Abdomen',
        'Specialist Consultation',
        'Stress Management Session',
      ],
      package_price: 800.00,
      validity_days: 180,
      discount_percentage: 30,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-03-01'),
      updated_at: new Date('2024-03-01'),
    },
    {
      id: 'pkg-7',
      package_name: 'Pediatric Care Package',
      description: 'Comprehensive health package for children with vaccinations and growth monitoring',
      included_services: [
        'Growth Assessment',
        'Vaccination',
        'Blood Tests',
        'Pediatrician Consultation',
        'Developmental Screening',
      ],
      package_price: 250.00,
      validity_days: 60,
      discount_percentage: 12,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-03-10'),
      updated_at: new Date('2024-03-10'),
    },
    {
      id: 'pkg-8',
      package_name: 'Maternity Care Package',
      description: 'Complete prenatal and postnatal care package for expecting mothers',
      included_services: [
        'Prenatal Checkups (3 visits)',
        'Ultrasound Scans (2 scans)',
        'Blood Tests',
        'Nutritionist Consultation',
        'Lactation Consultation',
        'Postnatal Checkup',
      ],
      package_price: 1200.00,
      validity_days: 270,
      discount_percentage: 20,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-03-15'),
      updated_at: new Date('2024-03-15'),
    },
    {
      id: 'pkg-9',
      package_name: 'Dental Care Package',
      description: 'Comprehensive dental care with cleaning, checkup, and X-rays',
      included_services: [
        'Dental Checkup',
        'Teeth Cleaning',
        'Dental X-Ray',
        'Fluoride Treatment',
        'Oral Hygiene Consultation',
      ],
      package_price: 200.00,
      validity_days: 90,
      discount_percentage: 15,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-03-20'),
      updated_at: new Date('2024-03-20'),
    },
    {
      id: 'pkg-10',
      package_name: 'Orthopedic Care Package',
      description: 'Specialized package for bone and joint health assessment',
      included_services: [
        'X-Ray (2 views)',
        'Bone Density Test',
        'Orthopedic Consultation',
        'Physiotherapy Sessions (3 sessions)',
        'Pain Management Consultation',
      ],
      package_price: 400.00,
      validity_days: 60,
      status: PackageStatus.ACTIVE,
      created_at: new Date('2024-04-01'),
      updated_at: new Date('2024-04-01'),
    },
  ];

  return packages;
}

export function generateMockPackageSubscriptions(
  packages: ServicePackage[],
  patients: Patient[]
): PackageSubscription[] {
  const subscriptions: PackageSubscription[] = [];
  
  // Generate 15 subscriptions
  for (let i = 0; i < 15; i++) {
    const pkg = packages[Math.floor(Math.random() * packages.length)];
    const patient = patients[Math.floor(Math.random() * patients.length)];
    
    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - Math.floor(Math.random() * 90));
    
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + pkg.validity_days);
    
    const totalServices = pkg.included_services.length;
    const usedCount = Math.floor(Math.random() * (totalServices + 1));
    const servicesUsed = pkg.included_services.slice(0, usedCount);
    const remainingServices = pkg.included_services.slice(usedCount);
    
    let status: PackageSubscriptionStatus;
    if (expiryDate < new Date()) {
      status = PackageSubscriptionStatus.EXPIRED;
    } else if (remainingServices.length === 0) {
      status = PackageSubscriptionStatus.FULLY_USED;
    } else {
      status = PackageSubscriptionStatus.ACTIVE;
    }
    
    subscriptions.push({
      id: `sub-${i + 1}`,
      patient_id: patient.id,
      package_id: pkg.id,
      purchase_date: purchaseDate,
      expiry_date: expiryDate,
      services_used: servicesUsed,
      remaining_services: remainingServices,
      status,
    });
  }
  
  return subscriptions;
}

// Doctor OPD Charges Mock Data
import { DoctorOPDCharge } from '@/types/models';

export function generateMockDoctorOPDCharges(doctors: Staff[]): DoctorOPDCharge[] {
  const doctorStaff = doctors.filter((d) => d.role === 'doctor');
  const charges: DoctorOPDCharge[] = [];

  const specializations = [
    { name: 'Cardiology', consultation: 150, followUp: 100 },
    { name: 'Neurology', consultation: 180, followUp: 120 },
    { name: 'Pediatrics', consultation: 100, followUp: 70 },
    { name: 'Orthopedics', consultation: 130, followUp: 90 },
    { name: 'General Medicine', consultation: 80, followUp: 50 },
    { name: 'Dermatology', consultation: 110, followUp: 75 },
    { name: 'Gynecology', consultation: 120, followUp: 80 },
    { name: 'ENT', consultation: 100, followUp: 70 },
  ];

  doctorStaff.forEach((doctor, index) => {
    const spec = specializations[index % specializations.length];
    const effectiveFrom = new Date();
    effectiveFrom.setMonth(effectiveFrom.getMonth() - Math.floor(Math.random() * 6));

    // Some charges have end dates, some don't
    const hasEndDate = Math.random() > 0.7;
    const effectiveUntil = hasEndDate
      ? new Date(effectiveFrom.getTime() + 180 * 24 * 60 * 60 * 1000)
      : undefined;

    charges.push({
      id: `charge-${doctor.id}`,
      doctor_id: doctor.id,
      specialization: doctor.specialization || spec.name,
      consultation_fee: spec.consultation + Math.floor(Math.random() * 20),
      follow_up_fee: spec.followUp + Math.floor(Math.random() * 10),
      effective_from: effectiveFrom,
      effective_until: effectiveUntil,
    });
  });

  return charges;
}

// Inquiry Mock Data
import { Inquiry } from '@/types/models';
import { InquiryType, InquiryStatus } from '@/types/enums';

export function generateMockInquiries(patients: Patient[], staff: Staff[]): Inquiry[] {
  const inquiries: Inquiry[] = [];
  const statuses = [
    InquiryStatus.SUBMITTED,
    InquiryStatus.UNDER_REVIEW,
    InquiryStatus.RESOLVED,
    InquiryStatus.CLOSED,
  ];
  const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const departments = [
    'General',
    'Emergency',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Pharmacy',
    'Laboratory',
    'Billing',
    'Administration',
  ];

  const inquiryTemplates = [
    {
      type: InquiryType.COMPLAINT,
      subjects: [
        'Long waiting time in emergency',
        'Rude behavior from staff',
        'Billing discrepancy',
        'Unclean facilities',
        'Medication not available',
      ],
      descriptions: [
        'I had to wait for over 3 hours in the emergency department despite having severe pain. The staff seemed overwhelmed and no one provided updates.',
        'The receptionist was very rude when I asked about my appointment. This is unacceptable behavior in a healthcare setting.',
        'My bill shows charges for services I did not receive. I need this to be reviewed and corrected immediately.',
        'The waiting area was not properly cleaned and the restrooms were in poor condition.',
        'The prescribed medication was not available in the pharmacy and no alternative was suggested.',
      ],
    },
    {
      type: InquiryType.SUGGESTION,
      subjects: [
        'Improve appointment scheduling system',
        'Add more parking spaces',
        'Extend pharmacy hours',
        'Digital payment options',
        'Patient portal for records',
      ],
      descriptions: [
        'It would be helpful to have an online appointment booking system with real-time availability.',
        'The parking lot is always full. Consider adding more parking spaces or a multi-level parking structure.',
        'The pharmacy closes too early. Extending hours would help patients who work during the day.',
        'Please add more digital payment options like mobile wallets and UPI for convenience.',
        'A patient portal where we can access our medical records and test results would be very useful.',
      ],
    },
    {
      type: InquiryType.COMPLIMENT,
      subjects: [
        'Excellent care from Dr. Smith',
        'Helpful nursing staff',
        'Efficient emergency response',
        'Clean and modern facilities',
        'Professional laboratory staff',
      ],
      descriptions: [
        'Dr. Smith was extremely thorough and took time to explain my condition and treatment options. Excellent doctor!',
        'The nursing staff on the 3rd floor were incredibly helpful and caring during my stay.',
        'The emergency team responded quickly and professionally when I arrived with chest pain.',
        'The hospital facilities are very clean and modern. Great environment for healing.',
        'The laboratory staff were professional and made the blood draw process comfortable.',
      ],
    },
    {
      type: InquiryType.GENERAL,
      subjects: [
        'Question about insurance coverage',
        'Visiting hours inquiry',
        'Medical records request',
        'Specialist referral process',
        'Vaccination schedule',
      ],
      descriptions: [
        'I would like to know if my insurance covers the recommended procedure. Can someone from billing contact me?',
        'What are the visiting hours for ICU patients? Can family members visit outside regular hours?',
        'I need copies of my medical records from my last visit. What is the process to request these?',
        'How do I get a referral to see a specialist? Do I need to see my primary doctor first?',
        'Can you provide information about the vaccination schedule for children?',
      ],
    },
  ];

  for (let i = 0; i < 30; i++) {
    const template = inquiryTemplates[i % inquiryTemplates.length];
    const subjectIndex = Math.floor(Math.random() * template.subjects.length);
    const inquiryType = template.type;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const submissionDate = new Date();
    submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 60));

    const hasPatient = Math.random() > 0.3;
    const patient = hasPatient ? patients[Math.floor(Math.random() * patients.length)] : undefined;

    const isAssigned = status !== InquiryStatus.SUBMITTED;
    const assignedStaff = isAssigned
      ? staff[Math.floor(Math.random() * staff.length)]
      : undefined;

    const isResolved =
      status === InquiryStatus.RESOLVED || status === InquiryStatus.CLOSED;
    const resolvedDate = isResolved
      ? new Date(submissionDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000)
      : undefined;

    const hasSatisfactionRating = isResolved && Math.random() > 0.3;
    const satisfactionRating = hasSatisfactionRating
      ? Math.floor(Math.random() * 3) + 3 // 3-5 rating
      : undefined;

    inquiries.push({
      id: `inquiry-${i + 1}`,
      patient_id: patient?.id,
      inquiry_type: inquiryType,
      subject: template.subjects[subjectIndex],
      description: template.descriptions[subjectIndex],
      department: departments[Math.floor(Math.random() * departments.length)],
      submission_date: submissionDate,
      assigned_to: assignedStaff?.id,
      status,
      priority,
      resolution_notes: isResolved
        ? 'Issue has been addressed and resolved. Follow-up actions have been taken to prevent similar issues in the future.'
        : undefined,
      resolved_date: resolvedDate,
      satisfaction_rating: satisfactionRating,
    });
  }

  return inquiries.sort(
    (a, b) => b.submission_date.getTime() - a.submission_date.getTime()
  );
}

// Dashboard Mock Data
import type {
  DashboardStats,
  AppointmentData,
  AgeDistribution,
  VisitFrequency,
  PatientTypeDistribution,
  StaffWorkload,
  FinancialData,
  EmergencyResponseData,
  EmergencyMetrics,
} from '@/components/dashboard';

export function generateMockDashboardStats(
  patients: Patient[],
  staff: Staff[],
  beds: Bed[],
  bloodInventory: any[],
  inquiries: Inquiry[]
): DashboardStats {
  const lowStockItems = 8; // Mock value
  const upcomingAppointments = 15; // Mock value
  const activeEmergencyCases = 3; // Mock value
  const criticalBloodTypes = bloodInventory.filter(
    (inv) => inv.available_units < inv.minimum_threshold
  ).length;
  const totalBloodUnits = bloodInventory.reduce(
    (sum, inv) => sum + inv.available_units,
    0
  );

  return {
    totalPatients: patients.length,
    upcomingAppointments,
    activeStaff: staff.filter((s) => s.employment_status === 'active').length,
    lowStockItems,
    bedOccupancyRate: calculateBedOccupancyRate(beds),
    bloodInventoryStatus: {
      criticalTypes: criticalBloodTypes,
      totalUnits: totalBloodUnits,
    },
    activeEmergencyCases,
    pendingInquiries: inquiries.filter(
      (i) =>
        i.status === InquiryStatus.SUBMITTED ||
        i.status === InquiryStatus.UNDER_REVIEW
    ).length,
  };
}

export function generateMockAppointmentData(): {
  dailyData: AppointmentData[];
  weeklyData: AppointmentData[];
  monthlyData: AppointmentData[];
} {
  // Daily data (last 7 days)
  const dailyData: AppointmentData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const scheduled = Math.floor(Math.random() * 20) + 10;
    const completed = Math.floor(scheduled * (0.7 + Math.random() * 0.2));
    const cancelled = scheduled - completed - Math.floor(Math.random() * 3);

    dailyData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: scheduled,
      scheduled,
      completed,
      cancelled: Math.max(0, cancelled),
    });
  }

  // Weekly data (last 8 weeks)
  const weeklyData: AppointmentData[] = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    const scheduled = Math.floor(Math.random() * 100) + 80;
    const completed = Math.floor(scheduled * (0.75 + Math.random() * 0.15));
    const cancelled = scheduled - completed - Math.floor(Math.random() * 10);

    weeklyData.push({
      date: `Week ${8 - i}`,
      count: scheduled,
      scheduled,
      completed,
      cancelled: Math.max(0, cancelled),
    });
  }

  // Monthly data (last 6 months)
  const monthlyData: AppointmentData[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const scheduled = Math.floor(Math.random() * 400) + 300;
    const completed = Math.floor(scheduled * (0.8 + Math.random() * 0.1));
    const cancelled = scheduled - completed - Math.floor(Math.random() * 30);

    monthlyData.push({
      date: months[date.getMonth()],
      count: scheduled,
      scheduled,
      completed,
      cancelled: Math.max(0, cancelled),
    });
  }

  return { dailyData, weeklyData, monthlyData };
}

export function generateMockPatientDemographics(
  patients: Patient[]
): {
  ageDistribution: AgeDistribution[];
  visitFrequency: VisitFrequency[];
  patientTypes: PatientTypeDistribution;
} {
  // Calculate age distribution
  const ageGroups = [
    { label: '0-18', min: 0, max: 18, count: 0 },
    { label: '19-35', min: 19, max: 35, count: 0 },
    { label: '36-50', min: 36, max: 50, count: 0 },
    { label: '51-65', min: 51, max: 65, count: 0 },
    { label: '65+', min: 66, max: 150, count: 0 },
  ];

  patients.forEach((patient) => {
    const age = Math.floor(
      (Date.now() - new Date(patient.date_of_birth).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    );
    const group = ageGroups.find((g) => age >= g.min && age <= g.max);
    if (group) group.count++;
  });

  const ageDistribution: AgeDistribution[] = ageGroups.map((group) => ({
    ageGroup: group.label,
    count: group.count,
    percentage: (group.count / patients.length) * 100,
  }));

  // Mock visit frequency
  const visitFrequency: VisitFrequency[] = [
    { frequency: 'First Visit', count: Math.floor(patients.length * 0.3) },
    { frequency: '2-5 Visits', count: Math.floor(patients.length * 0.4) },
    { frequency: '6-10 Visits', count: Math.floor(patients.length * 0.2) },
    { frequency: '10+ Visits', count: Math.floor(patients.length * 0.1) },
  ];

  // Mock OPD vs IPD
  const patientTypes: PatientTypeDistribution = {
    opd: Math.floor(patients.length * 0.75),
    ipd: Math.floor(patients.length * 0.25),
  };

  return { ageDistribution, visitFrequency, patientTypes };
}

export function generateMockStaffWorkload(staff: Staff[]): StaffWorkload[] {
  return staff
    .filter((s) => s.role === 'doctor' || s.role === 'nurse')
    .map((s) => {
      const appointmentCount = Math.floor(Math.random() * 30) + 5;
      const hoursWorked = appointmentCount * 0.5 + Math.random() * 10;
      const utilizationRate = Math.min((appointmentCount / 25) * 100, 100);

      return {
        staffId: s.id,
        staffName: `${s.first_name} ${s.last_name}`,
        department: s.department,
        role: s.role,
        appointmentCount,
        hoursWorked,
        utilizationRate,
      };
    })
    .sort((a, b) => b.utilizationRate - a.utilizationRate);
}

export function generateMockFinancialData(): FinancialData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => {
    const revenue = Math.floor(Math.random() * 200000) + 150000;
    const expenses = Math.floor(Math.random() * 150000) + 100000;
    return {
      period: month,
      revenue,
      expenses,
      netIncome: revenue - expenses,
    };
  });
}

export function generateMockEmergencyData(): {
  responseData: EmergencyResponseData[];
  metrics: EmergencyMetrics;
} {
  const statuses: EmergencyResponseData['status'][] = [
    'received',
    'dispatched',
    'patient_picked_up',
    'arrived_at_hospital',
    'completed',
  ];
  const priorities: EmergencyResponseData['priority'][] = [
    'critical',
    'urgent',
    'moderate',
  ];
  const emergencyTypes = [
    'Cardiac Arrest',
    'Accident',
    'Stroke',
    'Respiratory Distress',
    'Trauma',
    'Poisoning',
  ];

  const responseData: EmergencyResponseData[] = Array.from(
    { length: 20 },
    (_, i) => ({
      caseId: `EC-${String(i + 1).padStart(4, '0')}`,
      emergencyType:
        emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)],
      responseTimeMinutes: Math.floor(Math.random() * 20) + 3,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
    })
  );

  const totalCases = responseData.length;
  const resolvedCases = responseData.filter((d) => d.status === 'completed').length;
  const activeCases = totalCases - resolvedCases;
  const averageResponseTime =
    responseData.reduce((sum, d) => sum + d.responseTimeMinutes, 0) / totalCases;

  return {
    responseData,
    metrics: {
      averageResponseTime,
      totalCases,
      resolvedCases,
      activeCases,
    },
  };
}
