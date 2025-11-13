import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NoticeBoard as NoticeBoardComponent } from '@/components/communication/NoticeBoard';
import { NoticeForm } from '@/components/communication/NoticeForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Notice } from '@/types/models';
import { NoticeType, NoticePriority, NoticeStatus, Role } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import { PlusIcon } from 'lucide-react';

// Mock data generator
function generateMockNotices(): Notice[] {
  const notices: Notice[] = [
    {
      id: 'notice-1',
      title: 'Hospital-Wide Staff Meeting',
      content: 'All staff members are required to attend the quarterly meeting on Friday at 2 PM in the main conference room. Topics include new policies, performance reviews, and upcoming initiatives.',
      notice_type: NoticeType.ANNOUNCEMENT,
      priority: NoticePriority.HIGH,
      posted_by: 'admin-1',
      posted_date: new Date('2024-01-15'),
      expiry_date: new Date('2024-01-20'),
      target_roles: undefined,
      status: NoticeStatus.ACTIVE,
    },
    {
      id: 'notice-2',
      title: 'Emergency Protocol Update',
      content: 'Updated emergency response protocols are now in effect. All medical staff must review the new procedures in the staff portal. Training sessions will be held next week.',
      notice_type: NoticeType.ALERT,
      priority: NoticePriority.URGENT,
      posted_by: 'admin-1',
      posted_date: new Date('2024-01-14'),
      expiry_date: new Date('2024-02-14'),
      target_roles: [Role.DOCTOR, Role.NURSE],
      status: NoticeStatus.ACTIVE,
    },
    {
      id: 'notice-3',
      title: 'New Parking Policy',
      content: 'Starting next month, all staff must register their vehicles with security. Parking permits will be issued on a first-come, first-served basis. Please contact the admin office for registration.',
      notice_type: NoticeType.POLICY,
      priority: NoticePriority.MEDIUM,
      posted_by: 'admin-2',
      posted_date: new Date('2024-01-10'),
      expiry_date: new Date('2024-02-01'),
      target_roles: undefined,
      status: NoticeStatus.ACTIVE,
    },
    {
      id: 'notice-4',
      title: 'Annual Health Fair',
      content: 'Join us for the annual health fair on Saturday, January 27th from 9 AM to 4 PM. Free health screenings, wellness workshops, and family activities. All staff and their families are welcome!',
      notice_type: NoticeType.EVENT,
      priority: NoticePriority.LOW,
      posted_by: 'admin-1',
      posted_date: new Date('2024-01-08'),
      expiry_date: new Date('2024-01-27'),
      target_roles: undefined,
      status: NoticeStatus.ACTIVE,
    },
    {
      id: 'notice-5',
      title: 'System Maintenance Scheduled',
      content: 'The hospital management system will undergo scheduled maintenance on Sunday, January 21st from 2 AM to 6 AM. The system will be unavailable during this time. Please plan accordingly.',
      notice_type: NoticeType.ALERT,
      priority: NoticePriority.HIGH,
      posted_by: 'admin-1',
      posted_date: new Date('2024-01-12'),
      expiry_date: new Date('2024-01-21'),
      target_roles: undefined,
      status: NoticeStatus.ACTIVE,
    },
    {
      id: 'notice-6',
      title: 'Holiday Schedule',
      content: 'The hospital will operate with reduced staff during the upcoming holiday period. Please check the staff portal for your assigned shifts and coverage requirements.',
      notice_type: NoticeType.ANNOUNCEMENT,
      priority: NoticePriority.MEDIUM,
      posted_by: 'admin-2',
      posted_date: new Date('2023-12-20'),
      expiry_date: new Date('2024-01-05'),
      target_roles: undefined,
      status: NoticeStatus.EXPIRED,
    },
  ];

  return notices;
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>(generateMockNotices());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  const handleCreateNotice = (data: any) => {
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      title: data.title,
      content: data.content,
      notice_type: data.notice_type,
      priority: data.priority,
      posted_by: 'current-user',
      posted_date: new Date(),
      expiry_date: data.expiry_date,
      target_roles: undefined,
      status: NoticeStatus.ACTIVE,
    };

    setNotices([newNotice, ...notices]);
    setIsCreateDialogOpen(false);
    toast({
      title: 'Notice Posted',
      description: 'The notice has been posted successfully.',
    });
  };

  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsViewDialogOpen(true);
  };

  const handleArchiveNotice = () => {
    if (selectedNotice) {
      setNotices(
        notices.map((n) =>
          n.id === selectedNotice.id ? { ...n, status: NoticeStatus.ARCHIVED } : n
        )
      );
      setIsViewDialogOpen(false);
      toast({
        title: 'Notice Archived',
        description: 'The notice has been archived.',
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notice Board</h1>
          <p className="text-muted-foreground">
            View and manage hospital-wide announcements and notices
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Post Notice
        </Button>
      </div>

      <NoticeBoardComponent notices={notices} onViewNotice={handleViewNotice} />

      {/* Create Notice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Notice</DialogTitle>
          </DialogHeader>
          <NoticeForm
            onSubmit={handleCreateNotice}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Notice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNotice?.title}</DialogTitle>
          </DialogHeader>
          {selectedNotice && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Content</p>
                <p className="whitespace-pre-wrap">{selectedNotice.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedNotice.notice_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Priority</p>
                  <p className="font-medium capitalize">{selectedNotice.priority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Posted Date</p>
                  <p className="font-medium">
                    {new Date(selectedNotice.posted_date).toLocaleDateString()}
                  </p>
                </div>
                {selectedNotice.expiry_date && (
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(selectedNotice.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {selectedNotice.status === NoticeStatus.ACTIVE && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="destructive" onClick={handleArchiveNotice}>
                    Archive Notice
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </MainLayout>
  );
}
