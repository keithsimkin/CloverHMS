# Patient Flow Components

This directory contains components for managing patient flow through the hospital from arrival to discharge.

## Components

### FlowDashboard

A comprehensive dashboard for tracking all patients currently in the hospital.

**Features:**
- Real-time view of patients grouped by current stage
- Color-coded stage indicators
- Priority level badges (Critical, Urgent, Semi-Urgent, Non-Urgent)
- Wait time tracking for each patient
- Quick action buttons to transition patients between stages
- Filterable by stage
- Responsive grid layout

**Props:**
- `patientFlows`: Array of PatientFlow objects
- `patients`: Array of Patient objects
- `triageRecords`: Array of TriageRecord objects
- `onTransitionStage`: Optional callback for stage transitions

**Usage:**
```tsx
<FlowDashboard
  patientFlows={flows}
  patients={patients}
  triageRecords={triageRecords}
  onTransitionStage={(flowId, toStage) => {
    // Handle stage transition
  }}
/>
```

### RegistrationForm

Form component for registering patient arrivals and starting their flow through the hospital.

**Features:**
- Patient selection with search
- Patient information display (demographics, allergies)
- Visit type selection (Consultation, Follow-up, Emergency)
- Chief complaint entry
- Additional notes field
- Automatic arrival time recording
- Form validation with Zod

**Props:**
- `patients`: Array of Patient objects
- `onSubmit`: Callback function for form submission
- `onCancel`: Optional callback for cancel action

**Usage:**
```tsx
<RegistrationForm
  patients={patients}
  onSubmit={(data) => {
    // Create patient flow and visit
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

### DischargeForm

Form component for discharging patients and completing their hospital visit.

**Features:**
- Patient information display with visit duration
- Discharge type selection (Routine, Against Medical Advice, Transfer, Deceased)
- Comprehensive discharge summary entry
- Follow-up appointment scheduling
- Discharge medications list
- Detailed discharge instructions
- Automatic discharge time recording
- Total visit time calculation
- Form validation with Zod

**Props:**
- `patient`: Patient object
- `flow`: PatientFlow object
- `onSubmit`: Callback function for form submission
- `onCancel`: Optional callback for cancel action

**Usage:**
```tsx
<DischargeForm
  patient={patient}
  flow={flow}
  onSubmit={(data) => {
    // Create discharge record and complete flow
  }}
  onCancel={() => {
    // Handle cancel
  }}
/>
```

## Patient Flow Stages

The system tracks patients through the following stages:

1. **Registration** - Patient arrival and check-in
2. **Waiting** - Waiting for triage or consultation
3. **Triage** - Initial assessment and priority assignment
4. **Consultation** - Doctor consultation
5. **Examination** - Physical examination
6. **Diagnosis** - Diagnosis determination
7. **Treatment** - Treatment administration
8. **Laboratory** - Lab tests and results
9. **Pharmacy** - Medication dispensing
10. **Billing** - Payment processing
11. **Discharge** - Patient discharge

## Priority Levels

Patients are assigned priority levels during triage:

- **Critical** - Immediate attention required (Red)
- **Urgent** - Prompt attention needed (Orange)
- **Semi-Urgent** - Can wait briefly (Yellow)
- **Non-Urgent** - Routine care (Green)

## Stage Transitions

The dashboard allows quick transitions between stages based on the current stage:

- From Registration → Waiting or Triage
- From Waiting → Triage
- From Triage → Consultation or Examination
- From Consultation → Examination, Diagnosis, or Laboratory
- From Examination → Diagnosis or Laboratory
- From Diagnosis → Treatment, Laboratory, or Pharmacy
- From Treatment → Pharmacy or Billing
- From Laboratory → Consultation or Diagnosis
- From Pharmacy → Billing
- From Billing → Discharge

## Data Requirements

### PatientFlow
```typescript
interface PatientFlow {
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
```

### TriageRecord
```typescript
interface TriageRecord {
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
```

### DischargeRecord
```typescript
interface DischargeRecord {
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
```

## Discharge Types

- **Routine** - Normal discharge after treatment completion
- **Against Medical Advice (AMA)** - Patient leaves against doctor's recommendation
- **Transfer** - Patient transferred to another facility
- **Deceased** - Patient passed away during visit

## Flow Metrics

The PatientFlow page includes comprehensive metrics:

- **Active Patients** - Number of patients currently in hospital
- **Completed Today** - Number of discharged patients
- **Average Visit Time** - Average duration from arrival to discharge
- **Bottleneck Stages** - Stages with the most patients waiting
- **Stage Wait Times** - Average wait time for each stage
- **Flow Statistics** - Total processed, active, and discharged counts

## Future Enhancements

- Real-time updates via WebSocket/Supabase Realtime
- Automatic stage progression based on completed actions
- Staff assignment to patients
- Estimated wait time predictions
- Queue management by department
- Patient notifications
- Historical trend analysis
- Discharge summary printing/export
