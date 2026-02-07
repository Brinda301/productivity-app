'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Meal, MealFormData, NutritionSummary } from '../types';

export function useDiet(date?: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [summary, setSummary] = useState<NutritionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date();
  const dateString = targetDate.toISOString().split('T')[0];

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [mealsRes, summaryRes] = await Promise.all([
        fetch(`/api/diet/meals?date=${dateString}`),
        fetch(`/api/diet/summary?date=${dateString}`),
      ]);
      
      if (!mealsRes.ok) throw new Error('Failed to fetch meals');
      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      
      const [mealsData, summaryData] = await Promise.all([
        mealsRes.json(),
        summaryRes.json(),
      ]);
      
      setMeals(mealsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dateString]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const createMeal = async (meal: MealFormData) => {
    const res = await fetch('/api/diet/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    });
    if (!res.ok) throw new Error('Failed to create meal');
    const newMeal = await res.json();
    setMeals((prev) => [...prev, newMeal]);
    await fetchMeals(); // Refresh summary
    return newMeal;
  };

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    const res = await fetch(`/api/diet/meals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update meal');
    const updated = await res.json();
    setMeals((prev) => prev.map((m) => (m.id === id ? updated : m)));
    await fetchMeals(); // Refresh summary
    return updated;
  };

  const deleteMeal = async (id: string) => {
    const res = await fetch(`/api/diet/meals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete meal');
    setMeals((prev) => prev.filter((m) => m.id !== id));
    await fetchMeals(); // Refresh summary
  };

  return {
    meals,
    summary,
    loading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
    refetch: fetchMeals,
  };
}
