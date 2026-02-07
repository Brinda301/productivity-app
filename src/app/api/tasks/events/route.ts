import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/tasks/events — list calendar events
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: any = {};
  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = new Date(from);
    if (to) where.startTime.lte = new Date(to);
  }

  const events = await prisma.calendarEvent.findMany({
    where,
    orderBy: { startTime: 'asc' },
  });

  return NextResponse.json(events);
}

// POST /api/tasks/events — create a calendar event
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Parse dates
  if (body.startTime) body.startTime = new Date(body.startTime);
  if (body.endTime) body.endTime = new Date(body.endTime);
  
  const event = await prisma.calendarEvent.create({ data: body });
  
  return NextResponse.json(event, { status: 201 });
}
