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
import { Textarea } from '@/components/ui/textarea';
import { Staff } from '@/types/models';
import { MailPriority } from '@/types/enums';
import { Badge } from '@/components/ui/badge';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const mailSchema = z.object({
  recipient_ids: z.array(z.string()).min(1, 'At least one recipient is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
  priority: z.nativeEnum(MailPriority),
});

type MailFormData = z.infer<typeof mailSchema>;

interface InternalMailFormProps {
  staffList: Staff[];
  onSubmit: (data: MailFormData) => void;
  onCancel: () => void;
}

export function InternalMailForm({ staffList, onSubmit, onCancel }: InternalMailFormProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const form = useForm<MailFormData>({
    resolver: zodResolver(mailSchema),
    defaultValues: {
      recipient_ids: [],
      subject: '',
      body: '',
      priority: MailPriority.NORMAL,
    },
  });

  const addRecipient = (recipientId: string) => {
    if (!selectedRecipients.includes(recipientId)) {
      const newRecipients = [...selectedRecipients, recipientId];
      setSelectedRecipients(newRecipients);
      form.setValue('recipient_ids', newRecipients);
    }
  };

  const removeRecipient = (recipientId: string) => {
    const newRecipients = selectedRecipients.filter((id) => id !== recipientId);
    setSelectedRecipients(newRecipients);
    form.setValue('recipient_ids', newRecipients);
  };

  const getStaffName = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recipient_ids"
          render={() => (
            <FormItem>
              <FormLabel>Recipients</FormLabel>
              <div className="space-y-2">
                <Select onValueChange={addRecipient}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {staffList
                      .filter((staff) => !selectedRecipients.includes(staff.id))
                      .map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.first_name} {staff.last_name} - {staff.role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipients.map((recipientId) => (
                      <Badge key={recipientId} variant="secondary">
                        {getStaffName(recipientId)}
                        <button
                          type="button"
                          onClick={() => removeRecipient(recipientId)}
                          className="ml-2 hover:text-destructive"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Message subject" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={MailPriority.NORMAL}>Normal</SelectItem>
                  <SelectItem value={MailPriority.HIGH}>High</SelectItem>
                  <SelectItem value={MailPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your message..."
                  {...field}
                  rows={8}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Send Message</Button>
        </div>
      </form>
    </Form>
  );
}
