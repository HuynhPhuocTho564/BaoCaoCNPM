export const CHARACTER_IDEA_HISTORY = [
  {
    role: "user", 
    parts: [{ text: "Hãy trả về JSON với format sau:\n```json\n{\n  \"name\": \"tên nhân vật\",\n  \"description\": \"mô tả nhân vật\",\n  \"role\": \"main hoặc supporting\"\n}\n```" }]
  },
  {
    role: "model",
    parts: [{ text: "```json\n{\n  \"name\": \"Ví dụ\",\n  \"description\": \"Mô tả ví dụ\",\n  \"role\": \"main\"\n}\n```" }]
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