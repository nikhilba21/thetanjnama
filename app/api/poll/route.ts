import { NextResponse } from 'next/server';
import {
  getActivePoll,
  submitPollResponse,
  updatePollQuestion,
  togglePollActive
} from '@/lib/poll';

export async function GET() {
  try {
    const data = getActivePoll();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Unable to fetch poll' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.poll_id || !body.selected_option) {
      return NextResponse.json({ error: 'विकल्प चुनना अनिवार्य है।' }, { status: 400 });
    }
    const resp = submitPollResponse(
      body.poll_id,
      body.selected_option,
      body.user_name,
      body.user_contact,
      body.user_opinion
    );
    return NextResponse.json(resp, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to submit response' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (typeof body.active === 'boolean' && !body.question) {
      const activeState = togglePollActive(body.active);
      return NextResponse.json({ active: activeState });
    }

    if (body.question && Array.isArray(body.options)) {
      const updated = updatePollQuestion(body.question, body.options, body.active ?? true);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Invalid update payload' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to update poll' }, { status: 500 });
  }
}
