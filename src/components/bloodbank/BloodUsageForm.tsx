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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Patient, BloodDonation, Staff } from '@/types/models';
import { BloodType } from '@/types/enums';

const usageSchema = z.object({
  donation_id: z.string().min(1, 'Blood unit is required'),
  patient_id: z.string().min(1, 'Patient is required'),
  quantity_ml: z.number().min(1, 'Quantity is required'),
  prescribed_by: z.string().min(1, 'Prescribing doctor is required'),
  administered_by: z.string().min(1, 'Administering staff is required'),
  notes: z.string().optional(),
});

type UsageFormData = z.infer<typeof usageSchema>;

interface BloodUsageFormProps {
  bloodType: BloodType;
  availableDonations: BloodDonation[];
  patients: Patient[];
  staff: Staff[];
  onSubmit: (data: UsageFormData) => void;
  onCancel?: () => void;
}

export function BloodUsageForm({
  bloodType,
  availableDonations,
  patients,
  staff,
  onSubmit,
  onCancel,
}: BloodUsageFormProps) {
  const form = useForm<UsageFormData>({
    resolver: zodResolver(usageSchema),
    defaultValues: {
      donation_id: '',
      patient_id: '',
      quantity_ml: 450,
      prescribed_by: '',
      administered_by: '',
      notes: '',
    },
  });

  const selectedDonationId = form.watch('donation_id');
  const selectedDonation = availableDonations.find((d) => d.id === selectedDonationId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 rounded-md bg-muted">
          <p className="text-sm font-medium">
            Recording usage for blood type: <span className="text-lg">{bloodType}</span>
          </p>
        </div>

        <FormField
          control={form.control}
          name="donation_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Unit</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableDonations.map((donation) => (
                    <SelectItem key={donation.id} value={donation.id}>
                      {donation.quantity_ml}ml - Donated on{' '}
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedDonation && (
          <div className="p-3 rounded-md bg-muted/50 text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Available:</span>{' '}
              {selectedDonation.quantity_ml}ml
            </p>
            <p>
              <span className="text-muted-foreground">Expires:</span>{' '}
              {new Date(selectedDonation.expiry_date).toLocaleDateString()}
            </p>
          </div>
        )}

        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} ({patient.patient_id})
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
          name="quantity_ml"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (ml)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="450"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value}
                  max={selectedDonation?.quantity_ml}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prescribed_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescribed By</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staff
                      .filter((s) => s.role === 'doctor')
                      .map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          Dr. {doctor.first_name} {doctor.last_name}
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
            name="administered_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Administered By</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} ({s.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Record Usage</Button>
        </div>
      </form>
    </Form>
  );
}
