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

  const totals = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        acc.fiber += item.fiber || 0;
        acc.sugar += item.sugar || 0;
        acc.vitaminD += item.vitaminD || 0;
        acc.calcium += item.calcium || 0;
        acc.iron += item.iron || 0;
        acc.magnesium += item.magnesium || 0;
        acc.zinc += item.zinc || 0;
        acc.potassium += item.potassium || 0;
        acc.sodium += item.sodium || 0;
        acc.omega3 += item.omega3 || 0;
        acc.vitaminB6 += item.vitaminB6 || 0;
        acc.vitaminB12 += item.vitaminB12 || 0;
        acc.folate += item.folate || 0;
        acc.vitaminC += item.vitaminC || 0;
      });
      return acc;
    },
    {
      calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0,
      vitaminD: 0, calcium: 0, iron: 0, magnesium: 0, zinc: 0,
      potassium: 0, sodium: 0, omega3: 0, vitaminB6: 0, vitaminB12: 0,
      folate: 0, vitaminC: 0,
    }
  );

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
