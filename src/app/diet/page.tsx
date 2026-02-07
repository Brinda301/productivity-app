'use client';
import { useState } from 'react';
import { useDiet } from '@/modules/diet/hooks/useDiet';
import FoodLog from '@/modules/diet/components/FoodLog';
import MacroChart from '@/modules/diet/components/MacroChart';
import MicroTracker from '@/modules/diet/components/MicroTracker';
import MealPlanner from '@/modules/diet/components/MealPlanner';
import Modal from '@/shared/components/Modal';
import type { Meal, MealFormData } from '@/modules/diet/types';

export default function DietPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { meals, summary, loading, createMeal, deleteMeal, refetch } = useDiet(selectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  const handleCreateMeal = async (data: MealFormData) => {
    await createMeal(data);
    setIsModalOpen(false);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
  };

  const handleDeleteMeal = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      await deleteMeal(id);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Diet Tracker</h1>
        <div className="flex items-center gap-3">
          {/* Date Navigation */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`px-3 py-1.5 text-sm rounded ${isToday ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
            >
              {isToday ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Log Meal</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Meals */}
        <div className="lg:col-span-2 space-y-6">
          <FoodLog
            meals={meals}
            loading={loading}
            onEdit={handleEditMeal}
            onDelete={handleDeleteMeal}
          />
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <MacroChart summary={summary} />
          <MicroTracker summary={summary} />
        </div>
      </div>

      {/* Create Meal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Meal"
        size="xl"
      >
        <MealPlanner
          onSubmit={handleCreateMeal}
          onCancel={() => setIsModalOpen(false)}
          initialDate={selectedDate}
        />
      </Modal>

      {/* Edit Meal Modal */}
      <Modal
        isOpen={!!editingMeal}
        onClose={() => setEditingMeal(null)}
        title="Edit Meal"
        size="xl"
      >
        {editingMeal && (
          <div className="text-center py-8 text-gray-500">
            <p>Meal editing coming soon!</p>
            <p className="text-sm mt-2">For now, delete and recreate the meal.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
