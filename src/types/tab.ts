/**
 * Tab System Type Definitions
 * 
 * Defines interfaces for the browser-like tab system including
 * Tab instances, route metadata, and persisted state.
 */

import { Role } from './enums';

/**
 * Types of notifications that can appear on tabs
 */
export type TabNotificationType = 
  | 'info'      // General information update
  | 'success'   // Successful operation
  | 'warning'   // Warning or attention needed
  | 'error'     // Error occurred
  | 'update';   // Content updated

/**
 * Notification metadata for a tab
 */
export interface TabNotification {
  /** Type of notification */
  type: TabNotificationType;
  
  /** Notification message/description */
  message: string;
  
  /** Optional title for the notification */
  title?: string;
  
  /** Timestamp when notification was created */
  timestamp: number;
}

/**
 * Represents a single tab instance in the tab system
 */
export interface Tab {
  /** Unique tab identifier (UUID v4) */
  id: string;
  
  /** TanStack Router path (e.g., '/patients', '/appointments') */
  path: string;
  
  /** Display title shown in the tab (e.g., "Patients", "Dashboard") */
  title: string;
  
  /** Icon name from Heroicons (optional) */
  icon?: string;
  
  /** Indicates if the tab has unsaved changes (shows orange dot indicator) */
  hasUnsavedChanges: boolean;
  
  /** Indicates if the tab has a notification (shows blue dot indicator) */
  hasNotification?: boolean;
  
  /** Notification metadata for the tab */
  notification?: TabNotification;
  
  /** Y-axis scroll position for restoration when switching tabs */
  scrollPosition: number;
  
  /** Unix timestamp when the tab was created */
  createdAt: number;
  
  /** Unix timestamp when the tab was last accessed (for LRU tracking) */
  lastAccessedAt: number;
}

/**
 * Metadata for application routes used in tab creation
 */
export interface RouteMetadata {
  /** Route path matching TanStack Router paths */
  path: string;
  
  /** Human-readable title for the route */
  title: string;
  
  /** Heroicon name for visual identification */
  icon: string;
  
  /** Whether the route requires authentication */
  requiresAuth: boolean;
  
  /** Optional: Specific roles allowed to access this route */
  allowedRoles?: Role[];
}

/**
 * Persisted tab state stored in localStorage
 */
export interface PersistedTabState {
  /** Array of open tabs */
  tabs: Tab[];
  
  /** ID of the currently active tab */
  activeTabId: string | null;
  
  /** Schema version for future migrations */
  version: number;
  
  /** Unix timestamp of last save (for 30-day retention validation) */
  timestamp: number;
}
