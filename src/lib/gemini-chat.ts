/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    GoogleGenerativeAI,
} from "@google/generative-ai";
import { SYSTEM_PROMPT, generationConfig, safetySettings, Message } from './gemini-chat-config';

let apiKey: string | null = null;
async function getApiKey() {
    // Nếu chạy trên client, gọi API để lấy key
    if (!apiKey) {
      const response = await fetch('/api/ai/gemini');
      if (!response.ok) {
        throw new Error('Không thể lấy API key');
      }
      const data = await response.json();
      apiKey = data.apiKey;
    }
    return apiKey;
  }

interface Story {
  story_id: number
  title: string
  main_category: string
  status: 'draft' | 'published' | 'archived'
  description?: string
  cover_image?: string | null
  view_count?: number
  favorite_count?: number
  updated_at?: string
  tags?: string[]
  chapters?: {
    chapter_id: number
    title: string
    summary?: string
    status: string
  }[]
  dialogues?: {
    chapter_id: number
    dialogues: {
      type: 'dialogue' | 'aside'
      content: string
      character_name?: string
    }[]
  }[]
  characters?: {
    name: string
    description: string
    gender: string
    personality: string
    appearance: string
    role: string
  }[]
  outlines?: {
    title: string
    description: string
  }[]
}

export async function chat(
  message: string,
  history: Message[] = [],
  imageFiles?: File[] | null,
  onCreateStory?: (params: {
    title: string;
    description: string;
    mainCategoryId: string;
    tagIds: number[];
  }) => Promise<void>,
  categories: { id: number; name: string }[] = [],
  tags: { id: number; name: string }[] = [],
  selectedStory?: Story | null
): Promise<ReadableStream> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);

    // Tạo system prompt với thông tin truyện được chọn
    let systemPromptWithData = `${SYSTEM_PROMPT}

Danh sách thể loại có sẵn:
${categories.map(cat => `- ${cat.name} (ID: ${cat.id})`).join('\n')}

Danh sách tag có sẵn:
${tags.map(tag => `- ${tag.name} (ID: ${tag.id})`).join('\n')}`;

    // Thêm thông tin truyện nếu có
    if (selectedStory) {
      systemPromptWithData += `

Truyện đang được chọn:
Tiêu đề: ${selectedStory.title}
Mô tả: ${selectedStory.description || 'Chưa có mô tả'}
Thể loại: ${selectedStory.main_category}
Tags: ${selectedStory.tags?.join(', ') || 'Chưa có tags'}
Trạng thái: ${selectedStory.status}
ID: ${selectedStory.story_id}

${selectedStory.characters?.length ? `
Danh sách nhân vật:
${selectedStory.characters.map(char => `
- Tên: ${char.name}
  Mô tả: ${char.description}
  Giới tính: ${char.gender}
  Tính cách: ${char.personality}
  Ngoại hình: ${char.appearance}
  Vai trò: ${char.role}
`).join('\n')}` : ''}

${selectedStory.outlines?.length ? `
Đại cương:
${selectedStory.outlines.map(outline => `
- ${outline.title}
  ${outline.description}
`).join('\n')}` : ''}

${selectedStory.chapters?.length ? `
Các chương đã xuất bản:
${selectedStory.chapters.map(chapter => `
- ${chapter.title}
  ${chapter.summary || 'Chưa có tóm tắt'}
  ${selectedStory.dialogues?.find(d => d.chapter_id === chapter.chapter_id)?.dialogues.map(dialogue => 
    dialogue.type === 'dialogue' ? 
    `  [Hội thoại] ${dialogue.content}` :
    `  [Mô tả] ${dialogue.content}`
  ).join('\n  ') || ''}
`).join('\n')}` : ''}

Lưu ý: Hãy tập trung vào việc phát triển và cải thiện truyện này dựa trên các thông tin trên.`;
    }

    console.log(systemPromptWithData);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: systemPromptWithData
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const parts: (string | { inlineData: { data: string; mimeType: string } })[] = [message]
    
    if (imageFiles?.length) {
      for (const file of imageFiles) {
        const imageData = await file.arrayBuffer()
        parts.push({
          inlineData: {
            data: Buffer.from(imageData).toString("base64"),
            mimeType: file.type
          }
        })
      }
    }

    const result = await chat.sendMessageStream(parts);

    return new ReadableStream({
      async start(controller) {
        let accumulatedText = "";
        
        for await (const chunk of result.stream) {
          const text = chunk.text();
          accumulatedText += text;
          
          // Kiểm tra lệnh tạo truyện
          if (accumulatedText.includes("/create-story")) {
            const match = accumulatedText.match(/\/create-story\s*({[\s\S]*?})/);
            if (match && onCreateStory) {
              try {
                const params = JSON.parse(match[1]);
                await onCreateStory(params);
              } catch (error) {
                console.error("Lỗi khi xử lý lệnh tạo truyện:", error);
              }
            }
          }
          
          controller.enqueue(text);
        }
        controller.close();
      },
    });
  } catch (error) {
    console.error("Lỗi khi chat với AI:", error);
    throw error;
  }
}