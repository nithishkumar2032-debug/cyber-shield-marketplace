// API: Reset database state to seed fixtures
import { NextResponse } from 'next/server';
import { resetStore } from '@/lib/store';

export async function POST() {
  try {
    const data = resetStore();
    return NextResponse.json({ success: true, message: 'Database reset to initial seed state.', data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
