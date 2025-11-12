/**
 * Mock data generators for development and testing
 */

import {
  Bed,
  BedAllocation,
  Patient,
} from '@/types/models';
import {
  BedStatus,
  BedType,
  Gender,
  BloodType,
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
