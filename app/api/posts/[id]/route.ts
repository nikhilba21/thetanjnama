import { NextResponse } from 'next/server';
import { deletePost, updatePost } from '@/lib/db';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){ try{return NextResponse.json(await updatePost((await params).id,await req.json()));}catch{return NextResponse.json({error:'Unable to update post'},{status:500});}}
export async function DELETE(_req:Request,{params}:{params:Promise<{id:string}>}){ try{await deletePost((await params).id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to delete post'},{status:500});}}
