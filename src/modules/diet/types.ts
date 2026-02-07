import type { Meal as PrismaMeal, FoodItem, DailyNutritionGoal } from '@prisma/client';

export type Meal = PrismaMeal & {
  items: FoodItem[];
};

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface NutritionSummary {
  date: string;
  meals: number;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  goal: DailyNutritionGoal | null;
}

export interface FoodItemFormData {
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface MealFormData {
  name: MealType;
  date: Date;
  notes?: string;
  items?: FoodItemFormData[];
}

export const MEAL_ICONS: Record<MealType, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snack: '🍎',
};

export const MACRO_COLORS = {
  protein: '#ef4444', // red
  carbs: '#3b82f6',   // blue
  fat: '#f59e0b',     // yellow
};
