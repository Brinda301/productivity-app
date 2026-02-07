import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/tasks — list tasks with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const priority = searchParams.get('priority');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const completed = searchParams.get('completed');

  const where: any = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (priority) where.priority = priority;
  if (completed !== null) where.completed = completed === 'true';
  if (from || to) {
    where.dueDate = {};
    if (from) where.dueDate.gte = new Date(from);
    if (to) where.dueDate.lte = new Date(to);
  }

  const tasks = await prisma.task.findMany({
    where,
    include: { subtasks: true },
    orderBy: [{ completed: 'asc' }, { priority: 'desc' }, { dueDate: 'asc' }],
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks — create a task
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Parse date if provided as string
  if (body.dueDate) {
    body.dueDate = new Date(body.dueDate);
  }
  
  const task = await prisma.task.create({ 
    data: body,
    include: { subtasks: true },
  });
  
  return NextResponse.json(task, { status: 201 });
}
