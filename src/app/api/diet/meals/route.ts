import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/diet/meals — list meals with optional date filter
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: any = {};
  
  if (date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    where.date = { gte: startOfDay, lte: endOfDay };
  } else if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const meals = await prisma.meal.findMany({
    where,
    include: { items: true },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(meals);
}

// POST /api/diet/meals — create a meal
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Parse date
  if (body.date) body.date = new Date(body.date);
  
  // Handle nested items creation
  const { items, ...mealData } = body;
  
  const meal = await prisma.meal.create({
    data: {
      ...mealData,
      items: items ? { create: items } : undefined,
    },
    include: { items: true },
  });
  
  return NextResponse.json(meal, { status: 201 });
}
