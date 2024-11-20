// app/api/audit/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateStart = searchParams.get('dateStart') || '2024-11-12';
  const events = searchParams.get('events') || 'login,signup';
  const account = 21680;
  const apiKey = "fca75494-1254-46df-a88c-ea51ac12a299"

  const url = `https://api.clinked.com/v3/audit?account=${account}&dateStart=${dateStart}&events=${encodeURIComponent(events)}`;
  const secretToken = process.env.API_SECRET;
  const token = request.headers.get('Authorization');
    
  if (token !== `Bearer ${secretToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

    
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from Clinked API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
