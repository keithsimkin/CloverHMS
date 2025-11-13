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
import { ServicePackage } from '@/types/models';
import { PackageStatus } from '@/types/enums';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';

const packageFormSchema = z.object({
  package_name: z.string().min(1, 'Package name is required'),
  description: z.string().min(1, 'Description is required'),
  package_price: z.coerce.number().min(0, 'Price must be positive'),
  validity_days: z.coerce.number().min(1, 'Validity must be at least 1 day'),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  status: z.nativeEnum(PackageStatus),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

interface PackageFormProps {
  initialData?: ServicePackage;
  onSubmit: (data: Partial<ServicePackage>) => void;
  onCancel: () => void;
}

export function PackageForm({ initialData, onSubmit, onCancel }: PackageFormProps) {
  const [services, setServices] = useState<string[]>(
    initialData?.included_services || []
  );
  const [serviceInput, setServiceInput] = useState('');

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      package_name: initialData?.package_name || '',
      description: initialData?.description || '',
      package_price: initialData?.package_price || 0,
      validity_days: initialData?.validity_days || 30,
      discount_percentage: initialData?.discount_percentage || undefined,
      status: initialData?.status || PackageStatus.ACTIVE,
    },
  });

  const handleAddService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (service: string) => {
    setServices(services.filter((s) => s !== service));
  };

  const handleSubmit = (values: PackageFormValues) => {
    onSubmit({
      ...values,
      included_services: services,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="package_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Basic Health Checkup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what's included in this package..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="package_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="validity_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validity (Days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="discount_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>Optional discount percentage</FormDescription>
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
                    <SelectItem value={PackageStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={PackageStatus.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Included Services</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Enter service name and press Add"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddService();
                }
              }}
            />
            <Button type="button" onClick={handleAddService}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {services.map((service) => (
              <Badge key={service} variant="secondary" className="gap-1">
                {service}
                <button
                  type="button"
                  onClick={() => handleRemoveService(service)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {services.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No services added yet. Add services to include in this package.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Package' : 'Create Package'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
