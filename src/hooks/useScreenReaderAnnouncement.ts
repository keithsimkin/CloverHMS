/**
 * useScreenReaderAnnouncement Hook
 * 
 * Provides a way to announce messages to screen readers using ARIA live regions.
 * Messages are announced politely by default, but can be set to assertive for urgent messages.
 */

import { useEffect, useRef } from 'react';

interface UseScreenReaderAnnouncementOptions {
  politeness?: 'polite' | 'assertive';
}

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReaderAnnouncement(
  message: string | null,
  options: UseScreenReaderAnnouncementOptions = {}
) {
  const { politeness = 'polite' } = options;
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create the live region if it doesn't exist
    if (!announcementRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // Visually hidden but accessible to screen readers
      document.body.appendChild(liveRegion);
      announcementRef.current = liveRegion;
    }

    // Update the politeness level if it changes
    if (announcementRef.current) {
      announcementRef.current.setAttribute('aria-live', politeness);
    }

    // Cleanup on unmount
    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
      }
    };
  }, [politeness]);

  useEffect(() => {
    if (message && announcementRef.current) {
      // Clear the message first to ensure it's announced even if it's the same
      announcementRef.current.textContent = '';
      
      // Use a small delay to ensure the screen reader picks up the change
      setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);
}

/**
 * Utility function to announce a message to screen readers
 * Can be used outside of React components
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) {
  // Find or create the live region
  let liveRegion = document.getElementById('screen-reader-announcements') as HTMLDivElement;
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'screen-reader-announcements';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  // Update politeness level
  liveRegion.setAttribute('aria-live', politeness);

  // Clear and set the message
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}
