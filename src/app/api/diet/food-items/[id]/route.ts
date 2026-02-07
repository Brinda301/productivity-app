import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

// DELETE /api/diet/food-items/:id — remove a single food item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const foodItem = await prisma.foodItem.findUnique({
    where: { id },
  });

  if (!foodItem) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.foodItem.delete({ where: { id } });

  // If the parent meal now has no items, delete it too
  const remainingItems = await prisma.foodItem.count({
    where: { mealId: foodItem.mealId },
  });

  if (remainingItems === 0) {
    await prisma.meal.delete({ where: { id: foodItem.mealId } });
  }

  return NextResponse.json({ success: true });
}
