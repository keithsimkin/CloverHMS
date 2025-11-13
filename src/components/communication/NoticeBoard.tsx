import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Notice } from '@/types/models';
import { NoticeType, NoticePriority, NoticeStatus } from '@/types/enums';
import { format, formatDistanceToNow } from 'date-fns';
import { BellIcon, AlertTriangleIcon, InfoIcon, CalendarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NoticeBoardProps {
  notices: Notice[];
  onViewNotice: (notice: Notice) => void;
}

export function NoticeBoard({ notices, onViewNotice }: NoticeBoardProps) {
  const getNoticeIcon = (type: NoticeType) => {
    switch (type) {
      case NoticeType.ALERT:
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case NoticeType.ANNOUNCEMENT:
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case NoticeType.EVENT:
        return <CalendarIcon className="h-5 w-5 text-green-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadgeVariant = (priority: NoticePriority) => {
    switch (priority) {
      case NoticePriority.URGENT:
        return 'destructive';
      case NoticePriority.HIGH:
        return 'default';
      case NoticePriority.MEDIUM:
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const activeNotices = notices.filter((n) => n.status === NoticeStatus.ACTIVE);
  const expiredNotices = notices.filter((n) => n.status === NoticeStatus.EXPIRED);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notice Board</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeNotices.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredNotices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {activeNotices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active notices
                </p>
              ) : (
                activeNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => onViewNotice(notice)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNoticeIcon(notice.notice_type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">{notice.title}</h3>
                          <Badge variant={getPriorityBadgeVariant(notice.priority)}>
                            {notice.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Posted {formatDistanceToNow(new Date(notice.posted_date), { addSuffix: true })}
                          </span>
                          {notice.expiry_date && (
                            <span>
                              Expires {format(new Date(notice.expiry_date), 'PPP')}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notice.notice_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="expired" className="mt-4">
            <div className="space-y-4">
              {expiredNotices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No expired notices
                </p>
              ) : (
                expiredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border rounded-lg p-4 opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={() => onViewNotice(notice)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNoticeIcon(notice.notice_type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">{notice.title}</h3>
                          <Badge variant="secondary">EXPIRED</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            Posted {format(new Date(notice.posted_date), 'PPP')}
                          </span>
                          {notice.expiry_date && (
                            <span>
                              Expired {format(new Date(notice.expiry_date), 'PPP')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
