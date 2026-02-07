import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/employment/applications — list job applications
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const company = searchParams.get('company');

  const where: any = {};
  if (status) where.status = status;
  if (company) where.company = { contains: company };

  const applications = await prisma.jobApplication.findMany({
    where,
    include: { contacts: true, interviews: true },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(applications);
}

// POST /api/employment/applications — create a job application
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.appliedDate) body.appliedDate = new Date(body.appliedDate);
  
  const application = await prisma.jobApplication.create({
    data: body,
    include: { contacts: true, interviews: true },
  });
  
  return NextResponse.json(application, { status: 201 });
}
