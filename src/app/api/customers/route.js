import { NextResponse } from 'next/server';
import api from '@/lib/api';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const response = await api.get('/customers', {
      params: { search }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
