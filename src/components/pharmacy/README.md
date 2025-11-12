# Pharmacy Components

This directory contains components for the pharmacy module of the Hospital Management System.

## Components

### DispenseForm
Form component for dispensing medications to patients based on prescriptions.

**Features:**
- Displays prescription details (patient, medicine, dosage, frequency, duration)
- Quantity input with validation
- Patient counseling confirmation checkbox
- Optional dispensing notes
- Form validation using Zod

**Props:**
- `prescription`: Prescription object with medicine and patient details
- `onSubmit`: Callback function when form is submitted
- `onCancel`: Callback function when form is cancelled

**Usage:**
```tsx
<DispenseForm
  prescription={prescriptionWithDetails}
  onSubmit={handleDispense}
  onCancel={handleCancel}
/>
```

## Data Flow

1. Pharmacy page displays pending prescriptions
2. Pharmacist selects a prescription to dispense
3. DispenseForm shows prescription details and dispense form
4. Pharmacist enters quantity and confirms counseling
5. On submit, creates PharmacyDispense record
6. Updates prescription status and patient flow
