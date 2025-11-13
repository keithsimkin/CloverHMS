import { useState } from 'react';
import { InternalMailList } from '@/components/communication/InternalMailList';
import { InternalMailForm } from '@/components/communication/InternalMailForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { InternalMail, Staff } from '@/types/models';
import { MailPriority, Role, EmploymentStatus } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

// Mock data generators
function generateMockStaff(): Staff[] {
  return [
    {
      id: 'staff-1',
      employee_id: 'EMP001',
      first_name: 'Dr. John',
      last_name: 'Smith',
      role: Role.DOCTOR,
      department: 'Cardiology',
      specialization: 'Cardiologist',
      contact_phone: '555-0101',
      contact_email: 'john.smith@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2020-01-15'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-2',
      employee_id: 'EMP002',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: Role.NURSE,
      department: 'Emergency',
      contact_phone: '555-0102',
      contact_email: 'sarah.johnson@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2019-03-20'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-3',
      employee_id: 'EMP003',
      first_name: 'Michael',
      last_name: 'Brown',
      role: Role.LAB_TECHNICIAN,
      department: 'Laboratory',
      contact_phone: '555-0103',
      contact_email: 'michael.brown@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2021-06-10'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-4',
      employee_id: 'EMP004',
      first_name: 'Emily',
      last_name: 'Davis',
      role: Role.PHARMACIST,
      department: 'Pharmacy',
      contact_phone: '555-0104',
      contact_email: 'emily.davis@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2020-09-01'),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 'staff-5',
      employee_id: 'EMP005',
      first_name: 'David',
      last_name: 'Wilson',
      role: Role.RECEPTIONIST,
      department: 'Front Desk',
      contact_phone: '555-0105',
      contact_email: 'david.wilson@hospital.com',
      employment_status: EmploymentStatus.ACTIVE,
      hire_date: new Date('2022-01-15'),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];
}

function generateMockMails(currentUserId: string): InternalMail[] {
  const mails: InternalMail[] = [
    {
      id: 'mail-1',
      sender_id: 'staff-1',
      recipient_ids: [currentUserId],
      subject: 'Patient Consultation Follow-up',
      body: 'Please review the consultation notes for patient P00123. The patient requires follow-up tests and I would like your input on the treatment plan.',
      sent_at: new Date('2024-01-15T10:30:00'),
      read_by: [],
      priority: MailPriority.HIGH,
      attachments: ['consultation-notes.pdf'],
    },
    {
      id: 'mail-2',
      sender_id: 'staff-2',
      recipient_ids: [currentUserId, 'staff-3'],
      subject: 'Emergency Department Update',
      body: 'The emergency department is experiencing high patient volume today. Please be prepared for potential overflow patients and ensure all supplies are stocked.',
      sent_at: new Date('2024-01-15T08:15:00'),
      read_by: [currentUserId],
      priority: MailPriority.URGENT,
    },
    {
      id: 'mail-3',
      sender_id: 'staff-4',
      recipient_ids: [currentUserId],
      subject: 'Medication Inventory Alert',
      body: 'Several critical medications are running low in stock. I have placed orders but delivery may take 2-3 days. Please adjust prescriptions accordingly if possible.',
      sent_at: new Date('2024-01-14T16:45:00'),
      read_by: [currentUserId],
      priority: MailPriority.HIGH,
    },
    {
      id: 'mail-4',
      sender_id: currentUserId,
      recipient_ids: ['staff-1', 'staff-2'],
      subject: 'Staff Meeting Reminder',
      body: 'Reminder: Department meeting tomorrow at 2 PM in Conference Room B. Please review the agenda I sent last week and come prepared with your updates.',
      sent_at: new Date('2024-01-14T14:20:00'),
      read_by: ['staff-1'],
      priority: MailPriority.NORMAL,
    },
    {
      id: 'mail-5',
      sender_id: 'staff-5',
      recipient_ids: [currentUserId],
      subject: 'Patient Appointment Confirmation',
      body: 'Patient John Doe has confirmed his appointment for tomorrow at 10 AM. All necessary paperwork has been completed.',
      sent_at: new Date('2024-01-13T11:00:00'),
      read_by: [currentUserId],
      priority: MailPriority.NORMAL,
    },
    {
      id: 'mail-6',
      sender_id: 'staff-3',
      recipient_ids: [currentUserId],
      subject: 'Lab Results Available',
      body: 'Lab results for patient P00145 are now available in the system. Please review at your earliest convenience as some values are outside normal range.',
      sent_at: new Date('2024-01-13T09:30:00'),
      read_by: [],
      priority: MailPriority.HIGH,
    },
  ];

  return mails;
}

export default function InternalMail() {
  const currentUserId = 'current-user';
  const [staffList] = useState<Staff[]>(generateMockStaff());
  const [mails, setMails] = useState<InternalMail[]>(generateMockMails(currentUserId));
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<InternalMail | null>(null);
  const { toast } = useToast();

  const handleCompose = () => {
    setIsComposeDialogOpen(true);
  };

  const handleSendMail = (data: any) => {
    const newMail: InternalMail = {
      id: `mail-${Date.now()}`,
      sender_id: currentUserId,
      recipient_ids: data.recipient_ids,
      subject: data.subject,
      body: data.body,
      sent_at: new Date(),
      read_by: [],
      priority: data.priority,
    };

    setMails([newMail, ...mails]);
    setIsComposeDialogOpen(false);
    toast({
      title: 'Message Sent',
      description: `Your message has been sent to ${data.recipient_ids.length} recipient(s).`,
    });
  };

  const handleViewMail = (mail: InternalMail) => {
    setSelectedMail(mail);
    setIsViewDialogOpen(true);

    // Mark as read
    if (!mail.read_by.includes(currentUserId) && mail.recipient_ids.includes(currentUserId)) {
      setMails(
        mails.map((m) =>
          m.id === mail.id ? { ...m, read_by: [...m.read_by, currentUserId] } : m
        )
      );
    }
  };

  const getStaffName = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  const getPriorityBadgeVariant = (priority: MailPriority) => {
    switch (priority) {
      case MailPriority.URGENT:
        return 'destructive';
      case MailPriority.HIGH:
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Internal Mail</h1>
        <p className="text-muted-foreground">
          Send and receive messages with hospital staff
        </p>
      </div>

      <InternalMailList
        mails={mails}
        currentUserId={currentUserId}
        staffList={staffList}
        onViewMail={handleViewMail}
        onCompose={handleCompose}
      />

      {/* Compose Mail Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
          </DialogHeader>
          <InternalMailForm
            staffList={staffList}
            onSubmit={handleSendMail}
            onCancel={() => setIsComposeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Mail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMail?.subject}</DialogTitle>
          </DialogHeader>
          {selectedMail && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{getStaffName(selectedMail.sender_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMail.recipient_ids.map((recipientId) => (
                      <Badge key={recipientId} variant="secondary">
                        {getStaffName(recipientId)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(selectedMail.sent_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {selectedMail.priority !== MailPriority.NORMAL && (
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityBadgeVariant(selectedMail.priority)}>
                    {selectedMail.priority.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              )}

              <div>
                <p className="whitespace-pre-wrap">{selectedMail.body}</p>
              </div>

              {selectedMail.attachments && selectedMail.attachments.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attachments</p>
                  <div className="space-y-2">
                    {selectedMail.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded hover:bg-accent cursor-pointer"
                      >
                        <span className="text-sm">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  setIsComposeDialogOpen(true);
                }}>
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
