import { useState, useMemo } from 'react';
import { FlowDashboard } from '@/components/flow/FlowDashboard';
import { RegistrationForm } from '@/components/flow/RegistrationForm';
import { DischargeForm } from '@/components/flow/DischargeForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  generateMockPatients, 
  generateMockPatientFlow,
  generateMockTriageRecord,
  generateMockPatientVisit
} from '@/lib/mockData';
import { FlowStage, DischargeType } from '@/types/enums';
import type { PatientFlow, TriageRecord, DischargeRecord } from '@/types/models';
import { 
  PlusIcon, 
  ClockIcon, 
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

// Generate mock data
const mockPatients = generateMockPatients(20);
const mockVisits = mockPatients.map(p => generateMockPatientVisit(p.id));

// Generate patient flows for active patients (not all patients)
const activePatients = mockPatients.slice(0, 15);
const mockFlows: PatientFlow[] = activePatients.map((patient, index) => {
  const visit = mockVisits[index];
  return generateMockPatientFlow(patient.id, visit.id);
});

// Generate triage records for patients who have been triaged
const mockTriageRecords: TriageRecord[] = mockFlows
  .filter(flow => 
    [FlowStage.TRIAGE, FlowStage.CONSULTATION, FlowStage.EXAMINATION, 
     FlowStage.DIAGNOSIS, FlowStage.TREATMENT, FlowStage.LABORATORY,
     FlowStage.PHARMACY, FlowStage.BILLING].includes(flow.current_stage)
  )
  .map(flow => generateMockTriageRecord(flow.patient_id, flow.id));

export default function PatientFlow() {
  const [patientFlows, setPatientFlows] = useState<PatientFlow[]>(mockFlows);
  const [triageRecords] = useState<TriageRecord[]>(mockTriageRecords);
  const [dischargeRecords, setDischargeRecords] = useState<DischargeRecord[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [dischargeFlowId, setDischargeFlowId] = useState<string | null>(null);
  const { toast } = useToast();

  // Calculate flow metrics
  const flowMetrics = useMemo(() => {
    const activeFlows = patientFlows.filter(f => !f.discharge_time);
    const completedFlows = patientFlows.filter(f => f.discharge_time);
    
    // Calculate average wait time per stage
    const stageWaitTimes: Record<FlowStage, number[]> = {
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

    activeFlows.forEach(flow => {
      const waitTime = Math.floor((new Date().getTime() - flow.arrival_time.getTime()) / (1000 * 60));
      stageWaitTimes[flow.current_stage].push(waitTime);
    });

    const avgWaitTimePerStage: Record<FlowStage, number> = {} as Record<FlowStage, number>;
    Object.entries(stageWaitTimes).forEach(([stage, times]) => {
      avgWaitTimePerStage[stage as FlowStage] = times.length > 0
        ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;
    });

    // Find bottleneck stages (stages with most patients)
    const stageCounts: Record<FlowStage, number> = {} as Record<FlowStage, number>;
    Object.values(FlowStage).forEach(stage => {
      stageCounts[stage] = activeFlows.filter(f => f.current_stage === stage).length;
    });
    
    const maxCount = Math.max(...Object.values(stageCounts));
    const bottleneckStages = Object.entries(stageCounts)
      .filter(([_, count]) => count === maxCount && count > 0)
      .map(([stage]) => stage as FlowStage);

    // Calculate average total visit time for completed flows
    const avgTotalVisitTime = completedFlows.length > 0
      ? Math.floor(
          completedFlows.reduce((sum, flow) => {
            if (flow.discharge_time) {
              return sum + (flow.discharge_time.getTime() - flow.arrival_time.getTime()) / (1000 * 60);
            }
            return sum;
          }, 0) / completedFlows.length
        )
      : 0;

    return {
      totalActivePatients: activeFlows.length,
      totalCompletedToday: completedFlows.length,
      avgWaitTimePerStage,
      bottleneckStages,
      avgTotalVisitTime,
    };
  }, [patientFlows]);

  const handleTransitionStage = (flowId: string, toStage: FlowStage) => {
    // If transitioning to discharge, open discharge form
    if (toStage === FlowStage.DISCHARGE) {
      setDischargeFlowId(flowId);
      return;
    }

    setPatientFlows(prev => 
      prev.map(flow => 
        flow.id === flowId 
          ? { ...flow, current_stage: toStage, updated_at: new Date() }
          : flow
      )
    );

    const flow = patientFlows.find(f => f.id === flowId);
    const patient = mockPatients.find(p => p.id === flow?.patient_id);
    
    toast({
      title: 'Stage Transition',
      description: `${patient?.first_name} ${patient?.last_name} moved to ${toStage}`,
    });
  };

  const handleRegistration = (data: any) => {
    const patient = mockPatients.find(p => p.id === data.patient_id);
    if (!patient) return;

    // Create new visit
    const newVisit = generateMockPatientVisit(patient.id, {
      visit_type: data.visit_type,
      chief_complaint: data.chief_complaint,
    });

    // Create new flow
    const newFlow = generateMockPatientFlow(patient.id, newVisit.id, {
      current_stage: FlowStage.REGISTRATION,
      arrival_time: new Date(),
    });

    setPatientFlows(prev => [...prev, newFlow]);
    setIsRegistrationOpen(false);

    toast({
      title: 'Patient Registered',
      description: `${patient.first_name} ${patient.last_name} has been registered successfully`,
    });
  };

  const handleDischarge = (data: any) => {
    if (!dischargeFlowId) return;

    const flow = patientFlows.find(f => f.id === dischargeFlowId);
    const patient = mockPatients.find(p => p.id === flow?.patient_id);
    if (!flow || !patient) return;

    // Create discharge record
    const dischargeRecord: DischargeRecord = {
      id: `discharge-${Date.now()}`,
      patient_id: flow.patient_id,
      visit_id: flow.visit_id,
      flow_id: flow.id,
      discharge_time: new Date(),
      discharge_type: data.discharge_type as DischargeType,
      discharge_summary: data.discharge_summary,
      follow_up_required: data.follow_up_required,
      follow_up_date: data.follow_up_date ? new Date(data.follow_up_date) : undefined,
      discharge_medications: data.discharge_medications 
        ? data.discharge_medications.split('\n').filter((m: string) => m.trim())
        : [],
      discharge_instructions: data.discharge_instructions,
      discharged_by: 'current-user-id', // Would come from auth context
    };

    setDischargeRecords(prev => [...prev, dischargeRecord]);

    // Update flow with discharge time
    const dischargeTime = new Date();
    const totalWaitTime = Math.floor((dischargeTime.getTime() - flow.arrival_time.getTime()) / (1000 * 60));
    
    setPatientFlows(prev =>
      prev.map(f =>
        f.id === dischargeFlowId
          ? {
              ...f,
              current_stage: FlowStage.DISCHARGE,
              discharge_time: dischargeTime,
              total_wait_time_minutes: totalWaitTime,
              updated_at: new Date(),
            }
          : f
      )
    );

    setDischargeFlowId(null);

    toast({
      title: 'Patient Discharged',
      description: `${patient.first_name} ${patient.last_name} has been discharged successfully`,
    });
  };

  const dischargeFlow = dischargeFlowId ? patientFlows.find(f => f.id === dischargeFlowId) : null;
  const dischargePatient = dischargeFlow ? mockPatients.find(p => p.id === dischargeFlow.patient_id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Flow Management</h1>
          <p className="text-muted-foreground mt-1">
            Track patients through their hospital journey in real-time
          </p>
        </div>
        <Button onClick={() => setIsRegistrationOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Register Patient
        </Button>
      </div>

      {/* Flow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flowMetrics.totalActivePatients}</div>
            <p className="text-xs text-muted-foreground">
              Currently in hospital
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flowMetrics.totalCompletedToday}</div>
            <p className="text-xs text-muted-foreground">
              Discharged patients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Visit Time</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {flowMetrics.avgTotalVisitTime > 0 
                ? `${Math.floor(flowMetrics.avgTotalVisitTime / 60)}h ${flowMetrics.avgTotalVisitTime % 60}m`
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              For completed visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bottleneck Stages</CardTitle>
            <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {flowMetrics.bottleneckStages.length > 0 ? (
                flowMetrics.bottleneckStages.map(stage => (
                  <Badge key={stage} variant="outline" className="text-xs">
                    {stage.replace('_', ' ')}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Stages with most patients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Flow Dashboard</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="metrics">Stage Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <FlowDashboard
            patientFlows={patientFlows}
            patients={mockPatients}
            triageRecords={triageRecords}
            onTransitionStage={handleTransitionStage}
          />
        </TabsContent>

        <TabsContent value="registration">
          <RegistrationForm
            patients={mockPatients}
            onSubmit={handleRegistration}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Average Wait Time by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(flowMetrics.avgWaitTimePerStage).map(([stage, avgTime]) => {
                  const stageLabel = stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  const activeCount = patientFlows.filter(
                    f => !f.discharge_time && f.current_stage === stage
                  ).length;

                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-medium min-w-[140px]">{stageLabel}</span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all"
                            style={{
                              width: `${Math.min((avgTime / 120) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 min-w-[180px] justify-end">
                        <span className="text-sm text-muted-foreground">
                          {avgTime > 0 ? `${avgTime} min avg` : 'No data'}
                        </span>
                        <Badge variant="secondary" className="min-w-[60px] justify-center">
                          {activeCount} active
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flow Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Total Patients Processed
                  </h4>
                  <p className="text-3xl font-bold">
                    {patientFlows.length}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Currently Active
                  </h4>
                  <p className="text-3xl font-bold">
                    {flowMetrics.totalActivePatients}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Discharged Today
                  </h4>
                  <p className="text-3xl font-bold">
                    {flowMetrics.totalCompletedToday}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Discharge Records
                  </h4>
                  <p className="text-3xl font-bold">
                    {dischargeRecords.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
          </DialogHeader>
          <RegistrationForm
            patients={mockPatients}
            onSubmit={handleRegistration}
            onCancel={() => setIsRegistrationOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Discharge Dialog */}
      <Dialog open={!!dischargeFlowId} onOpenChange={(open) => !open && setDischargeFlowId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Discharge Patient</DialogTitle>
          </DialogHeader>
          {dischargeFlow && dischargePatient && (
            <DischargeForm
              patient={dischargePatient}
              flow={dischargeFlow}
              onSubmit={handleDischarge}
              onCancel={() => setDischargeFlowId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
