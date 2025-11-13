/**
 * Agent Hooks Manager Component
 * Allows administrators to create, edit, and manage agent hooks
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { showSuccessToast, showErrorToast, showValidationErrorToast } from '@/lib/toastUtils';
import { HookEventType, HookActionType } from '@/types/enums';
import { AgentHook, HookExecution } from '@/types/models';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Hook form schema
const hookSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  event_type: z.nativeEnum(HookEventType),
  action_type: z.nativeEnum(HookActionType),
  enabled: z.boolean(),
  configuration: z.string().optional(),
});

type HookFormData = z.infer<typeof hookSchema>;

// Mock data for hooks
const mockHooks: AgentHook[] = [
  {
    id: '1',
    name: 'Patient Data Validation',
    description: 'Validates patient data completeness when a new patient is created',
    event_type: HookEventType.PATIENT_CREATED,
    action_type: HookActionType.VALIDATE,
    enabled: true,
    configuration: { requiredFields: ['first_name', 'last_name', 'date_of_birth', 'contact_phone'] },
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Appointment Conflict Check',
    description: 'Checks for scheduling conflicts when appointments are created',
    event_type: HookEventType.APPOINTMENT_CREATED,
    action_type: HookActionType.VALIDATE,
    enabled: true,
    configuration: { checkOverlap: true, bufferMinutes: 15 },
    created_at: new Date('2024-01-16'),
    updated_at: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Low Stock Alert',
    description: 'Sends notification when inventory falls below reorder threshold',
    event_type: HookEventType.INVENTORY_LOW_STOCK,
    action_type: HookActionType.NOTIFY,
    enabled: true,
    configuration: { notifyRoles: ['inventory_manager', 'admin'] },
    created_at: new Date('2024-01-17'),
    updated_at: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'Purchase Order Recommendation',
    description: 'Generates purchase order recommendations for low stock items',
    event_type: HookEventType.INVENTORY_LOW_STOCK,
    action_type: HookActionType.GENERATE_RECOMMENDATION,
    enabled: false,
    configuration: { autoGenerate: false, includeSupplierInfo: true },
    created_at: new Date('2024-01-18'),
    updated_at: new Date('2024-01-18'),
  },
];

// Mock execution history
const mockExecutions: HookExecution[] = [
  {
    id: '1',
    hook_id: '1',
    triggered_at: new Date('2024-01-20T10:30:00'),
    event_data: { patient_id: 'P001', action: 'created' },
    result: 'success',
    output: { valid: true, message: 'All required fields present' },
  },
  {
    id: '2',
    hook_id: '2',
    triggered_at: new Date('2024-01-20T11:15:00'),
    event_data: { appointment_id: 'A001', provider_id: 'D001' },
    result: 'success',
    output: { conflicts: false },
  },
  {
    id: '3',
    hook_id: '3',
    triggered_at: new Date('2024-01-20T14:00:00'),
    event_data: { item_id: 'I001', quantity: 5, threshold: 10 },
    result: 'success',
    output: { notified: ['inventory_manager', 'admin'] },
  },
  {
    id: '4',
    hook_id: '1',
    triggered_at: new Date('2024-01-20T15:45:00'),
    event_data: { patient_id: 'P002', action: 'created' },
    result: 'failure',
    error_message: 'Missing required field: contact_phone',
  },
];

export function HooksManager() {
  const [hooks, setHooks] = useState<AgentHook[]>(mockHooks);
  const [executions] = useState<HookExecution[]>(mockExecutions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHook, setEditingHook] = useState<AgentHook | null>(null);
  const [selectedHookId, setSelectedHookId] = useState<string | null>(null);

  const form = useForm<HookFormData>({
    resolver: zodResolver(hookSchema),
    defaultValues: {
      name: '',
      description: '',
      event_type: HookEventType.PATIENT_CREATED,
      action_type: HookActionType.VALIDATE,
      enabled: true,
      configuration: '',
    },
  });

  const handleCreateOrUpdate = async (data: HookFormData) => {
    try {
      // Parse configuration JSON if provided
      let config = {};
      if (data.configuration) {
        try {
          config = JSON.parse(data.configuration);
        } catch (e) {
          showValidationErrorToast('Configuration must be valid JSON');
          return;
        }
      }

      const hookData: AgentHook = {
        id: editingHook?.id || `${Date.now()}`,
        name: data.name,
        description: data.description,
        event_type: data.event_type,
        action_type: data.action_type,
        enabled: data.enabled,
        configuration: config,
        created_at: editingHook?.created_at || new Date(),
        updated_at: new Date(),
      };

      if (editingHook) {
        setHooks(hooks.map((h) => (h.id === editingHook.id ? hookData : h)));
        showSuccessToast('Hook Updated', 'Agent hook has been updated successfully.');
      } else {
        setHooks([...hooks, hookData]);
        showSuccessToast('Hook Created', 'New agent hook has been created successfully.');
      }

      setIsDialogOpen(false);
      setEditingHook(null);
      form.reset();
    } catch (error) {
      showErrorToast('Operation Failed', 'Failed to save hook. Please try again.');
    }
  };

  const handleEdit = (hook: AgentHook) => {
    setEditingHook(hook);
    form.reset({
      name: hook.name,
      description: hook.description,
      event_type: hook.event_type,
      action_type: hook.action_type,
      enabled: hook.enabled,
      configuration: JSON.stringify(hook.configuration, null, 2),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (hookId: string) => {
    setHooks(hooks.filter((h) => h.id !== hookId));
    showSuccessToast('Hook Deleted', 'Agent hook has been deleted successfully.');
  };

  const handleToggleEnabled = (hookId: string, enabled: boolean) => {
    setHooks(hooks.map((h) => (h.id === hookId ? { ...h, enabled } : h)));
    showSuccessToast(
      enabled ? 'Hook Enabled' : 'Hook Disabled',
      `Agent hook has been ${enabled ? 'enabled' : 'disabled'}.`
    );
  };

  const getEventTypeLabel = (eventType: HookEventType): string => {
    const labels: Record<HookEventType, string> = {
      [HookEventType.PATIENT_CREATED]: 'Patient Created',
      [HookEventType.PATIENT_UPDATED]: 'Patient Updated',
      [HookEventType.APPOINTMENT_CREATED]: 'Appointment Created',
      [HookEventType.INVENTORY_LOW_STOCK]: 'Inventory Low Stock',
    };
    return labels[eventType];
  };

  const getActionTypeLabel = (actionType: HookActionType): string => {
    const labels: Record<HookActionType, string> = {
      [HookActionType.VALIDATE]: 'Validate',
      [HookActionType.NOTIFY]: 'Notify',
      [HookActionType.GENERATE_RECOMMENDATION]: 'Generate Recommendation',
    };
    return labels[actionType];
  };

  const selectedHookExecutions = selectedHookId
    ? executions.filter((e) => e.hook_id === selectedHookId)
    : [];

  return (
    <div className="space-y-6">
      {/* Hooks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agent Hooks</CardTitle>
              <CardDescription>
                Configure automated workflows that execute when specific events occur
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingHook(null);
                    form.reset();
                  }}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Hook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingHook ? 'Edit Agent Hook' : 'Create Agent Hook'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure an automated workflow that triggers on specific events
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleCreateOrUpdate)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Hook Name</Label>
                    <Input id="name" {...form.register('name')} />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...form.register('description')} rows={3} />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select
                        value={form.watch('event_type')}
                        onValueChange={(value) => form.setValue('event_type', value as HookEventType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(HookEventType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getEventTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="action_type">Action Type</Label>
                      <Select
                        value={form.watch('action_type')}
                        onValueChange={(value) => form.setValue('action_type', value as HookActionType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(HookActionType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getActionTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="configuration">Configuration (JSON)</Label>
                    <Textarea
                      id="configuration"
                      {...form.register('configuration')}
                      rows={6}
                      placeholder='{"key": "value"}'
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Provide configuration as valid JSON
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={form.watch('enabled')}
                      onCheckedChange={(checked: boolean) => form.setValue('enabled', checked)}
                    />
                    <Label htmlFor="enabled">Enable this hook</Label>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingHook(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingHook ? 'Update Hook' : 'Create Hook'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hooks.map((hook) => (
                <TableRow key={hook.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{hook.name}</p>
                      <p className="text-sm text-muted-foreground">{hook.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getEventTypeLabel(hook.event_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getActionTypeLabel(hook.action_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={hook.enabled}
                        onCheckedChange={(checked: boolean) => handleToggleEnabled(hook.id, checked)}
                      />
                      <span className="text-sm">
                        {hook.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedHookId(hook.id)}
                      >
                        View History
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(hook)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hook.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {hooks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No agent hooks configured. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      {selectedHookId && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>
                  Recent executions for {hooks.find((h) => h.id === selectedHookId)?.name}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedHookId(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Triggered At</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedHookExecutions.map((execution) => (
                  <TableRow key={execution.id}>
                    <TableCell>
                      {execution.triggered_at.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={execution.result === 'success' ? 'default' : 'destructive'}
                      >
                        {execution.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {execution.result === 'success' ? (
                        <pre className="text-xs">
                          {JSON.stringify(execution.output, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-sm text-destructive">
                          {execution.error_message}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {selectedHookExecutions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No execution history available for this hook.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
