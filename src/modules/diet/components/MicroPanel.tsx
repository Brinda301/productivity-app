'use client';
import type { NutritionSummary } from '../types';
import { DAILY_TARGETS, LIMIT_NUTRIENTS } from '../constants';

interface MicroPanelProps {
  summary: NutritionSummary | null;
}

interface MicroBarConfig {
  key: string;
  label: string;
  unit: string;
  target: number;
  isLimit: boolean;
}

const MICRO_BARS: MicroBarConfig[] = [
  { key: 'vitaminD', label: 'Vitamin D', unit: 'IU', target: DAILY_TARGETS.vitaminD, isLimit: false },
  { key: 'calcium', label: 'Calcium', unit: 'mg', target: DAILY_TARGETS.calcium, isLimit: false },
  { key: 'iron', label: 'Iron', unit: 'mg', target: DAILY_TARGETS.iron, isLimit: false },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg', target: DAILY_TARGETS.magnesium, isLimit: false },
  { key: 'zinc', label: 'Zinc', unit: 'mg', target: DAILY_TARGETS.zinc, isLimit: false },
  { key: 'potassium', label: 'Potassium', unit: 'mg', target: DAILY_TARGETS.potassium, isLimit: false },
  { key: 'sodium', label: 'Sodium', unit: 'mg', target: DAILY_TARGETS.sodium, isLimit: true },
  { key: 'omega3', label: 'Omega-3 (EPA+DHA)', unit: 'mg', target: DAILY_TARGETS.omega3, isLimit: false },
  { key: 'vitaminB6', label: 'Vitamin B6', unit: 'mg', target: DAILY_TARGETS.vitaminB6, isLimit: false },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg', target: DAILY_TARGETS.vitaminB12, isLimit: false },
  { key: 'folate', label: 'Folate', unit: 'mcg', target: DAILY_TARGETS.folate, isLimit: false },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', target: DAILY_TARGETS.vitaminC, isLimit: false },
  { key: 'sugar', label: 'Sugar (limit)', unit: 'g', target: DAILY_TARGETS.sugar, isLimit: true },
];

function formatValue(value: number, unit: string): string {
  if (unit === 'mcg' || unit === 'mg') {
    return value < 10 ? value.toFixed(1) : Math.round(value).toString();
  }
  return Math.round(value).toString();
}

export default function MicroPanel({ summary }: MicroPanelProps) {
  const totals = summary?.totals;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Micronutrients</h3>

      <div className="space-y-3">
        {MICRO_BARS.map((micro) => {
          const current = totals ? (totals as unknown as Record<string, number>)[micro.key] || 0 : 0;
          const percentage = micro.target > 0 ? (current / micro.target) * 100 : 0;
          const isOver = percentage > 100;
          const isWarning = micro.isLimit && isOver;

          let barColor = 'bg-blue-400';
          if (micro.isLimit) {
            barColor = isOver ? 'bg-red-500' : 'bg-blue-400';
          } else {
            barColor = percentage >= 80 ? 'bg-green-500' : 'bg-blue-400';
          }

          return (
            <div key={micro.key}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className={`${isWarning ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  {micro.label}
                </span>
                <span className={`${isWarning ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                  {formatValue(current, micro.unit)} / {micro.target} {micro.unit}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
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
