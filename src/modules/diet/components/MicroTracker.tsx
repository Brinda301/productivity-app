'use client';
import type { NutritionSummary } from '../types';

interface MicroTrackerProps {
  summary: NutritionSummary | null;
}

interface MicroGoals {
  fiber: number;
  sugar: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  sodium?: number;
}

const DEFAULT_MICRO_GOALS: MicroGoals = {
  fiber: 25, // grams
  sugar: 50, // grams (limit)
  vitaminC: 90, // mg
  calcium: 1000, // mg
  iron: 18, // mg
  sodium: 2300, // mg (limit)
};

export default function MicroTracker({ summary }: MicroTrackerProps) {
  if (!summary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  const { totals } = summary;
  const goals = DEFAULT_MICRO_GOALS;

  const micros = [
    { name: 'Fiber', value: totals.fiber, goal: goals.fiber, unit: 'g', isLimit: false },
    { name: 'Sugar', value: totals.sugar, goal: goals.sugar, unit: 'g', isLimit: true },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Micronutrients</h3>
      
      <div className="space-y-4">
        {micros.map((micro) => {
          const percentage = (micro.value / micro.goal) * 100;
          const isOver = micro.isLimit && percentage > 100;
          const isGood = micro.isLimit ? percentage <= 100 : percentage >= 80;
          
          return (
            <div key={micro.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{micro.name}</span>
                <span className={`font-medium ${isOver ? 'text-red-600' : isGood ? 'text-green-600' : 'text-gray-900'}`}>
                  {Math.round(micro.value)}{micro.unit} / {micro.goal}{micro.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOver ? 'bg-red-500' : isGood ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Daily recommendations:</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Fiber: aim for 25-30g per day</li>
          <li>• Sugar: limit to 50g or less</li>
        </ul>
      </div>
    </div>
  );
}
