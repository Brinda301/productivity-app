import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// POST /api/diet/food-items — quick-add a food item to a day
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date: dateString, ...foodData } = body;

  const targetDate = new Date(dateString);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Find or create a "Quick Add" meal for this day
  let meal = await prisma.meal.findFirst({
    where: {
      name: 'Quick Add',
      date: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (!meal) {
    meal = await prisma.meal.create({
      data: {
        name: 'Quick Add',
        date: startOfDay,
      },
    });
  }

  // Create the food item
  const foodItem = await prisma.foodItem.create({
    data: {
      ...foodData,
      mealId: meal.id,
    },
  });

  return NextResponse.json(foodItem, { status: 201 });
}
