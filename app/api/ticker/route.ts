import { NextResponse } from 'next/server';
import { getTickerUpdates, createTickerUpdate, deleteTickerUpdate } from '@/lib/db';

export async function GET() {
  try {
    const list = await getTickerUpdates();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Ticker read failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.text || !body.text.trim()) {
      return NextResponse.json({ error: 'अपडेट विवरण अनिवार्य है।' }, { status: 400 });
    }
    const created = await createTickerUpdate(body.text);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to save ticker' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteTickerUpdate(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
