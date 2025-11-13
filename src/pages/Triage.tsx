import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import TriageForm from '@/components/triage/TriageForm';
import {
  generateMockPatients,
  generateMockPatientFlow,
  generateMockPatientVisit,
} from '@/lib/mockData';
import { FlowStage, PriorityLevel } from '@/types/enums';
import type { Patient, PatientFlow, TriageRecord } from '@/types/models';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';

// Generate mock data
const mockPatients = generateMockPatients(20);
const mockVisits = mockPatients.map((p) => generateMockPatientVisit(p.id));

// Generate patient flows for patients waiting for triage
const patientsWaitingForTriage = mockPatients.slice(0, 8);
const mockFlows: PatientFlow[] = patientsWaitingForTriage.map((patient, index) => {
  const visit = mockVisits[index];
  return generateMockPatientFlow(patient.id, visit.id, { current_stage: FlowStage.WAITING });
});

export default function Triage() {
  const [patientFlows, setPatientFlows] = useState<PatientFlow[]>(mockFlows);
  const [triageRecords, setTriageRecords] = useState<TriageRecord[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<PatientFlow | null>(null);
  const [isTriageFormOpen, setIsTriageFormOpen] = useState(false);
  const { toast } = useToast();

  // Get patients waiting for triage (in WAITING stage)
  const waitingPatients = patientFlows
    .filter((flow) => flow.current_stage === FlowStage.WAITING)
    .sort((a, b) => new Date(a.arrival_time).getTime() - new Date(b.arrival_time).getTime());

  // Get triaged patients (sorted by priority)
  const triagedPatients = patientFlows
    .filter((flow) => flow.current_stage === FlowStage.TRIAGE)
    .map((flow) => {
      const record = triageRecords.find((r) => r.flow_id === flow.id);
      return { flow, record };
    })
    .filter((item) => item.record)
    .sort((a, b) => {
      const priorityOrder = {
        [PriorityLevel.CRITICAL]: 0,
        [PriorityLevel.URGENT]: 1,
        [PriorityLevel.SEMI_URGENT]: 2,
        [PriorityLevel.NON_URGENT]: 3,
      };
      return (
        priorityOrder[a.record!.priority_level] - priorityOrder[b.record!.priority_level]
      );
    });

  const handleStartTriage = (flow: PatientFlow) => {
    setSelectedFlow(flow);
    setIsTriageFormOpen(true);
  };

  const handleTriageSubmit = (data: Omit<TriageRecord, 'id' | 'triaged_at' | 'triaged_by'>) => {
    if (!selectedFlow) return;

    // Create triage record
    const newRecord: TriageRecord = {
      ...data,
      id: `triage-${Date.now()}`,
      triaged_by: 'current-user-id', // In real app, get from auth
      triaged_at: new Date(),
    };

    // Update triage records
    setTriageRecords((prev) => [...prev, newRecord]);

    // Update flow stage to TRIAGE
    setPatientFlows((prev) =>
      prev.map((flow) =>
        flow.id === selectedFlow.id
          ? { ...flow, current_stage: FlowStage.TRIAGE, updated_at: new Date() }
          : flow
      )
    );

    const patient = mockPatients.find((p) => p.id === selectedFlow.patient_id);

    toast({
      title: 'Triage Completed',
      description: `${patient?.first_name} ${patient?.last_name} has been triaged with ${data.priority_level} priority`,
    });

    setIsTriageFormOpen(false);
    setSelectedFlow(null);
  };

  const handleSendToConsultation = (flowId: string) => {
    setPatientFlows((prev) =>
      prev.map((flow) =>
        flow.id === flowId
          ? { ...flow, current_stage: FlowStage.CONSULTATION, updated_at: new Date() }
          : flow
      )
    );

    const flow = patientFlows.find((f) => f.id === flowId);
    const patient = mockPatients.find((p) => p.id === flow?.patient_id);

    toast({
      title: 'Sent to Consultation',
      description: `${patient?.first_name} ${patient?.last_name} has been sent to consultation`,
    });
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    return mockPatients.find((p) => p.id === patientId);
  };

  const getWaitTime = (arrivalTime: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(arrivalTime).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.CRITICAL:
        return 'bg-destructive text-destructive-foreground';
      case PriorityLevel.URGENT:
        return 'bg-warning text-warning-foreground';
      case PriorityLevel.SEMI_URGENT:
        return 'bg-info text-info-foreground';
      case PriorityLevel.NON_URGENT:
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: PriorityLevel) => {
    switch (priority) {
      case PriorityLevel.CRITICAL:
        return 'Critical';
      case PriorityLevel.URGENT:
        return 'Urgent';
      case PriorityLevel.SEMI_URGENT:
        return 'Semi-Urgent';
      case PriorityLevel.NON_URGENT:
        return 'Non-Urgent';
      default:
        return priority;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Triage</h1>
        <p className="text-muted-foreground">
          Assess and prioritize patients based on urgency
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Waiting for Triage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{waitingPatients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {
                triagedPatients.filter(
                  (p) => p.record?.priority_level === PriorityLevel.CRITICAL
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {
                triagedPatients.filter(
                  (p) => p.record?.priority_level === PriorityLevel.URGENT
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Triaged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{triagedPatients.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waiting for Triage Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Waiting for Triage ({waitingPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {waitingPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No patients waiting for triage
                </div>
              ) : (
                <div className="space-y-3">
                  {waitingPatients.map((flow) => {
                    const patient = getPatientById(flow.patient_id);
                    if (!patient) return null;

                    return (
                      <Card key={flow.id} className="border-l-4 border-l-muted">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {patient.first_name} {patient.last_name}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {patient.patient_id}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ClockIcon className="h-4 w-4" />
                                <span>Waiting: {getWaitTime(flow.arrival_time)}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Age:</span>{' '}
                                {new Date().getFullYear() -
                                  new Date(patient.date_of_birth).getFullYear()}{' '}
                                years
                              </div>
                            </div>
                            <Button size="sm" onClick={() => handleStartTriage(flow)}>
                              Start Triage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Triaged Patients (Priority-based) */}
        <Card>
          <CardHeader>
            <CardTitle>Triaged Patients ({triagedPatients.length})</CardTitle>
            <p className="text-sm text-muted-foreground">Sorted by priority level</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {triagedPatients.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No patients have been triaged yet
                </div>
              ) : (
                <div className="space-y-3">
                  {triagedPatients.map(({ flow, record }) => {
                    const patient = getPatientById(flow.patient_id);
                    if (!patient || !record) return null;

                    return (
                      <Card
                        key={flow.id}
                        className={`border-l-4 ${
                          record.priority_level === PriorityLevel.CRITICAL
                            ? 'border-l-destructive'
                            : record.priority_level === PriorityLevel.URGENT
                            ? 'border-l-warning'
                            : record.priority_level === PriorityLevel.SEMI_URGENT
                            ? 'border-l-info'
                            : 'border-l-success'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {patient.first_name} {patient.last_name}
                                  </span>
                                  <Badge className={getPriorityColor(record.priority_level)}>
                                    {getPriorityLabel(record.priority_level)}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  ID: {patient.patient_id}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Chief Complaint:</span>
                                <p className="mt-1">{record.chief_complaint}</p>
                              </div>

                              {/* Vital Signs */}
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                {record.vital_signs.temperature && (
                                  <div>
                                    <span className="text-muted-foreground">Temp:</span>{' '}
                                    {record.vital_signs.temperature}°C
                                  </div>
                                )}
                                {record.vital_signs.blood_pressure && (
                                  <div>
                                    <span className="text-muted-foreground">BP:</span>{' '}
                                    {record.vital_signs.blood_pressure}
                                  </div>
                                )}
                                {record.vital_signs.heart_rate && (
                                  <div>
                                    <span className="text-muted-foreground">HR:</span>{' '}
                                    {record.vital_signs.heart_rate} bpm
                                  </div>
                                )}
                                {record.vital_signs.oxygen_saturation && (
                                  <div>
                                    <span className="text-muted-foreground">SpO2:</span>{' '}
                                    {record.vital_signs.oxygen_saturation}%
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex justify-end pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendToConsultation(flow.id)}
                              >
                                Send to Consultation
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Triage Form Dialog */}
      <Dialog open={isTriageFormOpen} onOpenChange={setIsTriageFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Triage Assessment</DialogTitle>
          </DialogHeader>
          {selectedFlow && (
            <TriageForm
              patient={getPatientById(selectedFlow.patient_id)!}
              flow={selectedFlow}
              onSubmit={handleTriageSubmit}
              onCancel={() => {
                setIsTriageFormOpen(false);
                setSelectedFlow(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
