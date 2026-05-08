import { NextResponse } from 'next/server';
import { getConceptData } from '@/lib/markdown';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Fetching slug:', params.slug);
    const data = await getConceptData(params.slug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
  }
}
