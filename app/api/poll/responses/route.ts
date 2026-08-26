import { NextResponse } from 'next/server';
import { getAllPollResponses, deletePollResponse } from '@/lib/poll';

export async function GET() {
  try {
    const list = getAllPollResponses();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Unable to fetch responses' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Response ID is required' }, { status: 400 });
    }
    const success = deletePollResponse(id);
    return NextResponse.json({ success });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
