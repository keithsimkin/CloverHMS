/**
 * PatientVisitForm Component
 * Comprehensive form for documenting patient visits with guided workflow
 * Requirements: 14.1, 14.2
 */

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Activity, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockPatients, generateMockStaffMembers } from '@/lib/mockData';
import { VisitType } from '@/types/enums';
import { VisitSymptomRecording, type RecordedSymptom } from './VisitSymptomRecording';
import { VisitDiagnosisRecording, type RecordedDiagnosis } from './VisitDiagnosisRecording';
import { VisitPrescriptionCreation, type RecordedPrescription } from './VisitPrescriptionCreation';
import { VisitSummaryReport } from './VisitSummaryReport';

// Validation schema
const visitFormSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  provider_id: z.string().min(1, 'Provider is required'),
  visit_type: z.nativeEnum(VisitType),
  chief_complaint: z.string().min(1, 'Chief complaint is required'),
  vital_signs: z.object({
    temperature: z.number().optional(),
    blood_pressure: z.string().optional(),
    heart_rate: z.number().optional(),
    respiratory_rate: z.number().optional(),
    oxygen_saturation: z.number().optional(),
  }),
  visit_summary: z.string().optional(),
  follow_up_recommendations: z.string().optional(),
});

type VisitFormData = z.infer<typeof visitFormSchema>;

interface PatientVisitFormProps {
  patientId?: string;
  onSubmit: (data: VisitFormData) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function PatientVisitForm({
  patientId,
  onSubmit,
  onCancel,
  disabled = false,
}: PatientVisitFormProps) {
  const [currentStep, setCurrentStep] = useState<'basic' | 'symptoms' | 'diagnosis' | 'prescription' | 'summary'>('basic');
  const [recordedSymptoms, setRecordedSymptoms] = useState<RecordedSymptom[]>([]);
  const [recordedDiagnoses, setRecordedDiagnoses] = useState<RecordedDiagnosis[]>([]);
  const [recordedPrescriptions, setRecordedPrescriptions] = useState<RecordedPrescription[]>([]);

  // Mock data
  const patients = useMemo(() => generateMockPatients(50), []);
  const allStaff = useMemo(() => generateMockStaffMembers(20), []);
  const providers = useMemo(() => allStaff.filter((s: any) => s.role === 'doctor'), [allStaff]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      patient_id: patientId || '',
      provider_id: '',
      visit_type: VisitType.CONSULTATION,
      chief_complaint: '',
      vital_signs: {},
      visit_summary: '',
      follow_up_recommendations: '',
    },
  });

  const selectedPatientId = watch('patient_id');
  const selectedPatient = useMemo(
    () => patients.find(p => p.id === selectedPatientId),
    [patients, selectedPatientId]
  );

  // Mock patient history data
  const patientHistory = useMemo(() => {
    if (!selectedPatient) return null;

    return {
      previousSymptoms: [
        { symptom_name: 'Fever', recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { symptom_name: 'Cough', recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      ],
      diagnoses: [
        { diagnosis_name: 'Upper Respiratory Tract Infection', diagnosis_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: 'resolved' },
      ],
      activePrescriptions: [
        { medicine_name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', status: 'active' },
      ],
    };
  }, [selectedPatient]);

  const handleFormSubmit = (data: VisitFormData) => {
    onSubmit(data);
  };

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'diagnosis', label: 'Diagnosis', icon: FileText },
    { id: 'prescription', label: 'Prescription', icon: FileText },
    { id: 'summary', label: 'Summary', icon: FileText },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Visit Workflow</CardTitle>
          <CardDescription>Follow the guided workflow to document the patient visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.id as typeof currentStep)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-secondary text-secondary-foreground'
                        : 'text-muted-foreground hover:bg-secondary'
                    }`}
                    disabled={disabled}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Basic Information Step */}
      {currentStep === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Visit Information</CardTitle>
            <CardDescription>Select patient and enter visit details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient Selection */}
            <div className="space-y-2">
              <Label htmlFor="patient_id">Patient *</Label>
              <Select
                value={watch('patient_id')}
                onValueChange={(value) => setValue('patient_id', value)}
                disabled={disabled || !!patientId}
              >
                <SelectTrigger id="patient_id">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name} - {patient.patient_id}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {errors.patient_id && (
                <p className="text-sm text-destructive">{errors.patient_id.message}</p>
              )}
            </div>

            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="provider_id">Provider (Doctor) *</Label>
              <Select
                value={watch('provider_id')}
                onValueChange={(value) => setValue('provider_id', value)}
                disabled={disabled}
              >
                <SelectTrigger id="provider_id">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider: any) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      Dr. {provider.first_name} {provider.last_name} - {provider.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provider_id && (
                <p className="text-sm text-destructive">{errors.provider_id.message}</p>
              )}
            </div>

            {/* Visit Type */}
            <div className="space-y-2">
              <Label htmlFor="visit_type">Visit Type *</Label>
              <Select
                value={watch('visit_type')}
                onValueChange={(value) => setValue('visit_type', value as VisitType)}
                disabled={disabled}
              >
                <SelectTrigger id="visit_type">
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VisitType.CONSULTATION}>Consultation</SelectItem>
                  <SelectItem value={VisitType.FOLLOW_UP}>Follow-up</SelectItem>
                  <SelectItem value={VisitType.EMERGENCY}>Emergency</SelectItem>
                </SelectContent>
              </Select>
              {errors.visit_type && (
                <p className="text-sm text-destructive">{errors.visit_type.message}</p>
              )}
            </div>

            {/* Chief Complaint */}
            <div className="space-y-2">
              <Label htmlFor="chief_complaint">Chief Complaint *</Label>
              <Textarea
                id="chief_complaint"
                placeholder="Enter the main reason for the visit..."
                {...register('chief_complaint')}
                disabled={disabled}
                rows={3}
              />
              {errors.chief_complaint && (
                <p className="text-sm text-destructive">{errors.chief_complaint.message}</p>
              )}
            </div>

            <Separator />

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vital Signs</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    {...register('vital_signs.temperature', { valueAsNumber: true })}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blood_pressure">Blood Pressure (mmHg)</Label>
                  <Input
                    id="blood_pressure"
                    placeholder="120/80"
                    {...register('vital_signs.blood_pressure')}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                  <Input
                    id="heart_rate"
                    type="number"
                    placeholder="72"
                    {...register('vital_signs.heart_rate', { valueAsNumber: true })}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="respiratory_rate">Respiratory Rate (breaths/min)</Label>
                  <Input
                    id="respiratory_rate"
                    type="number"
                    placeholder="16"
                    {...register('vital_signs.respiratory_rate', { valueAsNumber: true })}
                    disabled={disabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygen_saturation"
                    type="number"
                    placeholder="98"
                    {...register('vital_signs.oxygen_saturation', { valueAsNumber: true })}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setCurrentStep('symptoms')}
                disabled={!selectedPatient || disabled}
              >
                Next: Record Symptoms
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient History Sidebar */}
      {selectedPatient && patientHistory && (
        <Card>
          <CardHeader>
            <CardTitle>Patient History</CardTitle>
            <CardDescription>
              {selectedPatient.first_name} {selectedPatient.last_name} - {selectedPatient.patient_id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="symptoms" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="symptoms" className="space-y-2">
                {patientHistory.previousSymptoms.length > 0 ? (
                  patientHistory.previousSymptoms.map((symptom: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{symptom.symptom_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {symptom.recorded_at && new Date(symptom.recorded_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No previous symptoms recorded</p>
                )}
              </TabsContent>

              <TabsContent value="diagnoses" className="space-y-2">
                {patientHistory.diagnoses.length > 0 ? (
                  patientHistory.diagnoses.map((diagnosis: any, index: number) => (
                    <div key={index} className="p-2 border rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{diagnosis.diagnosis_name}</span>
                        <Badge variant="secondary">{diagnosis.status}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {diagnosis.diagnosis_date && new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No previous diagnoses recorded</p>
                )}
              </TabsContent>

              <TabsContent value="prescriptions" className="space-y-2">
                {patientHistory.activePrescriptions.length > 0 ? (
                  patientHistory.activePrescriptions.map((prescription: any, index: number) => (
                    <div key={index} className="p-2 border rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{prescription.medicine_name}</span>
                        <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                          {prescription.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No active prescriptions</p>
                )}
              </TabsContent>
            </Tabs>

            {/* Patient Allergies Alert */}
            {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Allergies</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPatient.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Symptoms Recording Step */}
      {currentStep === 'symptoms' && (
        <div className="space-y-4">
          <VisitSymptomRecording
            symptoms={recordedSymptoms}
            onSymptomsChange={setRecordedSymptoms}
            currentUser="Dr. Current User"
            disabled={disabled}
          />
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('basic')}
                  disabled={disabled}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep('diagnosis')}
                  disabled={disabled}
                >
                  Next: Diagnosis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Diagnosis Recording Step */}
      {currentStep === 'diagnosis' && (
        <div className="space-y-4">
          <VisitDiagnosisRecording
            diagnoses={recordedDiagnoses}
            onDiagnosesChange={setRecordedDiagnoses}
            recordedSymptoms={recordedSymptoms}
            patientHistory={patientHistory?.diagnoses as any}
            currentUser="Dr. Current User"
            disabled={disabled}
          />
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('symptoms')}
                  disabled={disabled}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep('prescription')}
                  disabled={disabled}
                >
                  Next: Prescription
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Prescription Creation Step */}
      {currentStep === 'prescription' && (
        <div className="space-y-4">
          <VisitPrescriptionCreation
            prescriptions={recordedPrescriptions}
            onPrescriptionsChange={setRecordedPrescriptions}
            patientHistory={patientHistory?.activePrescriptions as any}
            patientAllergies={selectedPatient?.allergies}
            currentUser="Dr. Current User"
            disabled={disabled}
          />
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('diagnosis')}
                  disabled={disabled}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setCurrentStep('summary')}
                  disabled={disabled}
                >
                  Next: Summary
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Step */}
      {currentStep === 'summary' && selectedPatient && (
        <div className="space-y-4">
          {/* Summary Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Visit Summary</CardTitle>
              <CardDescription>Review and finalize the visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visit_summary">Visit Summary</Label>
                <Textarea
                  id="visit_summary"
                  placeholder="Summarize the visit, findings, and treatment plan..."
                  {...register('visit_summary')}
                  disabled={disabled}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_recommendations">Follow-up Recommendations</Label>
                <Textarea
                  id="follow_up_recommendations"
                  placeholder="Enter follow-up instructions, next appointment recommendations, etc..."
                  {...register('follow_up_recommendations')}
                  disabled={disabled}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Visit Summary Report */}
          <VisitSummaryReport
            patient={selectedPatient}
            provider={providers.find((p: any) => p.id === watch('provider_id'))!}
            visitType={watch('visit_type')}
            chiefComplaint={watch('chief_complaint')}
            vitalSigns={watch('vital_signs')}
            symptoms={recordedSymptoms}
            diagnoses={recordedDiagnoses}
            prescriptions={recordedPrescriptions}
            visitSummary={watch('visit_summary')}
            followUpRecommendations={watch('follow_up_recommendations')}
          />

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep('prescription')}
                  disabled={disabled}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={disabled}>
                    Complete Visit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}
