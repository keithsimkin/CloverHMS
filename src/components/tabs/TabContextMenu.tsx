/**
 * TabContextMenu Component
 * 
 * Context menu for tab management actions triggered by right-click.
 * Provides options to duplicate, close, and manage tabs.
 */

import { Copy, X, XCircle, ChevronsRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface TabContextMenuProps {
  /** Whether the menu is open */
  open: boolean;
  /** Callback when menu open state changes */
  onOpenChange: (open: boolean) => void;
  /** Callback to duplicate the tab */
  onDuplicate: () => void;
  /** Callback to close the tab */
  onClose: () => void;
  /** Callback to close all other tabs */
  onCloseOthers: () => void;
  /** Callback to close tabs to the right */
  onCloseToRight: () => void;
  /** Whether this is the only tab (disables "Close Other Tabs") */
  isOnlyTab?: boolean;
  /** Whether this is the rightmost tab (disables "Close Tabs to the Right") */
  isRightmostTab?: boolean;
  /** Children element that triggers the context menu */
  children: React.ReactNode;
}

export function TabContextMenu({
  open,
  onOpenChange,
  onDuplicate,
  onClose,
  onCloseOthers,
  onCloseToRight,
  isOnlyTab = false,
  isRightmostTab = false,
  children,
}: TabContextMenuProps) {
  const handleDuplicate = () => {
    onDuplicate();
    onOpenChange(false);
  };

  const handleClose = () => {
    onClose();
    onOpenChange(false);
  };

  const handleCloseOthers = () => {
    onCloseOthers();
    onOpenChange(false);
  };

  const handleCloseToRight = () => {
    onCloseToRight();
    onOpenChange(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children}
      <DropdownMenuContent
        className="w-56"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate Tab</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleClose}>
          <X className="mr-2 h-4 w-4" />
          <span>Close Tab</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleCloseOthers}
          disabled={isOnlyTab}
        >
          <XCircle className="mr-2 h-4 w-4" />
          <span>Close Other Tabs</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleCloseToRight}
          disabled={isRightmostTab}
        >
          <ChevronsRight className="mr-2 h-4 w-4" />
          <span>Close Tabs to the Right</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
