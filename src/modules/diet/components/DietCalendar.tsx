'use client';
import { useMemo } from 'react';
import type { DayScore } from '../types';

interface DietCalendarProps {
  year: number;
  month: number; // 1-indexed
  scores: DayScore[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (year: number, month: number) => void;
  loading?: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getScoreColor(score: number, hasData: boolean, isFuture: boolean): string {
  if (isFuture) return 'bg-gray-100 text-gray-400';
  if (!hasData) return 'bg-red-100 text-red-700';
  if (score >= 0.9) return 'bg-green-100 text-green-700';
  if (score >= 0.6) return 'bg-yellow-100 text-yellow-700';
  if (score >= 0.3) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
}

function getScoreDot(score: number, hasData: boolean, isFuture: boolean): string {
  if (isFuture) return 'bg-gray-300';
  if (!hasData) return 'bg-red-400';
  if (score >= 0.9) return 'bg-green-500';
  if (score >= 0.6) return 'bg-yellow-500';
  if (score >= 0.3) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function DietCalendar({
  year,
  month,
  scores,
  selectedDate,
  onSelectDate,
  onChangeMonth,
  loading,
}: DietCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const scoreMap = new Map<string, DayScore>();
    for (const s of scores) {
      scoreMap.set(s.date, s);
    }

    const days: Array<{
      day: number;
      date: Date;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isFuture: boolean;
      score: DayScore | null;
    }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const date = new Date(year, month - 2, d);
      days.push({
        day: d,
        date,
        dateKey: '',
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isFuture: date > today,
        score: null,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        date,
        dateKey,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: date.toDateString() === selectedDate.toDateString(),
        isFuture: date > today,
        score: scoreMap.get(dateKey) || null,
      });
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month, d);
      days.push({
        day: d,
        date,
        dateKey: '',
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isFuture: date > today,
        score: null,
      });
    }

    return days;
  }, [year, month, scores, selectedDate, today]);

  const prevMonth = () => {
    if (month === 1) onChangeMonth(year - 1, 12);
    else onChangeMonth(year, month - 1);
  };

  const nextMonth = () => {
    if (month === 12) onChangeMonth(year + 1, 1);
    else onChangeMonth(year, month + 1);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-gray-900">
          {MONTH_NAMES[month - 1]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-gray-500 py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const scoreData = day.score;
          const hasData = scoreData?.hasData ?? false;
          const score = scoreData?.score ?? 0;

          return (
            <button
              key={i}
              onClick={() => day.isCurrentMonth && onSelectDate(day.date)}
              disabled={!day.isCurrentMonth}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                ${!day.isCurrentMonth ? 'text-gray-300 cursor-default' : 'cursor-pointer hover:ring-2 hover:ring-blue-300'}
                ${day.isSelected ? 'ring-2 ring-blue-500 font-bold' : ''}
                ${day.isToday ? 'font-bold' : ''}
                ${day.isCurrentMonth ? getScoreColor(score, hasData, day.isFuture) : ''}
              `}
            >
              <span className={day.isToday ? 'underline decoration-2 underline-offset-2' : ''}>
                {day.day}
              </span>
              {day.isCurrentMonth && !day.isFuture && (
                <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${getScoreDot(score, hasData, day.isFuture)}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> 90%+</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> 60-89%</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> 30-59%</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> &lt;30%</span>
      </div>
    </div>
  );
}
