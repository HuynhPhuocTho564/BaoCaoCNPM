import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { CHARACTER_IDEA_HISTORY, DIALOGUE_SUGGESTION_HISTORY, createStoryPrompt, createEditStoryPrompt } from './gemini-prompts';

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

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
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

interface StoryIdea {
  title: string;
  description: string;
  mainCategory: string;
  suggestedTags: string[];
}

interface CharacterIdea {
  name: string;
  description: string;
  role: string;
}

interface DialogueSuggestion {
  content: string;
  type: string;
}

export async function generateStoryIdea(userPrompt: string, categories: string[], tags: string[]): Promise<StoryIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
    });
    
    const chat = model.startChat({
      generationConfig,
      history: [
        createStoryPrompt(categories, tags),
        {
          role: "model",
          parts: [{ text: "Tôi sẽ chỉ sử dụng các thể loại và tag từ danh sách đã cho." }]
        }
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    const storyIdea = JSON.parse(jsonString);
    return storyIdea;
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng:", error);
    throw error;
  }
}

export async function generateCharacterIdea(prompt: string): Promise<CharacterIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
    });

    const chat = model.startChat({
      generationConfig,
      history: CHARACTER_IDEA_HISTORY,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    const characterIdea = JSON.parse(jsonString);
    return characterIdea;
  } catch (error) {
    console.error("Lỗi khi tạo nhân vật:", error);
    throw error;
  }
}

export async function generateDialogueSuggestion(prompt: string): Promise<DialogueSuggestion> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
    });
    const chat = model.startChat({
      generationConfig,
      history: DIALOGUE_SUGGESTION_HISTORY,
    });
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    const characterIdea = JSON.parse(jsonString);
    return characterIdea;
  } catch (error) {
    console.error("Lỗi khi tạo nhân vật:", error);
    throw error;
  }
}

export async function generateStoryEdit(
  userPrompt: string, 
  categories: string[], 
  tags: string[],
  existingStory: {
    title: string;
    description: string;
    mainCategory: string;
    currentTags: string[];
  }
): Promise<StoryIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
    });
    
    const chat = model.startChat({
      generationConfig,
      history: [
        createEditStoryPrompt(categories, tags, existingStory),
        {
          role: "model",
          parts: [{ text: "Tôi sẽ chỉ sử dụng các thể loại và tag từ danh sách đã cho." }]
        }
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng chỉnh sửa:", error);
    throw error;
  }
} 