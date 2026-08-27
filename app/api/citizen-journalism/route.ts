import { NextResponse } from 'next/server';
import { submitCitizenReport, getCitizenSubmissions, deleteCitizenSubmission } from '@/lib/citizenJournalism';

export async function GET() {
  try {
    const list = await getCitizenSubmissions();
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.full_name || !body.mobile_number || !body.city_district || !body.title || !body.description) {
      return NextResponse.json(
        { error: 'कृपया सभी आवश्यक (*) फ़ील्ड भरें।' },
        { status: 400 }
      );
    }

    const saved = await submitCitizenReport(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteCitizenSubmission(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
