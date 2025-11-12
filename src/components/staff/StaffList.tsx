import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PencilIcon, TrashIcon, CalendarIcon } from '@heroicons/react/24/outline';
import type { Staff } from '@/types/models';
import { Role, EmploymentStatus } from '@/types/enums';

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
  onViewSchedule: (staff: Staff) => void;
}

export function StaffList({ staff, onEdit, onDelete, onViewSchedule }: StaffListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get unique departments from staff
  const departments = Array.from(new Set(staff.map((s) => s.department))).sort();

  // Filter staff based on search and filters
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      searchQuery === '' ||
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.contact_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'all' || member.department === departmentFilter;

    const matchesRole = roleFilter === 'all' || member.role === roleFilter;

    const matchesStatus =
      statusFilter === 'all' || member.employment_status === statusFilter;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  const getStatusBadgeVariant = (status: EmploymentStatus) => {
    switch (status) {
      case EmploymentStatus.ACTIVE:
        return 'default';
      case EmploymentStatus.INACTIVE:
        return 'destructive';
      case EmploymentStatus.ON_LEAVE:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    const colors: Record<Role, string> = {
      [Role.ADMIN]: 'bg-imperial-red text-mint-cream',
      [Role.HOSPITAL_ADMIN]: 'bg-prussian-blue text-mint-cream',
      [Role.DOCTOR]: 'bg-prussian-blue text-mint-cream',
      [Role.NURSE]: 'bg-gunmetal text-mint-cream',
      [Role.RECEPTIONIST]: 'bg-gunmetal text-mint-cream',
      [Role.LAB_TECHNICIAN]: 'bg-gunmetal text-mint-cream',
      [Role.PHARMACIST]: 'bg-gunmetal text-mint-cream',
      [Role.ACCOUNTANT]: 'bg-gunmetal text-mint-cream',
      [Role.INVENTORY_MANAGER]: 'bg-gunmetal text-mint-cream',
      [Role.VIEWER]: 'bg-cool-gray text-rich-black',
    };
    return colors[role] || 'bg-gunmetal text-mint-cream';
  };

  const formatRole = (role: Role) => {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatStatus = (status: EmploymentStatus) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by name, employee ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {Object.values(Role).map((role) => (
                <SelectItem key={role} value={role}>
                  {formatRole(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(EmploymentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-cool-gray">
        Showing {filteredStaff.length} of {staff.length} staff members
      </div>

      {/* Staff Table */}
      <div className="rounded-md border border-prussian-blue">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-cool-gray">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.employee_id}</TableCell>
                  <TableCell>
                    {member.first_name} {member.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {formatRole(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell className="text-cool-gray">
                    {member.specialization || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{member.contact_phone}</div>
                      <div className="text-cool-gray">{member.contact_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.employment_status)}>
                      {formatStatus(member.employment_status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewSchedule(member)}
                        title="View Schedule"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(member)}
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(member)}
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4 text-imperial-red" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
