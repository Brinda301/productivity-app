'use client';
import { useState, useCallback } from 'react';
import { useDiet, useMonthlyScores } from '@/modules/diet/hooks/useDiet';
import { useFoodDatabase } from '@/modules/diet/hooks/useFoodDatabase';
import DietCalendar from '@/modules/diet/components/DietCalendar';
import MacroPanel from '@/modules/diet/components/MacroPanel';
import MicroPanel from '@/modules/diet/components/MicroPanel';
import DayMealLog from '@/modules/diet/components/DayMealLog';
import FoodQuickAdd from '@/modules/diet/components/FoodQuickAdd';
import CustomFoodModal from '@/modules/diet/components/CustomFoodModal';
import Toast from '@/modules/diet/components/Toast';
import type { FoodTemplate } from '@/modules/diet/types';

export default function DietPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const {
    summary,
    loading,
    allFoodItems,
    quickAddFood,
    deleteFoodItem,
  } = useDiet(selectedDate);

  const { scores, refetch: refetchScores } = useMonthlyScores(calendarYear, calendarMonth);

  const {
    foods,
    searchQuery,
    setSearchQuery,
    incrementUsage,
    addCustomFood,
  } = useFoodDatabase();

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const dismissToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // Update calendar view to match selected month
    setCalendarYear(date.getFullYear());
    setCalendarMonth(date.getMonth() + 1);
  };

  const handleChangeMonth = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  const handleAddFood = async (food: FoodTemplate, servingSize: number) => {
    try {
      await quickAddFood(food, servingSize);
      incrementUsage(food.id);
      showToast(`Added ${servingSize}g ${food.name}`);
      refetchScores();
    } catch {
      showToast('Failed to add food item');
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    try {
      await deleteFoodItem(id);
      refetchScores();
    } catch {
      showToast('Failed to remove food item');
    }
  };

  const handleSaveCustomFood = (food: Omit<FoodTemplate, 'id' | 'isCustom'>) => {
    addCustomFood(food);
    showToast(`Added "${food.name}" to your food database`);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const dateLabel = isToday
    ? 'Today'
    : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Diet Tracker</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{dateLabel}</span>
          {!isToday && (
            <button
              onClick={() => handleSelectDate(new Date())}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            >
              Go to Today
            </button>
          )}
        </div>
      </div>

      {/* Top Row: Calendar + Macro/Micro Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <DietCalendar
            year={calendarYear}
            month={calendarMonth}
            scores={scores}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onChangeMonth={handleChangeMonth}
          />
        </div>

        {/* Macro & Micro Panels */}
        <div className="lg:col-span-3 space-y-6">
          <MacroPanel summary={summary} />
          <MicroPanel summary={summary} />
        </div>
      </div>

      {/* Meal Log */}
      <DayMealLog
        items={allFoodItems}
        loading={loading}
        onDelete={handleDeleteFoodItem}
      />

      {/* Food Quick-Add */}
      <FoodQuickAdd
        foods={foods}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddFood={handleAddFood}
        onOpenCustomFoodForm={() => setIsCustomFoodOpen(true)}
      />

      {/* Custom Food Modal */}
      <CustomFoodModal
        isOpen={isCustomFoodOpen}
        onClose={() => setIsCustomFoodOpen(false)}
        onSave={handleSaveCustomFood}
      />

      {/* Toast */}
      <Toast message={toastMessage} visible={toastVisible} onDismiss={dismissToast} />
    </div>
  );
}
