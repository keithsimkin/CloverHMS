/**
 * Tab Notification Demo Component
 * 
 * Demonstrates the tab notification system with interactive examples.
 * This component can be used for testing and showcasing notification features.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTabNotification } from '@/hooks/useTabNotification';
import { useTabStore } from '@/stores/tabStore';
import { TabNotificationType } from '@/types/tab';
import { Bell, BellOff, Info, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

export function TabNotificationDemo() {
  const { setNotification, clearNotification, showNotificationToast, notifyCurrentTab } = useTabNotification();
  const tabs = useTabStore((state) => state.tabs);
  const activeTabId = useTabStore((state) => state.activeTabId);

  const [selectedTabId, setSelectedTabId] = useState<string>('');
  const [notificationType, setNotificationType] = useState<TabNotificationType>('info');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSetNotification = () => {
    if (!selectedTabId || !notificationMessage) {
      return;
    }

    setNotification(
      selectedTabId,
      notificationType,
      notificationMessage,
      notificationTitle || undefined
    );
  };

  const handleClearNotification = () => {
    if (!selectedTabId) {
      return;
    }

    clearNotification(selectedTabId);
  };

  const handleShowToast = () => {
    if (!selectedTabId) {
      return;
    }

    showNotificationToast(selectedTabId);
  };

  const handleQuickNotification = (type: TabNotificationType, message: string, title: string) => {
    if (!selectedTabId) {
      return;
    }

    setNotification(selectedTabId, type, message, title);
  };

  const handleNotifyCurrentTab = () => {
    notifyCurrentTab(
      notificationType,
      notificationMessage || 'This is a notification on the current tab',
      notificationTitle || 'Current Tab Notification'
    );
  };

  const getNotificationIcon = (type: TabNotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-imperial-red" />;
      case 'update':
        return <RefreshCw className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tab Notification System Demo</h1>
        <p className="text-muted-foreground">
          Test and explore the tab notification system with interactive controls.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Custom Notification Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Custom Notification
            </CardTitle>
            <CardDescription>
              Create a custom notification for any tab
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tab-select">Target Tab</Label>
              <Select value={selectedTabId} onValueChange={setSelectedTabId}>
                <SelectTrigger id="tab-select">
                  <SelectValue placeholder="Select a tab" />
                </SelectTrigger>
                <SelectContent>
                  {tabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.title} {tab.id === activeTabId && '(Active)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-select">Notification Type</Label>
              <Select
                value={notificationType}
                onValueChange={(value) => setNotificationType(value as TabNotificationType)}
              >
                <SelectTrigger id="type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon('info')}
                      Info
                    </div>
                  </SelectItem>
                  <SelectItem value="success">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon('success')}
                      Success
                    </div>
                  </SelectItem>
                  <SelectItem value="warning">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon('warning')}
                      Warning
                    </div>
                  </SelectItem>
                  <SelectItem value="error">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon('error')}
                      Error
                    </div>
                  </SelectItem>
                  <SelectItem value="update">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon('update')}
                      Update
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title-input">Title (Optional)</Label>
              <Input
                id="title-input"
                placeholder="Notification title"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-input">Message</Label>
              <Textarea
                id="message-input"
                placeholder="Notification message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSetNotification}
                disabled={!selectedTabId || !notificationMessage}
                className="flex-1"
              >
                <Bell className="w-4 h-4 mr-2" />
                Set Notification
              </Button>
              <Button
                variant="outline"
                onClick={handleClearNotification}
                disabled={!selectedTabId}
              >
                <BellOff className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={handleShowToast}
              disabled={!selectedTabId}
              className="w-full"
            >
              Show Toast for Notification
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Test common notification scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Current Tab Notification</Label>
              <Button
                onClick={handleNotifyCurrentTab}
                variant="outline"
                className="w-full justify-start"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notify Current Tab
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Preset Notifications</Label>
              <div className="space-y-2">
                <Button
                  onClick={() =>
                    handleQuickNotification(
                      'success',
                      'Data saved successfully',
                      'Save Complete'
                    )
                  }
                  disabled={!selectedTabId}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {getNotificationIcon('success')}
                  <span className="ml-2">Success: Data Saved</span>
                </Button>

                <Button
                  onClick={() =>
                    handleQuickNotification(
                      'error',
                      'Failed to connect to server',
                      'Connection Error'
                    )
                  }
                  disabled={!selectedTabId}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {getNotificationIcon('error')}
                  <span className="ml-2">Error: Connection Failed</span>
                </Button>

                <Button
                  onClick={() =>
                    handleQuickNotification(
                      'warning',
                      'Session will expire in 5 minutes',
                      'Session Warning'
                    )
                  }
                  disabled={!selectedTabId}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {getNotificationIcon('warning')}
                  <span className="ml-2">Warning: Session Expiring</span>
                </Button>

                <Button
                  onClick={() =>
                    handleQuickNotification(
                      'update',
                      'New data available, refresh to see changes',
                      'Data Updated'
                    )
                  }
                  disabled={!selectedTabId}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {getNotificationIcon('update')}
                  <span className="ml-2">Update: New Data Available</span>
                </Button>

                <Button
                  onClick={() =>
                    handleQuickNotification(
                      'info',
                      'System maintenance scheduled for tonight',
                      'Maintenance Notice'
                    )
                  }
                  disabled={!selectedTabId}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {getNotificationIcon('info')}
                  <span className="ml-2">Info: Maintenance Notice</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Tab States Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Tab States</CardTitle>
          <CardDescription>
            View notification status for all open tabs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tabs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tabs open</p>
            ) : (
              tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tab.title}</span>
                      {tab.id === activeTabId && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {tab.hasNotification && tab.notification ? (
                      <div className="flex items-center gap-2 text-sm">
                        {getNotificationIcon(tab.notification.type)}
                        <span className="text-muted-foreground">
                          {tab.notification.title || tab.notification.type}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No notification</span>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedTabId(tab.id)}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium mb-1">1. Select a Target Tab</h4>
            <p className="text-muted-foreground">
              Choose which tab should receive the notification. Notifications only appear on inactive tabs.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">2. Choose Notification Type</h4>
            <p className="text-muted-foreground">
              Select the appropriate type: Info (blue), Success (green), Warning (yellow), Error (red), or Update (purple).
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">3. Set Message</h4>
            <p className="text-muted-foreground">
              Enter a clear, concise message. Optionally add a title for more context.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">4. View Notification</h4>
            <p className="text-muted-foreground">
              Switch to a different tab to see the notification indicator. Hover over the tab to see the full message.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">5. Auto-Clear</h4>
            <p className="text-muted-foreground">
              Notifications automatically clear when you switch to that tab.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
