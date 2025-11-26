/**
 * Tab Component
 * 
 * Individual tab component with active/inactive states, close button,
 * unsaved changes indicator, notification indicator, tooltip, and context menu.
 * 
 * Performance optimizations:
 * - Memoized with React.memo to prevent unnecessary re-renders
 * - useCallback for event handlers to maintain referential equality
 */

import { useState, useCallback, memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TabContextMenu } from './TabContextMenu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTabSettingsStore } from '@/stores/tabSettingsStore';
import type { Tab as TabType } from '@/types/tab';
import * as LucideIcons from 'lucide-react';

interface TabProps {
  tab: TabType;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onDuplicate?: () => void;
  onCloseOthers?: () => void;
  onCloseToRight?: () => void;
  isOnlyTab?: boolean;
  isRightmostTab?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const Tab = memo(function Tab({
  tab,
  isActive,
  onSelect,
  onClose,
  onDuplicate,
  onCloseOthers,
  onCloseToRight,
  isOnlyTab = false,
  isRightmostTab = false,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDrop,
  onDragEnd,
}: TabProps) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const { showTabIcons } = useTabSettingsStore();

  // Get icon component from lucide-react
  const IconComponent = tab.icon
    ? (LucideIcons[tab.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
    : null;

  // Memoize event handlers to prevent unnecessary re-renders
  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  }, [onClose]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuOpen(true);
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(e);
    }
  }, [onDragStart]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (onDragOver) {
      onDragOver(e);
    }
  }, [onDragOver]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    if (onDragEnter) {
      onDragEnter(e);
    }
  }, [onDragEnter]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (onDrop) {
      onDrop(e);
    }
  }, [onDrop]);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    // Clean up any drag state
    e.currentTarget.classList.remove('opacity-50');
    
    if (onDragEnd) {
      onDragEnd(e);
    }
  }, [onDragEnd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Handle Enter and Space to activate tab
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  }, [onSelect]);

  return (
    <TabContextMenu
      open={contextMenuOpen}
      onOpenChange={setContextMenuOpen}
      onDuplicate={() => onDuplicate?.()}
      onClose={onClose}
      onCloseOthers={() => onCloseOthers?.()}
      onCloseToRight={() => onCloseToRight?.()}
      isOnlyTab={isOnlyTab}
      isRightmostTab={isRightmostTab}
    >
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-label={`${tab.title}${tab.hasUnsavedChanges ? ', unsaved changes' : ''}${tab.hasNotification && !isActive ? ', has notification' : ''}${isActive ? ', active' : ''}`}
              tabIndex={isActive ? 0 : -1}
              draggable
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onClick={onSelect}
              onContextMenu={handleContextMenu}
              onKeyDown={handleKeyDown}
              className={cn(
                // Base styles
                'group relative flex items-center gap-2 h-8 min-w-[120px] max-w-[200px] px-3 rounded-t-md',
                'select-none',
                'border-b-2',
                // Cursor styles for drag
                'cursor-grab active:cursor-grabbing',
                // Transitions - hover and background changes (100ms), scale on click
                'transition-all duration-100',
                'hover:scale-[1.02]',
                'active:scale-[0.98]',
                // Active state
                isActive
                  ? 'bg-prussian-blue text-mint-cream border-mint-cream shadow-sm'
                  : 'bg-gunmetal text-cool-gray border-transparent hover:bg-prussian-blue/50 hover:text-mint-cream',
                // Focus styles
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            >
          {/* Icon */}
          {showTabIcons && IconComponent && (
            <IconComponent className="w-4 h-4 flex-shrink-0" />
          )}

          {/* Title with truncation */}
          <span className="flex-1 text-sm font-medium truncate">
            {tab.title}
          </span>

          {/* Indicators container */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Unsaved changes indicator (orange dot) */}
            {tab.hasUnsavedChanges && (
              <div
                className="w-1.5 h-1.5 rounded-full bg-orange-500"
                aria-label="Unsaved changes"
              />
            )}

            {/* Notification indicator (colored dot based on type) */}
            {tab.hasNotification && !isActive && (
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  // Color based on notification type
                  tab.notification?.type === 'error' && 'bg-imperial-red',
                  tab.notification?.type === 'warning' && 'bg-yellow-500',
                  tab.notification?.type === 'success' && 'bg-green-500',
                  tab.notification?.type === 'info' && 'bg-blue-500',
                  tab.notification?.type === 'update' && 'bg-purple-500',
                  // Default to blue if no type specified
                  !tab.notification?.type && 'bg-blue-500'
                )}
                aria-label={`Has ${tab.notification?.type || 'notification'}`}
              />
            )}

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCloseClick}
              className={cn(
                'h-5 w-5 p-0 rounded-sm',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'hover:bg-imperial-red/20 hover:text-imperial-red',
                'focus-visible:opacity-100'
              )}
              aria-label={`Close ${tab.title} tab`}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            <p className="text-xs font-medium">{tab.title}</p>
            {tab.hasUnsavedChanges && (
              <p className="text-xs text-orange-500 mt-0.5">• Unsaved changes</p>
            )}
            {tab.hasNotification && !isActive && tab.notification && (
              <div className="mt-1 pt-1 border-t border-border">
                <p className={cn(
                  'text-xs font-medium',
                  tab.notification.type === 'error' && 'text-imperial-red',
                  tab.notification.type === 'warning' && 'text-yellow-500',
                  tab.notification.type === 'success' && 'text-green-500',
                  tab.notification.type === 'info' && 'text-blue-500',
                  tab.notification.type === 'update' && 'text-purple-500'
                )}>
                  {tab.notification.title || `${tab.notification.type.charAt(0).toUpperCase() + tab.notification.type.slice(1)} Notification`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{tab.notification.message}</p>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
    </TabContextMenu>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific props change
  return (
    prevProps.tab.id === nextProps.tab.id &&
    prevProps.tab.title === nextProps.tab.title &&
    prevProps.tab.icon === nextProps.tab.icon &&
    prevProps.tab.hasUnsavedChanges === nextProps.tab.hasUnsavedChanges &&
    prevProps.tab.hasNotification === nextProps.tab.hasNotification &&
    prevProps.tab.notification?.type === nextProps.tab.notification?.type &&
    prevProps.tab.notification?.message === nextProps.tab.notification?.message &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.isOnlyTab === nextProps.isOnlyTab &&
    prevProps.isRightmostTab === nextProps.isRightmostTab
  );
});
