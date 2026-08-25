import { NextResponse } from 'next/server';
import {
  getCategories,
  createCategory,
  toggleCategoryActive,
  deleteCategory
} from '@/lib/categories';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminMode = searchParams.get('admin') === 'true';
  const categories = getCategories(adminMode);
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'कैटेगरी का नाम अनिवार्य है।' }, { status: 400 });
    }
    const created = createCategory(body.name, body.slug);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to create category' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const updated = toggleCategoryActive(body.id);
    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Unable to update category' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const success = deleteCategory(id);
    return NextResponse.json({ success });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to delete category' }, { status: 500 });
  }
}
