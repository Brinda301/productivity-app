import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/fitness/workouts — list workouts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const name = searchParams.get('name');

  const where: any = {};
  if (name) where.name = { contains: name };
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const workouts = await prisma.workout.findMany({
    where,
    include: {
      exercises: {
        include: { sets: true },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(workouts);
}

// POST /api/fitness/workouts — create a workout
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.date) body.date = new Date(body.date);
  
  // Handle nested exercises and sets creation
  const { exercises, ...workoutData } = body;
  
  const workout = await prisma.workout.create({
    data: {
      ...workoutData,
      exercises: exercises ? {
        create: exercises.map((exercise: any, index: number) => ({
          ...exercise,
          order: index,
          sets: exercise.sets ? { create: exercise.sets } : undefined,
        })),
      } : undefined,
    },
    include: {
      exercises: {
        include: { sets: true },
        orderBy: { order: 'asc' },
      },
    },
  });
  
  return NextResponse.json(workout, { status: 201 });
}
