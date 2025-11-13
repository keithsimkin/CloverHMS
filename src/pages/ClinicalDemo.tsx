/**
 * Clinical Demo Page
 * Demonstrates the clinical knowledge database UI components
 */

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SymptomSearch } from '@/components/clinical/SymptomSearch';
import { MedicineSearch } from '@/components/clinical/MedicineSearch';
import { DrugInteractionWarning, checkDrugInteractions } from '@/components/clinical/DrugInteractionWarning';
import { DiagnosisSearch } from '@/components/clinical/DiagnosisSearch';
import type { Symptom, Medicine, Diagnosis } from '@/types/models';

export default function ClinicalDemo() {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [diagnosisRecording, setDiagnosisRecording] = useState<any>({});

  const handleMedicineSelect = (medicine: Medicine | null) => {
    setSelectedMedicine(medicine);
    if (medicine && !selectedMedicines.find(m => m.id === medicine.id)) {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  const interactions = checkDrugInteractions(selectedMedicines);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Clinical Knowledge Database</h1>
        <p className="text-muted-foreground">
          Comprehensive medical knowledge database for symptoms, medicines, and diagnoses
        </p>
      </div>

      <Tabs defaultValue="symptoms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="interactions">Drug Interactions</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
        </TabsList>

        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Search</CardTitle>
              <CardDescription>
                Search and select symptoms from the comprehensive symptom database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SymptomSearch
                value={selectedSymptom?.id}
                onSelect={setSelectedSymptom}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medicines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medicine Search</CardTitle>
              <CardDescription>
                Search medicines with detailed information including dosage forms, contraindications, and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicineSearch
                value={selectedMedicine?.id}
                onSelect={handleMedicineSelect}
              />
            </CardContent>
          </Card>

          {selectedMedicines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Medicines</CardTitle>
                <CardDescription>
                  {selectedMedicines.length} medicine(s) selected for prescription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedMedicines.map((med, index) => (
                    <div key={med.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{med.medicine_name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({med.generic_name})
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))}
                        className="text-sm text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drug Interaction Checker</CardTitle>
              <CardDescription>
                Automatically detects potential drug interactions when prescribing multiple medicines
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMedicines.length < 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select at least 2 medicines from the Medicines tab to check for interactions</p>
                </div>
              ) : (
                <DrugInteractionWarning interactions={interactions} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnoses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Search & Recording</CardTitle>
              <CardDescription>
                Search ICD-10 diagnoses and record with severity, status, and clinical notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiagnosisSearch
                value={selectedDiagnosis?.id}
                recording={diagnosisRecording}
                onSelect={setSelectedDiagnosis}
                onRecordingChange={setDiagnosisRecording}
                showRecordingFields={true}
              />
            </CardContent>
          </Card>

          {diagnosisRecording.severity && diagnosisRecording.status && (
            <Card>
              <CardHeader>
                <CardTitle>Recording Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium">Diagnosis:</dt>
                    <dd className="text-muted-foreground">{selectedDiagnosis?.diagnosis_name}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">ICD-10 Code:</dt>
                    <dd className="text-muted-foreground">{selectedDiagnosis?.diagnosis_code}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Severity:</dt>
                    <dd className="text-muted-foreground">{diagnosisRecording.severity}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Status:</dt>
                    <dd className="text-muted-foreground">{diagnosisRecording.status}</dd>
                  </div>
                  {diagnosisRecording.clinical_notes && (
                    <div>
                      <dt className="font-medium">Clinical Notes:</dt>
                      <dd className="text-muted-foreground">{diagnosisRecording.clinical_notes}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  );
}
