import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/employment/contacts — list contacts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');
  const company = searchParams.get('company');

  const where: any = {};
  if (applicationId) where.jobApplicationId = applicationId;
  if (company) where.company = { contains: company };

  const contacts = await prisma.contact.findMany({
    where,
    include: { jobApplication: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(contacts);
}

// POST /api/employment/contacts — create a contact
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const contact = await prisma.contact.create({
    data: body,
    include: { jobApplication: true },
  });
  
  return NextResponse.json(contact, { status: 201 });
}
