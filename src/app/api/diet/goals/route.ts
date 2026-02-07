import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/diet/goals — get nutrition goals
export async function GET() {
  const goals = await prisma.dailyNutritionGoal.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(goals);
}

// POST /api/diet/goals — create or update nutrition goal
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Deactivate all other goals if this is active
  if (body.isActive) {
    await prisma.dailyNutritionGoal.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }
  
  const goal = await prisma.dailyNutritionGoal.create({ data: body });
  
  return NextResponse.json(goal, { status: 201 });
}
