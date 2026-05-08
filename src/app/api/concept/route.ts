import { NextResponse } from 'next/server';
import { getConceptData } from '@/lib/markdown';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    console.log('Fetching slug via query:', slug);
    const data = await getConceptData(slug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
  }
}
