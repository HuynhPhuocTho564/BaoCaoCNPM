/**
 * Các kiểu dữ liệu được sử dụng trong ứng dụng ChatStoryAI
 */

// ===== LEGACY TYPES (giữ lại để tương thích) =====
/**
 * Kiểu dữ liệu cho mục ví dụ
 */
export interface Example {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

/**
 * Kiểu dữ liệu cho kết quả tìm kiếm ví dụ
 */
export interface SearchResult {
  id: number;
  name: string;
  relevance: number;
}

/**
 * Kiểu dữ liệu cho cấu hình API
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

// ===== CHATSTORYAI TYPES =====

/**
 * Trạng thái của truyện/chương
 */
export type Status = "draft" | "published";

/**
 * Vai trò của nhân vật
 */
export type CharacterRole = "main" | "supporting";

/**
 * Loại hội thoại
 */
export type DialogueType = "dialogue" | "narration";

/**
 * Kiểu dữ liệu cho truyện
 */
export interface Story {
  story_id: number;
  title: string;
  description: string;
  cover_image?: string;
  status: Status;
  view_count: number;
  updated_at: string;
  main_category: string;
  tags: string[];
  favorite_count: number;
}

/**
 * Kiểu dữ liệu cho chi tiết truyện
 */
export interface StoryDetail {
  story_id: number;
  title: string;
  description: string;
  main_category: string;
  tag_ids: number[];
  tags: string[];
  favorite_count: number;
}

/**
 * Kiểu dữ liệu cho tạo truyện mới
 */
export interface CreateStoryRequest {
  title: string;
  description: string;
  mainCategoryId: string;
  tagIds: string; // JSON array string
  coverImage?: File;
}

/**
 * Kiểu dữ liệu cho chương
 */
export interface Chapter {
  chapter_id: number;
  title: string;
  summary: string;
  order_number: number;
  status: Status;
  publish_order?: number;
  created_at: string;
  dialogue_count?: number;
}

/**
 * Kiểu dữ liệu cho tạo/cập nhật chương
 */
export interface ChapterRequest {
  title: string;
  summary: string;
  status: Status;
}

/**
 * Kiểu dữ liệu cho nhân vật
 */
export interface Character {
  character_id: number;
  name: string;
  avatar_image?: string;
  description: string;
  role: CharacterRole;
  gender?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  personality?: string;
  appearance?: string;
  background?: string;
  avatar_file_id?: string;
}

/**
 * Kiểu dữ liệu cho tạo/cập nhật nhân vật
 */
export interface CharacterRequest {
  name: string;
  description: string;
  role: CharacterRole;
  gender?: string;
  birthday?: string;
  height?: number;
  weight?: number;
  personality?: string;
  appearance?: string;
  background?: string;
  avatarImage?: File;
}

/**
 * Kiểu dữ liệu cho hội thoại
 */
export interface Dialogue {
  dialogue_id: number;
  character_id: number;
  content: string;
  order_number: number;
  type: DialogueType;
}

/**
 * Kiểu dữ liệu cho tạo/cập nhật hội thoại
 */
export interface DialogueRequest {
  character_id?: number | null;
  content: string;
  order_number?: number;
  type?: DialogueType;
}

/**
 * Kiểu dữ liệu cho di chuyển hội thoại
 */
export interface MoveDialogueRequest {
  new_order: number;
}

/**
 * Kiểu dữ liệu cho đại cương
 */
export interface Outline {
  outline_id: number;
  title: string;
  description: string;
  order_number: number;
  created_at: string;
}

/**
 * Kiểu dữ liệu cho tạo/cập nhật đại cương
 */
export interface OutlineRequest {
  title: string;
  description: string;
}

// ===== API RESPONSE TYPES =====

/**
 * Response cho danh sách truyện
 */
export interface StoriesResponse {
  stories: Story[];
}

/**
 * Response cho chi tiết truyện
 */
export interface StoryDetailResponse {
  story: StoryDetail;
}

/**
 * Response cho tạo truyện
 */
export interface CreateStoryResponse {
  message: string;
  storyId: number;
}

/**
 * Response cho bookmark
 */
export interface BookmarkResponse {
  isBookmarked: boolean;
}

/**
 * Response cho toggle bookmark
 */
export interface ToggleBookmarkResponse {
  message: string;
  isBookmarked: boolean;
}

/**
 * Response cho danh sách chương
 */
export interface ChaptersResponse {
  chapters: Chapter[];
}

/**
 * Response cho chi tiết chương
 */
export interface ChapterDetailResponse {
  chapter: Chapter;
}

/**
 * Response cho danh sách nhân vật
 */
export interface CharactersResponse {
  characters: Character[];
}

/**
 * Response cho chi tiết nhân vật
 */
export interface CharacterDetailResponse {
  character: Character;
}

/**
 * Response cho danh sách hội thoại
 */
export interface DialoguesResponse {
  dialogues: Dialogue[];
}

/**
 * Response cho tạo hội thoại
 */
export interface CreateDialogueResponse {
  message: string;
  dialogue: Dialogue;
}

/**
 * Response cho danh sách đại cương
 */
export interface OutlinesResponse {
  outlines: Outline[];
}

/**
 * Response cho chi tiết đại cương
 */
export interface OutlineDetailResponse {
  outline: Outline;
}

/**
 * Response cho cập nhật đại cương
 */
export interface UpdateOutlineResponse {
  message: string;
  outline: Outline;
}

/**
 * Response cho cập nhật chương
 */
export interface UpdateChapterResponse {
  message: string;
  chapter: Chapter;
}

/**
 * Response chung cho các thao tác
 */
export interface ApiResponse {
  message: string;
}

/**
 * Kiểu dữ liệu cho bookmark item
 */
export interface BookmarkItem {
  story_id: number;
  title: string;
  cover_image?: string;
  main_category: string;
  bookmarked_at: string;
}

/**
 * Response cho danh sách bookmark
 */
export interface BookmarksResponse {
  bookmarks: BookmarkItem[];
}

/**
 * Kiểu dữ liệu cho lịch sử xem
 */
export interface HistoryItem {
  story_id: number;
  title: string;
  cover_image?: string;
  main_category: string;
  view_date: string;
}

/**
 * Response cho lịch sử xem
 */
export interface HistoryResponse {
  history: HistoryItem[];
}

// ===== CATEGORIES AND TAGS TYPES =====

/**
 * Kiểu dữ liệu cho thể loại
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Kiểu dữ liệu cho tag
 */
export interface Tag {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Response cho danh sách thể loại và tag (từ /api/categories)
 */
export interface CategoriesAndTagsResponse {
  mainCategories: Category[];
  tags: Tag[];
}

/**
 * Response cho danh sách thể loại (legacy - để tương thích)
 */
export interface CategoriesResponse {
  categories: Category[];
}

/**
 * Response cho danh sách tag (legacy - để tương thích)
 */
export interface TagsResponse {
  tags: Tag[];
}
