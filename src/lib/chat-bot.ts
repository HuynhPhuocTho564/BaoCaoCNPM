/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];



let apiKey: string | null = null;

async function getApiKey() {
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

export async function chatWithAssistant(message: string, history: any[] = [], stream = false): Promise<string | ReadableStream> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: `Bạn là một trợ lý AI chuyên về truyện. Nhiệm vụ của bạn là:
- Giúp người dùng tìm hiểu về các truyện
- Trả lời các câu hỏi liên quan đến cốt truyện, nhân vật
- Đưa ra các gợi ý và phân tích về truyện
- Giúp người dùng phát triển ý tưởng viết truyện
- Đưa ra các gợi ý về cách phát triển cốt truyện và nhân vật

Hãy trả lời một cách thân thiện, chuyên nghiệp và dễ hiểu.
Luôn giữ giọng điệu tích cực và khuyến khích người dùng.`
    });
    
    if (stream) {
      const chat = model.startChat({
        history: history,
      });
      const result = await chat.sendMessageStream(message);
      return new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            controller.enqueue(chunk);
          }
          controller.close();
        },
      });
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error("Lỗi khi chat với trợ lý:", error);
    throw error;
  }
}

export interface Message {
  role: "user" | "assistant";
  content: string;
} 