import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/fitness/goals — list fitness goals
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const completed = searchParams.get('completed');

  const where: any = {};
  if (category) where.category = category;
  if (completed !== null) where.completed = completed === 'true';

  const goals = await prisma.fitnessGoal.findMany({
    where,
    orderBy: [{ completed: 'asc' }, { deadline: 'asc' }],
  });

  return NextResponse.json(goals);
}

// POST /api/fitness/goals — create a fitness goal
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.deadline) body.deadline = new Date(body.deadline);
  
  const goal = await prisma.fitnessGoal.create({ data: body });
  
  return NextResponse.json(goal, { status: 201 });
}
