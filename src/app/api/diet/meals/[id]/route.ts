import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/diet/meals/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: { items: true },
  });
  
  if (!meal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(meal);
}

// PATCH /api/diet/meals/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.date) body.date = new Date(body.date);
  
  const meal = await prisma.meal.update({
    where: { id },
    data: body,
    include: { items: true },
  });
  
  return NextResponse.json(meal);
}

// DELETE /api/diet/meals/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.meal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
