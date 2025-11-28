import { NextResponse } from 'next/server';
import api from '@/lib/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const per_page = searchParams.get('per_page') || 10;

  try {
    const response = await api.get('/products', {
      params: { search, per_page }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
