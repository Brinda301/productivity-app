import type { Task as PrismaTask } from '@prisma/client';

export type Task = PrismaTask & {
  subtasks?: Task[];
};

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'personal' | 'school' | 'work' | 'health';
export type RecurringType = 'daily' | 'weekly' | 'monthly' | null;

export interface TaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  dueTime?: string;
  category?: TaskCategory;
  tags?: string;
  recurring?: RecurringType;
  parentId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  category?: TaskCategory;
  priority?: TaskPriority;
  from?: Date;
  to?: Date;
  completed?: boolean;
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  personal: '👤',
  school: '📚',
  work: '💼',
  health: '❤️',
};
