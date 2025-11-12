/**
 * VisitDiagnosisRecording Component
 * Records diagnoses during a patient visit with symptom association
 * Requirements: 13.2, 13.3, 13.4
 */

import { useState } from 'react';
import { Plus, Trash2, Clock, User as UserIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DiagnosisSearch } from './DiagnosisSearch';
import type { Diagnosis } from '@/types/models';
import { DiagnosisSeverity, DiagnosisStatus } from '@/types/enums';
import type { RecordedSymptom } from './VisitSymptomRecording';

export interface RecordedDiagnosis {
  diagnosis: Diagnosis;
  severity: DiagnosisSeverity;
  status: DiagnosisStatus;
  clinical_notes: string;
  associated_symptom_ids: string[];
  diagnosed_at: Date;
  diagnosed_by: string;
}

interface VisitDiagnosisRecordingProps {
  diagnoses: RecordedDiagnosis[];
  onDiagnosesChange: (diagnoses: RecordedDiagnosis[]) => void;
  recordedSymptoms: RecordedSymptom[];
  patientHistory?: Array<{
    diagnosis_name: string;
    diagnosis_date: Date;
    status: string;
  }>;
  currentUser?: string;
  disabled?: boolean;
}

export function VisitDiagnosisRecording({
  diagnoses,
  onDiagnosesChange,
  recordedSymptoms,
  patientHistory = [],
  currentUser = 'Current User',
  disabled = false,
}: VisitDiagnosisRecordingProps) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [recording, setRecording] = useState<Partial<{
    severity: DiagnosisSeverity;
    status: DiagnosisStatus;
    clinical_notes: string;
  }>>({});
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);

  const handleAddDiagnosis = () => {
    if (!selectedDiagnosis || !recording.severity || !recording.status) {
      return;
    }

    const newDiagnosis: RecordedDiagnosis = {
      diagnosis: selectedDiagnosis,
      severity: recording.severity,
      status: recording.status,
      clinical_notes: recording.clinical_notes || '',
      associated_symptom_ids: selectedSymptomIds,
      diagnosed_at: new Date(),
      diagnosed_by: currentUser,
    };

    onDiagnosesChange([...diagnoses, newDiagnosis]);

    // Reset form
    setSelectedDiagnosis(null);
    setRecording({});
    setSelectedSymptomIds([]);
  };

  const handleRemoveDiagnosis = (index: number) => {
    const updatedDiagnoses = diagnoses.filter((_, i) => i !== index);
    onDiagnosesChange(updatedDiagnoses);
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const getAssociatedSymptoms = (symptomIds: string[]) => {
    return recordedSymptoms.filter((s) =>
      symptomIds.includes(s.symptom.id)
    );
  };

  const canAddDiagnosis = selectedDiagnosis && recording.severity && recording.status;

  return (
    <div className="space-y-6">
      {/* Patient Diagnosis History */}
      {patientHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Diagnoses</CardTitle>
            <CardDescription>Patient's diagnosis history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {patientHistory.map((diagnosis, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="text-sm font-medium">{diagnosis.diagnosis_name}</span>
                  <p className="text-xs text-muted-foreground">
                    {new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">{diagnosis.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add New Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle>Add Diagnosis</CardTitle>
          <CardDescription>Search and record a diagnosis with clinical details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Diagnosis Search with Recording Fields */}
          <DiagnosisSearch
            value={selectedDiagnosis?.id}
            recording={recording}
            onSelect={setSelectedDiagnosis}
            onRecordingChange={setRecording}
            disabled={disabled}
            showRecordingFields={true}
          />

          {selectedDiagnosis && (
            <>
              <Separator />

              {/* Associate with Symptoms */}
              {recordedSymptoms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <Label>Associate with Recorded Symptoms</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Link this diagnosis to symptoms recorded during this visit
                  </p>
                  <div className="space-y-2 border rounded-lg p-3">
                    {recordedSymptoms.map((symptom) => (
                      <div key={symptom.symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`symptom-${symptom.symptom.id}`}
                          checked={selectedSymptomIds.includes(symptom.symptom.id)}
                          onCheckedChange={() => handleSymptomToggle(symptom.symptom.id)}
                          disabled={disabled}
                        />
                        <label
                          htmlFor={`symptom-${symptom.symptom.id}`}
                          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span>{symptom.symptom.symptom_name}</span>
                            <Badge variant="outline" className="text-xs">
                              {symptom.severity}
                            </Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedSymptomIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {selectedSymptomIds.length} symptom(s) will be associated with this diagnosis
                    </p>
                  )}
                </div>
              )}

              {recordedSymptoms.length === 0 && (
                <div className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
                  No symptoms recorded yet. Record symptoms first to associate them with this diagnosis.
                </div>
              )}

              <Button
                type="button"
                onClick={handleAddDiagnosis}
                disabled={!canAddDiagnosis || disabled}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Diagnosis to Visit
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recorded Diagnoses List */}
      {diagnoses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recorded Diagnoses ({diagnoses.length})</CardTitle>
            <CardDescription>Diagnoses documented during this visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {diagnoses.map((recordedDiagnosis, index) => {
              const associatedSymptoms = getAssociatedSymptoms(
                recordedDiagnosis.associated_symptom_ids
              );

              return (
                <Card key={index} className="border-2">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Diagnosis Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="font-mono">
                              {recordedDiagnosis.diagnosis.diagnosis_code}
                            </Badge>
                            <h4 className="font-semibold">
                              {recordedDiagnosis.diagnosis.diagnosis_name}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ICD-10: {recordedDiagnosis.diagnosis.icd10_category}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDiagnosis(index)}
                          disabled={disabled}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Diagnosis Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Severity:</span>
                          <Badge
                            variant={
                              recordedDiagnosis.severity === DiagnosisSeverity.SEVERE
                                ? 'destructive'
                                : recordedDiagnosis.severity === DiagnosisSeverity.MODERATE
                                ? 'default'
                                : 'secondary'
                            }
                            className="ml-2"
                          >
                            {recordedDiagnosis.severity}
                          </Badge>
                        </div>
                        <div>
                          <span className="font-medium">Status:</span>
                          <Badge variant="outline" className="ml-2">
                            {recordedDiagnosis.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Associated Symptoms */}
                      {associatedSymptoms.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <LinkIcon className="h-3 w-3" />
                              <p className="text-sm font-medium">Associated Symptoms:</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {associatedSymptoms.map((symptom) => (
                                <Badge key={symptom.symptom.id} variant="outline">
                                  {symptom.symptom.symptom_name} ({symptom.severity})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Clinical Notes */}
                      {recordedDiagnosis.clinical_notes && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium mb-1">Clinical Notes:</p>
                            <p className="text-sm text-muted-foreground">
                              {recordedDiagnosis.clinical_notes}
                            </p>
                          </div>
                        </>
                      )}

                      <Separator />

                      {/* Recording Metadata */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(recordedDiagnosis.diagnosed_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            <span>{recordedDiagnosis.diagnosed_by}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      )}

      {diagnoses.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              No diagnoses recorded yet
            </p>
            <p className="text-xs text-muted-foreground">
              Use the form above to add diagnoses to this visit
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
