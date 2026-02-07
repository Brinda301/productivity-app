'use client';
import { useState } from 'react';
import type { MealFormData, FoodItemFormData, MealType } from '../types';

interface MealPlannerProps {
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
  initialDate?: Date;
}

const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const EMPTY_FOOD_ITEM: FoodItemFormData = {
  name: '',
  servingSize: 100,
  servingUnit: 'g',
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

export default function MealPlanner({ onSubmit, onCancel, initialDate }: MealPlannerProps) {
  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [date, setDate] = useState(initialDate || new Date());
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FoodItemFormData[]>([{ ...EMPTY_FOOD_ITEM }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { ...EMPTY_FOOD_ITEM }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<FoodItemFormData>) => {
    setItems(items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter((item) => item.name.trim());
    if (validItems.length === 0) return;
    
    setLoading(true);
    try {
      await onSubmit({
        name: mealType,
        date,
        notes: notes || undefined,
        items: validItems,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Meal Type & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {MEAL_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Food Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Food Items</label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Food name"
                  value={item.name}
                  onChange={(e) => updateItem(index, { name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Serving</label>
                  <input
                    type="number"
                    value={item.servingSize}
                    onChange={(e) => updateItem(index, { servingSize: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Unit</label>
                  <select
                    value={item.servingUnit}
                    onChange={(e) => updateItem(index, { servingUnit: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="oz">oz</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Calories</label>
                  <input
                    type="number"
                    value={item.calories}
                    onChange={(e) => updateItem(index, { calories: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Protein</label>
                  <input
                    type="number"
                    value={item.protein}
                    onChange={(e) => updateItem(index, { protein: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Carbs</label>
                  <input
                    type="number"
                    value={item.carbs}
                    onChange={(e) => updateItem(index, { carbs: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Fat</label>
                  <input
                    type="number"
                    value={item.fat}
                    onChange={(e) => updateItem(index, { fat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fiber</label>
                  <input
                    type="number"
                    value={item.fiber || ''}
                    onChange={(e) => updateItem(index, { fiber: parseFloat(e.target.value) || undefined })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Sugar</label>
                  <input
                    type="number"
                    value={item.sugar || ''}
                    onChange={(e) => updateItem(index, { sugar: parseFloat(e.target.value) || undefined })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Optional notes..."
          rows={2}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || items.every((i) => !i.name.trim())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Log Meal'}
        </button>
      </div>
    </form>
  );
}
