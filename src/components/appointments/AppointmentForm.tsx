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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { Appointment, Patient, Staff } from '@/types/models';
import { AppointmentType, AppointmentStatus } from '@/types/enums';
import { useState } from 'react';

const appointmentFormSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  provider_id: z.string().min(1, 'Provider is required'),
  appointment_date: z.date({
    message: 'Appointment date is required',
  }),
  appointment_time: z.string().min(1, 'Appointment time is required').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  duration_minutes: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  appointment_type: z.nativeEnum(AppointmentType),
  status: z.nativeEnum(AppointmentStatus).optional(),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  appointment?: Appointment;
  patients: Patient[];
  staff: Staff[];
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AppointmentForm({
  appointment,
  patients,
  staff,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AppointmentFormProps) {
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [providerSearchOpen, setProviderSearchOpen] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: appointment
      ? {
          patient_id: appointment.patient_id,
          provider_id: appointment.provider_id,
          appointment_date: new Date(appointment.appointment_date),
          appointment_time: appointment.appointment_time,
          duration_minutes: appointment.duration_minutes,
          appointment_type: appointment.appointment_type,
          status: appointment.status,
          notes: appointment.notes || '',
        }
      : {
          patient_id: '',
          provider_id: '',
          appointment_date: new Date(),
          appointment_time: '09:00',
          duration_minutes: 30,
          appointment_type: AppointmentType.CONSULTATION,
          status: AppointmentStatus.SCHEDULED,
          notes: '',
        },
  });

  const getPatientDisplay = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name} (${patient.patient_id})` : '';
  };

  const getProviderDisplay = (providerId: string) => {
    const provider = staff.find((s) => s.id === providerId);
    return provider ? `Dr. ${provider.first_name} ${provider.last_name} - ${provider.specialization || provider.department}` : '';
  };

  // Filter staff to only show doctors and nurses
  const providers = staff.filter((s) => 
    s.role === 'doctor' || s.role === 'nurse'
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Patient *</FormLabel>
              <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? getPatientDisplay(field.value)
                        : 'Select patient'}
                      <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search patient..." />
                    <CommandEmpty>No patient found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.first_name} ${patient.last_name} ${patient.patient_id}`}
                          onSelect={() => {
                            form.setValue('patient_id', patient.id);
                            setPatientSearchOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              patient.id === field.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div>
                            <div className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {patient.patient_id} • {patient.contact_phone}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Search and select the patient for this appointment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Provider Selection */}
        <FormField
          control={form.control}
          name="provider_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Provider (Doctor/Nurse) *</FormLabel>
              <Popover open={providerSearchOpen} onOpenChange={setProviderSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? getProviderDisplay(field.value)
                        : 'Select provider'}
                      <CheckIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search provider..." />
                    <CommandEmpty>No provider found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {providers.map((provider) => (
                        <CommandItem
                          key={provider.id}
                          value={`${provider.first_name} ${provider.last_name} ${provider.specialization}`}
                          onSelect={() => {
                            form.setValue('provider_id', provider.id);
                            setProviderSearchOpen(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              'mr-2 h-4 w-4',
                              provider.id === field.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          <div>
                            <div className="font-medium">
                              Dr. {provider.first_name} {provider.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {provider.specialization || provider.department} • {provider.employee_id}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Search and select the healthcare provider
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Appointment Date */}
          <FormField
            control={form.control}
            name="appointment_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          field.value.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Appointment Time */}
          <FormField
            control={form.control}
            name="appointment_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time *</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes) *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Appointment Type */}
          <FormField
            control={form.control}
            name="appointment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={AppointmentType.CONSULTATION}>
                      Consultation
                    </SelectItem>
                    <SelectItem value={AppointmentType.FOLLOW_UP}>
                      Follow-up
                    </SelectItem>
                    <SelectItem value={AppointmentType.EMERGENCY}>
                      Emergency
                    </SelectItem>
                    <SelectItem value={AppointmentType.PROCEDURE}>
                      Procedure
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status (only show when editing) */}
        {appointment && (
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
                    <SelectItem value={AppointmentStatus.SCHEDULED}>
                      Scheduled
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.CONFIRMED}>
                      Confirmed
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.IN_PROGRESS}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.COMPLETED}>
                      Completed
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.CANCELLED}>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or special instructions..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : appointment ? 'Update Appointment' : 'Create Appointment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
