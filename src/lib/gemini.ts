import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SYSTEM_PROMPTS, createStoryPrompt, createEditStoryPrompt, createCharacterPrompt, createEditCharacterPrompt, createCoverImagePrompt, createAvatarPrompt, createDialoguePrompt } from './gemini-prompts';

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
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
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
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  personality: string;
  appearance: string;
  background: string;
  role: string;
}

interface DialogueItem {
  content: string;
  type: string;
  characters: string[];
}

interface MultipleDialoguesResponse {
  dialogues: DialogueItem[];
}

interface CoverImagePrompt {
  prompt: string;
  negativePrompt: string;
  style: string;
}

export async function generateStoryIdea(userPrompt: string, categories: string[], tags: string[]): Promise<StoryIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.STORY
    });
    
    const chat = model.startChat({
      history: [
        createStoryPrompt(categories, tags)
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let storyIdea: StoryIdea;
    try {
      storyIdea = JSON.parse(jsonString);
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!storyIdea.title || !storyIdea.description || !storyIdea.mainCategory || !Array.isArray(storyIdea.suggestedTags)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return storyIdea;
  } catch (error) {
    console.error("Lỗi khi tạo ý tưởng:", error);
    throw new Error('Có lỗi xảy ra khi tạo ý tưởng. Vui lòng thử lại sau.');
  }
}

export async function generateCharacterIdea(
  prompt: string, 
  role: string,
  storyContext: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  },
  existingCharacter?: {
    name: string;
    description: string;
    gender: string;
    birthday: string;
    height: string;
    weight: string;
    personality: string;
    appearance: string;
    background: string;
    role: string;
  }
): Promise<CharacterIdea> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.CHARACTER
    });

    const chat = model.startChat({
      history: [
        existingCharacter 
          ? createEditCharacterPrompt(role, storyContext, existingCharacter)
          : createCharacterPrompt(role, storyContext),
      ],
    });

    const result = await chat.sendMessage([{ text: prompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let characterIdea: CharacterIdea;
    try {
      characterIdea = JSON.parse(jsonString);
      // Kiểm tra tính hợp lệ của dữ liệu
      if (!characterIdea.name || !characterIdea.description || !characterIdea.role) {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return characterIdea;
  } catch (error) {
    console.error("Lỗi khi tạo nhân vật:", error);
    throw error;
  }
}

export async function generateDialogueSuggestion(
  prompt: string,
  storyContext: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
    characters: {
      name: string;
      description: string;
      gender: string;
      personality: string;
      appearance: string;
      role: string;
    }[];
  },
  count: number = 3,
  chapterTitle?: string,
  existingDialogues?: {
    character_name?: string;
    content: string;
    type: 'dialogue' | 'aside';
  }[]
): Promise<DialogueItem[]> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.DIALOGUE + "\n\nCHÚ Ý QUAN TRỌNG: Chỉ sử dụng tên nhân vật đã được liệt kê trong danh sách nhân vật. KHÔNG tạo ra nhân vật mới."
    });
    
    const fullPrompt = createDialoguePrompt(prompt, storyContext, chapterTitle, existingDialogues);
    fullPrompt.parts[0].text += `\n\nHãy tạo ${count} đoạn hội thoại khác nhau. CHỈ sử dụng tên nhân vật đã được liệt kê trong danh sách nhân vật, KHÔNG tạo ra nhân vật mới.`;
    
    const chat = model.startChat({
      history: [fullPrompt],
    });

    const result = await chat.sendMessage("");
    const response = result.response.text();
    
    console.log("Raw response:", response);
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    try {
      const parsedResponse = JSON.parse(jsonString) as MultipleDialoguesResponse;
      
      if (!parsedResponse.dialogues || !Array.isArray(parsedResponse.dialogues)) {
        throw new Error('Dữ liệu đối thoại không hợp lệ');
      }
      
      // Validate each dialogue
      parsedResponse.dialogues.forEach(dialogue => {
        if (!dialogue.content || 
            !['dialogue', 'aside'].includes(dialogue.type) || 
            !Array.isArray(dialogue.characters)) {
          throw new Error('Dữ liệu đối thoại không hợp lệ');
        }
      });
      
      return parsedResponse.dialogues;
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError, "Response:", response);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
  } catch (error) {
    console.error("Lỗi khi tạo đối thoại:", error);
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
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.EDIT_STORY
    });
    
    const chat = model.startChat({
      history: [
        createEditStoryPrompt(categories, tags, existingStory),
      ],
    });

    const result = await chat.sendMessage([{ text: userPrompt }]);
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let editedStory: StoryIdea;
    try {
      editedStory = JSON.parse(jsonString);
      if (!editedStory.title || !editedStory.description || !editedStory.mainCategory || !Array.isArray(editedStory.suggestedTags)) {
        throw new Error('Dữ liệu chỉnh sửa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return editedStory;
  } catch (error) {
    console.error("Lỗi khi chỉnh sửa truyện:", error);
    throw new Error('Có lỗi xảy ra khi chỉnh sửa. Vui lòng thử lại sau.');
  }
}

export async function generateCoverImagePrompt(
  storyInfo: {
    title: string;
    description: string;
    mainCategory: string;
    tags: string[];
  }
): Promise<CoverImagePrompt> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.COVER_IMAGE
    });
    
    const chat = model.startChat({
      history: [
        createCoverImagePrompt(storyInfo),
      ],
    });

    const result = await chat.sendMessage("");
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let coverPrompt: CoverImagePrompt;
    try {
      coverPrompt = JSON.parse(jsonString);
      if (!coverPrompt.prompt || !coverPrompt.negativePrompt || !coverPrompt.style) {
        throw new Error('Dữ liệu prompt ảnh bìa không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return coverPrompt;
  } catch (error) {
    console.error("Lỗi khi tạo prompt ảnh bìa:", error);
    throw new Error('Có lỗi xảy ra khi tạo prompt ảnh bìa. Vui lòng thử lại sau.');
  }
}

export async function generateAvatarPrompt(
  characterInfo: {
    name: string;
    description: string;
    gender: string;
    personality: string;
    appearance: string;
    role: string;
  }
): Promise<CoverImagePrompt> {
  try {
    const key = await getApiKey();
    const genAI = new GoogleGenerativeAI(key!);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig,
      systemInstruction: SYSTEM_PROMPTS.AVATAR_IMAGE
    });
    
    const chat = model.startChat({
      history: [
        createAvatarPrompt(characterInfo),
      ],
    });

    const result = await chat.sendMessage("");
    const response = result.response.text();
    
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    let avatarPrompt: CoverImagePrompt;
    try {
      avatarPrompt = JSON.parse(jsonString);
      if (!avatarPrompt.prompt || !avatarPrompt.negativePrompt || !avatarPrompt.style) {
        throw new Error('Dữ liệu prompt avatar không hợp lệ');
      }
    } catch (parseError) {
      console.error("Lỗi khi parse JSON:", parseError);
      throw new Error('Không thể xử lý phản hồi từ AI');
    }
    
    return avatarPrompt;
  } catch (error) {
    console.error("Lỗi khi tạo prompt avatar:", error);
    throw new Error('Có lỗi xảy ra khi tạo prompt avatar. Vui lòng thử lại sau.');
  }
} 