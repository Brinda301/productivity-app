import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/diet/summary — get nutrition summary for a date
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const meals = await prisma.meal.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: { items: true },
  });

  // Calculate totals
  const totals = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        acc.fiber += item.fiber || 0;
        acc.sugar += item.sugar || 0;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  // Get active goal
  const goal = await prisma.dailyNutritionGoal.findFirst({
    where: { isActive: true },
  });

  return NextResponse.json({
    date: targetDate.toISOString().split('T')[0],
    meals: meals.length,
    totals,
    goal: goal || null,
  });
}
