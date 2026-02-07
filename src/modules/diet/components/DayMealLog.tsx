'use client';
import type { FoodItem } from '@prisma/client';

interface DayMealLogProps {
  items: Array<FoodItem & { mealName: string }>;
  loading?: boolean;
  onDelete: (id: string) => void;
}

export default function DayMealLog({ items, loading, onDelete }: DayMealLogProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-3 animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-400">
        <p className="text-sm">No food logged for this day. Use the quick-add below to start tracking.</p>
      </div>
    );
  }

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm">
          Meal Log ({items.length} item{items.length !== 1 ? 's' : ''})
        </h3>
        <span className="text-sm text-gray-600 font-medium">{Math.round(totalCalories)} kcal total</span>
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-2.5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.servingSize}{item.servingUnit}
              </p>
            </div>

            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-600">{Math.round(item.calories)} cal</span>
                <span className="text-red-500">P:{Math.round(item.protein)}g</span>
                <span className="text-blue-500">C:{Math.round(item.carbs)}g</span>
                <span className="text-yellow-600">F:{Math.round(item.fat)}g</span>
              </div>

              <button
                onClick={() => onDelete(item.id)}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
