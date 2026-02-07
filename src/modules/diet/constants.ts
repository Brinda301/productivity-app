import type { FoodTemplate, NutritionTargets } from './types';

export const DAILY_TARGETS: NutritionTargets = {
  calories: 3000,
  protein: 140,
  carbs: 400,
  fat: 80,
  fiber: 30,
  sugar: 50,       // limit
  vitaminD: 2000,  // IU
  calcium: 1000,   // mg
  iron: 8,         // mg
  magnesium: 400,  // mg
  zinc: 11,        // mg
  potassium: 3400, // mg
  sodium: 2300,    // mg (limit)
  omega3: 2000,    // mg
  vitaminB6: 1.3,  // mg
  vitaminB12: 2.4, // mcg
  folate: 400,     // mcg
  vitaminC: 90,    // mg
};

// Nutrients where exceeding the target is bad
export const LIMIT_NUTRIENTS = new Set(['sugar', 'sodium']);

export const DEFAULT_FOODS: FoodTemplate[] = [
  {
    id: 'chicken-breast',
    name: 'Chicken Breast (cooked)',
    calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0,
    vitaminD: 5, calcium: 15, iron: 1, magnesium: 29, zinc: 1,
    potassium: 256, sodium: 74, omega3: 70, vitaminB6: 0.6, vitaminB12: 0.3, folate: 4, vitaminC: 0,
  },
  {
    id: 'lean-beef',
    name: 'Lean Beef (95% lean, cooked)',
    calories: 174, protein: 26, carbs: 0, fat: 8, fiber: 0, sugar: 0,
    vitaminD: 3, calcium: 18, iron: 3, magnesium: 24, zinc: 6.4,
    potassium: 355, sodium: 72, omega3: 50, vitaminB6: 0.4, vitaminB12: 2.6, folate: 10, vitaminC: 0,
  },
  {
    id: 'fatty-beef',
    name: 'Fatty Beef (80/20, cooked)',
    calories: 254, protein: 26, carbs: 0, fat: 17, fiber: 0, sugar: 0,
    vitaminD: 3, calcium: 18, iron: 2.5, magnesium: 20, zinc: 5.8,
    potassium: 315, sodium: 76, omega3: 50, vitaminB6: 0.35, vitaminB12: 2.5, folate: 8, vitaminC: 0,
  },
  {
    id: 'salmon',
    name: 'Salmon (cooked)',
    calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0,
    vitaminD: 526, calcium: 12, iron: 0.3, magnesium: 30, zinc: 0.6,
    potassium: 363, sodium: 59, omega3: 2260, vitaminB6: 0.6, vitaminB12: 3.2, folate: 26, vitaminC: 0,
  },
  {
    id: 'eggs',
    name: 'Eggs (whole, cooked)',
    calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1,
    vitaminD: 87, calcium: 56, iron: 1.8, magnesium: 12, zinc: 1.3,
    potassium: 138, sodium: 124, omega3: 180, vitaminB6: 0.17, vitaminB12: 0.9, folate: 47, vitaminC: 0,
  },
  {
    id: 'white-rice',
    name: 'White Rice (cooked)',
    calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0,
    vitaminD: 0, calcium: 10, iron: 0.2, magnesium: 12, zinc: 0.5,
    potassium: 35, sodium: 1, omega3: 0, vitaminB6: 0.05, vitaminB12: 0, folate: 2, vitaminC: 0,
  },
  {
    id: 'brown-rice',
    name: 'Brown Rice (cooked)',
    calories: 123, protein: 2.7, carbs: 26, fat: 1, fiber: 1.8, sugar: 0.4,
    vitaminD: 0, calcium: 10, iron: 0.5, magnesium: 44, zinc: 0.6,
    potassium: 79, sodium: 1, omega3: 0, vitaminB6: 0.15, vitaminB12: 0, folate: 4, vitaminC: 0,
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato (cooked)',
    calories: 90, protein: 2, carbs: 21, fat: 0.1, fiber: 3.3, sugar: 6.5,
    vitaminD: 0, calcium: 38, iron: 0.7, magnesium: 27, zinc: 0.3,
    potassium: 475, sodium: 36, omega3: 0, vitaminB6: 0.29, vitaminB12: 0, folate: 6, vitaminC: 19.6,
  },
  {
    id: 'banana',
    name: 'Banana',
    calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12,
    vitaminD: 0, calcium: 5, iron: 0.3, magnesium: 27, zinc: 0.2,
    potassium: 358, sodium: 1, omega3: 30, vitaminB6: 0.37, vitaminB12: 0, folate: 20, vitaminC: 8.7,
  },
  {
    id: 'apple',
    name: 'Apple',
    calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10,
    vitaminD: 0, calcium: 6, iron: 0.1, magnesium: 5, zinc: 0,
    potassium: 107, sodium: 1, omega3: 0, vitaminB6: 0.04, vitaminB12: 0, folate: 3, vitaminC: 4.6,
  },
  {
    id: 'broccoli',
    name: 'Broccoli (cooked)',
    calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3.3, sugar: 1.4,
    vitaminD: 0, calcium: 40, iron: 0.7, magnesium: 21, zinc: 0.4,
    potassium: 293, sodium: 41, omega3: 0, vitaminB6: 0.2, vitaminB12: 0, folate: 108, vitaminC: 64.9,
  },
  {
    id: 'spinach',
    name: 'Spinach (cooked)',
    calories: 23, protein: 2.9, carbs: 3.6, fat: 0.3, fiber: 2.4, sugar: 0.4,
    vitaminD: 0, calcium: 136, iron: 3.6, magnesium: 87, zinc: 0.8,
    potassium: 466, sodium: 70, omega3: 0, vitaminB6: 0.24, vitaminB12: 0, folate: 146, vitaminC: 9.8,
  },
  {
    id: 'oats',
    name: 'Oats (dry)',
    calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10.6, sugar: 1,
    vitaminD: 0, calcium: 54, iron: 4.7, magnesium: 177, zinc: 4,
    potassium: 429, sodium: 2, omega3: 0, vitaminB6: 0.12, vitaminB12: 0, folate: 56, vitaminC: 0,
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt (plain, 2%)',
    calories: 73, protein: 10, carbs: 3.9, fat: 2, fiber: 0, sugar: 3.2,
    vitaminD: 0, calcium: 110, iron: 0.1, magnesium: 11, zinc: 0.5,
    potassium: 141, sodium: 36, omega3: 0, vitaminB6: 0.06, vitaminB12: 0.8, folate: 7, vitaminC: 0,
  },
  {
    id: 'whole-milk',
    name: 'Whole Milk',
    calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5,
    vitaminD: 40, calcium: 113, iron: 0, magnesium: 10, zinc: 0.4,
    potassium: 132, sodium: 43, omega3: 0, vitaminB6: 0.04, vitaminB12: 0.5, folate: 5, vitaminC: 0,
  },
  {
    id: 'peanut-butter',
    name: 'Peanut Butter',
    calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, sugar: 9,
    vitaminD: 0, calcium: 43, iron: 1.7, magnesium: 154, zinc: 2.5,
    potassium: 649, sodium: 17, omega3: 0, vitaminB6: 0.44, vitaminB12: 0, folate: 87, vitaminC: 0,
  },
  {
    id: 'almonds',
    name: 'Almonds',
    calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, sugar: 4.4,
    vitaminD: 0, calcium: 269, iron: 3.7, magnesium: 270, zinc: 3.1,
    potassium: 733, sodium: 1, omega3: 0, vitaminB6: 0.14, vitaminB12: 0, folate: 44, vitaminC: 0,
  },
  {
    id: 'avocado',
    name: 'Avocado',
    calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7,
    vitaminD: 0, calcium: 12, iron: 0.6, magnesium: 29, zinc: 0.6,
    potassium: 485, sodium: 7, omega3: 110, vitaminB6: 0.26, vitaminB12: 0, folate: 81, vitaminC: 10,
  },
  {
    id: 'olive-oil',
    name: 'Olive Oil (1 tbsp = ~14g)',
    calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0,
    vitaminD: 0, calcium: 1, iron: 0.6, magnesium: 0, zinc: 0,
    potassium: 1, sodium: 2, omega3: 760, vitaminB6: 0, vitaminB12: 0, folate: 0, vitaminC: 0,
  },
  {
    id: 'whey-protein',
    name: 'Whey Protein Powder',
    calories: 400, protein: 80, carbs: 10, fat: 5, fiber: 0, sugar: 5,
    vitaminD: 0, calcium: 200, iron: 2, magnesium: 50, zinc: 3,
    potassium: 400, sodium: 200, omega3: 0, vitaminB6: 0.5, vitaminB12: 1, folate: 0, vitaminC: 0,
  },
  {
    id: 'tofu',
    name: 'Tofu (firm)',
    calories: 144, protein: 17, carbs: 3, fat: 9, fiber: 2.3, sugar: 0,
    vitaminD: 0, calcium: 683, iron: 2.7, magnesium: 58, zinc: 1.6,
    potassium: 237, sodium: 14, omega3: 0, vitaminB6: 0.1, vitaminB12: 0, folate: 29, vitaminC: 0,
  },
  {
    id: 'pasta',
    name: 'Pasta (cooked)',
    calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6,
    vitaminD: 0, calcium: 7, iron: 0.5, magnesium: 18, zinc: 0.5,
    potassium: 44, sodium: 1, omega3: 0, vitaminB6: 0.05, vitaminB12: 0, folate: 7, vitaminC: 0,
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Bread',
    calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sugar: 6,
    vitaminD: 0, calcium: 107, iron: 2.5, magnesium: 75, zinc: 1.8,
    potassium: 254, sodium: 400, omega3: 0, vitaminB6: 0.18, vitaminB12: 0, folate: 42, vitaminC: 0,
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage Cheese (2%)',
    calories: 86, protein: 12, carbs: 4, fat: 2.3, fiber: 0, sugar: 4,
    vitaminD: 0, calcium: 83, iron: 0.1, magnesium: 8, zinc: 0.4,
    potassium: 104, sodium: 330, omega3: 0, vitaminB6: 0.05, vitaminB12: 0.6, folate: 12, vitaminC: 0,
  },
  {
    id: 'tuna-canned',
    name: 'Tuna (canned in water)',
    calories: 116, protein: 26, carbs: 0, fat: 0.8, fiber: 0, sugar: 0,
    vitaminD: 68, calcium: 11, iron: 1.3, magnesium: 30, zinc: 0.8,
    potassium: 237, sodium: 338, omega3: 270, vitaminB6: 0.46, vitaminB12: 2.1, folate: 4, vitaminC: 0,
  },
];
