import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TransactionType } from '@/types/enums';
import type { InventoryItem, InventoryTransaction as InventoryTransactionType } from '@/types/models';
import { format } from 'date-fns';

const transactionFormSchema = z.object({
  transaction_type: z.enum([
    TransactionType.ADDITION,
    TransactionType.USAGE,
    TransactionType.ADJUSTMENT,
    TransactionType.DISPOSAL,
  ], { message: 'Transaction type is required' }),
  quantity_change: z.number().min(1, 'Quantity must be at least 1'),
  reason: z.string().min(1, 'Reason is required').max(500),
}).transform((data) => ({
  ...data,
  quantity_change: typeof data.quantity_change === 'string' ? Number(data.quantity_change) : data.quantity_change,
}));

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface InventoryTransactionProps {
  item: InventoryItem;
  transactions?: InventoryTransactionType[];
  onSubmit: (data: TransactionFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function InventoryTransaction({
  item,
  transactions = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}: InventoryTransactionProps) {
  const [showHistory, setShowHistory] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transaction_type: undefined,
      quantity_change: 1,
      reason: '',
    },
  });

  const handleSubmit = (data: TransactionFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getTransactionTypeBadge = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ADDITION:
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case TransactionType.USAGE:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case TransactionType.ADJUSTMENT:
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case TransactionType.DISPOSAL:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const transactionType = form.watch('transaction_type');
  const quantityChange = form.watch('quantity_change');

  const calculateNewQuantity = () => {
    if (!transactionType || !quantityChange) return item.quantity;

    if (transactionType === TransactionType.ADDITION) {
      return item.quantity + quantityChange;
    } else if (
      transactionType === TransactionType.USAGE ||
      transactionType === TransactionType.DISPOSAL
    ) {
      return Math.max(0, item.quantity - quantityChange);
    } else {
      // For adjustment, the quantity_change can be positive or negative
      return item.quantity + quantityChange;
    }
  };

  return (
    <div className="space-y-6">
      {/* Item Information */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{item.item_name}</h3>
            <p className="text-sm text-muted-foreground">Code: {item.item_code}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{item.quantity}</p>
            <p className="text-sm text-muted-foreground">{item.unit_of_measure}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Reorder Level: <span className="font-medium text-foreground">{item.reorder_threshold}</span>
          </span>
          {item.location && (
            <span className="text-muted-foreground">
              Location: <span className="font-medium text-foreground">{item.location}</span>
            </span>
          )}
        </div>
      </div>

      {/* Transaction Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Record Transaction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TransactionType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {getTransactionTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity_change"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {transactionType === TransactionType.ADDITION && 'Amount to add'}
                      {(transactionType === TransactionType.USAGE ||
                        transactionType === TransactionType.DISPOSAL) &&
                        'Amount to subtract'}
                      {transactionType === TransactionType.ADJUSTMENT &&
                        'Adjustment amount (+ or -)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the reason for this transaction..."
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity Preview */}
            {transactionType && quantityChange > 0 && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Quantity</p>
                    <p className="text-xl font-bold">{item.quantity}</p>
                  </div>
                  <div className="text-2xl text-muted-foreground">→</div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Quantity</p>
                    <p className="text-xl font-bold">{calculateNewQuantity()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} Transaction History
            </Button>
            <div className="flex gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Transaction'}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Transaction History */}
      {showHistory && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">No transactions recorded yet</p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Quantity After</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">
                        {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTransactionTypeBadge(transaction.transaction_type)}>
                          {getTransactionTypeLabel(transaction.transaction_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            transaction.quantity_change > 0
                              ? 'text-green-500 font-medium'
                              : 'text-red-500 font-medium'
                          }
                        >
                          {transaction.quantity_change > 0 ? '+' : ''}
                          {transaction.quantity_change}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.quantity_after}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {transaction.reason || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
