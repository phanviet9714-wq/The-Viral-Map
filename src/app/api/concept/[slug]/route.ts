import { NextResponse } from 'next/server';
import { getConceptData } from '@/lib/markdown';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    console.log('Fetching slug:', slug);
    const data = await getConceptData(slug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
  }
}
