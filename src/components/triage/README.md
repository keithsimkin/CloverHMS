# Triage Components

This directory contains components for the triage functionality of the Hospital Management System.

## Components

### TriageForm

A comprehensive form component for conducting triage assessments on patients.

**Features:**
- Patient information display
- Priority level selection (Critical, Urgent, Semi-Urgent, Non-Urgent)
- Chief complaint entry
- Vital signs recording:
  - Temperature (°C)
  - Blood Pressure (mmHg)
  - Heart Rate (bpm)
  - Respiratory Rate (breaths/min)
  - Oxygen Saturation (%)
  - Pain Level (0-10 scale)
- Additional triage notes
- Form validation using Zod schema
- Visual priority indicators with color coding

**Usage:**
```tsx
import TriageForm from '@/components/triage/TriageForm';

<TriageForm
  patient={patient}
  flow={patientFlow}
  onSubmit={handleTriageSubmit}
  onCancel={handleCancel}
/>
```

**Props:**
- `patient`: Patient object containing patient information
- `flow`: PatientFlow object for the current patient visit
- `onSubmit`: Callback function when triage is completed
- `onCancel`: Callback function when form is cancelled

## Related Pages

- `/pages/Triage.tsx` - Main triage page with queue management

## Data Models

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

### VitalSigns
```typescript
interface VitalSigns {
  temperature?: number;
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  pain_level?: number;
}
```

### PriorityLevel
```typescript
enum PriorityLevel {
  CRITICAL = 'critical',
  URGENT = 'urgent',
  SEMI_URGENT = 'semi-urgent',
  NON_URGENT = 'non-urgent',
}
```

## Priority Level Guidelines

- **Critical**: Life-threatening conditions requiring immediate attention
- **Urgent**: Serious conditions requiring attention within 30 minutes
- **Semi-Urgent**: Moderate conditions requiring attention within 1-2 hours
- **Non-Urgent**: Minor conditions with standard wait time

## Color Coding

- Critical: Red (destructive)
- Urgent: Orange (warning)
- Semi-Urgent: Blue (info)
- Non-Urgent: Green (success)
