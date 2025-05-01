/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/together';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, negativePrompt, type, apiKey } = body;

    if (!prompt || !negativePrompt) {
      return NextResponse.json(
        { error: 'Thiếu thông tin prompt' },
        { status: 400 }
      );
    }

    const imageData = await generateImage({
      prompt,
      negativePrompt,
      type,
      providedApiKey: apiKey
    });

    return NextResponse.json({ imageData });
  } catch (error: any) {
    console.error('Lỗi khi tạo ảnh:', error);
    return NextResponse.json(
      { error: error.message || 'Có lỗi xảy ra khi tạo ảnh' },
      { status: 500 }
    );
  }
} 