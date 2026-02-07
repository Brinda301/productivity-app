import { NextRequest, NextResponse } from 'next/server';
import { searchFood, searchInstant } from '@/shared/lib/nutrition';

// GET /api/diet/search — search for food in nutrition API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const results = await searchInstant(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Nutrition search error:', error);
    return NextResponse.json({ error: 'Failed to search nutrition database' }, { status: 500 });
  }
}

// POST /api/diet/search — get detailed nutrition info for a food
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query } = body;
  
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const results = await searchFood(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Nutrition lookup error:', error);
    return NextResponse.json({ error: 'Failed to lookup nutrition data' }, { status: 500 });
  }
}
