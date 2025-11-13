import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmergencyCallForm } from '@/components/emergency/EmergencyCallForm';
import { ActiveEmergencyCalls } from '@/components/emergency/ActiveEmergencyCalls';
import { EmergencyCall } from '@/types/models';
import { EmergencyCallStatus } from '@/types/enums';
import { PhoneIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockCalls: EmergencyCall[] = [
  {
    id: '1',
    call_time: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    caller_name: 'Jane Doe',
    caller_contact: '+1234567890',
    patient_name: 'John Doe',
    location: '123 Main Street, Apartment 4B, Downtown',
    emergency_type: 'Cardiac Arrest',
    description: 'Patient collapsed, not breathing, CPR in progress',
    priority: 'critical',
    status: EmergencyCallStatus.RECEIVED,
    received_by: 'user-1',
  },
  {
    id: '2',
    call_time: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    caller_name: 'Robert Smith',
    caller_contact: '+1234567891',
    location: '456 Oak Avenue, Near City Park',
    emergency_type: 'Trauma/Accident',
    description: 'Car accident, multiple injuries, bleeding',
    priority: 'high',
    status: EmergencyCallStatus.DISPATCHED,
    received_by: 'user-1',
  },
  {
    id: '3',
    call_time: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    caller_name: 'Mary Johnson',
    caller_contact: '+1234567892',
    patient_name: 'Sarah Johnson',
    location: '789 Elm Street, House #12',
    emergency_type: 'Respiratory Distress',
    description: 'Difficulty breathing, asthma attack',
    priority: 'high',
    status: EmergencyCallStatus.PATIENT_PICKED_UP,
    received_by: 'user-1',
  },
];

export default function EmergencyCalls() {
  const [calls, setCalls] = useState<EmergencyCall[]>(mockCalls);
  const [showForm, setShowForm] = useState(false);
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | undefined>();
  const { toast } = useToast();

  const handleLogCall = () => {
    setSelectedCall(undefined);
    setShowForm(true);
  };

  const handleSubmit = (data: any) => {
    if (selectedCall) {
      // Update existing call
      setCalls(
        calls.map((call) =>
          call.id === selectedCall.id ? { ...call, ...data } : call
        )
      );
      toast({
        title: 'Call Updated',
        description: 'Emergency call information has been updated.',
      });
    } else {
      // Add new call
      const newCall: EmergencyCall = {
        id: Date.now().toString(),
        call_time: new Date(),
        ...data,
        status: EmergencyCallStatus.RECEIVED,
        received_by: 'current-user', // Replace with actual user ID
      };
      setCalls([newCall, ...calls]);
      toast({
        title: 'Emergency Call Logged',
        description: 'New emergency call has been recorded.',
        variant: 'destructive',
      });
    }
    setShowForm(false);
    setSelectedCall(undefined);
  };

  const handleDispatch = (call: EmergencyCall) => {
    setCalls(
      calls.map((c) =>
        c.id === call.id ? { ...c, status: EmergencyCallStatus.DISPATCHED } : c
      )
    );
    toast({
      title: 'Ambulance Dispatched',
      description: `Ambulance dispatched to ${call.location}`,
    });
  };

  const handleViewDetails = (call: EmergencyCall) => {
    setSelectedCall(call);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Emergency Calls</h1>
          <p className="text-muted-foreground">
            Log and manage emergency calls
          </p>
        </div>
        <Button onClick={handleLogCall} variant="destructive">
          <PhoneIcon className="mr-2 h-4 w-4" />
          Log Emergency Call
        </Button>
      </div>

      <ActiveEmergencyCalls
        calls={calls}
        onDispatch={handleDispatch}
        onViewDetails={handleViewDetails}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCall ? 'Emergency Call Details' : 'Log Emergency Call'}
            </DialogTitle>
          </DialogHeader>
          <EmergencyCallForm
            call={selectedCall}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedCall(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
