/**
 * Mock Data Cache
 * Pre-generates and caches mock data to eliminate loading delays
 */

import {
  generateMockPatients,
  generateMockStaff,
  generateMockBeds,
  calculateBloodInventory,
  generateMockBloodDonations,
  generateMockBloodDonors,
  generateMockInquiries,
} from './mockData';

// Cache for mock data - generated once and reused
class MockDataCache {
  private static instance: MockDataCache;
  private cache: Map<string, any> = new Map();

  private constructor() {
    // Pre-generate all mock data on initialization
    this.initializeCache();
  }

  static getInstance(): MockDataCache {
    if (!MockDataCache.instance) {
      MockDataCache.instance = new MockDataCache();
    }
    return MockDataCache.instance;
  }

  private initializeCache() {
    // Generate all mock data upfront
    const patients = generateMockPatients(150);
    const staff = generateMockStaff(25);
    const beds = generateMockBeds();
    const bloodDonors = generateMockBloodDonors(50);
    const bloodDonations = generateMockBloodDonations(bloodDonors);
    const bloodInventory = calculateBloodInventory(bloodDonations);
    const inquiries = generateMockInquiries(patients, staff);

    this.cache.set('patients', patients);
    this.cache.set('staff', staff);
    this.cache.set('beds', beds);
    this.cache.set('bloodDonors', bloodDonors);
    this.cache.set('bloodDonations', bloodDonations);
    this.cache.set('bloodInventory', bloodInventory);
    this.cache.set('inquiries', inquiries);
  }

  get<T>(key: string): T {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  // Update methods for CRUD operations
  updatePatients(updater: (patients: any[]) => any[]): void {
    const current = this.get<any[]>('patients');
    this.set('patients', updater(current));
  }

  updateStaff(updater: (staff: any[]) => any[]): void {
    const current = this.get<any[]>('staff');
    this.set('staff', updater(current));
  }

  // Add more update methods as needed
}

// Export singleton instance
export const mockDataCache = MockDataCache.getInstance();

// Convenience getters
export const getCachedPatients = () => mockDataCache.get<any[]>('patients');
export const getCachedStaff = () => mockDataCache.get<any[]>('staff');
export const getCachedBeds = () => mockDataCache.get<any[]>('beds');
export const getCachedBloodDonors = () => mockDataCache.get<any[]>('bloodDonors');
export const getCachedBloodDonations = () => mockDataCache.get<any[]>('bloodDonations');
export const getCachedBloodInventory = () => mockDataCache.get<any>('bloodInventory');
export const getCachedInquiries = () => mockDataCache.get<any[]>('inquiries');
