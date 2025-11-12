/**
 * Application route definitions
 * 
 * This file contains all route paths used throughout the application.
 * Routes are organized by module for easy maintenance.
 */

export const routes = {
  // Overview
  dashboard: '/',

  // Core Modules
  patients: '/patients',
  appointments: '/appointments',
  staff: '/staff',
  inventory: '/inventory',

  // Clinical
  clinical: '/clinical',
  patientFlow: '/patient-flow',
  triage: '/triage',
  laboratory: '/laboratory',
  pharmacy: '/pharmacy',
  billing: '/billing',

  // Extended Services
  beds: '/beds',
  bloodBank: '/blood-bank',
  bloodDonors: '/blood-bank/donors',
  bloodInventory: '/blood-bank/inventory',
  emergency: '/emergency',
  ambulances: '/emergency/ambulances',
  emergencyCalls: '/emergency/calls',
  emergencyCases: '/emergency/cases',
  opd: '/opd',
  ipd: '/ipd',

  // Financial
  insurance: '/insurance',
  advancePayments: '/advance-payments',
  expenses: '/expenses',
  income: '/income',
  hospitalCharges: '/hospital-charges',
  payroll: '/payroll',

  // Management
  reports: '/reports',
  birthReports: '/reports/births',
  deathReports: '/reports/deaths',
  operationReports: '/reports/operations',
  communication: '/communication',
  noticeBoard: '/communication/notices',
  internalMail: '/communication/mail',
  staffSchedules: '/communication/schedules',
  packages: '/packages',
  doctorCharges: '/packages/doctor-charges',
  quality: '/quality',
  inquiries: '/quality/inquiries',
  documents: '/documents',

  // System
  settings: '/settings',
  login: '/login',
} as const;

export type RouteKey = keyof typeof routes;
export type RoutePath = typeof routes[RouteKey];
