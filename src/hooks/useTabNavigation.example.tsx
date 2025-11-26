/**
 * Example usage of useTabNavigation hook
 * 
 * This file demonstrates how to use the useTabNavigation hook
 * in various scenarios within the application.
 */

import { useTabNavigation } from './useTabNavigation';
import { Button } from '@/components/ui/button';

/**
 * Example 1: Basic navigation with tab creation
 */
export function NavigationExample() {
  const { navigateToTab } = useTabNavigation();

  return (
    <div className="space-y-2">
      <h3>Basic Navigation</h3>
      <Button onClick={() => navigateToTab('/patients')}>
        Go to Patients (creates tab or switches to existing)
      </Button>
      <Button onClick={() => navigateToTab('/appointments')}>
        Go to Appointments
      </Button>
    </div>
  );
}

/**
 * Example 2: Force open in new tab
 */
export function NewTabExample() {
  const { openInNewTab } = useTabNavigation();

  return (
    <div className="space-y-2">
      <h3>Open in New Tab</h3>
      <Button onClick={() => openInNewTab('/patients')}>
        Open Patients in New Tab (always creates new)
      </Button>
      <Button onClick={() => openInNewTab('/appointments', 'My Appointments')}>
        Open Appointments with Custom Title
      </Button>
    </div>
  );
}

/**
 * Example 3: Navigate within current tab
 */
export function InTabNavigationExample() {
  const { navigateInCurrentTab } = useTabNavigation();

  return (
    <div className="space-y-2">
      <h3>Navigate in Current Tab</h3>
      <Button onClick={() => navigateInCurrentTab('/patients')}>
        Navigate to Patients (same tab)
      </Button>
      <Button onClick={() => navigateInCurrentTab('/settings')}>
        Navigate to Settings (same tab)
      </Button>
    </div>
  );
}

/**
 * Example 4: Get current tab information
 */
export function CurrentTabExample() {
  const { getCurrentTab } = useTabNavigation();

  const handleShowCurrentTab = () => {
    const currentTab = getCurrentTab();
    if (currentTab) {
      console.log('Current Tab:', {
        id: currentTab.id,
        path: currentTab.path,
        title: currentTab.title,
        hasUnsavedChanges: currentTab.hasUnsavedChanges,
      });
      alert(`Current tab: ${currentTab.title} (${currentTab.path})`);
    } else {
      alert('No active tab');
    }
  };

  return (
    <div className="space-y-2">
      <h3>Current Tab Info</h3>
      <Button onClick={handleShowCurrentTab}>
        Show Current Tab Info
      </Button>
    </div>
  );
}

/**
 * Example 5: Sidebar link with Ctrl+Click support
 */
export function SidebarLinkExample() {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleClick = (e: React.MouseEvent, path: string) => {
    // Check for Ctrl+Click or Cmd+Click (Mac)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      openInNewTab(path);
    } else {
      navigateToTab(path);
    }
  };

  const handleMiddleClick = (e: React.MouseEvent, path: string) => {
    // Middle mouse button
    if (e.button === 1) {
      e.preventDefault();
      openInNewTab(path);
    }
  };

  return (
    <div className="space-y-2">
      <h3>Smart Navigation Links</h3>
      <button
        onClick={(e) => handleClick(e, '/patients')}
        onAuxClick={(e) => handleMiddleClick(e, '/patients')}
        className="text-blue-500 hover:underline"
      >
        Patients (Ctrl+Click or Middle-Click for new tab)
      </button>
      <button
        onClick={(e) => handleClick(e, '/appointments')}
        onAuxClick={(e) => handleMiddleClick(e, '/appointments')}
        className="text-blue-500 hover:underline"
      >
        Appointments (Ctrl+Click or Middle-Click for new tab)
      </button>
    </div>
  );
}

/**
 * Example 6: Context menu with "Open in New Tab"
 */
export function ContextMenuExample() {
  const { navigateToTab, openInNewTab } = useTabNavigation();

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    
    // In a real implementation, you would show a context menu
    // For this example, we'll just use confirm
    const openNew = window.confirm('Open in new tab?');
    
    if (openNew) {
      openInNewTab(path);
    } else {
      navigateToTab(path);
    }
  };

  return (
    <div className="space-y-2">
      <h3>Context Menu Navigation</h3>
      <button
        onContextMenu={(e) => handleContextMenu(e, '/patients')}
        className="text-blue-500 hover:underline"
      >
        Right-click for options
      </button>
    </div>
  );
}

/**
 * Example 7: Conditional navigation based on current tab
 */
export function ConditionalNavigationExample() {
  const { getCurrentTab, navigateInCurrentTab, openInNewTab } = useTabNavigation();

  const handleSmartNavigation = (path: string) => {
    const currentTab = getCurrentTab();
    
    if (!currentTab) {
      // No active tab, create one
      openInNewTab(path);
      return;
    }

    // If current tab is dashboard, navigate in same tab
    if (currentTab.path === '/') {
      navigateInCurrentTab(path);
    } else {
      // Otherwise, open in new tab
      openInNewTab(path);
    }
  };

  return (
    <div className="space-y-2">
      <h3>Smart Navigation</h3>
      <Button onClick={() => handleSmartNavigation('/patients')}>
        Smart Navigate to Patients
      </Button>
      <p className="text-sm text-gray-500">
        Opens in same tab if on Dashboard, otherwise opens new tab
      </p>
    </div>
  );
}
