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
import { PlusIcon, SearchIcon, TrendingDownIcon } from 'lucide-react';
import { ExpenseForm } from '@/components/financial/ExpenseForm';
import { Expense } from '@/types/models';
import { PaymentMethod } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const mockExpenses: Expense[] = [
  {
    id: '1',
    expense_category: 'Medical Supplies',
    amount: 15000,
    expense_date: new Date('2024-03-01'),
    vendor: 'MedSupply Inc.',
    payment_method: PaymentMethod.BANK_TRANSFER,
    description: 'Monthly medical supplies order',
    approved_by: 'admin-1',
    receipt_number: 'REC-2024-001',
  },
  {
    id: '2',
    expense_category: 'Utilities',
    amount: 3500,
    expense_date: new Date('2024-03-05'),
    vendor: 'City Power Company',
    payment_method: PaymentMethod.BANK_TRANSFER,
    description: 'Electricity bill for March',
    approved_by: 'admin-1',
    receipt_number: 'REC-2024-002',
  },
];

export default function Expenses() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.expense_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = (data: any) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      expense_category: data.expense_category,
      amount: data.amount,
      expense_date: data.expense_date,
      vendor: data.vendor,
      payment_method: data.payment_method,
      description: data.description,
      approved_by: 'current-user',
      receipt_number: data.receipt_number,
    };
    setExpenses([newExpense, ...expenses]);
    toast({
      title: 'Success',
      description: 'Expense recorded successfully',
    });
    setShowDialog(false);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expense Tracking</h1>
          <p className="text-muted-foreground">
            Record and monitor hospital expenses
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Record Expense
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDownIcon className="h-4 w-4 text-destructive" />
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by category or vendor..."
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
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(expense.expense_date, 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.expense_category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{expense.vendor}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>{expense.payment_method}</TableCell>
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
            <DialogTitle>Record Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowDialog(false)} />
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
