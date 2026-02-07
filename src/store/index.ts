import { create } from 'zustand';
import type { Task, JobApplication, Workout, Meal } from '@/shared/types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Active filters for each module
  taskFilters: {
    status?: string;
    category?: string;
    priority?: string;
  };
  setTaskFilters: (filters: Partial<AppState['taskFilters']>) => void;

  // Selected date for calendar views
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  // Notification preferences
  notifications: {
    enabled: boolean;
    dailyDigest: boolean;
    taskReminders: boolean;
    interviewReminders: boolean;
  };
  setNotifications: (settings: Partial<AppState['notifications']>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Theme
  theme: 'system',
  setTheme: (theme) => set({ theme }),

  // Active filters
  taskFilters: {},
  setTaskFilters: (filters) =>
    set((state) => ({ taskFilters: { ...state.taskFilters, ...filters } })),

  // Selected date
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  // Notifications
  notifications: {
    enabled: true,
    dailyDigest: true,
    taskReminders: true,
    interviewReminders: true,
  },
  setNotifications: (settings) =>
    set((state) => ({ notifications: { ...state.notifications, ...settings } })),
}));
