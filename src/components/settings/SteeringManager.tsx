/**
 * Steering Rules Manager Component
 * Allows administrators to create, edit, and manage steering rules
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccessToast, showErrorToast, showValidationErrorToast } from '@/lib/toastUtils';
import { SteeringRuleType, Role } from '@/types/enums';
import { SteeringRule } from '@/types/models';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Steering rule form schema
const ruleSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rule_type: z.nativeEnum(SteeringRuleType),
  applies_to: z.enum(['patient', 'appointment', 'inventory', 'clinical']),
  enabled: z.boolean(),
  conditions: z.string().optional(),
  rule_definition: z.string().min(1, 'Rule definition is required'),
});

type RuleFormData = z.infer<typeof ruleSchema>;

// Mock data for steering rules
const mockRules: SteeringRule[] = [
  {
    id: '1',
    name: 'Patient Name Formatting',
    description: 'Ensures patient names are properly capitalized and formatted',
    rule_type: SteeringRuleType.FORMATTING,
    applies_to: 'patient',
    conditions: { role: [Role.RECEPTIONIST, Role.ADMIN] },
    rule_definition: {
      capitalize: true,
      trimWhitespace: true,
      removeSpecialChars: false,
    },
    enabled: true,
    created_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Appointment Time Validation',
    description: 'Validates appointment times are within working hours (8 AM - 6 PM)',
    rule_type: SteeringRuleType.VALIDATION,
    applies_to: 'appointment',
    conditions: {},
    rule_definition: {
      minTime: '08:00',
      maxTime: '18:00',
      allowWeekends: false,
    },
    enabled: true,
    created_at: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Inventory Reorder Policy',
    description: 'Enforces minimum reorder threshold based on item category',
    rule_type: SteeringRuleType.POLICY,
    applies_to: 'inventory',
    conditions: { role: [Role.INVENTORY_MANAGER, Role.ADMIN] },
    rule_definition: {
      medical_supplies: { minThreshold: 20 },
      pharmaceuticals: { minThreshold: 50 },
      equipment: { minThreshold: 5 },
    },
    enabled: true,
    created_at: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'Clinical Notes Validation',
    description: 'Ensures clinical notes meet minimum documentation standards',
    rule_type: SteeringRuleType.VALIDATION,
    applies_to: 'clinical',
    conditions: { role: [Role.DOCTOR, Role.NURSE] },
    rule_definition: {
      minLength: 50,
      requireSections: ['chief_complaint', 'assessment', 'plan'],
    },
    enabled: false,
    created_at: new Date('2024-01-18'),
  },
];

// Documentation templates
const documentationTemplates = {
  validation: `# Validation Rule Template

## Purpose
Define validation rules that ensure data meets specific criteria before being saved.

## Example Configuration
\`\`\`json
{
  "minLength": 10,
  "maxLength": 500,
  "required": true,
  "pattern": "^[A-Za-z0-9 ]+$"
}
\`\`\`

## Common Use Cases
- Validate required fields
- Check data format and patterns
- Enforce business rules
- Prevent invalid data entry`,

  formatting: `# Formatting Rule Template

## Purpose
Define rules that automatically format data to maintain consistency.

## Example Configuration
\`\`\`json
{
  "capitalize": true,
  "trimWhitespace": true,
  "removeSpecialChars": false,
  "dateFormat": "YYYY-MM-DD"
}
\`\`\`

## Common Use Cases
- Standardize name capitalization
- Format phone numbers
- Normalize dates and times
- Clean up whitespace`,

  policy: `# Policy Rule Template

## Purpose
Define organizational policies that guide system behavior and enforce standards.

## Example Configuration
\`\`\`json
{
  "requireApproval": true,
  "approvalRoles": ["admin", "manager"],
  "thresholds": {
    "low": 10,
    "medium": 50,
    "high": 100
  }
}
\`\`\`

## Common Use Cases
- Approval workflows
- Threshold management
- Access control policies
- Compliance requirements`,
};

export function SteeringManager() {
  const [rules, setRules] = useState<SteeringRule[]>(mockRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SteeringRule | null>(null);
  const [showDocumentation, setShowDocumentation] = useState(false);

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      description: '',
      rule_type: SteeringRuleType.VALIDATION,
      applies_to: 'patient',
      enabled: true,
      conditions: '',
      rule_definition: '',
    },
  });

  const handleCreateOrUpdate = async (data: RuleFormData) => {
    try {
      // Parse JSON fields
      let conditions = {};
      let ruleDefinition = {};

      if (data.conditions) {
        try {
          conditions = JSON.parse(data.conditions);
        } catch (e) {
          showValidationErrorToast('Conditions must be valid JSON');
          return;
        }
      }

      try {
        ruleDefinition = JSON.parse(data.rule_definition);
      } catch (e) {
        showValidationErrorToast('Rule definition must be valid JSON');
        return;
      }

      const ruleData: SteeringRule = {
        id: editingRule?.id || `${Date.now()}`,
        name: data.name,
        description: data.description,
        rule_type: data.rule_type,
        applies_to: data.applies_to as 'patient' | 'appointment' | 'inventory' | 'clinical',
        conditions,
        rule_definition: ruleDefinition,
        enabled: data.enabled,
        created_at: editingRule?.created_at || new Date(),
      };

      if (editingRule) {
        setRules(rules.map((r) => (r.id === editingRule.id ? ruleData : r)));
        showSuccessToast('Rule Updated', 'Steering rule has been updated successfully.');
      } else {
        setRules([...rules, ruleData]);
        showSuccessToast('Rule Created', 'New steering rule has been created successfully.');
      }

      setIsDialogOpen(false);
      setEditingRule(null);
      form.reset();
    } catch (error) {
      showErrorToast('Operation Failed', 'Failed to save rule. Please try again.');
    }
  };

  const handleEdit = (rule: SteeringRule) => {
    setEditingRule(rule);
    form.reset({
      name: rule.name,
      description: rule.description,
      rule_type: rule.rule_type,
      applies_to: rule.applies_to,
      enabled: rule.enabled,
      conditions: JSON.stringify(rule.conditions, null, 2),
      rule_definition: JSON.stringify(rule.rule_definition, null, 2),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
    showSuccessToast('Rule Deleted', 'Steering rule has been deleted successfully.');
  };

  const handleToggleEnabled = (ruleId: string, enabled: boolean) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, enabled } : r)));
    showSuccessToast(
      enabled ? 'Rule Enabled' : 'Rule Disabled',
      `Steering rule has been ${enabled ? 'enabled' : 'disabled'}.`
    );
  };

  const getRuleTypeLabel = (ruleType: SteeringRuleType): string => {
    const labels: Record<SteeringRuleType, string> = {
      [SteeringRuleType.VALIDATION]: 'Validation',
      [SteeringRuleType.FORMATTING]: 'Formatting',
      [SteeringRuleType.POLICY]: 'Policy',
    };
    return labels[ruleType];
  };

  const getAppliesToLabel = (appliesTo: string): string => {
    const labels: Record<string, string> = {
      patient: 'Patient',
      appointment: 'Appointment',
      inventory: 'Inventory',
      clinical: 'Clinical',
    };
    return labels[appliesTo] || appliesTo;
  };

  return (
    <div className="space-y-6">
      {/* Rules List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Steering Rules</CardTitle>
              <CardDescription>
                Configure rules that guide system behavior and enforce policies
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDocumentation(!showDocumentation)}
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingRule(null);
                      form.reset();
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRule ? 'Edit Steering Rule' : 'Create Steering Rule'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure a rule that guides system behavior
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(handleCreateOrUpdate)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Rule Name</Label>
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
                        <Label htmlFor="rule_type">Rule Type</Label>
                        <Select
                          value={form.watch('rule_type')}
                          onValueChange={(value) => form.setValue('rule_type', value as SteeringRuleType)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(SteeringRuleType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {getRuleTypeLabel(type)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="applies_to">Applies To</Label>
                        <Select
                          value={form.watch('applies_to')}
                          onValueChange={(value) => form.setValue('applies_to', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="clinical">Clinical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="conditions">Conditions (JSON)</Label>
                      <Textarea
                        id="conditions"
                        {...form.register('conditions')}
                        rows={4}
                        placeholder='{"role": ["admin", "doctor"]}'
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Specify when this rule applies (e.g., specific roles or contexts)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rule_definition">Rule Definition (JSON)</Label>
                      <Textarea
                        id="rule_definition"
                        {...form.register('rule_definition')}
                        rows={8}
                        placeholder='{"key": "value"}'
                        className="font-mono text-sm"
                      />
                      {form.formState.errors.rule_definition && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.rule_definition.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Define the rule logic as valid JSON
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enabled"
                        checked={form.watch('enabled')}
                        onCheckedChange={(checked: boolean) => form.setValue('enabled', checked)}
                      />
                      <Label htmlFor="enabled">Enable this rule</Label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingRule(null);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingRule ? 'Update Rule' : 'Create Rule'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRuleTypeLabel(rule.rule_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getAppliesToLabel(rule.applies_to)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked: boolean) => handleToggleEnabled(rule.id, checked)}
                      />
                      <span className="text-sm">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(rule)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No steering rules configured. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation */}
      {showDocumentation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rule Documentation</CardTitle>
                <CardDescription>
                  Templates and examples for creating custom steering rules
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setShowDocumentation(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="validation">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="validation">Validation</TabsTrigger>
                <TabsTrigger value="formatting">Formatting</TabsTrigger>
                <TabsTrigger value="policy">Policy</TabsTrigger>
              </TabsList>
              <TabsContent value="validation" className="space-y-4">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {documentationTemplates.validation}
                </pre>
              </TabsContent>
              <TabsContent value="formatting" className="space-y-4">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {documentationTemplates.formatting}
                </pre>
              </TabsContent>
              <TabsContent value="policy" className="space-y-4">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                  {documentationTemplates.policy}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
