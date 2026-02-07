import type { Meal as PrismaMeal, FoodItem, DailyNutritionGoal } from '@prisma/client';

export type Meal = PrismaMeal & {
  items: FoodItem[];
};

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Quick Add';

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  magnesium: number;
  zinc: number;
  potassium: number;
  sodium: number;
  omega3: number;
  vitaminB6: number;
  vitaminB12: number;
  folate: number;
  vitaminC: number;
}

export interface NutritionSummary {
  date: string;
  meals: number;
  totals: NutritionTotals;
  goal: DailyNutritionGoal | null;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  magnesium: number;
  zinc: number;
  potassium: number;
  sodium: number;
  omega3: number;
  vitaminB6: number;
  vitaminB12: number;
  folate: number;
  vitaminC: number;
}

export interface FoodTemplate {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  magnesium: number;
  zinc: number;
  potassium: number;
  sodium: number;
  omega3: number;
  vitaminB6: number;
  vitaminB12: number;
  folate: number;
  vitaminC: number;
  isCustom?: boolean;
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
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  zinc?: number;
  potassium?: number;
  sodium?: number;
  omega3?: number;
  vitaminB6?: number;
  vitaminB12?: number;
  folate?: number;
  vitaminC?: number;
}

export interface MealFormData {
  name: MealType;
  date: Date;
  notes?: string;
  items?: FoodItemFormData[];
}

export interface DayScore {
  date: string;
  score: number;
  hasData: boolean;
}

export const MEAL_ICONS: Record<string, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snack: '🍎',
  'Quick Add': '⚡',
};

export const MACRO_COLORS = {
  protein: '#ef4444',
  carbs: '#3b82f6',
  fat: '#eab308',
};
