import { NextRequest, NextResponse } from 'next/server';
import { pushToGoogleCalendar } from '@/shared/lib/calendar';
import { prisma } from '@/shared/lib/prisma';

// POST /api/sync/calendar — push local events to Google Calendar
export async function POST(request: NextRequest) {
  const { eventId } = await request.json();

  const event = await prisma.calendarEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const googleId = await pushToGoogleCalendar({
      title: event.title,
      description: event.description ?? undefined,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location ?? undefined,
    });

    // Save the Google Calendar ID for future syncs
    await prisma.calendarEvent.update({
      where: { id: eventId },
      data: { externalId: googleId },
    });

    return NextResponse.json({ success: true, googleId });
  } catch (error) {
    console.error('Google Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Google Calendar' },
      { status: 500 }
    );
  }
}
