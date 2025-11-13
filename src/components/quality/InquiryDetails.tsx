import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Inquiry, Staff } from '@/types/models';
import { InquiryType, InquiryStatus } from '@/types/enums';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

const resolutionSchema = z.object({
  assigned_to: z.string().min(1, 'Please assign to a staff member'),
  status: z.nativeEnum(InquiryStatus),
  resolution_notes: z.string().optional(),
  satisfaction_rating: z.number().min(1).max(5).optional(),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

interface InquiryDetailsProps {
  inquiry: Inquiry;
  staffMembers: Staff[];
  onUpdateInquiry: (data: ResolutionFormData) => void;
  onClose: () => void;
}

export function InquiryDetails({
  inquiry,
  staffMembers,
  onUpdateInquiry,
  onClose,
}: InquiryDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      assigned_to: inquiry.assigned_to || '',
      status: inquiry.status,
      resolution_notes: inquiry.resolution_notes || '',
      satisfaction_rating: inquiry.satisfaction_rating,
    },
  });

  const getStatusBadgeVariant = (status: InquiryStatus) => {
    switch (status) {
      case InquiryStatus.SUBMITTED:
        return 'secondary';
      case InquiryStatus.UNDER_REVIEW:
        return 'default';
      case InquiryStatus.RESOLVED:
        return 'outline';
      case InquiryStatus.CLOSED:
        return 'outline';
      default:
        return 'default';
    }
  };

  const getTypeBadgeVariant = (type: InquiryType) => {
    switch (type) {
      case InquiryType.COMPLAINT:
        return 'destructive';
      case InquiryType.SUGGESTION:
        return 'default';
      case InquiryType.COMPLIMENT:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleSubmit = (data: ResolutionFormData) => {
    onUpdateInquiry(data);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{inquiry.subject}</CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant={getTypeBadgeVariant(inquiry.inquiry_type)}>
                {inquiry.inquiry_type.toUpperCase()}
              </Badge>
              <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                {inquiry.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'secondary'}>
                {inquiry.priority.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Submission Date</p>
            <p className="font-medium">
              {format(new Date(inquiry.submission_date), 'PPP')}
            </p>
          </div>
          {inquiry.department && (
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{inquiry.department}</p>
            </div>
          )}
          {inquiry.patient_id && (
            <div>
              <p className="text-sm text-muted-foreground">Patient ID</p>
              <p className="font-medium">{inquiry.patient_id}</p>
            </div>
          )}
          {inquiry.resolved_date && (
            <div>
              <p className="text-sm text-muted-foreground">Resolved Date</p>
              <p className="font-medium">
                {format(new Date(inquiry.resolved_date), 'PPP')}
              </p>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">Description</p>
          <p className="whitespace-pre-wrap">{inquiry.description}</p>
        </div>

        {inquiry.resolution_notes && (
          <>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Resolution Notes</p>
              <p className="whitespace-pre-wrap">{inquiry.resolution_notes}</p>
            </div>
          </>
        )}

        {inquiry.satisfaction_rating && (
          <div>
            <p className="text-sm text-muted-foreground">Satisfaction Rating</p>
            <p className="font-medium">{inquiry.satisfaction_rating} / 5</p>
          </div>
        )}

        <Separator />

        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Assigned To</p>
              <p className="font-medium">
                {inquiry.assigned_to
                  ? staffMembers.find((s) => s.id === inquiry.assigned_to)?.first_name +
                    ' ' +
                    staffMembers.find((s) => s.id === inquiry.assigned_to)?.last_name
                  : 'Unassigned'}
              </p>
            </div>
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Update Inquiry Status
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.first_name} {staff.last_name} - {staff.department}
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
                        <SelectItem value={InquiryStatus.SUBMITTED}>Submitted</SelectItem>
                        <SelectItem value={InquiryStatus.UNDER_REVIEW}>
                          Under Review
                        </SelectItem>
                        <SelectItem value={InquiryStatus.RESOLVED}>Resolved</SelectItem>
                        <SelectItem value={InquiryStatus.CLOSED}>Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resolution_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes about the resolution..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
