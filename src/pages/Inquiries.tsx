import { useState } from 'react';
import { InquiryList } from '@/components/quality/InquiryList';
import { InquiryForm } from '@/components/quality/InquiryForm';
import { InquiryDetails } from '@/components/quality/InquiryDetails';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inquiry } from '@/types/models';
import { InquiryStatus } from '@/types/enums';
import { generateMockInquiries } from '@/lib/mockData';
import { generateMockPatients, generateMockStaff } from '@/lib/mockData';
import { PlusCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Inquiries() {
  const mockPatients = generateMockPatients();
  const mockStaff = generateMockStaff();
  const [inquiries, setInquiries] = useState<Inquiry[]>(
    generateMockInquiries(mockPatients, mockStaff)
  );
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreateInquiry = (data: any) => {
    const newInquiry: Inquiry = {
      id: `inquiry-${Date.now()}`,
      patient_id: data.patient_id || undefined,
      inquiry_type: data.inquiry_type,
      subject: data.subject,
      description: data.description,
      department: data.department || undefined,
      submission_date: new Date(),
      status: InquiryStatus.SUBMITTED,
      priority: data.priority,
    };

    setInquiries([newInquiry, ...inquiries]);
    setIsFormOpen(false);
  };

  const handleUpdateInquiry = (data: any) => {
    if (!selectedInquiry) return;

    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === selectedInquiry.id
        ? {
            ...inquiry,
            assigned_to: data.assigned_to,
            status: data.status,
            resolution_notes: data.resolution_notes,
            resolved_date:
              data.status === InquiryStatus.RESOLVED ||
              data.status === InquiryStatus.CLOSED
                ? new Date()
                : inquiry.resolved_date,
            satisfaction_rating: data.satisfaction_rating,
          }
        : inquiry
    );

    setInquiries(updatedInquiries);
    setSelectedInquiry(
      updatedInquiries.find((i) => i.id === selectedInquiry.id) || null
    );
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailsOpen(true);
  };

  const pendingCount = inquiries.filter(
    (i) => i.status === InquiryStatus.SUBMITTED || i.status === InquiryStatus.UNDER_REVIEW
  ).length;

  const resolvedCount = inquiries.filter(
    (i) => i.status === InquiryStatus.RESOLVED || i.status === InquiryStatus.CLOSED
  ).length;

  const avgResolutionTime = inquiries
    .filter((i) => i.resolved_date)
    .reduce((acc, i) => {
      const days =
        (new Date(i.resolved_date!).getTime() -
          new Date(i.submission_date).getTime()) /
        (1000 * 60 * 60 * 24);
      return acc + days;
    }, 0) / resolvedCount || 0;

  const avgSatisfaction =
    inquiries
      .filter((i) => i.satisfaction_rating)
      .reduce((acc, i) => acc + (i.satisfaction_rating || 0), 0) /
      inquiries.filter((i) => i.satisfaction_rating).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Management</h1>
          <p className="text-muted-foreground">
            Manage patient inquiries, feedback, and complaints
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Submit Inquiry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiries.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {avgResolutionTime.toFixed(1)} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgSatisfaction > 0 ? avgSatisfaction.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <InquiryList inquiries={inquiries} onViewInquiry={handleViewInquiry} />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Inquiry</DialogTitle>
          </DialogHeader>
          <InquiryForm
            onSubmit={handleCreateInquiry}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <InquiryDetails
              inquiry={selectedInquiry}
              staffMembers={mockStaff}
              onUpdateInquiry={handleUpdateInquiry}
              onClose={() => setIsDetailsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
