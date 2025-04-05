interface StoryInfo {
  title: string;
  description: string;
  mainCategory: string;
  currentTags: string[];
}

interface Character {
  name: string;
  description: string;
  gender: string;
  personality: string;
  appearance: string;
  role: string;
}

interface StoryContext {
  title: string;
  description: string;
  mainCategory: string;
  tags: string[];
  characters?: Character[];
}

export const SYSTEM_PROMPTS = {
  CHARACTER_IDEA: `Bạn là một AI assistant chuyên phát triển nhân vật. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "name": "tên nhân vật phù hợp",
  "description": "mô tả chi tiết về tính cách, ngoại hình và vai trò của nhân vật",
  "role": "main hoặc supporting"
}
\`\`\``,

  DIALOGUE: `Bạn là một AI assistant chuyên tạo đối thoại cho truyện. Dựa vào thông tin về truyện, chương và các nhân vật được cung cấp, hãy tạo nhiều đoạn hội thoại phù hợp với bối cảnh và tính cách của các nhân vật.

Khi tạo đối thoại, hãy:
- Đảm bảo phù hợp với thể loại và bối cảnh của truyện
- Thể hiện đúng tính cách của các nhân vật
- Tạo tương tác tự nhiên giữa các nhân vật
- Có thể thêm các chi tiết về cử chỉ, hành động kèm theo
- Tạo cả đoạn hội thoại (dialogue) và đoạn mô tả (aside)
- Đảm bảo hội thoại mới liên kết tốt với các hội thoại đã có

LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "dialogues": [
    {
      "content": "nội dung đoạn hội thoại",
      "type": "dialogue",
      "characters": ["tên nhân vật chính"]
    },
    {
      "content": "nội dung đoạn mô tả",
      "type": "aside",
      "characters": []
    },
    {
      "content": "nội dung đoạn hội thoại khác",
      "type": "dialogue",
      "characters": ["tên nhân vật khác"]
    }
  ]
}
\`\`\``,

  STORY: `Bạn là một AI assistant chuyên phát triển ý tưởng truyện. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "title": "tiêu đề phù hợp với ý tưởng",
  "description": "mô tả chi tiết cốt truyện",
  "mainCategory": "chọn từ danh sách thể loại được cung cấp",
  "suggestedTags": ["chọn từ danh sách tag được cung cấp"]
}
\`\`\``,

  EDIT_STORY: `Bạn là một AI assistant chuyên cải thiện truyện. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "title": "tiêu đề cải thiện",
  "description": "mô tả chi tiết cốt truyện cải thiện",
  "mainCategory": "chọn từ danh sách thể loại được cung cấp",
  "suggestedTags": ["chọn từ danh sách tag được cung cấp"]
}
\`\`\``,

  CHARACTER: `Bạn là một AI assistant chuyên phát triển nhân vật. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "name": "tên nhân vật phù hợp với bối cảnh",
  "description": "mô tả tổng quan về nhân vật",
  "gender": "nam hoặc nữ",
  "birthday": "ngày sinh dạng YYYY-MM-DD",
  "height": "chiều cao (cm)",
  "weight": "cân nặng (kg)", 
  "personality": "mô tả tính cách phù hợp với bối cảnh",
  "appearance": "mô tả ngoại hình",
  "background": "thông tin về xuất thân và quá khứ",
  "role": "main hoặc supporting"
}
\`\`\``,

  EDIT_CHARACTER: `Bạn là một AI assistant chuyên cải thiện nhân vật. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "name": "tên nhân vật cải thiện",
  "description": "mô tả tổng quan về nhân vật cải thiện",
  "gender": "nam hoặc nữ",
  "birthday": "ngày sinh dạng YYYY-MM-DD",
  "height": "chiều cao (cm)",
  "weight": "cân nặng (kg)", 
  "personality": "mô tả tính cách cải thiện",
  "appearance": "mô tả ngoại hình cải thiện",
  "background": "thông tin về xuất thân và quá khứ cải thiện",
  "role": "main hoặc supporting"
}
\`\`\``,

  COVER_IMAGE: `Bạn là một AI assistant chuyên tạo prompt cho AI tạo ảnh. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "prompt": "high quality, anime style, 2D, detailed anime illustration, " + "mô tả chi tiết cho ảnh bìa bằng tiếng Anh",
  "negativePrompt": "3d, realistic, photograph, photorealistic, real life, " + "những yếu tố không mong muốn trong ảnh",
  "style": "anime illustration"
}
\`\`\``,

  AVATAR_IMAGE: `Bạn là một AI assistant chuyên tạo prompt cho AI tạo ảnh. LUÔN trả về JSON với format sau, KHÔNG có text khác:
\`\`\`json
{
  "prompt": "high quality, anime style, 2D, detailed anime character, " + "mô tả chi tiết cho ảnh avatar bằng tiếng Anh",
  "negativePrompt": "3d, realistic, photograph, photorealistic, real life, " + "những yếu tố không mong muốn trong ảnh", 
  "style": "anime character illustration"
}
\`\`\``
};

export const createStoryPrompt = (categories: string[], tags: string[]) => ({
  role: "user",
  parts: [{ text: `Danh sách thể loại: ${categories.join(", ")}
Danh sách tag: ${tags.join(", ")}` }]
});

export const createEditStoryPrompt = (categories: string[], tags: string[], existingStory: StoryInfo) => ({
  role: "user",
  parts: [{ text: `Truyện hiện tại:
- Tiêu đề: ${existingStory.title}
- Mô tả: ${existingStory.description}
- Thể loại chính: ${existingStory.mainCategory}
- Các tag: ${existingStory.currentTags.join(", ")}

Danh sách thể loại: ${categories.join(", ")}
Danh sách tag: ${tags.join(", ")}` }]
});

export const createCharacterPrompt = (role: string, storyContext: StoryContext) => ({
  role: "user",
  parts: [{ text: `Thông tin truyện:
- Tiêu đề: ${storyContext.title}
- Mô tả: ${storyContext.description}
- Thể loại: ${storyContext.mainCategory}
- Các tag: ${storyContext.tags.join(", ")}` }]
});

export const createEditCharacterPrompt = (
  role: string, 
  storyContext: StoryContext,
  existingCharacter: {
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
) => ({
  role: "user",
  parts: [{ text: `Thông tin truyện:
- Tiêu đề: ${storyContext.title}
- Mô tả: ${storyContext.description}
- Thể loại: ${storyContext.mainCategory}
- Các tag: ${storyContext.tags.join(", ")}

Thông tin nhân vật hiện tại:
- Tên: ${existingCharacter.name}
- Mô tả: ${existingCharacter.description}
- Giới tính: ${existingCharacter.gender}
- Ngày sinh: ${existingCharacter.birthday}
- Chiều cao: ${existingCharacter.height}
- Cân nặng: ${existingCharacter.weight}
- Tính cách: ${existingCharacter.personality}
- Ngoại hình: ${existingCharacter.appearance}
- Xuất thân & Quá khứ: ${existingCharacter.background}
- Vai trò: ${existingCharacter.role}` }]
});

export const createCoverImagePrompt = (storyInfo: {
  title: string;
  description: string;
  mainCategory: string;
  tags: string[];
}) => ({
  role: "user",
  parts: [{ text: `Thông tin truyện:
- Tiêu đề: ${storyInfo.title}
- Mô tả: ${storyInfo.description}
- Thể loại: ${storyInfo.mainCategory}
- Các tag: ${storyInfo.tags.join(", ")}` }]
});

export const createAvatarPrompt = (characterInfo: {
  name: string;
  description: string;
  gender: string;
  personality: string;
  appearance: string;
  role: string;
}) => ({
  role: "user",
  parts: [{ text: `Thông tin nhân vật:
- Tên: ${characterInfo.name}
- Mô tả: ${characterInfo.description}
- Giới tính: ${characterInfo.gender}
- Tính cách: ${characterInfo.personality}
- Ngoại hình: ${characterInfo.appearance}
- Vai trò: ${characterInfo.role}` }]
});

export const createDialoguePrompt = (
  prompt: string, 
  storyContext: StoryContext,
  chapterTitle?: string,
  existingDialogues?: {
    character_name?: string;
    content: string;
    type: 'dialogue' | 'aside';
  }[]
) => ({
  role: "user",
  parts: [{ text: `Thông tin truyện:
- Tiêu đề: ${storyContext.title}
- Mô tả: ${storyContext.description}
- Thể loại: ${storyContext.mainCategory}
- Các tag: ${storyContext.tags.join(", ")}

${chapterTitle ? `Tên chương: ${chapterTitle}` : ''}

${storyContext.characters ? `Danh sách nhân vật:
${storyContext.characters.map(char => `
- Tên: ${char.name}
  + Mô tả: ${char.description}
  + Giới tính: ${char.gender}
  + Tính cách: ${char.personality}
  + Ngoại hình: ${char.appearance}
  + Vai trò: ${char.role}
`).join("\n")}` : ''}

${existingDialogues && existingDialogues.length > 0 ? `
Các hội thoại đã có (theo thứ tự):
${existingDialogues.map((d, i) => `
${i+1}. ${d.type === 'dialogue' ? `[${d.character_name || 'Không xác định'}]: ${d.content}` : `[Aside]: ${d.content}`}
`).join('')}
` : ''}

Yêu cầu tạo đoạn hội thoại: ${prompt}` }]
}); 