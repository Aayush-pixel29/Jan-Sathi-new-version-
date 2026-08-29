import { NextRequest, NextResponse } from 'next/server';
import { advanceStatus } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const { tracking_id } = await request.json();

    if (!tracking_id) {
      return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
    }

    const updated = advanceStatus(tracking_id);

    if (!updated) {
      return NextResponse.json({ error: 'Grievance not found' }, { status: 404 });
    }

    return NextResponse.json({
      tracking_id: updated.tracking_id,
      new_status: updated.status,
      message: `Status advanced to ${updated.status}`,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to advance status' }, { status: 500 });
  }
}
