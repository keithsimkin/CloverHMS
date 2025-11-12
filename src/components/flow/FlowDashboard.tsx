import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowRightIcon, 
  ClockIcon, 
  UserIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { FlowStage, PriorityLevel } from '@/types/enums';
import type { PatientFlow, Patient, TriageRecord } from '@/types/models';
import { cn } from '@/lib/utils';

interface FlowDashboardProps {
  patientFlows: PatientFlow[];
  patients: Patient[];
  triageRecords: TriageRecord[];
  onTransitionStage?: (flowId: string, toStage: FlowStage) => void;
}

const stageLabels: Record<FlowStage, string> = {
  [FlowStage.REGISTRATION]: 'Registration',
  [FlowStage.WAITING]: 'Waiting',
  [FlowStage.TRIAGE]: 'Triage',
  [FlowStage.CONSULTATION]: 'Consultation',
  [FlowStage.EXAMINATION]: 'Examination',
  [FlowStage.DIAGNOSIS]: 'Diagnosis',
  [FlowStage.TREATMENT]: 'Treatment',
  [FlowStage.LABORATORY]: 'Laboratory',
  [FlowStage.PHARMACY]: 'Pharmacy',
  [FlowStage.BILLING]: 'Billing',
  [FlowStage.DISCHARGE]: 'Discharge',
};

const priorityColors: Record<PriorityLevel, string> = {
  [PriorityLevel.CRITICAL]: 'bg-red-500 text-white',
  [PriorityLevel.URGENT]: 'bg-orange-500 text-white',
  [PriorityLevel.SEMI_URGENT]: 'bg-yellow-500 text-black',
  [PriorityLevel.NON_URGENT]: 'bg-green-500 text-white',
};

const stageColors: Record<FlowStage, string> = {
  [FlowStage.REGISTRATION]: 'border-blue-500',
  [FlowStage.WAITING]: 'border-gray-500',
  [FlowStage.TRIAGE]: 'border-yellow-500',
  [FlowStage.CONSULTATION]: 'border-purple-500',
  [FlowStage.EXAMINATION]: 'border-indigo-500',
  [FlowStage.DIAGNOSIS]: 'border-pink-500',
  [FlowStage.TREATMENT]: 'border-cyan-500',
  [FlowStage.LABORATORY]: 'border-teal-500',
  [FlowStage.PHARMACY]: 'border-lime-500',
  [FlowStage.BILLING]: 'border-amber-500',
  [FlowStage.DISCHARGE]: 'border-emerald-500',
};

const nextStages: Record<FlowStage, FlowStage[]> = {
  [FlowStage.REGISTRATION]: [FlowStage.WAITING, FlowStage.TRIAGE],
  [FlowStage.WAITING]: [FlowStage.TRIAGE],
  [FlowStage.TRIAGE]: [FlowStage.CONSULTATION, FlowStage.EXAMINATION],
  [FlowStage.CONSULTATION]: [FlowStage.EXAMINATION, FlowStage.DIAGNOSIS, FlowStage.LABORATORY],
  [FlowStage.EXAMINATION]: [FlowStage.DIAGNOSIS, FlowStage.LABORATORY],
  [FlowStage.DIAGNOSIS]: [FlowStage.TREATMENT, FlowStage.LABORATORY, FlowStage.PHARMACY],
  [FlowStage.TREATMENT]: [FlowStage.PHARMACY, FlowStage.BILLING],
  [FlowStage.LABORATORY]: [FlowStage.CONSULTATION, FlowStage.DIAGNOSIS],
  [FlowStage.PHARMACY]: [FlowStage.BILLING],
  [FlowStage.BILLING]: [FlowStage.DISCHARGE],
  [FlowStage.DISCHARGE]: [],
};

function calculateWaitTime(arrivalTime: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - arrivalTime.getTime();
  return Math.floor(diffMs / (1000 * 60)); // Convert to minutes
}

function formatWaitTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function FlowDashboard({ 
  patientFlows, 
  patients, 
  triageRecords,
  onTransitionStage 
}: FlowDashboardProps) {
  const [selectedStage, setSelectedStage] = useState<FlowStage | null>(null);

  // Group flows by stage
  const flowsByStage = useMemo(() => {
    const grouped: Record<FlowStage, PatientFlow[]> = {
      [FlowStage.REGISTRATION]: [],
      [FlowStage.WAITING]: [],
      [FlowStage.TRIAGE]: [],
      [FlowStage.CONSULTATION]: [],
      [FlowStage.EXAMINATION]: [],
      [FlowStage.DIAGNOSIS]: [],
      [FlowStage.TREATMENT]: [],
      [FlowStage.LABORATORY]: [],
      [FlowStage.PHARMACY]: [],
      [FlowStage.BILLING]: [],
      [FlowStage.DISCHARGE]: [],
    };

    patientFlows.forEach(flow => {
      if (!flow.discharge_time) {
        grouped[flow.current_stage].push(flow);
      }
    });

    return grouped;
  }, [patientFlows]);

  // Get patient details
  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  // Get triage priority
  const getTriagePriority = (flowId: string): PriorityLevel | null => {
    const triage = triageRecords.find(t => t.flow_id === flowId);
    return triage?.priority_level || null;
  };

  // Filter flows based on selected stage
  const displayFlows = selectedStage 
    ? flowsByStage[selectedStage] 
    : Object.values(flowsByStage).flat();

  return (
    <div className="space-y-6">
      {/* Stage Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(flowsByStage).map(([stage, flows]) => {
          const stageEnum = stage as FlowStage;
          const isSelected = selectedStage === stageEnum;
          
          return (
            <Card
              key={stage}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg border-l-4',
                stageColors[stageEnum],
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => setSelectedStage(isSelected ? null : stageEnum)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  {stageLabels[stageEnum]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-3xl font-bold">{flows.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {flows.length === 1 ? 'patient' : 'patients'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {selectedStage 
                ? `${stageLabels[selectedStage]} - ${flowsByStage[selectedStage].length} Patients`
                : `All Active Patients - ${displayFlows.length} Total`
              }
            </span>
            {selectedStage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStage(null)}
              >
                Show All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {displayFlows.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No patients in this stage</p>
                </div>
              ) : (
                displayFlows.map(flow => {
                  const patient = getPatient(flow.patient_id);
                  const priority = getTriagePriority(flow.id);
                  const waitTime = calculateWaitTime(flow.arrival_time);
                  const possibleNextStages = nextStages[flow.current_stage];

                  if (!patient) return null;

                  return (
                    <Card 
                      key={flow.id}
                      className={cn(
                        'border-l-4',
                        stageColors[flow.current_stage]
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          {/* Patient Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {patient.first_name} {patient.last_name}
                              </h3>
                              {priority && (
                                <Badge className={priorityColors[priority]}>
                                  {priority === PriorityLevel.CRITICAL && (
                                    <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                  )}
                                  {priority.replace('-', ' ').toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>ID: {patient.patient_id}</span>
                              <span>•</span>
                              <span>{patient.gender}</span>
                              <span>•</span>
                              <span>
                                {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">
                                {stageLabels[flow.current_stage]}
                              </Badge>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <ClockIcon className="h-4 w-4" />
                                <span>Wait: {formatWaitTime(waitTime)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          {possibleNextStages.length > 0 && onTransitionStage && (
                            <div className="flex flex-col gap-2">
                              {possibleNextStages.map(nextStage => (
                                <Button
                                  key={nextStage}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onTransitionStage(flow.id, nextStage)}
                                  className="whitespace-nowrap"
                                >
                                  <ArrowRightIcon className="h-4 w-4 mr-1" />
                                  {stageLabels[nextStage]}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
