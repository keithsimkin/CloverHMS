/**
 * TabBar Component
 * 
 * Horizontal container for all tabs with scrolling, keyboard navigation,
 * and new tab button. Displays tab count indicator when approaching limit.
 * 
 * Performance optimizations:
 * - useCallback for event handlers to prevent unnecessary re-renders
 * - Optimized scroll button visibility checks
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tab } from './Tab';
import { TabCloseHandler } from './TabCloseHandler';
import { useTabStore } from '@/stores/tabStore';
import { useTabSettingsStore } from '@/stores/tabSettingsStore';
import { getDefaultRoute } from '@/config/routeMetadata';

interface TabBarProps {
  className?: string;
}

export function TabBar({ className }: TabBarProps) {
  const { 
    tabs, 
    activeTabId, 
    openTab, 
    setActiveTab, 
    reorderTabs,
    duplicateTab,
    closeOtherTabs,
    closeTabsToRight,
  } = useTabStore();
  const { maxTabs } = useTabSettingsStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [closingTabIds, setClosingTabIds] = useState<Set<string>>(new Set());
  const [newTabIds, setNewTabIds] = useState<Set<string>>(new Set());
  const previousTabsRef = useRef<typeof tabs>([]);

  // Track new tabs for slide-in animation
  useEffect(() => {
    const previousTabIds = new Set(previousTabsRef.current.map(t => t.id));
    
    // Find newly added tabs
    const addedTabIds = tabs
      .filter(t => !previousTabIds.has(t.id))
      .map(t => t.id);
    
    if (addedTabIds.length > 0) {
      setNewTabIds(new Set(addedTabIds));
      
      // Remove from new tabs set after animation completes
      setTimeout(() => {
        setNewTabIds(prev => {
          const next = new Set(prev);
          addedTabIds.forEach(id => next.delete(id));
          return next;
        });
      }, 200);
    }
    
    previousTabsRef.current = tabs;
  }, [tabs]);

  // Check if scroll buttons should be visible
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  // Update scroll buttons on mount and when tabs change
  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => updateScrollButtons();
    container.addEventListener('scroll', handleScroll);
    
    // Also update on resize
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [tabs]);

  // Scroll functions
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  // Handle new tab button click
  const handleNewTab = useCallback(() => {
    const defaultRoute = getDefaultRoute();
    openTab(defaultRoute.path, defaultRoute.title, defaultRoute.icon);
  }, [openTab]);

  // Wrapper for closing tabs with animation
  const handleCloseWithAnimation = useCallback((tabId: string, closeTabFn: (tabId: string) => void) => {
    // Add tab to closing set to trigger animation
    setClosingTabIds(prev => new Set(prev).add(tabId));
    
    // Wait for animation to complete (200ms) before actually closing
    setTimeout(() => {
      closeTabFn(tabId);
      setClosingTabIds(prev => {
        const next = new Set(prev);
        next.delete(tabId);
        return next;
      });
    }, 200);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, tabIndex: number, closeTabFn: (tabId: string) => void) => {
    const tabCount = tabs.length;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (tabIndex > 0) {
          setActiveTab(tabs[tabIndex - 1].id);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (tabIndex < tabCount - 1) {
          setActiveTab(tabs[tabIndex + 1].id);
        }
        break;
      case 'Home':
        e.preventDefault();
        setActiveTab(tabs[0].id);
        break;
      case 'End':
        e.preventDefault();
        setActiveTab(tabs[tabCount - 1].id);
        break;
      case 'Delete':
        e.preventDefault();
        if (tabs[tabIndex]) {
          closeTabFn(tabs[tabIndex].id);
        }
        break;
    }
  }, [tabs, setActiveTab]);

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedTabIndex(index);
    setDragOverIndex(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Create a custom drag image (clone of the tab)
    const target = e.currentTarget as HTMLElement;
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedTabIndex === null || draggedTabIndex === index) {
      return;
    }
    
    // Update visual feedback
    setDragOverIndex(index);
  }, [draggedTabIndex]);

  const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedTabIndex === null || draggedTabIndex === index) {
      return;
    }
    
    // Perform the reorder
    reorderTabs(draggedTabIndex, index);
    setDraggedTabIndex(index);
  }, [draggedTabIndex, reorderTabs]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clean up drag state
    setDraggedTabIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    // Clean up drag state
    setDraggedTabIndex(null);
    setDragOverIndex(null);
  }, []);

  // Prevent dragging outside the TabBar
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Check if we're leaving the TabBar container
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const { clientX, clientY } = e;
    
    // If cursor is outside the container bounds, prevent the drag
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      setDragOverIndex(null);
    }
  };

  // Calculate if approaching max limit (within 3 tabs)
  const isApproachingLimit = tabs.length >= maxTabs - 3;
  const isAtLimit = tabs.length >= maxTabs;

  return (
    <TabCloseHandler>
      {(closeTab) => (
        <div
          role="tablist"
          aria-label="Application tabs"
          className={cn(
            'flex items-center gap-1 h-10 px-2 bg-card border-b border-border',
            className
          )}
        >
          {/* Left scroll button */}
          {showLeftScroll && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={scrollLeft}
              className="flex-shrink-0"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Tabs container with horizontal scrolling */}
          <div
            ref={scrollContainerRef}
            className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-thin"
            style={{ scrollbarWidth: 'thin' }}
            onDragLeave={handleDragLeave}
          >
            {tabs.map((tab, index) => {
              const isClosing = closingTabIds.has(tab.id);
              const isNew = newTabIds.has(tab.id);
              
              return (
                <div
                  key={tab.id}
                  onKeyDown={(e) => handleKeyDown(e, index, (tabId) => handleCloseWithAnimation(tabId, closeTab))}
                  className={cn(
                    'relative overflow-hidden',
                    // Smooth position transition for reordering (250ms)
                    !isClosing && !isNew && 'transition-all ease-in-out duration-250',
                    // Slide in animation for new tabs (200ms)
                    isNew && 'tab-entering',
                    // Slide out and collapse animation for closing tabs (200ms)
                    isClosing && 'tab-closing',
                    // Visual feedback during drag
                    draggedTabIndex === index && !isClosing && 'opacity-50',
                    // Show drop indicator
                    dragOverIndex === index && draggedTabIndex !== index && !isClosing && 'ring-2 ring-mint-cream/50 rounded-t-md'
                  )}
                  style={{
                    // Ensure smooth transitions for position changes
                    transitionProperty: 'transform, opacity, box-shadow, max-width, padding, margin',
                  }}
                >
                  <Tab
                    tab={tab}
                    isActive={tab.id === activeTabId}
                    onSelect={() => setActiveTab(tab.id)}
                    onClose={() => handleCloseWithAnimation(tab.id, closeTab)}
                    onDuplicate={() => duplicateTab(tab.id)}
                    onCloseOthers={() => closeOtherTabs(tab.id)}
                    onCloseToRight={() => closeTabsToRight(tab.id)}
                    isOnlyTab={tabs.length === 1}
                    isRightmostTab={index === tabs.length - 1}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              );
            })}
          </div>

          {/* Right scroll button */}
          {showRightScroll && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={scrollRight}
              className="flex-shrink-0"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Tab count indicator (when approaching limit) */}
          {isApproachingLimit && (
            <div
              className={cn(
                'flex-shrink-0 px-2 py-1 text-xs font-medium rounded',
                isAtLimit
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-warning/20 text-warning'
              )}
              aria-label={`${tabs.length} of ${maxTabs} tabs open`}
            >
              {tabs.length}/{maxTabs}
            </div>
          )}

          {/* New tab button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleNewTab}
            disabled={isAtLimit}
            className="flex-shrink-0"
            aria-label="Open new tab"
            title={isAtLimit ? `Maximum tab limit (${maxTabs}) reached` : 'Open new tab (Ctrl+T)'}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </TabCloseHandler>
  );
}
