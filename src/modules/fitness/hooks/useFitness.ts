'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Workout, WorkoutFormData, ProgressData } from '../types';
import type { FitnessGoal } from '@prisma/client';

export function useFitness(dateRange?: { from?: Date; to?: Date }) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const workoutParams = new URLSearchParams();
    if (dateRange?.from) workoutParams.set('from', dateRange.from.toISOString());
    if (dateRange?.to) workoutParams.set('to', dateRange.to.toISOString());

    try {
      const [workoutsRes, goalsRes, progressRes] = await Promise.all([
        fetch(`/api/fitness/workouts?${workoutParams}`),
        fetch('/api/fitness/goals'),
        fetch('/api/fitness/progress?days=30'),
      ]);

      if (!workoutsRes.ok) throw new Error('Failed to fetch workouts');
      if (!goalsRes.ok) throw new Error('Failed to fetch goals');
      if (!progressRes.ok) throw new Error('Failed to fetch progress');

      const [workoutsData, goalsData, progressData] = await Promise.all([
        workoutsRes.json(),
        goalsRes.json(),
        progressRes.json(),
      ]);

      setWorkouts(workoutsData);
      setGoals(goalsData);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dateRange?.from, dateRange?.to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createWorkout = async (data: WorkoutFormData) => {
    const res = await fetch('/api/fitness/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create workout');
    const newWorkout = await res.json();
    setWorkouts((prev) => [newWorkout, ...prev]);
    await fetchData();
    return newWorkout;
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    const res = await fetch(`/api/fitness/workouts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update workout');
    const updated = await res.json();
    setWorkouts((prev) => prev.map((w) => (w.id === id ? updated : w)));
    return updated;
  };

  const deleteWorkout = async (id: string) => {
    const res = await fetch(`/api/fitness/workouts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete workout');
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const createGoal = async (data: any) => {
    const res = await fetch('/api/fitness/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create goal');
    const newGoal = await res.json();
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = async (id: string, updates: Partial<FitnessGoal>) => {
    const res = await fetch(`/api/fitness/goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update goal');
    const updated = await res.json();
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  };

  return {
    workouts,
    goals,
    progress,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    createGoal,
    updateGoal,
    refetch: fetchData,
  };
}
