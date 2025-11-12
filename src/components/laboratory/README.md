# Laboratory Components

This directory contains components for the laboratory management module of the Hospital Management System.

## Components

### LabOrderForm
Form component for ordering laboratory tests for patients. Supports various test types including blood tests, imaging, and cultures.

**Features:**
- Test type and test name selection with cascading dropdowns
- Priority levels: routine, urgent, and STAT
- Special instructions and notes
- Patient information display

**Props:**
- `patient`: Patient object
- `flow`: PatientFlow object
- `visitId`: Visit ID string
- `onSubmit`: Callback function for form submission
- `onCancel`: Callback function for cancellation

**Usage:**
```tsx
<LabOrderForm
  patient={patient}
  flow={flow}
  visitId={visitId}
  onSubmit={handleOrderSubmit}
  onCancel={handleCancel}
/>
```

## Test Types Supported

- Blood Test (CBC, Glucose, Lipid Profile, etc.)
- Urine Test (Urinalysis, Culture, etc.)
- X-Ray (Chest, Abdominal, Spine, etc.)
- CT Scan (Head, Chest, Abdominal, etc.)
- MRI (Brain, Spine, Joint, etc.)
- Ultrasound (Abdominal, Cardiac Echo, etc.)
- ECG (12-Lead, Holter Monitor, etc.)
- Echocardiogram
- Biopsy
- Culture Test

## Order Status Flow

1. **Ordered** - Test has been ordered
2. **Sample Collected** - Sample has been collected from patient
3. **In Progress** - Test is being processed
4. **Completed** - Results are available
5. **Cancelled** - Order was cancelled

## Priority Levels

- **Routine**: Standard processing time
- **Urgent**: Priority processing, results needed soon
- **STAT**: Immediate processing, critical results needed
