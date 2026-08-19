import { NextResponse } from 'next/server';
import { createPost, getAdminPosts } from '@/lib/db';

export async function GET(){ try { return NextResponse.json(await getAdminPosts()); } catch(e){ return NextResponse.json({error:'Database not configured'},{status:500}); } }
export async function POST(req:Request){ try { const body=await req.json(); if(!body.title||!body.slug||!body.content) return NextResponse.json({error:'title, slug and content are required'},{status:400}); return NextResponse.json(await createPost(body),{status:201}); } catch(e){ return NextResponse.json({error:'Unable to create post'},{status:500}); } }