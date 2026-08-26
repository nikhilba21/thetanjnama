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
    if (!body.poll_id || !body.user_name || !body.city_district || !body.selected_option || !body.user_opinion || !body.publish_consent) {
      return NextResponse.json({ error: 'कृपया सभी अनिवार्य (*) फ़ील्ड भरें।' }, { status: 400 });
    }

    const resp = submitPollResponse({
      poll_id: body.poll_id,
      user_name: body.user_name,
      city_district: body.city_district,
      selected_option: body.selected_option,
      user_opinion: body.user_opinion,
      solution_idea: body.solution_idea,
      publish_consent: body.publish_consent,
      mobile_number: body.mobile_number
    });

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
