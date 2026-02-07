import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/fitness/goals/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const goal = await prisma.fitnessGoal.findUnique({
    where: { id },
  });
  
  if (!goal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(goal);
}

// PATCH /api/fitness/goals/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.deadline) body.deadline = new Date(body.deadline);
  
  // Check if goal is completed
  if (body.currentValue !== undefined) {
    const goal = await prisma.fitnessGoal.findUnique({ where: { id } });
    if (goal && body.currentValue >= goal.targetValue) {
      body.completed = true;
    }
  }
  
  const goal = await prisma.fitnessGoal.update({
    where: { id },
    data: body,
  });
  
  return NextResponse.json(goal);
}

// DELETE /api/fitness/goals/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.fitnessGoal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
