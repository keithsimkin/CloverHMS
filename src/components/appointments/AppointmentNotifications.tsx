import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Appointment, Patient, Staff } from '@/types/models';
import { AppointmentStatus } from '@/types/enums';

interface AppointmentNotificationsProps {
  appointments: Appointment[];
  patients: Patient[];
  staff: Staff[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function AppointmentNotifications({
  appointments,
  patients,
  staff,
  onAppointmentClick,
}: AppointmentNotificationsProps) {
  // Get upcoming appointments within the next 24 hours
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDateTime = new Date(apt.appointment_date);
      const [hours, minutes] = apt.appointment_time.split(':').map(Number);
      aptDateTime.setHours(hours, minutes, 0, 0);

      return (
        aptDateTime >= now &&
        aptDateTime <= next24Hours &&
        (apt.status === AppointmentStatus.SCHEDULED || apt.status === AppointmentStatus.CONFIRMED)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.appointment_date);
      const [hoursA, minutesA] = a.appointment_time.split(':').map(Number);
      dateA.setHours(hoursA, minutesA, 0, 0);

      const dateB = new Date(b.appointment_date);
      const [hoursB, minutesB] = b.appointment_time.split(':').map(Number);
      dateB.setHours(hoursB, minutesB, 0, 0);

      return dateA.getTime() - dateB.getTime();
    });

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getProviderName = (providerId: string) => {
    const provider = staff.find((s) => s.id === providerId);
    return provider ? `Dr. ${provider.first_name} ${provider.last_name}` : 'Unknown';
  };

  const getTimeUntil = (appointment: Appointment) => {
    const aptDateTime = new Date(appointment.appointment_date);
    const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
    aptDateTime.setHours(hours, minutes, 0, 0);

    const diffMs = aptDateTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `in ${diffHours}h ${diffMinutes}m`;
    } else if (diffMinutes > 0) {
      return `in ${diffMinutes}m`;
    } else {
      return 'now';
    }
  };

  const getUrgencyColor = (appointment: Appointment) => {
    const aptDateTime = new Date(appointment.appointment_date);
    const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
    aptDateTime.setHours(hours, minutes, 0, 0);

    const diffMs = aptDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours <= 1) {
      return 'bg-imperial-red text-white';
    } else if (diffHours <= 3) {
      return 'bg-yellow-600 text-white';
    } else {
      return 'bg-prussian-blue text-mint-cream';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
          {upcomingAppointments.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {upcomingAppointments.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BellIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming appointments in the next 24 hours</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-border rounded-lg p-4 hover:bg-gunmetal/50 transition-colors cursor-pointer"
                  onClick={() => onAppointmentClick?.(appointment)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      {/* Patient Name */}
                      <div className="font-semibold text-mint-cream">
                        {getPatientName(appointment.patient_id)}
                      </div>

                      {/* Provider */}
                      <div className="text-sm text-muted-foreground">
                        with {getProviderName(appointment.provider_id)}
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}{' '}
                            at {appointment.appointment_time}
                          </span>
                        </div>
                        <Badge className={getUrgencyColor(appointment)}>
                          {getTimeUntil(appointment)}
                        </Badge>
                      </div>

                      {/* Appointment Type */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {appointment.appointment_type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            appointment.status === AppointmentStatus.CONFIRMED
                              ? 'border-green-600 text-green-600'
                              : ''
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                      </div>

                      {/* Notes */}
                      {appointment.notes && (
                        <div className="text-sm text-muted-foreground italic">
                          {appointment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
