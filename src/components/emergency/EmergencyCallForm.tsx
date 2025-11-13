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
import { EmergencyCall } from '@/types/models';

const emergencyCallSchema = z.object({
  caller_name: z.string().min(1, 'Caller name is required'),
  caller_contact: z.string().min(10, 'Valid contact number is required'),
  patient_name: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  emergency_type: z.string().min(1, 'Emergency type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
});

type EmergencyCallFormData = z.infer<typeof emergencyCallSchema>;

interface EmergencyCallFormProps {
  call?: EmergencyCall;
  onSubmit: (data: EmergencyCallFormData) => void;
  onCancel: () => void;
}

export function EmergencyCallForm({ call, onSubmit, onCancel }: EmergencyCallFormProps) {
  const form = useForm<EmergencyCallFormData>({
    resolver: zodResolver(emergencyCallSchema),
    defaultValues: {
      caller_name: call?.caller_name || '',
      caller_contact: call?.caller_contact || '',
      patient_name: call?.patient_name || '',
      location: call?.location || '',
      emergency_type: call?.emergency_type || '',
      description: call?.description || '',
      priority: call?.priority || 'medium',
    },
  });

  const handleSubmit = (data: EmergencyCallFormData) => {
    onSubmit(data);
  };

  const emergencyTypes = [
    'Cardiac Arrest',
    'Respiratory Distress',
    'Trauma/Accident',
    'Stroke',
    'Severe Bleeding',
    'Burns',
    'Poisoning',
    'Seizure',
    'Allergic Reaction',
    'Other',
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="caller_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caller Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caller_contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caller Contact</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="patient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name (if known)</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormDescription>Optional - if patient identity is known</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main Street, Apartment 4B, City"
                  {...field}
                  rows={2}
                />
              </FormControl>
              <FormDescription>Provide detailed address or landmark</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {emergencyTypes.map((type) => (
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the emergency situation in detail..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Include symptoms, circumstances, and any immediate actions taken
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {call ? 'Update Call' : 'Log Emergency Call'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
