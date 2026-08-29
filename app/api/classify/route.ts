import { NextRequest, NextResponse } from 'next/server';
import { classifyModel } from '@/lib/gemini';
import { CLASSIFY_PROMPT } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please describe your problem in at least 20 characters.' },
        { status: 400 }
      );
    }

    if (text.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Please keep your description under 2000 characters.' },
        { status: 400 }
      );
    }

    const result = await classifyModel.generateContent([
      CLASSIFY_PROMPT,
      `\n\nCitizen's complaint:\n"${text.trim()}"`
    ]);

    const responseText = result.response.text();
    const classification = JSON.parse(responseText);

    return NextResponse.json(classification);
  } catch (error) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { error: 'AI service is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
