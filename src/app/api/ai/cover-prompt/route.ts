/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { generateCoverImagePrompt } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storyInfo, apiKey } = body;

    if (!storyInfo || !storyInfo.title || !storyInfo.description || 
        !storyInfo.mainCategory || !Array.isArray(storyInfo.tags)) {
      return NextResponse.json(
        { error: 'Thiếu thông tin truyện' },
        { status: 400 }
      );
    }

    const promptData = await generateCoverImagePrompt(storyInfo, apiKey);

    return NextResponse.json(promptData);
  } catch (error: any) {
    console.error('Lỗi khi tạo prompt ảnh bìa:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra khi tạo prompt ảnh bìa' },
      { status: 500 }
    );
  }
} 