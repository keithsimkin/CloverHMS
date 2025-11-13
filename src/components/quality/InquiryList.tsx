import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Inquiry } from '@/types/models';
import { InquiryType, InquiryStatus } from '@/types/enums';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InquiryListProps {
  inquiries: Inquiry[];
  onViewInquiry: (inquiry: Inquiry) => void;
}

export function InquiryList({ inquiries, onViewInquiry }: InquiryListProps) {
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingInquiries = filteredInquiries.filter(
    (i) => i.status === InquiryStatus.SUBMITTED || i.status === InquiryStatus.UNDER_REVIEW
  );
  const resolvedInquiries = filteredInquiries.filter(
    (i) => i.status === InquiryStatus.RESOLVED || i.status === InquiryStatus.CLOSED
  );

  const renderInquiryRow = (inquiry: Inquiry) => (
    <TableRow key={inquiry.id} className="cursor-pointer" onClick={() => onViewInquiry(inquiry)}>
      <TableCell>
        <div>
          <p className="font-medium">{inquiry.subject}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(inquiry.submission_date), { addSuffix: true })}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getTypeBadgeVariant(inquiry.inquiry_type)}>
          {inquiry.inquiry_type.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>{inquiry.department || 'General'}</TableCell>
      <TableCell>
        <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'secondary'}>
          {inquiry.priority.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(inquiry.status)}>
          {inquiry.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </TableCell>
    </TableRow>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Inquiries & Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingInquiries.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedInquiries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No pending inquiries
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingInquiries.map(renderInquiryRow)
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No resolved inquiries
                      </TableCell>
                    </TableRow>
                  ) : (
                    resolvedInquiries.map(renderInquiryRow)
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
