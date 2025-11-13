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
import { AdvancePaymentForm } from '@/components/financial/AdvancePaymentForm';
import { AdvancePayment } from '@/types/models';
import { PaymentMethod } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Mock data
const mockAdvancePayments: AdvancePayment[] = [
  {
    id: '1',
    patient_id: 'p-1',
    amount: 5000,
    payment_date: new Date('2024-03-01'),
    payment_method: PaymentMethod.CASH,
    remaining_balance: 3500,
    received_by: 'staff-1',
    notes: 'Initial deposit for surgery',
  },
  {
    id: '2',
    patient_id: 'p-2',
    amount: 2000,
    payment_date: new Date('2024-03-05'),
    payment_method: PaymentMethod.CARD,
    remaining_balance: 2000,
    received_by: 'staff-2',
    notes: 'Advance for treatment',
  },
  {
    id: '3',
    patient_id: 'p-3',
    amount: 10000,
    payment_date: new Date('2024-03-10'),
    payment_method: PaymentMethod.BANK_TRANSFER,
    remaining_balance: 7500,
    received_by: 'staff-1',
    notes: 'IPD admission advance',
  },
];

export default function AdvancePayments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<AdvancePayment[]>(mockAdvancePayments);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter((payment) =>
    payment.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = (data: any) => {
    const newPayment: AdvancePayment = {
      id: `ap-${Date.now()}`,
      patient_id: 'p-new',
      amount: data.amount,
      payment_date: new Date(),
      payment_method: data.payment_method,
      remaining_balance: data.amount,
      received_by: 'current-user',
      notes: data.notes,
    };
    setPayments([newPayment, ...payments]);
    toast({
      title: 'Success',
      description: 'Advance payment recorded successfully',
    });
    setShowDialog(false);
  };

  const totalAdvances = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalRemaining = payments.reduce((sum, p) => sum + p.remaining_balance, 0);
  const totalUtilized = totalAdvances - totalRemaining;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advance Payments</h1>
          <p className="text-muted-foreground">
            Track and manage patient advance payments and deposits
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Record Advance Payment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Advances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAdvances.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRemaining.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Utilized Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalUtilized.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advance Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient ID..."
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
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No advance payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.patient_id}</TableCell>
                      <TableCell>{format(payment.payment_date, 'PPP')}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.remaining_balance === 0 ? 'secondary' : 'default'
                          }
                        >
                          ${payment.remaining_balance.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {payment.notes || 'N/A'}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Advance Payment</DialogTitle>
          </DialogHeader>
          <AdvancePaymentForm
            onSubmit={handleAddPayment}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
