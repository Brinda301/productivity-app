'use client';
import type { NutritionSummary } from '../types';
import { DAILY_TARGETS } from '../constants';

interface MacroPanelProps {
  summary: NutritionSummary | null;
}

interface MacroBarConfig {
  key: string;
  label: string;
  color: string;
  bgColor: string;
  unit: string;
  target: number;
}

const MACRO_BARS: MacroBarConfig[] = [
  { key: 'calories', label: 'Calories', color: 'bg-emerald-500', bgColor: 'bg-emerald-100', unit: 'kcal', target: DAILY_TARGETS.calories },
  { key: 'protein', label: 'Protein', color: 'bg-red-500', bgColor: 'bg-red-100', unit: 'g', target: DAILY_TARGETS.protein },
  { key: 'carbs', label: 'Carbohydrates', color: 'bg-blue-500', bgColor: 'bg-blue-100', unit: 'g', target: DAILY_TARGETS.carbs },
  { key: 'fat', label: 'Fat', color: 'bg-yellow-500', bgColor: 'bg-yellow-100', unit: 'g', target: DAILY_TARGETS.fat },
  { key: 'fiber', label: 'Fiber', color: 'bg-green-500', bgColor: 'bg-green-100', unit: 'g', target: DAILY_TARGETS.fiber },
];

export default function MacroPanel({ summary }: MacroPanelProps) {
  const totals = summary?.totals;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Macronutrients</h3>

      <div className="space-y-4">
        {MACRO_BARS.map((macro) => {
          const current = totals ? (totals as unknown as Record<string, number>)[macro.key] || 0 : 0;
          const percentage = macro.target > 0 ? (current / macro.target) * 100 : 0;
          const isOver = percentage > 100;

          return (
            <div key={macro.key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 font-medium">{macro.label}</span>
                <span className="text-gray-600">
                  {Math.round(current)}{macro.unit !== 'kcal' ? macro.unit : ''} / {macro.target}{macro.unit}
                  <span className="text-gray-400 ml-1">({Math.round(percentage)}%)</span>
                </span>
              </div>
              <div className={`h-3 ${macro.bgColor} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${isOver ? 'bg-red-500' : macro.color}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
