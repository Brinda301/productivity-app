// Re-export types from Prisma client for convenience
export type {
  Meal,
  FoodItem,
  DailyNutritionGoal,
  JobApplication,
  Contact,
  Interview,
  Workout,
  Exercise,
  ExerciseSet,
  FitnessGoal,
  Task,
  CalendarEvent,
} from '@prisma/client';

// Additional UI types
export interface DashboardStats {
  tasksToday: number;
  tasksDueThisWeek: number;
  interviewsScheduled: number;
  activeApplications: number;
  workoutsThisWeek: number;
  caloriesLogged: number;
  calorieGoal: number;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type JobStatus = 'saved' | 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'other';
export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
