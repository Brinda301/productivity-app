import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

const TARGETS = {
  calories: 3000,
  protein: 140,
  carbs: 400,
  fat: 80,
};

// GET /api/diet/summary/monthly?year=2026&month=2
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const meals = await prisma.meal.findMany({
    where: {
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    include: { items: true },
  });

  // Group meals by day
  const dayMap = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();

  for (const meal of meals) {
    const dateKey = meal.date.toISOString().split('T')[0];
    if (!dayMap.has(dateKey)) {
      dayMap.set(dateKey, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
    const day = dayMap.get(dateKey)!;
    for (const item of meal.items) {
      day.calories += item.calories;
      day.protein += item.protein;
      day.carbs += item.carbs;
      day.fat += item.fat;
    }
  }

  // Calculate scores for each day in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const totals = dayMap.get(dateKey);

    if (totals) {
      const calScore = Math.min(totals.calories / TARGETS.calories, 1);
      const proteinScore = Math.min(totals.protein / TARGETS.protein, 1);
      const carbScore = Math.min(totals.carbs / TARGETS.carbs, 1);
      const fatScore = Math.min(totals.fat / TARGETS.fat, 1);
      const score = (calScore + proteinScore + carbScore + fatScore) / 4;
      days.push({ date: dateKey, score, hasData: true });
    } else {
      days.push({ date: dateKey, score: 0, hasData: false });
    }
  }

  return NextResponse.json({ year, month, days });
}
