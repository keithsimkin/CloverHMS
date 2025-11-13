/**
 * Authentication store using Zustand
 * Manages authentication state with mock authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '@/types/enums';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  staffId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: number;
  failedAttempts: number;
  lockoutUntil: number | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateLastActivity: () => void;
  checkSession: () => boolean;
  resetFailedAttempts: () => void;
  incrementFailedAttempts: () => void;
  isAccountLocked: () => boolean;
}

// Mock users for testing
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@hospital.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@hospital.com',
      role: Role.ADMIN,
      firstName: 'System',
      lastName: 'Administrator',
      staffId: 'STAFF001',
    },
  },
  'doctor@hospital.com': {
    password: 'doctor123',
    user: {
      id: '2',
      email: 'doctor@hospital.com',
      role: Role.DOCTOR,
      firstName: 'John',
      lastName: 'Smith',
      staffId: 'STAFF002',
    },
  },
  'nurse@hospital.com': {
    password: 'nurse123',
    user: {
      id: '3',
      email: 'nurse@hospital.com',
      role: Role.NURSE,
      firstName: 'Sarah',
      lastName: 'Johnson',
      staffId: 'STAFF003',
    },
  },
  'receptionist@hospital.com': {
    password: 'reception123',
    user: {
      id: '4',
      email: 'receptionist@hospital.com',
      role: Role.RECEPTIONIST,
      firstName: 'Emily',
      lastName: 'Davis',
      staffId: 'STAFF004',
    },
  },
};

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_FAILED_ATTEMPTS = 3;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: Date.now(),
      failedAttempts: 0,
      lockoutUntil: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Check if account is locked
        if (get().isAccountLocked()) {
          set({ isLoading: false });
          throw new Error('Account is locked due to multiple failed login attempts. Please try again in 15 minutes.');
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockUser = MOCK_USERS[email.toLowerCase()];

        if (!mockUser || mockUser.password !== password) {
          get().incrementFailedAttempts();
          set({ isLoading: false });
          
          const remainingAttempts = MAX_FAILED_ATTEMPTS - get().failedAttempts;
          if (remainingAttempts > 0) {
            throw new Error(`Invalid email or password. ${remainingAttempts} attempt(s) remaining.`);
          } else {
            throw new Error('Account locked due to multiple failed login attempts. Please try again in 15 minutes.');
          }
        }

        // Successful login
        set({
          user: mockUser.user,
          isAuthenticated: true,
          isLoading: false,
          lastActivity: Date.now(),
          failedAttempts: 0,
          lockoutUntil: null,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          lastActivity: Date.now(),
          failedAttempts: 0,
          lockoutUntil: null,
        });
      },

      updateLastActivity: () => {
        set({ lastActivity: Date.now() });
      },

      checkSession: () => {
        const { isAuthenticated, lastActivity } = get();
        
        if (!isAuthenticated) {
          return false;
        }

        const now = Date.now();
        const timeSinceLastActivity = now - lastActivity;

        // Check if session has expired due to inactivity
        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          get().logout();
          return false;
        }

        return true;
      },

      resetFailedAttempts: () => {
        set({ failedAttempts: 0, lockoutUntil: null });
      },

      incrementFailedAttempts: () => {
        const newFailedAttempts = get().failedAttempts + 1;
        
        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
          set({
            failedAttempts: newFailedAttempts,
            lockoutUntil: Date.now() + LOCKOUT_DURATION,
          });
        } else {
          set({ failedAttempts: newFailedAttempts });
        }
      },

      isAccountLocked: () => {
        const { lockoutUntil } = get();
        
        if (!lockoutUntil) {
          return false;
        }

        const now = Date.now();
        
        if (now >= lockoutUntil) {
          // Lockout period has expired
          get().resetFailedAttempts();
          return false;
        }

        return true;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
        failedAttempts: state.failedAttempts,
        lockoutUntil: state.lockoutUntil,
      }),
    }
  )
);
