'use client';
import { useState, useCallback, useMemo } from 'react';
import type { FoodTemplate } from '../types';
import { DEFAULT_FOODS } from '../constants';

const CUSTOM_FOODS_KEY = 'diet-custom-foods';
const USAGE_COUNTS_KEY = 'diet-food-usage-counts';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useFoodDatabase() {
  const [customFoods, setCustomFoods] = useState<FoodTemplate[]>(() =>
    loadFromStorage(CUSTOM_FOODS_KEY, [])
  );
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>(() =>
    loadFromStorage(USAGE_COUNTS_KEY, {})
  );
  const [searchQuery, setSearchQuery] = useState('');

  const allFoods = useMemo(() => {
    const foods = [...DEFAULT_FOODS, ...customFoods];
    // Sort by usage frequency (most used first)
    return foods.sort((a, b) => (usageCounts[b.id] || 0) - (usageCounts[a.id] || 0));
  }, [customFoods, usageCounts]);

  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return allFoods;
    const query = searchQuery.toLowerCase();
    return allFoods.filter((food) => food.name.toLowerCase().includes(query));
  }, [allFoods, searchQuery]);

  const incrementUsage = useCallback((foodId: string) => {
    setUsageCounts((prev) => {
      const updated = { ...prev, [foodId]: (prev[foodId] || 0) + 1 };
      saveToStorage(USAGE_COUNTS_KEY, updated);
      return updated;
    });
  }, []);

  const addCustomFood = useCallback((food: Omit<FoodTemplate, 'id' | 'isCustom'>) => {
    const newFood: FoodTemplate = {
      ...food,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    setCustomFoods((prev) => {
      const updated = [...prev, newFood];
      saveToStorage(CUSTOM_FOODS_KEY, updated);
      return updated;
    });
    return newFood;
  }, []);

  const removeCustomFood = useCallback((foodId: string) => {
    setCustomFoods((prev) => {
      const updated = prev.filter((f) => f.id !== foodId);
      saveToStorage(CUSTOM_FOODS_KEY, updated);
      return updated;
    });
  }, []);

  return {
    foods: filteredFoods,
    allFoods,
    searchQuery,
    setSearchQuery,
    incrementUsage,
    addCustomFood,
    removeCustomFood,
    usageCounts,
  };
}
