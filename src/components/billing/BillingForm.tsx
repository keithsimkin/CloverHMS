/**
 * Billing Form Component
 * Handles bill generation and payment recording for patient visits
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Patient, PatientFlow, BillingRecord } from '@/types/models';
import { PaymentMethod, PaymentStatus } from '@/types/enums';

const billingFormSchema = z.object({
  consultation_fee: z.number().min(0, 'Consultation fee cannot be negative').optional(),
  medication_cost: z.number().min(0, 'Medication cost cannot be negative').optional(),
  laboratory_cost: z.number().min(0, 'Laboratory cost cannot be negative').optional(),
  procedure_cost: z.number().min(0, 'Procedure cost cannot be negative').optional(),
  payment_status: z.nativeEnum(PaymentStatus),
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  paid_amount: z.number().min(0, 'Paid amount cannot be negative').optional(),
  notes: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingFormSchema>;

interface BillingFormProps {
  patient: Patient;
  flow: PatientFlow;
  visitId: string;
  existingBill?: BillingRecord;
  onSubmit: (data: Omit<BillingRecord, 'id' | 'billing_date' | 'processed_by'>) => void;
  onCancel: () => void;
}

export function BillingForm({ patient, flow, visitId, existingBill, onSubmit, onCancel }: BillingFormProps) {
  const form = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      consultation_fee: existingBill?.consultation_fee || 0,
      medication_cost: existingBill?.medication_cost || 0,
      laboratory_cost: existingBill?.laboratory_cost || 0,
      procedure_cost: existingBill?.procedure_cost || 0,
      payment_status: existingBill?.payment_status || PaymentStatus.PENDING,
      payment_method: existingBill?.payment_method,
      paid_amount: existingBill?.paid_amount || 0,
      notes: '',
    },
  });

  const watchedValues = form.watch();
  
  // Calculate total amount
  const totalAmount = 
    (watchedValues.consultation_fee || 0) +
    (watchedValues.medication_cost || 0) +
    (watchedValues.laboratory_cost || 0) +
    (watchedValues.procedure_cost || 0);

  const paidAmount = watchedValues.paid_amount || 0;
  const remainingBalance = totalAmount - paidAmount;

  const handleSubmit = (values: BillingFormValues) => {
    const billingData: Omit<BillingRecord, 'id' | 'billing_date' | 'processed_by'> = {
      patient_id: patient.id,
      visit_id: visitId,
      flow_id: flow.id,
      consultation_fee: values.consultation_fee,
      medication_cost: values.medication_cost,
      laboratory_cost: values.laboratory_cost,
      procedure_cost: values.procedure_cost,
      total_amount: totalAmount,
      payment_status: values.payment_status,
      payment_method: values.payment_method,
      paid_amount: values.paid_amount,
    };

    onSubmit(billingData);
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{' '}
              <span className="font-medium">
                {patient.first_name} {patient.last_name}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Patient ID:</span>{' '}
              <span className="font-medium">{patient.patient_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contact:</span>{' '}
              <span className="font-medium">{patient.contact_phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Arrival Time:</span>{' '}
              <span className="font-medium">
                {new Date(flow.arrival_time).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Charge Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Charge Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="consultation_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Doctor consultation charges
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medication_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Cost of prescribed medications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="laboratory_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Laboratory Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Cost of laboratory tests and procedures
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="procedure_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedure Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Cost of medical procedures performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Total Amount Display */}
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PaymentStatus.PENDING}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-warning" />
                            Pending - No payment received
                          </span>
                        </SelectItem>
                        <SelectItem value={PaymentStatus.PARTIAL}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-info" />
                            Partial - Partial payment received
                          </span>
                        </SelectItem>
                        <SelectItem value={PaymentStatus.PAID}>
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-success" />
                            Paid - Full payment received
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedValues.payment_status !== PaymentStatus.PENDING && (
                <>
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                            <SelectItem value={PaymentMethod.CARD}>Card (Credit/Debit)</SelectItem>
                            <SelectItem value={PaymentMethod.INSURANCE}>Insurance</SelectItem>
                            <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paid_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Paid *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Amount received from patient
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Summary */}
                  <div className="space-y-2 rounded-lg bg-muted p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-medium">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-medium">${paidAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Remaining Balance:</span>
                      <span className={remainingBalance > 0 ? 'text-warning' : 'text-success'}>
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any additional notes about the billing..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes about payment or billing details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {existingBill ? 'Update Bill' : 'Generate Bill'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
