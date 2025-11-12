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
import { BloodDonor } from '@/types/models';
import { BloodType } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

const donationSchema = z.object({
  donor_id: z.string().min(1, 'Donor is required'),
  blood_type: z.nativeEnum(BloodType),
  quantity_ml: z.number().min(100, 'Minimum 100ml').max(500, 'Maximum 500ml'),
  donation_date: z.date(),
  expiry_date: z.date(),
  screening_results: z.string().optional(),
  notes: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

interface DonationFormProps {
  donors: BloodDonor[];
  selectedDonor?: BloodDonor;
  onSubmit: (data: DonationFormData) => void;
  onCancel?: () => void;
}

export function DonationForm({
  donors,
  selectedDonor,
  onSubmit,
  onCancel,
}: DonationFormProps) {
  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donor_id: selectedDonor?.id || '',
      blood_type: selectedDonor?.blood_type || BloodType.O_POSITIVE,
      quantity_ml: 450,
      donation_date: new Date(),
      expiry_date: addDays(new Date(), 42), // Blood typically expires in 42 days
      screening_results: '',
      notes: '',
    },
  });

  const selectedDonorId = form.watch('donor_id');
  const donor = donors.find((d) => d.id === selectedDonorId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!selectedDonor && (
          <FormField
            control={form.control}
            name="donor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a donor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {donors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.first_name} {d.last_name} ({d.donor_id}) - {d.blood_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {donor && (
          <div className="p-4 rounded-md bg-muted space-y-2">
            <h4 className="font-medium">Donor Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span> {donor.first_name}{' '}
                {donor.last_name}
              </div>
              <div>
                <span className="text-muted-foreground">Blood Type:</span> {donor.blood_type}
              </div>
              <div>
                <span className="text-muted-foreground">Total Donations:</span>{' '}
                {donor.total_donations}
              </div>
              <div>
                <span className="text-muted-foreground">Last Donation:</span>{' '}
                {donor.last_donation_date
                  ? format(new Date(donor.last_donation_date), 'PP')
                  : 'Never'}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="blood_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(BloodType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="donation_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Donation Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="screening_results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screening Results (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter screening results..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="submit">Record Donation</Button>
        </div>
      </form>
    </Form>
  );
}
