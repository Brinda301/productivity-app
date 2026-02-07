import type { Workout as PrismaWorkout, Exercise, ExerciseSet, FitnessGoal } from '@prisma/client';

export type Workout = PrismaWorkout & {
  exercises: (Exercise & { sets: ExerciseSet[] })[];
};

export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'other';
export type GoalCategory = 'strength' | 'cardio' | 'weight' | 'body_comp';

export interface ExerciseSetFormData {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
}

export interface ExerciseFormData {
  name: string;
  type: ExerciseType;
  distance?: number;
  pace?: number;
  sets?: ExerciseSetFormData[];
}

export interface WorkoutFormData {
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  exercises?: ExerciseFormData[];
}

export interface FitnessGoalFormData {
  name: string;
  category: GoalCategory;
  targetValue: number;
  currentValue?: number;
  unit: string;
  deadline?: Date;
}

export interface ProgressData {
  workouts: {
    date: string;
    name: string;
    duration: number | null;
    exerciseCount: number;
    totalVolume: number;
  }[];
  personalRecords: Record<string, { weight: number; reps: number; date: Date }>;
  totalWorkouts: number;
  averageDuration: number;
}

export const EXERCISE_TYPE_ICONS: Record<ExerciseType, string> = {
  strength: '🏋️',
  cardio: '🏃',
  flexibility: '🧘',
  other: '⚡',
};

export const GOAL_CATEGORY_ICONS: Record<GoalCategory, string> = {
  strength: '💪',
  cardio: '❤️',
  weight: '⚖️',
  body_comp: '📊',
};
