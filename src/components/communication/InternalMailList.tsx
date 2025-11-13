import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InternalMail, Staff } from '@/types/models';
import { MailPriority } from '@/types/enums';
import { formatDistanceToNow } from 'date-fns';
import { MailIcon, MailOpenIcon, PaperclipIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InternalMailListProps {
  mails: InternalMail[];
  currentUserId: string;
  staffList: Staff[];
  onViewMail: (mail: InternalMail) => void;
  onCompose: () => void;
}

export function InternalMailList({
  mails,
  currentUserId,
  staffList,
  onViewMail,
  onCompose,
}: InternalMailListProps) {
  const getStaffName = (staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    return staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown';
  };

  const isRead = (mail: InternalMail) => {
    return mail.read_by.includes(currentUserId);
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

  const inbox = mails.filter((m) => m.recipient_ids.includes(currentUserId));
  const sent = mails.filter((m) => m.sender_id === currentUserId);
  const unreadCount = inbox.filter((m) => !isRead(m)).length;

  const renderMailRow = (mail: InternalMail, isSent: boolean) => {
    const read = isRead(mail);
    return (
      <div
        key={mail.id}
        className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-accent ${
          !read && !isSent ? 'bg-accent/50' : ''
        }`}
        onClick={() => onViewMail(mail)}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {read || isSent ? (
              <MailOpenIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <MailIcon className="h-5 w-5 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!read && !isSent ? 'font-semibold' : ''}`}>
                    {isSent ? `To: ${getStaffName(mail.recipient_ids[0])}` : `From: ${getStaffName(mail.sender_id)}`}
                    {mail.recipient_ids.length > 1 && ` +${mail.recipient_ids.length - 1} more`}
                  </span>
                  {mail.priority !== MailPriority.NORMAL && (
                    <Badge variant={getPriorityBadgeVariant(mail.priority)} className="text-xs">
                      {mail.priority}
                    </Badge>
                  )}
                </div>
                <h4 className={`mt-1 ${!read && !isSent ? 'font-semibold' : ''}`}>
                  {mail.subject}
                </h4>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(mail.sent_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {mail.body}
            </p>
            {mail.attachments && mail.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <PaperclipIcon className="h-3 w-3" />
                <span>{mail.attachments.length} attachment(s)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Internal Mail</CardTitle>
          <Button onClick={onCompose}>Compose</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox">
              Inbox ({inbox.length})
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-4">
            <div className="space-y-3">
              {inbox.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages in inbox
                </p>
              ) : (
                inbox.map((mail) => renderMailRow(mail, false))
              )}
            </div>
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            <div className="space-y-3">
              {sent.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No sent messages
                </p>
              ) : (
                sent.map((mail) => renderMailRow(mail, true))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
