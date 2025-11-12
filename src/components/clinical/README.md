# Clinical Knowledge Database UI Components

This directory contains UI components for the clinical knowledge database, providing searchable interfaces for symptoms, medicines, and diagnoses with comprehensive medical information display.

## Components

### SymptomSearch
Searchable dropdown for selecting symptoms with detailed information display.

**Features:**
- Search by symptom name, category, or body system
- Display symptom details including description and severity levels
- Category badges for quick identification
- Clear selection functionality

**Requirements:** 11.2

**Usage:**
```tsx
import { SymptomSearch } from '@/components/clinical';

<SymptomSearch
  value={selectedSymptomId}
  onSelect={(symptom) => setSelectedSymptom(symptom)}
  placeholder="Search symptoms..."
/>
```

### MedicineSearch
Searchable dropdown for selecting medicines with comprehensive drug information.

**Features:**
- Search by medicine name, generic name, brand names, or therapeutic category
- Display detailed medicine information:
  - Brand names
  - Dosage forms and strength options
  - Contraindications with warning icons
  - Common side effects
  - Drug interactions
  - Storage requirements
- Scrollable results for large datasets
- Visual warnings for critical information

**Requirements:** 12.5

**Usage:**
```tsx
import { MedicineSearch } from '@/components/clinical';

<MedicineSearch
  value={selectedMedicineId}
  onSelect={(medicine) => setSelectedMedicine(medicine)}
  placeholder="Search medicines..."
/>
```

### DrugInteractionWarning
Displays warnings when prescribing multiple medicines with potential interactions.

**Features:**
- Automatic interaction detection between selected medicines
- Severity-based color coding (minor, moderate, major, severe)
- Detailed interaction descriptions
- Clinical recommendations for each interaction
- Summary alert for critical interactions
- Action guidance for severe interactions
- Dismissible warnings

**Requirements:** 12.4

**Usage:**
```tsx
import { DrugInteractionWarning, checkDrugInteractions } from '@/components/clinical';

const interactions = checkDrugInteractions(selectedMedicines);

<DrugInteractionWarning
  interactions={interactions}
  onDismiss={(index) => handleDismiss(index)}
/>
```

**Utility Function:**
```tsx
checkDrugInteractions(medicines: Medicine[]): DrugInteraction[]
```
Checks for potential drug interactions between an array of medicines.

### DiagnosisSearch
Searchable dropdown for selecting diagnoses with ICD-10 codes and recording fields.

**Features:**
- Search by ICD-10 code, diagnosis name, or category
- Display diagnosis details with ICD-10 codes
- Recording fields for:
  - Severity (Mild, Moderate, Severe)
  - Status (Suspected, Confirmed, Resolved, Chronic)
  - Clinical notes (free text)
- Visual indicators for severity levels
- Status descriptions for clarity
- Optional recording fields display

**Requirements:** 13.2, 13.3, 13.5, 13.6

**Usage:**
```tsx
import { DiagnosisSearch } from '@/components/clinical';

<DiagnosisSearch
  value={selectedDiagnosisId}
  recording={diagnosisRecording}
  onSelect={(diagnosis) => setSelectedDiagnosis(diagnosis)}
  onRecordingChange={(recording) => setDiagnosisRecording(recording)}
  showRecordingFields={true}
/>
```

## Data Models

All components use mock data generators from `@/lib/mockData` during development. These will be replaced with real API calls in the backend integration phase.

### Symptom
```typescript
interface Symptom {
  id: string;
  symptom_name: string;
  description: string;
  category: SymptomCategory;
  body_system: string;
  severity_levels: string[];
  created_at: Date;
}
```

### Medicine
```typescript
interface Medicine {
  id: string;
  medicine_name: string;
  generic_name: string;
  brand_names: string[];
  dosage_forms: string[];
  strength_options: string[];
  therapeutic_category: string;
  contraindications?: string[];
  side_effects?: string[];
  drug_interactions?: string[];
  storage_requirements?: string;
  created_at: Date;
}
```

### Diagnosis
```typescript
interface Diagnosis {
  id: string;
  diagnosis_code: string;
  diagnosis_name: string;
  description: string;
  icd10_category: string;
  created_at: Date;
}
```

### DrugInteraction
```typescript
interface DrugInteraction {
  medicine1: Medicine;
  medicine2: Medicine;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  description: string;
  recommendation?: string;
}
```

## Demo Page

A demo page is available at `src/pages/ClinicalDemo.tsx` showcasing all clinical components with interactive examples.

## Design System

All components follow the hospital management system design guidelines:
- Dark theme with Rich Black, Gunmetal, and Prussian Blue
- Inter font for body text, Mona Sans for headings
- shadcn/ui components for consistency
- AAA accessibility compliance
- Responsive design for clinical environments

## Future Enhancements

- Real-time drug interaction checking with comprehensive database
- Integration with Supabase for persistent data
- Advanced search with filters and sorting
- Favorite/recent selections
- Bulk operations support
- Export functionality for clinical reports
