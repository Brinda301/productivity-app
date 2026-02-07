'use client';
import type { Workout, ExerciseType, EXERCISE_TYPE_ICONS } from '../types';

interface WorkoutLogProps {
  workouts: Workout[];
  loading?: boolean;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

const exerciseTypeIcons: Record<ExerciseType, string> = {
  strength: '🏋️',
  cardio: '🏃',
  flexibility: '🧘',
  other: '⚡',
};

export default function WorkoutLog({ workouts, loading, onEdit, onDelete }: WorkoutLogProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse border border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-2">💪</p>
        <p className="text-lg">No workouts logged yet</p>
        <p className="text-sm mt-1">Start tracking your fitness journey</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const totalVolume = workout.exercises.reduce((acc, exercise) => {
          return acc + exercise.sets.reduce((setAcc, set) => {
            return setAcc + (set.reps || 0) * (set.weight || 0);
          }, 0);
        }, 0);

        return (
          <div key={workout.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(workout.date).toLocaleDateString('en-US', { 
                    weekday: 'short', month: 'short', day: 'numeric' 
                  })}
                  {workout.duration && ` • ${workout.duration} min`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {workout.exercises.length} exercises
                </span>
                <button
                  onClick={() => onEdit(workout)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(workout.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Exercises */}
            <div className="divide-y divide-gray-100">
              {workout.exercises.map((exercise) => (
                <div key={exercise.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{exerciseTypeIcons[exercise.type as ExerciseType] || '⚡'}</span>
                    <span className="font-medium text-gray-900">{exercise.name}</span>
                    {exercise.type === 'cardio' && exercise.distance && (
                      <span className="text-xs text-gray-500">
                        {exercise.distance} km {exercise.pace && `@ ${exercise.pace} min/km`}
                      </span>
                    )}
                  </div>
                  
                  {exercise.sets.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exercise.sets.map((set) => (
                        <span
                          key={set.id}
                          className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
                        >
                          {set.weight && `${set.weight}kg`}
                          {set.weight && set.reps && ' × '}
                          {set.reps && `${set.reps} reps`}
                          {set.duration && `${set.duration}s`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            {totalVolume > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                Total Volume: {totalVolume.toLocaleString()} kg
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
