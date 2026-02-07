'use client';
import { useState } from 'react';

interface Exercise {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  muscle?: string;
  equipment?: string;
}

const EXERCISE_LIBRARY: Exercise[] = [
  // Chest
  { name: 'Bench Press', type: 'strength', muscle: 'Chest', equipment: 'Barbell' },
  { name: 'Incline Dumbbell Press', type: 'strength', muscle: 'Chest', equipment: 'Dumbbells' },
  { name: 'Push-ups', type: 'strength', muscle: 'Chest', equipment: 'Bodyweight' },
  { name: 'Cable Flyes', type: 'strength', muscle: 'Chest', equipment: 'Cable' },
  
  // Back
  { name: 'Deadlift', type: 'strength', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Pull-ups', type: 'strength', muscle: 'Back', equipment: 'Bodyweight' },
  { name: 'Barbell Rows', type: 'strength', muscle: 'Back', equipment: 'Barbell' },
  { name: 'Lat Pulldown', type: 'strength', muscle: 'Back', equipment: 'Cable' },
  
  // Legs
  { name: 'Squat', type: 'strength', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Leg Press', type: 'strength', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Romanian Deadlift', type: 'strength', muscle: 'Legs', equipment: 'Barbell' },
  { name: 'Lunges', type: 'strength', muscle: 'Legs', equipment: 'Dumbbells' },
  { name: 'Leg Curl', type: 'strength', muscle: 'Legs', equipment: 'Machine' },
  { name: 'Calf Raises', type: 'strength', muscle: 'Legs', equipment: 'Machine' },
  
  // Shoulders
  { name: 'Overhead Press', type: 'strength', muscle: 'Shoulders', equipment: 'Barbell' },
  { name: 'Lateral Raises', type: 'strength', muscle: 'Shoulders', equipment: 'Dumbbells' },
  { name: 'Face Pulls', type: 'strength', muscle: 'Shoulders', equipment: 'Cable' },
  
  // Arms
  { name: 'Bicep Curls', type: 'strength', muscle: 'Arms', equipment: 'Dumbbells' },
  { name: 'Tricep Pushdown', type: 'strength', muscle: 'Arms', equipment: 'Cable' },
  { name: 'Hammer Curls', type: 'strength', muscle: 'Arms', equipment: 'Dumbbells' },
  { name: 'Skull Crushers', type: 'strength', muscle: 'Arms', equipment: 'Barbell' },
  
  // Core
  { name: 'Plank', type: 'strength', muscle: 'Core', equipment: 'Bodyweight' },
  { name: 'Crunches', type: 'strength', muscle: 'Core', equipment: 'Bodyweight' },
  { name: 'Hanging Leg Raises', type: 'strength', muscle: 'Core', equipment: 'Bodyweight' },
  
  // Cardio
  { name: 'Running', type: 'cardio' },
  { name: 'Cycling', type: 'cardio' },
  { name: 'Rowing', type: 'cardio' },
  { name: 'Jump Rope', type: 'cardio' },
  { name: 'Stair Climber', type: 'cardio' },
  
  // Flexibility
  { name: 'Stretching', type: 'flexibility' },
  { name: 'Yoga', type: 'flexibility' },
  { name: 'Foam Rolling', type: 'flexibility' },
];

interface ExerciseLibraryProps {
  onSelect?: (exercise: Exercise) => void;
}

export default function ExerciseLibrary({ onSelect }: ExerciseLibraryProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');

  const muscles = Array.from(new Set(EXERCISE_LIBRARY.filter((e) => e.muscle).map((e) => e.muscle!)));

  const filteredExercises = EXERCISE_LIBRARY.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || exercise.type === typeFilter;
    const matchesMuscle = muscleFilter === 'all' || exercise.muscle === muscleFilter;
    return matchesSearch && matchesType && matchesMuscle;
  });

  const typeIcons = {
    strength: '🏋️',
    cardio: '🏃',
    flexibility: '🧘',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Exercise Library</h3>

      {/* Filters */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
          </select>
          <select
            value={muscleFilter}
            onChange={(e) => setMuscleFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Muscles</option>
            {muscles.map((muscle) => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.name}
            onClick={() => onSelect?.(exercise)}
            className={`p-3 rounded-lg border border-gray-200 ${
              onSelect ? 'cursor-pointer hover:bg-gray-50' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{typeIcons[exercise.type]}</span>
              <span className="font-medium text-gray-900">{exercise.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              {exercise.muscle && <span>{exercise.muscle}</span>}
              {exercise.equipment && <span>• {exercise.equipment}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
