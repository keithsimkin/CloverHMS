import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
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
import { PlusIcon, SearchIcon, TrendingUpIcon } from 'lucide-react';
import { IncomeForm } from '@/components/financial/IncomeForm';
import type { Income } from '@/types/models';
import { IncomeSource } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const mockIncome: Income[] = [
  {
    id: '1',
    income_source: IncomeSource.CONSULTATION,
    amount: 25000,
    income_date: new Date('2024-03-01'),
    patient_id: 'p-1',
    description: 'OPD consultations for March week 1',
    recorded_by: 'staff-1',
  },
  {
    id: '2',
    income_source: IncomeSource.PHARMACY,
    amount: 18000,
    income_date: new Date('2024-03-05'),
    description: 'Pharmacy sales',
    recorded_by: 'staff-2',
  },
  {
    id: '3',
    income_source: IncomeSource.LABORATORY,
    amount: 12000,
    income_date: new Date('2024-03-10'),
    description: 'Laboratory test fees',
    recorded_by: 'staff-3',
  },
];

export default function Income() {
  const { toast } = useToast();
  const [incomeRecords, setIncomeRecords] = useState<Income[]>(mockIncome);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncome = incomeRecords.filter((income) =>
    income.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIncome = (data: any) => {
    const newIncome: Income = {
      id: `inc-${Date.now()}`,
      income_source: data.income_source,
      amount: data.amount,
      income_date: data.income_date,
      patient_id: data.patient_id,
      description: data.description,
      recorded_by: 'current-user',
    };
    setIncomeRecords([newIncome, ...incomeRecords]);
    toast({
      title: 'Success',
      description: 'Income recorded successfully',
    });
    setShowDialog(false);
  };

  const totalIncome = incomeRecords.reduce((sum, i) => sum + i.amount, 0);
  const incomeBySource = incomeRecords.reduce((acc, income) => {
    acc[income.income_source] = (acc[income.income_source] || 0) + income.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Income Tracking</h1>
          <p className="text-muted-foreground">
            Record and monitor hospital income and revenue
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Record Income
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incomeRecords.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(incomeBySource).map(([source, amount]) => (
              <div key={source} className="rounded-md border p-4">
                <div className="text-sm font-medium text-muted-foreground">{source}</div>
                <div className="text-xl font-bold">${amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by description..."
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
                  <TableHead>Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Patient ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncome.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No income records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncome.map((income) => (
                    <TableRow key={income.id}>
                      <TableCell>{format(income.income_date, 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{income.income_source}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {income.description}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${income.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {income.patient_id || 'N/A'}
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
            <DialogTitle>Record Income</DialogTitle>
          </DialogHeader>
          <IncomeForm onSubmit={handleAddIncome} onCancel={() => setShowDialog(false)} />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
