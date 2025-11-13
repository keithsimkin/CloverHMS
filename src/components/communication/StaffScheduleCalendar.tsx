import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StaffSchedule, Staff } from '@/types/models';
import { ShiftType } from '@/types/enums';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface StaffScheduleCalendarProps {
  schedules: StaffSchedule[];
  staffList: Staff[];
  onAddSchedule: () => void;
  onViewSchedule: (schedule: StaffSchedule) => void;
}

export function StaffScheduleCalendar({
  schedules,
  staffList,
  onAddSchedule,
  onViewSchedule,
}: StaffScheduleCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getShiftBadgeVariant = (shiftType: ShiftType) => {
    switch (shiftType) {
      case ShiftType.MORNING:
        return 'default';
      case ShiftType.AFTERNOON:
        return 'secondary';
      case ShiftType.NIGHT:
        return 'outline';
      default:
        return 'default';
    }
  };

  const getSchedulesForDay = (date: Date) => {
    return schedules.filter((schedule) =>
      isSameDay(new Date(schedule.schedule_date), date)
    );
  };

  const getStaffName = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date()));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Staff Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button onClick={onAddSchedule}>Add Schedule</Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button variant="ghost" size="sm" onClick={previousWeek}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(currentWeekStart, 'MMM d')} -{' '}
            {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
          </span>
          <Button variant="ghost" size="sm" onClick={nextWeek}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`border rounded-lg p-3 min-h-[200px] ${
                  isToday ? 'border-primary bg-accent/50' : ''
                }`}
              >
                <div className="text-center mb-3">
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                <div className="space-y-2">
                  {daySchedules.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center">
                      No schedules
                    </p>
                  ) : (
                    daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="text-xs p-2 rounded border cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => onViewSchedule(schedule)}
                      >
                        <div className="font-medium truncate">
                          {getStaffName(schedule.staff_id)}
                        </div>
                        <Badge
                          variant={getShiftBadgeVariant(schedule.shift_type)}
                          className="text-xs mt-1"
                        >
                          {schedule.shift_type}
                        </Badge>
                        <div className="text-muted-foreground mt-1">
                          {schedule.start_time} - {schedule.end_time}
                        </div>
                        {schedule.department && (
                          <div className="text-muted-foreground truncate">
                            {schedule.department}
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
      </CardContent>
    </Card>
  );
}
