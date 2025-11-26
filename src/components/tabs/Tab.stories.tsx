/**
 * Tab Component Visual Examples
 * 
 * This file demonstrates the various states and features of the Tab component.
 * It's not a test file but rather a visual reference for development.
 */

import { Tab } from './Tab';
import type { Tab as TabType } from '@/types/tab';

// Example tab data
const exampleTabs: TabType[] = [
  {
    id: '1',
    path: '/',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    hasUnsavedChanges: false,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  },
  {
    id: '2',
    path: '/patients',
    title: 'Patients',
    icon: 'Users',
    hasUnsavedChanges: true,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  },
  {
    id: '3',
    path: '/appointments',
    title: 'Appointments with a Very Long Title That Should Truncate',
    icon: 'Calendar',
    hasUnsavedChanges: false,
    hasNotification: true,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  },
  {
    id: '4',
    path: '/staff',
    title: 'Staff',
    hasUnsavedChanges: true,
    hasNotification: true,
    scrollPosition: 0,
    createdAt: Date.now(),
    lastAccessedAt: Date.now(),
  },
];

/**
 * Visual demonstration of Tab component states
 * 
 * To use this, import it in a page component temporarily:
 * import { TabExamples } from '@/components/tabs/Tab.stories';
 * 
 * Then render: <TabExamples />
 */
export function TabExamples() {
  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Active Tab</h2>
        <div className="flex gap-2">
          <Tab
            tab={exampleTabs[0]}
            isActive={true}
            onSelect={() => console.log('Selected tab 1')}
            onClose={() => console.log('Closed tab 1')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Inactive Tab</h2>
        <div className="flex gap-2">
          <Tab
            tab={exampleTabs[0]}
            isActive={false}
            onSelect={() => console.log('Selected tab 1')}
            onClose={() => console.log('Closed tab 1')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Tab with Unsaved Changes</h2>
        <div className="flex gap-2">
          <Tab
            tab={exampleTabs[1]}
            isActive={false}
            onSelect={() => console.log('Selected tab 2')}
            onClose={() => console.log('Closed tab 2')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Tab with Notification</h2>
        <div className="flex gap-2">
          <Tab
            tab={exampleTabs[2]}
            isActive={false}
            onSelect={() => console.log('Selected tab 3')}
            onClose={() => console.log('Closed tab 3')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Tab with Both Indicators</h2>
        <div className="flex gap-2">
          <Tab
            tab={exampleTabs[3]}
            isActive={false}
            onSelect={() => console.log('Selected tab 4')}
            onClose={() => console.log('Closed tab 4')}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-heading font-semibold mb-4">Multiple Tabs (Tab Bar Preview)</h2>
        <div className="flex gap-1 bg-gunmetal p-2 rounded-t-lg">
          {exampleTabs.map((tab, index) => (
            <Tab
              key={tab.id}
              tab={tab}
              isActive={index === 0}
              onSelect={() => console.log(`Selected tab ${tab.id}`)}
              onClose={() => console.log(`Closed tab ${tab.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
