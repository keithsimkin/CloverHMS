import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmergencyCase, EmergencyCall, Ambulance, Staff } from '@/types/models';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface CaseManagementProps {
  cases: EmergencyCase[];
  calls: EmergencyCall[];
  ambulances: Ambulance[];
  staff: Staff[];
  onDispatchAmbulance: (caseId: string, ambulanceId: string) => void;
  onAssignHandler: (caseId: string, handlerId: string) => void;
  onUpdateStatus: (caseId: string, status: string) => void;
  onUpdateCase: (caseId: string, updates: Partial<EmergencyCase>) => void;
}

export function CaseManagement({
  cases,
  calls,
  ambulances,
  staff,
  onDispatchAmbulance,
  onUpdateCase,
}: CaseManagementProps) {
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);
  const [showDispatchDialog, setShowDispatchDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [selectedHandler, setSelectedHandler] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [treatmentProvided, setTreatmentProvided] = useState('');
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');

  const getCallForCase = (caseItem: EmergencyCase) => {
    return calls.find((call) => call.id === caseItem.call_id);
  };

  const getAmbulanceForCase = (caseItem: EmergencyCase) => {
    return ambulances.find((amb) => amb.id === caseItem.ambulance_id);
  };

  const getHandlerForCase = (caseItem: EmergencyCase) => {
    return staff.find((s) => s.id === caseItem.case_handler_id);
  };

  const calculateResponseTime = (caseItem: EmergencyCase) => {
    const call = getCallForCase(caseItem);
    if (!call || !caseItem.pickup_time) return null;
    const callTime = new Date(call.call_time).getTime();
    const pickupTime = new Date(caseItem.pickup_time).getTime();
    return Math.round((pickupTime - callTime) / 60000); // minutes
  };

  const handleDispatch = () => {
    if (selectedCase && selectedAmbulance) {
      onDispatchAmbulance(selectedCase.id, selectedAmbulance);
      setShowDispatchDialog(false);
      setSelectedAmbulance('');
    }
  };

  const handleUpdateCase = () => {
    if (selectedCase) {
      onUpdateCase(selectedCase.id, {
        patient_condition: patientCondition,
        treatment_provided: treatmentProvided,
        outcome,
        notes,
      });
      setShowUpdateDialog(false);
      resetUpdateForm();
    }
  };

  const resetUpdateForm = () => {
    setPatientCondition('');
    setTreatmentProvided('');
    setOutcome('');
    setNotes('');
  };

  const openDispatchDialog = (caseItem: EmergencyCase) => {
    setSelectedCase(caseItem);
    setShowDispatchDialog(true);
  };

  const openUpdateDialog = (caseItem: EmergencyCase) => {
    setSelectedCase(caseItem);
    setPatientCondition(caseItem.patient_condition || '');
    setTreatmentProvided(caseItem.treatment_provided || '');
    setOutcome(caseItem.outcome || '');
    setNotes(caseItem.notes || '');
    setShowUpdateDialog(true);
  };

  const activeCases = cases.filter(
    (c) =>
      !['completed', 'cancelled'].includes(
        getCallForCase(c)?.status || ''
      )
  );
  const completedCases = cases.filter((c) =>
    ['completed', 'cancelled'].includes(
      getCallForCase(c)?.status || ''
    )
  );

  const renderCaseRow = (caseItem: EmergencyCase) => {
    const call = getCallForCase(caseItem);
    const ambulance = getAmbulanceForCase(caseItem);
    const handler = getHandlerForCase(caseItem);
    const responseTime = calculateResponseTime(caseItem);

    return (
      <TableRow key={caseItem.id}>
        <TableCell>
          {call ? (
            <div>
              <p className="font-medium">{call.emergency_type}</p>
              <p className="text-sm text-muted-foreground">{call.location}</p>
            </div>
          ) : (
            'N/A'
          )}
        </TableCell>
        <TableCell>
          {ambulance ? (
            <Badge variant="outline">{ambulance.vehicle_number}</Badge>
          ) : (
            <Badge variant="destructive">Not Assigned</Badge>
          )}
        </TableCell>
        <TableCell>
          {handler ? `${handler.first_name} ${handler.last_name}` : 'Not Assigned'}
        </TableCell>
        <TableCell>
          {call && (
            <Badge
              variant={
                call.status === 'received'
                  ? 'destructive'
                  : call.status === 'completed'
                  ? 'outline'
                  : 'default'
              }
            >
              {call.status.replace(/_/g, ' ').toUpperCase()}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {responseTime !== null ? `${responseTime} min` : 'Pending'}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            {!caseItem.ambulance_id && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openDispatchDialog(caseItem)}
              >
                Dispatch
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => openUpdateDialog(caseItem)}
            >
              Update
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Emergency Case Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">
                Active Cases ({activeCases.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedCases.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Emergency Details</TableHead>
                      <TableHead>Ambulance</TableHead>
                      <TableHead>Case Handler</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No active cases
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeCases.map(renderCaseRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Emergency Details</TableHead>
                      <TableHead>Ambulance</TableHead>
                      <TableHead>Case Handler</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedCases.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No completed cases
                        </TableCell>
                      </TableRow>
                    ) : (
                      completedCases.map(renderCaseRow)
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dispatch Ambulance Dialog */}
      <Dialog open={showDispatchDialog} onOpenChange={setShowDispatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispatch Ambulance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Ambulance</Label>
              <Select value={selectedAmbulance} onValueChange={setSelectedAmbulance}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose available ambulance" />
                </SelectTrigger>
                <SelectContent>
                  {ambulances
                    .filter((amb) => amb.status === 'available')
                    .map((amb) => (
                      <SelectItem key={amb.id} value={amb.id}>
                        {amb.vehicle_number} - {amb.driver_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Assign Case Handler</Label>
              <Select value={selectedHandler} onValueChange={setSelectedHandler}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose case handler" />
                </SelectTrigger>
                <SelectContent>
                  {staff
                    .filter((s) => s.role.toLowerCase().includes('doctor') || s.role.toLowerCase().includes('nurse'))
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} - {s.specialization}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDispatchDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleDispatch} disabled={!selectedAmbulance}>
                Dispatch
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Case Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Emergency Case</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient Condition</Label>
              <Textarea
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                placeholder="Describe patient's condition..."
                rows={3}
              />
            </div>

            <div>
              <Label>Treatment Provided</Label>
              <Textarea
                value={treatmentProvided}
                onChange={(e) => setTreatmentProvided(e.target.value)}
                placeholder="Describe treatment provided..."
                rows={3}
              />
            </div>

            <div>
              <Label>Outcome</Label>
              <Input
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder="e.g., Stabilized, Transported to Hospital"
              />
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUpdateDialog(false);
                  resetUpdateForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCase}>Update Case</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
