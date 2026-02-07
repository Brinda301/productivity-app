'use client';
import type { FitnessGoal } from '@prisma/client';
import type { GoalCategory, GOAL_CATEGORY_ICONS } from '../types';

interface GoalTrackerProps {
  goals: FitnessGoal[];
  loading?: boolean;
  onUpdate: (id: string, currentValue: number) => void;
}

const goalCategoryIcons: Record<GoalCategory, string> = {
  strength: '💪',
  cardio: '❤️',
  weight: '⚖️',
  body_comp: '📊',
};

export default function GoalTracker({ goals, loading, onUpdate }: GoalTrackerProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse border border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>No fitness goals set</p>
        <p className="text-sm mt-1">Create goals to track your progress</p>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-4">
      {activeGoals.map((goal) => {
        const progress = (goal.currentValue / goal.targetValue) * 100;
        const isClose = progress >= 80;

        return (
          <div key={goal.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{goalCategoryIcons[goal.category as GoalCategory] || '🎯'}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  {goal.deadline && (
                    <p className="text-xs text-gray-500">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  const newValue = prompt('Update current value:', String(goal.currentValue));
                  if (newValue) onUpdate(goal.id, parseFloat(newValue));
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Update
              </button>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">
                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <span className={`font-medium ${isClose ? 'text-green-600' : 'text-gray-700'}`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    progress >= 100 ? 'bg-green-500' : isClose ? 'bg-blue-500' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {completedGoals.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            ✅ Completed ({completedGoals.length})
          </h4>
          <div className="space-y-2">
            {completedGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="text-sm text-gray-500 flex items-center gap-2">
                <span>{goalCategoryIcons[goal.category as GoalCategory]}</span>
                <span className="line-through">{goal.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
