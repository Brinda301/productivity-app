import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// GET /api/employment/applications/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: { contacts: true, interviews: true },
  });
  
  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  
  return NextResponse.json(application);
}

// PATCH /api/employment/applications/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (body.appliedDate) body.appliedDate = new Date(body.appliedDate);
  
  const application = await prisma.jobApplication.update({
    where: { id },
    data: body,
    include: { contacts: true, interviews: true },
  });
  
  return NextResponse.json(application);
}

// DELETE /api/employment/applications/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.jobApplication.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
