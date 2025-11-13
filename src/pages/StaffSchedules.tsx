import { useState } from 'react';
import { StaffScheduleCalendar } from '@/components/communication/StaffScheduleCalendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffSchedule, Staff } from '@/types/models';
import { ShiftType, Role, EmploymentStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ClockIcon, UserIcon, BuildingIcon } from 'lucide-react';

// Mock data generators
function generateMockStaff(): Staff[] {
  return [
    {
      id: 'staff-1',
      employee_id: 'EMP001',
      first_name: 'Dr. John',
      last_name: 'Smith',
      role: Role.DOCTOR,
      department: 'Cardiology',
      specialization: 'Cardiologist',
      contact_phone: '555-0101',
      contact_email: 'john.smith@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2020-01-15'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-2',
      employee_id: 'EMP002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: Role.NURSE,
      department: 'Emergency',
      contact_phone: '555-0102',
      contact_email: 'sarah.johnson@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2019-03-20'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-3',
      employee_id: 'EMP003',
      first_name: 'Michael',
      last_name: 'Brown',
      role: Role.LAB_TECHNICIAN,
      department: 'Laboratory',
      contact_phone: '555-0103',
      contact_email: 'michael.brown@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2021-06-10'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-4',
      employee_id: 'EMP004',
      first_name: 'Emily',
      last_name: 'Davis',
      role: Role.PHARMACIST,
      department: 'Pharmacy',
      contact_phone: '555-0104',
      contact_email: 'emily.davis@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2020-09-01'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-5',
      employee_id: 'EMP005',
      first_name: 'David',
      last_name: 'Wilson',
      role: Role.NURSE,
      department: 'ICU',
      contact_phone: '555-0105',
      contact_email: 'david.wilson@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2022-01-15'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-6',
      employee_id: 'EMP006',
      first_name: 'Lisa',
      last_name: 'Anderson',
      role: Role.DOCTOR,
      department: 'Pediatrics',
      specialization: 'Pediatrician',
      contact_phone: '555-0106',
      contact_email: 'lisa.anderson@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2018-05-20'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
}

function generateMockSchedules(): StaffSchedule[] {
  const today = new Date();
  const schedules: StaffSchedule[] = [];
  const staffIds = ['staff-1', 'staff-2', 'staff-3', 'staff-4', 'staff-5', 'staff-6'];
  const departments = ['Cardiology', 'Emergency', 'Laboratory', 'Pharmacy', 'ICU', 'Pediatrics'];
  const shifts = [
    { type: ShiftType.MORNING, start: '07:00', end: '15:00' },
    { type: ShiftType.AFTERNOON, start: '15:00', end: '23:00' },
    { type: ShiftType.NIGHT, start: '23:00', end: '07:00' },
  ];

  // Generate schedules for the next 14 days
  for (let day = -3; day < 11; day++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + day);

    // Each staff member gets 2-3 shifts per week
    staffIds.forEach((staffId, index) => {
      if (day % 3 === index % 3) {
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        schedules.push({
          id: `schedule-${day}-${staffId}`,
          staff_id: staffId,
          schedule_date: scheduleDate,
          shift_type: shift.type,
          start_time: shift.start,
          end_time: shift.end,
          department: departments[index],
          notes: Math.random() > 0.7 ? 'On-call available' : undefined,
          created_by: 'admin-1',
        });
      }
    });
  }

  return schedules;
}

export default function StaffSchedules() {
  const [staffList] = useState<Staff[]>(generateMockStaff());
  const [schedules] = useState<StaffSchedule[]>(generateMockSchedules());
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<StaffSchedule | null>(null);
  const { toast } = useToast();

  const handleAddSchedule = () => {
    toast({
      title: 'Add Schedule',
      description: 'Schedule creation form would open here.',
    });
  };

  const handleViewSchedule = (schedule: StaffSchedule) => {
    setSelectedSchedule(schedule);
    setIsViewDialogOpen(true);
  };

  const getStaffDetails = (staffId: string) => {
    return staffList.find((s) => s.id === staffId);
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff Schedules</h1>
        <p className="text-muted-foreground">
          View staff shifts and availability across departments
        </p>
      </div>

      <StaffScheduleCalendar
        schedules={schedules}
        staffList={staffList}
        onAddSchedule={handleAddSchedule}
        onViewSchedule={handleViewSchedule}
      />

      {/* View Schedule Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <UserIcon className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-semibold">
                    {(() => {
                      const staff = getStaffDetails(selectedSchedule.staff_id);
                      return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
                    })()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const staff = getStaffDetails(selectedSchedule.staff_id);
                      return staff ? `${staff.role} - ${staff.employee_id}` : '';
                    })()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">
                    {format(new Date(selectedSchedule.schedule_date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Shift Type</p>
                  <Badge variant={getShiftBadgeVariant(selectedSchedule.shift_type)}>
                    {selectedSchedule.shift_type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Shift Hours</p>
                  <p className="font-medium">
                    {selectedSchedule.start_time} - {selectedSchedule.end_time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedSchedule.department}</p>
                </div>
              </div>

              {selectedSchedule.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm p-3 bg-accent rounded-lg">{selectedSchedule.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Edit Schedule',
                      description: 'Schedule editing form would open here.',
                    });
                  }}
                >
                  Edit Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
