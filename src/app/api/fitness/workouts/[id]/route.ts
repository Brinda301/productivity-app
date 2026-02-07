import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/fitness/workouts/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        include: { sets: true },
        orderBy: { order: 'asc' },
      },
    },
  });
  
  if (!workout) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(workout);
}

// PATCH /api/fitness/workouts/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.date) body.date = new Date(body.date);
  
  const workout = await prisma.workout.update({
    where: { id },
    data: body,
    include: {
      exercises: {
        include: { sets: true },
        orderBy: { order: 'asc' },
      },
    },
  });
  
  return NextResponse.json(workout);
}

// DELETE /api/fitness/workouts/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.workout.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
