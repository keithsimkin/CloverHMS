import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { AppointmentCalendar } from '@/components/appointments/AppointmentCalendar';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { AppointmentNotifications } from '@/components/appointments/AppointmentNotifications';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  generateMockAppointments,
  generateMockPatients,
  generateMockStaffMembers,
} from '@/lib/mockData';
import type { Appointment, Patient, Staff } from '@/types/models';
import { AppointmentStatus } from '@/types/enums';

export default function Appointments() {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    generateMockAppointments(100)
  );
  const [patients] = useState<Patient[]>(() => generateMockPatients(50));
  const [staff] = useState<Staff[]>(() => generateMockStaffMembers(30));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAppointment = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for double-booking
      const hasConflict = appointments.some((apt) => {
        if (apt.provider_id !== data.provider_id) return false;
        if (apt.status === AppointmentStatus.CANCELLED) return false;

        const aptDate = new Date(apt.appointment_date);
        const newDate = new Date(data.appointment_date);

        if (
          aptDate.getFullYear() !== newDate.getFullYear() ||
          aptDate.getMonth() !== newDate.getMonth() ||
          aptDate.getDate() !== newDate.getDate()
        ) {
          return false;
        }

        // Check time overlap
        const aptTime = apt.appointment_time;
        const newTime = data.appointment_time;

        return aptTime === newTime;
      });

      if (hasConflict) {
        toast({
          title: 'Scheduling Conflict',
          description: 'The selected provider already has an appointment at this time.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const newAppointment: Appointment = {
        id: `appointment-${Date.now()}`,
        patient_id: data.patient_id,
        provider_id: data.provider_id,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        duration_minutes: data.duration_minutes,
        appointment_type: data.appointment_type,
        status: data.status || AppointmentStatus.SCHEDULED,
        notes: data.notes || undefined,
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'current-user-id',
      };

      setAppointments((prev) => [newAppointment, ...prev]);
      setIsCreateDialogOpen(false);

      const patient = patients.find((p) => p.id === data.patient_id);
      const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Patient';

      toast({
        title: 'Appointment created',
        description: `Appointment for ${patientName} has been scheduled successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAppointment = async (data: any) => {
    if (!selectedAppointment) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for double-booking (excluding current appointment)
      const hasConflict = appointments.some((apt) => {
        if (apt.id === selectedAppointment.id) return false;
        if (apt.provider_id !== data.provider_id) return false;
        if (apt.status === AppointmentStatus.CANCELLED) return false;

        const aptDate = new Date(apt.appointment_date);
        const newDate = new Date(data.appointment_date);

        if (
          aptDate.getFullYear() !== newDate.getFullYear() ||
          aptDate.getMonth() !== newDate.getMonth() ||
          aptDate.getDate() !== newDate.getDate()
        ) {
          return false;
        }

        const aptTime = apt.appointment_time;
        const newTime = data.appointment_time;

        return aptTime === newTime;
      });

      if (hasConflict) {
        toast({
          title: 'Scheduling Conflict',
          description: 'The selected provider already has an appointment at this time.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const updatedAppointment: Appointment = {
        ...selectedAppointment,
        patient_id: data.patient_id,
        provider_id: data.provider_id,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        duration_minutes: data.duration_minutes,
        appointment_type: data.appointment_type,
        status: data.status || selectedAppointment.status,
        notes: data.notes || undefined,
        updated_at: new Date(),
      };

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === selectedAppointment.id ? updatedAppointment : apt))
      );
      setIsEditDialogOpen(false);
      setIsRescheduleDialogOpen(false);
      setSelectedAppointment(null);

      toast({
        title: 'Appointment updated',
        description: 'The appointment has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedAppointment: Appointment = {
        ...selectedAppointment,
        status: AppointmentStatus.CANCELLED,
        updated_at: new Date(),
      };

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === selectedAppointment.id ? updatedAppointment : apt))
      );
      setIsCancelDialogOpen(false);
      setSelectedAppointment(null);

      toast({
        title: 'Appointment cancelled',
        description: 'The appointment has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleRescheduleClick = () => {
    setIsEditDialogOpen(false);
    setIsRescheduleDialogOpen(true);
  };

  const handleCancelClick = () => {
    setIsEditDialogOpen(false);
    setIsCancelDialogOpen(true);
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getProviderName = (providerId: string) => {
    const provider = staff.find((s) => s.id === providerId);
    return provider ? `Dr. ${provider.first_name} ${provider.last_name}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage patient appointments
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Tabs for Calendar and List Views */}
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="notifications">Upcoming (24h)</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <AppointmentCalendar
            appointments={appointments}
            patients={patients}
            staff={staff}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <AppointmentNotifications
            appointments={appointments}
            patients={patients}
            staff={staff}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>
      </Tabs>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the appointment details below. The system will check for scheduling conflicts.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            patients={patients}
            staff={staff}
            onSubmit={handleCreateAppointment}
            onCancel={() => setIsCreateDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and update appointment information
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Appointment Summary */}
              <div className="border border-border rounded-lg p-4 space-y-3 bg-gunmetal/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Patient</div>
                    <div className="font-medium">{getPatientName(selectedAppointment.patient_id)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Provider</div>
                    <div className="font-medium">{getProviderName(selectedAppointment.provider_id)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date & Time</div>
                    <div className="font-medium">
                      {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      at {selectedAppointment.appointment_time}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-medium">{selectedAppointment.duration_minutes} minutes</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="font-medium capitalize">{selectedAppointment.appointment_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium capitalize">{selectedAppointment.status}</div>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <div className="text-sm text-muted-foreground">Notes</div>
                    <div className="text-sm">{selectedAppointment.notes}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedAppointment.status !== AppointmentStatus.CANCELLED && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRescheduleClick}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelClick}
                    >
                      Cancel Appointment
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Update the appointment date, time, or other details
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentForm
              appointment={selectedAppointment}
              patients={patients}
              staff={staff}
              onSubmit={handleUpdateAppointment}
              onCancel={() => {
                setIsRescheduleDialogOpen(false);
                setSelectedAppointment(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
              {selectedAppointment && (
                <div className="mt-4 p-3 bg-gunmetal rounded-md">
                  <div className="font-medium">{getPatientName(selectedAppointment.patient_id)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(selectedAppointment.appointment_date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at {selectedAppointment.appointment_time}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-imperial-red hover:bg-rojo"
            >
              Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
