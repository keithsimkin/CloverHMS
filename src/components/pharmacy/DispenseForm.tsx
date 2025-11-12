/**
 * Pharmacy Dispense Form Component
 * Handles medication dispensing for prescriptions
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
import { Checkbox } from '@/components/ui/checkbox';
import type { Prescription, Medicine, PharmacyDispense } from '@/types/models';

const dispenseFormSchema = z.object({
  quantity_dispensed: z.number().min(1, 'Quantity must be at least 1').max(1000, 'Quantity cannot exceed 1000'),
  patient_counseling_provided: z.boolean().default(false),
  notes: z.string().optional(),
});

type DispenseFormValues = z.infer<typeof dispenseFormSchema>;

interface DispenseFormProps {
  prescription: Prescription & {
    medicine?: Medicine;
    patient_name?: string;
  };
  onSubmit: (data: Partial<PharmacyDispense>) => void;
  onCancel: () => void;
}

export function DispenseForm({ prescription, onSubmit, onCancel }: DispenseFormProps) {
  const form = useForm({
    resolver: zodResolver(dispenseFormSchema),
    defaultValues: {
      quantity_dispensed: prescription.quantity,
      patient_counseling_provided: false,
      notes: '',
    },
  });

  const handleSubmit = (values: DispenseFormValues) => {
    const dispenseData: Partial<PharmacyDispense> = {
      prescription_id: prescription.id,
      patient_id: prescription.patient_id,
      medicine_id: prescription.medicine_id,
      quantity_dispensed: values.quantity_dispensed,
      patient_counseling_provided: values.patient_counseling_provided,
      notes: values.notes,
      dispensed_at: new Date(),
    };

    onSubmit(dispenseData);
  };

  return (
    <div className="space-y-6">
      {/* Prescription Details */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-lg font-semibold mb-3">Prescription Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Patient:</span>
            <p className="font-medium">{prescription.patient_name || 'Unknown Patient'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Medicine:</span>
            <p className="font-medium">{prescription.medicine?.medicine_name || 'Unknown Medicine'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dosage:</span>
            <p className="font-medium">{prescription.dosage}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Frequency:</span>
            <p className="font-medium">{prescription.frequency}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span>
            <p className="font-medium">{prescription.duration}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Prescribed Quantity:</span>
            <p className="font-medium">{prescription.quantity}</p>
          </div>
          {prescription.special_instructions && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Special Instructions:</span>
              <p className="font-medium">{prescription.special_instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dispense Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="quantity_dispensed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity to Dispense *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum prescribed: {prescription.quantity}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_counseling_provided"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Patient Counseling Provided
                  </FormLabel>
                  <FormDescription>
                    Check this box to confirm that patient counseling has been provided regarding medication usage, side effects, and precautions.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dispensing Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes about the dispensing..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional notes about the dispensing process or patient interaction
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Dispense Medication
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
