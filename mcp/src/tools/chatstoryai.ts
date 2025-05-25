/**
 * Module công cụ ChatStoryAI API
 */
import { ApiClient } from "../api/api.js";
import { ENDPOINTS } from "../api/constants.js";
import {
  StoriesResponse,
  StoryDetailResponse,
  CreateStoryResponse,
  BookmarkResponse,
  ToggleBookmarkResponse,
  ChaptersResponse,
  ChapterDetailResponse,
  CharactersResponse,
  CharacterDetailResponse,
  DialoguesResponse,
  CreateDialogueResponse,
  OutlinesResponse,
  OutlineDetailResponse,
  UpdateOutlineResponse,
  UpdateChapterResponse,
  ApiResponse,
  BookmarksResponse,
  HistoryResponse,
  ChapterRequest,
  CharacterRequest,
  DialogueRequest,
  MoveDialogueRequest,
  OutlineRequest,
  CategoriesAndTagsResponse,
  CategoriesResponse,
  TagsResponse,
} from "../types/index.js";

// Khởi tạo API client
const apiClient = new ApiClient();

// ===== STORIES MANAGEMENT =====

/**
 * Lấy danh sách truyện của người dùng
 */
export async function getStories(): Promise<StoriesResponse> {
  try {
    return await apiClient.get<StoriesResponse>(ENDPOINTS.STORIES);
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy danh sách truyện: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Lấy chi tiết truyện
 */
export async function getStoryDetail(
  storyId: number
): Promise<StoryDetailResponse> {
  try {
    return await apiClient.get<StoryDetailResponse>(
      ENDPOINTS.STORY_DETAIL(storyId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy chi tiết truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Tạo truyện mới
 */
export async function createStory(
  title: string,
  description: string,
  mainCategoryId: string,
  tagIds: string,
  coverImageBase64?: string
): Promise<CreateStoryResponse> {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mainCategoryId", mainCategoryId);
    formData.append("tagIds", tagIds);

    if (coverImageBase64) {
      // Convert base64 to blob for file upload
      const byteCharacters = atob(coverImageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      formData.append("coverImage", blob, "cover.jpg");
    }

    return await apiClient.postFormData<CreateStoryResponse>(
      ENDPOINTS.STORIES_CREATE,
      formData
    );
  } catch (error: unknown) {
    console.error(`Lỗi khi tạo truyện: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Cập nhật truyện
 */
export async function updateStory(
  storyId: number,
  title: string,
  description: string,
  mainCategoryId: string,
  tagIds: string,
  coverImageBase64?: string
): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mainCategoryId", mainCategoryId);
    formData.append("tagIds", tagIds);

    if (coverImageBase64) {
      const byteCharacters = atob(coverImageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      formData.append("coverImage", blob, "cover.jpg");
    }

    return await apiClient.putFormData<ApiResponse>(
      ENDPOINTS.STORY_DETAIL(storyId),
      formData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Xóa truyện
 */
export async function deleteStory(storyId: number): Promise<ApiResponse> {
  try {
    return await apiClient.delete<ApiResponse>(ENDPOINTS.STORY_DETAIL(storyId));
  } catch (error: unknown) {
    console.error(`Lỗi khi xóa truyện ${storyId}: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Xuất bản truyện
 */
export async function publishStory(storyId: number): Promise<ApiResponse> {
  try {
    return await apiClient.put<ApiResponse>(
      ENDPOINTS.STORY_PUBLISH(storyId),
      {}
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi xuất bản truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== BOOKMARKS MANAGEMENT =====

/**
 * Kiểm tra trạng thái bookmark
 */
export async function checkBookmark(
  storyId: number
): Promise<BookmarkResponse> {
  try {
    return await apiClient.get<BookmarkResponse>(
      ENDPOINTS.STORY_BOOKMARKS(storyId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi kiểm tra bookmark truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Toggle bookmark truyện
 */
export async function toggleBookmark(
  storyId: number
): Promise<ToggleBookmarkResponse> {
  try {
    return await apiClient.post<ToggleBookmarkResponse>(
      ENDPOINTS.STORY_BOOKMARKS(storyId),
      {}
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi toggle bookmark truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== CHAPTERS MANAGEMENT =====

/**
 * Lấy danh sách chương
 */
export async function getChapters(
  storyId: number,
  status?: string
): Promise<ChaptersResponse> {
  try {
    const params = status ? { status } : {};
    return await apiClient.getWithParams<ChaptersResponse>(
      ENDPOINTS.STORY_CHAPTERS(storyId),
      params
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách chương truyện ${storyId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Lấy chi tiết chương
 */
export async function getChapterDetail(
  storyId: number,
  chapterId: number
): Promise<ChapterDetailResponse> {
  try {
    return await apiClient.get<ChapterDetailResponse>(
      ENDPOINTS.CHAPTER_DETAIL(storyId, chapterId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy chi tiết chương ${chapterId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Tạo chương mới
 */
export async function createChapter(
  storyId: number,
  chapterData: ChapterRequest
): Promise<ChapterDetailResponse> {
  try {
    return await apiClient.post<ChapterDetailResponse>(
      ENDPOINTS.STORY_CHAPTERS(storyId),
      chapterData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi tạo chương mới cho truyện ${storyId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Cập nhật chương
 */
export async function updateChapter(
  storyId: number,
  chapterId: number,
  chapterData: ChapterRequest
): Promise<UpdateChapterResponse> {
  try {
    return await apiClient.put<UpdateChapterResponse>(
      ENDPOINTS.CHAPTER_DETAIL(storyId, chapterId),
      chapterData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật chương ${chapterId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Xóa chương
 */
export async function deleteChapter(
  storyId: number,
  chapterId: number
): Promise<ApiResponse> {
  try {
    return await apiClient.delete<ApiResponse>(
      ENDPOINTS.CHAPTER_DETAIL(storyId, chapterId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi xóa chương ${chapterId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== CHARACTERS MANAGEMENT =====

/**
 * Lấy danh sách nhân vật
 */
export async function getCharacters(
  storyId: number
): Promise<CharactersResponse> {
  try {
    return await apiClient.get<CharactersResponse>(
      ENDPOINTS.STORY_CHARACTERS(storyId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách nhân vật truyện ${storyId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Lấy chi tiết nhân vật
 */
export async function getCharacterDetail(
  storyId: number,
  characterId: number
): Promise<CharacterDetailResponse> {
  try {
    return await apiClient.get<CharacterDetailResponse>(
      ENDPOINTS.CHARACTER_DETAIL(storyId, characterId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy chi tiết nhân vật ${characterId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Tạo nhân vật mới
 */
export async function createCharacter(
  storyId: number,
  characterData: CharacterRequest,
  avatarImageBase64?: string
): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append("name", characterData.name);
    formData.append("description", characterData.description);
    formData.append("role", characterData.role);

    if (characterData.gender) formData.append("gender", characterData.gender);
    if (characterData.birthday)
      formData.append("birthday", characterData.birthday);
    if (characterData.height)
      formData.append("height", characterData.height.toString());
    if (characterData.weight)
      formData.append("weight", characterData.weight.toString());
    if (characterData.personality)
      formData.append("personality", characterData.personality);
    if (characterData.appearance)
      formData.append("appearance", characterData.appearance);
    if (characterData.background)
      formData.append("background", characterData.background);

    if (avatarImageBase64) {
      const byteCharacters = atob(avatarImageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      formData.append("avatarImage", blob, "avatar.jpg");
    }

    return await apiClient.postFormData<ApiResponse>(
      ENDPOINTS.STORY_CHARACTERS(storyId),
      formData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi tạo nhân vật cho truyện ${storyId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Cập nhật nhân vật
 */
export async function updateCharacter(
  storyId: number,
  characterId: number,
  characterData: CharacterRequest,
  avatarImageBase64?: string
): Promise<ApiResponse> {
  try {
    const formData = new FormData();
    formData.append("name", characterData.name);
    formData.append("description", characterData.description);
    formData.append("role", characterData.role);

    if (characterData.gender) formData.append("gender", characterData.gender);
    if (characterData.birthday)
      formData.append("birthday", characterData.birthday);
    if (characterData.height)
      formData.append("height", characterData.height.toString());
    if (characterData.weight)
      formData.append("weight", characterData.weight.toString());
    if (characterData.personality)
      formData.append("personality", characterData.personality);
    if (characterData.appearance)
      formData.append("appearance", characterData.appearance);
    if (characterData.background)
      formData.append("background", characterData.background);

    if (avatarImageBase64) {
      const byteCharacters = atob(avatarImageBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      formData.append("avatarImage", blob, "avatar.jpg");
    }

    return await apiClient.putFormData<ApiResponse>(
      ENDPOINTS.CHARACTER_DETAIL(storyId, characterId),
      formData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật nhân vật ${characterId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Xóa nhân vật
 */
export async function deleteCharacter(
  storyId: number,
  characterId: number
): Promise<ApiResponse> {
  try {
    return await apiClient.delete<ApiResponse>(
      ENDPOINTS.CHARACTER_DETAIL(storyId, characterId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi xóa nhân vật ${characterId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== DIALOGUES MANAGEMENT =====

/**
 * Lấy danh sách hội thoại
 */
export async function getDialogues(
  storyId: number,
  chapterId: number
): Promise<DialoguesResponse> {
  try {
    return await apiClient.get<DialoguesResponse>(
      ENDPOINTS.CHAPTER_DIALOGUES(storyId, chapterId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách hội thoại chương ${chapterId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Tạo hội thoại mới
 */
export async function createDialogue(
  storyId: number,
  chapterId: number,
  dialogueData: DialogueRequest
): Promise<CreateDialogueResponse> {
  try {
    return await apiClient.post<CreateDialogueResponse>(
      ENDPOINTS.CHAPTER_DIALOGUES(storyId, chapterId),
      dialogueData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi tạo hội thoại mới cho chương ${chapterId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Cập nhật hội thoại
 */
export async function updateDialogue(
  storyId: number,
  chapterId: number,
  dialogueId: number,
  content: string
): Promise<ApiResponse> {
  try {
    return await apiClient.put<ApiResponse>(
      ENDPOINTS.DIALOGUE_DETAIL(storyId, chapterId, dialogueId),
      { content }
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật hội thoại ${dialogueId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Xóa hội thoại
 */
export async function deleteDialogue(
  storyId: number,
  chapterId: number,
  dialogueId: number
): Promise<ApiResponse> {
  try {
    return await apiClient.delete<ApiResponse>(
      ENDPOINTS.DIALOGUE_DETAIL(storyId, chapterId, dialogueId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi xóa hội thoại ${dialogueId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Di chuyển hội thoại
 */
export async function moveDialogue(
  storyId: number,
  chapterId: number,
  dialogueId: number,
  newOrder: number
): Promise<ApiResponse> {
  try {
    const moveData: MoveDialogueRequest = { new_order: newOrder };
    return await apiClient.put<ApiResponse>(
      ENDPOINTS.DIALOGUE_MOVE(storyId, chapterId, dialogueId),
      moveData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi di chuyển hội thoại ${dialogueId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== OUTLINES MANAGEMENT =====

/**
 * Lấy danh sách đại cương
 */
export async function getOutlines(storyId: number): Promise<OutlinesResponse> {
  try {
    return await apiClient.get<OutlinesResponse>(
      ENDPOINTS.STORY_OUTLINES(storyId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách đại cương truyện ${storyId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Lấy chi tiết đại cương
 */
export async function getOutlineDetail(
  storyId: number,
  outlineId: number
): Promise<OutlineDetailResponse> {
  try {
    return await apiClient.get<OutlineDetailResponse>(
      ENDPOINTS.OUTLINE_DETAIL(storyId, outlineId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy chi tiết đại cương ${outlineId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Tạo đại cương mới
 */
export async function createOutline(
  storyId: number,
  outlineData: OutlineRequest
): Promise<OutlineDetailResponse> {
  try {
    return await apiClient.post<OutlineDetailResponse>(
      ENDPOINTS.STORY_OUTLINES(storyId),
      outlineData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi tạo đại cương mới cho truyện ${storyId}: ${
        (error as Error).message
      }`
    );
    throw error;
  }
}

/**
 * Cập nhật đại cương
 */
export async function updateOutline(
  storyId: number,
  outlineId: number,
  outlineData: OutlineRequest
): Promise<UpdateOutlineResponse> {
  try {
    return await apiClient.put<UpdateOutlineResponse>(
      ENDPOINTS.OUTLINE_DETAIL(storyId, outlineId),
      outlineData
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật đại cương ${outlineId}: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Xóa đại cương
 */
export async function deleteOutline(
  storyId: number,
  outlineId: number
): Promise<ApiResponse> {
  try {
    return await apiClient.delete<ApiResponse>(
      ENDPOINTS.OUTLINE_DETAIL(storyId, outlineId)
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi xóa đại cương ${outlineId}: ${(error as Error).message}`
    );
    throw error;
  }
}

// ===== ACCOUNT MANAGEMENT =====

/**
 * Lấy danh sách bookmark
 */
export async function getBookmarks(): Promise<BookmarksResponse> {
  try {
    return await apiClient.get<BookmarksResponse>(ENDPOINTS.ACCOUNT_BOOKMARKS);
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách bookmark: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Lấy lịch sử xem
 */
export async function getViewHistory(): Promise<HistoryResponse> {
  try {
    return await apiClient.get<HistoryResponse>(ENDPOINTS.ACCOUNT_HISTORY);
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy lịch sử xem: ${(error as Error).message}`);
    throw error;
  }
}

// ===== CATEGORIES AND TAGS MANAGEMENT =====

/**
 * Lấy danh sách thể loại và tag
 */
export async function getCategoriesAndTags(): Promise<CategoriesAndTagsResponse> {
  try {
    return await apiClient.get<CategoriesAndTagsResponse>(ENDPOINTS.CATEGORIES);
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách thể loại và tag: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Lấy danh sách thể loại (chỉ categories)
 */
export async function getCategories(): Promise<CategoriesResponse> {
  try {
    const data = await apiClient.get<CategoriesAndTagsResponse>(
      ENDPOINTS.CATEGORIES
    );
    return {
      categories: data.mainCategories,
    };
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách thể loại: ${(error as Error).message}`
    );
    throw error;
  }
}

/**
 * Lấy danh sách tag (chỉ tags)
 */
export async function getTags(): Promise<TagsResponse> {
  try {
    const data = await apiClient.get<CategoriesAndTagsResponse>(
      ENDPOINTS.CATEGORIES
    );
    return {
      tags: data.tags,
    };
  } catch (error: unknown) {
    console.error(`Lỗi khi lấy danh sách tag: ${(error as Error).message}`);
    throw error;
  }
}
