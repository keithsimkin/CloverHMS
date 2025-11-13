import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { PayrollForm } from '@/components/financial/PayrollForm';
import type { Payroll, Staff } from '@/types/models';
import { PaymentMethod, PayrollStatus, Role, EmploymentStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const mockStaff: Staff[] = [
  {
    id: 's-1',
    employee_id: 'EMP-001',
    first_name: 'John',
    last_name: 'Doe',
    role: Role.DOCTOR,
    department: 'Cardiology',
    contact_phone: '+1-555-0101',
    contact_email: 'john.doe@hospital.com',
    employment_status: EmploymentStatus.ACTIVE,
    hire_date: new Date('2020-01-15'),
    created_at: new Date('2020-01-15'),
    updated_at: new Date('2020-01-15'),
  },
];

const mockPayroll: Payroll[] = [
  {
    id: '1',
    staff_id: 's-1',
    pay_period_start: new Date('2024-03-01'),
    pay_period_end: new Date('2024-03-31'),
    basic_salary: 80000,
    allowances: 10000,
    deductions: 5000,
    bonuses: 5000,
    net_salary: 90000,
    payment_date: new Date('2024-04-01'),
    payment_method: PaymentMethod.BANK_TRANSFER,
    status: PayrollStatus.PAID,
    processed_by: 'admin-1',
  },
];

export default function Payroll() {
  const { toast } = useToast();
  const [payrollRecords, setPayrollRecords] = useState<Payroll[]>(mockPayroll);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayroll = payrollRecords.filter((payroll) => {
    const staff = mockStaff.find((s) => s.id === payroll.staff_id);
    return staff
      ? `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
  });

  const handleProcessPayroll = (data: any) => {
    const netSalary = data.basic_salary + data.allowances + data.bonuses - data.deductions;
    const newPayroll: Payroll = {
      id: `payroll-${Date.now()}`,
      staff_id: data.staff_id,
      pay_period_start: data.pay_period_start,
      pay_period_end: data.pay_period_end,
      basic_salary: data.basic_salary,
      allowances: data.allowances,
      deductions: data.deductions,
      bonuses: data.bonuses,
      net_salary: netSalary,
      payment_date: new Date(),
      payment_method: data.payment_method,
      status: PayrollStatus.PENDING,
      processed_by: 'current-user',
    };
    setPayrollRecords([newPayroll, ...payrollRecords]);
    toast({
      title: 'Success',
      description: 'Payroll processed successfully',
    });
    setShowDialog(false);
  };

  const getStaffName = (staffId: string) => {
    const staff = mockStaff.find((s) => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  const getStatusBadgeVariant = (status: PayrollStatus) => {
    switch (status) {
      case PayrollStatus.PENDING:
        return 'secondary';
      case PayrollStatus.PROCESSED:
        return 'default';
      case PayrollStatus.PAID:
        return 'outline';
      default:
        return 'default';
    }
  };

  const totalPayroll = payrollRecords.reduce((sum, p) => sum + p.net_salary, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">
            Process and manage staff salary payments
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Process Payroll
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPayroll.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by staff name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No payroll records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayroll.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell className="font-medium">
                        {getStaffName(payroll.staff_id)}
                      </TableCell>
                      <TableCell>
                        {format(payroll.pay_period_start, 'MMM dd')} -{' '}
                        {format(payroll.pay_period_end, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>${payroll.basic_salary.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        ${payroll.net_salary.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(payroll.status)}>
                          {payroll.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Payroll</DialogTitle>
          </DialogHeader>
          <PayrollForm
            staffList={mockStaff}
            onSubmit={handleProcessPayroll}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
