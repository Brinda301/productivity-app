import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/employment/interviews/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const interview = await prisma.interview.findUnique({
    where: { id },
    include: { jobApplication: true },
  });
  
  if (!interview) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(interview);
}

// PATCH /api/employment/interviews/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.scheduledAt) body.scheduledAt = new Date(body.scheduledAt);
  
  const interview = await prisma.interview.update({
    where: { id },
    data: body,
    include: { jobApplication: true },
  });
  
  return NextResponse.json(interview);
}

// DELETE /api/employment/interviews/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.interview.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
