import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
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
import { StaffList } from '@/components/staff/StaffList';
import { StaffForm } from '@/components/staff/StaffForm';
import { StaffSchedule } from '@/components/staff/StaffSchedule';
import { PlusIcon } from '@heroicons/react/24/outline';
import { generateMockStaffSchedules } from '@/lib/mockData';
import { getCachedStaff, mockDataCache } from '@/lib/mockDataCache';
import type { Staff } from '@/types/models';
import { EmploymentStatus } from '@/types/enums';

export default function StaffPage() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>(() => getCachedStaff());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Handle create staff
  const handleCreate = (data: any) => {
    const newStaff: Staff = {
      id: `staff-${Date.now()}`,
      employee_id: data.employee_id,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      department: data.department,
      specialization: data.specialization || undefined,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      employment_status: data.employment_status,
      hire_date: new Date(data.hire_date),
      created_at: new Date(),
      updated_at: new Date(),
    };

    setStaff([...staff, newStaff]);
    setIsCreateDialogOpen(false);

    toast({
      title: 'Staff member created',
      description: `${newStaff.first_name} ${newStaff.last_name} has been added successfully.`,
    });
  };

  // Handle edit staff
  const handleEdit = (member: Staff) => {
    setSelectedStaff(member);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (data: any) => {
    if (!selectedStaff) return;

    const updatedStaff = staff.map((member) =>
      member.id === selectedStaff.id
        ? {
            ...member,
            employee_id: data.employee_id,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            department: data.department,
            specialization: data.specialization || undefined,
            contact_phone: data.contact_phone,
            contact_email: data.contact_email,
            employment_status: data.employment_status,
            hire_date: new Date(data.hire_date),
            updated_at: new Date(),
          }
        : member
    );

    setStaff(updatedStaff);
    setIsEditDialogOpen(false);
    setSelectedStaff(null);

    toast({
      title: 'Staff member updated',
      description: `${data.first_name} ${data.last_name} has been updated successfully.`,
    });
  };

  // Handle deactivate staff
  const handleDelete = (member: Staff) => {
    setSelectedStaff(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeactivate = () => {
    if (!selectedStaff) return;

    const updatedStaff = staff.map((member) =>
      member.id === selectedStaff.id
        ? {
            ...member,
            employment_status: EmploymentStatus.INACTIVE,
            updated_at: new Date(),
          }
        : member
    );

    setStaff(updatedStaff);
    setIsDeleteDialogOpen(false);
    setSelectedStaff(null);

    toast({
      title: 'Staff member deactivated',
      description: `${selectedStaff.first_name} ${selectedStaff.last_name} has been deactivated.`,
      variant: 'destructive',
    });
  };

  // Handle view schedule
  const handleViewSchedule = (member: Staff) => {
    setSelectedStaff(member);
    setIsScheduleDialogOpen(true);
  };

  // Get existing employee IDs for validation
  const existingEmployeeIds = staff
    .filter((member) => member.id !== selectedStaff?.id)
    .map((member) => member.employee_id);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mint-cream">Staff Management</h1>
          <p className="text-cool-gray mt-1">
            Manage hospital staff members, roles, and schedules
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Staff List */}
      <StaffList
        staff={staff}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewSchedule={handleViewSchedule}
      />

      {/* Create Staff Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Enter the details of the new staff member. All fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>
          <StaffForm
            existingEmployeeIds={existingEmployeeIds}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the staff member details. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <StaffForm
              staff={selectedStaff}
              existingEmployeeIds={existingEmployeeIds}
              onSubmit={handleUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedStaff(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Schedule</DialogTitle>
            <DialogDescription>
              View the weekly schedule and shifts for this staff member.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <StaffSchedule
              staff={selectedStaff}
              schedules={generateMockStaffSchedules(selectedStaff.id, 10)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate{' '}
              {selectedStaff?.first_name} {selectedStaff?.last_name}? This will change
              their employment status to inactive. You can reactivate them later by
              editing their profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedStaff(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeactivate}
              className="bg-imperial-red hover:bg-rojo"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </MainLayout>
  );
}
