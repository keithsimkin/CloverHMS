# Billing Components

This directory contains components for the billing module of the Hospital Management System.

## Components

### BillingForm
Handles bill generation and payment recording for patient visits.

**Features:**
- Charge breakdown (consultation, medication, laboratory, procedures)
- Automatic total calculation
- Payment status tracking (pending, partial, paid)
- Multiple payment methods (cash, card, insurance, bank transfer)
- Real-time balance calculation
- Patient information display

**Props:**
- `patient`: Patient information
- `flow`: Patient flow record
- `visitId`: Visit ID for linking
- `existingBill`: Optional existing bill for editing
- `onSubmit`: Callback for form submission
- `onCancel`: Callback for cancellation

**Usage:**
```tsx
<BillingForm
  patient={patient}
  flow={flow}
  visitId={visitId}
  onSubmit={handleBillSubmit}
  onCancel={handleCancel}
/>
```

## Data Flow

1. User enters charge breakdown for different services
2. System automatically calculates total amount
3. User selects payment status and records payment
4. System calculates remaining balance
5. Bill is generated and linked to patient visit and flow

## Integration

These components integrate with:
- Patient Flow system for tracking billing stage
- Patient Visit records for linking charges
- Mock data from `lib/mockData.ts` (to be replaced with Supabase services)
