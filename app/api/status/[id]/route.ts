import { NextRequest, NextResponse } from 'next/server';
import { getGrievance, isStalled } from '@/lib/store';
import { statusModel } from '@/lib/gemini';
import { STATUS_PROMPT } from '@/lib/prompts';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
    }

    const grievance = getGrievance(id);

    if (!grievance) {
      return NextResponse.json({ error: 'No grievance found with this tracking ID' }, { status: 404 });
    }

    // Get AI translation for each status in history
    const translations: Record<string, { explanation: string; next_steps: string; estimated_wait: string }> = {};

    for (const entry of grievance.status_history) {
      try {
        const result = await statusModel.generateContent([
          STATUS_PROMPT,
          `\n\nGrievance details:\n- Current status: ${entry.status}\n- Department: ${grievance.department}\n- Original complaint summary: ${grievance.raw_text.slice(0, 200)}\n- Filed on: ${grievance.created_at}`,
        ]);
        const parsed = JSON.parse(result.response.text());
        translations[entry.status] = parsed;
      } catch {
        translations[entry.status] = {
          explanation: `Your grievance is currently in "${entry.status}" stage.`,
          next_steps: 'Please wait for further updates.',
          estimated_wait: 'Within 7 working days',
        };
      }
    }

    return NextResponse.json({
      grievance,
      translations,
      is_stalled: isStalled(grievance),
    });
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
