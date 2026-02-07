import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/tasks/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id },
    include: { subtasks: true },
  });
  
  if (!task) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(task);
}

// PATCH /api/tasks/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  // Parse date if provided as string
  if (body.dueDate) {
    body.dueDate = new Date(body.dueDate);
  }
  if (body.completedAt) {
    body.completedAt = new Date(body.completedAt);
  }
  
  // If completing the task, set completedAt
  if (body.completed === true && !body.completedAt) {
    body.completedAt = new Date();
  }
  
  const task = await prisma.task.update({
    where: { id },
    data: body,
    include: { subtasks: true },
  });
  
  return NextResponse.json(task);
}

// DELETE /api/tasks/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
