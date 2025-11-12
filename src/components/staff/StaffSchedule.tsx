import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Staff, StaffSchedule as StaffScheduleType } from '@/types/models';
import { ShiftType } from '@/types/enums';

interface StaffScheduleProps {
  staff: Staff;
  schedules: StaffScheduleType[];
}

export function StaffSchedule({ staff, schedules }: StaffScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get array of dates for the current week
  const getWeekDates = () => {
    const weekStart = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  // Navigate to previous week
  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Navigate to current week
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.schedule_date);
      return (
        scheduleDate.getFullYear() === date.getFullYear() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getDate() === date.getDate()
      );
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Format day name
  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Get shift badge color
  const getShiftBadgeColor = (shiftType: ShiftType) => {
    switch (shiftType) {
      case ShiftType.MORNING:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case ShiftType.AFTERNOON:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case ShiftType.NIGHT:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case ShiftType.FULL_DAY:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gunmetal text-mint-cream border-prussian-blue';
    }
  };

  // Format shift type
  const formatShiftType = (shiftType: ShiftType) => {
    return shiftType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get month and year for header
  const getMonthYear = () => {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    if (weekStart.getMonth() === weekEnd.getMonth()) {
      return weekStart.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else {
      return `${weekStart.toLocaleDateString('en-US', {
        month: 'short',
      })} - ${weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              Schedule for {staff.first_name} {staff.last_name}
            </CardTitle>
            <p className="text-sm text-cool-gray mt-1">
              {staff.department} - {staff.employee_id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={previousWeek}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[150px] text-center">
              {getMonthYear()}
            </span>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const daySchedules = getSchedulesForDate(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`rounded-lg border p-3 min-h-[120px] ${
                  isTodayDate
                    ? 'border-prussian-blue bg-prussian-blue/10'
                    : 'border-gunmetal'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-cool-gray font-medium">
                    {formatDayName(date)}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isTodayDate ? 'text-mint-cream' : 'text-mint-cream/80'
                    }`}
                  >
                    {formatDate(date)}
                  </div>
                </div>

                <div className="space-y-2">
                  {daySchedules.length === 0 ? (
                    <div className="text-xs text-cool-gray text-center py-2">
                      No shifts
                    </div>
                  ) : (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="rounded-md border border-prussian-blue bg-gunmetal p-2"
                      >
                        <Badge
                          className={`text-xs mb-1 ${getShiftBadgeColor(
                            schedule.shift_type
                          )}`}
                        >
                          {formatShiftType(schedule.shift_type)}
                        </Badge>
                        <div className="text-xs text-cool-gray">
                          {schedule.start_time} - {schedule.end_time}
                        </div>
                        {schedule.notes && (
                          <div className="text-xs text-cool-gray mt-1 truncate">
                            {schedule.notes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <Badge className={getShiftBadgeColor(ShiftType.MORNING)}>
              {formatShiftType(ShiftType.MORNING)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getShiftBadgeColor(ShiftType.AFTERNOON)}>
              {formatShiftType(ShiftType.AFTERNOON)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getShiftBadgeColor(ShiftType.NIGHT)}>
              {formatShiftType(ShiftType.NIGHT)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getShiftBadgeColor(ShiftType.FULL_DAY)}>
              {formatShiftType(ShiftType.FULL_DAY)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
