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
Lượt xem: ${selectedStory.view_count || 0}
Lượt thích: ${selectedStory.favorite_count || 0}
ID: ${selectedStory.story_id}
Cập nhật lần cuối: ${selectedStory.updated_at || 'Không có thông tin'}

Lưu ý: Hãy tập trung vào việc phát triển và cải thiện truyện này dựa trên các thông tin trên.`;
    }

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