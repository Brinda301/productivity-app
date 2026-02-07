import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/fitness/progress — get workout progress over time
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const exerciseName = searchParams.get('exercise');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get workouts with exercises and sets
  const workouts = await prisma.workout.findMany({
    where: {
      date: { gte: startDate },
    },
    include: {
      exercises: {
        where: exerciseName ? { name: { contains: exerciseName } } : undefined,
        include: { sets: true },
      },
    },
    orderBy: { date: 'asc' },
  });

  // Calculate progress data
  const progressData = workouts.map((workout) => {
    const totalVolume = workout.exercises.reduce((acc, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setAcc, set) => {
        return setAcc + (set.reps || 0) * (set.weight || 0);
      }, 0);
      return acc + exerciseVolume;
    }, 0);

    return {
      date: workout.date.toISOString().split('T')[0],
      name: workout.name,
      duration: workout.duration,
      exerciseCount: workout.exercises.length,
      totalVolume,
    };
  });

  // Get personal records
  const allSets = workouts.flatMap((w) =>
    w.exercises.flatMap((e) =>
      e.sets.map((s) => ({
        exerciseName: e.name,
        weight: s.weight,
        reps: s.reps,
        date: w.date,
      }))
    )
  );

  const personalRecords: Record<string, { weight: number; reps: number; date: Date }> = {};
  allSets.forEach((set) => {
    if (set.weight && set.reps) {
      const current = personalRecords[set.exerciseName];
      if (!current || set.weight > current.weight) {
        personalRecords[set.exerciseName] = {
          weight: set.weight,
          reps: set.reps,
          date: set.date,
        };
      }
    }
  });

  return NextResponse.json({
    workouts: progressData,
    personalRecords,
    totalWorkouts: workouts.length,
    averageDuration: workouts.length
      ? Math.round(workouts.reduce((acc, w) => acc + (w.duration || 0), 0) / workouts.length)
      : 0,
  });
}
