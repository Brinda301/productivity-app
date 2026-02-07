'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { NutritionSummary } from '../types';

interface MacroChartProps {
  summary: NutritionSummary | null;
}

const MACRO_COLORS = {
  protein: '#ef4444',
  carbs: '#3b82f6',
  fat: '#f59e0b',
};

export default function MacroChart({ summary }: MacroChartProps) {
  if (!summary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        No data available
      </div>
    );
  }

  const { totals, goal } = summary;
  
  // Macro data for pie chart
  const macroData = [
    { name: 'Protein', value: totals.protein, color: MACRO_COLORS.protein },
    { name: 'Carbs', value: totals.carbs, color: MACRO_COLORS.carbs },
    { name: 'Fat', value: totals.fat, color: MACRO_COLORS.fat },
  ];

  const totalMacros = totals.protein + totals.carbs + totals.fat;
  const calorieProgress = goal ? (totals.calories / goal.calories) * 100 : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Today's Macros</h3>
      
      {/* Calorie progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Calories</span>
          <span className="font-medium">
            {Math.round(totals.calories)} / {goal?.calories || '—'} kcal
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              calorieProgress > 100 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(calorieProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Macro pie chart */}
      {totalMacros > 0 ? (
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${Math.round(Number(value))}g`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No meals logged today
        </div>
      )}

      {/* Macro breakdown */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500">{Math.round(totals.protein)}g</p>
          <p className="text-xs text-gray-500">Protein</p>
          {goal && (
            <p className="text-xs text-gray-400">{Math.round((totals.protein / goal.protein) * 100)}%</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">{Math.round(totals.carbs)}g</p>
          <p className="text-xs text-gray-500">Carbs</p>
          {goal && (
            <p className="text-xs text-gray-400">{Math.round((totals.carbs / goal.carbs) * 100)}%</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-500">{Math.round(totals.fat)}g</p>
          <p className="text-xs text-gray-500">Fat</p>
          {goal && (
            <p className="text-xs text-gray-400">{Math.round((totals.fat / goal.fat) * 100)}%</p>
          )}
        </div>
      </div>
    </div>
  );
}
