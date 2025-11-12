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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InventoryCategory } from '@/types/enums';
import type { InventoryItem } from '@/types/models';

const inventoryItemFormSchema = z.object({
  item_code: z.string().min(1, 'Item code is required').max(50),
  item_name: z.string().min(1, 'Item name is required').max(200),
  category: z.enum([
    InventoryCategory.MEDICAL_SUPPLIES,
    InventoryCategory.EQUIPMENT,
    InventoryCategory.PHARMACEUTICALS,
    InventoryCategory.CONSUMABLES,
  ], { message: 'Category is required' }),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  unit_of_measure: z.string().min(1, 'Unit of measure is required').max(50),
  reorder_threshold: z.number().min(0, 'Reorder threshold must be 0 or greater'),
  unit_cost: z.number().min(0, 'Unit cost must be 0 or greater').optional().or(z.literal('')),
  supplier: z.string().max(200).optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  expiry_date: z.string().optional().or(z.literal('')),
}).transform((data) => ({
  ...data,
  quantity: typeof data.quantity === 'string' ? Number(data.quantity) : data.quantity,
  reorder_threshold: typeof data.reorder_threshold === 'string' ? Number(data.reorder_threshold) : data.reorder_threshold,
  unit_cost: data.unit_cost === '' ? undefined : (typeof data.unit_cost === 'string' ? Number(data.unit_cost) : data.unit_cost),
}));

type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>;

interface InventoryItemFormProps {
  item?: InventoryItem;
  onSubmit: (data: InventoryItemFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function InventoryItemForm({
  item,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: InventoryItemFormProps) {
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: item
      ? {
          item_code: item.item_code,
          item_name: item.item_name,
          category: item.category,
          quantity: item.quantity,
          unit_of_measure: item.unit_of_measure,
          reorder_threshold: item.reorder_threshold,
          unit_cost: item.unit_cost?.toString() || '',
          supplier: item.supplier || '',
          location: item.location || '',
          expiry_date: item.expiry_date
            ? new Date(item.expiry_date).toISOString().split('T')[0]
            : '',
        }
      : {
          item_code: '',
          item_name: '',
          category: undefined,
          quantity: 0,
          unit_of_measure: '',
          reorder_threshold: 0,
          unit_cost: '',
          supplier: '',
          location: '',
          expiry_date: '',
        },
  });

  const handleSubmit = (data: InventoryItemFormValues) => {
    onSubmit(data);
  };

  const getCategoryLabel = (category: InventoryCategory) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="item_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="INV1001" {...field} />
                  </FormControl>
                  <FormDescription>Unique identifier for the item</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="item_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Surgical Gloves" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(InventoryCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {getCategoryLabel(category)}
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
              name="unit_of_measure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit of Measure *</FormLabel>
                  <FormControl>
                    <Input placeholder="box, pack, unit, tablet" {...field} />
                  </FormControl>
                  <FormDescription>e.g., box, pack, unit, tablet</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Quantity Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Quantity Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Quantity *</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reorder_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reorder Threshold *</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="20" {...field} />
                  </FormControl>
                  <FormDescription>Alert when quantity falls below this</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Cost per unit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Storage Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Storage Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Warehouse A-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Input placeholder="MedSupply Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>If applicable</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
