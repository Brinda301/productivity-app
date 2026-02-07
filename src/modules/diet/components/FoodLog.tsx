'use client';
import type { Meal, MealType, MEAL_ICONS } from '../types';

interface FoodLogProps {
  meals: Meal[];
  loading?: boolean;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const mealIcons: Record<MealType, string> = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snack: '🍎',
};

export default function FoodLog({ meals, loading, onEdit, onDelete }: FoodLogProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-2">🍽️</p>
        <p className="text-lg">No meals logged yet</p>
        <p className="text-sm mt-1">Start logging your food intake</p>
      </div>
    );
  }

  const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const sortedMeals = [...meals].sort((a, b) => 
    mealOrder.indexOf(a.name) - mealOrder.indexOf(b.name)
  );

  return (
    <div className="space-y-4">
      {sortedMeals.map((meal) => {
        const totalCalories = meal.items.reduce((acc, item) => acc + item.calories, 0);
        const totalProtein = meal.items.reduce((acc, item) => acc + item.protein, 0);
        const totalCarbs = meal.items.reduce((acc, item) => acc + item.carbs, 0);
        const totalFat = meal.items.reduce((acc, item) => acc + item.fat, 0);

        return (
          <div key={meal.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">{mealIcons[meal.name as MealType] || '🍽️'}</span>
                <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                <span className="text-sm text-gray-500">({meal.items.length} items)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{Math.round(totalCalories)} cal</span>
                <button
                  onClick={() => onEdit(meal)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(meal.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {meal.items.map((item) => (
                <div key={item.id} className="px-4 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.servingSize} {item.servingUnit}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-600">{Math.round(item.calories)} cal</span>
                    <span className="text-red-600">P: {Math.round(item.protein)}g</span>
                    <span className="text-blue-600">C: {Math.round(item.carbs)}g</span>
                    <span className="text-yellow-600">F: {Math.round(item.fat)}g</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer totals */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4 text-xs font-medium">
              <span className="text-red-600">Protein: {Math.round(totalProtein)}g</span>
              <span className="text-blue-600">Carbs: {Math.round(totalCarbs)}g</span>
              <span className="text-yellow-600">Fat: {Math.round(totalFat)}g</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
