/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { generateStoryIdea } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, categories, tags, apiKey } = body;

    if (!prompt || !Array.isArray(categories) || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Thiếu thông tin đầu vào' },
        { status: 400 }
      );
    }

    const storyIdea = await generateStoryIdea(prompt, categories, tags, apiKey);

    return NextResponse.json(storyIdea);
  } catch (error: any) {
    console.error('Lỗi khi tạo truyện:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra khi tạo truyện' },
      { status: 500 }
    );
  }
} 