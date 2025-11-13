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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Ambulance } from '@/types/models';
import { AmbulanceStatus } from '@/types/enums';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

const ambulanceSchema = z.object({
  vehicle_number: z.string().min(1, 'Vehicle number is required'),
  driver_name: z.string().min(1, 'Driver name is required'),
  driver_contact: z.string().min(10, 'Valid contact number is required'),
  status: z.nativeEnum(AmbulanceStatus),
  last_maintenance_date: z.date().optional(),
  next_maintenance_date: z.date().optional(),
});

type AmbulanceFormData = z.infer<typeof ambulanceSchema>;

interface AmbulanceFormProps {
  ambulance?: Ambulance;
  onSubmit: (data: AmbulanceFormData) => void;
  onCancel: () => void;
}

export function AmbulanceForm({ ambulance, onSubmit, onCancel }: AmbulanceFormProps) {
  const form = useForm<AmbulanceFormData>({
    resolver: zodResolver(ambulanceSchema),
    defaultValues: {
      vehicle_number: ambulance?.vehicle_number || '',
      driver_name: ambulance?.driver_name || '',
      driver_contact: ambulance?.driver_contact || '',
      status: ambulance?.status || AmbulanceStatus.AVAILABLE,
      last_maintenance_date: ambulance?.last_maintenance_date
        ? new Date(ambulance.last_maintenance_date)
        : undefined,
      next_maintenance_date: ambulance?.next_maintenance_date
        ? new Date(ambulance.next_maintenance_date)
        : undefined,
    },
  });

  const handleSubmit = (data: AmbulanceFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicle_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Number</FormLabel>
              <FormControl>
                <Input placeholder="AMB-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="driver_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="driver_contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver Contact</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={AmbulanceStatus.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={AmbulanceStatus.ON_CALL}>On Call</SelectItem>
                  <SelectItem value={AmbulanceStatus.UNDER_MAINTENANCE}>Under Maintenance</SelectItem>
                  <SelectItem value={AmbulanceStatus.OUT_OF_SERVICE}>Out of Service</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_maintenance_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Last Maintenance Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
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
          name="next_maintenance_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Maintenance Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal"
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
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

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {ambulance ? 'Update Ambulance' : 'Add Ambulance'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
