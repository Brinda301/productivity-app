'use client';
import { useState } from 'react';
import type { FoodTemplate } from '../types';

interface FoodQuickAddProps {
  foods: FoodTemplate[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddFood: (food: FoodTemplate, servingSize: number) => void;
  onOpenCustomFoodForm: () => void;
}

function FoodChip({
  food,
  onAdd,
}: {
  food: FoodTemplate;
  onAdd: (food: FoodTemplate, servingSize: number) => void;
}) {
  const [servingSize, setServingSize] = useState(100);
  const [editing, setEditing] = useState(false);

  const scaledCalories = Math.round((food.calories * servingSize) / 100);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all">
      <button
        className="w-full text-left"
        onClick={() => onAdd(food, servingSize)}
      >
        <p className="text-sm font-medium text-gray-900 leading-tight truncate">{food.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{scaledCalories} kcal</p>
      </button>

      <div className="flex items-center gap-1 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setServingSize(Math.max(10, servingSize - 25));
          }}
          className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold"
        >
          -
        </button>

        {editing ? (
          <input
            type="number"
            value={servingSize}
            min={1}
            onChange={(e) => setServingSize(Math.max(1, parseInt(e.target.value) || 1))}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            autoFocus
            className="w-14 text-center text-xs border border-gray-300 rounded px-1 py-0.5"
          />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            className="flex-1 text-center text-xs text-gray-600 hover:text-blue-600"
          >
            {servingSize}g
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setServingSize(servingSize + 25);
          }}
          className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function FoodQuickAdd({
  foods,
  searchQuery,
  onSearchChange,
  onAddFood,
  onOpenCustomFoodForm,
}: FoodQuickAddProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Quick Add Food</h3>
        <button
          onClick={onOpenCustomFoodForm}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Custom Food
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search foods..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Food chips grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
        {foods.map((food) => (
          <FoodChip key={food.id} food={food} onAdd={onAddFood} />
        ))}
      </div>

      {foods.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">
          {searchQuery ? 'No foods match your search.' : 'No foods available.'}
        </p>
      )}
    </div>
  );
}
