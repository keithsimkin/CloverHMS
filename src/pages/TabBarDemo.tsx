/**
 * TabBar Demo Page
 * 
 * Demonstrates the TabBar component functionality with interactive controls.
 */

import { useEffect } from 'react';
import { TabBar, TabContentArea } from '@/components/tabs';
import { useTabStore } from '@/stores/tabStore';
import { Button } from '@/components/ui/button';

export function TabBarDemo() {
  const { tabs, openTab, closeTab, updateTabMetadata, restoreTabs, clearAllTabs } = useTabStore();

  useEffect(() => {
    // Initialize tabs on mount
    restoreTabs();
  }, [restoreTabs]);

  const handleOpenSampleTabs = () => {
    openTab('/', 'Dashboard', 'Home');
    openTab('/patients', 'Patients', 'Users');
    openTab('/appointments', 'Appointments', 'Calendar');
    openTab('/staff', 'Staff', 'UserCog');
    openTab('/inventory', 'Inventory', 'Package');
  };

  const handleOpenManyTabs = () => {
    const routes = [
      { path: '/', title: 'Dashboard', icon: 'Home' },
      { path: '/patients', title: 'Patients', icon: 'Users' },
      { path: '/appointments', title: 'Appointments', icon: 'Calendar' },
      { path: '/staff', title: 'Staff', icon: 'UserCog' },
      { path: '/inventory', title: 'Inventory', icon: 'Package' },
      { path: '/clinical', title: 'Clinical', icon: 'Stethoscope' },
      { path: '/patient-flow', title: 'Patient Flow', icon: 'GitBranch' },
      { path: '/triage', title: 'Triage', icon: 'AlertCircle' },
      { path: '/laboratory', title: 'Laboratory', icon: 'TestTube' },
      { path: '/pharmacy', title: 'Pharmacy', icon: 'Pill' },
      { path: '/billing', title: 'Billing', icon: 'DollarSign' },
      { path: '/settings', title: 'Settings', icon: 'Settings' },
    ];

    routes.forEach(route => {
      openTab(route.path, route.title, route.icon);
    });
  };

  const handleMarkUnsavedChanges = () => {
    if (tabs.length > 0) {
      tabs.slice(0, 2).forEach(tab => {
        updateTabMetadata(tab.id, { hasUnsavedChanges: true });
      });
    }
  };

  const handleMarkNotifications = () => {
    if (tabs.length > 1) {
      tabs.slice(1, 3).forEach(tab => {
        updateTabMetadata(tab.id, { hasNotification: true });
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* TabBar at the top */}
      <TabBar />

      {/* TabContentArea - renders content for all tabs */}
      <TabContentArea className="flex-1" />

      {/* Demo controls - overlay on top for testing */}
      <div className="absolute top-12 left-0 right-0 bottom-0 overflow-y-auto p-8 space-y-6 pointer-events-none">
        <div className="pointer-events-auto bg-background/95 backdrop-blur-sm border border-border rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">TabBar Component Demo</h1>
          <p className="text-muted-foreground">
            Test the TabBar component with various states and interactions.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-heading font-semibold mb-3">Tab Management</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleOpenSampleTabs}>
                Open Sample Tabs
              </Button>
              <Button onClick={handleOpenManyTabs}>
                Open Many Tabs (12)
              </Button>
              <Button onClick={clearAllTabs} variant="destructive">
                Clear All Tabs
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold mb-3">Tab States</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleMarkUnsavedChanges} variant="outline">
                Mark Unsaved Changes (First 2)
              </Button>
              <Button onClick={handleMarkNotifications} variant="outline">
                Add Notifications (Tab 2-3)
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold mb-3">Current State</h2>
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Total Tabs:</span> {tabs.length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Max Tabs:</span> 15
              </p>
              <p className="text-sm">
                <span className="font-medium">Tabs with Unsaved Changes:</span>{' '}
                {tabs.filter(t => t.hasUnsavedChanges).length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tabs with Notifications:</span>{' '}
                {tabs.filter(t => t.hasNotification).length}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold mb-3">Features to Test</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click tabs to switch between them</li>
              <li>Click the X button to close tabs</li>
              <li>Right-click tabs to open context menu with options: Duplicate Tab, Close Tab, Close Other Tabs, Close Tabs to the Right</li>
              <li>Drag tabs to reorder them</li>
              <li>Use arrow keys to navigate between tabs (when focused)</li>
              <li>Press Delete key to close focused tab</li>
              <li>Press Home/End to jump to first/last tab</li>
              <li>Click the + button to open a new Dashboard tab</li>
              <li>Scroll buttons appear when tabs overflow</li>
              <li>Tab count indicator shows when approaching limit (12+ tabs)</li>
              <li>New tab button is disabled at max limit (15 tabs)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold mb-3">Open Tabs</h2>
            <div className="bg-card border border-border rounded-lg p-4">
              {tabs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tabs open</p>
              ) : (
                <div className="space-y-2">
                  {tabs.map((tab, index) => (
                    <div
                      key={tab.id}
                      className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{tab.title}</span>
                        {tab.hasUnsavedChanges && (
                          <span className="text-orange-500 text-xs">(unsaved)</span>
                        )}
                        {tab.hasNotification && (
                          <span className="text-blue-500 text-xs">(notification)</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => closeTab(tab.id)}
                      >
                        Close
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
