import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ status: "ok", message: "Source of Hope API is running" });
}