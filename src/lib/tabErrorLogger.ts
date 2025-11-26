/**
 * Tab Error Logger
 * 
 * Specialized error logging for tab system errors.
 * Provides detailed logging for debugging tab-related issues.
 */

import { AppError, logError } from './errorUtils';
import { Tab } from '@/types/tab';
import { ErrorType } from '@/types/enums';

export interface TabErrorContext {
  tabId?: string;
  tabPath?: string;
  tabTitle?: string;
  activeTabId?: string;
  totalTabs?: number;
  action?: string;
}

/**
 * Log a tab-specific error with context
 */
export function logTabError(
  error: AppError | Error | unknown,
  context?: TabErrorContext
): void {
  // Convert to AppError if needed
  const appError = error instanceof Error 
    ? { 
        type: ErrorType.DATABASE_ERROR,
        message: error.message,
        details: error,
        timestamp: new Date()
      }
    : error as AppError;

  // Log the error using standard error logger
  logError(appError);

  // Log additional tab context in development
  if (import.meta.env.DEV && context) {
    console.group('🔖 Tab Error Context');
    console.log('Tab ID:', context.tabId || 'N/A');
    console.log('Tab Path:', context.tabPath || 'N/A');
    console.log('Tab Title:', context.tabTitle || 'N/A');
    console.log('Active Tab ID:', context.activeTabId || 'N/A');
    console.log('Total Tabs:', context.totalTabs || 0);
    console.log('Action:', context.action || 'N/A');
    console.groupEnd();
  }
}

/**
 * Log tab restoration errors
 */
export function logTabRestorationError(
  error: unknown,
  corruptedData?: any
): void {
  console.error('Tab Restoration Error:', error);

  if (import.meta.env.DEV) {
    console.group('🔖 Tab Restoration Details');
    console.log('Error:', error);
    console.log('Corrupted Data:', corruptedData);
    console.log('LocalStorage Key:', 'tab-storage');
    
    try {
      const rawData = localStorage.getItem('tab-storage');
      console.log('Raw LocalStorage Data:', rawData);
    } catch (e) {
      console.log('Could not read localStorage:', e);
    }
    
    console.groupEnd();
  }
}

/**
 * Log tab action errors (open, close, reorder, etc.)
 */
export function logTabActionError(
  action: string,
  error: unknown,
  tab?: Tab
): void {
  console.error(`Tab Action Error [${action}]:`, error);

  if (import.meta.env.DEV && tab) {
    console.group(`🔖 Tab Action Error: ${action}`);
    console.log('Tab:', tab);
    console.log('Error:', error);
    console.groupEnd();
  }
}

/**
 * Log tab navigation errors
 */
export function logTabNavigationError(
  path: string,
  error: unknown,
  tabId?: string
): void {
  console.error('Tab Navigation Error:', error);

  if (import.meta.env.DEV) {
    console.group('🔖 Tab Navigation Error');
    console.log('Path:', path);
    console.log('Tab ID:', tabId || 'N/A');
    console.log('Error:', error);
    console.groupEnd();
  }
}

/**
 * Log tab persistence errors
 */
export function logTabPersistenceError(
  operation: 'save' | 'load' | 'clear',
  error: unknown
): void {
  console.error(`Tab Persistence Error [${operation}]:`, error);

  if (import.meta.env.DEV) {
    console.group(`🔖 Tab Persistence Error: ${operation}`);
    console.log('Operation:', operation);
    console.log('Error:', error);
    
    try {
      const rawData = localStorage.getItem('tab-storage');
      console.log('Current LocalStorage Data:', rawData);
    } catch (e) {
      console.log('Could not read localStorage:', e);
    }
    
    console.groupEnd();
  }
}

/**
 * Create a detailed error report for debugging
 */
export function createTabErrorReport(
  error: AppError | Error | unknown,
  context?: TabErrorContext
): string {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  let report = `Tab Error Report - ${timestamp}\n`;
  report += `${'='.repeat(50)}\n\n`;
  report += `Error: ${errorMessage}\n\n`;
  
  if (context) {
    report += `Context:\n`;
    report += `  Tab ID: ${context.tabId || 'N/A'}\n`;
    report += `  Tab Path: ${context.tabPath || 'N/A'}\n`;
    report += `  Tab Title: ${context.tabTitle || 'N/A'}\n`;
    report += `  Active Tab ID: ${context.activeTabId || 'N/A'}\n`;
    report += `  Total Tabs: ${context.totalTabs || 0}\n`;
    report += `  Action: ${context.action || 'N/A'}\n\n`;
  }
  
  if (error instanceof Error && error.stack) {
    report += `Stack Trace:\n${error.stack}\n`;
  }
  
  return report;
}
