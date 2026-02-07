import { NextRequest, NextResponse } from 'next/server';
import { sendDailyDigest } from '@/shared/lib/email';
import { prisma } from '@/shared/lib/prisma';

// POST /api/sync/email — send daily digest email
export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Get tasks due today
  const tasksToday = await prisma.task.count({
    where: {
      dueDate: { gte: startOfDay, lte: endOfDay },
      completed: false,
    },
  });

  // Get interviews today
  const interviewsToday = await prisma.interview.count({
    where: {
      scheduledAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  // Get calories logged today
  const meals = await prisma.meal.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: { items: true },
  });

  const caloriesLogged = meals.reduce((acc, meal) => {
    return acc + meal.items.reduce((itemAcc, item) => itemAcc + item.calories, 0);
  }, 0);

  // Get calorie goal
  const goal = await prisma.dailyNutritionGoal.findFirst({
    where: { isActive: true },
  });

  try {
    await sendDailyDigest(email, {
      tasksToday,
      interviewsToday,
      caloriesLogged: Math.round(caloriesLogged),
      calorieGoal: goal?.calories || 2000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
