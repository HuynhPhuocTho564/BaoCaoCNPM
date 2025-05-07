import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";

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

const SYSTEM_PROMPT = `Bạn là một AI assistant chuyên về phát triển truyện. Nhiệm vụ của bạn là:
- Giúp người dùng phát triển ý tưởng viết truyện
- Đưa ra gợi ý về cốt truyện và nhân vật
- Tạo đoạn hội thoại giữa các nhân vật
- Phân tích và góp ý cải thiện nội dung
- Trả lời các câu hỏi liên quan đến viết truyện

Hãy trả lời một cách thân thiện, chuyên nghiệp và dễ hiểu.
Luôn giữ giọng điệu tích cực và khuyến khích người dùng.

Khi trả lời:
- Sử dụng ngôn ngữ dễ hiểu, tránh từ ngữ chuyên môn phức tạp
- Đưa ra các ví dụ cụ thể khi cần thiết
- Chia nhỏ các ý thành điểm để dễ đọc
- Khuyến khích sự sáng tạo của người dùng
- Đề xuất các hướng phát triển mới cho ý tưởng
- Tập trung vào việc cải thiện chất lượng nội dung`;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192
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

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function chat(
  message: string,
  history: Message[] = []
): Promise<ReadableStream> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessageStream(message);

    return new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
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