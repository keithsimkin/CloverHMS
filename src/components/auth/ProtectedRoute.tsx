/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated or session has expired
 */

import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { checkSession, updateLastActivity } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check if session is valid
    const isValid = checkSession();

    if (!isValid) {
      // Redirect to login if not authenticated or session expired
      navigate({ to: '/login' });
      return;
    }

    // Update last activity on mount
    updateLastActivity();

    // Set up activity tracking
    const handleActivity = () => {
      updateLastActivity();
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Check session periodically (every minute)
    const sessionCheckInterval = setInterval(() => {
      const stillValid = checkSession();
      if (!stillValid) {
        navigate({ to: '/login' });
      }
    }, 60000); // Check every minute

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [navigate, isAuthenticated]);

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
