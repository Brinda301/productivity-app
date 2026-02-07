'use client';
import { useState } from 'react';
import { useFitness } from '@/modules/fitness/hooks/useFitness';
import WorkoutLog from '@/modules/fitness/components/WorkoutLog';
import GoalTracker from '@/modules/fitness/components/GoalTracker';
import ProgressChart from '@/modules/fitness/components/ProgressChart';
import ExerciseLibrary from '@/modules/fitness/components/ExerciseLibrary';
import Modal from '@/shared/components/Modal';
import type { Workout, WorkoutFormData, ExerciseFormData, ExerciseSetFormData } from '@/modules/fitness/types';

export default function FitnessPage() {
  const { workouts, goals, progress, loading, createWorkout, deleteWorkout, updateGoal, refetch } = useFitness();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const [formData, setFormData] = useState<WorkoutFormData>({
    name: '',
    date: new Date(),
    duration: undefined,
    notes: '',
    exercises: [{ name: '', type: 'strength', sets: [{ setNumber: 1, reps: 10, weight: 0 }] }],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      date: new Date(),
      duration: undefined,
      notes: '',
      exercises: [{ name: '', type: 'strength', sets: [{ setNumber: 1, reps: 10, weight: 0 }] }],
    });
  };

  const handleCreateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    const validExercises = formData.exercises?.filter((ex) => ex.name.trim());
    await createWorkout({ ...formData, exercises: validExercises });
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleDeleteWorkout = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      await deleteWorkout(id);
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...(formData.exercises || []), { name: '', type: 'strength', sets: [{ setNumber: 1, reps: 10, weight: 0 }] }],
    });
  };

  const updateExercise = (index: number, updates: Partial<ExerciseFormData>) => {
    const exercises = [...(formData.exercises || [])];
    exercises[index] = { ...exercises[index], ...updates };
    setFormData({ ...formData, exercises });
  };

  const addSet = (exerciseIndex: number) => {
    const exercises = [...(formData.exercises || [])];
    const sets = exercises[exerciseIndex].sets || [];
    exercises[exerciseIndex].sets = [...sets, { setNumber: sets.length + 1, reps: 10, weight: 0 }];
    setFormData({ ...formData, exercises });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, updates: Partial<ExerciseSetFormData>) => {
    const exercises = [...(formData.exercises || [])];
    const sets = [...(exercises[exerciseIndex].sets || [])];
    sets[setIndex] = { ...sets[setIndex], ...updates };
    exercises[exerciseIndex].sets = sets;
    setFormData({ ...formData, exercises });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fitness</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            📚 Exercise Library
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Log Workout</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Workouts */}
        <div className="lg:col-span-2 space-y-6">
          <WorkoutLog
            workouts={workouts}
            loading={loading}
            onEdit={handleEditWorkout}
            onDelete={handleDeleteWorkout}
          />
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <GoalTracker
            goals={goals}
            loading={loading}
            onUpdate={(id, value) => updateGoal(id, { currentValue: value })}
          />
          <ProgressChart progress={progress} />
        </div>
      </div>

      {/* Exercise Library Modal */}
      <Modal
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        title="Exercise Library"
        size="lg"
      >
        <ExerciseLibrary
          onSelect={(exercise) => {
            setFormData({
              ...formData,
              exercises: [
                ...(formData.exercises || []),
                { name: exercise.name, type: exercise.type, sets: [{ setNumber: 1, reps: 10, weight: 0 }] },
              ],
            });
            setShowLibrary(false);
            setIsModalOpen(true);
          }}
        />
      </Modal>

      {/* Create Workout Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Log Workout"
        size="xl"
      >
        <form onSubmit={handleCreateWorkout} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Push Day, Cardio"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date.toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="45"
            />
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Exercises</label>
              <button
                type="button"
                onClick={addExercise}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Exercise
              </button>
            </div>

            <div className="space-y-4">
              {formData.exercises?.map((exercise, exIndex) => (
                <div key={exIndex} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => updateExercise(exIndex, { name: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Exercise name"
                    />
                    <select
                      value={exercise.type}
                      onChange={(e) => updateExercise(exIndex, { type: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                    </select>
                  </div>

                  {/* Sets */}
                  <div className="space-y-2">
                    {exercise.sets?.map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12">Set {set.setNumber}</span>
                        <input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exIndex, setIndex, { weight: parseFloat(e.target.value) || 0 })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="kg"
                        />
                        <span className="text-xs text-gray-500">kg ×</span>
                        <input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exIndex, setIndex, { reps: parseInt(e.target.value) || 0 })}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="reps"
                        />
                        <span className="text-xs text-gray-500">reps</span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addSet(exIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      + Add Set
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); resetForm(); }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Log Workout
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Workout Modal */}
      <Modal
        isOpen={!!editingWorkout}
        onClose={() => setEditingWorkout(null)}
        title="Edit Workout"
        size="lg"
      >
        {editingWorkout && (
          <div className="text-center py-8 text-gray-500">
            <p>Workout editing coming soon!</p>
            <p className="text-sm mt-2">For now, delete and recreate the workout.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
