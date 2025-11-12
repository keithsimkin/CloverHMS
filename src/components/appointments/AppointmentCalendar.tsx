import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Appointment, Patient, Staff } from '@/types/models';
import { AppointmentStatus } from '@/types/enums';

type ViewMode = 'day' | 'week' | 'month';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  patients: Patient[];
  staff: Staff[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

export function AppointmentCalendar({
  appointments,
  patients,
  staff,
  onAppointmentClick,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  // Helper functions
  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown';
  };

  const getProviderName = (providerId: string) => {
    const provider = staff.find((s) => s.id === providerId);
    return provider ? `Dr. ${provider.first_name} ${provider.last_name}` : 'Unknown';
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-prussian-blue text-mint-cream';
      case AppointmentStatus.CONFIRMED:
        return 'bg-blue-600 text-white';
      case AppointmentStatus.IN_PROGRESS:
        return 'bg-yellow-600 text-white';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-600 text-white';
      case AppointmentStatus.CANCELLED:
        return 'bg-imperial-red text-white';
      default:
        return 'bg-gunmetal text-mint-cream';
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get date range based on view mode
  const getDateRange = () => {
    if (viewMode === 'day') {
      return [currentDate];
    } else if (viewMode === 'week') {
      const start = new Date(currentDate);
      const day = start.getDay();
      const diff = start.getDate() - day;
      start.setDate(diff);
      
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
      }
      return dates;
    } else {
      // Month view
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const dates = [];
      // Add days from previous month to fill the first week
      const firstDayOfWeek = firstDay.getDay();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(firstDay);
        date.setDate(date.getDate() - i - 1);
        dates.push(date);
      }
      
      // Add all days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        dates.push(new Date(year, month, i));
      }
      
      // Add days from next month to fill the last week
      const remainingDays = 7 - (dates.length % 7);
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(lastDay);
          date.setDate(lastDay.getDate() + i);
          dates.push(date);
        }
      }
      
      return dates;
    }
  };

  // Filter appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_date);
      return (
        aptDate.getFullYear() === date.getFullYear() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getDate() === date.getDate()
      );
    }).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: viewMode === 'month' ? undefined : 'numeric'
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const dates = getDateRange();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{formatMonthYear(currentDate)}</CardTitle>
          <div className="flex items-center gap-2">
            {/* View Mode Selector */}
            <div className="flex gap-1 border border-border rounded-md p-1">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
              >
                Day
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'day' && (
          <DayView
            date={currentDate}
            appointments={getAppointmentsForDate(currentDate)}
            getPatientName={getPatientName}
            getProviderName={getProviderName}
            getStatusColor={getStatusColor}
            onAppointmentClick={onAppointmentClick}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            dates={dates}
            getAppointmentsForDate={getAppointmentsForDate}
            getPatientName={getPatientName}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
            isToday={isToday}
            onAppointmentClick={onAppointmentClick}
          />
        )}

        {viewMode === 'month' && (
          <MonthView
            dates={dates}
            getAppointmentsForDate={getAppointmentsForDate}
            getStatusColor={getStatusColor}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            onAppointmentClick={onAppointmentClick}
          />
        )}
      </CardContent>
    </Card>
  );
}

// Day View Component
function DayView({
  date,
  appointments,
  getPatientName,
  getProviderName,
  getStatusColor,
  onAppointmentClick,
}: {
  date: Date;
  appointments: Appointment[];
  getPatientName: (id: string) => string;
  getProviderName: (id: string) => string;
  getStatusColor: (status: AppointmentStatus) => string;
  onAppointmentClick?: (appointment: Appointment) => void;
}) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold mb-4">
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      <div className="space-y-1">
        {hours.map((hour) => {
          const hourAppointments = appointments.filter((apt) => {
            const aptHour = parseInt(apt.appointment_time.split(':')[0]);
            return aptHour === hour;
          });

          return (
            <div key={hour} className="flex gap-2 min-h-[60px] border-b border-border">
              <div className="w-20 text-sm text-muted-foreground py-2">
                {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
              <div className="flex-1 py-2 space-y-1">
                {hourAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-2 rounded-md cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(apt.status)}`}
                    onClick={() => onAppointmentClick?.(apt)}
                  >
                    <div className="font-medium text-sm">{apt.appointment_time}</div>
                    <div className="text-sm">{getPatientName(apt.patient_id)}</div>
                    <div className="text-xs opacity-90">{getProviderName(apt.provider_id)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({
  dates,
  getAppointmentsForDate,
  getPatientName,
  getStatusColor,
  formatDate,
  isToday,
  onAppointmentClick,
}: {
  dates: Date[];
  getAppointmentsForDate: (date: Date) => Appointment[];
  getPatientName: (id: string) => string;
  getStatusColor: (status: AppointmentStatus) => string;
  formatDate: (date: Date) => string;
  isToday: (date: Date) => boolean;
  onAppointmentClick?: (appointment: Appointment) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {dates.map((date) => {
        const dayAppointments = getAppointmentsForDate(date);
        const today = isToday(date);

        return (
          <div
            key={date.toISOString()}
            className={`border border-border rounded-md p-2 min-h-[200px] ${
              today ? 'bg-prussian-blue/10 border-prussian-blue' : ''
            }`}
          >
            <div className={`text-sm font-semibold mb-2 ${today ? 'text-prussian-blue' : ''}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
              <div className="text-xs">{formatDate(date)}</div>
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map((apt) => (
                <div
                  key={apt.id}
                  className={`p-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(apt.status)}`}
                  onClick={() => onAppointmentClick?.(apt)}
                >
                  <div className="font-medium">{apt.appointment_time}</div>
                  <div className="truncate">{getPatientName(apt.patient_id)}</div>
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Month View Component
function MonthView({
  dates,
  getAppointmentsForDate,
  getStatusColor,
  isToday,
  isCurrentMonth,
  onAppointmentClick,
}: {
  dates: Date[];
  getAppointmentsForDate: (date: Date) => Appointment[];
  getStatusColor: (status: AppointmentStatus) => string;
  isToday: (date: Date) => boolean;
  isCurrentMonth: (date: Date) => boolean;
  onAppointmentClick?: (appointment: Appointment) => void;
}) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const dayAppointments = getAppointmentsForDate(date);
          const today = isToday(date);
          const currentMonth = isCurrentMonth(date);

          return (
            <div
              key={date.toISOString()}
              className={`border border-border rounded-md p-2 min-h-[100px] ${
                today ? 'bg-prussian-blue/10 border-prussian-blue' : ''
              } ${!currentMonth ? 'opacity-40' : ''}`}
            >
              <div className={`text-sm font-semibold mb-1 ${today ? 'text-prussian-blue' : ''}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 2).map((apt) => (
                  <Badge
                    key={apt.id}
                    className={`w-full justify-start text-xs cursor-pointer hover:opacity-80 ${getStatusColor(apt.status)}`}
                    onClick={() => onAppointmentClick?.(apt)}
                  >
                    {apt.appointment_time}
                  </Badge>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayAppointments.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
