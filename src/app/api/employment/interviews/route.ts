import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/employment/interviews — list interviews
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: any = {};
  if (applicationId) where.jobApplicationId = applicationId;
  if (from || to) {
    where.scheduledAt = {};
    if (from) where.scheduledAt.gte = new Date(from);
    if (to) where.scheduledAt.lte = new Date(to);
  }

  const interviews = await prisma.interview.findMany({
    where,
    include: { jobApplication: true },
    orderBy: { scheduledAt: 'asc' },
  });

  return NextResponse.json(interviews);
}

// POST /api/employment/interviews — create an interview
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.scheduledAt) body.scheduledAt = new Date(body.scheduledAt);
  
  const interview = await prisma.interview.create({
    data: body,
    include: { jobApplication: true },
  });
  
  return NextResponse.json(interview, { status: 201 });
}
