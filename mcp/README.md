# ChatStoryAI MCP Server

## Giới thiệu

MCP Server dành cho ChatStoryAI - cho phép tương tác với API ChatStoryAI thông qua Model Context Protocol.

## Tính năng

### 📚 Quản lý Truyện

- Lấy danh sách truyện của người dùng
- Tạo, cập nhật, xóa truyện
- Xuất bản truyện
- Quản lý ảnh bìa

### 📖 Quản lý Chương

- Lấy danh sách chương theo trạng thái
- Tạo, cập nhật, xóa chương
- Quản lý thứ tự chương

### 👥 Quản lý Nhân vật

- Tạo, cập nhật, xóa nhân vật
- Quản lý ảnh đại diện
- Phân loại vai trò (chính/phụ)

### 💬 Quản lý Hội thoại

- Tạo, cập nhật, xóa hội thoại
- Sắp xếp thứ tự hội thoại
- Phân loại loại hội thoại

### 📝 Quản lý Đại cương

- Tạo, cập nhật, xóa đại cương
- Sắp xếp theo thứ tự

### 🔖 Quản lý Bookmark & Lịch sử

- Bookmark/unbookmark truyện
- Xem lịch sử đọc

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/TomiSakae/chatstoryai-mcp.git
cd chatstoryai-mcp
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Build project:

```bash
npm run build
```

## Cấu hình API Key

### Cách 1: Biến môi trường

Tạo file `.env` trong thư mục gốc:

```env
CHATSTORYAI_API_KEY=your_api_key_here
```

### Cách 2: Biến môi trường hệ thống

```bash
# Windows
set CHATSTORYAI_API_KEY=your_api_key_here

# macOS/Linux
export CHATSTORYAI_API_KEY=your_api_key_here
```

## Cấu hình với Model Context Protocol (MCP)

### Claude Desktop

1. Mở Claude Desktop và vào Settings
2. Chọn mục Developer và bật Developer Mode
3. Tìm file cấu hình tại:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
4. Thêm cấu hình MCP vào file:

```json
{
  "mcpServers": {
    "chatstoryai-mcp": {
      "command": "node",
      "args": ["đường/dẫn/đến/build/index.js"],
      "env": {
        "CHATSTORYAI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Sử dụng

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Các công cụ có sẵn

### Stories Management

- `getStories` - Lấy danh sách truyện
- `getStoryDetail` - Lấy chi tiết truyện
- `createStory` - Tạo truyện mới
- `updateStory` - Cập nhật truyện
- `deleteStory` - Xóa truyện
- `publishStory` - Xuất bản truyện

### Bookmarks

- `checkBookmark` - Kiểm tra trạng thái bookmark
- `toggleBookmark` - Toggle bookmark

### Chapters

- `getChapters` - Lấy danh sách chương
- `getChapterDetail` - Lấy chi tiết chương
- `createChapter` - Tạo chương mới
- `updateChapter` - Cập nhật chương
- `deleteChapter` - Xóa chương

### Characters

- `getCharacters` - Lấy danh sách nhân vật
- `getCharacterDetail` - Lấy chi tiết nhân vật
- `createCharacter` - Tạo nhân vật mới
- `updateCharacter` - Cập nhật nhân vật
- `deleteCharacter` - Xóa nhân vật

### Dialogues

- `getDialogues` - Lấy danh sách hội thoại
- `createDialogue` - Tạo hội thoại mới
- `updateDialogue` - Cập nhật hội thoại
- `deleteDialogue` - Xóa hội thoại
- `moveDialogue` - Di chuyển hội thoại

### Outlines

- `getOutlines` - Lấy danh sách đại cương
- `getOutlineDetail` - Lấy chi tiết đại cương
- `createOutline` - Tạo đại cương mới
- `updateOutline` - Cập nhật đại cương
- `deleteOutline` - Xóa đại cương

### Account

- `getBookmarks` - Lấy danh sách bookmark
- `getViewHistory` - Lấy lịch sử xem

### Categories & Tags

- `getCategoriesAndTags` - Lấy danh sách thể loại và tag
- `getCategories` - Lấy danh sách thể loại
- `getTags` - Lấy danh sách tag

## Ví dụ sử dụng

### Lấy danh sách truyện

```
Sử dụng công cụ getStories để lấy tất cả truyện của bạn
```

### Tạo truyện mới

```
Sử dụng công cụ createStory với:
- title: "Tên truyện"
- description: "Mô tả truyện"
- mainCategoryId: "1"
- tagIds: "[1,2,3]"
```

### Tạo nhân vật

```
Sử dụng công cụ createCharacter với:
- storyId: ID truyện
- name: "Tên nhân vật"
- description: "Mô tả nhân vật"
- role: "main" hoặc "supporting"
```

## Lỗi thường gặp

### 401 Unauthorized

- Kiểm tra API key có đúng không
- Đảm bảo API key được cấu hình trong biến môi trường

### 404 Not Found

- Kiểm tra ID truyện/chương/nhân vật có tồn tại không
- Đảm bảo bạn có quyền truy cập vào tài nguyên

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
