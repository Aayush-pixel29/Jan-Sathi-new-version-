import { NextRequest, NextResponse } from 'next/server';
import { getGrievance } from '@/lib/store';
import { escalationModel } from '@/lib/gemini';
import { ESCALATION_PROMPT } from '@/lib/prompts';
import { getTimeSince } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { tracking_id } = await request.json();

    if (!tracking_id) {
      return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
    }

    const grievance = getGrievance(tracking_id);

    if (!grievance) {
      return NextResponse.json({ error: 'No grievance found' }, { status: 404 });
    }

    const stalledDuration = getTimeSince(grievance.updated_at);

    const result = await escalationModel.generateContent([
      ESCALATION_PROMPT,
      `\n\nGrievance details:\n- Tracking ID: ${grievance.tracking_id}\n- Department: ${grievance.department}\n- Category: ${grievance.category}\n- Original complaint: ${grievance.raw_text.slice(0, 300)}\n- Current status: ${grievance.status}\n- Filed on: ${grievance.created_at}\n- Stalled for: ${stalledDuration}\n- SLA: ${grievance.sla_hours} hours`,
    ]);

    const parsed = JSON.parse(result.response.text());

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Escalation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate escalation letter' },
      { status: 500 }
    );
  }
}
