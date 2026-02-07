'use client';
import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import type { FoodTemplate } from '../types';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Omit<FoodTemplate, 'id' | 'isCustom'>) => void;
}

const INITIAL_STATE = {
  name: '',
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
  vitaminD: 0, calcium: 0, iron: 0, magnesium: 0, zinc: 0,
  potassium: 0, sodium: 0, omega3: 0, vitaminB6: 0, vitaminB12: 0,
  folate: 0, vitaminC: 0,
};

const MACRO_FIELDS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
];

const MICRO_FIELDS = [
  { key: 'vitaminD', label: 'Vitamin D', unit: 'IU' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  { key: 'zinc', label: 'Zinc', unit: 'mg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'omega3', label: 'Omega-3', unit: 'mg' },
  { key: 'vitaminB6', label: 'Vitamin B6', unit: 'mg' },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'folate', label: 'Folate', unit: 'mcg' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
];

export default function CustomFoodModal({ isOpen, onClose, onSave }: CustomFoodModalProps) {
  const [form, setForm] = useState(INITIAL_STATE);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'name' ? value : parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    setForm(INITIAL_STATE);
    onClose();
  };

  const handleCancel = () => {
    setForm(INITIAL_STATE);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Add Custom Food" size="xl">
      <div className="space-y-5">
        {/* Food name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Grilled Chicken Thigh"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">All values should be per 100g serving</p>
        </div>

        {/* Macros */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Macronutrients</h4>
          <div className="grid grid-cols-3 gap-3">
            {MACRO_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-xs text-gray-500">{field.label} ({field.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={(form as Record<string, number | string>)[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Micros */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Micronutrients</h4>
          <div className="grid grid-cols-3 gap-3">
            {MICRO_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="text-xs text-gray-500">{field.label} ({field.unit})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={(form as Record<string, number | string>)[field.key] || ''}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Save Food
          </button>
        </div>
      </div>
    </Modal>
  );
}
