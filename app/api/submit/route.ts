import { NextRequest, NextResponse } from 'next/server';
import { saveGrievance } from '@/lib/store';
import { generateTrackingId } from '@/lib/utils';
import { Grievance } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raw_text, structured_text, department, category, sub_category, priority } = body;

    if (!raw_text || !structured_text || !department) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tracking_id = generateTrackingId();
    const now = new Date().toISOString();

    const grievance: Grievance = {
      id: crypto.randomUUID(),
      tracking_id,
      raw_text,
      structured_text,
      department,
      category: category || 'General',
      sub_category: sub_category || 'General',
      priority: priority || 'Medium',
      status: 'Filed',
      status_history: [{ status: 'Filed', timestamp: now }],
      created_at: now,
      updated_at: now,
      sla_hours: 168,
    };

    saveGrievance(grievance);

    return NextResponse.json({
      tracking_id,
      status: 'Filed',
      message: 'Your grievance has been registered successfully.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit grievance' }, { status: 500 });
  }
}
