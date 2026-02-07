'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Meal, MealFormData, NutritionSummary, FoodTemplate, DayScore } from '../types';
import type { FoodItem } from '@prisma/client';

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
    await fetchMeals();
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
    await fetchMeals();
    return updated;
  };

  const deleteMeal = async (id: string) => {
    const res = await fetch(`/api/diet/meals/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete meal');
    await fetchMeals();
  };

  // Quick-add a food item to the current day
  const quickAddFood = async (food: FoodTemplate, servingSize: number = 100): Promise<FoodItem> => {
    const scale = servingSize / 100;
    const res = await fetch('/api/diet/food-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: dateString,
        name: food.name,
        servingSize,
        servingUnit: 'g',
        calories: food.calories * scale,
        protein: food.protein * scale,
        carbs: food.carbs * scale,
        fat: food.fat * scale,
        fiber: food.fiber * scale,
        sugar: food.sugar * scale,
        vitaminD: food.vitaminD * scale,
        calcium: food.calcium * scale,
        iron: food.iron * scale,
        magnesium: food.magnesium * scale,
        zinc: food.zinc * scale,
        potassium: food.potassium * scale,
        sodium: food.sodium * scale,
        omega3: food.omega3 * scale,
        vitaminB6: food.vitaminB6 * scale,
        vitaminB12: food.vitaminB12 * scale,
        folate: food.folate * scale,
        vitaminC: food.vitaminC * scale,
      }),
    });
    if (!res.ok) throw new Error('Failed to add food item');
    const item = await res.json();
    await fetchMeals();
    return item;
  };

  // Delete a single food item
  const deleteFoodItem = async (id: string) => {
    const res = await fetch(`/api/diet/food-items/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete food item');
    await fetchMeals();
  };

  // Get all food items for the day as a flat list
  const allFoodItems = meals.flatMap((meal) =>
    meal.items.map((item) => ({ ...item, mealName: meal.name }))
  );

  return {
    meals,
    summary,
    loading,
    error,
    allFoodItems,
    createMeal,
    updateMeal,
    deleteMeal,
    quickAddFood,
    deleteFoodItem,
    refetch: fetchMeals,
  };
}

// Separate hook for monthly calendar data
export function useMonthlyScores(year: number, month: number) {
  const [scores, setScores] = useState<DayScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/diet/summary/monthly?year=${year}&month=${month}`);
      if (!res.ok) throw new Error('Failed to fetch monthly data');
      const data = await res.json();
      setScores(data.days);
    } catch {
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return { scores, loading, refetch: fetchScores };
}
