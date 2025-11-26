/**
 * TabContentArea Component
 * 
 * Container that renders content for all tabs. Keeps inactive tabs mounted
 * but hidden with CSS display:none to preserve component state and scroll position.
 * Each tab content is wrapped in an ErrorBoundary for isolated error handling.
 */

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { TabErrorFallback } from './TabErrorFallback';
import { cn } from '@/lib/utils';
import { useTabStore } from '@/stores/tabStore';

interface TabContentAreaProps {
  className?: string;
}

/**
 * Main TabContentArea component
 */
export function TabContentArea({ className, children }: TabContentAreaProps & { children?: React.ReactNode }) {
  const { tabs, activeTabId } = useTabStore();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousActiveTabId = useRef<string | null>(activeTabId);

  // Handle tab reload - force re-navigation to refresh the tab content
  const handleReloadTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      try {
        // Force router to re-navigate to the tab's path
        // This will trigger a fresh render of the tab content
        router.navigate({ to: tab.path as any });
      } catch (error) {
        console.error('Error reloading tab:', error);
        // If navigation fails, try reloading the entire page as fallback
        window.location.reload();
      }
    }
  };

  // Handle fade transition when switching tabs
  useEffect(() => {
    if (previousActiveTabId.current !== activeTabId) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 150); // Match the fade duration
      
      previousActiveTabId.current = activeTabId;
      return () => clearTimeout(timer);
    }
  }, [activeTabId]);

  // Save scroll position when active tab changes
  useEffect(() => {
    if (contentRef.current && activeTabId) {
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (activeTab) {
        // Save current scroll position
        const scrollPosition = contentRef.current.scrollTop;
        useTabStore.getState().updateTabMetadata(activeTabId, { scrollPosition });
      }
    }
  }, [activeTabId, tabs]);

  // Restore scroll position when active tab changes
  useEffect(() => {
    if (contentRef.current && activeTabId) {
      const activeTab = tabs.find(t => t.id === activeTabId);
      if (activeTab) {
        // Restore scroll position
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = activeTab.scrollPosition;
          }
        });
      }
    }
  }, [activeTabId, tabs]);

  const activeTab = tabs.find(t => t.id === activeTabId);
  
  return (
    <div 
      ref={contentRef}
      role="tabpanel"
      id={activeTabId ? `tabpanel-${activeTabId}` : undefined}
      aria-labelledby={activeTabId ? `tab-${activeTabId}` : undefined}
      aria-label={activeTab ? `${activeTab.title} content` : 'Tab content'}
      tabIndex={0}
      className={cn(
        'flex-1 overflow-y-auto',
        // Fade in/out transition for tab switching (150ms)
        'transition-opacity duration-150 ease-in-out',
        isTransitioning && 'opacity-0',
        !isTransitioning && 'opacity-100',
        className
      )}
    >
      <ErrorBoundary
        fallback={(error, resetError) => (
          <TabErrorFallback 
            error={error}
            tabId={activeTabId || ''}
            onReload={() => {
              // Reset the error boundary state
              resetError();
              // Reload the tab content
              if (activeTabId) {
                handleReloadTab(activeTabId);
              }
            }} 
          />
        )}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
}
