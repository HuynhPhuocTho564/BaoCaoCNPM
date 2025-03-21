export const CHARACTER_IDEA_HISTORY = [
  {
    role: "user",
    parts: [{ text: `Hãy phát triển ý tưởng thành một nhân vật và trả về JSON với format sau:
\`\`\`json
{
  "name": "tên nhân vật phù hợp",
  "description": "mô tả chi tiết về tính cách, ngoại hình và vai trò của nhân vật",
  "role": "main hoặc supporting"
}
\`\`\`` }]
  },
  {
    role: "model",
    parts: [{ text: "Tôi sẽ tạo nhân vật phù hợp với yêu cầu." }]
  }
];

export const DIALOGUE_SUGGESTION_HISTORY = [
  {
    role: "user",
    parts: [{ text: "Hãy trả về JSON với format sau:\n```json\n{\n  \"content\": \"nội dung đối thoại\",\n  \"type\": \"dialogue hoặc aside\"\n}\n```" }]
  },
  {
    role: "model",
    parts: [{ text: "```json\n{\n  \"content\": \"Xin chào!\",\n  \"type\": \"dialogue\"\n}\n```" }]
  }
];

export const createStoryPrompt = (categories: string[], tags: string[]) => ({
  role: "user",
  parts: [{ text: `Hãy phát triển ý tưởng thành một truyện và trả về JSON với format sau. CHỈ được chọn thể loại và tag từ danh sách cho sẵn:

Danh sách thể loại: ${categories.join(", ")}
Danh sách tag: ${tags.join(", ")}

Format JSON:
\`\`\`json
{
  "title": "tiêu đề phù hợp với ý tưởng",
  "description": "mô tả chi tiết cốt truyện",
  "mainCategory": "chọn từ danh sách thể loại trên",
  "suggestedTags": ["chọn từ danh sách tag trên"]
}
\`\`\`` }]
});

export const createEditStoryPrompt = (categories: string[], tags: string[], existingStory: {
  title: string;
  description: string;
  mainCategory: string;
  currentTags: string[];
}) => ({
  role: "user",
  parts: [{ text: `Hãy đề xuất cách cải thiện truyện sau và trả về JSON với format tương tự. CHỈ được chọn thể loại và tag từ danh sách cho sẵn:

Truyện hiện tại:
- Tiêu đề: ${existingStory.title}
- Mô tả: ${existingStory.description}
- Thể loại chính: ${existingStory.mainCategory}
- Các tag: ${existingStory.currentTags.join(", ")}

Danh sách thể loại: ${categories.join(", ")}
Danh sách tag: ${tags.join(", ")}

Format JSON:
\`\`\`json
{
  "title": "tiêu đề cải thiện",
  "description": "mô tả chi tiết cốt truyện cải thiện",
  "mainCategory": "chọn từ danh sách thể loại trên",
  "suggestedTags": ["chọn từ danh sách tag trên"]
}
\`\`\`` }]
});

interface StoryContext {
  title: string;
  description: string;
  mainCategory: string;
  tags: string[];
}

export const createCharacterPrompt = (role: string, storyContext: StoryContext) => ({
  role: "user",
  parts: [{ text: `Hãy đọc thông tin về câu truyện sau và tạo một nhân vật ${role === 'main' ? 'chính' : 'phụ'} phù hợp:

Thông tin truyện:
- Tiêu đề: ${storyContext.title}
- Mô tả: ${storyContext.description}
- Thể loại: ${storyContext.mainCategory}
- Các tag: ${storyContext.tags.join(", ")}

Hãy trả về JSON với format sau:
\`\`\`json
{
  "name": "tên nhân vật phù hợp với bối cảnh truyện",
  "description": "mô tả tổng quan về nhân vật",
  "gender": "nam hoặc nữ",
  "birthday": "ngày sinh dạng YYYY-MM-DD",
  "height": "chiều cao (cm)",
  "weight": "cân nặng (kg)", 
  "personality": "mô tả tính cách phù hợp với bối cảnh truyện",
  "appearance": "mô tả ngoại hình",
  "background": "thông tin về xuất thân, quá khứ liên quan đến cốt truyện",
  "role": "${role}"
}
\`\`\`` }]
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
  parts: [{ text: `Hãy đọc thông tin về câu truyện và nhân vật hiện tại, sau đó đề xuất cách cải thiện nhân vật ${role === 'main' ? 'chính' : 'phụ'}:

Thông tin truyện:
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

Hãy trả về JSON với format sau:
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
  "background": "thông tin về xuất thân, quá khứ cải thiện",
  "role": "${role}"
}
\`\`\`` }]
}); 