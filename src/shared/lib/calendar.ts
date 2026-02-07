import { google } from 'googleapis';

// One-time OAuth setup — store refresh token in .env
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/api/auth/google/callback'
);

export async function pushToGoogleCalendar(event: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}) {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const result = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: { dateTime: event.startTime.toISOString() },
      end: { dateTime: event.endTime.toISOString() },
    },
  });

  return result.data.id; // Store as externalId in your CalendarEvent
}

export async function pullFromGoogleCalendar(timeMin: Date, timeMax: Date) {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const result = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return result.data.items;
}

export function getAuthUrl() {
  const scopes = ['https://www.googleapis.com/auth/calendar'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
}

export async function setCredentials(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
}
