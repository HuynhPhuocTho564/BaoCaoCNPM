/**
 * Các hằng số API cho ChatStoryAI
 */

// URL cơ sở của API ChatStoryAI
export const API_BASE_URL = "https://chatstory-ai.vercel.app";

// Các endpoint của ChatStoryAI API
export const ENDPOINTS = {
  // Stories
  STORIES: "/api/stories",
  STORIES_CREATE: "/api/stories/create",
  STORY_DETAIL: (id: number) => `/api/stories/${id}`,
  STORY_PUBLISH: (id: number) => `/api/stories/${id}/publish`,

  // Bookmarks
  STORY_BOOKMARKS: (id: number) => `/api/stories/${id}/bookmarks`,

  // Chapters
  STORY_CHAPTERS: (id: number) => `/api/stories/${id}/chapters`,
  CHAPTER_DETAIL: (storyId: number, chapterId: number) =>
    `/api/stories/${storyId}/chapters/${chapterId}`,

  // Dialogues
  CHAPTER_DIALOGUES: (storyId: number, chapterId: number) =>
    `/api/stories/${storyId}/chapters/${chapterId}/dialogues`,
  DIALOGUE_DETAIL: (storyId: number, chapterId: number, dialogueId: number) =>
    `/api/stories/${storyId}/chapters/${chapterId}/dialogues/${dialogueId}`,
  DIALOGUE_MOVE: (storyId: number, chapterId: number, dialogueId: number) =>
    `/api/stories/${storyId}/chapters/${chapterId}/dialogues/${dialogueId}/move`,

  // Characters
  STORY_CHARACTERS: (id: number) => `/api/stories/${id}/characters`,
  CHARACTER_DETAIL: (storyId: number, characterId: number) =>
    `/api/stories/${storyId}/characters/${characterId}`,

  // Outlines
  STORY_OUTLINES: (id: number) => `/api/stories/${id}/outlines`,
  OUTLINE_DETAIL: (storyId: number, outlineId: number) =>
    `/api/stories/${storyId}/outlines/${outlineId}`,

  // Account
  ACCOUNT_BOOKMARKS: "/api/account/bookmarks",
  ACCOUNT_HISTORY: "/api/account/view-history",

  // Categories and Tags
  CATEGORIES: "/api/categories", // Trả về cả mainCategories và tags
};

// Cấu hình API
export const API_CONFIG = {
  TIMEOUT: 10000, // Tăng timeout cho ChatStoryAI
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};
